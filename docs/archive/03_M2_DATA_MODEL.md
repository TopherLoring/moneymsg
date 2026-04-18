## Version Tracking

| Field | Value |
|---|---|
| Version | v1.0.0 |
| Updated | 2026.04.17 |
| Status | Final |
| Parent | TopherLoring Industries |
| Project | MoneyMsg — Milestone 2: Data Model & Structural Cleanup |
| Author | Christopher Rowden |

## Changelog

### v1.0.0 — 2026.04.17

- Initial extraction from implementation plan

---

# Milestone 2 — Data Model & Structural Cleanup

---

## 2.1 Structured Metadata Storage

**Priority:** P1
**Depends on:** 1.2

### Tasks

- [ ] Convert `riskMeta`, `deviceInfo`, and selected payload fields from text to structured jsonb (or equivalent queryable design)
  - **Type:** Migrate
  - **Files:** `src/infrastructure/db/schema.ts`, `src/infrastructure/db/requests.ts`, migration files
  - **Notes:** Currently stored as text blobs — poor queryability, poor support tooling, poor fraud investigation ergonomics, poor analytics, harder migration path later.

- [ ] Add indexes for operational investigations
  - **Type:** Migrate
  - **Files:** migration files

### Tests

- [ ] `tests/schema.jsonb-metadata.test.ts`

---

## 2.2 Request Idempotency Hardening

**Priority:** P1
**Depends on:** None

### Tasks

- [ ] Add DB-backed uniqueness/idempotency for payment requests
  - **Type:** Migrate
  - **Files:** `src/infrastructure/db/requests.ts`, migration files
  - **Notes:** `payment_requests` stores an `idempotencyKey` but has no visible uniqueness/index enforcement like transactions do. Duplicate request creation safety is weaker than transaction safety.

- [ ] Add request-status indexes for expiry and lookup
  - **Type:** Migrate
  - **Files:** migration files

### Tests

- [ ] `tests/request.idempotency-db.test.ts`
- [ ] `tests/request.expiry-index-behavior.test.ts`

---

## 2.3 Funding Source Lifecycle

**Priority:** P1
**Depends on:** 0.1, 1.2

### Tasks

- [ ] Add funding-source management states
  - **Type:** Migrate
  - **Files:** `src/infrastructure/db/schema.ts`, migration files
  - **Notes:** Schema has `isActive` but no lifecycle support for: deleting/removing, replacing, marking verification-failed, preventing duplicates, setting default, nickname/label management.

- [ ] Add list/remove/default-source endpoints
  - **Type:** Add
  - **Files:** `src/routes/fundingSources.ts`, `src/services/fundingSources.ts`

- [ ] Add duplicate-source prevention
  - **Type:** Fix
  - **Files:** `src/modules/plaid/http/routes.ts`, schema/migration files

### Tests

- [ ] `tests/funding-sources.list-remove-default.test.ts`
- [ ] `tests/funding-sources.duplicate-prevention.test.ts`
