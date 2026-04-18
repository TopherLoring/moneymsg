import { FastifyInstance } from "fastify";
import { and, eq, lte } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { db } from "../db";
import { fundingSources, paymentLinks, transactions, wallets } from "../db/schema";
import { AppError, toErrorResponse } from "../lib/errors";
import { INTENT_TTL_HOURS, SUPPORTED_CURRENCY } from "../lib/constants";
import {
  addMoney,
  calculateGrossFromNet,
  calculateFeeFromGross,
  subtractMoney,
} from "../lib/fees";
import { pullFromCard } from "../services/tabapay";
import { initiateBankTransfer } from "../services/dwolla";
import { env } from "../lib/env";
import { bookTransfer } from "../services/alviere";
import Decimal from "decimal.js";
import { requireAuth, assertOwnershipOrElevated } from "../lib/authz";
import { RATE_LIMITS } from "../lib/rateLimit";
import { assertNotDuplicate, assertWithinDailyLimit } from "../lib/risk";
import { assertRiskAllow } from "../lib/riskScorer";
import { deviceInfoSchema, riskMetaSchema } from "../lib/schemas";

const amountSchema = { type: "string", pattern: "^[0-9]+(\\.[0-9]{1,4})?$" };

const deepLinkFor = (intentId: string) => `https://moneymsg.site/pay?id=${intentId}`;

const expiresAt = () => new Date(Date.now() + INTENT_TTL_HOURS * 60 * 60 * 1000);

