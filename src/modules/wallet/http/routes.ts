import { FastifyInstance } from "fastify";
import { and, eq, sql } from "drizzle-orm";
import Decimal from "decimal.js";
import { db } from "../../../infrastructure/db";
import { fundingSources, transactions, wallets } from "../../../infrastructure/db/schema";
import { AppError, toErrorResponse } from "../../../shared/errors";
import { calculateGrossFromNet, calculateFeeFromGross } from "../../../domain/fees";
import { pullFromCard, pushToCard } from "../../../integrations/tabapay/client";
import { initiateBankTransfer, pushToBank } from "../../../integrations/dwolla/client";
import { env } from "../../../config/env";
import { requireAuth, assertOwnershipOrElevated } from "../../../shared/authz";
import { getCorrelationMeta, setContextField } from "../../../shared/requestContext";
import { RATE_LIMITS } from "../../../shared/rateLimit";
import { assertNotDuplicate, assertWithinDailyLimit } from "../../../domain/risk";
import { assertRiskAllow } from "../../../domain/risk/scorer";
import { deviceInfoSchema, riskMetaSchema } from "../../../shared/schemas";

const amountSchema = { type: "string", pattern: "^[0-9]+(\\.[0-9]{1,4})?$" };

export async function walletRoutes(app: FastifyInstance) {
  // Load wallet (Flow 1A card, 1B bank)
  app.post(
    "/api/v1/wallet/load",
    {
      preHandler: [requireAuth],
      config: { rateLimit: RATE_LIMITS.transact },
      schema: {
        body: {
          type: "object",
          required: ["userId", "amount", "fundingSourceId", "idempotencyKey"],
          properties: {
            userId: { type: "string", format: "uuid" },
            amount: amountSchema, // desired net load
            fundingSourceId: { type: "string", format: "uuid" },
            idempotencyKey: { type: "string", minLength: 1 },
            deviceInfo: { ...deviceInfoSchema, nullable: true },
            ipAddress: { type: "string", nullable: true },
            riskMeta: { ...riskMetaSchema, nullable: true },
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
            return reply.send({ success: true, netAmount: tx.netAmount, feeAmount: tx.feeAmount, idempotency: true });
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
          if (!env.TABAPAY_ENABLED) throw new AppError("TabaPay not enabled", "PROVIDER_ERROR", 503);
          const res = await pullFromCard({ processorToken: source.processorToken, amount: gross });
          providerRef = res.id;
        } else if (source.routingProvider === "dwolla") {
          if (!env.DWOLLA_ENABLED) throw new AppError("Dwolla not enabled", "PROVIDER_ERROR", 503);
          if (!env.DWOLLA_DEST_FUNDING_SOURCE) {
            throw new AppError("DWOLLA_DEST_FUNDING_SOURCE not configured", "PROVIDER_ERROR", 500);
          }
          const res = await initiateBankTransfer({
            sourceFundingSource: source.processorToken,
            destinationFundingSource: env.DWOLLA_DEST_FUNDING_SOURCE,
            amount: gross,
            correlationId: getCorrelationMeta().requestId,
          });
          providerRef = res.id;
        } else {
          throw new AppError("Unsupported routing provider", "PROVIDER_ERROR", 400);
        }
        if (providerRef) setContextField("providerCorrelationId", providerRef);

        await db.transaction(async (tx) => {
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
        });

        return reply.send({
          success: true,
          netAmount: net,
          feeAmount: fee,
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

  // Cash out (Flow 3A card, 3B bank) - amount is gross requested from wallet
  app.post(
    "/api/v1/wallet/cashout",
    {
      preHandler: [requireAuth],
      config: { rateLimit: RATE_LIMITS.transact },
      schema: {
        body: {
          type: "object",
          required: ["userId", "amount", "fundingSourceId", "idempotencyKey"],
          properties: {
            userId: { type: "string", format: "uuid" },
            amount: amountSchema, // gross debited from wallet
            fundingSourceId: { type: "string", format: "uuid" },
            idempotencyKey: { type: "string", minLength: 1 },
            deviceInfo: { ...deviceInfoSchema, nullable: true },
            ipAddress: { type: "string", nullable: true },
            riskMeta: { ...riskMetaSchema, nullable: true },
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

        const existing = await db
          .select()
          .from(transactions)
          .where(
            and(
              eq(transactions.transactionType, "cashout"),
              eq(transactions.idempotencyKey, idempotencyKey),
              eq(transactions.walletId, wallet.id),
            ),
          );
        if (existing.length) {
          const tx = existing[0];
          if (tx.status === "completed") {
            return reply.send({ success: true, netAmount: tx.netAmount, feeAmount: tx.feeAmount, idempotency: true });
          }
          throw new AppError("Cashout in progress or failed", "IDEMPOTENT_REPLAY", 409);
        }

        const [source] = await db
          .select()
          .from(fundingSources)
          .where(and(eq(fundingSources.id, fundingSourceId), eq(fundingSources.userId, userId)));
        if (!source || !source.isActive) throw new AppError("Funding source not found", "NOT_FOUND", 404);

        const { net, fee } = calculateFeeFromGross(amount);

        // Hold funds and create pending cashout transaction atomically
        const hold = await db.transaction(async (tx) => {
          const [lockedWallet] = await tx
            .select()
            .from(wallets)
            .where(eq(wallets.userId, userId))
            .for("update");
          if (!lockedWallet) throw new AppError("Wallet not found", "NOT_FOUND", 404);
          if (lockedWallet.status !== "active") throw new AppError("Wallet not active", "CONFLICT", 409);

          const currentBalance = new Decimal(lockedWallet.availableBalance as unknown as string);
          if (currentBalance.lt(new Decimal(amount))) {
            throw new AppError("Insufficient funds", "INSUFFICIENT_FUNDS", 400);
          }

          await assertWithinDailyLimit({ walletId: lockedWallet.id, transactionType: "cashout", amount: net, db: tx });
          await assertNotDuplicate({ walletId: lockedWallet.id, transactionType: "cashout", amount: net, db: tx });
          await assertRiskAllow({
            walletId: lockedWallet.id,
            transactionType: "cashout",
            amount: net,
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
            .where(eq(wallets.id, lockedWallet.id));

          const [created] = await tx
            .insert(transactions)
            .values({
              walletId: lockedWallet.id,
              transactionType: "cashout",
              status: "pending",
              lifecycle: "authorized",
              grossAmount: amount,
              netAmount: net,
              feeAmount: fee,
              idempotencyKey,
              riskMeta: riskMeta ? JSON.stringify(riskMeta) : null,
              deviceInfo: deviceInfo ? JSON.stringify(deviceInfo) : null,
              ipAddress: ipAddress ?? null,
            })
            .returning({ id: transactions.id, walletId: transactions.walletId });

          return { walletId: lockedWallet.id, txId: created.id };
        });

        setContextField("transactionId", hold.txId);
        let providerRef: string | undefined;
        try {
          if (source.routingProvider === "tabapay") {
            if (!env.TABAPAY_ENABLED) throw new AppError("TabaPay not enabled", "PROVIDER_ERROR", 503);
            const res = await pushToCard({ processorToken: source.processorToken, amount: net });
            providerRef = res.id;
          } else if (source.routingProvider === "dwolla") {
            if (!env.DWOLLA_ENABLED) throw new AppError("Dwolla not enabled", "PROVIDER_ERROR", 503);
            if (!env.DWOLLA_SOURCE_FUNDING_SOURCE) {
              throw new AppError("DWOLLA_SOURCE_FUNDING_SOURCE not configured", "PROVIDER_ERROR", 500);
            }
            const res = await pushToBank({
              sourceFundingSource: env.DWOLLA_SOURCE_FUNDING_SOURCE,
              destinationFundingSource: source.processorToken,
              amount: net,
              correlationId: getCorrelationMeta().requestId,
            });
            providerRef = res.id;
          } else {
            throw new AppError("Unsupported routing provider", "PROVIDER_ERROR", 400);
          }
          if (providerRef) setContextField("providerCorrelationId", providerRef);
        } catch (err) {
          await db.transaction(async (tx) => {
            await tx
              .update(wallets)
              .set({
                availableBalance: sql`available_balance + ${amount}`,
                lockedBalance: sql`locked_balance - ${amount}`,
              })
              .where(eq(wallets.id, hold.walletId));
            await tx
              .update(transactions)
              .set({
                status: "failed",
                lifecycle: "failed",
                failureReason: err instanceof Error ? err.message : "provider_failed",
                completedAt: new Date(),
              })
              .where(eq(transactions.id, hold.txId));
          });
          throw err;
        }

        await db.transaction(async (tx) => {
          await tx
            .update(transactions)
            .set({
              status: "completed",
              lifecycle: "completed",
              providerRef,
              completedAt: new Date(),
            })
            .where(eq(transactions.id, hold.txId));

          await tx
            .update(wallets)
            .set({
              lockedBalance: sql`locked_balance - ${amount}`,
            })
            .where(eq(wallets.id, hold.walletId));
        });

        return reply.send({
          success: true,
          netAmount: net,
          feeAmount: fee,
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
