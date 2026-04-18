// MoneyMsg — JWT Session Utilities
// v1.0.0 — 2026.04.17

import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "./errors";

export type TokenRole = "user" | "support" | "admin" | "service";

export interface TokenPayload {
  /** Subject — user or service ID */
  sub: string;
  /** Role */
  role: TokenRole;
  /** Token type */
  type: "access" | "refresh";
}

interface DecodedToken extends TokenPayload {
  iat: number;
  exp: number;
  iss: string;
}

/** Issue a refresh token */
export function issueRefreshToken(sub: string, role: TokenRole): string {
  return jwt.sign(
    { sub, role, type: "refresh" } satisfies TokenPayload,
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_REFRESH_TTL_SECONDS,
/** Issue an access token */
export function issueAccessToken(sub: string, role: TokenRole): string {
  return jwt.sign(
    { sub, role, type: "access" } satisfies TokenPayload,
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_ACCESS_TTL_SECONDS,
      issuer: env.JWT_ISSUER,
    },
  );
}

/** Issue a refresh token */
export function issueRefreshToken(sub: string, role: TokenRole): string {
  return jwt.sign(
    { sub, role, type: "refresh" } satisfies TokenPayload,
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_REFRESH_TTL_SECONDS,
      issuer: env.JWT_ISSUER,
    },
  );
}

/** Verify and decode a token. Throws AppError on failure. */
export function verifyToken(token: string, expectedType: "access" | "refresh" = "access"): DecodedToken {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      issuer: env.JWT_ISSUER,
    }) as DecodedToken;

    if (decoded.type !== expectedType) {
      throw new AppError(`Expected ${expectedType} token`, "UNAUTHORIZED", 401);
    }

    return decoded;
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (err instanceof jwt.TokenExpiredError) {
      throw new AppError("Token expired", "UNAUTHORIZED", 401);
    }
    if (err instanceof jwt.JsonWebTokenError) {
      throw new AppError("Invalid token", "UNAUTHORIZED", 401);
    }
    throw new AppError("Authentication failed", "UNAUTHORIZED", 401);
  }
}
