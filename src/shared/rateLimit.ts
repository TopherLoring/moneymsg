// MoneyMsg — Rate Limiting Configuration
// v1.0.0 — 2026.04.17

import rateLimit from "@fastify/rate-limit";
import { FastifyInstance, FastifyRequest } from "fastify";

/**
 * Register global rate limiting and route-specific overrides.
 *
 * Global: 100 req/min per IP (generous baseline).
 * Sensitive routes get tighter limits registered inline via route options.
 */
export async function registerRateLimiting(app: FastifyInstance): Promise<void> {
  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
    keyGenerator: (request: FastifyRequest) => {
      // Use authenticated user ID if available, fall back to IP
      return request.caller?.sub ?? request.ip;
    },
    errorResponseBuilder: (_request, context) => ({
      error: "Rate limit exceeded",
      code: "RATE_LIMITED",
      retryAfter: Math.ceil(context.ttl / 1000),
    }),
  });
}

// ─── Route-level limit presets ─────────────────────────────────────
// Use these as route-level config overrides:
//   { config: { rateLimit: RATE_LIMITS.auth } }

export const RATE_LIMITS = {
  /** Auth-sensitive: login, token refresh */
  auth: { max: 10, timeWindow: "1 minute" },

  /** KYC submission — very tight, one per user per attempt */
  kyc: { max: 5, timeWindow: "5 minutes" },

  /** Plaid linking — tight, prevents funding-source spam */
  plaid: { max: 10, timeWindow: "5 minutes" },

  /** Payment creation — moderate */
  transact: { max: 30, timeWindow: "1 minute" },

  /** Request/reminder creation — prevent spam */
  requestCreate: { max: 20, timeWindow: "1 minute" },

  /** Status/read endpoints — more generous */
  read: { max: 60, timeWindow: "1 minute" },

  /** Intent parsing — moderate (keyboard-driven, can be chatty) */
  intent: { max: 40, timeWindow: "1 minute" },
} as const;
