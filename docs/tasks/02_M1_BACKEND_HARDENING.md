## Version Tracking

| Field | Value |
|---|---|
| Version | v1.0.1 |
| Updated | 2026.04.18 04:56 AM CT |
| Status | Final |
| Parent | TopherLoring Industries |
| Project | MoneyMsg — Milestone 1: Backend Financial Hardening |
| Author | Christopher Rowden |

## Changelog

### v1.0.1 — 2026.04.18 04:56 AM CT

- Normalized task file paths to the standardized repository layout
- Replaced stale pre-standardization references to legacy route, service, lib, and archive paths

### v1.0.0 — 2026.04.17

- Initial extraction from implementation plan

---

# Milestone 1 — Backend Financial Hardening

---

## 1.1 Replace Placeholder Risk Engine

**Priority:** P0
**Depends on:** 0.1, 0.4

### Tasks

- [ ] Replace `evaluateRisk()` placeholder — currently always returns `allow=true`
  - **Type:** Fix
  - **Files:** `src/domain/risk/scorer.ts`
  - **Notes:** Return structured outcomes: `allow`, `step_up`, `review`, `deny`. Use: deviceInfo, ipAddress, riskMeta, first-use recipient, first-use funding source, abnormal amount, repeated failures, phrase-based scam heuristics, velocity anomalies. Add rule codes and risk score outputs.

- [ ] Expand hard rule checks
  - **Type:** Refactor
  - **Files:** `src/domain/risk/index.ts`
  - **Notes:** Extend daily limits by transaction type and risk profile. Add: per-device velocity, per-IP velocity, per-recipient velocity, per-funding-source velocity. Improve duplicate checks to include recipient, source, and recent window context. Add first-use step-up requirements.

- [ ] Define structured risk signal schema
  - **Type:** Add
  - **Files:** `src/domain/risk/signals.ts`, `src/shared/schemas.ts`

- [ ] Add first-use and anomaly step-up logic
  - **Type:** Add
  - **Files:** `src/domain/risk/scorer.ts`, `src/domain/risk/index.ts`
  - **Notes:** Helper methods: `assertRecipientVelocity`, `assertFundingSourceVelocity`, `assertDeviceVelocity`, `assertIpVelocity`, `assertFirstUseStepUp`, `assertHighRiskPhraseStepUp`.

### Tests

- [ ] `tests/risk.allow-stepup-deny.test.ts`
- [ ] `tests/risk.velocity.test.ts`
- [ ] `tests/risk.first-use-recipient.test.ts`
- [ ] `tests/risk.first-use-funding-source.test.ts`

---

## 1.2 Harden Schemas & Payload Validation

**Priority:** P0
**Depends on:** None

### Tasks

- [ ] Replace open-ended `riskMetaSchema` and `deviceInfoSchema` with explicit typed contracts
  - **Type:** Fix
  - **Files:** `src/shared/schemas.ts`
  - **Notes:** Currently accept arbitrary objects with unrestricted additional properties. Causes inconsistent client payloads, garbage data, weaker analytics, potential privacy overcollection.

- [ ] Add strong KYC schema
  - **Type:** Add
  - **Files:** `src/modules/kyc/schemas.ts`, `src/modules/kyc/http/routes.ts`
  - **Notes:** Currently validates only that `kycData` is an object. Bad payloads hit provider code directly.

- [ ] Add validation for Plaid payload fields and funding-source metadata
  - **Type:** Fix
  - **Files:** `src/modules/plaid/http/routes.ts`

### Tests

- [ ] `tests/schema.device-risk.test.ts`
- [ ] `tests/schema.kyc.test.ts`
- [ ] `tests/schema.plaid.test.ts`

---

## 1.3 Webhook & Reconciliation Hardening

**Priority:** P0
**Depends on:** 0.2, 0.4

### Tasks

- [ ] Fix malformed signature handling in HMAC compare
  - **Type:** Fix
  - **Files:** `src/modules/webhooks/http/routes.ts`
  - **Notes:** `timingSafeEqual` requires equal-length buffers. Current `verifyHmac()` does not precheck lengths. Malformed headers throw 500 instead of clean 401.

- [ ] Expand reconciliation state model
  - **Type:** Refactor
  - **Files:** `src/modules/webhooks/http/routes.ts`, `src/infrastructure/db/schema.ts`
  - **Notes:** Separate "logged" from "reconciled" from "finalized". Add provider event correlation improvements and stronger failure handling per transaction type.

- [ ] Add replay-safe reconciliation service
  - **Type:** Add
  - **Files:** `src/modules/reconciliation/service.ts`

- [ ] Add unresolved event monitoring fields
  - **Type:** Migrate
  - **Files:** `src/infrastructure/db/schema.ts`, new migration file

- [ ] Add reconciliation sweeper / retry worker
  - **Type:** Add
  - **Files:** `src/jobs/reconciliationSweeper.ts`

### Tests

- [ ] `tests/webhook.signature-malformed.test.ts`
- [ ] `tests/webhook.reconcile.success-failure.test.ts`
- [ ] `tests/webhook.replay.test.ts`
- [ ] `tests/reconciliation.retry.test.ts`

---

## 1.4 Provider Wrapper Quality

**Priority:** P1
**Depends on:** 0.4, 1.3

### Tasks

- [ ] Normalize provider error classes
  - **Type:** Refactor
  - **Files:** `src/integrations/alviere/client.ts`, `src/integrations/alviere/kyc.ts`, `src/integrations/plaid/client.ts`, `src/integrations/tabapay/client.ts`, `src/integrations/dwolla/client.ts`, `src/shared/errors.ts`
  - **Notes:** Map provider-specific errors into internal enums. Mark retryable vs non-retryable.

- [ ] Attach correlation metadata to outbound provider calls
  - **Type:** Add
  - **Files:** Same as above

- [ ] Persist richer provider metadata where useful
  - **Type:** Migrate
  - **Files:** `src/infrastructure/db/schema.ts`, new migration(s)
  - **Notes:** Capture raw provider transfer reference and metadata for audits/replay.

### Tests

- [ ] `tests/provider.error-normalization.test.ts`
- [ ] `tests/provider.correlation.test.ts`
