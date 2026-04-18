import { env } from "../../config/env";
import { AppError, ProviderError } from "../../shared/errors";
import { getRequestContext } from "../../shared/requestContext";

type KycResult = {
  memberId: string;
  accountId: string;
  kycStatus: "pending" | "approved" | "rejected";
};

export async function submitKyc(kycData: Record<string, unknown>): Promise<KycResult> {
  const res = await fetch(`${env.ALVIERE_API_URL}/kyc/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.ALVIERE_API_KEY}`,
    },
    body: JSON.stringify(kycData),
  });

  const data = (await res.json().catch(() => ({}))) as Partial<KycResult> & { message?: string; status?: string };

  if (!res.ok) {
    throw new ProviderError({
      provider: "alviere",
      message: data?.message || "KYC submission failed",
      providerStatus: res.status,
      correlationId: getRequestContext()?.requestId,
    });
  }

  if (!data.memberId || !data.accountId || !data.kycStatus) {
    throw new AppError("Incomplete KYC response", "PROVIDER_ERROR", 502);
  }

  return {
    memberId: data.memberId,
    accountId: data.accountId,
    kycStatus: data.kycStatus as KycResult["kycStatus"],
  };
}
