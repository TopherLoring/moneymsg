import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../../config/env";
import fs from "fs";

function buildSslConfig(): false | { rejectUnauthorized: boolean; ca?: string } {
  if (env.DB_SSL_MODE === "disable") return false;

  const config: { rejectUnauthorized: boolean; ca?: string } = {
    rejectUnauthorized: env.DB_SSL_MODE === "verify-ca" || env.DB_SSL_MODE === "verify-full",
  };

  if (env.DB_SSL_CA) {
    // Accept either a file path or inline PEM
    config.ca = env.DB_SSL_CA.startsWith("-----")
      ? env.DB_SSL_CA
      : fs.readFileSync(env.DB_SSL_CA, "utf-8");
  }

  return config;
}

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  ssl: env.DB_SSL_MODE === "disable" ? false : buildSslConfig(),
});

export const db = drizzle(pool);
export { pool };
