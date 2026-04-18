# MoneyMsg Canonical TODO

## Version Tracking

| Field | Value |
|---|---|
| Version | v3.0.1 |
| Updated | 2026.04.18 04:56 AM CT |
| Status | In Progress |
| Parent | TopherLoring Industries |
| Project | MoneyMsg |
| Author | Christopher Rowden |

## Changelog

### v3.0.1 — 2026.04.18 04:56 AM CT

- Normalized remaining stale task file paths after the repository standardization pass
- Replaced legacy pre-standardization route, service, lib, and archive references in the canonical task register

### v3.0.0 — 2026.04.18 03:56 AM CT

- Standardized the repository layout before further feature expansion
- Flattened the backend package from `/` into the repository root
- Remapped source code into the repo-standard app/config/domain/integrations/infrastructure/jobs/modules/shared structure
- Archived legacy package-local docs and unpacked duplicate material under `docs/archive/`
- Updated canonical task paths for the standardized runtime and source layout

### v2.2.0 — 2026.04.18

- Completed all MX repository and CI preflight tasks in a Bun-first execution pass
- Converted MX dependency reinstall, local scripts, and CI enforcement to Bun-first behavior
- Added migration validation and Bun-first CI assertions to the preflight test suite
- Recorded successful local Bun install, lint, typecheck, test, build, migration check, and smoke evidence

### v2.1.0 — 2026.04.18

- Added a checkbox column to every task row in the canonical task register
- Marked MX-001 as in progress and recorded the uploaded clone audit as initial execution evidence
- Updated the progress snapshot to reflect active start of the first preflight task

### v2.0.0 — 2026.04.18

- Replaced the root discovery pointer with the single canonical MoneyMsg plan-and-progress document
- Merged the execution-matrix structure into the live TODO so dependency order, status, acceptance criteria, and progress evidence live in one governed file
- Imported backend implementation progress from the superseded `docs/archive/app-development-package/TODO.md` backlog
- Declared all other task documents non-authoritative support or archive material
- Folded repo-governance canonicalization work into the live task register

### v1.1.0 — 2026.04.18

- Updated root task pointers to the canonical backlog set
- Added direct reference to `docs/tasks/00_MASTER_BACKLOG.md`
- Clarified the difference between the task navigator and the execution backlog

### v1.0.0 — 2026.04.17

- Initial release
- Added root task pointer for fast repo navigation
- Linked the canonical task register under `docs/tasks/`

## Canonical Authority

This file is the **single source of truth** for both:

- execution planning
- execution progress

No task navigator, backlog index, matrix export, spreadsheet, or package-local TODO is allowed to outrank this file.

## Usage Rule

- Update this file whenever scope, dependency order, status, acceptance criteria, or execution evidence changes.
- Supporting documents may expand implementation detail, but they may not carry an independent authoritative status model.
- If any supporting task file conflicts with this file, this file wins.

## Status Vocabulary

- **Planned** — approved work not yet started
- **In Progress** — active work or partially satisfied acceptance criteria
- **Completed** — accepted as done and imported into the canonical register
- **Blocked** — cannot move until a dependency, decision, or external constraint clears
- **Archived** — superseded or retained only for history

## Current Progress Snapshot

- Completed tasks: **18**
- In-progress tasks: **0**
- Planned tasks: **41**
- Blocked tasks: **0**

## Current Priority Focus

1. Replace placeholder risk logic (1.1.1) and tighten validation (1.1.2–1.1.5) before expanding wallet, intent, or IME work.
2. Harden webhook reconciliation with replay-safe state model (1.2.2) and reconciliation sweeper (1.2.3).
3. Normalize provider error classes and attach correlation metadata (1.3.1).
4. Keep the Bun-first preflight lane green as the baseline for all follow-on work.

## Supporting Task Packs

These files are allowed to expand implementation detail, but they are **supporting packs only**:

