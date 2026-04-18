# MoneyMsg News and Release Notes

## Version Tracking

| Field | Value |
|---|---|
| Version | v1.5.3 |
| Updated | 2026.04.18 08:45 AM CT |
| Status | In Progress |
| Parent | TopherLoring Industries |
| Project | MoneyMsg |
| Author | Christopher Rowden |

## Changelog

### v1.5.3 — 2026.04.18 08:45 AM CT

- Added release entry for the repository requirements Definition of Done governance update
- Added explicit release tracking for changelog-and-task-status completion expectations

### v1.5.2 — 2026.04.18 08:20 AM CT

- Added release entry for the tracker reconciliation and release-doc synchronization pass
- Aligned canonical task and support-tracker documentation metadata with the current repository state

### v1.5.1 — 2026.04.18 04:56 AM CT

- Added release entry for the task-document path normalization pass
- Aligned repository task documentation with the standardized root runtime layout

### v1.5.0 — 2026.04.18 03:56 AM CT

- Added release entry for the repository standardization pass
- Updated release docs to reflect the new root runtime layout and standardized source-tree structure


### v1.4.0 — 2026.04.18 03:56 AM CT

- Added release entry for the version-tracking timestamp standard update
- Added the missing MX repository and CI preflight release entry
- Synced release documentation to the repository-wide U.S. AM/PM timestamp format

### v1.3.0 — 2026.04.18

- Added release entry for the canonical TODO unification pass
- Realigned release documentation around root `TODO.md` as the single live execution authority
- Recorded demotion of `docs/tasks/*` authority to supporting documentation

### v1.2.0 — 2026.04.18

- Added release entry for the repository README and unofficial palette pass
- Aligned release documentation with the current README and unofficial color reference

### v1.1.0 — 2026.04.18

- Added release entry for the canonical backlog import pass
- Recorded the move from a thin task register to a full milestone backlog set
- Aligned release documentation with the new task-navigation structure

### v1.0.0 — 2026.04.17

- Initial release
- Added canonical news and release-notes register for MoneyMsg
- Defined how repo changes, product announcements, and internal release notes should be recorded

## Purpose

This file tracks meaningful repository and product-facing release updates for MoneyMsg. It is the canonical place for release notes, standards-pass updates, and future launch communications inside the repo.

## Release Log

### 2026.04.18 08:45 AM CT — Repo Requirements DoD Governance Pass

**Type:** Internal repository governance requirements update
**Status:** In Progress

#### Summary

Updated repository Definition of Done requirements so governed updates are not considered complete unless they include both changelog logging and corresponding canonical task-status updates.

#### Included in this pass

- Updated `docs/architecture/REPOSITORY-STANDARDS.md` Definition of Done criteria
- Updated root `TODO.md` Definition of Done and docs-task evidence text
- Updated `CHANGELOG.md` and this file to record the governance requirement update

#### Notes

- This is a process-governance improvement for traceability and task-state hygiene.

#### Follow-up still required

- Apply this requirement consistently to all future governed repository changes
- Keep canonical task evidence and release logs in sync per pass

### 2026.04.18 08:20 AM CT — Tracker Reconciliation and Release-Doc Sync Pass

**Type:** Internal repository documentation governance update
**Status:** In Progress

#### Summary

Reviewed the current repository state and synchronized root and support tracking documents so live task counts, tracker notes, and release records remain accurate.

#### Included in this pass

- Updated root `TODO.md` snapshot and stale task-note details
- Updated `docs/tasks/TODO.md` and `docs/tasks/00_MASTER_BACKLOG.md` metadata and changelogs
- Updated `CHANGELOG.md` and this file to record the tracker reconciliation pass

#### Notes

- This is a documentation governance update only; no runtime functionality changed.

#### Follow-up still required

- Continue delivering planned P1/P2 backlog items from root `TODO.md`
- Keep `docs/tasks/` support packs synchronized whenever canonical status changes

### 2026.04.18 04:56 AM CT — Task Document Path Normalization Pass

**Type:** Internal repository documentation alignment update  
**Status:** In Progress

#### Summary

