# MoneyMsg — Claude Project Instructions

## Project Identity

**MoneyMsg** is the Android equivalent of Apple Cash for iMessage.

It is NOT a standalone P2P payment app. It is an OS-level Android keyboard (`InputMethodService`) that embeds payment initiation directly inside any messaging conversation — RCS, SMS, WhatsApp, Signal, Telegram — without requiring the user to switch apps. The keyboard IS the product. The companion app is infrastructure.

- **Entity:** TopherLoring Investments
- **Domain:** moneymsg.site
- **Positioning:** Apple Cash for Android — native payments inside every conversation

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 LTS |
| Framework | Fastify + TypeScript |
| ORM | Drizzle ORM |
| Database | Cloud SQL (PostgreSQL 15) |
| Hosting | Google Cloud Run |
| Keyboard Client | Kotlin (Android `InputMethodService`) |
| Companion App | React Native (Expo) |

### Payment Providers

| Provider | Role |
|---|---|
| Alviere | BaaS ledger, KYC/AML, FBO accounts, zero-cost internal book transfers |
| Plaid | External account auth, `processor_token` generation (avoids PCI scope) |
| TabaPay | Card funding (AFT) and card cash-out (OCT) via Visa Direct / Mastercard Send |
| Dwolla | Bank funding and bank cash-out via RTP Network and FedNow |

---

## Repository Structure

```
moneymsg/
├── src/
│   ├── server.ts              # Fastify entry point
│   ├── db/
│   │   ├── index.ts           # Drizzle client
│   │   └── schema.ts          # All table definitions
│   ├── routes/
│   │   ├── kyc.ts             # POST /api/v1/kyc/submit
│   │   ├── plaid.ts           # POST /api/v1/plaid/*
│   │   ├── wallet.ts          # POST /api/v1/wallet/*
│   │   └── transfer.ts        # POST /api/v1/transfer/*
│   ├── services/
│   │   ├── alviere.ts         # Alviere API client
│   │   ├── tabapay.ts         # TabaPay API client
│   │   ├── dwolla.ts          # Dwolla API client
│   │   └── plaid.ts           # Plaid API client (raw fetch, no SDK)
│   ├── workers/
│   │   └── intentSweeper.ts   # 24-hour TTL expiry worker
│   └── lib/
│       ├── fees.ts            # Fee calculation: 1.75% + $0.50
│       └── errors.ts          # Typed error classes
├── android/                   # Kotlin InputMethodService keyboard
├── companion/                 # React Native Expo app
├── Dockerfile
├── drizzle.config.ts
├── package.json
└── tsconfig.json
```

---

## Architecture Rules

### Money

- **All monetary values use `NUMERIC(15,4)` in PostgreSQL.** Never `FLOAT`, never `DECIMAL` without precision, never JavaScript `number` for currency math.
- **All fee calculations go through `src/lib/fees.ts`.** The platform fee is `1.75% + $0.50` on all external money movement. Never inline this calculation.
- **Internal P2P transfers are zero-cost Alviere book transfers.** Do not route internal transfers through TabaPay or Dwolla.
- **Never store SSN or raw government ID in the local database.** Proxy to Alviere only. Store only the resulting `alviere_member_id`.

### Provider Abstraction

- All provider API calls live in `src/services/`. Routes and business logic never call provider APIs directly.
- Use raw `fetch` for all provider HTTP calls. Do not install the Plaid Node SDK, Dwolla SDK, or any provider-specific package.
- Provider responses must be mapped to internal types before being used in business logic.

### Intent-and-Claim Flow

- The keyboard cannot know the recipient's identity at send time. All P2P sends produce a deep link: `https://moneymsg.site/pay?id={intentId}`
- The intent holds (deducts) the sender's wallet balance immediately upon creation to prevent double-spend.
- Intents expire after 24 hours. The sweeper worker (`src/workers/intentSweeper.ts`) reverses held funds on expiry.
- Claim resolution (`POST /api/v1/transfer/claim`) executes the Alviere book transfer. It is idempotent — duplicate claims on the same `intentId` must be rejected.

### Security

- No secrets in source code. All credentials via environment variables.
- Fastify route handlers validate request bodies with JSON Schema or Zod before processing.
- Cloud SQL uses IAM authentication. No password-based DB connections in production.
- Webhook endpoints from TabaPay and Dwolla must verify signatures before processing.

