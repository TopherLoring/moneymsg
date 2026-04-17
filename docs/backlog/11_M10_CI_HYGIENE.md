## Version Tracking

| Field | Value |
|---|---|
| Version | v1.0.0 |
| Updated | 2026.04.17 |
| Status | Final |
| Parent | TopherLoring Industries |
| Project | MoneyMsg — Milestone 10: CI, Worker Ops & Repo Hygiene |
| Author | Christopher Rowden |

## Changelog

### v1.0.0 — 2026.04.17

- Initial extraction from implementation plan

---

# Milestone 10 — CI, Worker Ops & Repo Hygiene

---

## 10.1 Real CI Gates

**Priority:** P0
**Depends on:** Test files landing incrementally

### Tasks

- [ ] Add real lint config
  - **Type:** Add
  - **Files:** `package.json`, ESLint config files, Prettier config if used
  - **Notes:** Currently no real linting exists.

- [ ] Add test runner and scripts
  - **Type:** Add
  - **Files:** `package.json`, test config files
  - **Notes:** Currently no tests beyond build/smoke.

- [ ] Expand CI workflow beyond build/smoke
  - **Type:** Fix
  - **Files:** `.github/workflows/ci.yml`
  - **Notes:** Current CI is basically "compiles and boots." Add: lint, unit tests, integration tests, migration validation.

- [ ] Add migration validation in CI
  - **Type:** Add
  - **Files:** workflow + scripts

- [ ] Add financial invariant tests in CI
  - **Notes:** Balance drift tests, double-spend tests, duplicate protection.

### Tests

- [ ] CI itself validates everything below passes before merge.

---

## 10.2 Worker Lifecycle & Ops

**Priority:** P2
**Depends on:** Workers existing

### Tasks

- [ ] Add graceful shutdown handling to workers
  - **Type:** Fix
  - **Files:** `src/workers/intentSweeper.ts`, `src/workers/requestSweeper.ts`, future workers
  - **Notes:** Currently simple `setInterval()` scripts with no graceful shutdown.

- [ ] Add heartbeat/health reporting for workers
  - **Type:** Add
  - **Files:** workers + ops/health support

- [ ] Define singleton/leader strategy or deployment assumption docs
  - **Type:** Ops
  - **Files:** docs/config
  - **Notes:** No visible leader election strategy or duplicate-run coordination beyond skip-locked queries.

### Tests

- [ ] `tests/workers.shutdown-health.test.ts`

---

## 10.3 Repo / Documentation Hygiene

**Priority:** P2
**Depends on:** None

### Tasks

- [ ] Rationalize duplicated docs in repo
  - **Type:** Refactor/Ops
  - **Files:** `Documents_unpacked/Documents/*`, top-level doc copies
  - **Notes:** Duplicated documentation under multiple paths causes bloat, source-of-truth drift, and noisy developer experience.

- [ ] Define source-of-truth doc locations
  - **Type:** Ops
  - **Files:** repo docs structure, README/docs index

- [ ] Add embedded version/governance for major docs/configs
  - **Type:** Ops
  - **Files:** docs/config targets
  - **Notes:** Repo code/config files do not follow a clear embedded version/changelog discipline yet.

### Tests

- None; review gate.
