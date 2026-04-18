## Version Tracking

| Field | Value |
|---|---|
| Version | v1.0.1 |
| Updated | 2026.04.18 04:56 AM CT |
| Status | Final |
| Parent | TopherLoring Industries |
| Project | MoneyMsg — Milestone 8: Compliance & Fraud Ops |
| Author | Christopher Rowden |

## Changelog

### v1.0.1 — 2026.04.18 04:56 AM CT

- Normalized task file paths to the standardized repository layout
- Replaced stale pre-standardization references to legacy route, service, lib, and archive paths

### v1.0.0 — 2026.04.17

- Initial extraction from implementation plan

---

# Milestone 8 — Compliance & Fraud Ops

---

## 8.1 Compliance Ops Layer

**Priority:** P1
**Depends on:** 1.1, 6.1

### Tasks

- [ ] Add compliance review queue schema
  - **Type:** Add/Migrate
  - **Files:** schema + migrations
  - **Notes:** Sanctions/AML review queue, suspicious activity escalation flow, document re-request flow, KYC retry/remediation flow.

- [ ] Add compliance routes/services
  - **Type:** Add
  - **Files:** `src/modules/compliance/http/routes.ts`, `src/modules/compliance/service.ts`
  - **Notes:** Manual review tooling, retention policy enforcement, regulatory event logging, audit export capability.

- [ ] Add policy/consent acceptance tracking
  - **Type:** Add/Migrate
  - **Files:** schema + migrations, `src/modules/consent/http/routes.ts`, `src/modules/consent/service.ts`
  - **Notes:** Terms of Service acceptance tracking, Privacy Policy acceptance tracking, payment authorization consent logging, keyboard permission explanation and consent, biometric/PIN authorization consent logging, marketing/notification consent controls, policy version history tied to user records.

### Tests

- [ ] `tests/compliance.review-queue.test.ts`
- [ ] `tests/consent.acceptance-history.test.ts`

---

## 8.2 Fraud Ops Tooling

**Priority:** P1
**Depends on:** 1.1, 6.3

### Tasks

- [ ] Add fraud review queue schema
  - **Type:** Add/Migrate
  - **Files:** schema + migrations
  - **Notes:** Flagged transaction console, account/device/IP network view, rule hit visibility.

- [ ] Add fraud review routes/services
  - **Type:** Add
  - **Files:** `src/modules/fraud/http/routes.ts`, `src/modules/fraud/service.ts`
  - **Notes:** Decision override workflow, watchlist support, first-party fraud notes/history, known scam pattern tagging, internal fraud outcome feedback loop.

### Tests

- [ ] `tests/fraud.review-queue.test.ts`
