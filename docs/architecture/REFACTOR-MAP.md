# MoneyMsg Repository Refactor Map

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
- Added a physical migration map for the MoneyMsg repository refactor
- Defined current-to-target path mapping for source folders, documents, and obsolete assets

## Purpose

This document is the direct move map for the MoneyMsg repo refactor. It translates the currently observed structure into the target structure required for better developer ownership and AI-agent navigation.

## Observed Current Structure

The currently observed repo mirror includes these active and noisy areas:

- `src/server.ts`
- `src/routes/`
- `src/lib/`
- `src/db/`
- `src/services/`
- `src/workers/`
- `drizzle/`
- `Documents_unpacked/`
- `dist/`
- `node_modules/`

## Target Structure

```text
src/
├── app/
├── config/
├── domain/
├── modules/
├── integrations/
├── infrastructure/
├── jobs/
├── shared/
└── types/
```

## File and Folder Migration Map

### App Bootstrap

- `src/server.ts` → `src/app/server.ts`

### Config

- `src/lib/env.ts` → `src/config/env.ts`
- `src/lib/constants.ts` → `src/config/constants.ts`

### Domain

- `src/lib/fees.ts` → `src/domain/fees/fees.ts`
- `src/lib/risk.ts` → `src/domain/risk/risk.ts`
- `src/lib/riskScorer.ts` → `src/domain/risk/risk-scorer.ts`

### Shared

- `src/lib/errors.ts` → `src/shared/errors/errors.ts`
- `src/lib/schemas.ts` → `src/shared/schemas/index.ts`
- `src/lib/auth.ts` → `src/shared/auth/index.ts` unless it becomes a dedicated auth module

### Infrastructure

- `src/db/index.ts` → `src/infrastructure/db/index.ts`
- `src/db/schema.ts` → `src/infrastructure/db/schema.ts`
- `src/db/requests.ts` → `src/infrastructure/db/requests.ts`

### Integrations

- `src/services/alviere.ts` → `src/integrations/alviere/client.ts`
- `src/services/alviere-kyc.ts` → `src/integrations/alviere/kyc.ts`
- `src/services/plaid.ts` → `src/integrations/plaid/client.ts`
- `src/services/dwolla.ts` → `src/integrations/dwolla/client.ts`
- `src/services/tabapay.ts` → `src/integrations/tabapay/client.ts`

### Jobs

- `src/workers/*` → `src/jobs/*`

### Routes and Modules

Current route files observed:

- `src/routes/request.ts`
- `src/routes/transfer.ts`
- `src/routes/wallet.ts`
- `src/routes/status.ts`
- `src/routes/webhooks.ts`
- `src/routes/plaid.ts`
- `src/routes/kyc.ts`

Recommended regrouping:

- `src/routes/request.ts` → `src/modules/requests/http/routes.ts`
- `src/routes/transfer.ts` → `src/modules/transfers/http/routes.ts`
- `src/routes/wallet.ts` → `src/modules/wallet/http/routes.ts`
- `src/routes/status.ts` → `src/modules/status/http/routes.ts`
- `src/routes/webhooks.ts` → `src/modules/webhooks/http/routes.ts`
- `src/routes/plaid.ts` → `src/modules/plaid/http/routes.ts`
- `src/routes/kyc.ts` → `src/modules/kyc/http/routes.ts`

## Document Migration Map

### Canonical Active Documentation

- root-level business or blueprint docs → `docs/business/`
- release or announcement docs → `docs/releases/`
- task lists and migration checklists → `docs/tasks/`
- architecture and repo standards → `docs/architecture/`

### Archive Targets

- unpacked duplicate documentation bundles → `docs/archive/`
- obsolete requirements or superseded guides → `docs/archive/`
- generated or transient folders → delete, do not archive

## Delete Targets

Delete from source control rather than relocating:

- `node_modules/`
- `dist/`
- imported `.git/` directories inside mirrored directories
- caches, temp exports, and local-only residue

## Refactor Execution Order

1. Remove tracked garbage directories.
2. Move docs into canonical `docs/` locations.
3. Create target source folders.
4. Move shared config, domain, infrastructure, and integration files.
5. Re-group routes into feature modules.
6. Fix imports.
7. Run validation and update root documentation.

## Done Criteria

This migration is complete when the repo no longer mixes generated junk, business documentation, and live source in the same areas, and the source tree exposes clear business ownership boundaries.