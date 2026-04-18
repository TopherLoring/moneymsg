# MoneyMsg Repository Standards

## Version Tracking

| Field | Value |
|---|---|
| Version | v1.3.1 |
| Updated | 2026.04.18 05:56 PM CT |
| Status | Review |
| Parent | TopherLoring Industries |
| Project | MoneyMsg |
| Author | Christopher Rowden |

## Changelog

### v1.3.1 — 2026.04.18 05:56 PM CT

- Updated repository-governance timestamp metadata to current Central Time

### v1.3.0 — 2026.04.18 08:45 AM CT

- Added Definition of Done governance requirements tying documentation completion to changelog logging and canonical task-status updates

### v1.1.0 — 2026.04.18 03:56 AM CT

- Updated repository version-tracking requirements to include both date and time
- Standardized governed-document timestamps to a U.S. 12-hour clock with AM/PM and timezone
- Defined timestamp tie-break behavior for same-version document conflicts

### v1.0.0 — 2026.04.17

- Initial release
- Defined repository structure standards for MoneyMsg
- Established AI-agent-oriented directory conventions
- Defined obsolete/redundant asset handling rules

## Purpose

This document defines the repository structure that MoneyMsg should follow going forward. The goal is simple: make the codebase easier for humans to maintain and easier for AI agents to navigate without guessing.

## Version Tracking Standard

Every governed document in this repository must include a `## Version Tracking` section and a `## Changelog` section.

### Required timestamp format

Use this format for the `Updated` field:

`YYYY.MM.DD hh:mm AM/PM TZ`

Example:

`2026.04.18 03:56 AM CT`

### Changelog heading format

Use this format for changelog release headings:

`### v1.1.0 — YYYY.MM.DD hh:mm AM/PM TZ`

Example:

`### v1.1.0 — 2026.04.18 03:56 AM CT`

### Conflict rule

When governed copies conflict:

1. the highest valid semantic version wins
2. if the version is the same, the newest valid timestamp wins

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

- `src/app/server.ts` → `src/app/server.ts`
- `src/routes/*` → `src/modules/<feature>/http/` or `src/app/http/` depending on ownership
- `src/config/env.ts` → `src/config/env.ts`
- `src/config/constants.ts` → `src/config/constants.ts`
- `src/shared/auth.ts` → `src/shared/auth/` or `src/modules/auth/` depending on scope
- `src/domain/fees/index.ts` → `src/domain/fees/` because fee logic is business logic
- `src/domain/risk/index.ts` and `src/domain/risk/scorer.ts` → `src/domain/risk/`
- `src/shared/errors.ts` → `src/shared/errors/`
- `src/shared/schemas.ts` → `src/shared/schemas/`
- `src/infrastructure/db/*` → `src/infrastructure/db/`
- `src/integrations/alviere/client.ts`, `src/integrations/plaid/client.ts`, `src/integrations/dwolla/client.ts`, `src/integrations/tabapay/client.ts`, `src/integrations/alviere/kyc.ts` → `src/integrations/<provider>/`
- `src/jobs/*` → `src/jobs/`

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
- version tracking exists in every governed document and includes both date and time
- AI agents can find architecture, tasks, releases, and business docs in predictable places without relying on tribal knowledge
- each governed repository update includes a corresponding `CHANGELOG.md` entry and status/evidence updates for the affected canonical task items in `TODO.md`
