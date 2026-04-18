-- Drizzle migration: initial schema for MoneyMsg

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "kyc_status" AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE "tx_status" AS ENUM ('pending', 'completed', 'reversed', 'failed');
CREATE TYPE "tx_type" AS ENUM ('load', 'cashout', 'p2p_send', 'p2p_receive');
CREATE TYPE "wallet_status" AS ENUM ('active', 'frozen', 'closed');

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" text NOT NULL UNIQUE,
  "phone" text NOT NULL UNIQUE,
  "alviere_member_id" text,
  "kyc_status" kyc_status NOT NULL DEFAULT 'pending',
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE "wallets" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "alviere_account_id" text NOT NULL UNIQUE,
  "available_balance" numeric(15,4) NOT NULL DEFAULT '0.0000',
  "currency" text NOT NULL DEFAULT 'USD',
  "status" wallet_status NOT NULL DEFAULT 'active',
  "last_synced_at" timestamp NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX "wallets_user_unique" ON "wallets" ("user_id");

CREATE TABLE "transactions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "wallet_id" uuid NOT NULL REFERENCES "wallets"("id") ON DELETE CASCADE,
  "transaction_type" tx_type NOT NULL,
  "status" tx_status NOT NULL DEFAULT 'pending',
  "gross_amount" numeric(15,4) NOT NULL,
  "net_amount" numeric(15,4) NOT NULL,
  "fee_amount" numeric(15,4) NOT NULL,
  "expires_at" timestamp,
  "failure_reason" text,
  "completed_at" timestamp,
  "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX "idx_transactions_expiration"
  ON "transactions" ("status", "expires_at")
  WHERE status = 'pending';

CREATE TABLE "funding_sources" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "source_type" text NOT NULL,
  "institution_name" text NOT NULL,
  "mask" text NOT NULL,
  "plaid_item_id" text NOT NULL,
  "processor_token" text NOT NULL,
  "routing_provider" text NOT NULL,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamp NOT NULL DEFAULT now()
);
