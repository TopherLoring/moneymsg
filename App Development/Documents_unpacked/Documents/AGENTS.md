# MoneyMsg — Agent Instructions

## What This Project Is

**MoneyMsg** is the Android equivalent of Apple Cash for iMessage.

This is not a standalone P2P payment app. The product is an OS-level Android keyboard (`InputMethodService`) that lets users send money from inside any messaging app — RCS, SMS, WhatsApp, Signal, Telegram — without switching apps. The UX mirrors Apple Cash: the payment lives where the conversation lives.

The **keyboard is the product**. The companion app (React Native) handles KYC onboarding, wallet management, and deep link claim resolution. These are supporting infrastructure, not the product.

- **Entity:** TopherLoring Investments
- **Domain:** moneymsg.site
- **Competitive frame:** Apple Cash for Android — not Venmo, not Cash App

---

## Tech Stack

### Backend

| Component | Technology | Notes |
|---|---|---|
| Runtime | Node.js 20 LTS | Stable, fintech-proven |
| Framework | Fastify | Low-latency HTTP |
| Language | TypeScript (strict) | Full stack in one language |
| ORM | Drizzle ORM | Type-safe SQL, no code-gen |
| Database | Cloud SQL (PostgreSQL 15) | Google Cloud managed, IAM auth |
| Hosting | Google Cloud Run | Serverless containers, scales to zero |

### Clients

| Client | Technology |
|---|---|
| Android Keyboard | Kotlin (`InputMethodService`) |
| Companion App | React Native (Expo) |

### Payment Providers

| Provider | Role |
|---|---|
| Alviere | BaaS ledger, KYC/AML, FBO wallet issuance, zero-cost internal transfers |
| Plaid | External account auth, `processor_token` generation |
| TabaPay | Card load (AFT) and card cash-out (OCT) |
| Dwolla | Bank load and bank cash-out via RTP / FedNow |

**Do not substitute any of these providers.** Do not suggest Stripe, Square, or any other payment processor.

---

## Project Structure

```
moneymsg/
├── src/
│   ├── server.ts                  # Fastify server entry point
│   ├── db/
│   │   ├── index.ts               # Drizzle client initialization
│   │   └── schema.ts              # All Drizzle table definitions
│   ├── routes/
│   │   ├── kyc.ts                 # KYC submission and status
│   │   ├── plaid.ts               # Plaid link token + exchange
│   │   ├── wallet.ts              # Load and cash-out
│   │   └── transfer.ts            # P2P intent creation and claim
│   ├── services/
│   │   ├── alviere.ts             # Alviere API client
│   │   ├── tabapay.ts             # TabaPay API client
│   │   ├── dwolla.ts              # Dwolla API client
│   │   └── plaid.ts               # Plaid API client
│   ├── workers/
│   │   └── intentSweeper.ts       # 24-hour intent TTL expiry
│   └── lib/
│       ├── fees.ts                # Fee logic: 1.75% + $0.50
│       └── errors.ts              # Typed error classes
├── android/                       # Kotlin keyboard (InputMethodService)
├── companion/                     # React Native Expo companion app
├── Dockerfile
├── drizzle.config.ts
├── package.json
└── tsconfig.json
```

---

## Core Business Rules

### Fee Structure
- Platform fee: **1.75% + $0.50** on all external money movement (load and cash-out).
- All fee calculation must go through `src/lib/fees.ts`. Never inline fee math.
- Internal P2P between two Alviere wallets costs $0.00 and charges $0.00.

### Money Handling
- All monetary values stored as `NUMERIC(15,4)` in PostgreSQL. Never `FLOAT`.
- Never use JavaScript `number` for currency arithmetic. Use string-based decimal math or a library like `decimal.js`.
- SSN and government ID are never stored locally. They are proxied to Alviere only.

### Intent-and-Claim Flow (Core P2P Mechanism)
The keyboard cannot know the recipient's identity at send time. The flow is:

1. Keyboard calls backend to create a payment intent.
2. Backend deducts sender's wallet balance immediately (holds funds).
3. Backend returns a deep link: `https://moneymsg.site/pay?id={intentId}`
4. Keyboard injects the deep link into the RCS/SMS message thread.
5. Recipient taps the link, opens the companion app, claims the payment.
6. Backend executes a zero-cost Alviere book transfer to the recipient's wallet.
7. If unclaimed after 24 hours, the sweeper worker reverses the hold.

