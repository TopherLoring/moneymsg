## Version Tracking

| Field | Value |
|---|---|
| Version | v1.0.1 |
| Updated | 2026.04.18 04:56 AM CT |
| Status | Final |
| Parent | TopherLoring Industries |
| Project | MoneyMsg — Milestone 6: Support, Disputes & Admin Ops |
| Author | Christopher Rowden |

## Changelog

### v1.0.1 — 2026.04.18 04:56 AM CT

- Normalized task file paths to the standardized repository layout
- Replaced stale pre-standardization references to legacy route, service, lib, and archive paths

### v1.0.0 — 2026.04.17

- Initial extraction from implementation plan

---

# Milestone 6 — Support, Disputes & Admin Ops

---

## 6.1 Support Engine

**Priority:** P1
**Depends on:** 0.1 (auth roles), 3.1 (listing/status)

### Tasks

- [ ] Add support case schema
  - **Type:** Add/Migrate
  - **Files:** `src/infrastructure/db/schema.ts`, migrations
  - **Notes:** Tables: cases, messages/updates, attachments metadata, internal notes. Fields: category (payment missing, duplicate charge, recipient issue, account access, KYC/funding source problem, scam/fraud report), status (open, investigating, waiting_on_user, resolved, escalated), transaction/request linking.

- [ ] Add support routes
  - **Type:** Add
  - **Files:** `src/modules/support/http/routes.ts`, `src/app/server.ts`

- [ ] Add transaction/request linking to support cases
  - **Type:** Refactor
  - **Files:** schema/routes/services

- [ ] Add support service layer
  - **Type:** Add
  - **Files:** `src/modules/support/service.ts`
  - **Notes:** Case timeline, macro responses, templated workflows, user-visible resolution updates, audit trail for every agent action.

### Tests

- [ ] `tests/support.case-create-update.test.ts`
- [ ] `tests/support.case-linking.test.ts`

---

## 6.2 Disputes & Exception Workflows

**Priority:** P1
**Depends on:** 6.1

### Tasks

- [ ] Add dispute schema/state model
  - **Type:** Add/Migrate
  - **Files:** schema + migrations
  - **Notes:** Dispute intake flow, unauthorized transaction reporting, mistaken payment reporting, failed payout/load resolution flow.

- [ ] Add dispute intake and escalation routes
  - **Type:** Add
  - **Files:** `src/modules/disputes/http/routes.ts`, `src/modules/disputes/service.ts`
  - **Notes:** Evidence collection, case-to-provider escalation tracking, operator-controlled reversal/refund workflow.

- [ ] Add wallet/transaction freeze flags and review states
  - **Type:** Migrate
  - **Files:** schema + migrations
  - **Notes:** Freeze/escalate flags on wallets, users, and transactions.

### Tests

- [ ] `tests/disputes.intake.test.ts`
- [ ] `tests/disputes.freeze-review.test.ts`

---

## 6.3 Admin / Operations Console Backend

**Priority:** P1
**Depends on:** 0.1 (auth roles), 6.1, 6.2

### Tasks

- [ ] Add admin search/list endpoints
  - **Type:** Add
  - **Files:** `src/modules/admin/http/routes.ts`, `src/modules/admin/service.ts`
  - **Notes:** User search, wallet search, transaction search, request search, case search, funding source visibility, webhook event visibility, risk flags, recent failures, stuck/pending transfers.

- [ ] Add internal action endpoints
  - **Type:** Add
  - **Files:** admin routes/services
  - **Notes:** freeze/unfreeze, replay reconciliation, link case to transaction, add internal notes, view event timeline.

- [ ] Add audit logging for admin/support actions
  - **Type:** Add/Migrate
  - **Files:** schema + routes/services
  - **Notes:** Every admin action must be logged with actor, timestamp, action, target, and reason.

- [ ] Review and restrict `providerRef` exposure in public API responses
  - **Type:** Fix
  - **Files:** `src/modules/status/http/routes.ts`
  - **Notes:** Status route currently returns `providerRef` directly. Should be reviewed for whether it belongs in public/mobile-facing responses vs admin-only.

### Tests

- [ ] `tests/admin.actions-audit.test.ts`
