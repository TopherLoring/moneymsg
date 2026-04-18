# MoneyMsg TODO

––––––––––––––––––––––––––––––
VERSION TRACKING
––––––––––––––––––––––––––––––
Version:     v1.2.0
Updated:     2026.04.17
Status:      In Progress
Parent:      TopherLoring Industries
Project:     MoneyMsg
Author:      Christopher Rowden
––––––––––––––––––––––––––––––
CHANGELOG
––––––––––––––––––––––––––––––
v1.2.0 — 2026.04.17
- Phase A (M0) complete — all security blockers implemented
- 0.1 Auth: JWT model, roles, ownership checks on all routes
- 0.2 Env: full Zod validation, explicit DB SSL, .env.example rewrite
- 0.3 Rate limiting: global + route-level + abuse throttling
- 0.4 Logging: pino redaction, correlation IDs, x-request-id
- 1.3 HMAC buffer crash fix applied
- CI updated with new env vars

v1.1.0 — 2026.04.17
- Hardened financial integrity requirements
- Added Idempotency Key support for API execution
- Integrated Immutable Audit Trail requirements
- Added Risk Engine "Shadow Mode" for tuning
- Added IME fail-safe/bypass requirements
- Added Webhook idempotency and dependency auditing to CI

v1.0.0 — 2026.04.16
- Initial repo TODO backlog added

## Purpose

This file is the repo-native execution backlog for MoneyMsg.

It reflects the current agreed direction:
- keyboard-first, not keyboard-only
- specialized Android IME payment/action surface
- companion app as trust, management, and recovery surface
- hardened backend financial execution core
- orchestration layer for intent, recipient resolution, and conversation artifacts
- production operations stack including support, disputes, admin, compliance, fraud, notifications, recovery, and reporting

## Priority Legend
- P0 = blocker / security / production-critical
- P1 = core shipping work
- P2 = important follow-up
- P3 = later optimization

## Type Legend
- Fix = correct existing behavior
- Add = new file/module/endpoint
- Refactor = restructure without changing core intent
- Migrate = DB/schema/config change
- Test = automated validation
- Ops = deployment/CI/monitoring/admin/support work

## Milestone 0 — Security and production blockers

### 0.1 Auth overhaul
- [x] P0 Refactor `src/lib/auth.ts` to replace the shared static API key model
- [x] P0 Add authenticated user/session boundaries with ownership checks
- [x] P0 Add support/admin/service role separation
- [x] P0 Fix `src/routes/kyc.ts` to require auth and verify subject ownership
- [x] P0 Fix `src/routes/plaid.ts` to verify user existence and ownership before linking funding sources
- [x] P0 Add auth utilities for role and session handling
- [ ] P0 Test auth guards for KYC, Plaid, wallet, request, transfer, status, and future admin/support routes

### 0.2 Environment and config safety
- [x] P0 Fix `src/lib/env.ts` to validate all security-critical environment variables
- [x] P0 Validate webhook secrets, auth/session secrets, skew windows, and TLS config explicitly
- [x] P0 Fix `.env.example` to match actual required runtime configuration
- [x] P0 Fix `src/db/index.ts` to remove implicit `rejectUnauthorized: false` behavior and move TLS behavior to explicit config
- [ ] P0 Test boot failure on invalid/missing security config

### 0.3 Rate limiting and abuse controls
- [x] P0 Add route/global rate limiting infrastructure in `src/server.ts`
- [x] P0 Add `src/lib/rateLimit.ts`
- [x] P0 Protect KYC, Plaid, intent, request, reminder, status, and auth-sensitive endpoints
- [x] P0 Add request/reminder abuse throttling rules
- [ ] P0 Add future recipient block/mute and abuse report support hooks
- [ ] P0 Test route throttling and abuse scenarios

### 0.4 Logging, redaction, and request tracing
- [x] P0 Fix `src/server.ts` logging to use explicit redaction-safe configuration
- [x] P0 Add `src/lib/logger.ts`
- [x] P0 Add `src/lib/requestContext.ts` for request correlation IDs
- [ ] P0 Propagate correlation IDs through provider service calls and webhook reconciliation
- [x] P0 Redact auth headers, processor tokens, KYC payloads, phone/address/PII, and other sensitive values
- [ ] P0 Test log redaction and correlation propagation

## Milestone 1 — Backend hardening of the current financial core

