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
const requests_1 = require("../infrastructure/db/requests");
const constants_1 = require("../config/constants");
async function sweepExpiredRequests() {
    const expired = await db_1.db
        .select({ id: requests_1.paymentRequests.id })
        .from(requests_1.paymentRequests)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(requests_1.paymentRequests.status, "created"), (0, drizzle_orm_1.lte)(requests_1.paymentRequests.expiresAt, new Date())))
        .for("update", { skipLocked: true });
    for (const req of expired) {
        await db_1.db
            .update(requests_1.paymentRequests)
            .set({ status: "expired" })
            .where((0, drizzle_orm_1.eq)(requests_1.paymentRequests.id, req.id));
    }
}
sweepExpiredRequests();
setInterval(sweepExpiredRequests, constants_1.SWEEP_INTERVAL_MS);
