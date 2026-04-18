import { and, eq, gte, sql } from "drizzle-orm";
import Decimal from "decimal.js";
import { db as defaultDb } from "../../infrastructure/db";
import { transactions } from "../../infrastructure/db/schema";
import { AppError } from "../../shared/errors";
import { DAILY_LOAD_LIMIT, DAILY_SEND_LIMIT, DUPLICATE_WINDOW_MINUTES } from "../../config/constants";

type TxType = (typeof transactions.transactionType.enumValues)[number];

const dailyLimitFor = (type: TxType) => {
  if (type === "load") return DAILY_LOAD_LIMIT;
  if (type === "cashout" || type === "p2p_send") return DAILY_SEND_LIMIT;
  return null;
};

export async function assertWithinDailyLimit(opts: {
  walletId: string;
  transactionType: TxType;
  amount: string;
  db?: any;
}) {
  const db = opts.db ?? defaultDb;
  const limitStr = dailyLimitFor(opts.transactionType);
  if (!limitStr) return;

  const [{ sum }] = await db
    .select({
      sum: sql<string>`COALESCE(SUM(${transactions.netAmount}), '0')`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.walletId, opts.walletId),
        eq(transactions.transactionType, opts.transactionType),
        gte(transactions.createdAt, sql`date_trunc('day', now())`),
      ),
    );

  const total = new Decimal(sum);
  const limit = new Decimal(limitStr);
  if (total.add(opts.amount).gt(limit)) {
    throw new AppError(`Daily limit exceeded for ${opts.transactionType}`, "CONFLICT", 400);
  }
}

export async function assertNotDuplicate(opts: {
  walletId: string;
  transactionType: TxType;
  amount: string;
  db?: any;
}) {
  const db = opts.db ?? defaultDb;
  const window = DUPLICATE_WINDOW_MINUTES;
  const [{ count }] = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.walletId, opts.walletId),
        eq(transactions.transactionType, opts.transactionType),
        eq(transactions.netAmount, opts.amount),
        gte(transactions.createdAt, sql`now() - interval '${window} minutes'`),
      ),
    );

  if (Number(count) > 0) {
    throw new AppError("Duplicate transaction detected", "IDEMPOTENT_REPLAY", 409);
  }
}
