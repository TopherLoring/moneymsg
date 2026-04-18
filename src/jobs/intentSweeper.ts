import { env } from "../config/env";
import { and, eq, lte, sql } from "drizzle-orm";
import { Decimal } from "decimal.js";
import { logger } from "../infrastructure/logging/logger";
import { pool } from "../infrastructure/db";
import { and, eq, inArray, lte, sql } from "drizzle-orm";
import { db } from "../infrastructure/db";
import { paymentLinks, transactions, wallets } from "../infrastructure/db/schema";
import { SWEEP_INTERVAL_MS } from "../config/constants";

async function sweepExpiredIntents() {
  await db.transaction(async (tx) => {
    const expired = await tx
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

    if (expired.length === 0) return;

    const walletUpdates = new Map<string, Decimal>();
    const txIds: string[] = [];
    const linkIds: string[] = [];
    const seenTxIds = new Set<string>();

    for (const intent of expired) {
      if (intent.linkId) {
        linkIds.push(intent.linkId);
      }

      if (seenTxIds.has(intent.id)) continue;
      seenTxIds.add(intent.id);

      txIds.push(intent.id);
      const current = walletUpdates.get(intent.walletId) || new Decimal(0);
      walletUpdates.set(intent.walletId, current.plus(intent.net));
    }

    // Sort wallet IDs to enforce deterministic lock order and prevent deadlocks
    const sortedWalletIds = Array.from(walletUpdates.keys()).sort();

    // Update wallets
    for (const walletId of sortedWalletIds) {
      const netTotal = walletUpdates.get(walletId)!;
      await tx
        .update(wallets)
        .set({
          availableBalance: sql`available_balance + ${netTotal.toFixed(4)}`,
          lockedBalance: sql`locked_balance - ${netTotal.toFixed(4)}`,
        })
        .where(eq(wallets.id, walletId));
    }

    // Update transactions
    await tx
      .update(transactions)
      .set({
        status: "reversed",
        lifecycle: "reversed",
        failureReason: "Intent expired after 24 hours",
        completedAt: new Date(),
      })
      .where(inArray(transactions.id, txIds));

    // Update payment links
    if (linkIds.length > 0) {
      await tx
        .update(paymentLinks)
        .set({ status: "reversed" })
        .where(inArray(paymentLinks.id, linkIds));
    }
  });
}


let isShuttingDown = false;
let isSweeping = false;

async function runSweeper() {
  if (isShuttingDown || isSweeping) return;
  isSweeping = true;
  try {
    await sweepExpiredIntents();
  } catch (error) {
    logger.error({ error }, "Error during intent sweep");
  } finally {
    isSweeping = false;
  }
}

// Initial run
runSweeper();

// Schedule
const intervalId = setInterval(runSweeper, SWEEP_INTERVAL_MS);

// Graceful shutdown
async function shutdown(signal: string) {
  if (isShuttingDown) return;
  logger.info({ signal }, "Received shutdown signal, stopping sweeper...");
  isShuttingDown = true;
  clearInterval(intervalId);

  // Wait for any active sweep to finish
  let attempts = 0;
  while (isSweeping && attempts < 10) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    attempts++;
  }

  if (isSweeping) {
    logger.warn("Sweeper did not finish in time, forcing shutdown");
  } else {
    logger.info("Sweeper stopped cleanly");
  }

  try {
    await pool.end();
    logger.info("Database pool closed");
    process.exit(0);
  } catch (err) {
    logger.error({ err }, "Error closing database pool");
    process.exit(1);
  }
}

if (env.NODE_ENV !== "test" && env.NODE_ENV !== "development") { sweepExpiredIntents();  }
sweepExpiredIntents().catch(console.error);
setInterval(() => sweepExpiredIntents().catch(console.error), SWEEP_INTERVAL_MS);
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