### Idempotency
- Claiming the same `intentId` twice must be rejected (check status before executing transfer).
- Loading the wallet twice with the same request must not double-charge.

---

## API Reference

```
POST /api/v1/kyc/submit
POST /api/v1/plaid/create-link-token
POST /api/v1/plaid/exchange
POST /api/v1/wallet/load
POST /api/v1/wallet/cashout
POST /api/v1/transfer/intent/wallet     # Pre-funded P2P send (keyboard)
POST /api/v1/transfer/funded-p2p        # JIT-funded P2P send (keyboard)
POST /api/v1/transfer/claim             # Deep link claim (companion app)
```

All endpoints return JSON. Errors return `{ "error": string, "code": string }`.

---

## Database Schema

### Enums
```typescript
kycStatus:     'pending' | 'approved' | 'rejected'
txStatus:      'pending' | 'completed' | 'reversed' | 'failed'
txType:        'load' | 'cashout' | 'p2p_send' | 'p2p_receive'
walletStatus:  'active' | 'frozen' | 'closed'
```

### Key Tables
- `users` — `id`, `email`, `phone`, `alviere_member_id`, `kyc_status`
- `wallets` — `id`, `user_id` (unique), `alviere_account_id`, `available_balance NUMERIC(15,4)`, `status`
- `transactions` — `id`, `wallet_id`, `transaction_type`, `status`, `gross_amount`, `net_amount`, `fee_amount`, `expires_at`, `completed_at`
- `funding_sources` — `id`, `user_id`, `source_type`, `processor_token`, `routing_provider`, `plaid_item_id`, `mask`

### Critical Index
```sql
CREATE INDEX idx_transactions_expiration
  ON transactions(status, expires_at)
  WHERE status = 'pending';
```

---

## Code Standards

### Mandatory

- **Production-ready, complete code only.** No stubs, no `// TODO`, no placeholder functions.
- **TypeScript strict mode.** `"strict": true` in `tsconfig.json`. No `any` except at untyped external API boundaries, narrowed immediately.
- **All provider calls in `src/services/`.** Routes never call provider APIs directly.
- **Raw `fetch` for all provider HTTP calls.** Do not install Plaid SDK, Dwolla SDK, or any provider npm package.
- **Drizzle queries only.** No raw SQL strings outside migration files.
- **Explicit error handling.** Never catch and swallow. Every catch block either re-throws or returns a structured error.
- **Named constants.** Fee rates, TTL durations, retry counts live in `src/lib/`. Never inline.
- **Input validation.** All Fastify route bodies validated with JSON Schema before processing.

### Forbidden

- `float` or `number` type for monetary database columns
- Inline fee calculations outside `src/lib/fees.ts`
- Direct Alviere/Plaid/TabaPay/Dwolla calls from route handlers
- Storing SSN or raw government ID in any local table
- Hardcoded secrets or API keys
- Adding npm packages with recurring license costs without approval
- Using Firebase Cloud Functions (backend is Cloud Run)
- Using React Native for the Android keyboard (must be Kotlin `InputMethodService`)

---

## Environment Variables

```
DATABASE_URL
ALVIERE_API_KEY
ALVIERE_API_URL
PLAID_CLIENT_ID
PLAID_SECRET
PLAID_ENV_URL
TABAPAY_API_KEY
TABAPAY_API_URL
DWOLLA_APP_KEY
DWOLLA_APP_SECRET
DWOLLA_ENV_URL
PORT
```

---

## Deployment Target

- **Backend:** Google Cloud Run
- **Database:** Google Cloud SQL (PostgreSQL 15), IAM authentication
- **Container registry:** Google Container Registry (`gcr.io`)
- **Region:** `us-central1`

```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/moneymsg-api

gcloud run deploy moneymsg-api \
  --image gcr.io/PROJECT_ID/moneymsg-api \
  --platform managed \
  --region us-central1 \
  --add-cloudsql-instances PROJECT_ID:us-central1:moneymsg-db \
  --allow-unauthenticated
```

---

## What To Clarify Before Proceeding

If a task is ambiguous on any of the following, stop and ask:

1. **Which payment flow** is being implemented (1A card load, 1B bank load, 2A pre-funded P2P, 2B JIT P2P, 3A card cashout, 3B bank cashout)?
2. **Which provider** is handling the external leg (TabaPay for card, Dwolla for bank)?
3. **Is this keyboard-side or companion-side** logic?
4. **Is the intent pre-funded or JIT-funded?**

Do not guess on payment flow direction or provider routing.
