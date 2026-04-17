# MoneyMsg Archive Policy and Registry

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
- Added archive policy for obsolete, redundant, unpacked, and superseded repository material
- Registered the first cleanup targets observed during the standards pass

## Purpose

This directory is the obvious holding zone for obsolete or superseded documentation. It exists so dead weight stops polluting the live repo structure.

## Initial Cleanup Targets

- `node_modules/` — dependency directory, should be deleted from source control
- `dist/` — generated build output, should be deleted from source control
- `Documents_unpacked/` — unpacked duplicate documentation payloads, should be archived or removed
- copied `.git/` directories inside imported folders — junk, should be deleted
- duplicate blueprint, partner, or integration documents outside canonical `docs/` paths

## Archive Rules

### Delete Instead of Archive

Delete these outright:

- dependency directories
- generated build artifacts
- cache folders
- temporary exports
- local environment residue

### Archive Under `docs/archive/`

Archive these when historically useful:

- superseded business plans
- obsolete partner requirements
- old news releases
- redundant unpacked documentation bundles
- replaced execution plans and historical guidance files

## Naming Standard

Archived files should use explicit names that include date and status, for example:

- `2026-04-17-moneymsg-blueprint-superseded.md`
- `2026-04-17-partner-package-obsolete.md`
- `2026-04-17-unpacked-documents-index.md`

## Required Follow-Up Actions

- delete tracked generated directories
- move duplicate docs into `docs/business/` or `docs/archive/`
- keep only one active canonical version per major document subject
- update `CHANGELOG.md`, `docs/releases/NEWS.md`, and `docs/tasks/TODO.md` whenever archive status changes

## Non-Negotiable Rule

If a file is not part of active product code, active documentation, or an intentional retained record, it should not be sitting at the repo root pretending to matter.