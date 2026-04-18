# MoneyMsg Backlog Reference Overview

## Version Tracking

| Field | Value |
|---|---|
| Version | v2.0.0 |
| Updated | 2026.04.18 |
| Status | Final |
| Parent | TopherLoring Industries |
| Project | MoneyMsg — Implementation Backlog |
| Author | Christopher Rowden |

## Changelog

### v2.0.0 — 2026.04.18

- Removed independent execution-authority language from this file
- Reduced this document to a reference overview of the milestone pack structure
- Pointed all live planning and status authority to root `TODO.md`

### v1.0.0 — 2026.04.17

- Initial extraction from GPT MoneyMsg chat
- All actionable items consolidated into milestone-based backlog
- Priority and dependency order established
- Individual milestone files created

## Purpose

This file is a reference overview for the milestone support packs under `docs/tasks/`.

It is **not** the canonical live backlog.

## Canonical Authority

Use root `TODO.md` for:

- execution planning
- live task status
- dependency order
- acceptance criteria
- progress evidence

## Milestone Support Map

| Milestone Pack | Purpose |
|---|---|
| `01_M0_SECURITY_BLOCKERS.md` | Auth, env, rate limiting, logging |
| `02_M1_BACKEND_HARDENING.md` | Risk engine, validation, reconciliation, providers |
| `03_M2_DATA_MODEL.md` | Metadata, idempotency, funding-source lifecycle |
| `04_M3_IME_FOUNDATION.md` | Wallet summary, previews, deep links |
| `05_M4_ORCHESTRATION.md` | Intent, recipient resolution, orchestration schema |
| `06_M5_PAYMENT_OBJECTS.md` | Conversation-native payment artifacts |
| `07_M6_SUPPORT_OPS.md` | Support, disputes, admin operations |
| `08_M7_NOTIFICATIONS_RECOVERY.md` | Notifications, sessions, recovery |
| `09_M8_COMPLIANCE_FRAUD.md` | Compliance and fraud operations |
| `10_M9_SPLIT_REMINDERS.md` | Split flows and reminder engine |
| `11_M10_CI_HYGIENE.md` | CI gates, worker lifecycle, repo hygiene |
| `12_M11_ANDROID_IME.md` | Android IME implementation |
| `13_M12_COMPANION_APP.md` | Companion app expansion |
| `14_M13_SPEC_REWRITE.md` | Blueprint and specification rewrite |

## Rule

This file may summarize structure, but it may not carry independent authoritative task status.
