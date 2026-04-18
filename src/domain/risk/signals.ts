import { and, eq, gte, sql } from "drizzle-orm";
import Decimal from "decimal.js";
import { db as defaultDb } from "../../infrastructure/db";
import { transactions, fundingSources } from "../../infrastructure/db/schema";

type TxType = (typeof transactions.transactionType.enumValues)[number];

/**
 * Returns true if this wallet has never completed a transaction of this type.
 * First-use signals warrant step-up verification.
 */
export async function isFirstUse(opts: {
  walletId: string;
  transactionType: TxType;
  db?: any;
}): Promise<boolean> {
  const db = opts.db ?? defaultDb;
  const [{ count }] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(transactions)
    .where(
      and(
        eq(transactions.walletId, opts.walletId),
        eq(transactions.transactionType, opts.transactionType),
        eq(transactions.status, "completed"),
      ),
    );
  return Number(count) === 0;
}

/**
 * Returns true if the amount is more than 3× the wallet's average completed
 * transaction amount for this type — an anomaly signal.
 */
export async function isAmountAnomaly(opts: {
  walletId: string;
  transactionType: TxType;
  amount: string;
  db?: any;
}): Promise<boolean> {
  const db = opts.db ?? defaultDb;
  const [{ avg }] = await db
    .select({ avg: sql<string>`AVG(${transactions.netAmount}::numeric)` })
    .from(transactions)
    .where(
      and(
        eq(transactions.walletId, opts.walletId),
        eq(transactions.transactionType, opts.transactionType),
        eq(transactions.status, "completed"),
      ),
    );
  if (!avg) return false;
  const average = new Decimal(avg);
  const threshold = average.mul(3);
  return new Decimal(opts.amount).gt(threshold);
}

/**
 * Returns true if the same (walletId, fundingSourceId) pair produced a failed
 * transaction in the last hour — a scam-reuse signal.
 */
export async function hasRecentFailure(opts: {
  walletId: string;
  transactionType: TxType;
  db?: any;
}): Promise<boolean> {
  const db = opts.db ?? defaultDb;
  const [{ count }] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(transactions)
    .where(
      and(
        eq(transactions.walletId, opts.walletId),
        eq(transactions.transactionType, opts.transactionType),
        eq(transactions.status, "failed"),
        gte(transactions.createdAt, sql`now() - interval '1 hour'`),
      ),
    );
  return Number(count) >= 2;
}

/**
 * Returns true if the wallet has had more than `threshold` completed
 * transactions of this type in the last 24 hours — velocity signal.
 */
export async function exceedsVelocity(opts: {
  walletId: string;
  transactionType: TxType;
  threshold?: number;
  db?: any;
}): Promise<boolean> {
  const db = opts.db ?? defaultDb;
  const limit = opts.threshold ?? 10;
  const [{ count }] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(transactions)
    .where(
      and(
        eq(transactions.walletId, opts.walletId),
        eq(transactions.transactionType, opts.transactionType),
        gte(transactions.createdAt, sql`now() - interval '24 hours'`),
      ),
    );
  return Number(count) >= limit;
}
