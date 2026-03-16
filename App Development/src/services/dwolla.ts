import { env } from "../lib/env";
import { AppError } from "../lib/errors";
import { SUPPORTED_CURRENCY } from "../lib/constants";

const authHeader = `Basic ${Buffer.from(`${env.DWOLLA_APP_KEY}:${env.DWOLLA_APP_SECRET}`).toString("base64")}`;

async function dwollaRequest<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${env.DWOLLA_ENV_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new AppError(error?.message || "Dwolla API error", "PROVIDER_ERROR", res.status);
  }

  const location = res.headers.get("location") || undefined;
  const data = (await res.json().catch(() => ({}))) as T;
  return { ...data, location } as T;
}

export async function initiateBankTransfer(params: {
  sourceFundingSource: string;
  destinationFundingSource: string;
  amount: string;
  currency?: string;
  correlationId?: string;
}) {
  const { sourceFundingSource, destinationFundingSource, amount, currency = SUPPORTED_CURRENCY, correlationId } = params;
  const payload = {
    _links: {
      source: { href: sourceFundingSource },
      destination: { href: destinationFundingSource },
    },
    amount: {
      currency,
      value: amount,
    },
    correlationId,
  };

  const res = await dwollaRequest<{ id?: string; location?: string }>("/transfers", payload);
  const id = res.id ?? res.location?.split("/").pop();
  return { id, location: res.location };
}

export async function pushToBank(params: {
  sourceFundingSource: string;
  destinationFundingSource: string;
  amount: string;
  currency?: string;
  correlationId?: string;
}) {
  return initiateBankTransfer(params);
}
