CREATE TABLE "payment_requests" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "requester_wallet_id" uuid NOT NULL REFERENCES "wallets"("id") ON DELETE CASCADE,
  "requester_user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "payer_user_id" uuid REFERENCES "users"("id") ON DELETE SET NULL,
  "amount" numeric(15,4) NOT NULL,
  "status" tx_lifecycle NOT NULL DEFAULT 'created',
  "deep_link" text NOT NULL,
  "idempotency_key" text,
  "risk_meta" text,
  "device_info" text,
  "ip_address" text,
  "expires_at" timestamp NOT NULL,
  "completed_at" timestamp,
  "created_at" timestamp NOT NULL DEFAULT now()
);
