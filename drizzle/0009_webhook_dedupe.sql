CREATE UNIQUE INDEX IF NOT EXISTS "idx_webhook_events_unique"
  ON "webhook_events" ("provider", "provider_ref", "event_type");
