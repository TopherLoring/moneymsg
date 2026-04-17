# MoneyMsg Backend (Fastify / TypeScript)

## Running locally
1. Copy `.env.example` to `.env` and fill in provider credentials.
2. Install deps: `npm install`
3. Build: `npm run build`
4. Start API: `npm run dev` (or `npm start` after build)
5. Start intent sweeper (separate terminal): `npm run dev:sweeper`
6. Start request sweeper: `npm run dev:request-sweeper`

## Auth
- All API routes expect an API key header: `X-API-Key: ${API_KEY}`. If `API_KEY` is unset, auth is skipped (useful for local dev).
- Webhook endpoints remain unauthenticated to allow provider callbacks; they verify HMAC signatures instead.
- Webhook signature hardening: optional shared secret header (`X-Webhook-Secret`), HMAC with provider secret, and timestamp tolerance (`WEBHOOK_MAX_SKEW_SECONDS`, default 300s). Timestamp headers used: TabaPay `x-tabapay-timestamp`, Dwolla `x-request-timestamp`.

## Environment variables
See `.env.example` for the full list:
- DATABASE_URL
- ALVIERE_API_KEY / ALVIERE_API_URL
- PLAID_CLIENT_ID / PLAID_SECRET / PLAID_ENV_URL
- TABAPAY_API_KEY / TABAPAY_API_URL / TABAPAY_WEBHOOK_SECRET
- DWOLLA_APP_KEY / DWOLLA_APP_SECRET / DWOLLA_ENV_URL / DWOLLA_WEBHOOK_SECRET
- DWOLLA_DEST_FUNDING_SOURCE (load destination) / DWOLLA_SOURCE_FUNDING_SOURCE (cashout source)
- API_KEY (server auth), PORT

## Migrations
Apply in order:
0001_init.sql, 0002_add_idempotency.sql, 0003_add_provider_ref.sql, 0004_locked_balance_links_webhooks.sql, 0005_tx_risk_meta.sql, 0006_provider_ref_unique.sql, 0007_risk_device_ip.sql, 0008_payment_requests.sql, 0009_webhook_dedupe.sql

## Testing notes
- Webhook HMACs must use the raw request body; signatures are compared with timingSafeEqual.
- Idempotency required for load/cashout/funded-P2P; duplicate calls with the same key return prior result.
- Sweeper reverses expired P2P intents and unlocks funds after 24h.

## Risk hooks
- Daily limits and duplicate window configured in `src/lib/constants.ts`.
- Risk metadata (device/ip/riskMeta) is stored per transaction and passed through a pluggable scorer in `src/lib/riskScorer.ts`.