- `docs/tasks/01_M0_SECURITY_BLOCKERS.md`
- `docs/tasks/02_M1_BACKEND_HARDENING.md`
- `docs/tasks/03_M2_DATA_MODEL.md`
- `docs/tasks/04_M3_IME_FOUNDATION.md`
- `docs/tasks/05_M4_ORCHESTRATION.md`
- `docs/tasks/06_M5_PAYMENT_OBJECTS.md`
- `docs/tasks/07_M6_SUPPORT_OPS.md`
- `docs/tasks/08_M7_NOTIFICATIONS_RECOVERY.md`
- `docs/tasks/09_M8_COMPLIANCE_FRAUD.md`
- `docs/tasks/10_M9_SPLIT_REMINDERS.md`
- `docs/tasks/11_M10_CI_HYGIENE.md`
- `docs/tasks/12_M11_ANDROID_IME.md`
- `docs/tasks/13_M12_COMPANION_APP.md`
- `docs/tasks/14_M13_SPEC_REWRITE.md`

## Superseded Task Documents

- `docs/archive/app-development-package/TODO.md` — archived backend implementation backlog retained only as a migration marker
- `docs/tasks/TODO.md` — support index only; no independent status authority
- `docs/tasks/00_MASTER_BACKLOG.md` — reference overview only; no independent execution authority
- `docs/backlog/00_MASTER_BACKLOG.md` — duplicate backlog file removed during canonicalization

## Progress Import Note

Completed and in-progress implementation statuses carried into this file were imported from the previously active backend backlog during the 2026.04.18 canonicalization pass. Where imported work is not yet fully re-verified against the broader acceptance criteria, the task remains **In Progress** instead of being overstated as complete.

## Task Register

### MX — Repository and CI Preflight

| Order | Done | Task ID | Priority | Type | Status | Depends On | Workstream | Task | File Path(s) | Acceptance Criteria | Progress / Evidence | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | [x] | MX-001 | P0 | Fix | Completed | - | Repo | Remove `node_modules/` and `dist/` from version control and harden `.gitignore`. | `.gitignore`; repo index | Generated dependencies and build artifacts are no longer tracked; fresh clone stays clean after install/build. | Root `.gitignore` now blocks nested dependency/build drift; the working clone `node_modules/` directory was deleted before validation and only recreated locally through a clean Bun reinstall. | Git index verification remains limited in the uploaded archive because `.git` metadata is absent, but the filesystem cleanup and ignore hardening are complete. |
| 2 | [x] | MX-002 | P0 | Fix | Completed | MX-001 | Repo | Reinstall dependencies with Bun and keep a single reproducible lockfile. | `bun.lock`; `package.json`; `package-lock.json` | Fresh `bun install --frozen-lockfile` succeeds and yields a buildable, reproducible install state. | `package-lock.json` was removed to avoid dual lockfile authority; a clean `bun install --frozen-lockfile` completed successfully after deleting `node_modules/`. | Bun-first override applied per current repo preference. |
| 3 | [x] | MX-003 | P0 | Add | Completed | MX-002 | DevOps | Add enforceable lint and typecheck configuration and scripts. | `package.json`; `tsconfig.json`; `tsconfig.typecheck.json`; `scripts/lint.ts`; `drizzle.config.ts` | `bun run lint` and `bun run typecheck` work locally and in CI; merges block on failures. | Local Bun validation passed for both `bun run lint` and `bun run typecheck`; the Drizzle config and smoke/typecheck support files were corrected to satisfy the gate. | Bun-first script wiring replaces the older npm-oriented wording. |
| 4 | [x] | MX-004 | P0 | Add | Completed | MX-003 | DevOps | Add a real test runner and standard test scripts. | `package.json`; `tests/mx-preflight.test.ts`; `tests/bun-test.d.ts` | Automated tests run consistently locally and in CI. | `bun test` now passes locally with five MX preflight assertions covering package manager preference, script presence, ignore coverage, lockfile state, and Bun-first CI wiring. | Bun's native test runner is now the repo standard for this package. |
| 5 | [x] | MX-005 | P0 | Add | Completed | MX-003,MX-004 | DevOps | Expand CI to enforce fresh-clone install, lint, typecheck, tests, build, migration validation, and smoke. | `.github/workflows/ci.yml`; `package.json`; `scripts/smoke.ts` | CI performs `bun install --frozen-lockfile`, lint, typecheck, test, build, migration validation, and smoke on a clean environment and blocks bad merges. | Local `bun run ci` completed successfully end to end, including lint, typecheck, tests, build, `bun run db:check`, and smoke against `/health`. | CI is now Bun-first and uses a safer default smoke port. |

### M0 — Security and Production Blockers

