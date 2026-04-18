// MoneyMsg — Abuse Throttling
// v1.0.0 — 2026.04.17

import { AppError } from "./errors";

/**
 * In-memory sliding-window counter for lightweight abuse detection.
 * For production scale, swap to Redis-backed counters.
 */
const windowCounters = new Map<string, { count: number; windowStart: number }>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_CLEANUP_SIZE = 10_000;

function incrementWindow(key: string): number {
  const now = Date.now();
  const entry = windowCounters.get(key);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    windowCounters.set(key, { count: 1, windowStart: now });
    // Periodic cleanup to prevent unbounded memory growth
    if (windowCounters.size > MAX_CLEANUP_SIZE) {
      for (const [k, v] of windowCounters) {
        if (now - v.windowStart > WINDOW_MS) windowCounters.delete(k);
      }
    }
    return 1;
  }

  entry.count += 1;
  return entry.count;
}

// ─── Abuse checks ──────────────────────────────────────────────────

/** Max payment requests a single user can create per hour */
const MAX_REQUESTS_PER_HOUR = 50;

/**
 * Assert the sender hasn't exceeded request creation limits.
 * Call before creating a new payment request.
 */
export function assertRequestNotAbusive(senderUserId: string): void {
  const count = incrementWindow(`req:${senderUserId}`);
  if (count > MAX_REQUESTS_PER_HOUR) {
    throw new AppError(
      "Too many payment requests created. Please wait before sending more.",
      "CONFLICT",
      429,
    );
  }
}
