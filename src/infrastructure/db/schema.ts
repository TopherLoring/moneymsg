import {
  pgTable,
  uuid,
  text,
  numeric,
  timestamp,
  pgEnum,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const kycStatusEnum = pgEnum("kyc_status", ["pending", "approved", "rejected"]);
export const webhookStateEnum = pgEnum("webhook_state", ["logged", "reconciled", "finalized"]);
export const txStatusEnum = pgEnum("tx_status", ["pending", "completed", "reversed", "failed"]);
export const txTypeEnum = pgEnum("tx_type", ["load", "cashout", "p2p_send", "p2p_receive"]);
export const walletStatusEnum = pgEnum("wallet_status", ["active", "frozen", "closed"]);
export const txLifecycleEnum = pgEnum("tx_lifecycle", [
  "created",
  "validating",
  "authorized",
  "processing",
  "settled",
  "completed",
  "failed",
  "reversed",
  "expired",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull().unique(),
  alviereMemberId: text("alviere_member_id"),
  kycStatus: kycStatusEnum("kyc_status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const wallets = pgTable("wallets", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  alviereAccountId: text("alviere_account_id").notNull().unique(),
  availableBalance: numeric("available_balance", { precision: 15, scale: 4 }).notNull().default("0.0000"),
  lockedBalance: numeric("locked_balance", { precision: 15, scale: 4 }).notNull().default("0.0000"),
  currency: text("currency").notNull().default("USD"),
  status: walletStatusEnum("status").notNull().default("active"),
  lastSyncedAt: timestamp("last_synced_at").defaultNow().notNull(),
}, (table) => ({
  userUnique: uniqueIndex("wallets_user_unique").on(table.userId),
}));

export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  walletId: uuid("wallet_id").notNull().references(() => wallets.id, { onDelete: "cascade" }),
  transactionType: txTypeEnum("transaction_type").notNull(),
  status: txStatusEnum("status").notNull().default("pending"),
  lifecycle: txLifecycleEnum("lifecycle").notNull().default("created"),
  idempotencyKey: text("idempotency_key"),
  providerRef: text("provider_ref"),
  riskMeta: text("risk_meta"),
  deviceInfo: text("device_info"),
  ipAddress: text("ip_address"),
  grossAmount: numeric("gross_amount", { precision: 15, scale: 4 }).notNull(),
  netAmount: numeric("net_amount", { precision: 15, scale: 4 }).notNull(),
  feeAmount: numeric("fee_amount", { precision: 15, scale: 4 }).notNull(),
  expiresAt: timestamp("expires_at"),
  failureReason: text("failure_reason"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  idxTransactionsExpiration: index("idx_transactions_expiration")
    .on(table.status, table.expiresAt)
    .where(sql`${table.status} = 'pending'`),
  idxIdempotent: uniqueIndex("idx_transactions_idempotent")
    .on(table.transactionType, table.idempotencyKey)
    .where(sql`${table.idempotencyKey} IS NOT NULL`),
}));

export const paymentLinks = pgTable("payment_links", {
  id: uuid("id").defaultRandom().primaryKey(),
  transactionId: uuid("transaction_id").notNull().references(() => transactions.id, { onDelete: "cascade" }),
  senderWalletId: uuid("sender_wallet_id").notNull().references(() => wallets.id, { onDelete: "cascade" }),
  status: txLifecycleEnum("status").notNull().default("created"),
  deepLink: text("deep_link").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  claimedAt: timestamp("claimed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const webhookEvents = pgTable("webhook_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  provider: text("provider").notNull(),
  eventType: text("event_type").notNull(),
  providerRef: text("provider_ref"),
  payload: text("payload").notNull(),
  reconciliationState: webhookStateEnum("reconciliation_state").notNull().default("logged"),
  correlationRequestId: text("correlation_request_id"),
  processed: boolean("processed").notNull().default(false),
  processedAt: timestamp("processed_at"),
  reconciledAt: timestamp("reconciled_at"),
  finalizedAt: timestamp("finalized_at"),
  retryCount: text("retry_count").notNull().default("0"),
  lastError: text("last_error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  idxProviderRef: uniqueIndex("idx_webhook_events_provider_ref").on(table.provider, table.providerRef, table.eventType),
  idxReconciliationState: index("idx_webhook_events_recon_state").on(table.reconciliationState),
}));

export const fundingSources = pgTable("funding_sources", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  sourceType: text("source_type").notNull(), // 'card' | 'bank'
  institutionName: text("institution_name").notNull(),
  mask: text("mask").notNull(),
  plaidItemId: text("plaid_item_id").notNull(),
  processorToken: text("processor_token").notNull(),
  routingProvider: text("routing_provider").notNull(), // 'tabapay' | 'dwolla'
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