| Order | Done | Task ID | Priority | Type | Status | Depends On | Workstream | Task | File Path(s) | Acceptance Criteria | Progress / Evidence | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | [x] | 0.2.1 | P0 | Refactor | Completed | - | Config | Build a centralized typed config layer with env validation, required vs optional separation, defaults, prestart validation, and audited usage. | src/config/env.ts; package.json; .env.example | Boot fails fast on missing or malformed security-critical config; direct process.env usage is removed from non-bootstrap code. | Zod schema in src/config/env.ts validates all required and optional variables at boot; process.env does not leak outside the config module; .env.example covers all schema variables. | Absorbs legacy 0.2.1, MM-004, MM-005, and MM-009. |
| 7 | [x] | 0.2.2 | P0 | Fix | Completed | 0.2.1 | Config | Replace implicit DB SSL behavior with explicit environment-driven TLS configuration. | src/infrastructure/db/index.ts; .env.example | DB TLS policy is explicit by environment and certificate handling is no longer hidden or unsafe. | Imported as completed from the superseded backend backlog during the 2026.04.18 canonicalization pass. | Removes implicit insecure behavior. |
| 8 | [x] | 0.4.1 | P0 | Fix | Completed | 0.2.1 | Logging | Configure a structured logger with redaction. | src/app/server.ts; src/infrastructure/logging/logger.ts | Sensitive headers and PII are redacted while preserving supportable metadata. | Imported as completed from the superseded backend backlog during the 2026.04.18 canonicalization pass. | Fintech logging baseline. |
| 9 | [x] | 0.4.2 | P0 | Add | Completed | 0.4.1 | Logging | Add end-to-end correlation IDs across requests, providers, and webhooks. | src/app/server.ts; src/shared/requestContext.ts; src/modules/webhooks/http/routes.ts; src/integrations/*/client.ts | Every request, provider call, webhook, and transaction can be traced end-to-end. | onRequest hook uses withRequestContext() so AsyncLocalStorage is live for the full request lifecycle. All provider clients (Alviere, Dwolla, Plaid, TabaPay) attach x-correlation-id to outbound calls. Dwolla also receives correlationId in the payload body. Webhook reconciliation sets providerCorrelationId and transactionId in context. Transfer and wallet routes set transactionId before provider calls. | Ops and debug foundation. |
| 10 | [x] | 0.1.1 | P0 | Refactor | Completed | 0.2.1,0.4.2 | Auth | Replace the shared static API key model with real auth and session architecture. | src/shared/auth.ts; src/shared/session.ts; src/app/server.ts; src/modules/*/http/routes.ts | Per-user, service, and staff auth boundaries exist; static shared API key is no longer used for user actions. | Imported as completed from the superseded backend backlog during the 2026.04.18 canonicalization pass. | Foundation for all secured flows. |
| 11 | [x] | 0.1.4 | P0 | Add | Completed | 0.1.1 | Auth | Add role and session utilities for user, support, admin, and service access. | src/shared/authz.ts; src/shared/session.ts | RBAC and session helpers are reusable across routes and services. | Imported as completed from the superseded backend backlog during the 2026.04.18 canonicalization pass. | Enables ops and support surfaces later. |
| 12 | [x] | 0.3.1 | P0 | Add | Completed | 0.1.1 | Abuse | Add global and route-level rate limiting. | src/app/server.ts; src/shared/rateLimit.ts | Sensitive endpoints are throttled by route and actor. | Imported as completed from the superseded backend backlog during the 2026.04.18 canonicalization pass. | Protect auth, KYC, Plaid, parse, and request flows. |
| 13 | [x] | 0.3.2 | P0 | Add | Completed | 0.3.1 | Abuse | Add abuse throttling for request and reminder spam. | src/shared/abuse.ts; src/modules/request/http/routes.ts; src/modules/reminder/http/routes.ts | Repeated spammy requests and nudges are throttled and flagged. | Imported as completed from the superseded backend backlog during the 2026.04.18 canonicalization pass. | Conversation-native abuse control. |
| 14 | [x] | 0.1.2 | P0 | Fix | Completed | 0.1.1 | Auth | Protect the KYC submission route and verify caller ownership. | src/modules/kyc/http/routes.ts | Unauthenticated or cross-user KYC submissions are rejected. | Imported as completed from the superseded backend backlog during the 2026.04.18 canonicalization pass. | Critical security blocker. |
| 15 | [x] | 0.1.3 | P0 | Fix | Completed | 0.1.1 | Auth | Add ownership checks to Plaid linking routes. | src/modules/plaid/http/routes.ts | Funding sources can only be linked for the authenticated user. | Imported as completed from the superseded backend backlog during the 2026.04.18 canonicalization pass. | Blocks arbitrary source attachment. |
| 16 | [x] | 0.2.3 | P2 | Add | Completed | 0.2.1 | Config | Introduce feature flags for optional third-party integrations. | src/config/env.ts; src/app/server.ts; src/modules/transfer/http/routes.ts; src/modules/wallet/http/routes.ts | Optional integrations can be disabled by env flags and local or test boot works without all provider credentials. | Added PLAID_ENABLED, DWOLLA_ENABLED, TABAPAY_ENABLED boolean flags (default true) to env.ts. Provider credentials are now optional in the Zod schema and validated conditionally via superRefine — credentials are required only when their flag is true. Plaid routes register conditionally in server.ts. Transfer and wallet routes guard TabaPay/Dwolla calls and throw 503 when the provider is disabled. | Absorbs legacy MM-007. |
| 17 | [x] | 0.5.1 | P0 | Add | Completed | 0.2.1,0.2.2 | Health | Implement separate liveness and readiness endpoints and hold readiness until essential services initialize. | src/app/server.ts | /health/live returns 200 when the process is alive; /health/ready returns 503 until required dependencies are ready. | /health/live always returns 200 { status: "live" }; /health/ready runs SELECT 1 against the DB pool and returns 200 { status: "ready" } or 503 { status: "not_ready", reason: "db" }. | Absorbs legacy MM-003. |

