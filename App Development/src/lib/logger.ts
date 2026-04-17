// MoneyMsg — Structured Logger with PII Redaction
// v1.0.0 — 2026.04.17

import pino from "pino";

// Paths that will be replaced with "[REDACTED]" in all log output.
// Uses pino's built-in redaction — these are JSON pointer paths.
const REDACT_PATHS = [
  // Auth
  "req.headers.authorization",
  "req.headers['x-api-key']",
  "req.headers.cookie",

  // KYC / PII fields (top-level and nested)
  "kycData.ssn",
  "kycData.socialSecurityNumber",
  "kycData.dateOfBirth",
  "kycData.address",
  "kycData.address1",
  "kycData.address2",
  "kycData.phone",
  "kycData.email",
  "kycData.firstName",
  "kycData.lastName",
  "body.kycData",

  // Plaid / processor tokens
  "body.publicToken",
  "body.processorToken",
  "processorToken",
  "access_token",

  // Phone / email from user objects
  "user.phone",
  "user.email",
  "phone",
  "email",

  // Provider secrets in outbound calls
  "secret",
  "apiKey",

  // Device fingerprints
  "body.deviceInfo",
  "deviceInfo",
];

export function createLogger() {
  const level = process.env.LOG_LEVEL ?? "info";
  const isDev = process.env.NODE_ENV === "development";

  return pino({
    level,
    redact: {
      paths: REDACT_PATHS,
      censor: "[REDACTED]",
    },
    serializers: {
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
      err: pino.stdSerializers.err,
    },
    ...(isDev
      ? { transport: { target: "pino-pretty", options: { colorize: true } } }
      : {}),
  });
}

export const logger = createLogger();
export type Logger = pino.Logger;
