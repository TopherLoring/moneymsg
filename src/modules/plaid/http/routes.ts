import { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { db } from "../../../infrastructure/db";
import { fundingSources, users } from "../../../infrastructure/db/schema";
import { AppError, toErrorResponse } from "../../../shared/errors";
import { createLinkToken, exchangePublicToken } from "../../../integrations/plaid/client";
import { requireAuth, assertOwnershipOrElevated } from "../../../shared/authz";
import { RATE_LIMITS } from "../../../shared/rateLimit";

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
            publicToken: { type: "string", minLength: 1 },
            accountId: { type: "string", minLength: 1 },
            routingTarget: { type: "string", enum: ["tabapay", "dwolla"] },
            institutionName: { type: "string", minLength: 1, maxLength: 128 },
            mask: { type: "string", pattern: "^\\d{4}$" },
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

        const duplicate = await db
          .select({ id: fundingSources.id })
          .from(fundingSources)
          .where(eq(fundingSources.plaidItemId, accountId));
        if (duplicate.length) {
          throw new AppError("Funding source already linked", "CONFLICT", 409);
        }

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
