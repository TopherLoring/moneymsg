## Version Tracking

| Field | Value |
|---|---|
| Version | v1.0.0 |
| Updated | 2026.04.17 |
| Status | Final |
| Parent | TopherLoring Industries |
| Project | MoneyMsg — Milestone 0: Security & Production Blockers |
| Author | Christopher Rowden |

## Changelog

### v1.0.0 — 2026.04.17

- Initial extraction from implementation plan

---

# Milestone 0 — Security & Production Blockers

**Priority:** P0 — Ship nothing before these are resolved.

---

## 0.1 Lock Down API Auth Model

**Priority:** P0
**Depends on:** None

### Tasks

- [ ] Replace shared static API key model with real auth/session architecture
  - **Type:** Refactor
  - **Files:** `src/lib/auth.ts`, `src/server.ts`, `src/routes/*`, `src/lib/env.ts`
  - **Notes:** Move from single `x-api-key` to authenticated user/admin/service token boundaries. Support role-aware access. Preserve service-level webhook/admin/internal auth separately.

- [ ] Protect KYC submission route
  - **Type:** Fix
  - **Files:** `src/routes/kyc.ts`
  - **Notes:** Add auth. Verify caller can act on `userId`. Block arbitrary KYC submission for other users. Currently unprotected — anyone who can hit the endpoint can submit KYC for any user.

- [ ] Add ownership checks to Plaid linking routes
  - **Type:** Fix
  - **Files:** `src/routes/plaid.ts`
  - **Notes:** Verify user exists. Verify authenticated subject matches target user. Reject source linking to arbitrary user IDs. Currently allows attaching funding sources to any userId.

- [ ] Add role model / auth utilities
  - **Type:** Add
  - **Files:** `src/lib/authz.ts`, `src/lib/session.ts`
  - **Notes:** Roles: user, support, admin, service.

### Tests

- [ ] `tests/auth.kyc-access.test.ts`
- [ ] `tests/auth.plaid-ownership.test.ts`
- [ ] `tests/auth.route-guarding.test.ts`

---

## 0.2 Fix Env & Config Safety

**Priority:** P0
**Depends on:** None

### Tasks

- [ ] Expand env validation to include all security-critical vars
  - **Type:** Fix
  - **Files:** `src/lib/env.ts`, `.env.example`
  - **Notes:** Must validate: `TABAPAY_WEBHOOK_SECRET`, `DWOLLA_WEBHOOK_SECRET`, `API_KEY` (or replacement auth config), `WEBHOOK_SHARED_SECRET`, `WEBHOOK_MAX_SKEW_SECONDS` (numeric constraint), DB SSL mode/cert settings, app/session secrets. Currently missing — app can boot into insecure states.

- [ ] Replace implicit DB SSL behavior with explicit config
  - **Type:** Fix
  - **Files:** `src/db/index.ts`, `.env.example`
  - **Notes:** Remove `rejectUnauthorized: false` default behavior. Make TLS policy explicit per environment. Current behavior disables cert verification for any non-localhost DB URL.

### Tests

- [ ] `tests/env.validation.test.ts`
- [ ] `tests/db.ssl-config.test.ts`

---

## 0.3 Rate Limiting & Abuse Throttling

**Priority:** P0
**Depends on:** 0.1 (auth boundary)

### Tasks

- [ ] Add global and route-level rate limiting
  - **Type:** Add
  - **Files:** `src/server.ts`, `src/lib/rateLimit.ts`
  - **Notes:** Protect: auth-sensitive routes, KYC, Plaid token endpoints, request/create, reminder flows, status lookups, recipient resolution, intent parse endpoints. Currently zero rate limiting exists.

- [ ] Add abuse throttling for request/reminder spam
  - **Type:** Add
  - **Files:** `src/lib/abuse.ts`, `src/routes/request.ts`, `src/routes/reminder.ts` (future)
  - **Notes:** Repeated request spam, repeated nudges, sender abuse scoring, recipient block/mute support (later).

### Tests

- [ ] `tests/rate-limit.test.ts`
- [ ] `tests/request-abuse-throttle.test.ts`

---

## 0.4 Logging, Redaction, & Correlation IDs

**Priority:** P0
**Depends on:** None

### Tasks

- [ ] Configure structured logger with redaction
  - **Type:** Fix
  - **Files:** `src/server.ts`, `src/lib/logger.ts`
  - **Notes:** Redact: auth headers, KYC request bodies, processor tokens, phone/address/PII. Preserve supportable event metadata. Currently `logger: true` with no visible redaction config — PII exposure risk.

- [ ] Add correlation IDs across request lifecycle
  - **Type:** Add
  - **Files:** `src/server.ts`, `src/lib/requestContext.ts`, `src/services/alviere.ts`, `src/services/alviere-kyc.ts`, `src/services/plaid.ts`, `src/services/tabapay.ts`, `src/services/dwolla.ts`, `src/routes/webhooks.ts`
  - **Notes:** Request ID → transaction ID → provider correlation ID → webhook correlation linkage. Currently no end-to-end correlation exists.

### Tests

- [ ] `tests/log-redaction.test.ts`
- [ ] `tests/correlation-id.test.ts`
