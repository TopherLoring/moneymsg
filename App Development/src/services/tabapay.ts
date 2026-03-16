import { env } from "../lib/env";
import { AppError } from "../lib/errors";
import { SUPPORTED_CURRENCY } from "../lib/constants";

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
  const res = await fetch(`${env.TABAPAY_API_URL}/debits`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.TABAPAY_API_KEY}`,
    },
    body: JSON.stringify({
      processor_token: req.processorToken,
      amount: req.amount,
      currency: req.currency ?? SUPPORTED_CURRENCY,
      description: req.description ?? "MoneyMsg wallet load",
    }),
  });

  const data = (await res.json().catch(() => ({}))) as CardPullResponse & { message?: string };
  if (!res.ok) {
    throw new AppError(data?.message || "TabaPay debit failed", "PROVIDER_ERROR", res.status);
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
  const res = await fetch(`${env.TABAPAY_API_URL}/credits`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.TABAPAY_API_KEY}`,
    },
    body: JSON.stringify({
      processor_token: req.processorToken,
      amount: req.amount,
      currency: req.currency ?? SUPPORTED_CURRENCY,
      description: req.description ?? "MoneyMsg cashout",
    }),
  });

  const data = (await res.json().catch(() => ({}))) as { id?: string; status?: string; message?: string };
  if (!res.ok) {
    throw new AppError(data?.message || "TabaPay credit failed", "PROVIDER_ERROR", res.status);
  }
  return { id: data.id!, status: data.status! };
}
