# MoneyMsg

<p align="center">
  <img alt="Black" src="https://img.shields.io/badge/BLACK-000000?style=for-the-badge&labelColor=000000&color=000000" />
  <img alt="White" src="https://img.shields.io/badge/WHITE-FFFFFF?style=for-the-badge&labelColor=FFFFFF&color=FFFFFF" />
  <img alt="Accent" src="https://img.shields.io/badge/ACCENT-00FF88?style=for-the-badge&labelColor=00FF88&color=00FF88" />
</p>

Conversation-native payments for Android.

Keyboard-first, not keyboard-only.

## Version Tracking

| Field | Value |
|---|---|
| Version | v1.0.2 |
| Updated | 2026.04.18 |
| Status | In Progress |
| Parent | TopherLoring Industries |
| Project | MoneyMsg |
| Author | Christopher Rowden |

## Changelog

### v1.0.2 — 2026.04.18

- Corrected the unofficial README accent color from `#00F8F8` to `#00FF88`
- Updated the repository-facing palette reference and badge styling

### v1.0.1 — 2026.04.18

- Applied the unofficial MoneyMsg brand palette to the README
- Added black, white, and `#00F8F8` as the active unofficial visual reference colors for repository-facing documentation

### v1.0.0 — 2026.04.18

- Initial repository README created
- Aligned repository entry documentation to the project blueprint, canonical backlog, and repository standards
- Documented current runtime, repo entry points, setup path, and beta-critical priorities

## Unofficial Brand Palette

Current unofficial repository-facing brand colors:

- `#000000`
- `#FFFFFF`
- `#00FF88`

These are the active unofficial visual reference colors for MoneyMsg until a formal brand system is locked.

## What MoneyMsg Is

MoneyMsg is a conversation-native payments platform for Android.

It is not a general-purpose typing keyboard, and it is not just another wallet app.

The product model is split across three surfaces:

- **Android IME** — fast in-conversation payment and request actions
- **Companion app** — trust, setup, wallet management, approvals, history, support, recovery
- **Backend platform** — wallet, requests, transfers, provider integrations, webhook handling, orchestration, and production operations

The target experience is simple:

1. The sender opens the MoneyMsg keyboard inside a conversation.
2. They choose **Send**, **Request**, **Split**, **Add Money**, or **Cash Out**.
3. MoneyMsg resolves the recipient, confirms the amount, and inserts a polished payment artifact into the thread.
4. The recipient taps the artifact, completes the action through a lightweight MoneyMsg handoff, and returns to the conversation with state reflected cleanly.

## Product Rules

- Keyboard-first, not keyboard-only
- No raw visible payment URLs in normal user-facing conversation flows
- AI may suggest and structure, but never silently execute money movement
- Money movement stays deterministic, explicit, and auditable
- The companion app remains the trust and management anchor
- Support, disputes, fraud ops, compliance ops, notifications, and recovery are part of production scope

## Current Repository Status

This repository is **not production-ready yet**.

The current repo direction is:

- keep the existing backend execution core
- harden auth, risk, validation, reconciliation, and logging first
- layer in wallet summary, intent parsing, recipient resolution, and payment artifacts next
- add support, disputes, admin, notifications, compliance, fraud, and recovery before calling the product production-safe

The execution source of truth is the milestone backlog under `docs/tasks/`.

## Fee Model

| Flow | User-visible treatment | Current model |
|---|---|---|
| Wallet load | User specifies target net wallet amount | Gross charge = target net + external movement fee |
| Wallet cash-out | User specifies gross withdrawal amount | Net payout = gross amount - external movement fee |
| Externally funded send | User confirms send amount with external fee treatment | External movement fee applies |
| Internal wallet-to-wallet P2P | No user fee | $0.00 |

Current configured external movement fee model: **1.75% + $0.50**.

Internal wallet-to-wallet transfers are treated as zero-cost internal book movement.

## Provider Stack

- **Alviere** — wallet ledger, KYC/AML coverage, FBO wallet issuance, internal book transfers
- **Plaid** — external account authentication and processor-token generation
- **TabaPay** — card funding and card cash-out
- **Dwolla** — bank funding and bank cash-out via RTP / FedNow rails

## Current Backend Runtime

The current backend package lives under `App Development/`.

Current package/runtime signals:

- Fastify backend
- Drizzle ORM
- PostgreSQL
- Zod env and payload validation
- Pino logging
- `@fastify/rate-limit`
- Bun used in the Docker image
- Node 20+ declared for local package execution

## Repository Entry Points

### Start Here

