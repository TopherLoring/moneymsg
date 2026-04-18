import { FastifyInstance } from "fastify";
import crypto from "crypto";
import { and, eq } from "drizzle-orm";
import { db } from "../../../infrastructure/db";
import { webhookEvents } from "../../../infrastructure/db/schema";
import { toErrorResponse } from "../../../shared/errors";
import { env } from "../../../config/env";
import { getCorrelationMeta, setContextField } from "../../../shared/requestContext";
import { reconcileWebhookEvent, finalizeWebhookEvent } from "../../reconciliation/service";

type SignatureConfig = {
  header: string;
  secret: string;
  timestampHeader?: string;
  encoding?: "base64" | "hex";
  encoding?: crypto.BinaryToTextEncoding;
};

function verifyHmac(body: string, signature: string | undefined, secret: string, timestamp?: string): boolean {
  if (!signature) return false;
  const hmac = crypto.createHmac("sha256", secret);
  if (timestamp) {
    hmac.update(timestamp);
  }
  hmac.update(body, "utf8");
  const digest = hmac.digest("hex");

  const digestBuf = Buffer.from(digest, "utf8");
  const sigBuf = Buffer.from(signature, "utf8");
  if (digestBuf.length !== sigBuf.length) return false;

  return crypto.timingSafeEqual(digestBuf, sigBuf);
}

export async function webhookRoutes(app: FastifyInstance) {
  app.removeAllContentTypeParsers();
  app.addContentTypeParser("*", { parseAs: "string" }, (req, body, done) => {
  app.addContentTypeParser("*/*", { parseAs: "string" }, (req, body, done) => {
  app.addContentTypeParser("*/*", { parseAs: "string", bodyLimit: 1048576 }, (req, body, done) => {
    done(null, body);
  });

  app.addHook("onRequest", async (request, reply) => {
    const header = request.headers["x-webhook-secret"] as string | undefined;
    if (!header || header !== env.WEBHOOK_SHARED_SECRET) {
      return reply.status(401).send({ error: "Unauthorized webhook", code: "UNAUTHORIZED" });
    }
  });

  const providers: Record<string, SignatureConfig> = {
    tabapay: {
      header: "x-tabapay-signature",
      secret: env.TABAPAY_WEBHOOK_SECRET,
      timestampHeader: "x-tabapay-timestamp",
    },
    dwolla: {
      header: "x-dwolla-signature",
      secret: env.DWOLLA_WEBHOOK_SECRET,
      timestampHeader: "x-request-timestamp",
    },
  };

  for (const provider of Object.keys(providers)) {
    app.post(`/api/v1/webhooks/${provider}`, async (request, reply) => {
      try {
        const config = providers[provider];
        const raw = request.body as string;
        const signature = request.headers[config.header] as string | undefined;
        const timestamp = config.timestampHeader
          ? (request.headers[config.timestampHeader] as string | undefined)
          : undefined;

        if (timestamp && Math.abs(Date.now() - Number(timestamp) * 1000) > env.WEBHOOK_MAX_SKEW_SECONDS * 1000) {
          return reply.status(401).send({ error: "Stale webhook", code: "UNAUTHORIZED" });
        }

        const ok = verifyHmac(raw || "", signature, config.secret, timestamp);
        const ok = verifyHmac(raw || "", signature, config.secret, undefined);

        const ok = verifyHmac(raw || "", signature, config.secret, "");
        const ok = verifyHmac(raw || "", signature, config.secret);
        if (!ok) return reply.status(401).send({ error: "Invalid signature", code: "UNAUTHORIZED" });

        const parsed = JSON.parse(raw || "{}");
        const event = normalizeEvent(provider, parsed);
        if (!event) return reply.send({ ignored: true });

        let loggedId: string | undefined;
        const existing = await db
          .select({ id: webhookEvents.id, processed: webhookEvents.processed })
          .from(webhookEvents)
          .where(
            and(
              eq(webhookEvents.provider, provider),
              eq(webhookEvents.providerRef, event.providerRef),
              eq(webhookEvents.eventType, event.eventType),
            ),
          );

        if (existing.length) {
          const ex = existing[0];
          if (ex.processed) {
            return reply.send({ received: true, duplicate: true });
          }
          loggedId = ex.id;
        } else {
          const [logged] = await db
            .insert(webhookEvents)
            .values({
              provider,
              eventType: event.eventType,
              providerRef: event.providerRef,
              payload: raw || "",
              correlationRequestId: getCorrelationMeta().requestId,
            })
            .returning({ id: webhookEvents.id });
          loggedId = logged.id;
        }

        setContextField("providerCorrelationId", event.providerRef);

        const [logged] = await db
          .insert(webhookEvents)
          .values({
            provider,
            eventType: event.eventType,
            providerRef: event.providerRef,
            payload: raw || "",
            correlationRequestId: getCorrelationMeta().requestId,
          })
          .onConflictDoNothing({ target: [webhookEvents.provider, webhookEvents.providerRef, webhookEvents.eventType] })
          .returning({ id: webhookEvents.id });

        if (!logged) {
          return reply.send({ received: true, duplicate: true });
        }

        // Fire-and-forget background processing
        (async () => {
          try {
            await reconcileWebhookEvent({
              eventId: logged.id,
              providerRef: event.providerRef,
              outcome: event.outcome,
              reason: event.reason,
            });
            await finalizeWebhookEvent(logged.id);
          } catch (err) {
            // Error is logged by reconcileWebhookEvent internally
          }
        })();

        return reply.send({ received: true });
      } catch (err) {
        const { status, body } = toErrorResponse(err);
        return reply.status(status).send(body);
      }
    });
  }
}

type Outcome = "success" | "failed";

function normalizeEvent(
  provider: string,
  payload: Record<string, any>,
): { providerRef: string; outcome: Outcome; reason?: string; eventType: string } | null {
  if (provider === "tabapay") {
    const providerRef = payload.id ?? payload.transactionId;
    const status = String(payload.status || "").toLowerCase();
    const successStatuses = new Set(["succeeded", "settled", "completed", "success"]);
    const failedStatuses = new Set(["failed", "declined", "reversed", "error", "timeout", "timed_out"]);
    if (!providerRef || (!successStatuses.has(status) && !failedStatuses.has(status))) return null;
    return {
      providerRef,
      outcome: successStatuses.has(status) ? "success" : "failed",
      reason: payload.status,
      eventType: `tabapay.${status}`,
    };
  }
  if (provider === "dwolla") {
    const providerRef = payload.resourceId || payload.resource?.id || payload.id;
    const topic = String(payload.topic || "").toLowerCase();
    if (!providerRef || !topic) return null;
    if (topic.includes("transfer_completed"))
      return { providerRef, outcome: "success", eventType: topic };
    if (topic.includes("transfer_failed") || topic.includes("transfer_cancelled"))
      return { providerRef, outcome: "failed", reason: topic, eventType: topic };
    return null;
  }
  return null;
}
