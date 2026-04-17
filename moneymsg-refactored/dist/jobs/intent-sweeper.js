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
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../infrastructure/db");
const schema_1 = require("../infrastructure/db/schema");
const constants_1 = require("../config/constants");
async function sweepExpiredIntents() {
    const expired = await db_1.db
        .select({
        id: schema_1.transactions.id,
        walletId: schema_1.transactions.walletId,
        net: schema_1.transactions.netAmount,
        linkId: schema_1.paymentLinks.id,
    })
        .from(schema_1.transactions)
        .leftJoin(schema_1.paymentLinks, (0, drizzle_orm_1.eq)(schema_1.paymentLinks.transactionId, schema_1.transactions.id))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.transactions.status, "pending"), (0, drizzle_orm_1.eq)(schema_1.transactions.transactionType, "p2p_send"), (0, drizzle_orm_1.lte)(schema_1.transactions.expiresAt, new Date())))
        .for("update", { skipLocked: true });
    for (const intent of expired) {
        await db_1.db.transaction(async (tx) => {
            await tx
                .update(schema_1.wallets)
                .set({
                availableBalance: (0, drizzle_orm_1.sql) `available_balance + ${intent.net}`,
                lockedBalance: (0, drizzle_orm_1.sql) `locked_balance - ${intent.net}`,
            })
                .where((0, drizzle_orm_1.eq)(schema_1.wallets.id, intent.walletId));
            await tx
                .update(schema_1.transactions)
                .set({
                status: "reversed",
                lifecycle: "reversed",
                failureReason: "Intent expired after 24 hours",
                completedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(schema_1.transactions.id, intent.id));
            if (intent.linkId) {
                await tx
                    .update(schema_1.paymentLinks)
                    .set({ status: "reversed" })
                    .where((0, drizzle_orm_1.eq)(schema_1.paymentLinks.id, intent.linkId));
            }
        });
    }
}
sweepExpiredIntents();
setInterval(sweepExpiredIntents, constants_1.SWEEP_INTERVAL_MS);
