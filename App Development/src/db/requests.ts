import {
  pgTable,
  uuid,
  numeric,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { txLifecycleEnum, wallets, users } from "./schema";

export const paymentRequests = pgTable("payment_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  requesterWalletId: uuid("requester_wallet_id").notNull().references(() => wallets.id, { onDelete: "cascade" }),
  requesterUserId: uuid("requester_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  payerUserId: uuid("payer_user_id").references(() => users.id, { onDelete: "set null" }),
  amount: numeric("amount", { precision: 15, scale: 4 }).notNull(),
  status: txLifecycleEnum("status").notNull().default("created"),
  deepLink: text("deep_link").notNull(),
  idempotencyKey: text("idempotency_key"),
  riskMeta: text("risk_meta"),
  deviceInfo: text("device_info"),
  ipAddress: text("ip_address"),
  expiresAt: timestamp("expires_at").notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
