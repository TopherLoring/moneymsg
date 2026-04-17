ALTER TABLE "transactions"
  ADD COLUMN "idempotency_key" text;

CREATE UNIQUE INDEX "idx_transactions_idempotent"
  ON "transactions" ("transaction_type", "idempotency_key")
  WHERE idempotency_key IS NOT NULL;
