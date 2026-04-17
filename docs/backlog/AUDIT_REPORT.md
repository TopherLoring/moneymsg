## Version Tracking

| Field | Value |
|---|---|
| Version | v1.0.0 |
| Updated | 2026.04.17 |
| Status | Final |
| Parent | TopherLoring Industries |
| Project | MoneyMsg — Codebase vs. Backlog Audit |
| Author | Christopher Rowden |

## Changelog

### v1.0.0 — 2026.04.17

- Initial audit against full implementation backlog
- Cross-referenced all 37 milestones against repo source

---

# MoneyMsg — Codebase Audit Report

**Audit date:** 2026.04.17
**Repo:** `TopherLoring/moneymsg`
**Source path:** `App Development/src/`

---

## Status Key

| Status | Meaning |
|---|---|
| UNTOUCHED | No implementation exists |
| PARTIAL | Scaffolding or partial logic present, but far below spec |
| MINIMAL | File exists but provides negligible coverage |

---

## Summary

| Metric | Count |
|---|---|
| Total milestones | 37 |
| Complete | 0 |
| Partial | 3 |
| Untouched | 34 |

### Critical Findings

- **Open KYC endpoint** — zero auth, any caller can submit KYC for any user
- **Open Plaid linking** — API key present but no ownership verification; any caller can attach funding sources to any userId
- **Placeholder risk engine** — `evaluateRisk()` always returns `{ allow: true }`
- **PII logging** — `Fastify({ logger: true })` with no redaction config
- **Zero rate limiting** — no `rateLimit.ts`, no `abuse.ts`, no middleware
- **HMAC buffer crash bug** — `timingSafeEqual` called without length precheck; malformed signatures throw 500 instead of 401
- **Zero test coverage** — no `tests/` directory exists
- **CI is build+smoke only** — no lint, no tests, no migration validation

---

## Phase A — Security Blockers (M0)

### 0.1 Lock Down API Auth Model — UNTOUCHED

| What exists | What's missing |
|---|---|
| `requireApiKey()` — single shared `x-api-key` check | Real auth/session architecture |
| Plaid routes call `requireApiKey()` | Ownership verification (caller ≠ target user) |
| | KYC route has **zero auth** — completely unprotected |
| | Role model (user/support/admin/service) |
| | Session management |
| | Token boundaries |

**Evidence:** `src/lib/auth.ts` — 10 lines, single static key compare. `src/routes/kyc.ts` — no `requireApiKey` call. `src/routes/plaid.ts` — has `requireApiKey` but no `userId` ownership check.

### 0.2 Fix Env & Config Safety — PARTIAL

| What exists | What's missing |
|---|---|
| Zod schema validates provider API keys/URLs | `TABAPAY_WEBHOOK_SECRET` |
| `PORT` optional | `DWOLLA_WEBHOOK_SECRET` |
| | `API_KEY` |
| | `WEBHOOK_SHARED_SECRET` |
| | `WEBHOOK_MAX_SKEW_SECONDS` (numeric) |
| | DB SSL mode/cert settings |
| | App/session secrets |

**Evidence:** `src/lib/env.ts` — validates 11 vars, misses 6+ security-critical ones. `src/db/index.ts` — implicit `rejectUnauthorized: false` on non-localhost.

### 0.3 Rate Limiting & Abuse Throttling — UNTOUCHED

No rate limiting files, no middleware, no abuse detection.

### 0.4 Logging, Redaction, & Correlation IDs — UNTOUCHED

`Fastify({ logger: true })` — no `pino-redact`, no correlation ID middleware, no `requestContext.ts`.

---

## Phase B — Backend Hardening (M1)

### 1.1 Replace Placeholder Risk Engine — UNTOUCHED

| What exists | What's missing |
|---|---|
| `evaluateRisk()` — returns `{ allow: true }` | Structured outcomes (allow/step_up/review/deny) |
| `assertWithinDailyLimit()` — basic per-type daily cap | Per-device/IP/recipient/funding-source velocity |
| `assertNotDuplicate()` — basic same-amount window check | First-use step-up |
| | Anomaly detection |
| | Risk signal schema |
| | Rule codes and score outputs |

**Evidence:** `src/lib/riskScorer.ts` — placeholder comment in source. `src/lib/risk.ts` — 2 functions, no velocity dimensions.

### 1.2 Harden Schemas & Payload Validation — UNTOUCHED

| What exists | What's missing |
|---|---|
| `riskMetaSchema: { type: "object", additionalProperties: true }` | Typed contracts |
| `deviceInfoSchema: { type: "object", additionalProperties: true }` | KYC field validation |
| KYC body: `kycData: { type: "object" }` | Plaid payload validation |

### 1.3 Webhook & Reconciliation Hardening — PARTIAL

