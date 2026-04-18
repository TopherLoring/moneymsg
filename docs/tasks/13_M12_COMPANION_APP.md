## Version Tracking

| Field | Value |
|---|---|
| Version | v1.0.1 |
| Updated | 2026.04.18 05:20 AM CT |
| Status | Final |
| Parent | TopherLoring Industries |
| Project | MoneyMsg — Milestone 12: Companion App Expansion |
| Author | Christopher Rowden |

## Changelog

### v1.0.1 — 2026.04.18 05:20 AM CT

- Updated this milestone pack to the repository-wide timestamped version-tracking standard
- Kept milestone scope unchanged while aligning governed-doc metadata format with the standardized repo rules

### v1.0.0 — 2026.04.17

- Initial extraction from implementation plan

---

# Milestone 12 — Companion App Expansion

**Core principle:** The companion app is the trusted management and execution surface. The keyboard captures intent; the app handles trust, setup, and fallback.

---

## 12.1 Deep-Link Router

**Priority:** P1
**Depends on:** 3.2

### Tasks

- [ ] Build app router for all deep-link targets
  - **Type:** Add
  - **Routes:**
    - `moneymsg://wallet`
    - `moneymsg://wallet/load`
    - `moneymsg://wallet/cashout`
    - `moneymsg://wallet/transfer`
    - `moneymsg://activity`
    - `moneymsg://settings`
    - `moneymsg://funding-sources`
    - `moneymsg://payment/{id}`
    - `moneymsg://request/{id}`
    - `moneymsg://split/{id}`
    - `moneymsg://profile`
  - **Notes:** Each keyboard shortcut should route to the exact app screen, not dump the user into the home screen.

---

## 12.2 Wallet Management Screens

**Priority:** P1
**Depends on:** 12.1, 3.1

### Tasks

- [ ] Build wallet home
  - **Notes:** Available balance, pending/locked, linked sources, quick actions.

- [ ] Build Add Money flow

- [ ] Build Cash Out flow

- [ ] Build Move/Transfer flow
  - **Notes:** Distinguish: P2P transfer (keyboard-initiated) vs wallet/bank/card balance movement (app-managed with fees, confirmations, biometric).

- [ ] Build funding source management
  - **Notes:** List, add, remove, set default, nickname/label.

---

## 12.3 Payment Accept / Pay-Request Screens

**Priority:** P1
**Depends on:** 12.1, 5.1

### Tasks

- [ ] Build lightweight payment acceptance screen for recipients
  - **Notes:** Display: sender, amount, note, action CTA, biometric or confirm. This is the Mode B recipient experience — must be fast and low-friction.

- [ ] Build request-payment screen

- [ ] Build split-room participation/payment screen
  - **Notes:** Show group progress, individual share, pay button.

- [ ] Add return-to-conversation behavior after completion
  - **Notes:** After recipient action, bring them back to the messaging app thread where possible. Show generated confirmation message in-thread.

---

## 12.4 Activity, Settings & Funding Sources

**Priority:** P1
**Depends on:** 12.1, 2.3

### Tasks

- [ ] Build activity feed with transaction details and thread state
  - **Notes:** Match thread state — show same status (pending, paid, completed, expired) visible in both app and conversation.

- [ ] Build transaction detail screens
  - **Notes:** Clear receipts, fee transparency, support access from every transaction detail, clear pending/failed/completed states, user-facing explanations for holds/reversals/expirations.

- [ ] Build settings screens
  - **Notes:** Profile, notification preferences, security, linked devices, consent/policy management.

- [ ] Build onboarding state machine surfaces
  - **Notes:** Explicit states: wallet not ready, KYC pending, action required, source-linked vs not linked. Progressive onboarding tied to actual capabilities. Blocked-state UX for unsupported actions — do not let users fall into actions they cannot complete.

---

## Companion App Design Rules

- App owns: KYC, source linking, wallet management, history, settings, trust-sensitive approvals, fallback and recovery flows
- Handoff from keyboard should feel intentional, not random
- Return-to-conversation behavior after every completion
- Thread state and app state must stay in sync
- Every transaction detail screen must include support access
