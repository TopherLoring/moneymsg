import { AppError } from "../../shared/errors";

export type RiskInput = {
  walletId: string;
  transactionType: "load" | "cashout" | "p2p_send" | "p2p_receive";
  amount: string;
  deviceInfo?: unknown;
  ipAddress?: string;
  riskMeta?: Record<string, unknown>;
};

export type RiskDecision = {
  allow: boolean;
  reason?: string;
  score?: number;
};

// Placeholder pluggable scorer: returns allow=true. Swap with a real model later.
export async function evaluateRisk(_input: RiskInput): Promise<RiskDecision> {
  // Integrate with risk engine here (e.g., via MCP/HTTP). Must resolve quickly.
  return { allow: true };
}

export async function assertRiskAllow(input: RiskInput) {
  const decision = await evaluateRisk(input);
  if (!decision.allow) {
    throw new AppError(decision.reason || "Risk rejected", "UNAUTHORIZED", 403);
  }
  return decision;
}