### M1 — Backend Financial Hardening

| Order | Done | Task ID | Priority | Type | Status | Depends On | Workstream | Task | File Path(s) | Acceptance Criteria | Progress / Evidence | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 18 | [x] | 1.2.1 | P0 | Fix | Completed | 0.2.1,0.4.2 | Webhooks | Fix malformed signature handling in webhook HMAC comparison. | src/modules/webhooks/http/routes.ts | Malformed signatures return clean 401 behavior instead of noisy failures or unsafe handling. | Imported as completed from the superseded backend backlog during the 2026.04.18 canonicalization pass. | Cheap security fix; pulled earlier in sequence. |
| 19 | [ ] | 1.1.1 | P0 | Fix | Planned | 0.1.1,0.4.2 | Risk | Replace the placeholder risk scorer with a real decision engine. | src/domain/risk/scorer.ts | Risk engine returns allow, step_up, review, or deny with reason codes. | No completion evidence imported yet. | Current placeholder always allows. |
| 20 | [ ] | 1.1.2 | P0 | Refactor | Planned | 1.1.1 | Risk | Expand hard-rule checks for velocity, duplicates, first-use, anomaly, and scam signals. | src/domain/risk/index.ts; src/domain/risk/signals.ts | Route-level risk checks cover users, devices, IPs, recipients, and funding sources. | No completion evidence imported yet. | Production fraud baseline. src/domain/risk/signals.ts does not exist yet and must be created. |
| 21 | [ ] | 1.1.3 | P0 | Fix | Planned | 1.1.2 | Validation | Replace open-ended device and risk schemas with explicit typed contracts. | src/shared/schemas.ts | Client payloads follow bounded schemas and reject garbage or overcollection. | No completion evidence imported yet. | Improves privacy and analytics quality. |
| 22 | [ ] | 1.1.4 | P0 | Add | Planned | 1.1.3,0.1.2 | Validation | Add strong KYC schema validation. | src/modules/kyc/schemas.ts; src/modules/kyc/http/routes.ts | KYC requests receive field-level validation before provider submission. | No completion evidence imported yet. | Support and compliance friendly. |
| 23 | [ ] | 1.1.5 | P0 | Fix | Planned | 1.1.3,0.1.3 | Validation | Add strong Plaid payload validation and duplicate funding-source prevention. | src/modules/plaid/http/routes.ts; src/infrastructure/db/schema.ts | Plaid exchange validates shape and cannot create duplicate linked sources. | No completion evidence imported yet. | Ownership plus shape validation. |
| 24 | [ ] | 1.2.2 | P0 | Refactor | Planned | 1.2.1 | Webhooks | Expand the reconciliation state model and add replay-safe reconciliation. | src/modules/webhooks/http/routes.ts; src/modules/reconciliation/service.ts; src/infrastructure/db/schema.ts | Webhook events support logged, reconciled, and finalized distinctions with replay-safe processing. | No completion evidence imported yet. | Core settlement hardening. |
| 25 | [ ] | 1.2.3 | P1 | Add | Planned | 1.2.2 | Workers | Add a reconciliation sweeper and retry worker. | src/jobs/reconciliationSweeper.ts | Retryable or unresolved reconciliation work is processed safely. | No completion evidence imported yet. | Improves resilience. |
| 26 | [ ] | 1.3.1 | P1 | Refactor | Planned | 0.4.2 | Providers | Normalize provider error classes and attach correlation metadata. | src/integrations/alviere/client.ts; src/integrations/alviere/kyc.ts; src/integrations/plaid/client.ts; src/integrations/tabapay/client.ts; src/integrations/dwolla/client.ts; src/shared/errors.ts | Provider failures map to internal enums and carry correlation IDs for support and audit. | No completion evidence imported yet. | Ops-ready provider layer. |
| 27 | [ ] | 1.3.2 | P1 | Migrate | Planned | 1.3.1 | Providers | Persist richer provider metadata for audit and replay. | src/infrastructure/db/schema.ts; migrations | Provider response metadata exists where needed for support, audit, and reconciliation. | No completion evidence imported yet. | Enables later ops tooling. |

