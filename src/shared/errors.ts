export type ErrorCode =
  | "VALIDATION_FAILED"
  | "NOT_FOUND"
  | "INSUFFICIENT_FUNDS"
  | "PROVIDER_ERROR"
  | "IDEMPOTENT_REPLAY"
  | "UNAUTHORIZED"
  | "CONFLICT"
  | "INTERNAL_ERROR"
  | "RISK_DENY"
  | "RISK_REVIEW"
  | "RISK_STEP_UP";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly status: number;

  constructor(message: string, code: ErrorCode = "INTERNAL_ERROR", status = 500) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export class ProviderError extends AppError {
  public readonly provider: string;
  public readonly providerStatus: number;
  public readonly correlationId?: string;

  constructor(opts: {
    provider: string;
    message: string;
    providerStatus: number;
    correlationId?: string;
  }) {
    super(`${opts.provider}: ${opts.message}`, "PROVIDER_ERROR", opts.providerStatus >= 500 ? 502 : 400);
    this.provider = opts.provider;
    this.providerStatus = opts.providerStatus;
    this.correlationId = opts.correlationId;
  }
}

export const toErrorResponse = (err: unknown) => {
  if (err instanceof AppError) {
    return { status: err.status, body: { error: err.message, code: err.code } };
  }
  return { status: 500, body: { error: "Internal server error", code: "INTERNAL_ERROR" as ErrorCode } };
};