### 1.1 Replace placeholder risk engine
- [ ] P0 Fix `src/lib/riskScorer.ts` so it no longer always allows
- [ ] P0 Add structured risk outcomes: allow, step_up, review, deny
- [ ] P1 Add "Shadow Mode" toggle for risk engine to allow threshold tuning against live traffic without blocking
- [ ] P0 Expand `src/lib/risk.ts` with velocity, first-use, anomaly, and duplicate protections
- [ ] P0 Add `src/lib/riskSignals.ts`
- [ ] P0 Tighten `src/lib/schemas.ts` for device and risk payload contracts
- [ ] P0 Test risk decisions, limits, and first-use scenarios

### 1.2 Validation hardening
- [ ] P0 Fix `src/routes/kyc.ts` to use a real KYC schema instead of accepting any object
- [ ] P0 Add `src/lib/kycSchemas.ts`
- [ ] P0 Tighten Plaid route validation and funding-source metadata validation
- [ ] P0 Replace open-ended risk/device metadata acceptance with typed schemas
- [ ] P0 Test schema validation behavior for KYC, Plaid, wallet, request, transfer, and intent payloads

### 1.3 Webhooks and reconciliation
- [x] P0 Fix `src/routes/webhooks.ts` malformed signature handling so invalid signatures fail cleanly
- [ ] P0 Add webhook event idempotency checks in `reconciliationService` to prevent double-processing
- [ ] P0 Refactor reconciliation to separate logged, reconciled, and finalized states
- [ ] P0 Add `src/services/reconciliationService.ts`
- [ ] P0 Add `src/workers/reconciliationSweeper.ts`
- [ ] P0 Add replay-safe reconciliation logic and unresolved event monitoring
- [ ] P0 Add reconciliation/audit schema fields and migrations
- [ ] P0 Test success/failure/replay/retry/reconciliation edge cases

### 1.4 Provider wrapper improvements
- [ ] P1 Refactor `src/services/alviere.ts` for normalized errors and correlation metadata
- [ ] P1 Refactor `src/services/alviere-kyc.ts` for normalized errors and correlation metadata
- [ ] P1 Refactor `src/services/plaid.ts` for normalized errors and correlation metadata
- [ ] P1 Refactor `src/services/tabapay.ts` for normalized errors and correlation metadata
- [ ] P1 Refactor `src/services/dwolla.ts` for normalized errors and correlation metadata
- [ ] P1 Persist richer provider metadata where useful for audits and replay
- [ ] P1 Test provider error normalization and provider correlation behavior

## Milestone 2 — Data model cleanup and structural improvements

### 2.1 Structured operational metadata and Auditing
- [ ] P0 Migrate `src/db/schema.ts` to include an immutable `audit_events` table for financial trails
- [ ] P1 Migrate risk/device/request operational metadata to structured queryable storage where appropriate
- [ ] P1 Add indexes for operational investigation and analytics queries
- [ ] P1 Test metadata reads/writes and queryability

### 2.2 Payment request integrity
- [ ] P0 Add Idempotency Key support (e.g., `X-Idempotency-Key`) for all transfer, load, and request endpoints
- [ ] P1 Migrate `src/db/requests.ts` to enforce stronger request idempotency/uniqueness at the DB layer
- [ ] P1 Add status/expiry indexes for payment requests
- [ ] P1 Test duplicate request prevention and expiry behavior

### 2.3 Funding source lifecycle
- [ ] P1 Migrate funding source model to support lifecycle states beyond `isActive`
- [ ] P1 Add `src/routes/fundingSources.ts`
- [ ] P1 Add `src/services/fundingSources.ts`
- [ ] P1 Add list/remove/default-source behavior
- [ ] P1 Add duplicate-source prevention and default-source support
- [ ] P1 Test funding source lifecycle operations

## Milestone 3 — IME support foundation and wallet surfaces

### 3.1 Wallet summary and preview APIs
- [ ] P1 Add IME fail-safe/bypass mechanism to ensure standard input is always available if specialized UI fails
- [ ] P1 Add `src/routes/walletSummary.ts`
- [ ] P1 Add `src/services/walletSummary.ts`
- [ ] P1 Add wallet summary endpoint for IME balance display
- [ ] P1 Add load preview and cashout preview endpoints in `src/routes/wallet.ts`
- [ ] P1 Add richer transaction/request/funding-source listing endpoints for client surfaces
- [ ] P1 Test wallet summary, previews, and listing behavior