### M2 — Data Model and Structural Cleanup

| Order | Done | Task ID | Priority | Type | Status | Depends On | Workstream | Task | File Path(s) | Acceptance Criteria | Progress / Evidence | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 28 | [ ] | 2.1.1 | P1 | Migrate | Planned | 1.1.3 | Data | Convert riskMeta, deviceInfo, and selected payload fields into structured queryable storage. | src/infrastructure/db/schema.ts; src/infrastructure/db/requests.ts; migrations | Operational metadata becomes queryable for fraud, support, and analytics. | No completion evidence imported yet. | Prefer jsonb-style storage where appropriate. |
| 29 | [ ] | 2.1.2 | P1 | Migrate | Planned | 2.1.1 | Data | Add DB-backed uniqueness and indexes for request idempotency and expiry. | src/infrastructure/db/requests.ts; migrations | Duplicate request creation is prevented at the DB layer. | No completion evidence imported yet. | Request integrity hardening. |
| 30 | [ ] | 2.1.3 | P1 | Migrate | Planned | 1.1.5 | Data | Expand funding-source lifecycle states and management metadata. | src/infrastructure/db/schema.ts; migrations | Funding sources support default, removed, failed, and management-friendly states. | No completion evidence imported yet. | Needed for wallet UX. |

### M3 — IME Foundation and Wallet Surfaces

| Order | Done | Task ID | Priority | Type | Status | Depends On | Workstream | Task | File Path(s) | Acceptance Criteria | Progress / Evidence | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 31 | [ ] | 3.1.1 | P1 | Add | Planned | 1.1.1,2.1.3 | Wallet | Add a wallet summary endpoint for IME and companion app flows. | src/modules/walletSummary/http/routes.ts; src/modules/walletSummary/service.ts | Returns available balance, locked balance, update time, and quick-action readiness. | No completion evidence imported yet. | IME foundation. |
| 32 | [ ] | 3.1.2 | P1 | Add | Planned | 3.1.1 | Wallet | Add load and cashout preview endpoints. | src/modules/wallet/http/routes.ts | Clients can preview fees and net or gross outcomes before confirmation. | No completion evidence imported yet. | Trust and UX improvement. |
| 33 | [ ] | 3.1.3 | P1 | Add | Planned | 3.1.1 | Wallet | Add history and listing endpoints for transactions, requests, and funding sources. | src/modules/history/http/routes.ts; src/modules/status/http/routes.ts; src/modules/fundingSources/http/routes.ts | Clients can render history and management surfaces without internal hacks. | No completion evidence imported yet. | Missing listing APIs. |
| 34 | [ ] | 3.2.1 | P1 | Add | Planned | 3.1.1 | Deep Links | Add a deep-link helper library and response metadata. | src/shared/deepLinks.ts; src/modules/wallet/http/routes.ts; src/modules/request/http/routes.ts; src/modules/status/http/routes.ts | Responses can route users directly into app screens. | No completion evidence imported yet. | Supports IME shortcuts. |