Normalized the canonical TODO and milestone support packs so active task documentation points at the standardized root runtime and source-tree layout.

#### Included in this pass

- Updated `TODO.md` to replace stale legacy route, service, lib, and archive references
- Updated active support packs under `docs/tasks/` to use standardized module/shared/archive paths
- Updated `CHANGELOG.md` and this file to record the cleanup pass

#### Notes

- Historical release entries may still mention older paths when they describe pre-standardization repo states.
- Active task planning docs now align with the standardized repository structure.

#### Follow-up still required

- Keep new task additions aligned with the standardized module layout
- Continue implementation work from the next open P0 items in root `TODO.md`

### 2026.04.18 03:56 AM CT — Repository Standardization Pass

**Type:** Internal repository structure update  
**Status:** In Progress

#### Summary

Standardized the repository before further feature expansion by flattening the backend package to the repo root and remapping the source tree to the defined standard layout.

#### Included in this pass

- Moved the Bun runtime package, config, scripts, tests, workflow, and migration files from `/` to the repository root
- Remapped runtime source code into `src/app`, `src/config`, `src/domain`, `src/integrations`, `src/infrastructure`, `src/jobs`, `src/modules`, and `src/shared`
- Archived legacy package-local docs and unpacked duplicate documents under `docs/archive/`
- Updated root tracking docs and developer entry points to the new layout

#### Notes

- This pass standardizes structure only and is intended to reduce drift before more implementation work lands.
- Hidden files still need to be pushed separately when the refactored tree is uploaded to the live repository.

#### Follow-up still required

- Upload the standardized tree to the repository
- Push hidden-file changes that the upload flow may miss
- Audit the live repository after upload


### 2026.04.18 03:56 AM CT — Version Tracking Timestamp Standard Pass

**Type:** Internal repository standards update  
**Status:** In Progress

#### Summary

Updated the repository version-tracking requirements so governed documents must include both date and time using a U.S. 12-hour clock with AM/PM and timezone.

#### Included in this pass

- Updated `docs/architecture/REPOSITORY-STANDARDS.md`
- Updated `docs/business/BUSINESS-DOCUMENTS.md`
- Updated `CHANGELOG.md`
- Updated this file to reflect the new timestamp rule

#### Notes

- The standard timestamp format is `YYYY.MM.DD hh:mm AM/PM TZ`.
- Existing historical entries may remain date-only until they are actively revised.

#### Follow-up still required

- Apply the timestamp format to future governed-document updates consistently
- Normalize older high-value tracking docs when they are next touched

### 2026.04.18 — MX Repository and CI Preflight Pass

**Type:** Internal repository tooling and CI update  
**Status:** In Progress

#### Summary

Completed the Bun-first MX repository and CI preflight pass for the backend package and canonical task system.

#### Included in this pass

- Added `bun.lock`
- Added `tsconfig.typecheck.json`
- Added `scripts/lint.ts`
- Added `scripts/smoke.ts`
- Added `tests/mx-preflight.test.ts`
- Updated `TODO.md` with checkbox-based task rows and completed MX task evidence
- Updated `.gitignore` and backend package scripts for Bun-first execution
- Updated backend CI workflow to Bun-first preflight enforcement
- Removed `package-lock.json`

#### Notes

- Bun is now the preferred package manager and CI runtime for the backend package.
- The MX lane now enforces install, lint, typecheck, tests, build, migration validation, and smoke.

#### Follow-up still required

- Keep the Bun-first preflight lane green as new work lands
- Continue from the next P0 blocker work already recorded in root `TODO.md`

### 2026.04.18 — Canonical TODO Unification Pass

**Type:** Internal repository backlog and governance update  
**Status:** In Progress

#### Summary

Collapsed live task authority into root `TODO.md` so plan, dependency order, status, acceptance criteria, and progress evidence now live in one governed file.

#### Included in this pass

- Replaced root `TODO.md` with the canonical plan-and-progress register
- Reframed `docs/tasks/TODO.md` as a support index only
- Reframed `docs/tasks/00_MASTER_BACKLOG.md` as a reference overview only
- Archived `docs/archive/app-development-package/TODO.md` as a superseded backend-local backlog
- Removed duplicate `docs/backlog/00_MASTER_BACKLOG.md`
- Updated `README.md`, `CHANGELOG.md`, and this file to reflect the new authority model

