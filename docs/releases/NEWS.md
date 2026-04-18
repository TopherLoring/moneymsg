# MoneyMsg News and Release Notes

## Version Tracking

| Field | Value |
|---|---|
| Version | v1.2.0 |
| Updated | 2026.04.18 |
| Status | In Progress |
| Parent | TopherLoring Industries |
| Project | MoneyMsg |
| Author | Christopher Rowden |

## Changelog

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

### 2026.04.18 — Repository README and Unofficial Palette Pass

**Type:** Internal repository documentation update  
**Status:** In Progress

#### Summary

Added the repository README as the primary repo entry point and set the current unofficial repository-facing palette to black, white, and `#00FF88`.

#### Included in this pass

- Added `README.md`
- Documented the current MoneyMsg product model across keyboard, companion app, and backend surfaces
- Added honest runtime and setup guidance for the current backend package under `App Development/`
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

Use this file for release history and project/news communication. Use `CHANGELOG.md` for file and repo change history. Use `docs/tasks/TODO.md` for navigation/governance work. Use `docs/tasks/00_MASTER_BACKLOG.md` and the milestone backlog files for execution work.