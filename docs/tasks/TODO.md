# MoneyMsg Task Register

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

- Reframed this file as the canonical task navigator instead of a standalone backlog
- Linked the full milestone backlog set under `docs/tasks/`
- Added current governance tasks for backlog alignment and cleanup
- Clarified that `00_MASTER_BACKLOG.md` is the execution source of truth

### v1.0.0 — 2026.04.17

- Initial release
- Added canonical task register for repository cleanup, standards enforcement, and document migration
- Established the first structured repo-execution backlog for MoneyMsg

## Purpose

This file is the canonical task navigator for MoneyMsg.

It does **not** replace the full implementation backlog.

Use this file to find the correct task document quickly, track repo-governance work, and keep task ownership centralized.

## Canonical Task Files

### Primary Execution Source

- `docs/tasks/00_MASTER_BACKLOG.md` — master backlog index, dependency chain, beta path, non-negotiables

### Milestone Backlog Files

- `docs/tasks/01_M0_SECURITY_BLOCKERS.md` — auth, env, rate limiting, logging
- `docs/tasks/02_M1_BACKEND_HARDENING.md` — risk engine, validation, reconciliation, provider wrappers
- `docs/tasks/03_M2_DATA_MODEL.md` — metadata, idempotency, funding-source lifecycle
- `docs/tasks/04_M3_IME_FOUNDATION.md` — wallet summary, previews, deep links
- `docs/tasks/05_M4_ORCHESTRATION.md` — intent parsing, recipient resolution, orchestration schema
- `docs/tasks/06_M5_PAYMENT_OBJECTS.md` — conversation-native payment artifacts
- `docs/tasks/07_M6_SUPPORT_OPS.md` — support, disputes, admin operations
- `docs/tasks/08_M7_NOTIFICATIONS_RECOVERY.md` — notifications, account recovery, sessions
- `docs/tasks/09_M8_COMPLIANCE_FRAUD.md` — compliance and fraud operations
- `docs/tasks/10_M9_SPLIT_REMINDERS.md` — split flows and reminder engine
- `docs/tasks/11_M10_CI_HYGIENE.md` — CI gates, worker lifecycle, repo hygiene
- `docs/tasks/12_M11_ANDROID_IME.md` — Android IME implementation track
- `docs/tasks/13_M12_COMPANION_APP.md` — companion app expansion
- `docs/tasks/14_M13_SPEC_REWRITE.md` — blueprint/spec rewrite and supporting design docs

## Current Governance Tasks

### P0 — Backlog Alignment

- [x] create canonical milestone backlog set under `docs/tasks/`
- [x] commit master backlog and milestone task files into the repository
- [x] convert this file into a navigator instead of a competing partial backlog
- [ ] align `CHANGELOG.md` and `docs/releases/NEWS.md` with the new canonical task structure
- [ ] archive or supersede legacy backlog files that are no longer the source of truth

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
- [ ] link legacy task entry points to `docs/tasks/00_MASTER_BACKLOG.md`

### P2 — Agent Enablement

- [ ] add a stable directory map to repo root docs
- [ ] document module ownership boundaries for AI execution
- [ ] define conventions for route-to-domain-to-provider traceability
- [ ] add script and test directory standards if missing

## Execution Rule

When a task is completed, update the relevant milestone file, this navigator when needed, and the associated changelog or release document in the same pass.

## Done Criteria

This navigator is healthy when:

- task discovery is unambiguous
- the master backlog and milestone files remain the only active execution source of truth
- legacy or duplicate backlog files are clearly archived or marked superseded
- repo-governance tasks stay separate from product implementation tasks
