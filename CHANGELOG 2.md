# CHANGELOG

## Version Tracking

| Field | Value |
|---|---|
| Version | v1.4.0 |
| Updated | 2026.04.18 |
| Status | In Progress |
| Parent | TopherLoring Industries |
| Project | MoneyMsg |
| Author | Christopher Rowden |

## Changelog

### v1.4.0 — 2026.04.18

- Recorded the MX repository and CI preflight completion pass
- Logged the Bun-first lockfile migration, Bun test harness, Bun lint/typecheck scripts, and CI workflow creation
- Logged the canonical TODO upgrade to checkbox-based task rows and completed MX task evidence

### v1.3.0 — 2026.04.18

- Recorded the canonical TODO unification pass
- Logged the collapse of live task authority into root `TODO.md`
- Logged demotion of `docs/tasks/*` authority to support/reference status
- Logged archival of `App Development/TODO.md` as a superseded backend-local backlog
- Logged removal of the duplicate `docs/backlog/00_MASTER_BACKLOG.md` file

### v1.2.1 — 2026.04.18

- Corrected the unofficial repository-facing accent color from `#00F8F8` to `#00FF88`
- Kept the repo changelog aligned with the current README palette

### v1.2.0 — 2026.04.18

- Recorded repository README creation and follow-up palette update
- Logged the new repo entry point, setup guidance, canonical documentation map, and unofficial brand palette note
- Kept repo-level change history aligned with the current README

### v1.1.0 — 2026.04.18

- Recorded canonical backlog import under `docs/tasks/`
- Recorded root and task-register TODO updates aligning pointers to the canonical backlog set
- Marked backlog governance as active in repo-level documentation

### v1.0.0 — 2026.04.17

- Initial release
- Added repository-level changelog for MoneyMsg
- Established a versioned documentation anchor for repo governance, releases, tasks, business documents, and archive management
- Recorded the first standards-focused refactor pass for AI-agent-friendly repository organization

## 2026.04.18 — MX Repository and CI Preflight Pass

### Added
- `.github/workflows/ci.yml`
- `App Development/bun.lock`
- `App Development/tsconfig.typecheck.json`
- `App Development/scripts/lint.ts`
- `App Development/scripts/smoke.ts`
- `App Development/tests/mx-preflight.test.ts`

### Updated
- `TODO.md`
- `.gitignore`
- `CHANGELOG.md`
- `docs/releases/NEWS.md`
- `App Development/package.json`

### Defined
- Bun as the preferred package manager for the backend package
- Bun-first CI execution for install, lint, typecheck, test, build, migration validation, and smoke
- Checkbox-based task-state visibility in the canonical root TODO

### Notes
- `bun.lock` was generated locally by migrating the existing `package-lock.json` state with Bun 1.3.12.
- Local verification completed for `bun run lint` and `bun test`; remote CI will validate install, typecheck, build, migration, and smoke execution on GitHub Actions.

## 2026.04.18 — MX Preflight Completion Pass

### Updated
- `TODO.md`
- `.gitignore`
- `App Development/package.json`
- `App Development/tsconfig.typecheck.json`
- `App Development/drizzle.config.ts`
- `App Development/scripts/smoke.ts`
- `App Development/src/server.ts`
- `App Development/tests/mx-preflight.test.ts`
- `App Development/.github/workflows/ci.yml`

### Added
- `App Development/tests/bun-test.d.ts`

### Removed
- `App Development/package-lock.json`

### Defined
- Bun as the preferred package manager and CI runtime for the backend package
- Bun-first local and CI gates for lint, typecheck, tests, build, migration validation, and smoke

### Notes
- A clean `bun install --frozen-lockfile` succeeded after deleting the local `node_modules/` directory.
- Local `bun run ci` completed successfully end to end.

## 2026.04.18 — Canonical TODO Unification Pass

### Updated
- `TODO.md`
- `README.md`
- `CHANGELOG.md`
- `docs/releases/NEWS.md`
- `docs/tasks/TODO.md`
- `docs/tasks/00_MASTER_BACKLOG.md`
- `App Development/TODO.md`

### Removed
- `docs/backlog/00_MASTER_BACKLOG.md`

### Defined
- root `TODO.md` as the only canonical plan and progress tracker
- `docs/tasks/TODO.md` as a support index only
- `docs/tasks/00_MASTER_BACKLOG.md` as a reference overview only
- `App Development/TODO.md` as an archived migration marker instead of a live backend backlog

### Notes
- Task authority previously existed in too many places and was starting to drift.
- This pass collapses live status, dependency order, acceptance criteria, and progress evidence into one governed document.
- Milestone packs under `docs/tasks/` still exist, but they are support detail only.

## 2026.04.18 — Repository README Creation and Palette Pass

### Added
- `README.md`

### Updated
- `README.md`

### Defined
- repository entry-point narrative for MoneyMsg
- current runtime and local setup guidance
- canonical documentation and backlog entry points
- product model summary for keyboard, companion app, and backend surfaces
- unofficial repository-facing palette: black, white, and `#00FF88`

### Notes
- The README is intentionally repo-facing, not marketing-facing.
- Setup guidance reflects the current backend package location under `App Development/` and the current Bun/Node runtime reality.
- The current color system is explicitly marked unofficial until a formal brand system is locked.

## 2026.04.18 — Canonical Backlog Import Pass

### Added
- `docs/tasks/00_MASTER_BACKLOG.md`
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

### Updated
- `docs/tasks/TODO.md`
- `TODO.md`

### Defined
- `docs/tasks/00_MASTER_BACKLOG.md` as the canonical execution backlog index
- `docs/tasks/TODO.md` as the canonical task navigator for governance and discovery
- root `TODO.md` as a discovery-only entry point with no competing backlog content

### Notes
- The backlog now has a dedicated master index plus milestone-specific task files.
- Repo-governance work and product-implementation work are now separated instead of being mixed into one thin register.
- `docs/tasks/12_M11_ANDROID_IME.md` was imported with minor wording normalization during repository commit so the milestone could be recorded cleanly.

## 2026.04.17 — Repository Standards Refactor Pass

### Added
- `docs/architecture/REPOSITORY-STANDARDS.md`
- `docs/business/BUSINESS-DOCUMENTS.md`
- `docs/releases/NEWS.md`
- `docs/tasks/TODO.md`
- `docs/archive/README.md`

### Defined
- Canonical documentation zones for architecture, business, releases, tasks, and archive material
- Archive policy for obsolete, redundant, generated, unpacked, and superseded assets
- AI-agent navigation guidance based on stable top-level paths and predictable documentation placement

### Flagged for physical relocation
- `node_modules/`
- `dist/`
- `Documents_unpacked/`
- any unpacked duplicate business-doc exports
- any tracked environment residue, generated bundles, or legacy scratch files

### Notes
- This pass establishes standards and destination paths immediately.
- A second pass should physically relocate or delete tracked redundant assets once full file-by-file enumeration is available through the repo connector or a raw repo snapshot.
