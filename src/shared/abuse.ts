// MoneyMsg — Abuse Throttling
// v1.0.0 — 2026.04.17

import { and, eq, gte, sql } from "drizzle-orm";
import { db as defaultDb } from "../infrastructure/db";
import { AppError } from "./errors";

/**
 * In-memory sliding-window counter for lightweight abuse detection.
 * For production scale, swap to Redis-backed counters.
 */
const windowCounters = new Map<string, { count: number; windowStart: number }>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_CLEANUP_SIZE = 10_000;

function getWindowCount(key: string): number {
  const now = Date.now();
  const entry = windowCounters.get(key);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    return 0;
  }
  return entry.count;
}

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

/** Max reminders/nudges a single user can send per hour */
const MAX_NUDGES_PER_HOUR = 20;

/** Max requests targeting a single recipient per hour */
const MAX_REQUESTS_PER_RECIPIENT_PER_HOUR = 10;

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

/**
 * Assert the sender hasn't spammed nudges.
 */
export function assertNudgeNotAbusive(senderUserId: string): void {
  const count = incrementWindow(`nudge:${senderUserId}`);
  if (count > MAX_NUDGES_PER_HOUR) {
    throw new AppError(
      "Too many reminders sent. Please wait before sending more.",
      "CONFLICT",
      429,
    );
  }
}

/**
 * Assert a recipient isn't being targeted with excessive requests.
 */
export function assertRecipientNotSpammed(
  senderUserId: string,
  recipientIdentifier: string,
): void {
  const key = `req-to:${senderUserId}:${recipientIdentifier}`;
  const count = incrementWindow(key);
  if (count > MAX_REQUESTS_PER_RECIPIENT_PER_HOUR) {
    throw new AppError(
      "Too many requests sent to this recipient. Please wait.",
      "CONFLICT",
      429,
    );
  }
}
