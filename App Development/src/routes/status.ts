import { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { transactions } from "../db/schema";
import { paymentRequests } from "../db/requests";
import { AppError, toErrorResponse } from "../lib/errors";
import { requireApiKey } from "../lib/auth";

export async function statusRoutes(app: FastifyInstance) {
  app.get(
    "/api/v1/status/transaction/:id",
    async (request, reply) => {
      try {
        requireApiKey(request);
        const id = (request.params as { id: string }).id;
        const [tx] = await db.select().from(transactions).where(eq(transactions.id, id));
        if (!tx) throw new AppError("Transaction not found", "NOT_FOUND", 404);
        return reply.send({
          id: tx.id,
          type: tx.transactionType,
          status: tx.status,
          lifecycle: tx.lifecycle,
          grossAmount: tx.grossAmount,
          netAmount: tx.netAmount,
          feeAmount: tx.feeAmount,
          providerRef: tx.providerRef,
          createdAt: tx.createdAt,
          completedAt: tx.completedAt,
        });
      } catch (err) {
        const { status, body } = toErrorResponse(err);
        return reply.status(status).send(body);
      }
    },
  );

  app.get(
    "/api/v1/status/request/:id",
    async (request, reply) => {
      try {
        requireApiKey(request);
        const id = (request.params as { id: string }).id;
        const [reqRow] = await db.select().from(paymentRequests).where(eq(paymentRequests.id, id));
        if (!reqRow) throw new AppError("Request not found", "NOT_FOUND", 404);
        return reply.send({
          id: reqRow.id,
          status: reqRow.status,
          lifecycle: reqRow.status,
          amount: reqRow.amount,
          deepLink: reqRow.deepLink,
          expiresAt: reqRow.expiresAt,
          completedAt: reqRow.completedAt,
        });
      } catch (err) {
        const { status, body } = toErrorResponse(err);
        return reply.status(status).send(body);
      }
    },
  );
}
