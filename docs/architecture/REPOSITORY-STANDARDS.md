# MoneyMsg Repository Standards

––––––––––––––––––––––––––––––
VERSION TRACKING
––––––––––––––––––––––––––––––
Version:     v1.0.0
Updated:     2026.04.17
Status:      Review
Parent:      TopherLoring Industries
Project:     MoneyMsg
Author:      Christopher Rowden
––––––––––––––––––––––––––––––
CHANGELOG
––––––––––––––––––––––––––––––
v1.0.0 — 2026.04.17

- Initial release
- Defined repository structure standards for MoneyMsg
- Established AI-agent-oriented directory conventions
- Defined obsolete/redundant asset handling rules

## Purpose

This document defines the repository structure that MoneyMsg should follow going forward. The goal is simple: make the codebase easier for humans to maintain and easier for AI agents to navigate without guessing.

## Top-Level Standard

```text
moneymsg/
├── .github/                  # CI, issue templates, workflow automation
├── docs/
│   ├── architecture/         # repo standards, system architecture, integration maps
│   ├── business/             # business plans, product blueprints, partner docs, requirements
│   ├── releases/             # news, release notes, product announcements
│   ├── tasks/                # active todo lists, execution plans, migration checklists
│   └── archive/              # obsolete, redundant, superseded, unpacked, generated docs metadata
├── src/
│   ├── app/                  # app/server bootstrap and composition root
│   ├── config/               # env parsing, constants, feature flags
│   ├── domain/               # core business rules and entities
│   ├── modules/              # feature-oriented modules grouped by business capability
│   ├── integrations/         # external providers (banking, KYC, cards, webhooks)
│   ├── infrastructure/       # db, queues, storage, logging, metrics
│   ├── jobs/                 # workers, background jobs, scheduled processors
│   ├── shared/               # cross-cutting helpers, schemas, errors, utils
│   └── types/                # shared TypeScript types that do not belong to a single module
├── tests/                    # unit, integration, contract, and e2e tests
├── scripts/                  # devops, migration, maintenance, seed, audit scripts
├── drizzle/                  # schema migrations only
├── package.json
├── tsconfig.json
├── README.md
├── CHANGELOG.md
└── TODO.md
```

## Immediate Mapping From Observed Current Structure

Observed current structure includes a flatter backend-oriented layout with directories such as:

- `src/routes`
- `src/lib`
- `src/db`
- `src/services`
- `src/workers`
- `drizzle`
- `dist`
- `node_modules`
- `Documents_unpacked`

That structure is workable, but it is not ideal for AI execution because ownership boundaries are blurry.

### Recommended remap

- `src/server.ts` → `src/app/server.ts`
- `src/routes/*` → `src/modules/<feature>/http/` or `src/app/http/` depending on ownership
- `src/lib/env.ts` → `src/config/env.ts`
- `src/lib/constants.ts` → `src/config/constants.ts`
- `src/lib/auth.ts` → `src/shared/auth/` or `src/modules/auth/` depending on scope
- `src/lib/fees.ts` → `src/domain/fees/` because fee logic is business logic
- `src/lib/risk.ts` and `src/lib/riskScorer.ts` → `src/domain/risk/`
- `src/lib/errors.ts` → `src/shared/errors/`
- `src/lib/schemas.ts` → `src/shared/schemas/`
- `src/db/*` → `src/infrastructure/db/`
- `src/services/alviere.ts`, `src/services/plaid.ts`, `src/services/dwolla.ts`, `src/services/tabapay.ts`, `src/services/alviere-kyc.ts` → `src/integrations/<provider>/`
- `src/workers/*` → `src/jobs/`

## AI-Agent Navigation Rules

1. Business logic belongs under `src/domain/` or a feature module, not hidden in generic `lib/` folders.
2. External providers must live under `src/integrations/` with one folder per provider.
3. HTTP routes should be grouped by feature so an agent can trace route → handler → domain service → provider integration without hunting.
4. Shared utilities stay in `src/shared/` only if they are truly cross-cutting.
5. Generated output never belongs in source control unless there is a hard operational reason.
6. Every non-trivial doc must live under `docs/` and include version tracking.
7. Archive material must never sit beside active source or active docs.

## Archive and Obsolete Asset Rules

The following categories should be treated as obsolete, redundant, or non-canonical when tracked in the application repo:

- `node_modules/`
- `dist/`
- unpacked duplicate document exports
- copied `.git/` directories from imported folders
- one-off scratch notes that duplicate formal docs
- superseded partner guides left at the repo root

### Required destination

Use `docs/archive/` for archived documentation metadata and move non-document technical residue completely out of the repository history in a dedicated cleanup pass.

## Required Next Physical Cleanup Pass

- Remove tracked generated artifacts
- Remove tracked dependency directories
- Collapse duplicate docs into canonical versions under `docs/business/`
- Move root-level stray documents into `docs/`
- Convert current flat folders into the recommended module layout
- Add tests and scripts top-level directories if missing
- Update README after moves are complete

## Definition of Done

This standards pass is complete when:

- active docs are under `docs/`
- obsolete material is isolated under `docs/archive/` or removed entirely
- source folders reflect business ownership instead of generic catch-all buckets
- version tracking exists in every governed document
- AI agents can find architecture, tasks, releases, and business docs in predictable places without relying on tribal knowledge