- `README.md` — repository entry point
- `TODO.md` — root discovery pointer
- `docs/tasks/TODO.md` — canonical task navigator
- `docs/tasks/00_MASTER_BACKLOG.md` — canonical execution backlog index
- `docs/releases/NEWS.md` — release and repo-change log
- `CHANGELOG.md` — repo change history

### Architecture and Standards

- `docs/architecture/REPOSITORY-STANDARDS.md` — target repository structure and governance rules
- `docs/business/BUSINESS-DOCUMENTS.md` — canonical business-document index

### Current Backend Package

- `App Development/package.json`
- `App Development/.env.example`
- `App Development/Dockerfile`

## Quick Start

### Prerequisites

- Bun **or** Node 20+
- PostgreSQL
- Environment values for the provider stack

### Local Development

```bash
cd "App Development"
cp .env.example .env
bun install
bun run db:migrate
bun run dev
```

### Build

```bash
cd "App Development"
bun run build
```

### Smoke Check

```bash
cd "App Development"
bun run smoke
```

### Docker

```bash
docker build -f "App Development/Dockerfile" -t moneymsg-backend "App Development"
```

## Environment Categories

The active environment template lives at `App Development/.env.example`.

Current categories include:

- Database
- Auth and session
- Webhook security
- Alviere
- Plaid
- TabaPay
- Dwolla
- App runtime

## Safe Beta Path

Do not skip the blocker work.

1. Lock down auth and ownership boundaries
2. Fix env/config safety and TLS behavior
3. Add route-level rate limiting and abuse throttling
4. Finish logging redaction and correlation propagation
5. Replace placeholder risk scoring
6. Tighten schemas and payload validation
7. Harden webhook reconciliation and replay handling
8. Add real CI gates and automated test coverage
9. Add wallet summary and richer listing APIs
10. Add funding-source lifecycle support
11. Add intent parsing and recipient resolution
12. Add payment artifact lifecycle
13. Add support, disputes, admin, notifications, compliance, fraud, and recovery

## Canonical Backlog Layout

- `docs/tasks/00_MASTER_BACKLOG.md` — master dependency chain and beta path
- `docs/tasks/01_M0_SECURITY_BLOCKERS.md` — auth, env, rate limiting, logging
- `docs/tasks/02_M1_BACKEND_HARDENING.md` — risk, validation, reconciliation, provider wrappers
- `docs/tasks/03_M2_DATA_MODEL.md` — metadata, idempotency, funding sources
- `docs/tasks/04_M3_IME_FOUNDATION.md` — wallet summary, previews, deep links
- `docs/tasks/05_M4_ORCHESTRATION.md` — intent and recipient orchestration
- `docs/tasks/06_M5_PAYMENT_OBJECTS.md` — conversation-native payment artifacts
- `docs/tasks/07_M6_SUPPORT_OPS.md` — support, disputes, admin ops
- `docs/tasks/08_M7_NOTIFICATIONS_RECOVERY.md` — notifications and recovery
- `docs/tasks/09_M8_COMPLIANCE_FRAUD.md` — compliance and fraud ops
- `docs/tasks/10_M9_SPLIT_REMINDERS.md` — split and reminder systems
- `docs/tasks/11_M10_CI_HYGIENE.md` — CI, worker ops, repo hygiene
- `docs/tasks/12_M11_ANDROID_IME.md` — Android IME implementation
- `docs/tasks/13_M12_COMPANION_APP.md` — companion app expansion
- `docs/tasks/14_M13_SPEC_REWRITE.md` — blueprint and spec rewrite

## Repository Reality Check

The repo is in an active cleanup and canonicalization pass.

That means two things:

- some source and documentation paths still reflect the older backend-oriented layout
- the target structure is already defined, but the physical relocation work is still ongoing

Use `docs/architecture/REPOSITORY-STANDARDS.md` as the target map, not as a claim that the cleanup is already finished.

## Non-Negotiables

- No shipping on weak auth
- No shipping with placeholder risk logic
- No user-scoped actions without ownership verification
- No weak or non-redacted production logging
- No production launch without support, disputes, compliance, fraud, notifications, and recovery coverage
- No treating the keyboard as a full typing product

## Working Blueprint

The active blueprint direction is captured in the MoneyMsg project blueprint and mirrored into the repo task system.

Product model summary:

- specialized Android IME for in-conversation action capture
- companion app for trust-sensitive flows and management
- hardened backend execution core for wallet, request, transfer, and provider orchestration
- conversation-native artifact model instead of naked money links

## Ownership

MoneyMsg is a TopherLoring Industries project.

All repository planning, implementation, and documentation in this repo are treated as official work product for that parent organization.