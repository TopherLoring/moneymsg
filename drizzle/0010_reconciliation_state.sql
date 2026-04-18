-- Add reconciliation state model to webhook_events
-- Supports logged → reconciled → finalized lifecycle with replay-safe processing

CREATE TYPE "public"."webhook_state" AS ENUM('logged', 'reconciled', 'finalized');

ALTER TABLE "webhook_events"
  ADD COLUMN "reconciliation_state" "webhook_state" NOT NULL DEFAULT 'logged',
  ADD COLUMN "correlation_request_id" text,
  ADD COLUMN "reconciled_at" timestamp,
  ADD COLUMN "finalized_at" timestamp,
  ADD COLUMN "retry_count" text NOT NULL DEFAULT '0',
  ADD COLUMN "last_error" text;

-- Back-fill: events that are already processed are finalized
UPDATE "webhook_events" SET "reconciliation_state" = 'finalized' WHERE "processed" = true;

CREATE INDEX "idx_webhook_events_recon_state" ON "webhook_events" ("reconciliation_state");
