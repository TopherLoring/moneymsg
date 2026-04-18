# MoneyMsg TODO

## Version Tracking

| Field | Value |
|---|---|
| Version | v1.1.0 |
| Updated | 2026.04.18 |
| Status | In Progress |
| Parent | TopherLoring Industries |
| Project | MoneyMsg |
| Author | Christopher Rowden |

## Changelog

### v1.1.0 — 2026.04.18

- Updated root task pointers to the canonical backlog set
- Added direct reference to `docs/tasks/00_MASTER_BACKLOG.md`
- Clarified the difference between the task navigator and the execution backlog

### v1.0.0 — 2026.04.17

- Initial release
- Added root task pointer for fast repo navigation
- Linked the canonical task register under `docs/tasks/`

## Purpose

This root file exists for fast discovery only.

It is **not** a standalone backlog.

## Canonical Task Entry Points

- `docs/tasks/TODO.md` — canonical task navigator
- `docs/tasks/00_MASTER_BACKLOG.md` — canonical execution backlog index

## Backlog Structure

- `docs/tasks/01_M0_SECURITY_BLOCKERS.md` through `docs/tasks/14_M13_SPEC_REWRITE.md` contain the milestone task files
- repo-governance and navigation cleanup stays tracked in `docs/tasks/TODO.md`
- product and implementation execution stays tracked in the milestone backlog files

## Current Focus

- backlog alignment and canonicalization
- repo hygiene cleanup
- documentation canonicalization
- source-structure refactor for better AI-agent navigation
- archive isolation for obsolete and redundant materials

## Rule

Do not maintain a separate competing task list here.

Update `docs/tasks/TODO.md` for navigation/governance changes.

Update `docs/tasks/00_MASTER_BACKLOG.md` and the milestone backlog files for execution changes.