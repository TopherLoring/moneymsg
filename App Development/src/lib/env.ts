import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
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
  DWOLLA_DEST_FUNDING_SOURCE: z.string().optional(), // For loads (platform destination)
  DWOLLA_SOURCE_FUNDING_SOURCE: z.string().optional(), // For cashouts (platform source)
  PORT: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const errors = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
  throw new Error(`Invalid environment: ${errors}`);
}

export const env = parsed.data;
export const port = parsed.data.PORT ? Number(parsed.data.PORT) : 8080;
