CREATE TYPE "public"."kyc_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."tx_lifecycle" AS ENUM('created', 'validating', 'authorized', 'processing', 'settled', 'completed', 'failed', 'reversed', 'expired');--> statement-breakpoint
CREATE TYPE "public"."tx_status" AS ENUM('pending', 'completed', 'reversed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."tx_type" AS ENUM('load', 'cashout', 'p2p_send', 'p2p_receive');--> statement-breakpoint
CREATE TYPE "public"."wallet_status" AS ENUM('active', 'frozen', 'closed');--> statement-breakpoint
CREATE TYPE "public"."webhook_state" AS ENUM('logged', 'reconciled', 'finalized');--> statement-breakpoint
CREATE TABLE "funding_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"source_type" text NOT NULL,
	"institution_name" text NOT NULL,
	"mask" text NOT NULL,
	"plaid_item_id" text NOT NULL,
	"processor_token" text NOT NULL,
	"routing_provider" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transaction_id" uuid NOT NULL,
	"sender_wallet_id" uuid NOT NULL,
	"status" "tx_lifecycle" DEFAULT 'created' NOT NULL,
	"deep_link" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"claimed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_id" uuid NOT NULL,
	"transaction_type" "tx_type" NOT NULL,
	"status" "tx_status" DEFAULT 'pending' NOT NULL,
	"lifecycle" "tx_lifecycle" DEFAULT 'created' NOT NULL,
	"idempotency_key" text,
	"provider_ref" text,
	"risk_meta" text,
	"device_info" text,
	"ip_address" text,
	"gross_amount" numeric(15, 4) NOT NULL,
	"net_amount" numeric(15, 4) NOT NULL,
	"fee_amount" numeric(15, 4) NOT NULL,
	"expires_at" timestamp,
	"failure_reason" text,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"alviere_member_id" text,
	"kyc_status" "kyc_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "wallets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"alviere_account_id" text NOT NULL,
	"available_balance" numeric(15, 4) DEFAULT '0.0000' NOT NULL,
	"locked_balance" numeric(15, 4) DEFAULT '0.0000' NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"status" "wallet_status" DEFAULT 'active' NOT NULL,
	"last_synced_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "wallets_alviere_account_id_unique" UNIQUE("alviere_account_id")
);
--> statement-breakpoint
CREATE TABLE "webhook_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" text NOT NULL,
	"event_type" text NOT NULL,
	"provider_ref" text,
	"payload" text NOT NULL,
	"reconciliation_state" "webhook_state" DEFAULT 'logged' NOT NULL,
	"correlation_request_id" text,
	"processed" boolean DEFAULT false NOT NULL,
	"processed_at" timestamp,
	"reconciled_at" timestamp,
	"finalized_at" timestamp,
	"retry_count" text DEFAULT '0' NOT NULL,
	"last_error" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "funding_sources" ADD CONSTRAINT "funding_sources_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_links" ADD CONSTRAINT "payment_links_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_links" ADD CONSTRAINT "payment_links_sender_wallet_id_wallets_id_fk" FOREIGN KEY ("sender_wallet_id") REFERENCES "public"."wallets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_wallet_id_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_transactions_expiration" ON "transactions" USING btree ("status","expires_at") WHERE "transactions"."status" = 'pending';--> statement-breakpoint
CREATE UNIQUE INDEX "idx_transactions_idempotent" ON "transactions" USING btree ("transaction_type","idempotency_key") WHERE "transactions"."idempotency_key" IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "wallets_user_unique" ON "wallets" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_webhook_events_provider_ref" ON "webhook_events" USING btree ("provider","provider_ref","event_type");--> statement-breakpoint
CREATE INDEX "idx_webhook_events_recon_state" ON "webhook_events" USING btree ("reconciliation_state");