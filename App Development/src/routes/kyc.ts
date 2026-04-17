import { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users, wallets } from "../db/schema";
import { AppError, toErrorResponse } from "../lib/errors";
import { submitKyc } from "../services/alviere-kyc";
import { requireAuth, assertOwnershipOrElevated } from "../lib/authz";
import { RATE_LIMITS } from "../lib/rateLimit";

export async function kycRoutes(app: FastifyInstance) {
  app.post(
    "/api/v1/kyc/submit",
    {
      preHandler: [requireAuth],
      config: { rateLimit: RATE_LIMITS.kyc },
      schema: {
        body: {
          type: "object",
          required: ["userId", "kycData"],
          properties: {
            userId: { type: "string", format: "uuid" },
            kycData: { type: "object" },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { userId, kycData } = request.body as { userId: string; kycData: Record<string, unknown> };

        // Ownership: caller must be the target user or elevated role
        assertOwnershipOrElevated(request, userId);

        const [user] = await db.select().from(users).where(eq(users.id, userId));
        if (!user) throw new AppError("User not found", "NOT_FOUND", 404);

        const result = await submitKyc(kycData);

        if (result.kycStatus === "rejected") {
          throw new AppError("KYC verification failed", "CONFLICT", 400);
        }

        await db.transaction(async (tx) => {
          await tx
            .update(users)
            .set({ alviereMemberId: result.memberId, kycStatus: result.kycStatus })
            .where(eq(users.id, userId));

          await tx
            .insert(wallets)
            .values({
              userId,
              alviereAccountId: result.accountId,
              currency: "USD",
              status: "active",
            })
            .onConflictDoNothing();
        });

        return reply.send({ success: true, status: result.kycStatus });
      } catch (err) {
        const { status, body } = toErrorResponse(err);
        return reply.status(status).send(body);
      }
    },
  );
}
