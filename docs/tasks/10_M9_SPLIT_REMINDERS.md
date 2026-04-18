## Version Tracking

| Field | Value |
|---|---|
| Version | v1.0.0 |
| Updated | 2026.04.17 |
| Status | Final |
| Parent | TopherLoring Industries |
| Project | MoneyMsg — Milestone 9: Split & Reminder Engine |
| Author | Christopher Rowden |

## Changelog

### v1.0.0 — 2026.04.17

- Initial extraction from implementation plan

---

# Milestone 9 — Split & Reminder Engine

---

## 9.1 Split Engine

**Priority:** P2
**Depends on:** 4.1, 4.2

### Tasks

- [ ] Add split schema
  - **Type:** Add/Migrate
  - **Files:** schema + migrations
  - **Notes:** Tables: `split_groups` (id, intent_event_id, total_amount, split_method [equal/custom], status), `split_participants` (id, split_group_id, display_name, phone_hash, assigned_amount, request_id, status).

- [ ] Add split routes/services
  - **Type:** Add
  - **Files:** `src/routes/split.ts`, `src/services/split.ts`
  - **Endpoints:** `POST /api/v1/split/create`, `POST /api/v1/split/claim`
  - **Notes:** Split intent parsing (equal split, custom split). Build split group creation flow from keyboard and app. Generate multi-party payment/request objects. Track participant states: invited, viewed, paid, declined, overdue.

- [ ] Add split request/payment object insertion
  - **Notes:** Status cards and summary messages in thread and app. Group progress model (e.g., "2/5 paid, 1 viewed, 2 pending").

- [ ] Add adaptive split support
  - **Notes:** AI detects patterns like "split this 3 ways but Chris owes extra for drinks" — offer custom split template.

### Tests

- [ ] `tests/split.create-claim.test.ts`

---

## 9.2 Reminder / Nudge Engine

**Priority:** P2
**Depends on:** 4.1, 6.1, 7.1

### Tasks

- [ ] Add reminder schema
  - **Type:** Add/Migrate
  - **Files:** schema + migrations
  - **Notes:** Table: `reminder_rules` (id, request_id, cadence [one_time/24h/3d/weekly], next_run_at, status).

- [ ] Add reminder service/routes
  - **Type:** Add
  - **Files:** `src/routes/reminder.ts`, `src/services/reminderService.ts`
  - **Endpoint:** `POST /api/v1/request/nudge`
  - **Notes:** Manual nudge flow, overdue reminder flow, reminder schedule objects, reminder history logging.

- [ ] Add reminder sweeper worker
  - **Type:** Add
  - **Files:** `src/workers/reminderSweeper.ts`

- [ ] Add recurring-pattern suggestions
  - **Notes:** Detect and suggest: weekly rent, same-person reimbursements, client deposits, recurring split groups, utilities, dinner groups, freelancer invoices.

- [ ] Add polite nudge message generation
  - **Notes:** e.g., "Hey — sending a reminder for the $42 dinner request."

### Tests

- [ ] `tests/reminder.schedule-send.test.ts`
