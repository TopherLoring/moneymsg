CREATE UNIQUE INDEX IF NOT EXISTS "idx_transactions_provider_ref_unique"
  ON "transactions" ("provider_ref")
  WHERE provider_ref IS NOT NULL;
