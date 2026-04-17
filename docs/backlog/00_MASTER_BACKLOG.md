## Version Tracking

| Field | Value |
|---|---|
| Version | v1.0.0 |
| Updated | 2026.04.17 |
| Status | Final |
| Parent | TopherLoring Industries |
| Project | MoneyMsg — Implementation Backlog |
| Author | Christopher Rowden |

## Changelog

### v1.0.0 — 2026.04.17

- Initial extraction from GPT MoneyMsg chat
- All actionable items consolidated into milestone-based backlog
- Priority and dependency order established
- Individual milestone files created

---

# MoneyMsg Implementation Backlog — Master Index

## Legend

| Label | Meaning |
|---|---|
| Fix | Correct existing behavior |
| Add | New file/module/endpoint |
| Refactor | Restructure without changing core intent |
| Migrate | DB/schema/config change |
| Test | Automated validation |
| Ops | Deployment/CI/monitoring/admin work |

| Priority | Meaning |
|---|---|
| P0 | Blocker / security / production-critical |
| P1 | Core shipping work |
| P2 | Important follow-up |
| P3 | Later optimization |

---

## Execution Order — Dependency Chain

### Phase A — Security & Production Blockers (Ship Nothing Before This)

| # | Milestone | Priority | Depends On | File |
|---|---|---|---|---|
| 0.1 | Lock down API auth model | P0 | — | 01_M0_SECURITY_BLOCKERS.md |
| 0.2 | Fix env/config safety | P0 | — | 01_M0_SECURITY_BLOCKERS.md |
| 0.3 | Rate limiting & abuse throttling | P0 | 0.1 | 01_M0_SECURITY_BLOCKERS.md |
| 0.4 | Logging, redaction, correlation IDs | P0 | — | 01_M0_SECURITY_BLOCKERS.md |

### Phase B — Backend Financial Hardening

| # | Milestone | Priority | Depends On | File |
|---|---|---|---|---|
| 1.1 | Replace placeholder risk engine | P0 | 0.1, 0.4 | 02_M1_BACKEND_HARDENING.md |
| 1.2 | Harden schemas & payload validation | P0 | — | 02_M1_BACKEND_HARDENING.md |
| 1.3 | Webhook & reconciliation hardening | P0 | 0.2, 0.4 | 02_M1_BACKEND_HARDENING.md |
| 1.4 | Provider wrapper quality | P1 | 0.4, 1.3 | 02_M1_BACKEND_HARDENING.md |

### Phase C — Data Model & Structural Cleanup

| # | Milestone | Priority | Depends On | File |
|---|---|---|---|---|
| 2.1 | Structured metadata storage (jsonb) | P1 | 1.2 | 03_M2_DATA_MODEL.md |
| 2.2 | Request idempotency hardening | P1 | — | 03_M2_DATA_MODEL.md |
| 2.3 | Funding source lifecycle | P1 | 0.1, 1.2 | 03_M2_DATA_MODEL.md |

### Phase D — IME Support Foundation

| # | Milestone | Priority | Depends On | File |
|---|---|---|---|---|
| 3.1 | Wallet summary & listing APIs | P1 | 1.1, 2.3 | 04_M3_IME_FOUNDATION.md |
| 3.2 | Deep-link support layer | P1 | 3.1 | 04_M3_IME_FOUNDATION.md |

### Phase E — Intent & Recipient Orchestration

| # | Milestone | Priority | Depends On | File |
|---|---|---|---|---|
| 4.1 | Orchestration schema | P1 | 2.1 | 05_M4_ORCHESTRATION.md |
| 4.2 | Intent API surface | P1 | 4.1 | 05_M4_ORCHESTRATION.md |
| 4.3 | Recipient resolution service | P1 | 4.1, 2.3 | 05_M4_ORCHESTRATION.md |

### Phase F — Conversation-Native Payment Objects

| # | Milestone | Priority | Depends On | File |
|---|---|---|---|---|
| 5.1 | Artifact generation & lifecycle | P1 | 4.1, 4.2 | 06_M5_PAYMENT_OBJECTS.md |

### Phase G — Production Survivability

| # | Milestone | Priority | Depends On | File |
|---|---|---|---|---|
| 6.1 | Support engine | P1 | 0.1, 3.1 | 07_M6_SUPPORT_OPS.md |
| 6.2 | Disputes & exception workflows | P1 | 6.1 | 07_M6_SUPPORT_OPS.md |
| 6.3 | Admin / operations console backend | P1 | 0.1, 6.1, 6.2 | 07_M6_SUPPORT_OPS.md |
| 7.1 | Notification engine | P1 | 5.1, 6.1 | 08_M7_NOTIFICATIONS_RECOVERY.md |
| 7.2 | Account recovery & security flows | P1 | 0.1 | 08_M7_NOTIFICATIONS_RECOVERY.md |
| 8.1 | Compliance ops layer | P1 | 1.1, 6.1 | 09_M8_COMPLIANCE_FRAUD.md |
| 8.2 | Fraud ops tooling | P1 | 1.1, 6.3 | 09_M8_COMPLIANCE_FRAUD.md |

### Phase H — Advanced Features

