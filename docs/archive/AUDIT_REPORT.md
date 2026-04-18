## Version Tracking

| Field | Value |
|---|---|
| Version | v1.1.0 |
| Updated | 2026.04.17 |
| Status | Final |
| Parent | TopherLoring Industries |
| Project | MoneyMsg — Codebase vs. Backlog Audit |
| Author | Christopher Rowden |

## Changelog

### v1.1.0 — 2026.04.17

- Updated audit to reflect Phase A implementation
- 0.1 Auth model: DONE — JWT auth, roles, ownership checks on all routes
- 0.2 Env/config: DONE — full Zod validation, explicit DB SSL
- 0.3 Rate limiting: DONE — global + route-level + abuse throttling
- 0.4 Logging/redaction/correlation: DONE — pino with redaction, AsyncLocalStorage context
- 1.3 HMAC fix: DONE — buffer length precheck added

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
| Complete | 5 |
| Partial | 0 |
| Untouched | 32 |

### Phase A Status — COMPLETE

| Milestone | Status |
|---|---|
| 0.1 Auth model | ✅ DONE — JWT auth, roles, ownership on all 7 route files |
| 0.2 Env/config | ✅ DONE — full Zod validation, explicit DB SSL, .env.example updated |
| 0.3 Rate limiting | ✅ DONE — global + route-level limits + abuse throttling |
| 0.4 Logging/redaction | ✅ DONE — pino with PII redaction, correlation IDs |
| 1.3 HMAC fix | ✅ DONE — buffer length precheck before timingSafeEqual |

### Remaining Critical Findings

- ~~Open KYC endpoint~~ — **FIXED**: JWT auth + ownership check
- ~~Open Plaid linking~~ — **FIXED**: JWT auth + ownership + user existence check
- **Placeholder risk engine** — `evaluateRisk()` still returns `{ allow: true }`
- ~~PII logging~~ — **FIXED**: pino with redaction paths
- ~~Zero rate limiting~~ — **FIXED**: global + route-level + abuse throttling
- ~~HMAC buffer crash bug~~ — **FIXED**: length precheck added
- **Zero test coverage** — no `tests/` directory exists
- **CI is build+smoke only** — no lint, no tests, no migration validation

---

## Phase A — Security Blockers (M0) — ✅ COMPLETE

### 0.1 Lock Down API Auth Model — ✅ DONE

- JWT-based auth via `src/lib/session.ts` and `src/lib/authz.ts`
- Role model: user, support, admin, service
- `requireAuth` preHandler on all 7 route files
- `assertOwnershipOrElevated` on KYC, Plaid, transfer, wallet, request routes
- Old `requireApiKey` removed from all routes

### 0.2 Fix Env & Config Safety — ✅ DONE

- Zod schema expanded to 25+ vars including JWT_SECRET, webhook secrets, DB_SSL_MODE, NODE_ENV, LOG_LEVEL
- Explicit DB SSL config with verify-ca/verify-full support
- .env.example and CI workflow updated

### 0.3 Rate Limiting & Abuse Throttling — ✅ DONE

- `@fastify/rate-limit` with global 100/min baseline
- Route-level presets: auth, kyc, plaid, transact, requestCreate, read, intent
- In-memory abuse throttling for request/nudge spam
- Per-recipient spam protection

### 0.4 Logging, Redaction, & Correlation IDs — ✅ DONE

- Pino logger with PII redaction paths (auth headers, KYC, processor tokens, phone/email)
- AsyncLocalStorage-based request context with correlation IDs
- Response headers include x-request-id
- Context fields: requestId, transactionId, userId, role

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

### 1.3 Webhook & Reconciliation Hardening — PARTIAL (HMAC fix done)

| What exists | What's missing |
|---|---|
| HMAC signature verification | Logged/reconciled/finalized separation |
| ✅ Buffer length precheck (fixed) | Replay-safe reconciliation service |
| Timestamp skew check | Reconciliation sweeper/retry worker |
| Basic dedup by provider+ref+type | Unresolved event monitoring |
| Basic reconciliation (success/fail) | |

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
