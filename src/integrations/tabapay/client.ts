import { env } from "../../config/env";
import { AppError, ProviderError } from "../../shared/errors";
import { ProviderError } from "../../shared/errors";
import { SUPPORTED_CURRENCY } from "../../config/constants";
import { getCorrelationMeta } from "../../shared/requestContext";

function tabapayHeaders(): Record<string, string> {
  if (!env.TABAPAY_API_KEY) {
    throw new AppError("TabaPay not configured", "PROVIDER_ERROR", 503);
  }
  const correlationId = getCorrelationMeta().requestId;
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${env.TABAPAY_API_KEY}`,
    ...(correlationId ? { "x-correlation-id": correlationId } : {}),
  };
}

function tabapayBase(): string {
  if (!env.TABAPAY_API_URL) {
    throw new AppError("TabaPay not configured", "PROVIDER_ERROR", 503);
  }
  return env.TABAPAY_API_URL;
}

type CardPullRequest = {
  processorToken: string;
  amount: string;
  currency?: string;
  description?: string;
};

export type CardPullResponse = {
  id: string;
  status: string;
};

export async function pullFromCard(req: CardPullRequest): Promise<CardPullResponse> {
  const res = await fetch(`${tabapayBase()}/debits`, {
    method: "POST",
    headers: tabapayHeaders(),
    body: JSON.stringify({
      processor_token: req.processorToken,
      amount: req.amount,
      currency: req.currency ?? SUPPORTED_CURRENCY,
      description: req.description ?? "MoneyMsg wallet load",
    }),
  });

  const data = (await res.json().catch(() => ({}))) as CardPullResponse & { message?: string };
  if (!res.ok) {
    throw new ProviderError({
      provider: "tabapay",
      message: data?.message || "Debit failed",
      providerStatus: res.status,
      correlationId: getCorrelationMeta().requestId,
    });
  }
  return data;
}

type CardPushRequest = {
  processorToken: string;
  amount: string;
  currency?: string;
  description?: string;
};

export async function pushToCard(req: CardPushRequest): Promise<{ id: string; status: string }> {
  const res = await fetch(`${tabapayBase()}/credits`, {
    method: "POST",
    headers: tabapayHeaders(),
    body: JSON.stringify({
      processor_token: req.processorToken,
      amount: req.amount,
      currency: req.currency ?? SUPPORTED_CURRENCY,
      description: req.description ?? "MoneyMsg cashout",
    }),
  });

  const data = (await res.json().catch(() => ({}))) as { id?: string; status?: string; message?: string };
  if (!res.ok) {
    throw new ProviderError({
      provider: "tabapay",
      message: data?.message || "Credit failed",
      providerStatus: res.status,
      correlationId: getCorrelationMeta().requestId,
    });
  }
  return { id: data.id!, status: data.status! };
}
