import { env } from "../../config/env";
import { AppError } from "../../shared/errors";

const headers = { "Content-Type": "application/json" };

const baseBody = {
  client_id: env.PLAID_CLIENT_ID,
  secret: env.PLAID_SECRET,
};

async function plaidFetch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${env.PLAID_ENV_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as T & { error_message?: string };
  if (!res.ok) {
    throw new AppError(data?.error_message || "Plaid API error", "PROVIDER_ERROR", res.status);
  }
  return data;
}

export async function createLinkToken(userId: string) {
  return plaidFetch<{ link_token: string }>("/link/token/create", {
    ...baseBody,
    client_name: "MoneyMsg",
    country_codes: ["US"],
    language: "en",
    products: ["auth"],
    user: { client_user_id: userId },
  });
}

export async function exchangePublicToken(params: {
  publicToken: string;
  accountId: string;
  routingTarget: "tabapay" | "dwolla";
}) {
  const exchange = await plaidFetch<{ access_token: string; item_id: string }>("/item/public_token/exchange", {
    ...baseBody,
    public_token: params.publicToken,
  });

  const processor = await plaidFetch<{ processor_token: string }>("/processor/token/create", {
    ...baseBody,
    access_token: exchange.access_token,
    account_id: params.accountId,
    processor: params.routingTarget,
  });

  return { processorToken: processor.processor_token, itemId: exchange.item_id };
}
