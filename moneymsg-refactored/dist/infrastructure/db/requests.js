"use strict";
/**
 * Version Tracking
 * Version: v1.1.0
 * Updated: 2026.04.17
 * Status: Review
 * Parent: TopherLoring Industries
 * Project: MoneyMsg
 * Author: Christopher Rowden
 *
 * Changelog
 * - v1.1.0 — 2026.04.17
 *   - Relocated and updated during the physical repository refactor.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRequests = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const schema_1 = require("./schema");
exports.paymentRequests = (0, pg_core_1.pgTable)("payment_requests", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    requesterWalletId: (0, pg_core_1.uuid)("requester_wallet_id").notNull().references(() => schema_1.wallets.id, { onDelete: "cascade" }),
    requesterUserId: (0, pg_core_1.uuid)("requester_user_id").notNull().references(() => schema_1.users.id, { onDelete: "cascade" }),
    payerUserId: (0, pg_core_1.uuid)("payer_user_id").references(() => schema_1.users.id, { onDelete: "set null" }),
    amount: (0, pg_core_1.numeric)("amount", { precision: 15, scale: 4 }).notNull(),
    status: (0, schema_1.txLifecycleEnum)("status").notNull().default("created"),
    deepLink: (0, pg_core_1.text)("deep_link").notNull(),
    idempotencyKey: (0, pg_core_1.text)("idempotency_key"),
    riskMeta: (0, pg_core_1.text)("risk_meta"),
    deviceInfo: (0, pg_core_1.text)("device_info"),
    ipAddress: (0, pg_core_1.text)("ip_address"),
    expiresAt: (0, pg_core_1.timestamp)("expires_at").notNull(),
    completedAt: (0, pg_core_1.timestamp)("completed_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
