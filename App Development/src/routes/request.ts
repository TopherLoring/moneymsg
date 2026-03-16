import { FastifyInstance } from "fastify";
import { and, eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { db } from "../db";
import { paymentRequests } from "../db/requests";
import { fundingSources, transactions, wallets } from "../db/schema";
import { AppError, toErrorResponse } from "../lib/errors";
import { INTENT_TTL_HOURS, SUPPORTED_CURRENCY } from "../lib/constants";
import { calculateGrossFromNet } from "../lib/fees";
import { requireApiKey } from "../lib/auth";
import { assertNotDuplicate, assertWithinDailyLimit } from "../lib/risk";
import { assertRiskAllow } from "../lib/riskScorer";
import { pullFromCard } from "../services/tabapay";
import { initiateBankTransfer } from "../services/dwolla";
import { env } from "../lib/env";
import { deviceInfoSchema, riskMetaSchema } from "../lib/schemas";

const amountSchema = { type: "string", pattern: "^[0-9]+(\\.[0-9]{1,4})?$" };
const expiresAt = () => new Date(Date.now() + INTENT_TTL_HOURS * 60 * 60 * 1000);
const requestLink = (id: string) => `https://moneymsg.site/request?id=${id}`;

export async function requestRoutes(app: FastifyInstance) {
  // Create a request link (Requester)
  app.post(
    "/api/v1/request/create",
    {
      schema: {
        body: {
          type: "object",
          required: ["userId", "amount", "idempotencyKey"],
          properties: {
            userId: { type: "string", format: "uuid" },
            amount: amountSchema,
            idempotencyKey: { type: "string", minLength: 1 },
            riskMeta: { ...riskMetaSchema, nullable: true },
            deviceInfo: { ...deviceInfoSchema, nullable: true },
            ipAddress: { type: "string", nullable: true },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        requireApiKey(request);
        const { userId, amount, idempotencyKey, riskMeta, deviceInfo, ipAddress } = request.body as {
          userId: string;
          amount: string;
          idempotencyKey: string;
          riskMeta?: Record<string, unknown>;
          deviceInfo?: Record<string, unknown>;
          ipAddress?: string;
        };

        const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, userId));
        if (!wallet) throw new AppError("Wallet not found", "NOT_FOUND", 404);
        if (wallet.status !== "active") throw new AppError("Wallet not active", "CONFLICT", 409);

        const existing = await db
          .select()
          .from(paymentRequests)
          .where(and(eq(paymentRequests.idempotencyKey, idempotencyKey), eq(paymentRequests.requesterUserId, userId)));
        if (existing.length) {
          const req = existing[0];
          return reply.send({
            requestId: req.id,
            deepLink: req.deepLink,
            status: req.status,
            lifecycle: req.status,
            idempotency: true,
          });
        }

        await assertWithinDailyLimit({ walletId: wallet.id, transactionType: "p2p_receive", amount, db });
        await assertNotDuplicate({ walletId: wallet.id, transactionType: "p2p_receive", amount, db });
        await assertRiskAllow({
          walletId: wallet.id,
          transactionType: "p2p_receive",
          amount,
          riskMeta,
          deviceInfo,
          ipAddress,
        });

        const [created] = await db
          .insert(paymentRequests)
          .values({
            requesterWalletId: wallet.id,
            requesterUserId: userId,
            amount,
            status: "created",
            deepLink: requestLink(""),
            idempotencyKey,
            riskMeta: riskMeta ? JSON.stringify(riskMeta) : null,
            deviceInfo: deviceInfo ? JSON.stringify(deviceInfo) : null,
            ipAddress: ipAddress ?? null,
            expiresAt: expiresAt(),
          })
          .returning({ id: paymentRequests.id });

        const link = requestLink(created.id);
        await db.update(paymentRequests).set({ deepLink: link }).where(eq(paymentRequests.id, created.id));

        return reply.send({
          requestId: created.id,
          deepLink: link,
          currency: SUPPORTED_CURRENCY,
          idempotency: false,
          status: "created",
          lifecycle: "created",
        });
      } catch (err) {
        const { status, body } = toErrorResponse(err);
        return reply.status(status).send(body);
      }
    },
  );

  // Pay a request (Payer funds requester via card/bank)
  app.post(
    "/api/v1/request/pay",
    {
      schema: {
        body: {
          type: "object",
          required: ["requestId", "payerUserId", "fundingSourceId", "idempotencyKey"],
          properties: {
            requestId: { type: "string", format: "uuid" },
            payerUserId: { type: "string", format: "uuid" },
            fundingSourceId: { type: "string", format: "uuid" },
            idempotencyKey: { type: "string", minLength: 1 },
            riskMeta: { ...riskMetaSchema, nullable: true },
            deviceInfo: { ...deviceInfoSchema, nullable: true },
            ipAddress: { type: "string", nullable: true },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        requireApiKey(request);
        const { requestId, payerUserId, fundingSourceId, idempotencyKey, riskMeta, deviceInfo, ipAddress } = request.body as {
          requestId: string;
          payerUserId: string;
          fundingSourceId: string;
          idempotencyKey: string;
          riskMeta?: Record<string, unknown>;
          deviceInfo?: Record<string, unknown>;
          ipAddress?: string;
        };

        const [reqRow] = await db.select().from(paymentRequests).where(eq(paymentRequests.id, requestId));
        if (!reqRow) throw new AppError("Request not found", "NOT_FOUND", 404);
        if (reqRow.status !== "created") throw new AppError("Request already processed", "IDEMPOTENT_REPLAY", 409);
        if (reqRow.expiresAt && reqRow.expiresAt <= new Date()) {
          throw new AppError("Request expired", "CONFLICT", 409);
        }

        const [requesterWallet] = await db.select().from(wallets).where(eq(wallets.id, reqRow.requesterWalletId));
        if (!requesterWallet) throw new AppError("Requester wallet missing", "NOT_FOUND", 404);
        if (requesterWallet.status !== "active") throw new AppError("Requester wallet not active", "CONFLICT", 409);

        const [funding] = await db
          .select()
          .from(fundingSources)
          .where(and(eq(fundingSources.id, fundingSourceId), eq(fundingSources.userId, payerUserId)));
        if (!funding || !funding.isActive) throw new AppError("Funding source not found", "NOT_FOUND", 404);

        // Idempotency: reuse prior payment by same payer idempotencyKey on this request
        const existingPay = await db
          .select()
          .from(transactions)
          .where(
            and(
              eq(transactions.idempotencyKey, idempotencyKey),
              eq(transactions.walletId, requesterWallet.id),
              eq(transactions.transactionType, "load"),
            ),
          );
        if (existingPay.length) {
          const tx = existingPay[0];
          return reply.send({
            success: true,
            amount: tx.netAmount,
            idempotency: true,
            requestId,
            status: "completed",
            lifecycle: "completed",
          });
        }

        const { gross, fee, net } = calculateGrossFromNet(reqRow.amount as string);

        await assertWithinDailyLimit({ walletId: requesterWallet.id, transactionType: "load", amount: net, db });
        await assertNotDuplicate({ walletId: requesterWallet.id, transactionType: "load", amount: net, db });
        await assertRiskAllow({
          walletId: requesterWallet.id,
          transactionType: "load",
          amount: net,
          riskMeta,
          deviceInfo,
          ipAddress,
        });

        let providerRef: string | undefined;
        if (funding.routingProvider === "tabapay") {
          const res = await pullFromCard({ processorToken: funding.processorToken, amount: gross });
          providerRef = res.id;
        } else if (funding.routingProvider === "dwolla") {
          if (!env.DWOLLA_DEST_FUNDING_SOURCE) {
            throw new AppError("DWOLLA_DEST_FUNDING_SOURCE not configured", "PROVIDER_ERROR", 500);
          }
          const res = await initiateBankTransfer({
            sourceFundingSource: funding.processorToken,
            destinationFundingSource: env.DWOLLA_DEST_FUNDING_SOURCE,
            amount: gross,
          });
          providerRef = res.id;
        } else {
          throw new AppError("Unsupported routing provider", "PROVIDER_ERROR", 400);
        }

        await db.transaction(async (tx) => {
          await tx.insert(transactions).values({
            walletId: requesterWallet.id,
            transactionType: "load",
            status: "completed",
            lifecycle: "completed",
            grossAmount: gross,
            netAmount: net,
            feeAmount: fee,
            idempotencyKey,
            providerRef,
            riskMeta: riskMeta ? JSON.stringify(riskMeta) : null,
            deviceInfo: deviceInfo ? JSON.stringify(deviceInfo) : null,
            ipAddress: ipAddress ?? null,
            completedAt: new Date(),
          });

          await tx
            .update(wallets)
            .set({ availableBalance: sql`available_balance + ${net}` })
            .where(eq(wallets.id, requesterWallet.id));

          await tx
            .update(paymentRequests)
            .set({
              status: "completed",
              payerUserId,
              completedAt: new Date(),
            })
            .where(eq(paymentRequests.id, requestId));
        });

        return reply.send({
          success: true,
          requestId,
          amount: net,
          feeAmount: fee,
          currency: SUPPORTED_CURRENCY,
          idempotency: false,
          status: "completed",
          lifecycle: "completed",
        });
      } catch (err) {
        const { status, body } = toErrorResponse(err);
        return reply.status(status).send(body);
      }
    },
  );
}
