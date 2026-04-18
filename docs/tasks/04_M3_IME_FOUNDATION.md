## Version Tracking

| Field | Value |
|---|---|
| Version | v1.0.0 |
| Updated | 2026.04.17 |
| Status | Final |
| Parent | TopherLoring Industries |
| Project | MoneyMsg — Milestone 3: IME Support Foundation |
| Author | Christopher Rowden |

## Changelog

### v1.0.0 — 2026.04.17

- Initial extraction from implementation plan

---

# Milestone 3 — IME Support Foundation

---

## 3.1 Wallet Summary & Listing APIs

**Priority:** P1
**Depends on:** 1.1, 2.3

### Tasks

- [ ] Add wallet summary endpoint
  - **Type:** Add
  - **Files:** `src/routes/walletSummary.ts`, `src/services/walletSummary.ts`
  - **Notes:** Return: available balance, locked balance, `updatedAt`, quick action availability. Optimized for IME — fast, lightweight payload. Support stale-balance protection semantics.

- [ ] Add load/cashout preview endpoints
  - **Type:** Add
  - **Files:** `src/routes/wallet.ts`
  - **Notes:** `/api/v1/wallet/load/preview` and `/api/v1/wallet/cashout/preview`. Return: fee preview, funding source summary, expected outcome.

- [ ] Add richer status/listing endpoints for client surfaces
  - **Type:** Add
  - **Files:** `src/routes/status.ts`, `src/routes/history.ts`
  - **Notes:** Transaction history list, request history list, funding source list. Currently only single-item status lookups exist — no visible pagination/list APIs for core user surfaces.

### Tests

- [ ] `tests/wallet.summary.test.ts`
- [ ] `tests/wallet.preview.test.ts`
- [ ] `tests/history.listing.test.ts`

---

## 3.2 Deep-Link Support Layer

**Priority:** P1
**Depends on:** 3.1

### Tasks

- [ ] Add deep-link helper library
  - **Type:** Add
  - **Files:** `src/lib/deepLinks.ts`
  - **Notes:** Generate deep links for: `moneymsg://wallet`, `moneymsg://wallet/load`, `moneymsg://wallet/cashout`, `moneymsg://wallet/transfer`, `moneymsg://activity`, `moneymsg://settings`, `moneymsg://funding-sources`, `moneymsg://payment/{id}`, `moneymsg://request/{id}`, `moneymsg://split/{id}`, `moneymsg://profile`.

- [ ] Add deep-link metadata into relevant API responses
  - **Type:** Refactor
  - **Files:** `src/routes/wallet.ts`, `src/routes/request.ts`, `src/routes/status.ts`
  - **Notes:** Wallet and request responses should include app handoff hints so IME/client can route directly to correct app screen.

### Tests

- [ ] `tests/deeplink.responses.test.ts`
