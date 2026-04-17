# MoneyMsg — Agent Instructions

## What This Project Is

**MoneyMsg** is a conversation-native payments platform for Android.

It is **keyboard-first, not keyboard-only**.

The product uses a specialized Android keyboard (`InputMethodService`) as the primary in-conversation access point for payment actions, but the full product also includes a companion application, a hardened backend financial engine, a conversation-intent orchestration layer, and production operations infrastructure.

MoneyMsg is not a generic standalone wallet app and it is not a full replacement typing keyboard. It is a **specialized payment/action surface** that lets users initiate money actions from inside conversations while relying on the companion app for onboarding, trust-sensitive approvals, wallet management, history, settings, support, and fallback flows.

### Current Product Positioning
- **Entity:** TopherLoring Investments
- **Domain:** moneymsg.site
- **Competitive frame:** Apple Cash for Android, evolved into a conversation-native payment platform
- **Primary UX model:** in-thread payment actions that feel native
- **Primary architectural rule:** no raw visible URLs in standard user-facing conversation flows

### Surfaces
- **Android IME (Kotlin):** in-conversation capture layer for Send, Request, Split, Remind, Add Money, Cash Out, Transfer, and wallet glance actions
- **Companion App (React Native):** onboarding, KYC, funding sources, wallet management, approvals, activity, settings, support, recovery, and fallback flows
- **Backend (Fastify/TypeScript):** wallet/request/transfer engine, provider integrations, intent orchestration, recipient resolution, support/dispute/admin/compliance foundations

---

## Product Rules

### What the Keyboard Is
The keyboard is a **specialized payment/action IME**, not a primary typing competitor to Gboard or SwiftKey.

The keyboard must:
- show wallet balance and quick actions
- detect or launch payment actions in-conversation
- support recipient suggestion
- support amount entry and confirmation
- insert polished payment artifacts into conversation threads
- route trust-sensitive or complex flows into the companion app when needed

The keyboard must **not** be treated as the sole product shell.

### What the Companion App Is
The companion app is not optional infrastructure. It is the trusted management and recovery surface for:
- KYC onboarding
- funding source linking and management
- wallet management
- recipient acceptance/payment flows
- activity/history
- settings and preferences
- support and disputes
- account recovery and security flows
- compliance and manual review handoffs

### Conversation UX Rule
Do not expose raw naked payment URLs as the primary user experience.

Use:
- payment cards
- payment buttons/actions
- formatted in-thread artifacts
- hidden action-backed app links/deep links

Raw deep links may still exist under the hood, but the default user-facing experience should be polished and native-feeling.

### Recipient Flow Rule
The recipient experience follows the **Mode B** model:
1. Sender initiates from the keyboard.
2. Sender inserts a polished payment artifact into the conversation.
3. Recipient taps the artifact.
4. MoneyMsg opens a lightweight action sheet or app handoff.
5. Recipient accepts/pays quickly.
6. The thread reflects updated payment state cleanly.

### AI / Intent Rule
AI may:
- parse payment intent
- suggest actions
- suggest recipients
- structure amounts and memos
- identify missing fields
- recommend clarification

AI may **not** silently execute money movement.

All money movement requires explicit confirmation and must route into deterministic execution logic.

---

## Tech Stack

### Backend
| Component | Technology | Notes |
|---|---|---|
| Runtime | Node.js 20 LTS | Current repo runtime |
| Framework | Fastify | Low-latency HTTP |
| Language | TypeScript (strict) | Full stack in one language |
| ORM | Drizzle ORM | Type-safe SQL |
| Database | PostgreSQL 15 | Managed cloud deployment target |
| Hosting | Cloud Run / containerized server runtime | Production deployment target |

### Clients
| Client | Technology |
|---|---|
| Android Keyboard | Kotlin (`InputMethodService`) |
| Companion App | React Native (Expo or equivalent RN app shell) |

### Payment Providers
| Provider | Role |
|---|---|
| Alviere | BaaS ledger, KYC/AML, FBO wallet issuance, internal book transfers |
| Plaid | External account auth and `processor_token` generation |
| TabaPay | Card load (AFT) and card cash-out (OCT) |
| Dwolla | Bank load and bank cash-out via RTP / FedNow |

**Do not substitute these providers** unless explicitly directed.
Do not suggest Stripe, Square, PayPal, or random processor swaps.

---

## Current Architecture Direction

### Execution Core
The current backend wallet/request/transfer engine is the execution core.
Keep and harden it rather than replacing it.