### 3.2 App deep-link support
- [ ] P1 Add `src/lib/deepLinks.ts`
- [ ] P1 Add app deep-link metadata to relevant API responses
- [ ] P1 Standardize wallet/activity/settings/payment/request/split route targets for companion app handoff
- [ ] P1 Test deep-link payload shaping

## Milestone 4 — Intent and recipient orchestration layer

### 4.1 Orchestration schema
- [ ] P1 Migrate `src/db/schema.ts` to add `conversations`
- [ ] P1 Migrate `src/db/schema.ts` to add `intent_events`
- [ ] P1 Migrate `src/db/schema.ts` to add `recipient_hints`
- [ ] P1 Migrate `src/db/schema.ts` to add `parser_feedback`
- [ ] P1 Migrate `src/db/schema.ts` to add `conversation_artifacts`
- [ ] P1 Add indexes for recipient lookup, artifact state, and orchestration telemetry
- [ ] P1 Test new schema integrity and linkage to current transaction/request objects

### 4.2 Intent API surface
- [ ] P1 Add `src/routes/intent.ts`
- [ ] P1 Add `src/services/intentParser.ts`
- [ ] P1 Add `src/services/intentOrchestrator.ts`
- [ ] P1 Add `src/lib/intentSchemas.ts`
- [ ] P1 Add routes for parse, confirm, suggestions, and feedback
- [ ] P1 Route orchestration outputs into existing wallet/request/transfer execution endpoints
- [ ] P1 Test intent parsing, clarification, confirmation, and routing

### 4.3 Recipient resolution
- [ ] P1 Add `src/routes/recipient.ts`
- [ ] P1 Add `src/services/recipientResolver.ts`
- [ ] P1 Add recent/frequent/candidate recipient ranking support
- [ ] P1 Add ambiguity handling and correction feedback capture
- [ ] P1 Test recipient resolution, candidate ranking, and ambiguity flows

## Milestone 5 — Conversation-native payment artifacts

### 5.1 Artifact generation and lifecycle
- [ ] P1 Add `src/services/conversationArtifacts.ts`
- [ ] P1 Add artifact state transitions mapped to transaction/request state
- [ ] P1 Add support for send/request/split/reminder/status/completion artifact types
- [ ] P1 Enforce no raw visible payment URLs in normal user-facing thread UX
- [ ] P1 Add fallback rendering path for less-capable surfaces
- [ ] P1 Test artifact lifecycle and fallback rendering behavior

## Milestone 6 — Support, disputes, and operations backbone

### 6.1 Support engine
- [ ] P1 Migrate support case schema into `src/db/schema.ts`
- [ ] P1 Add `src/routes/support.ts`
- [ ] P1 Add `src/services/support.ts`
- [ ] P1 Add support case creation, updates, transaction/request linking, internal notes, and attachments metadata support
- [ ] P1 Add status states: open, investigating, waiting_on_user, escalated, resolved
- [ ] P1 Test support case creation and linking flows

### 6.2 Disputes and exceptions
- [ ] P1 Migrate dispute and exception schema into `src/db/schema.ts`
- [ ] P1 Add `src/routes/disputes.ts`
- [ ] P1 Add `src/services/disputes.ts`
- [ ] P1 Add wallet/account freeze and review state support
- [ ] P1 Test dispute intake and freeze/review workflows

### 6.3 Admin / ops console backend
- [ ] P1 Add `src/routes/admin.ts`
- [ ] P1 Add `src/services/admin.ts`
- [ ] P1 Add search/list/internal action endpoints for users, wallets, transactions, requests, support cases, webhook/reconciliation state
- [ ] P1 Add admin audit logging for all internal actions
- [ ] P1 Test admin action auditing and restrictions

## Milestone 7 — Notifications, recovery, and trust

### 7.1 Notification engine
- [ ] P1 Migrate notification schema into `src/db/schema.ts`
- [ ] P1 Add `src/routes/notifications.ts`
- [ ] P1 Add `src/services/notifications.ts`
- [ ] P1 Add notification inbox and event-triggered notification support
- [ ] P1 Test notification creation and inbox retrieval

### 7.2 Account recovery and security flows
- [ ] P1 Migrate recovery/session/security schema into `src/db/schema.ts`
- [ ] P1 Add `src/routes/recovery.ts`
- [ ] P1 Add `src/services/recovery.ts`
- [ ] P1 Add `src/routes/sessions.ts`
- [ ] P1 Add `src/services/sessions.ts`
- [ ] P1 Add session inventory, revoke, and recovery flows
- [ ] P1 Test recovery and session management

