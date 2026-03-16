import { env } from "../lib/env";
import { AppError } from "../lib/errors";

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
    throw new AppError(data?.message || "Alviere KYC failed", "PROVIDER_ERROR", res.status);
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
