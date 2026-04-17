import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../lib/env";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  ssl: env.DATABASE_URL.includes("localhost") ? undefined : { rejectUnauthorized: false },
});

export const db = drizzle(pool);
export type DbClient = typeof db;
