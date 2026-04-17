# MoneyMsg News and Release Notes

## Version Tracking

| Field | Value |
|---|---|
| Version | v1.0.0 |
| Updated | 2026.04.17 |
| Status | Review |
| Parent | TopherLoring Industries |
| Project | MoneyMsg |
| Author | Christopher Rowden |

## Changelog

### v1.0.0 — 2026.04.17

- Initial release
- Added canonical news and release-notes register for MoneyMsg
- Defined how repo changes, product announcements, and internal release notes should be recorded

## Purpose

This file tracks meaningful repository and product-facing release updates for MoneyMsg. It is the canonical place for release notes, standards-pass updates, and future launch communications inside the repo.

## Release Log

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

Use this file for release history and project/news communication. Use `CHANGELOG.md` for file and repo change history. Use `docs/tasks/TODO.md` for open execution work.