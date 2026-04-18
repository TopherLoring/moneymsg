import { and, eq, lte, sql } from "drizzle-orm";
import { db } from "../infrastructure/db";
import { paymentLinks, transactions, wallets } from "../infrastructure/db/schema";
import { SWEEP_INTERVAL_MS } from "../config/constants";
import { logger } from "../infrastructure/logging/logger";

async function sweepExpiredIntents() {
  const expired = await db
    .select({
      id: transactions.id,
      walletId: transactions.walletId,
      net: transactions.netAmount,
      linkId: paymentLinks.id,
    })
    .from(transactions)
    .leftJoin(paymentLinks, eq(paymentLinks.transactionId, transactions.id))
    .where(
      and(
        eq(transactions.status, "pending"),
        eq(transactions.transactionType, "p2p_send"),
        lte(transactions.expiresAt, new Date()),
      ),
    )
    .for("update", { skipLocked: true });

  for (const intent of expired) {
    await db.transaction(async (tx) => {
      await tx
        .update(wallets)
        .set({
          availableBalance: sql`available_balance + ${intent.net}`,
          lockedBalance: sql`locked_balance - ${intent.net}`,
        })
        .where(eq(wallets.id, intent.walletId));
      await tx
        .update(transactions)
        .set({
          status: "reversed",
          lifecycle: "reversed",
          failureReason: "Intent expired after 24 hours",
          completedAt: new Date(),
        })
        .where(eq(transactions.id, intent.id));

      if (intent.linkId) {
        await tx
          .update(paymentLinks)
          .set({ status: "reversed" })
          .where(eq(paymentLinks.id, intent.linkId));
      }
    });
  }
}

async function runSweepExpiredIntents() {
  try {
    await sweepExpiredIntents();
  } catch (err) {
    logger.error({ err }, "intent_sweeper_error");
  }
}

void runSweepExpiredIntents();
setInterval(() => {
  void runSweepExpiredIntents();
}, SWEEP_INTERVAL_MS);
  }
}

sweepExpiredIntents();
setInterval(sweepExpiredIntents, SWEEP_INTERVAL_MS);
