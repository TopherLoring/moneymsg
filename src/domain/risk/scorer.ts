import { AppError } from "../../shared/errors";

type RiskInput = {
  walletId: string;
  transactionType: "load" | "cashout" | "p2p_send" | "p2p_receive";
  amount: string;
  deviceInfo?: Record<string, unknown>;
  ipAddress?: string;
  riskMeta?: Record<string, unknown>;
};

type RiskDecision = {
  action: "allow" | "step_up" | "review" | "deny";
  reason?: string;
  score: number; // 0–100
};

// Hard per-type amount ceilings — anything above is an automatic deny
const TYPE_HARD_LIMITS: Record<string, number> = {
  load: 5000,
  cashout: 2500,
  p2p_send: 5000,
  p2p_receive: 10000,
};

async function evaluateRisk(input: RiskInput): Promise<RiskDecision> {
  const amount = parseFloat(input.amount);
  const hardLimit = TYPE_HARD_LIMITS[input.transactionType];

  if (hardLimit && amount > hardLimit) {
    return { action: "deny", reason: "amount_exceeds_hard_limit", score: 100 };
  }

  let score = 0;
  let topReason: string | undefined;

  const flag = (points: number, reason: string) => {
    score += points;
    if (!topReason) topReason = reason;
  };

  // Device signals
  if (!input.deviceInfo) {
    flag(20, "missing_device_info");
  } else {
    if (input.deviceInfo.vpn === true) flag(25, "vpn_detected");
    if (input.deviceInfo.jailbroken === true) flag(30, "jailbroken_device");
    if (input.deviceInfo.newDevice === true) flag(15, "new_device");
    if (input.deviceInfo.deviceChange === true) flag(20, "device_change");
  }

  // Risk meta signals
  if (input.riskMeta) {
    if (input.riskMeta.velocityFlag === true) flag(30, "velocity_flag");
    if (input.riskMeta.ipReputation === "blocked") flag(40, "blocked_ip");
    if (input.riskMeta.ipReputation === "suspect") flag(20, "suspect_ip");
  }

  // IP absence
  if (!input.ipAddress) flag(10, "missing_ip");

  // Amount risk contribution
  if (amount > 1000) flag(20, "high_amount");
  else if (amount > 500) flag(10, "elevated_amount");

  const action =
    score >= 85 ? "deny"
    : score >= 60 ? "review"
    : score >= 40 ? "step_up"
    : "allow";

  return { action, reason: topReason, score };
}

export async function assertRiskAllow(input: RiskInput): Promise<RiskDecision> {
  const decision = await evaluateRisk(input);
  if (decision.action === "deny") {
    throw new AppError(decision.reason ?? "Transaction denied by risk engine", "RISK_DENY", 403);
  }
  if (decision.action === "review") {
    throw new AppError(decision.reason ?? "Transaction held for review", "RISK_REVIEW", 403);
  }
  if (decision.action === "step_up") {
    throw new AppError(decision.reason ?? "Additional verification required", "RISK_STEP_UP", 403);
  }
  return decision;
}
