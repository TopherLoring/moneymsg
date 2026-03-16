export type ErrorCode =
  | "VALIDATION_FAILED"
  | "NOT_FOUND"
  | "INSUFFICIENT_FUNDS"
  | "PROVIDER_ERROR"
  | "IDEMPOTENT_REPLAY"
  | "UNAUTHORIZED"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly status: number;

  constructor(message: string, code: ErrorCode = "INTERNAL_ERROR", status = 500) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export const toErrorResponse = (err: unknown) => {
  if (err instanceof AppError) {
    return { status: err.status, body: { error: err.message, code: err.code } };
  }
  return { status: 500, body: { error: "Internal server error", code: "INTERNAL_ERROR" as ErrorCode } };
};
