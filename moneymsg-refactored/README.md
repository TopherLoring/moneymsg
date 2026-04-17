# MoneyMsg Backend

## Version Tracking

| Field | Value |
|---|---|
| Version | v1.1.0 |
| Updated | 2026.04.17 |
| Status | Review |
| Parent | TopherLoring Industries |
| Project | MoneyMsg |
| Author | Christopher Rowden |

## Changelog


### v1.1.0 — 2026.04.17

- Moved the application out of the `App Development/` wrapper and into the repository root
- Reorganized source files into `app`, `config`, `domain`, `shared`, `infrastructure`, `integrations`, `jobs`, and `modules`
- Moved imported business documents into canonical `docs/business/imported/` and archive locations
- Updated runtime and workflow paths to match the refactored structure

## Purpose

This repository contains the MoneyMsg Fastify and TypeScript backend plus the governed documentation needed to operate and refactor it cleanly.

## Repository Layout

```text
moneymsg/
├── .github/workflows/
├── docs/
│   ├── architecture/
│   ├── archive/
│   ├── business/
│   ├── releases/
│   └── tasks/
├── drizzle/
├── src/
│   ├── app/
│   ├── config/
│   ├── domain/
│   ├── infrastructure/
│   ├── integrations/
│   ├── jobs/
│   ├── modules/
│   └── shared/
├── .env.example
├── Dockerfile
├── package.json
├── tsconfig.json
├── CHANGELOG.md
└── TODO.md
```

## Running Locally

1. Copy `.env.example` to `.env`
2. Install dependencies with `npm install`
3. Build with `npm run build`
4. Start the API with `npm run dev`
5. Start the intent sweeper in a second terminal with `npm run dev:sweeper`
6. Start the request sweeper in a third terminal with `npm run dev:request-sweeper`

## Auth

- API routes use `X-API-Key: <value from API_KEY>` when `API_KEY` is set
- Webhooks remain unauthenticated at the route level and rely on signature validation and optional shared-secret checks
- Timestamp tolerance is controlled by `WEBHOOK_MAX_SKEW_SECONDS`

## Environment Variables

See `.env.example` for the complete runtime list. Important groups include:

- database: `DATABASE_URL`
- Alviere: `ALVIERE_API_KEY`, `ALVIERE_API_URL`
- Plaid: `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV_URL`
- TabaPay: `TABAPAY_API_KEY`, `TABAPAY_API_URL`, `TABAPAY_WEBHOOK_SECRET`
- Dwolla: `DWOLLA_APP_KEY`, `DWOLLA_APP_SECRET`, `DWOLLA_ENV_URL`, `DWOLLA_WEBHOOK_SECRET`
- internal auth and webhook hardening: `API_KEY`, `WEBHOOK_SHARED_SECRET`, `WEBHOOK_MAX_SKEW_SECONDS`
- runtime: `PORT`

## Migrations

Current migrations live under `drizzle/` and should be applied in numeric order.

## Notes

- The source tree now follows the repository standards documented in `docs/architecture/REPOSITORY-STANDARDS.md`
- The direct move map is documented in `docs/architecture/REFACTOR-MAP.md`
- Canonical task tracking lives in `docs/tasks/TODO.md`