---

## API Endpoints

```
POST /api/v1/kyc/submit
POST /api/v1/plaid/create-link-token
POST /api/v1/plaid/exchange
POST /api/v1/wallet/load
POST /api/v1/wallet/cashout
POST /api/v1/transfer/intent/wallet     ← keyboard: pre-funded P2P (Flow 2A)
POST /api/v1/transfer/funded-p2p        ← keyboard: JIT-load P2P (Flow 2B)
POST /api/v1/transfer/claim             ← companion app: resolves deep link
```

---

## Database Schema (Drizzle)

```typescript
// Canonical enums
kycStatus:    'pending' | 'approved' | 'rejected'
txStatus:     'pending' | 'completed' | 'reversed' | 'failed'
txType:       'load' | 'cashout' | 'p2p_send' | 'p2p_receive'
walletStatus: 'active' | 'frozen' | 'closed'
sourceType:   'card' | 'bank'
provider:     'tabapay' | 'dwolla'
```

Key constraints:
- `wallets.user_id` is unique — one wallet per user.
- `transactions.expires_at` is set to `NOW() + 24 hours` for all `p2p_send` intents.
- `funding_sources.processor_token` is never returned to the client.
- Partial index on `(status, expires_at) WHERE status = 'pending'` for sweeper performance.

---

## Code Standards

- **Complete, production-ready code only.** No stubs, no `// TODO`, no placeholder logic.
- **TypeScript strict mode.** No `any` unless wrapping an untyped external API response at the boundary, immediately narrowed.
- **Functions do one thing.** If a function is doing validation + DB write + provider call, split it.
- **Explicit error handling.** Never swallow errors. Fastify route errors return structured JSON: `{ error: string, code: string }`.
- **No magic numbers.** Fee rates, TTL values, and retry counts are named constants in `src/lib/`.
- **Drizzle queries only.** No raw SQL strings outside of migration files.
- **Idempotency.** All state-mutating endpoints must be safe to call twice with the same payload.

---

## Environment Variables

```
DATABASE_URL           # Cloud SQL connection string (IAM auth in prod)
ALVIERE_API_KEY        # Alviere production API key
ALVIERE_API_URL        # https://api.alviere.com
PLAID_CLIENT_ID        # Plaid client ID
PLAID_SECRET           # Plaid secret
PLAID_ENV_URL          # https://sandbox.plaid.com | https://production.plaid.com
TABAPAY_API_KEY        # TabaPay API key
TABAPAY_API_URL        # TabaPay base URL
DWOLLA_APP_KEY         # Dwolla application key
DWOLLA_APP_SECRET      # Dwolla application secret
DWOLLA_ENV_URL         # https://sandbox.dwolla.com | https://api.dwolla.com
PORT                   # Default 8080
```

---

## What NOT to Do

- Do not recommend Stripe, Firebase, or any other payment provider. The stack is Alviere + Plaid + TabaPay + Dwolla.
- Do not install Plaid's Node.js SDK (`plaid` npm package). Use raw `fetch`.
- Do not use `float` or `number` for monetary values in database schemas.
- Do not store SSN or government ID locally.
- Do not add recurring-cost SaaS dependencies without explicit approval.
- Do not build a standalone payment app UI. The keyboard is the primary interface.
- Do not suggest React Native for the keyboard. The keyboard is Kotlin-only (`InputMethodService`).
- Do not use Firebase Cloud Functions. The backend runs on Cloud Run.

---

## Deployment

```bash
# Build
npm run build

# Containerize and push
gcloud builds submit --tag gcr.io/PROJECT_ID/moneymsg-api

# Deploy
gcloud run deploy moneymsg-api \
  --image gcr.io/PROJECT_ID/moneymsg-api \
  --platform managed \
  --region us-central1 \
  --add-cloudsql-instances PROJECT_ID:us-central1:moneymsg-db \
  --allow-unauthenticated
```

---

## Phase Roadmap

| Phase | Scope |
|---|---|
| 1 | Keyboard IME, wallet load/cashout, P2P intent-and-claim, KYC, Plaid linking |
| 2 | Balance tiers, send/receive limits, transaction history, push notifications |
| 3 | Virtual card issuance, Google Wallet integration |