export async function transferRoutes(app: FastifyInstance) {
  app.post(
    "/api/v1/transfer/intent/wallet",
    {
      preHandler: [requireAuth],
      config: { rateLimit: RATE_LIMITS.transact },
      schema: {
        body: {
          type: "object",
          required: ["userId", "amount"],
          properties: {
            userId: { type: "string", format: "uuid" },
            amount: amountSchema,
            riskMeta: { ...riskMetaSchema, nullable: true },
            deviceInfo: { ...deviceInfoSchema, nullable: true },
            ipAddress: { type: "string", nullable: true },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { userId, amount, riskMeta, deviceInfo, ipAddress } = request.body as {
          userId: string;
          amount: string;
          riskMeta?: Record<string, unknown>;
          deviceInfo?: Record<string, unknown>;
          ipAddress?: string;
        };

        assertOwnershipOrElevated(request, userId);

        const intent = await db.transaction(async (tx) => {
          const [wallet] = await tx
            .select()
            .from(wallets)
            .where(eq(wallets.userId, userId))
            .for("update");
          if (!wallet) throw new AppError("Wallet not found", "NOT_FOUND", 404);
          if (wallet.status !== "active") throw new AppError("Wallet not active", "CONFLICT", 409);

          if (new Decimal(wallet.availableBalance).lt(new Decimal(amount))) {
            throw new AppError("Insufficient funds", "INSUFFICIENT_FUNDS", 400);
          }

          await assertWithinDailyLimit({ walletId: wallet.id, transactionType: "p2p_send", amount, db: tx });
          await assertNotDuplicate({ walletId: wallet.id, transactionType: "p2p_send", amount, db: tx });
          await assertRiskAllow({
            walletId: wallet.id,
            transactionType: "p2p_send",
            amount,
            riskMeta,
            deviceInfo,
            ipAddress,
          });

          await tx
            .update(wallets)
            .set({
              availableBalance: sql`available_balance - ${amount}`,
              lockedBalance: sql`locked_balance + ${amount}`,
            })
            .where(eq(wallets.id, wallet.id));

          const [created] = await tx
            .insert(transactions)
            .values({
              walletId: wallet.id,
              transactionType: "p2p_send",
              status: "pending",
              lifecycle: "authorized",
              grossAmount: amount,
              netAmount: amount,
              feeAmount: "0.0000",
              expiresAt: expiresAt(),
              riskMeta: riskMeta ? JSON.stringify(riskMeta) : null,
              deviceInfo: deviceInfo ? JSON.stringify(deviceInfo) : null,
              ipAddress: ipAddress ?? null,
            })
            .returning({ id: transactions.id });

          await tx.insert(paymentLinks).values({
            transactionId: created.id,
            senderWalletId: wallet.id,
            deepLink: deepLinkFor(created.id),
            status: "created",
            expiresAt: expiresAt(),
          });

          return created;
        });

        return reply.send({
          intentId: intent.id,
          deepLink: deepLinkFor(intent.id),
          currency: SUPPORTED_CURRENCY,
          status: "pending",
          lifecycle: "authorized",
        });
      } catch (err) {
        const { status, body } = toErrorResponse(err);
        return reply.status(status).send(body);
      }
    },
  );

  app.post(
    "/api/v1/transfer/funded-p2p",
    {
      preHandler: [requireAuth],
      config: { rateLimit: RATE_LIMITS.transact },
      schema: {
        body: {
          type: "object",
          required: ["userId", "amount", "fundingSourceId", "idempotencyKey"],
          properties: {
            userId: { type: "string", format: "uuid" },
            amount: amountSchema,
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
        const { userId, amount, fundingSourceId, idempotencyKey, riskMeta, deviceInfo, ipAddress } = request.body as {
          userId: string;
          amount: string;
          fundingSourceId: string;
          idempotencyKey: string;
          riskMeta?: Record<string, unknown>;
          deviceInfo?: Record<string, unknown>;
          ipAddress?: string;
        };

        assertOwnershipOrElevated(request, userId);

        const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, userId));
        if (!wallet) throw new AppError("Wallet not found", "NOT_FOUND", 404);
        if (wallet.status !== "active") throw new AppError("Wallet not active", "CONFLICT", 409);

        // Idempotency check on load leg
        const existing = await db
          .select()
          .from(transactions)
          .where(
            and(
              eq(transactions.transactionType, "load"),
              eq(transactions.idempotencyKey, idempotencyKey),
              eq(transactions.walletId, wallet.id),
            ),
          );
        if (existing.length) {
          const tx = existing[0];
          if (tx.status === "completed") {
            const intentReplay = await db.transaction(async (txReplay) => {
              const [lockedWallet] = await txReplay
                .select()
                .from(wallets)
                .where(eq(wallets.id, wallet.id))
                .for("update");
              if (!lockedWallet) throw new AppError("Wallet not found", "NOT_FOUND", 404);
              if (new Decimal(lockedWallet.availableBalance as unknown as string).lt(new Decimal(amount))) {
                throw new AppError("Insufficient funds", "INSUFFICIENT_FUNDS", 400);
              }
              const [createdIntent] = await txReplay
                .insert(transactions)
                .values({
                  walletId: wallet.id,
                  transactionType: "p2p_send",
                  status: "pending",
                  lifecycle: "authorized",
                  grossAmount: amount,
                  netAmount: amount,
                  feeAmount: "0.0000",
                  expiresAt: expiresAt(),
                })
                .returning({ id: transactions.id });
              await txReplay
                .update(wallets)
                .set({
                  availableBalance: sql`available_balance - ${amount}`,
                  lockedBalance: sql`locked_balance + ${amount}`,
                })
                .where(eq(wallets.id, wallet.id));
              await txReplay.insert(paymentLinks).values({
                transactionId: createdIntent.id,
                senderWalletId: wallet.id,
                deepLink: deepLinkFor(createdIntent.id),
                status: "created",
                expiresAt: expiresAt(),
              });
              return createdIntent;
            });
            return reply.send({
              intentId: intentReplay.id,
              deepLink: deepLinkFor(intentReplay.id),
              currency: SUPPORTED_CURRENCY,
              idempotency: true,
              status: "pending",
              lifecycle: "authorized",
            });
          }
          throw new AppError("Load in progress or failed", "IDEMPOTENT_REPLAY", 409);
        }

        const [source] = await db
          .select()
          .from(fundingSources)
          .where(and(eq(fundingSources.id, fundingSourceId), eq(fundingSources.userId, userId)));
        if (!source || !source.isActive) throw new AppError("Funding source not found", "NOT_FOUND", 404);

        const { gross, fee, net } = calculateGrossFromNet(amount);

        await assertWithinDailyLimit({ walletId: wallet.id, transactionType: "load", amount: net });
        await assertNotDuplicate({ walletId: wallet.id, transactionType: "load", amount: net });
        await assertRiskAllow({
          walletId: wallet.id,
          transactionType: "load",
          amount: net,
          riskMeta,
          deviceInfo,
          ipAddress,
        });

        let providerRef: string | undefined;
        if (source.routingProvider === "tabapay") {
          const res = await pullFromCard({ processorToken: source.processorToken, amount: gross });
          providerRef = res.id;
        } else if (source.routingProvider === "dwolla") {
          if (!env.DWOLLA_DEST_FUNDING_SOURCE) {
            throw new AppError("DWOLLA_DEST_FUNDING_SOURCE not configured", "PROVIDER_ERROR", 500);
          }
          const res = await initiateBankTransfer({
            sourceFundingSource: source.processorToken,
            destinationFundingSource: env.DWOLLA_DEST_FUNDING_SOURCE,
            amount: gross,
          });
          providerRef = res.id;
        } else {
          throw new AppError("Unsupported routing provider", "PROVIDER_ERROR", 400);
        }

        const intent = await db.transaction(async (tx) => {
          await tx.insert(transactions).values({
            walletId: wallet.id,
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
            .where(eq(wallets.id, wallet.id));

          const [createdIntent] = await tx
            .insert(transactions)
            .values({
              walletId: wallet.id,
              transactionType: "p2p_send",
              status: "pending",
              lifecycle: "authorized",
              grossAmount: amount,
              netAmount: amount,
              feeAmount: "0.0000",
              expiresAt: expiresAt(),
              riskMeta: riskMeta ? JSON.stringify(riskMeta) : null,
              deviceInfo: deviceInfo ? JSON.stringify(deviceInfo) : null,
              ipAddress: ipAddress ?? null,
            })
            .returning({ id: transactions.id });

          await tx
            .update(wallets)
            .set({
              availableBalance: sql`available_balance - ${amount}`,
              lockedBalance: sql`locked_balance + ${amount}`,
            })
            .where(eq(wallets.id, wallet.id));

          await tx.insert(paymentLinks).values({
            transactionId: createdIntent.id,
            senderWalletId: wallet.id,
            deepLink: deepLinkFor(createdIntent.id),
            status: "created",
            expiresAt: expiresAt(),
          });

          return createdIntent;
        });

        return reply.send({
          intentId: intent.id,
          deepLink: deepLinkFor(intent.id),
          currency: SUPPORTED_CURRENCY,
          idempotency: false,
          status: "pending",
          lifecycle: "authorized",
        });
      } catch (err) {
        const { status, body } = toErrorResponse(err);
        return reply.status(status).send(body);
      }
    },
  );

  app.post(
    "/api/v1/transfer/claim",
    {
      preHandler: [requireAuth],
      config: { rateLimit: RATE_LIMITS.transact },
      schema: {
        body: {
          type: "object",
          required: ["intentId", "recipientUserId"],
          properties: {
            intentId: { type: "string", format: "uuid" },
            recipientUserId: { type: "string", format: "uuid" },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { intentId, recipientUserId } = request.body as { intentId: string; recipientUserId: string };

        assertOwnershipOrElevated(request, recipientUserId);

        const [intent] = await db
          .update(transactions)
          .set({ lifecycle: "processing" })
          .where(
            and(
              eq(transactions.id, intentId),
              eq(transactions.status, "pending"),
              eq(transactions.lifecycle, "authorized"),
            ),
          )
          .returning();

        if (!intent || intent.transactionType !== "p2p_send") {
          throw new AppError("Intent not found", "NOT_FOUND", 404);
        }
        if (intent.expiresAt && intent.expiresAt <= new Date()) {
          throw new AppError("Intent expired", "CONFLICT", 409);
        }

        const [senderWallet] = await db.select().from(wallets).where(eq(wallets.id, intent.walletId));
        if (!senderWallet) throw new AppError("Sender wallet missing", "NOT_FOUND", 404);

        const [recipientWallet] = await db.select().from(wallets).where(eq(wallets.userId, recipientUserId));
        if (!recipientWallet) throw new AppError("Recipient wallet not found", "NOT_FOUND", 404);
        if (recipientWallet.status !== "active") throw new AppError("Recipient wallet not active", "CONFLICT", 409);

        try {
          await bookTransfer({
            fromAccountId: senderWallet.alviereAccountId,
            toAccountId: recipientWallet.alviereAccountId,
            amount: intent.netAmount as string,
            description: "MoneyMsg P2P transfer",
          });
        } catch (err) {
          await db
            .update(transactions)
            .set({ lifecycle: "authorized" })
            .where(eq(transactions.id, intentId));
          throw err;
        }

        await db.transaction(async (tx) => {
          await tx
            .update(transactions)
            .set({ status: "completed", lifecycle: "completed", completedAt: new Date() })
            .where(eq(transactions.id, intentId));

          await tx
            .insert(transactions)
            .values({
              walletId: recipientWallet.id,
              transactionType: "p2p_receive",
              status: "completed",
              lifecycle: "completed",
              grossAmount: intent.netAmount,
              netAmount: intent.netAmount,
              feeAmount: "0.0000",
              completedAt: new Date(),
            });

          await tx
            .update(wallets)
            .set({ availableBalance: sql`available_balance + ${intent.netAmount}` })
            .where(eq(wallets.id, recipientWallet.id));

          await tx
            .update(wallets)
            .set({
              lockedBalance: sql`locked_balance - ${intent.netAmount}`,
            })
            .where(eq(wallets.id, senderWallet.id));

          await tx
            .update(paymentLinks)
            .set({ status: "completed", claimedAt: new Date() })
            .where(eq(paymentLinks.transactionId, intent.id));
        });

        return reply.send({ success: true, status: "completed", lifecycle: "completed" });
      } catch (err) {
        const { status, body } = toErrorResponse(err);
        return reply.status(status).send(body);
      }
    },
  );
}
