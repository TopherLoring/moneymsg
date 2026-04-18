## Version Tracking

| Field | Value |
|---|---|
| Version | v1.0.0 |
| Updated | 2026.04.17 |
| Status | Final |
| Parent | TopherLoring Industries |
| Project | MoneyMsg — Milestone 4: Intent & Recipient Orchestration |
| Author | Christopher Rowden |

## Changelog

### v1.0.0 — 2026.04.17

- Initial extraction from implementation plan

---

# Milestone 4 — Intent & Recipient Orchestration

---

## 4.1 Orchestration Schema

**Priority:** P1
**Depends on:** 2.1

### Tasks

- [ ] Add `conversations` table
  - **Type:** Add/Migrate
  - **Files:** `src/db/schema.ts`, migration
  - **Notes:** Fields: id, platform_type (sms, rcs, whatsapp, signal, telegram, unknown), conversation_hash (privacy-safe identifier), created_at.

- [ ] Add `intent_events` table
  - **Type:** Add/Migrate
  - **Files:** schema + migration
  - **Notes:** Fields: id, conversation_id, user_id, raw_text_redacted, intent_kind, parser_version, confidence, status (detected, awaiting_clarification, confirmed, cancelled, executed), missing_fields_json, structured_payload_json, created_at, updated_at.

- [ ] Add `recipient_hints` table
  - **Type:** Add/Migrate
  - **Files:** schema + migration
  - **Notes:** Fields: id, intent_event_id, display_name, phone_hash, handle, resolution_status (unresolved, candidate, resolved, claimed), resolved_user_id, confidence.

- [ ] Add `parser_feedback` table
  - **Type:** Add/Migrate
  - **Files:** schema + migration
  - **Notes:** Fields: id, intent_event_id, user_corrected, original_payload_json, corrected_payload_json.

- [ ] Add `conversation_artifacts` table
  - **Type:** Add/Migrate
  - **Files:** schema + migration
  - **Notes:** Fields: id, intent_event_id, artifact_type (send_card, request_card, split_card, reminder_card, status_card, receipt_card), status (pending, viewed, accepted, paid, declined, expired, reversed, completed), action_target_url, created_at, updated_at.

- [ ] Add new enums: intent status, recipient resolution status, artifact status, reminder status

- [ ] Add foreign keys from transactions and payment_requests to intent_events

- [ ] Add indexes for resolver and analytics queries

### Tests

- [ ] `tests/schema.intent-conversation.test.ts`

---

## 4.2 Intent API Surface

**Priority:** P1
**Depends on:** 4.1

### Tasks

- [ ] Add intent route group
  - **Type:** Add
  - **Files:** `src/routes/intent.ts`, `src/server.ts`

- [ ] Add parser/orchestrator services
  - **Type:** Add
  - **Files:** `src/services/intentParser.ts`, `src/services/intentOrchestrator.ts`, `src/lib/intentSchemas.ts`
  - **Notes:** Define normalized intent types: send, request, split, remind. Define canonical payload fields: action type, amount, currency, recipient hint(s), memo, source preference, confidence, missing fields, conversation metadata.

- [ ] Add routes
  - **Type:** Add
  - **Endpoints:**
    - `POST /api/v1/intent/parse`
    - `POST /api/v1/intent/confirm`
    - `POST /api/v1/intent/suggestions`
    - `POST /api/v1/intent/feedback`

- [ ] Build orchestration routing rules
  - **Notes:** send + wallet funded → `/transfer/intent/wallet`. send + external funding → `/transfer/funded-p2p`. request → `/request/create`. pay request → `/request/pay`. wallet load → `/wallet/load`. cashout → `/wallet/cashout`.

- [ ] Add clarification logic
  - **Notes:** Missing amount → prompt. Recipient ambiguity → candidate list. Unresolved source → request confirmation. High confidence only suggests; never silently executes.

- [ ] Add confidence thresholds
  - **Notes:** High → suggest direct action. Medium → ask lightweight question. Low → fallback to manual composer.

- [ ] Add parser versioning and feedback logging

### Tests

- [ ] `tests/intent.parse-routing.test.ts`
- [ ] `tests/intent.feedback.test.ts`

---

## 4.3 Recipient Resolution Service

**Priority:** P1
**Depends on:** 4.1, 2.3

### Tasks

- [ ] Add recipient resolver service
  - **Type:** Add
  - **Files:** `src/services/recipientResolver.ts`
  - **Notes:** Merge inputs from: explicit MoneyMsg contacts, prior counterparties, phone contacts, text-extracted names/handles/phone numbers, conversation hints when available. Add ranking and confidence logic.

- [ ] Add recipient route
  - **Type:** Add
  - **Files:** `src/routes/recipient.ts`, `src/server.ts`
  - **Endpoint:** `POST /api/v1/intent/resolve-recipient`

- [ ] Support recipient states: resolved, candidate list, unresolved

- [ ] Add correction feedback loop
  - **Type:** Add
  - **Files:** `src/services/recipientResolver.ts`, `src/routes/intent.ts`
  - **Notes:** Store manual corrections as training/heuristic feedback.

- [ ] Add recent/frequent recipient suggestions
  - **Notes:** Pattern-aware: rent, dinner, rides, freelancers/clients.

- [ ] Add privacy-safe identifiers
  - **Notes:** Hashed phone values, redacted raw text where possible.

- [ ] Add edge-case handling
  - **Notes:** Multiple matches for same name, recipient not onboarded, recipient unknown. Fallback: unresolved → create request/claim card; resolved → direct suggested action.

### Tests

- [ ] `tests/recipient.resolve.test.ts`
- [ ] `tests/recipient.ambiguity.test.ts`
