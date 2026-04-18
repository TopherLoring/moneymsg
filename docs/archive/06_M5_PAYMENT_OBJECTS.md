## Version Tracking

| Field | Value |
|---|---|
| Version | v1.0.0 |
| Updated | 2026.04.17 |
| Status | Final |
| Parent | TopherLoring Industries |
| Project | MoneyMsg — Milestone 5: Conversation-Native Payment Objects |
| Author | Christopher Rowden |

## Changelog

### v1.0.0 — 2026.04.17

- Initial extraction from implementation plan

---

# Milestone 5 — Conversation-Native Payment Objects

---

## 5.1 Artifact Generation & Lifecycle

**Priority:** P1
**Depends on:** 4.1, 4.2

### Tasks

- [ ] Add conversation artifact service
  - **Type:** Add
  - **Files:** `src/services/conversationArtifacts.ts`

- [ ] Define object types
  - **Notes:** send card, request card, split card, reminder card, payment status card, completion receipt card.

- [ ] Define content fields per object
  - **Notes:** title, amount, counterpart, memo, primary action label, status badge.

- [ ] Define object state machine
  - **Notes:** States: pending → viewed → accepted/paid/declined/expired/reversed/completed.

- [ ] Add artifact state transitions mapped to transaction/request lifecycle
  - **Type:** Refactor
  - **Files:** `src/modules/transfer/http/routes.ts`, `src/modules/request/http/routes.ts`, `src/modules/status/http/routes.ts`

- [ ] Build hidden action target system
  - **Notes:** App link / deep link / lightweight handoff. Replace naked URL insertion with formatted conversation artifact insertion.

- [ ] Add no-raw-link rendering contract and fallback mode support
  - **Type:** Add
  - **Files:** service layer / response mappers
  - **Notes:** Rich object where possible. Formatted text + hidden action path where not. Accessibility labels and degraded text mode for apps that render plain text only.

- [ ] Add sender-side confirmation view before insertion

- [ ] Add recipient action handling when object tapped

- [ ] Add thread follow-up messages
  - **Notes:** accepted, paid, declined, expired, completed.

- [ ] Add lifecycle mapping between artifact states and backend transaction/intent states

### Tests

- [ ] `tests/artifact.lifecycle.test.ts`
- [ ] `tests/artifact.fallback-rendering.test.ts`

### Deliverables

- Payment object spec
- Render templates
- Action target mapping
- Thread status update rules
- Fallback rendering rules