### M4 — Intent and Recipient Orchestration

| Order | Done | Task ID | Priority | Type | Status | Depends On | Workstream | Task | File Path(s) | Acceptance Criteria | Progress / Evidence | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 35 | [ ] | 4.1.1 | P1 | Migrate | Planned | 2.1.1 | Intent Layer | Add conversations, intent_events, recipient_hints, parser_feedback, and conversation_artifacts tables. | src/infrastructure/db/schema.ts; migrations | Conversation-native orchestration data model exists. | No completion evidence imported yet. | Required for smart UX. |
| 36 | [ ] | 4.1.2 | P1 | Add | Planned | 4.1.1 | Intent Layer | Add intent routes, parser, orchestrator, and intent schemas. | src/modules/intent/http/routes.ts; src/modules/intent/parser.ts; src/modules/intent/orchestrator.ts; src/modules/intent/schemas.ts; src/app/server.ts | Intent parse, confirm, suggestion, and feedback APIs exist. | No completion evidence imported yet. | Smart sender flows. |
| 37 | [ ] | 4.1.3 | P1 | Add | Planned | 4.1.1,2.1.3 | Recipient | Add recipient resolver route and service. | src/modules/recipient/http/routes.ts; src/modules/recipient/service.ts; src/app/server.ts | Recipient auto-suggest and ambiguity handling work end-to-end. | No completion evidence imported yet. | Key IME differentiator. |

### M5 — Conversation-Native Payment Artifacts

| Order | Done | Task ID | Priority | Type | Status | Depends On | Workstream | Task | File Path(s) | Acceptance Criteria | Progress / Evidence | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 38 | [ ] | 5.1.1 | P1 | Add | Planned | 4.1.1,4.1.2 | Conversation UX | Add conversation artifact generation and lifecycle services. | src/modules/conversationArtifacts/service.ts | Payment and request artifacts map to transaction and request states. | No completion evidence imported yet. | Supports no-raw-links goal. |
| 39 | [ ] | 5.1.2 | P1 | Refactor | Planned | 5.1.1 | Conversation UX | Map transfer, request, and status flows to artifact state transitions. | src/modules/transfer/http/routes.ts; src/modules/request/http/routes.ts; src/modules/status/http/routes.ts | Pending, viewed, accepted, paid, declined, expired, and completed states flow cleanly. | No completion evidence imported yet. | Mode B support. |

### M6 — Support, Disputes, and Operations

| Order | Done | Task ID | Priority | Type | Status | Depends On | Workstream | Task | File Path(s) | Acceptance Criteria | Progress / Evidence | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 40 | [ ] | 6.1.1 | P1 | Migrate | Planned | 0.1.4,3.1.3 | Support | Add support case schema with messages, attachment metadata, notes, categories, and statuses. | src/infrastructure/db/schema.ts; migrations | Support cases can be linked to users, transactions, and requests. | No completion evidence imported yet. | Production support backbone. |
| 41 | [ ] | 6.1.2 | P1 | Add | Planned | 6.1.1 | Support | Add support routes and services. | src/modules/support/http/routes.ts; src/modules/support/service.ts; src/app/server.ts | Users and staff can create, update, and view cases with proper permissions. | No completion evidence imported yet. | Case-management layer. |
| 42 | [ ] | 6.2.1 | P1 | Migrate | Planned | 6.1.1 | Disputes | Add dispute schema and freeze or review states for wallets and transactions. | src/infrastructure/db/schema.ts; migrations | Disputes and review states are persisted cleanly. | No completion evidence imported yet. | Exception handling. |
| 43 | [ ] | 6.2.2 | P1 | Add | Planned | 6.2.1 | Disputes | Add dispute intake and escalation routes and services. | src/modules/disputes/http/routes.ts; src/modules/disputes/service.ts; src/app/server.ts | Users can report unauthorized or mistaken payments and staff can escalate. | No completion evidence imported yet. | Required for money movement. |
| 44 | [ ] | 6.3.1 | P1 | Add | Planned | 0.1.4,6.1.2,6.2.2 | Ops | Add admin and ops routes and services for search, freeze or unfreeze, replay, and case linkage. | src/modules/admin/http/routes.ts; src/modules/admin/service.ts; src/app/server.ts | Support and admin users can operate the product safely. | No completion evidence imported yet. | Ops console backend. |
| 45 | [ ] | 6.3.2 | P1 | Migrate | Planned | 6.3.1 | Ops | Add audit logging for admin and support actions. | src/infrastructure/db/schema.ts; migrations | Every staff action is audit-trailed. | No completion evidence imported yet. | Compliance and support essential. |

