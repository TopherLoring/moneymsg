import { env } from "../../config/env";
import { AppError, ProviderError } from "../../shared/errors";
import { getRequestContext } from "../../shared/requestContext";

async function plaidFetch<T>(path: string, body: unknown): Promise<T> {
  if (!env.PLAID_ENV_URL || !env.PLAID_CLIENT_ID || !env.PLAID_SECRET) {
    throw new AppError("Plaid not configured", "PROVIDER_ERROR", 503);
  }
  const correlationId = getRequestContext()?.requestId;
  const res = await fetch(`${env.PLAID_ENV_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(correlationId ? { "x-correlation-id": correlationId } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as T & { error_message?: string };
  if (!res.ok) {
    throw new ProviderError({
      provider: "plaid",
      message: data?.error_message || "API error",
      providerStatus: res.status,
      correlationId: getRequestContext()?.requestId,
    });
  }
  return data;
}

export async function createLinkToken(userId: string) {
  return plaidFetch<{ link_token: string }>("/link/token/create", {
    client_id: env.PLAID_CLIENT_ID,
    secret: env.PLAID_SECRET,
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
  const base = { client_id: env.PLAID_CLIENT_ID, secret: env.PLAID_SECRET };

  const exchange = await plaidFetch<{ access_token: string; item_id: string }>("/item/public_token/exchange", {
    ...base,
    public_token: params.publicToken,
  });

  const processor = await plaidFetch<{ processor_token: string }>("/processor/token/create", {
    ...base,
    access_token: exchange.access_token,
    account_id: params.accountId,
    processor: params.routingTarget,
  });

  return { processorToken: processor.processor_token, itemId: exchange.item_id };
}
