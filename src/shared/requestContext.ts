// MoneyMsg — Request Context (Correlation IDs)
// v1.0.0 — 2026.04.17

import { AsyncLocalStorage } from "async_hooks";
import crypto from "crypto";

export interface RequestContext {
  /** Unique ID for the inbound HTTP request */
  requestId: string;
  /** Linked transaction ID once known */
  transactionId?: string;
  /** Provider-assigned correlation/reference ID */
  providerCorrelationId?: string;
  /** Authenticated user ID (set after auth) */
  userId?: string;
  /** Auth role */
  role?: string;
  /** Timestamp of request start */
  startedAt: number;
}

const store = new AsyncLocalStorage<RequestContext>();

/** Generate a compact, unique request ID */
export function generateRequestId(): string {
  return `req_${crypto.randomBytes(12).toString("base64url")}`;
}

/** Run a function within a new request context */
export function withRequestContext<T>(ctx: RequestContext, fn: () => T): T {
  return store.run(ctx, fn);
}

/** Get the current request context (or undefined outside a request) */
export function getRequestContext(): RequestContext | undefined {
  return store.getStore();
}

/** Set a field on the current context. No-op if no active context. */
export function setContextField<K extends keyof RequestContext>(
  key: K,
  value: RequestContext[K],
): void {
  const ctx = store.getStore();
  if (ctx) {
    ctx[key] = value;
  }
}