| # | Milestone | Priority | Depends On | File |
|---|---|---|---|---|
| 9.1 | Split engine | P2 | 4.1, 4.2 | 10_M9_SPLIT_REMINDERS.md |
| 9.2 | Reminder / nudge engine | P2 | 4.1, 6.1, 7.1 | 10_M9_SPLIT_REMINDERS.md |

### Phase I — CI, Hygiene, & Worker Ops

| # | Milestone | Priority | Depends On | File |
|---|---|---|---|---|
| 10.1 | Real CI gates | P0 | incremental | 11_M10_CI_HYGIENE.md |
| 10.2 | Worker lifecycle & ops | P2 | workers existing | 11_M10_CI_HYGIENE.md |
| 10.3 | Repo/doc hygiene | P2 | — | 11_M10_CI_HYGIENE.md |

### Phase J — Android IME & Companion App (Parallel Track)

| # | Milestone | Priority | Depends On | File |
|---|---|---|---|---|
| 11.1 | IME shell & compact launcher | P1 | 3.1, 3.2 | 12_M11_ANDROID_IME.md |
| 11.2 | Expanded composer mode | P1 | 11.1, 4.2, 4.3 | 12_M11_ANDROID_IME.md |
| 11.3 | Wallet mini-panel | P1 | 11.1, 3.1 | 12_M11_ANDROID_IME.md |
| 11.4 | Payment object insertion pipeline | P1 | 11.2, 5.1 | 12_M11_ANDROID_IME.md |
| 12.1 | Companion app deep-link router | P1 | 3.2 | 13_M12_COMPANION_APP.md |
| 12.2 | Wallet management screens | P1 | 12.1, 3.1 | 13_M12_COMPANION_APP.md |
| 12.3 | Payment accept / pay-request screens | P1 | 12.1, 5.1 | 13_M12_COMPANION_APP.md |
| 12.4 | Activity, settings, funding sources | P1 | 12.1, 2.3 | 13_M12_COMPANION_APP.md |

### Phase K — Spec & Documentation Rewrite

| # | Milestone | Priority | Depends On | File |
|---|---|---|---|---|
| 13.1 | Product architecture & spec rewrite | P1 | — | 14_M13_SPEC_REWRITE.md |

---

## Fastest Path to Safe Production Beta

Ship in this trimmed order — skip nothing above the line:

1. Auth overhaul (0.1)
2. KYC/Plaid ownership fixes (0.1)
3. Env + TLS + logging hardening (0.2, 0.4)
4. Rate limiting (0.3)
5. Risk engine replacement (1.1)
6. Strong validation schemas (1.2)
7. Reconciliation hardening (1.3)
8. CI/test gates (10.1)
9. Wallet summary + listing APIs (3.1)
10. Funding-source lifecycle (2.3)
11. Intent schema + parse/confirm (4.1, 4.2)
12. Recipient resolution (4.3)
13. Payment object lifecycle (5.1)
14. Support engine (6.1)
15. Notifications (7.1)
16. Admin/ops console (6.3)
17. Disputes (6.2)
18. Recovery/security flows (7.2)

---

## Non-Negotiable Implementation Rules

- No raw visible URLs in production conversation UI
- Keyboard is a specialized action surface, not a full typing competitor
- Money movement remains deterministic and rule-based
- AI may suggest and structure, never silently execute
- Every money action requires explicit user confirmation
- Risk hardening happens before broad smart automation
- Companion app remains the trust/management anchor
- Conversation-derived data is minimized and privacy-safe
- IME remains fast, light, and low-friction

---

## Files in This Backlog

| File | Contents |
|---|---|
| 00_MASTER_BACKLOG.md | This file — index, dependency order, beta path |
| 01_M0_SECURITY_BLOCKERS.md | Milestone 0 — Auth, env, rate limiting, logging |
| 02_M1_BACKEND_HARDENING.md | Milestone 1 — Risk engine, schemas, webhooks, providers |
| 03_M2_DATA_MODEL.md | Milestone 2 — Metadata, idempotency, funding sources |
| 04_M3_IME_FOUNDATION.md | Milestone 3 — Wallet summary, deep links |
| 05_M4_ORCHESTRATION.md | Milestone 4 — Intent/recipient orchestration layer |
| 06_M5_PAYMENT_OBJECTS.md | Milestone 5 — Conversation-native payment objects |
| 07_M6_SUPPORT_OPS.md | Milestone 6 — Support, disputes, admin console |
| 08_M7_NOTIFICATIONS_RECOVERY.md | Milestone 7 — Notifications, account recovery |
| 09_M8_COMPLIANCE_FRAUD.md | Milestone 8 — Compliance ops, fraud ops |
| 10_M9_SPLIT_REMINDERS.md | Milestone 9 — Split engine, reminder engine |
| 11_M10_CI_HYGIENE.md | Milestone 10 — CI gates, worker ops, repo hygiene |
| 12_M11_ANDROID_IME.md | Milestone 11 — Android IME build |
| 13_M12_COMPANION_APP.md | Milestone 12 — Companion app expansion |
| 14_M13_SPEC_REWRITE.md | Milestone 13 — Product spec rewrite |
