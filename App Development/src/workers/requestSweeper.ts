import { and, eq, lte } from "drizzle-orm";
import { db } from "../db";
import { paymentRequests } from "../db/requests";
import { SWEEP_INTERVAL_MS } from "../lib/constants";

async function sweepExpiredRequests() {
  const expired = await db
    .select({ id: paymentRequests.id })
    .from(paymentRequests)
    .where(
      and(
        eq(paymentRequests.status, "created"),
        lte(paymentRequests.expiresAt, new Date()),
      ),
    )
    .for("update", { skipLocked: true });

  for (const req of expired) {
    await db
      .update(paymentRequests)
      .set({ status: "expired" })
      .where(eq(paymentRequests.id, req.id));
  }
}

sweepExpiredRequests();
setInterval(sweepExpiredRequests, SWEEP_INTERVAL_MS);
