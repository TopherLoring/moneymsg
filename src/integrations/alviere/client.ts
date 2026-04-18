import { env } from "../../config/env";
import { ProviderError } from "../../shared/errors";
import { SUPPORTED_CURRENCY } from "../../config/constants";
import { getCorrelationMeta } from "../../shared/requestContext";

type TransferPayload = {
  fromAccountId: string;
  toAccountId: string;
  amount: string;
  currency?: string;
  description?: string;
};

async function alviereFetch<T>(path: string, body: unknown): Promise<T> {
  const correlationId = getCorrelationMeta().requestId;
  const res = await fetch(`${env.ALVIERE_API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.ALVIERE_API_KEY}`,
      ...(correlationId ? { "x-correlation-id": correlationId } : {}),
    },
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as T & { message?: string };

  if (!res.ok) {
    throw new ProviderError({
      provider: "alviere",
      message: data?.["message"] || "API error",
      providerStatus: res.status,
      correlationId: getCorrelationMeta().requestId,
    });
  }

  return data;
}

export async function bookTransfer(payload: TransferPayload) {
  const { fromAccountId, toAccountId, amount, currency = SUPPORTED_CURRENCY, description } = payload;
  const data = await alviereFetch<{ transferId: string }>("/transfers", {
    from_account_id: fromAccountId,
    to_account_id: toAccountId,
    amount,
    currency,
    description,
  });
  return data.transferId;
}
