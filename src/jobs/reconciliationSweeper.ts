import { env } from "../config/env";
import { SWEEP_INTERVAL_MS } from "../config/constants";
import { findStaleEvents, reconcileWebhookEvent, finalizeWebhookEvent } from "../modules/reconciliation/service";
import { db } from "../infrastructure/db";
import { webhookEvents } from "../infrastructure/db/schema";
import { eq, sql } from "drizzle-orm";
import { logger } from "../infrastructure/logging/logger";

async function sweepStaleWebhookEvents() {
  const stale = await findStaleEvents(30);
  for (const event of stale) {
    try {
      if (!event.providerRef) {
        await finalizeWebhookEvent(event.id);
        continue;
      }

      if (event.reconciliationState === "logged") {
        // Can't retry without knowing the outcome — increment retry count and flag
        const retryCount = Number(event.retryCount ?? "0") + 1;
        if (retryCount >= 5) {
          await db
            .update(webhookEvents)
            .set({ lastError: "max_retries_exceeded", retryCount: String(retryCount) })
            .where(eq(webhookEvents.id, event.id));
          logger.warn({ eventId: event.id }, "webhook_event_max_retries");
        } else {
          await db
            .update(webhookEvents)
            .set({ retryCount: String(retryCount) })
            .where(eq(webhookEvents.id, event.id));
        }
      }

      if (event.reconciliationState === "reconciled") {
        await finalizeWebhookEvent(event.id);
      }
    } catch (err) {
      logger.error({ err, eventId: event.id }, "reconciliation_sweeper_error");
      await db
        .update(webhookEvents)
        .set({ lastError: err instanceof Error ? err.message : "unknown" })
        .where(eq(webhookEvents.id, event.id));
    }
  }
}

if (env.NODE_ENV !== "test") { sweepStaleWebhookEvents();  }
