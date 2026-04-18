// MoneyMsg — Server Entry Point
// v1.0.0 — 2026.04.17

import Fastify from "fastify";
import { transferRoutes } from "./routes/transfer";
import { plaidRoutes } from "./routes/plaid";
import { walletRoutes } from "./routes/wallet";
import { kycRoutes } from "./routes/kyc";
import { webhookRoutes } from "./routes/webhooks";
import { requestRoutes } from "./routes/request";
import { statusRoutes } from "./routes/status";
import { port, env } from "./lib/env";
import { logger } from "./lib/logger";
import { withRequestContext, generateRequestId } from "./lib/requestContext";
import { registerRateLimiting } from "./lib/rateLimit";

const app = Fastify({
  logger: logger as any,
  requestIdHeader: "x-request-id",
  genReqId: () => generateRequestId(),
});

// ─── Correlation ID context ────────────────────────────────────────
app.addHook("onRequest", async (request, _reply) => {
  const requestId = request.id as string;
  // Wrap the entire request lifecycle in an async context
  // so downstream code can call getRequestContext()
  (request as any)._ctxRequestId = requestId;
});

// Attach correlation ID to every response header
app.addHook("onSend", async (request, reply, _payload) => {
  reply.header("x-request-id", request.id);
  return _payload;
});

// ─── Rate limiting ─────────────────────────────────────────────────
registerRateLimiting(app).then(() => {
  // ─── Routes ────────────────────────────────────────────────────────
  app.register(plaidRoutes);
  app.register(kycRoutes);
  app.register(walletRoutes);
  app.register(transferRoutes);
  app.register(requestRoutes);
  app.register(statusRoutes);
  app.register(webhookRoutes);

  app.get("/health", async () => ({ ok: true }));

  // ─── Start ─────────────────────────────────────────────────────────
  app.listen({ port, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    app.log.info(`Server listening at ${address}`);
  });
});
