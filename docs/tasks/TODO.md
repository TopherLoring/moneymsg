# MoneyMsg Task Register

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
- Added canonical task register for repository cleanup, standards enforcement, and document migration
- Established the first structured repo-execution backlog for MoneyMsg

## Purpose

This is the canonical repo task list for MoneyMsg documentation governance and repository cleanup work.

## Active Tasks

### P0 — Repo Hygiene

- [ ] remove tracked `node_modules/`
- [ ] remove tracked `dist/`
- [ ] remove any copied `.git/` directories inside imported folders
- [ ] delete temporary unpacked exports that should not live in source control

### P0 — Documentation Canonicalization

- [ ] move active business docs under `docs/business/`
- [ ] move superseded or duplicate docs under `docs/archive/`
- [ ] keep one canonical version of each blueprint, requirements guide, and partner package
- [ ] standardize version tracking across governed Markdown files

### P1 — Source Structure Refactor

- [ ] move `src/server.ts` to `src/app/server.ts`
- [ ] move `src/lib/*` into `src/config/`, `src/domain/`, or `src/shared/` based on ownership
- [ ] move `src/db/*` into `src/infrastructure/db/`
- [ ] move provider services into `src/integrations/<provider>/`
- [ ] move `src/workers/*` into `src/jobs/`
- [ ] regroup routes by feature ownership

### P1 — Documentation and Navigation

- [ ] update `README.md` after structural cleanup
- [ ] link all canonical business documents from `docs/business/BUSINESS-DOCUMENTS.md`
- [ ] record structural milestones in `docs/releases/NEWS.md`
- [ ] keep `CHANGELOG.md` current with every governed documentation change

### P2 — Agent Enablement

- [ ] add a stable directory map to repo root docs
- [ ] document module ownership boundaries for AI execution
- [ ] define conventions for route-to-domain-to-provider traceability
- [ ] add script and test directory standards if missing

## Execution Rule

When a task is completed, update this file, the changelog, and the relevant architecture or release document in the same pass.

## Done Criteria

This register is complete when the repo no longer contains tracked generated junk, active documents live in canonical paths, and the source tree reflects business ownership instead of catch-all folder names.