Execution routes include:
- wallet load
- wallet cash-out
- request create/pay
- wallet-funded P2P
- externally funded P2P
- claim resolution
- webhook handling
- intent expiry reversal

### Orchestration Layer
Add a new orchestration layer above the execution core for:
- intent parsing
- recipient resolution
- conversation artifact lifecycle
- split orchestration
- reminders/nudges
- wallet summary for IME usage
- feedback and analytics

### Operations Layer
Production requires additional systems beyond payment execution:
- support engine
- disputes and exception handling
- admin/ops console
- notifications
- compliance operations
- fraud operations
- account recovery
- consent/policy tracking
- observability and reporting

These are part of the product and may not be omitted from production planning.

---

## Repo Structure (Current + Expected Expansion)

```text
moneymsg/
├── src/
│   ├── server.ts
│   ├── db/
│   │   ├── index.ts
│   │   ├── schema.ts
│   │   └── requests.ts
│   ├── routes/
│   │   ├── kyc.ts
│   │   ├── plaid.ts
│   │   ├── wallet.ts
│   │   ├── transfer.ts
│   │   ├── request.ts
│   │   ├── status.ts
│   │   ├── webhooks.ts
│   │   ├── intent.ts                # to be added
│   │   ├── recipient.ts             # to be added
│   │   ├── split.ts                 # to be added
│   │   ├── reminder.ts              # to be added
│   │   ├── walletSummary.ts         # to be added
│   │   ├── support.ts               # to be added
│   │   ├── disputes.ts              # to be added
│   │   ├── admin.ts                 # to be added
│   │   ├── notifications.ts         # to be added
│   │   ├── recovery.ts              # to be added
│   │   ├── sessions.ts              # to be added
│   │   ├── compliance.ts            # to be added
│   │   ├── consent.ts               # to be added
│   │   └── fraud.ts                 # to be added
│   ├── services/
│   │   ├── alviere.ts
│   │   ├── alviere-kyc.ts
│   │   ├── plaid.ts
│   │   ├── tabapay.ts
│   │   ├── dwolla.ts
│   │   ├── intentParser.ts          # to be added
│   │   ├── intentOrchestrator.ts    # to be added
│   │   ├── recipientResolver.ts     # to be added
│   │   ├── conversationArtifacts.ts # to be added
│   │   ├── reminderService.ts       # to be added
│   │   ├── reconciliationService.ts # to be added
│   │   ├── support.ts               # to be added
│   │   ├── disputes.ts              # to be added
│   │   ├── admin.ts                 # to be added
│   │   ├── notifications.ts         # to be added
│   │   ├── recovery.ts              # to be added
│   │   ├── sessions.ts              # to be added
│   │   ├── compliance.ts            # to be added
│   │   └── fraud.ts                 # to be added
│   ├── workers/
│   │   ├── intentSweeper.ts
│   │   ├── requestSweeper.ts
│   │   ├── reminderSweeper.ts       # to be added
│   │   └── reconciliationSweeper.ts # to be added
│   └── lib/
│       ├── fees.ts
│       ├── errors.ts
│       ├── auth.ts
│       ├── env.ts
│       ├── risk.ts
│       ├── riskScorer.ts
│       ├── schemas.ts
│       ├── intentSchemas.ts         # to be added
│       ├── conversationPrivacy.ts   # to be added
│       ├── rateLimit.ts             # to be added
│       ├── logger.ts                # to be added
│       ├── requestContext.ts        # to be added
│       ├── deepLinks.ts             # to be added
│       └── riskSignals.ts           # to be added
├── android/
├── companion/
├── Dockerfile
├── drizzle.config.ts
├── NEWS.md
├── package.json
├── RELEASES.md
├── TODO.md
└── tsconfig.json
```

---

## Core Business Rules

### Fee Structure
- Platform fee: **1.75% + $0.50** on external money movement unless explicitly changed by approved business rules.
- All fee calculations must go through `src/lib/fees.ts`. Never inline fee math.
- Internal P2P between two Alviere wallets remains zero-cost at the internal transfer layer.

### Money Handling
- All monetary values use `NUMERIC(15,4)` in PostgreSQL.
- Never use JavaScript `number` for currency arithmetic.
- Use decimal-safe string-based math or `decimal.js`.
- SSN and government ID are never stored locally. They are proxied to Alviere only.

### Current P2P Mechanism Rule
The current repo uses an intent-and-claim model. That execution core may remain under the hood, but user-facing conversation artifacts should evolve away from raw visible URLs.