### M7 — Notifications, Recovery, and Trust

| Order | Done | Task ID | Priority | Type | Status | Depends On | Workstream | Task | File Path(s) | Acceptance Criteria | Progress / Evidence | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 46 | [ ] | 7.1.1 | P1 | Migrate | Planned | 5.1.1,6.1.2 | Notifications | Add notification schema and inbox model. | src/infrastructure/db/schema.ts; migrations | Notifications can be stored and rendered in-app. | No completion evidence imported yet. | Not just push. |
| 47 | [ ] | 7.1.2 | P1 | Add | Planned | 7.1.1 | Notifications | Add notification services and routes. | src/modules/notifications/service.ts; src/modules/notifications/http/routes.ts; src/app/server.ts | Payment, support, and security notifications can be generated and listed. | No completion evidence imported yet. | User trust and support efficiency. |
| 48 | [ ] | 7.2.1 | P1 | Migrate | Planned | 0.1.1 | Recovery | Add account recovery and session or device inventory schema. | src/infrastructure/db/schema.ts; migrations | Recovery and device or session management have a persistence model. | No completion evidence imported yet. | Required for real users. |
| 49 | [ ] | 7.2.2 | P1 | Add | Planned | 7.2.1 | Recovery | Add recovery, sessions, and revoke routes and services. | src/modules/recovery/http/routes.ts; src/modules/recovery/service.ts; src/modules/sessions/http/routes.ts; src/modules/sessions/service.ts; src/app/server.ts | Users can recover access and manage devices or sessions. | No completion evidence imported yet. | Production account security. |

### M8 — Compliance and Fraud Operations

| Order | Done | Task ID | Priority | Type | Status | Depends On | Workstream | Task | File Path(s) | Acceptance Criteria | Progress / Evidence | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 50 | [ ] | 8.1.1 | P1 | Migrate | Planned | 1.1.1,6.1.2 | Compliance | Add compliance review queue and consent or policy acceptance tracking. | src/infrastructure/db/schema.ts; migrations | Compliance ops and consent history are persisted. | No completion evidence imported yet. | Legal and regulatory requirement. |
| 51 | [ ] | 8.1.2 | P1 | Add | Planned | 8.1.1 | Compliance | Add compliance and consent routes and services. | src/modules/compliance/http/routes.ts; src/modules/compliance/service.ts; src/modules/consent/http/routes.ts; src/modules/consent/service.ts; src/app/server.ts | Review queues and consent history are operable. | No completion evidence imported yet. | Operations layer. |
| 52 | [ ] | 8.2.1 | P1 | Migrate | Planned | 1.1.1,6.3.1 | Fraud Ops | Add fraud review queue schema. | src/infrastructure/db/schema.ts; migrations | Fraud review cases and outcomes are persisted. | No completion evidence imported yet. | Supports manual fraud operations. |
| 53 | [ ] | 8.2.2 | P1 | Add | Planned | 8.2.1 | Fraud Ops | Add fraud review routes and services. | src/modules/fraud/http/routes.ts; src/modules/fraud/service.ts; src/app/server.ts | Fraud analysts can review and disposition flagged activity. | No completion evidence imported yet. | Risk ops visibility. |

### M9 — Split, Reminders, and Advanced Product Flows

