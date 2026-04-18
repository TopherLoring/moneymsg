// MoneyMsg — Auth Entry Point
// v1.0.0 — 2026.04.17
//
// This module re-exports the JWT-based auth middleware from authz.ts.
// The old requireApiKey() is preserved ONLY for webhook shared-secret auth.
// All route-level auth should use requireAuth + requireRole/assertOwnershipOrElevated.

import { FastifyRequest } from "fastify";
import { AppError } from "./errors";

export { requireAuth, requireRole, assertOwnershipOrElevated } from "./authz";

/**
 * Webhook-only: validates the shared secret header.
 * NOT for route-level user auth — use requireAuth instead.
 */
export function requireWebhookSecret(request: FastifyRequest): void {
  const shared = process.env.WEBHOOK_SHARED_SECRET;
  if (!shared) return;
  const header = request.headers["x-webhook-secret"] as string | undefined;
  if (!header || header !== shared) {
    throw new AppError("Unauthorized webhook", "UNAUTHORIZED", 401);
  }
}
