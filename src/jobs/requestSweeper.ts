import { env } from "../config/env";
import { and, eq, lte } from "drizzle-orm";
import { db } from "../infrastructure/db";
import { paymentRequests } from "../infrastructure/db/requests";
import { SWEEP_INTERVAL_MS } from "../config/constants";

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

if (env.NODE_ENV !== "test") { sweepExpiredRequests();  }