## Milestone 8 — Compliance, fraud ops, and legal tracking

### 8.1 Compliance ops
- [ ] P1 Migrate compliance review queue schema into `src/db/schema.ts`
- [ ] P1 Add `src/routes/compliance.ts`
- [ ] P1 Add `src/services/compliance.ts`
- [ ] P1 Add policy/consent acceptance tracking schema
- [ ] P1 Add `src/routes/consent.ts`
- [ ] P1 Add `src/services/consent.ts`
- [ ] P1 Test compliance review and consent history behavior

### 8.2 Fraud ops
- [ ] P1 Migrate fraud review queue schema into `src/db/schema.ts`
- [ ] P1 Add `src/routes/fraud.ts`
- [ ] P1 Add `src/services/fraud.ts`
- [ ] P1 Add manual fraud review and override support
- [ ] P1 Test fraud queue behavior

## Milestone 9 — Split, reminders, and advanced product flows

### 9.1 Split engine
- [ ] P2 Migrate split schema into `src/db/schema.ts`
- [ ] P2 Add `src/routes/split.ts`
- [ ] P2 Add `src/services/split.ts`
- [ ] P2 Add equal/custom group settlement logic
- [ ] P2 Test split creation and claim/payment behavior

### 9.2 Reminder engine
- [ ] P2 Migrate reminder schema into `src/db/schema.ts`
- [ ] P2 Add `src/routes/reminder.ts`
- [ ] P2 Add `src/services/reminderService.ts`
- [ ] P2 Add `src/workers/reminderSweeper.ts`
- [ ] P2 Add reminder scheduling and sending behavior for unpaid requests and split groups
- [ ] P2 Test reminder schedule/send behavior

## Milestone 10 — CI, workers, and repo hygiene

### 10.1 Real CI gates
- [ ] P0 Add `bun audit` to CI gates for dependency vulnerability scanning
- [ ] P0 Add real lint configuration and scripts in `package.json`
- [ ] P0 Add real test runner configuration and scripts in `package.json`
- [ ] P0 Expand `.github/workflows/ci.yml` beyond build-and-smoke
- [ ] P0 Add migration validation to CI
- [ ] P0 Add financial test and route test execution in CI

### 10.2 Worker lifecycle
- [ ] P2 Fix `src/workers/intentSweeper.ts` for graceful shutdown behavior
- [ ] P2 Fix `src/workers/requestSweeper.ts` for graceful shutdown behavior
- [ ] P2 Add worker heartbeat/health support
- [ ] P2 Define singleton/leader strategy or deployment constraints for workers
- [ ] P2 Test worker lifecycle behavior

### 10.3 Repo hygiene and documentation governance
- [ ] P2 Rationalize duplicated docs under `Documents_unpacked` and top-level copies
- [ ] P2 Define source-of-truth doc locations
- [ ] P2 Add version/governance discipline for major repo docs and planning files

