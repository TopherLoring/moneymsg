# CHANGELOG

## Version Tracking

| Field | Value |
|---|---|
| Version | v1.2.1 |
| Updated | 2026.04.18 |
| Status | In Progress |
| Parent | TopherLoring Industries |
| Project | MoneyMsg |
| Author | Christopher Rowden |

## Changelog

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