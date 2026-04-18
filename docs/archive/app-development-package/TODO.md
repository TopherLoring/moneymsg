# MoneyMsg Backend Backlog Migration Note

## Version Tracking

| Field | Value |
|---|---|
| Version | v2.0.0 |
| Updated | 2026.04.18 |
| Status | Archived |
| Parent | TopherLoring Industries |
| Project | MoneyMsg |
| Author | Christopher Rowden |

## Changelog

### v2.0.0 — 2026.04.18

- Archived this file as a superseded backend-local backlog
- Moved live planning and progress authority into root `TODO.md`
- Preserved this path only as a migration marker for historical progress import

### v1.2.0 — 2026.04.17

- Phase A (M0) complete — all security blockers implemented
- 0.1 Auth: JWT model, roles, ownership checks on all routes
- 0.2 Env: full Zod validation, explicit DB SSL, .env.example rewrite
- 0.3 Rate limiting: global + route-level + abuse throttling
- 0.4 Logging: pino redaction, correlation IDs, x-request-id
- 1.3 HMAC buffer crash fix applied
- CI updated with new env vars

### v1.1.0 — 2026.04.17

- Hardened financial integrity requirements
- Added Idempotency Key support for API execution
- Integrated Immutable Audit Trail requirements
- Added Risk Engine "Shadow Mode" for tuning
- Added IME fail-safe/bypass requirements
- Added Webhook idempotency and dependency auditing to CI

### v1.0.0 — 2026.04.16

- Initial repo TODO backlog added

## Status

This file is no longer an active execution authority.

## Canonical Authority

Use root `TODO.md` for:

- canonical execution planning
- canonical task status
- canonical dependency order
- canonical acceptance criteria
- canonical progress evidence

## Why This File Still Exists

This path is retained only because it previously carried live backend status, and that progress was imported into the canonical root `TODO.md` during the 2026.04.18 canonicalization pass.

## Rule

Do not update task status here.

If backend implementation detail needs expansion, use the canonical root `TODO.md` and the supporting task-pack documents under `docs/tasks/`.