## Test Backlog
- [ ] P0 Add `tests/idempotency.headers.test.ts`
- [ ] P0 Add `tests/auth.kyc-access.test.ts`
- [ ] P0 Add `tests/auth.plaid-ownership.test.ts`
- [ ] P0 Add `tests/auth.route-guarding.test.ts`
- [ ] P0 Add `tests/env.validation.test.ts`
- [ ] P0 Add `tests/db.ssl-config.test.ts`
- [ ] P0 Add `tests/rate-limit.test.ts`
- [ ] P0 Add `tests/request-abuse-throttle.test.ts`
- [ ] P0 Add `tests/log-redaction.test.ts`
- [ ] P0 Add `tests/correlation-id.test.ts`
- [ ] P0 Add `tests/risk.allow-stepup-deny.test.ts`
- [ ] P0 Add `tests/risk.velocity.test.ts`
- [ ] P0 Add `tests/risk.first-use-recipient.test.ts`
- [ ] P0 Add `tests/risk.first-use-funding-source.test.ts`
- [ ] P0 Add `tests/schema.device-risk.test.ts`
- [ ] P0 Add `tests/schema.kyc.test.ts`
- [ ] P0 Add `tests/schema.plaid.test.ts`
- [ ] P0 Add `tests/webhook.signature-malformed.test.ts`
- [ ] P0 Add `tests/webhook.reconcile.success-failure.test.ts`
- [ ] P0 Add `tests/webhook.replay.test.ts`
- [ ] P0 Add `tests/reconciliation.retry.test.ts`
- [ ] P1 Add `tests/provider.error-normalization.test.ts`
- [ ] P1 Add `tests/provider.correlation.test.ts`
- [ ] P1 Add `tests/schema.jsonb-metadata.test.ts`
- [ ] P1 Add `tests/request.idempotency-db.test.ts`
- [ ] P1 Add `tests/request.expiry-index-behavior.test.ts`
- [ ] P1 Add `tests/funding-sources.list-remove-default.test.ts`
- [ ] P1 Add `tests/funding-sources.duplicate-prevention.test.ts`
- [ ] P1 Add `tests/wallet.summary.test.ts`
- [ ] P1 Add `tests/wallet.preview.test.ts`
- [ ] P1 Add `tests/history.listing.test.ts`
- [ ] P1 Add `tests/deeplink.responses.test.ts`
- [ ] P1 Add `tests/schema.intent-conversation.test.ts`
- [ ] P1 Add `tests/intent.parse-routing.test.ts`
- [ ] P1 Add `tests/intent.feedback.test.ts`
- [ ] P1 Add `tests/recipient.resolve.test.ts`
- [ ] P1 Add `tests/recipient.ambiguity.test.ts`
- [ ] P1 Add `tests/artifact.lifecycle.test.ts`
- [ ] P1 Add `tests/artifact.fallback-rendering.test.ts`
- [ ] P1 Add `tests/support.case-create-update.test.ts`
- [ ] P1 Add `tests/support.case-linking.test.ts`
- [ ] P1 Add `tests/disputes.intake.test.ts`
- [ ] P1 Add `tests/disputes.freeze-review.test.ts`
- [ ] P1 Add `tests/admin.actions-audit.test.ts`
- [ ] P1 Add `tests/notifications.inbox.test.ts`
- [ ] P1 Add `tests/notifications.event-trigger.test.ts`
- [ ] P1 Add `tests/recovery.flow.test.ts`
- [ ] P1 Add `tests/sessions.inventory-revoke.test.ts`
- [ ] P1 Add `tests/compliance.review-queue.test.ts`
- [ ] P1 Add `tests/consent.acceptance-history.test.ts`
- [ ] P1 Add `tests/fraud.review-queue.test.ts`
- [ ] P2 Add `tests/split.create-claim.test.ts`
- [ ] P2 Add `tests/reminder.schedule-send.test.ts`
- [ ] P2 Add `tests/workers.shutdown-health.test.ts`

## Shipping Sequence

### Beta-critical sequence
1. Auth overhaul
2. KYC/Plaid ownership fixes
3. Env/TLS/logging hardening
4. Rate limiting
5. Risk engine replacement (with Shadow Mode)
6. Validation tightening
7. Webhook/reconciliation hardening (with Idempotency)
8. CI/test gates (with Bun Audit)
9. Funding-source lifecycle
10. Wallet summary and preview APIs (with IME fail-safe)
11. Intent schema and intent endpoints
12. Recipient resolution
13. Conversation artifact lifecycle
14. Support engine
15. Notifications
16. Admin/ops backend
17. Disputes
18. Recovery/session security

### Follow-up sequence
19. Compliance ops
20. Fraud ops
21. Split flows
22. Reminder engine
23. Worker lifecycle improvements
24. Repo/doc hygiene

## Non-negotiables
- [ ] No raw visible payment URLs in normal user-facing thread UX
- [ ] No silent money execution by AI or intent systems
- [ ] No placeholder risk logic in production
- [ ] No user-scoped actions without ownership verification
- [ ] No weak/no-redaction logging in production
- [ ] No shipping without support/disputes/admin/compliance/recovery planning
- [ ] No treating the keyboard as a full typing product

## Definition of Done
- [ ] Auth model is production-safe
- [ ] KYC and funding-source actions are ownership-bound
- [ ] Risk and abuse controls are real
- [ ] Webhooks and reconciliation are hardened
- [ ] Wallet summary supports the IME
- [ ] Intent + recipient orchestration works on top of the execution core
- [ ] Payment artifacts replace raw-link UX in normal flows
- [ ] Support/disputes/admin/notifications/recovery exist at usable production level
- [ ] CI enforces quality gates
- [ ] Core money flows and critical ops flows have automated tests
