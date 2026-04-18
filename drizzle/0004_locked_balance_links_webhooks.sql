ALTER TABLE "wallets"
  ADD COLUMN "locked_balance" numeric(15,4) NOT NULL DEFAULT '0.0000';

CREATE TYPE "tx_lifecycle" AS ENUM ('created','validating','authorized','processing','settled','completed','failed','reversed','expired');

ALTER TABLE "transactions"
  ADD COLUMN "lifecycle" tx_lifecycle NOT NULL DEFAULT 'created';

CREATE TABLE "payment_links" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "transaction_id" uuid NOT NULL REFERENCES "transactions"("id") ON DELETE CASCADE,
  "sender_wallet_id" uuid NOT NULL REFERENCES "wallets"("id") ON DELETE CASCADE,
  "status" tx_lifecycle NOT NULL DEFAULT 'created',
  "deep_link" text NOT NULL,
  "expires_at" timestamp NOT NULL,
  "claimed_at" timestamp,
  "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE "webhook_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "provider" text NOT NULL,
  "event_type" text NOT NULL,
  "provider_ref" text,
  "payload" text NOT NULL,
  "processed" boolean NOT NULL DEFAULT false,
  "processed_at" timestamp,
  "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX "idx_webhook_events_provider_ref" ON "webhook_events" ("provider", "provider_ref");
