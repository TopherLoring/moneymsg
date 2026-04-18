import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  // --- Database ---
  DATABASE_URL: z.string().min(1),
  DB_SSL_MODE: z.enum(["disable", "require", "verify-ca", "verify-full"]).default("require"),
  DB_SSL_CA: z.string().optional(), // path or PEM string for verify-ca/verify-full

  // --- Provider API keys ---
  ALVIERE_API_KEY: z.string().min(1),
  ALVIERE_API_URL: z.string().url(),
  PLAID_CLIENT_ID: z.string().min(1),
  PLAID_SECRET: z.string().min(1),
  PLAID_ENV_URL: z.string().url(),
  TABAPAY_API_KEY: z.string().min(1),
  TABAPAY_API_URL: z.string().url(),
  DWOLLA_APP_KEY: z.string().min(1),
  DWOLLA_APP_SECRET: z.string().min(1),
  DWOLLA_ENV_URL: z.string().url(),
  DWOLLA_DEST_FUNDING_SOURCE: z.string().optional(),
  DWOLLA_SOURCE_FUNDING_SOURCE: z.string().optional(),

  // --- Auth & session ---
  JWT_SECRET: z.string().min(32),
  JWT_ISSUER: z.string().default("moneymsg"),
  JWT_ACCESS_TTL_SECONDS: z.coerce.number().int().positive().default(900), // 15 min
  JWT_REFRESH_TTL_SECONDS: z.coerce.number().int().positive().default(604800), // 7 days

  // --- Webhook security ---
  TABAPAY_WEBHOOK_SECRET: z.string().min(1),
  DWOLLA_WEBHOOK_SECRET: z.string().min(1),
  WEBHOOK_SHARED_SECRET: z.string().min(1),
  WEBHOOK_MAX_SKEW_SECONDS: z.coerce.number().int().positive().default(300),

  // --- App ---
  PORT: z.coerce.number().int().positive().default(8080),
  NODE_ENV: z.enum(["development", "staging", "production", "test"]).default("development"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const errors = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
  throw new Error(`Invalid environment: ${errors}`);
}

export const env = parsed.data;
export const port = env.PORT;
