// MoneyMsg — Authorization Middleware
// v1.0.0 — 2026.04.17

import { FastifyRequest, FastifyReply } from "fastify";
import { verifyToken, TokenRole } from "./session";
import { AppError } from "./errors";
import { setContextField } from "./requestContext";

// ─── Fastify request augmentation ──────────────────────────────────
declare module "fastify" {
  interface FastifyRequest {
    /** Authenticated caller identity — set by requireAuth */
    caller?: {
      sub: string;
      role: TokenRole;
    };
  }
}

// ─── Core auth hook ────────────────────────────────────────────────

/**
 * Fastify preHandler: extracts and verifies the Bearer token.
 * Sets `request.caller` and populates the request context.
 */
export async function requireAuth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const header = request.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError("Missing or malformed Authorization header", "UNAUTHORIZED", 401);
  }

  const token = header.slice(7);
  const decoded = verifyToken(token, "access");

  request.caller = { sub: decoded.sub, role: decoded.role };
  setContextField("userId", decoded.sub);
  setContextField("role", decoded.role);
}

// ─── Role enforcement ──────────────────────────────────────────────

/** Role hierarchy for permission checks */
const ROLE_LEVEL: Record<TokenRole, number> = {
  user: 0,
  support: 1,
  admin: 2,
  service: 3,
};

/**
 * Returns a preHandler that requires the caller to have at least
 * the specified role level.
 *
 * Usage: `{ preHandler: [requireAuth, requireRole("admin")] }`
 */
export function requireRole(minRole: TokenRole) {
  return async function (request: FastifyRequest, _reply: FastifyReply): Promise<void> {
    if (!request.caller) {
      throw new AppError("Authentication required", "UNAUTHORIZED", 401);
    }
    if (ROLE_LEVEL[request.caller.role] < ROLE_LEVEL[minRole]) {
      throw new AppError("Insufficient permissions", "UNAUTHORIZED", 403);
    }
  };
}

// ─── Ownership enforcement ─────────────────────────────────────────

/**
 * Verifies that the authenticated user is acting on their own resource,
 * OR has elevated role (support/admin/service).
 *
 * @param request — Fastify request with `caller` populated
 * @param targetUserId — the user ID being acted upon
 */
export function assertOwnershipOrElevated(request: FastifyRequest, targetUserId: string): void {
  if (!request.caller) {
    throw new AppError("Authentication required", "UNAUTHORIZED", 401);
  }

  const isOwner = request.caller.sub === targetUserId;
  const isElevated = ROLE_LEVEL[request.caller.role] >= ROLE_LEVEL["support"];

  if (!isOwner && !isElevated) {
    throw new AppError("Cannot act on another user's resource", "UNAUTHORIZED", 403);
  }
}