| What exists | What's missing |
|---|---|
| HMAC signature verification | Buffer length precheck (crash bug) |
| Timestamp skew check | Logged/reconciled/finalized separation |
| Basic dedup by provider+ref+type | Replay-safe reconciliation service |
| Basic reconciliation (success/fail) | Reconciliation sweeper/retry worker |
| Webhook event logging | Unresolved event monitoring |

**Evidence:** `src/routes/webhooks.ts` — `timingSafeEqual(Buffer.from(digest), Buffer.from(signature))` with no length guard. `reconcileTransaction()` is inline, not a service.

### 1.4 Provider Wrapper Quality — UNTOUCHED

All 5 providers (`alviere`, `alviere-kyc`, `plaid`, `tabapay`, `dwolla`) throw generic `AppError("...", "PROVIDER_ERROR")`. No error normalization, no retryable marking, no correlation metadata on outbound calls.

---

## Phase C — Data Model (M2)

### 2.1 Structured Metadata — UNTOUCHED

`riskMeta` and `deviceInfo` are `text()` columns in both `transactions` and `paymentRequests`. No jsonb, no indexes.

### 2.2 Request Idempotency — UNTOUCHED

`paymentRequests.idempotencyKey` exists as a column but has **no unique index** — unlike `transactions` which has `idx_transactions_idempotent`.

### 2.3 Funding Source Lifecycle — UNTOUCHED

`fundingSources` has `isActive: boolean` only. No lifecycle states, no list/remove/default endpoints, no `fundingSources.ts` route, no duplicate prevention.

---

## Phase D — IME Foundation (M3)

### 3.1 Wallet Summary & Listing APIs — UNTOUCHED

No `walletSummary.ts`, no `history.ts`. Only single-item status lookups in `src/routes/status.ts`. No pagination, no list endpoints.

### 3.2 Deep-Link Support — UNTOUCHED

No `deepLinks.ts`. `paymentLinks` table stores a `deepLink` text field but no library generates or manages deep-link targets.

---

## Phases E–K (M4–M13) — ALL UNTOUCHED

| Phase | Milestones | Files that should exist | Files that do exist |
|---|---|---|---|
| E — Orchestration | 4.1, 4.2, 4.3 | intent routes, parser, orchestrator, recipient resolver, 5 new tables | None |
| F — Payment Objects | 5.1 | conversationArtifacts service, render templates | None |
| G — Ops | 6.1–6.3, 7.1–7.2, 8.1–8.2 | support, disputes, admin, notifications, recovery, compliance, fraud | None |
| H — Advanced | 9.1–9.2 | split routes/services, reminder routes/services/worker | None |
| I — CI/Hygiene | 10.1, 10.2, 10.3 | lint config, test runner, expanded CI, worker shutdown | Build+smoke CI only |
| J — IME + App | 11.x, 12.x | Kotlin IME, companion app screens | None (no Android code) |
| K — Spec Rewrite | 13.1 | Updated planning docs | Old spec still uses payment-keyboard/link-first framing |

---

## Existing Infrastructure Inventory

### Routes (7 files)

| File | Endpoints | Auth |
|---|---|---|
| `kyc.ts` | POST /api/v1/kyc/submit | **NONE** |
| `plaid.ts` | POST create-link-token, POST exchange | API key, no ownership |
| `transfer.ts` | Multiple transfer endpoints | API key |
| `wallet.ts` | Load, cashout, wallet-send | API key |
| `request.ts` | Create, pay, status | API key |
| `status.ts` | GET /api/v1/status/:id | API key |
| `webhooks.ts` | POST tabapay, POST dwolla | HMAC + shared secret |

### Services (5 files)

All are thin provider wrappers with no error normalization.

### Workers (2 files)

| File | Function | Issues |
|---|---|---|
| `intentSweeper.ts` | Expires pending p2p_send after 24h | No graceful shutdown |
| `requestSweeper.ts` | Expires pending payment requests | No graceful shutdown |

### Schema

- 6 tables: `users`, `wallets`, `transactions`, `paymentLinks`, `webhookEvents`, `fundingSources`
- 1 separate table: `paymentRequests` (in `requests.ts`)
- 9 migrations (0001–0009)
- 5 enums: kyc_status, tx_status, tx_type, wallet_status, tx_lifecycle

### Tests

**None.** No `tests/` directory. No test runner configured. No test scripts in `package.json`.

---

## Recommended Execution Priority

Based on audit findings, the backlog execution order is validated. No reordering needed — Phase A blockers are confirmed critical by code inspection.

Immediate priorities:

1. **0.1** — Auth is the single biggest security hole
2. **0.2** — Env validation gaps allow insecure boot
3. **0.4** — PII logging is a compliance liability
4. **0.3** — Rate limiting protects everything above
5. **1.1** — Risk engine is a literal no-op
6. **1.2** — Schema validation accepts garbage
7. **1.3** — HMAC crash bug is a production incident waiting to happen
8. **10.1** — CI gates should land as tests start arriving
