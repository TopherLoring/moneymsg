// MoneyMsg — Server Entry Point
// v1.0.0 — 2026.04.17

import Fastify from "fastify";
import { transferRoutes } from "../modules/transfer/http/routes";
import { plaidRoutes } from "../modules/plaid/http/routes";
import { walletRoutes } from "../modules/wallet/http/routes";
import { kycRoutes } from "../modules/kyc/http/routes";
import { webhookRoutes } from "../modules/webhooks/http/routes";
import { requestRoutes } from "../modules/request/http/routes";
import { statusRoutes } from "../modules/status/http/routes";
import { port, env } from "../config/env";
import { pool } from "../infrastructure/db";
import "../jobs/intentSweeper";
import "../jobs/requestSweeper";
import "../jobs/reconciliationSweeper";
if (process.env.DISABLE_SWEEPERS !== "true") { require("../jobs/intentSweeper"); }
if (process.env.DISABLE_SWEEPERS !== "true") { require("../jobs/requestSweeper"); }
if (process.env.DISABLE_SWEEPERS !== "true") { require("../jobs/reconciliationSweeper"); }
import { logger } from "../infrastructure/logging/logger";
import { withRequestContext, generateRequestId } from "../shared/requestContext";
import { registerRateLimiting } from "../shared/rateLimit";

const app = Fastify({
  loggerInstance: logger as any,
  requestIdHeader: "x-request-id",
  genReqId: () => generateRequestId(),
});

// ─── Correlation ID context ────────────────────────────────────────
app.addHook("onRequest", (request, _reply, done) => {
  withRequestContext({ requestId: request.id as string, startedAt: Date.now() }, done);
});

// Attach correlation ID to every response header
app.addHook("onSend", async (request, reply, _payload) => {
  reply.header("x-request-id", request.id);
  return _payload;
});

// ─── Rate limiting ─────────────────────────────────────────────────
registerRateLimiting(app).then(() => {
  // ─── Routes ────────────────────────────────────────────────────────
  if (env.PLAID_ENABLED) app.register(plaidRoutes);
  app.register(kycRoutes);
  app.register(walletRoutes);
  app.register(transferRoutes);
  app.register(requestRoutes);
  app.register(statusRoutes);
  app.register(webhookRoutes);

  app.get("/health", async () => ({ ok: true }));

  app.get("/health/live", async (_request, reply) => {
    return reply.send({ status: "live" });
  });

  app.get("/health/ready", async (_request, reply) => {
    try {
      await pool.query("SELECT 1");
      return reply.send({ status: "ready" });
    } catch {
      return reply.status(503).send({ status: "not_ready", reason: "db" });
    }
  });

  // ─── Start ─────────────────────────────────────────────────────────
  app.listen({ port, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    app.log.info(`Server listening at ${address}`);
  });
});
