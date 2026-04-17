import { env } from "../lib/env";
import { AppError } from "../lib/errors";
import { SUPPORTED_CURRENCY } from "../lib/constants";

type TransferPayload = {
  fromAccountId: string;
  toAccountId: string;
  amount: string; // decimal string
  currency?: string;
  description?: string;
};

async function alviereFetch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${env.ALVIERE_API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.ALVIERE_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as T & { message?: string };

  if (!res.ok) {
    throw new AppError(data?.["message"] || "Alviere API error", "PROVIDER_ERROR", res.status);
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
