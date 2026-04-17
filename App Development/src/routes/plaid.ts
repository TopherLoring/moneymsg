import { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { fundingSources, users } from "../db/schema";
import { AppError, toErrorResponse } from "../lib/errors";
import { createLinkToken, exchangePublicToken } from "../services/plaid";
import { requireAuth, assertOwnershipOrElevated } from "../lib/authz";
import { RATE_LIMITS } from "../lib/rateLimit";

export async function plaidRoutes(app: FastifyInstance) {
  app.post(
    "/api/v1/plaid/create-link-token",
    {
      preHandler: [requireAuth],
      config: { rateLimit: RATE_LIMITS.plaid },
      schema: {
        body: {
          type: "object",
          required: ["userId"],
          properties: { userId: { type: "string", format: "uuid" } },
        },
      },
    },
    async (request, reply) => {
      try {
        const { userId } = request.body as { userId: string };

        // Ownership: caller must be the target user or elevated role
        assertOwnershipOrElevated(request, userId);

        // Verify user exists
        const [user] = await db.select({ id: users.id }).from(users).where(eq(users.id, userId));
        if (!user) throw new AppError("User not found", "NOT_FOUND", 404);

        const { link_token } = await createLinkToken(userId);
        return reply.send({ link_token });
      } catch (err) {
        const { status, body } = toErrorResponse(err);
        return reply.status(status).send(body);
      }
    },
  );

  app.post(
    "/api/v1/plaid/exchange",
    {
      preHandler: [requireAuth],
      config: { rateLimit: RATE_LIMITS.plaid },
      schema: {
        body: {
          type: "object",
          required: ["userId", "publicToken", "accountId", "routingTarget", "institutionName", "mask"],
          properties: {
            userId: { type: "string", format: "uuid" },
            publicToken: { type: "string" },
            accountId: { type: "string" },
            routingTarget: { type: "string", enum: ["tabapay", "dwolla"] },
            institutionName: { type: "string" },
            mask: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { userId, publicToken, accountId, routingTarget, institutionName, mask } = request.body as {
          userId: string;
          publicToken: string;
          accountId: string;
          routingTarget: "tabapay" | "dwolla";
          institutionName: string;
          mask: string;
        };

        // Ownership: caller must be the target user or elevated role
        assertOwnershipOrElevated(request, userId);

        // Verify user exists
        const [user] = await db.select({ id: users.id }).from(users).where(eq(users.id, userId));
        if (!user) throw new AppError("User not found", "NOT_FOUND", 404);

        const { processorToken, itemId } = await exchangePublicToken({ publicToken, accountId, routingTarget });

        await db.insert(fundingSources).values({
          userId,
          institutionName,
          mask,
          plaidItemId: itemId,
          processorToken,
          routingProvider: routingTarget,
          sourceType: routingTarget === "tabapay" ? "card" : "bank",
        });

        return reply.send({ success: true });
      } catch (err) {
        const { status, body } = toErrorResponse(err);
        return reply.status(status).send(body);
      }
    },
  );
}
