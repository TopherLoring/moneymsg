import { FastifyInstance } from "fastify";
import crypto from "crypto";
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { transactions, wallets } from "../db/schema";
import { toErrorResponse } from "../lib/errors";
import { sql } from "drizzle-orm";
import { webhookEvents } from "../db/schema";

type SignatureConfig = {
  header: string;
  secretEnv: string;
  timestampHeader?: string;
};

function verifyHmac(body: string, signature: string | undefined, secret: string | undefined, timestamp?: string): boolean {
  if (!secret || !signature) return false;
  const hmac = crypto.createHmac("sha256", secret);
  if (timestamp) {
    hmac.update(timestamp);
  }
  hmac.update(body, "utf8");
  const digest = hmac.digest("hex");

  // Guard: timingSafeEqual requires equal-length buffers.
  // Mismatched lengths → reject immediately (not a timing leak for length).
  const digestBuf = Buffer.from(digest, "utf8");
  const sigBuf = Buffer.from(signature, "utf8");
  if (digestBuf.length !== sigBuf.length) return false;

  return crypto.timingSafeEqual(digestBuf, sigBuf);
}

export async function webhookRoutes(app: FastifyInstance) {
  app.addContentTypeParser("*/*", { parseAs: "string" }, (req, body, done) => {
    done(null, body);
  });

  // Minimal auth for webhooks: optionally require shared secret if set
  app.addHook("onRequest", async (request, reply) => {
    const shared = process.env.WEBHOOK_SHARED_SECRET;
    if (!shared) return;
    const header = request.headers["x-webhook-secret"] as string | undefined;
    if (!header || header !== shared) {
      return reply.status(401).send({ error: "Unauthorized webhook", code: "UNAUTHORIZED" });
    }
  });

  const providers: Record<string, SignatureConfig> = {
    tabapay: { header: "x-tabapay-signature", secretEnv: "TABAPAY_WEBHOOK_SECRET", timestampHeader: "x-tabapay-timestamp" },
    dwolla: { header: "x-dwolla-signature", secretEnv: "DWOLLA_WEBHOOK_SECRET", timestampHeader: "x-request-timestamp" },
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
        const secret = process.env[config.secretEnv];

        const tolerance = Number(process.env.WEBHOOK_MAX_SKEW_SECONDS ?? 300);
        if (timestamp && Math.abs(Date.now() - Number(timestamp) * 1000) > tolerance * 1000) {
          return reply.status(401).send({ error: "Stale webhook", code: "UNAUTHORIZED" });
        }

        const ok = verifyHmac(raw || "", signature, secret, timestamp);
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
            })
            .returning({ id: webhookEvents.id });
          loggedId = logged.id;
        }

        await reconcileTransaction(event.providerRef, event.outcome, event.reason);

        if (loggedId) {
          await db
            .update(webhookEvents)
            .set({ processed: true, processedAt: new Date() })
            .where(eq(webhookEvents.id, loggedId));
        }

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

async function reconcileTransaction(providerRef: string, outcome: Outcome, reason?: string) {
  const matching = await db
    .select()
    .from(transactions)
    .where(and(eq(transactions.providerRef, providerRef)));

  for (const tx of matching) {
    // Idempotent reconciliation
    if (tx.status === "completed" && outcome === "success") continue;
    if (tx.status === "failed" && outcome === "failed") continue;

    await db.transaction(async (trx) => {
      if (outcome === "success") {
        await trx
          .update(transactions)
          .set({ status: "completed", lifecycle: "completed", completedAt: new Date(), failureReason: null })
          .where(eq(transactions.id, tx.id));
        return;
      }

      // outcome failed
      if (tx.transactionType === "load") {
        await trx
          .update(wallets)
          .set({ availableBalance: sql`available_balance - ${tx.netAmount}` })
          .where(eq(wallets.id, tx.walletId));
      } else if (tx.transactionType === "cashout") {
        await trx
          .update(wallets)
          .set({ availableBalance: sql`available_balance + ${tx.grossAmount}` })
          .where(eq(wallets.id, tx.walletId));
      }

      await trx
        .update(transactions)
        .set({
          status: "failed",
          lifecycle: "failed",
          failureReason: reason ?? "provider_failed",
          completedAt: new Date(),
        })
        .where(eq(transactions.id, tx.id));
    });
  }
}
