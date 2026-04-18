## Version Tracking

| Field | Value |
|---|---|
| Version | v1.0.1 |
| Updated | 2026.04.18 05:20 AM CT |
| Status | Final |
| Parent | TopherLoring Industries |
| Project | MoneyMsg — Milestone 13: Product Spec Rewrite |
| Author | Christopher Rowden |

## Changelog

### v1.0.1 — 2026.04.18 05:20 AM CT

- Updated this milestone pack to the repository-wide timestamped version-tracking standard
- Kept milestone scope unchanged while aligning governed-doc metadata format with the standardized repo rules

### v1.0.0 — 2026.04.17

- Initial extraction from implementation plan

---

# Milestone 13 — Product Architecture & Spec Rewrite

**Priority:** P1
**Depends on:** None (should happen first or in parallel with Phase A)

---

## 13.1 Rewrite All Planning Documents

### Tasks

- [ ] Replace product definition framing
  - **Old:** "MoneyMsg is a payment keyboard"
  - **New:** "MoneyMsg is a conversation-native payments platform powered by a specialized Android IME and companion app"

- [ ] Replace link-first language
  - **Old:** Raw visible payment links as primary UX
  - **New:** Polished in-thread payment objects backed by hidden MoneyMsg action targets

- [ ] Update keyboard responsibilities
  - **From:** amount input, message insertion, auth token use
  - **To:** intent capture, recipient suggestion, wallet balance display, quick actions, payment card insertion, app deep-link launch

- [ ] Update companion app responsibilities
  - **Notes:** Explicitly owns: KYC, source linking, wallet management, recipient payment acceptance, activity/history, settings, fallback and recovery flows.

- [ ] Add confirmed product principles
  - **Notes:** "keyboard-first, not keyboard-only" and "no raw visible links; action-backed objects are fine"

- [ ] Add formal Mode B section
  - **Notes:** Sender acts from keyboard → recipient taps in-thread object → lightweight MoneyMsg action sheet/app handoff → recipient confirms quickly → returns to conversation → follow-up status message inserted into thread.

- [ ] Add formal Recipient Suggestion & Resolution section
  - **Notes:** States: resolved, candidate list, clarification needed, fallback to claim/request model. Confidence-tiered: hard selected, inferred, unresolved fallback.

- [ ] Add formal payment object state model
  - **Notes:** States: pending, viewed, accepted, paid, declined, expired, reversed, completed.

- [ ] Add privacy model
  - **Notes:** Minimize stored conversation-derived data. Never store full conversations. Hash conversation IDs and phone references. Retain only redacted text or extracted fields for audit/debug.

- [ ] Add backend hardening prerequisites to roadmap

- [ ] Update implementation sequence across all planning docs

### Deliverables

- [ ] Updated master blueprint
- [ ] Updated backend/API spec
- [ ] Updated keyboard UX spec
- [ ] Updated companion app UX spec
- [ ] Updated risk/privacy design note
- [ ] Updated rollout roadmap

---

## Additional Spec Documents Needed

- [ ] Onboarding state machine spec
  - **Notes:** Explicit gating: wallet not ready, KYC pending, source-linked vs not, send/request eligibility rules.

- [ ] Merchantability / trust surface spec
  - **Notes:** Clear receipts, fee transparency, trust copy for verification holds, recipient identity confirmation UX.

- [ ] Abuse prevention spec
  - **Notes:** Spam throttling for request cards/reminders, repeated request abuse controls, recipient blocking/muting, request decline/ignore preferences, sender reputation scoring, "report abuse" from payment object, link/card spoof-protection, thread artifact authenticity markers.

- [ ] Financial reporting spec
  - **Notes:** Internal revenue reporting, fee revenue reporting, ledger-to-provider reconciliation, daily balance integrity checks, exception reports, payout/load success reports, stale pending transaction reports, finance/admin export tools, month-end reporting support.

- [ ] Security infrastructure spec
  - **Notes:** Secrets management, environment segregation, key rotation procedures, WAF/abuse mitigation, RBAC for support/compliance/admin users, secure logging/redaction standards.

- [ ] Analytics & telemetry spec
  - **Notes:** Onboarding funnel, KYC conversion, funding source link conversion, send/request completion funnels, failed-state dropoff, recipient-resolution accuracy, support-contact triggers, retention/cohort, notification effectiveness, split/reminder adoption.
