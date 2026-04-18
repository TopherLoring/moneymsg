import { and, eq, lte, ne, sql } from "drizzle-orm";
import { db } from "../../infrastructure/db";
import { transactions, wallets, webhookEvents } from "../../infrastructure/db/schema";
import { logger } from "../../infrastructure/logging/logger";

type Outcome = "success" | "failed";

/**
 * Advance a webhook event through the reconciliation state machine.
 *
 * logged      — event received and persisted, not yet matched to a transaction
 * reconciled  — matched to a transaction and outcome applied
 * finalized   — terminal state; no further processing needed
 */
export async function reconcileWebhookEvent(opts: {
  eventId: string;
  providerRef: string;
  outcome: Outcome;
  reason?: string;
}): Promise<void> {
  const { eventId, providerRef, outcome, reason } = opts;

  const matching = await db
    .select()
    .from(transactions)
    .where(eq(transactions.providerRef, providerRef));

  if (!matching.length) {
    await db
      .update(webhookEvents)
      .set({ lastError: "no_matching_transaction" })
      .where(eq(webhookEvents.id, eventId));
    return;
  }

  for (const tx of matching) {
    // Idempotent — skip already-terminal transactions
    if (tx.status === "completed" && outcome === "success") continue;
    if (tx.status === "failed" && outcome === "failed") continue;

    try {
      await db.transaction(async (trx) => {
        if (outcome === "success") {
          await trx
            .update(transactions)
            .set({ status: "completed", lifecycle: "completed", completedAt: new Date(), failureReason: null })
            .where(eq(transactions.id, tx.id));
        } else {
          if (tx.transactionType === "load") {
            await trx
              .update(wallets)
              .set({ availableBalance: sql`available_balance - ${tx.netAmount}` })
              .where(eq(wallets.id, tx.walletId));
          } else if (tx.transactionType === "cashout") {
            await trx
              .update(wallets)
              .set({ availableBalance: sql`available_balance + ${tx.grossAmount}` })
              .where(eq(wallets.id, tx.walletId));
          }
          await trx
            .update(transactions)
            .set({ status: "failed", lifecycle: "failed", failureReason: reason ?? "provider_failed", completedAt: new Date() })
            .where(eq(transactions.id, tx.id));
        }
      });
    } catch (err) {
      logger.error({ err, eventId, txId: tx.id }, "reconciliation_tx_error");
      throw err;
    }
  }

  await db
    .update(webhookEvents)
    .set({
      reconciliationState: "reconciled",
      reconciledAt: new Date(),
    })
    .where(eq(webhookEvents.id, eventId));
}

export async function finalizeWebhookEvent(eventId: string): Promise<void> {
  await db
    .update(webhookEvents)
    .set({
      reconciliationState: "finalized",
      finalizedAt: new Date(),
      processed: true,
      processedAt: new Date(),
    })
    .where(eq(webhookEvents.id, eventId));
}

/** Find events stuck in 'logged' or 'reconciled' state older than cutoffMinutes. */
export async function findStaleEvents(cutoffMinutes = 30) {
  return db
    .select()
    .from(webhookEvents)
    .where(
      and(
        ne(webhookEvents.reconciliationState, "finalized"),
        lte(webhookEvents.createdAt, sql`now() - interval '${cutoffMinutes} minutes'`),
      ),
    );
}