#### Notes

- The repository had too many backlog authorities competing with each other.
- This pass keeps the milestone task-pack files, but strips them of independent status ownership.
- Future progress updates should land in root `TODO.md` first.

#### Follow-up still required

- Keep milestone support packs aligned with the canonical root register
- Continue repo hygiene work that removes or archives redundant documentation payloads
- Close the still-open P0 implementation work already listed in root `TODO.md`

### 2026.04.18 — Repository README and Unofficial Palette Pass

**Type:** Internal repository documentation update  
**Status:** In Progress

#### Summary

Added the repository README as the primary repo entry point and set the current unofficial repository-facing palette to black, white, and `#00FF88`.

#### Included in this pass

- Added `README.md`
- Documented the current MoneyMsg product model across keyboard, companion app, and backend surfaces
- Added honest runtime and setup guidance for the current backend package under `/`
- Linked canonical task, standards, release, and business-document entry points
- Recorded the unofficial repository-facing palette as black, white, and `#00FF88`

#### Notes

- The README is repo-facing and operational, not marketing-facing.
- The unofficial color system is recorded for repository documentation only and remains unofficial until a formal brand system is locked.

#### Follow-up still required

- Align any future branded documentation to the same unofficial palette until replaced
- Continue repo cleanup so the physical source layout catches up with the documented target structure

### 2026.04.18 — Canonical Backlog Import Pass

**Type:** Internal repository backlog and governance update  
**Status:** In Progress

#### Summary

Imported the full MoneyMsg milestone backlog into `docs/tasks/`, separated navigation/governance tasks from execution tasks, and aligned root repo pointers to the canonical backlog structure.

#### Included in this pass

- Added `docs/tasks/00_MASTER_BACKLOG.md`
- Added milestone backlog files from `01_M0_SECURITY_BLOCKERS.md` through `14_M13_SPEC_REWRITE.md`
- Updated `docs/tasks/TODO.md` to act as the canonical task navigator
- Updated root `TODO.md` to point directly to the task navigator and master backlog index
- Established `docs/tasks/00_MASTER_BACKLOG.md` as the execution source of truth for milestone sequencing and dependency order

#### Notes

- The previous task register was too narrow to serve as the sole MoneyMsg backlog.
- Repo-governance work remains tracked separately from product and implementation execution.
- The Android IME milestone file was committed with minor wording normalization during repository import so the milestone could be captured cleanly.

#### Follow-up still required

- Align any remaining legacy backlog references to the canonical task set
- Archive or supersede obsolete backlog files that are no longer authoritative
- Continue repo hygiene and documentation canonicalization work already tracked in `docs/tasks/TODO.md`

### 2026.04.17 — Repository Standards Refactor Pass

**Type:** Internal repository standards update  
**Status:** Review

#### Summary

Established the first documentation governance layer for the MoneyMsg repository so architecture, business documents, release notes, tasks, and archive policy have stable homes.

#### Included in this pass

- Added `CHANGELOG.md`
- Added `docs/architecture/REPOSITORY-STANDARDS.md`
- Added `docs/business/BUSINESS-DOCUMENTS.md`
- Added `docs/releases/NEWS.md`
- Added `docs/tasks/TODO.md`
- Added `docs/archive/README.md`
- Standardized the version tracking section format across newly governed Markdown docs

#### Follow-up still required

- Physically move or delete tracked generated assets
- Collapse duplicate business-document exports
- Refactor source folders for stronger feature ownership and AI navigation
- Update repo root documentation after file relocation is complete

## Release Entry Standard

Each future entry should include:

- date
- title
- type
- status
- summary
- included changes
- follow-up or risk notes when relevant

## Scope Rule

Use this file for release history and project/news communication. Use `CHANGELOG.md` for file and repo change history. Use root `TODO.md` for execution planning and live progress. Use `docs/tasks/*` only for supporting implementation detail.
