import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z
  .object({
    // --- Database ---
    DATABASE_URL: z.string().min(1),
    DB_SSL_MODE: z.enum(["disable", "require", "verify-ca", "verify-full"]).default("require"),
    DB_SSL_CA: z.string().optional(),

    // --- Auth & session ---
    JWT_SECRET: z.string().min(32),
    JWT_ISSUER: z.string().default("moneymsg"),
    JWT_ACCESS_TTL_SECONDS: z.coerce.number().int().positive().default(900),
    JWT_REFRESH_TTL_SECONDS: z.coerce.number().int().positive().default(604800),

    // --- Webhook security ---
    TABAPAY_WEBHOOK_SECRET: z.string().min(1),
    DWOLLA_WEBHOOK_SECRET: z.string().min(1),
    WEBHOOK_SHARED_SECRET: z.string().min(1),
    WEBHOOK_MAX_SKEW_SECONDS: z.coerce.number().int().positive().default(300),

    // --- App ---
    PORT: z.coerce.number().int().positive().default(8080),
    NODE_ENV: z.enum(["development", "staging", "production", "test"]).default("development"),
    LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),

    // --- Alviere (required — core P2P settlement) ---
    ALVIERE_API_KEY: z.string().min(1),
    ALVIERE_API_URL: z.string().url(),

    // --- Feature flags (default on; set to false to disable optional integrations) ---
    PLAID_ENABLED: z.preprocess((v) => (typeof v === "string" ? v === "true" || v === "1" : v), z.boolean()).default(true),
    DWOLLA_ENABLED: z.preprocess((v) => (typeof v === "string" ? v === "true" || v === "1" : v), z.boolean()).default(true),
    TABAPAY_ENABLED: z.preprocess((v) => (typeof v === "string" ? v === "true" || v === "1" : v), z.boolean()).default(true),

    // --- Plaid (optional when PLAID_ENABLED=false) ---
    PLAID_CLIENT_ID: z.string().min(1).optional(),
    PLAID_SECRET: z.string().min(1).optional(),
    PLAID_ENV_URL: z.string().url().optional(),

    // --- TabaPay (optional when TABAPAY_ENABLED=false) ---
    TABAPAY_API_KEY: z.string().min(1).optional(),
    TABAPAY_API_URL: z.string().url().optional(),

    // --- Dwolla (optional when DWOLLA_ENABLED=false) ---
    DWOLLA_APP_KEY: z.string().min(1).optional(),
    DWOLLA_APP_SECRET: z.string().min(1).optional(),
    DWOLLA_ENV_URL: z.string().url().optional(),
    DWOLLA_DEST_FUNDING_SOURCE: z.string().optional(),
    DWOLLA_SOURCE_FUNDING_SOURCE: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.PLAID_ENABLED) {
      for (const key of ["PLAID_CLIENT_ID", "PLAID_SECRET", "PLAID_ENV_URL"] as const) {
        if (!data[key]) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: [key], message: "Required when PLAID_ENABLED=true" });
        }
      }
    }
    if (data.DWOLLA_ENABLED) {
      for (const key of ["DWOLLA_APP_KEY", "DWOLLA_APP_SECRET", "DWOLLA_ENV_URL"] as const) {
        if (!data[key]) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: [key], message: "Required when DWOLLA_ENABLED=true" });
        }
      }
    }
    if (data.TABAPAY_ENABLED) {
      for (const key of ["TABAPAY_API_KEY", "TABAPAY_API_URL"] as const) {
        if (!data[key]) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: [key], message: "Required when TABAPAY_ENABLED=true" });
        }
      }
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const errors = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
  throw new Error(`Invalid environment: ${errors}`);
}

export const env = parsed.data;
export const port = env.PORT;