| Order | Done | Task ID | Priority | Type | Status | Depends On | Workstream | Task | File Path(s) | Acceptance Criteria | Progress / Evidence | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 54 | [ ] | 9.1.1 | P2 | Migrate | Planned | 4.1.1 | Split | Add split schema. | src/infrastructure/db/schema.ts; migrations | Split groups and participants are modeled. | No completion evidence imported yet. | Advanced feature. |
| 55 | [ ] | 9.1.2 | P2 | Add | Planned | 9.1.1 | Split | Add split routes and services. | src/modules/split/http/routes.ts; src/modules/split/service.ts; src/app/server.ts | Split creation and claim flows work. | No completion evidence imported yet. | Group settlement. |
| 56 | [ ] | 9.2.1 | P2 | Migrate | Planned | 4.1.1,7.1.1 | Reminders | Add reminder schema. | src/infrastructure/db/schema.ts; migrations | Reminder rules and history are modeled. | No completion evidence imported yet. | Nudge engine. |
| 57 | [ ] | 9.2.2 | P2 | Add | Planned | 9.2.1 | Reminders | Add reminder routes, services, and worker. | src/modules/reminder/http/routes.ts; src/modules/reminder/service.ts; src/jobs/reminderSweeper.ts; src/app/server.ts | Scheduled and manual reminders work. | No completion evidence imported yet. | Request follow-up. |

### M10 — CI, Workers, and Repo Hygiene

| Order | Done | Task ID | Priority | Type | Status | Depends On | Workstream | Task | File Path(s) | Acceptance Criteria | Progress / Evidence | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 58 | [ ] | 10.2.1 | P2 | Fix | Planned | 1.2.3,9.2.2 | Workers | Add graceful shutdown, drain behavior, and health exposure for long-running workers. | src/jobs/reconciliationSweeper.ts; src/jobs/reminderSweeper.ts; src/jobs/workerRuntime.ts | Workers stop cleanly, drain safely, and expose health or state where needed. | No completion evidence imported yet. | All three job files (reconciliationSweeper, reminderSweeper, workerRuntime) do not exist yet and must be created as part of this task. |
| 59 | [ ] | 10.3.2 | P2 | Add | In Progress | 0.2.1,0.2.3 | Docs | Document all environment variables and maintain a complete .env.example. | README.md; .env.example | README and .env.example fully document required and optional variables without exposing secrets. | README environment categories and documentation cleanup are in progress, but complete environment-variable coverage and template verification still need explicit closeout. | Absorbs legacy MM-008. |
| 60 | [ ] | 10.3.1 | P2 | Refactor | In Progress | 10.3.2 | Repo Hygiene | Rationalize duplicated docs and define clear source-of-truth locations. | docs/archive/Documents_unpacked/*; docs/archive/app-development-package/*; duplicated top-level docs; README/docs index | Repo has one clear document hierarchy with less duplication and less drift. | Canonical source-of-truth cleanup is active in this pass: authority is collapsing into root `TODO.md`, duplicate task authorities are being demoted, and duplicate backlog material is being removed or archived. | Late cleanup; does not block core ship. |

## Canonical Beta Path

Do not skip the blocker lane.

1. MX preflight lane
2. M0 security and production blockers
3. M1 risk, validation, reconciliation, and provider hardening
4. M2 structured data and request integrity cleanup
5. M3 wallet summary, previews, listings, and deep links
6. M4 intent parsing and recipient resolution
7. M5 conversation-native payment artifacts
8. M6 support, disputes, admin, and audit operations
9. M7 notifications, sessions, and recovery
10. M8 compliance and fraud operations
11. M9 split and reminder systems
12. M10 late-stage repo hygiene and worker refinements

## Non-Negotiables

- [ ] No raw visible payment URLs in normal production conversation UX
- [ ] No silent money execution by AI or intent systems
- [ ] No shipping with placeholder risk logic
- [ ] No user-scoped action without ownership verification
- [ ] No weak or unredacted production logging
- [ ] No production claim without support, disputes, admin, compliance, fraud, notifications, and recovery planning
- [ ] No treating the keyboard as a full typing product

## Definition of Done

- [ ] The root `TODO.md` remains the only canonical plan and progress authority
- [ ] Auth and ownership boundaries are production-safe
- [ ] Risk, abuse, and validation controls are real
- [ ] Webhook ingestion and reconciliation are hardened and replay-safe
- [ ] Wallet summary and preview surfaces support the IME and companion app flows
- [ ] Intent parsing and recipient resolution work on top of the hardened execution core
- [ ] Conversation-native payment artifacts replace naked-link UX in normal flows
- [ ] Support, disputes, admin, notifications, recovery, compliance, and fraud operations exist at usable production level
- [ ] CI enforces install, lint, typecheck, test, build, smoke, and migration gates
- [ ] Core money flows and critical operational flows are covered by automated tests