### Idempotency
- All state-mutating money endpoints must be safe to call twice with the same intended request.
- Duplicate claims, duplicate loads, duplicate funded sends, and duplicate request payments must be prevented.
- Idempotency must be enforced both in logic and, where appropriate, at the database level.

---

## Code Standards

### Mandatory
- **Production-ready, complete code only.** No stubs, no `TODO`, no placeholder functions.
- **TypeScript strict mode.** No `any` except at external API boundaries, narrowed immediately.
- **All provider calls in `src/services/`.** Routes never call provider APIs directly.
- **Raw `fetch` for provider HTTP calls.** Do not add provider SDKs unless explicitly approved.
- **Drizzle queries for application data access.** Avoid raw SQL outside migrations unless absolutely required and justified.
- **Explicit error handling.** Never swallow errors.
- **Named constants.** Never inline fee rates, TTL values, or similar config.
- **Strong input validation.** All route bodies require explicit schemas.
- **Redacted logging.** No raw PII, auth headers, processor tokens, or sensitive payloads in standard logs.
- **Correlation IDs.** Requests, provider calls, webhooks, and support/admin actions must be traceable.

### Forbidden
- `float` or JS `number` for money logic
- inline fee calculations outside `src/lib/fees.ts`
- direct provider calls from route handlers
- storing SSN or raw government ID locally
- hardcoded secrets or API keys in source
- raw visible money URLs as the standard conversation UX
- treating the keyboard as a full typing replacement product
- ignoring support/disputes/compliance/recovery requirements when planning production work

---

## Security and Production Rules

### Authentication
The current shared API key model is not sufficient for final production architecture.
Work should move toward:
- authenticated user/session boundaries
- support/admin/service role separation
- proper ownership checks on user-scoped actions

### KYC / Funding / Ownership
- KYC submission must be authenticated and ownership-checked.
- Funding source linking must be authenticated and ownership-checked.
- User-scoped operations must not accept arbitrary `userId` values without verification.

### Rate Limiting
Production-facing endpoints must have abuse and rate-limit protection, especially for:
- KYC
- Plaid linking
- intent parsing
- request creation
- reminders
- status lookups

### Logging
Production logging must redact sensitive values and be safe for fintech operations.

### Metadata Storage
Operational metadata such as risk/device information should be structured and queryable where needed for investigations and analytics.

---

## API Direction

### Existing Execution Endpoints
```text
POST /api/v1/kyc/submit
POST /api/v1/plaid/create-link-token
POST /api/v1/plaid/exchange
POST /api/v1/wallet/load
POST /api/v1/wallet/cashout
POST /api/v1/request/create
POST /api/v1/request/pay
POST /api/v1/transfer/intent/wallet
POST /api/v1/transfer/funded-p2p
POST /api/v1/transfer/claim
GET  /api/v1/status/transaction/:id
GET  /api/v1/status/request/:id
POST /api/v1/webhooks/tabapay
POST /api/v1/webhooks/dwolla
```

### Planned Orchestration / Product Endpoints
```text
POST /api/v1/intent/parse
POST /api/v1/intent/confirm
POST /api/v1/intent/suggestions
POST /api/v1/intent/feedback
POST /api/v1/intent/resolve-recipient
GET  /api/v1/wallet/summary
POST /api/v1/wallet/load/preview
POST /api/v1/wallet/cashout/preview
POST /api/v1/split/create
POST /api/v1/split/claim
POST /api/v1/request/nudge
```

### Planned Production Operations Endpoints
```text
POST /api/v1/support/cases
POST /api/v1/disputes
GET  /api/v1/notifications
POST /api/v1/recovery/*
GET  /api/v1/admin/*
GET  /api/v1/compliance/*
GET  /api/v1/fraud/*
```

---

## Planning Rules for Agents

When working on this project:
- treat the current backend as an execution core to harden and extend, not rewrite blindly
- preserve provider roles unless explicitly directed otherwise
- prefer building upward with orchestration, support, and operations layers
- maintain an active TODO and changelog
- do not regress to a raw-link UX when producing user-facing flows
- include production survivability systems in any serious plan: support, disputes, admin ops, notifications, compliance, fraud ops, recovery, and legal/consent tracking

If a task is ambiguous, clarify:
1. which flow is being changed (load, cashout, send, request, claim, split, reminder, support, etc.)
2. which surface it belongs to (IME, companion app, backend, ops/admin)
3. whether it changes execution logic, orchestration logic, or presentation UX
4. whether the task targets MVP behavior, production beta, or full production readiness

Do not guess on payment-flow direction, provider routing, or trust-sensitive behavior.
