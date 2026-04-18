## Version Tracking

| Field | Value |
|---|---|
| Version | v1.0.0 |
| Updated | 2026.04.17 |
| Status | Final |
| Parent | TopherLoring Industries |
| Project | MoneyMsg — Milestone 7: Notifications & Account Recovery |
| Author | Christopher Rowden |

## Changelog

### v1.0.0 — 2026.04.17

- Initial extraction from implementation plan

---

# Milestone 7 — Notifications & Account Recovery

---

## 7.1 Notification Engine

**Priority:** P1
**Depends on:** 5.1, 6.1

### Tasks

- [ ] Add notification schema
  - **Type:** Add/Migrate
  - **Files:** schema + migration
  - **Notes:** Push notifications, email notifications, in-app inbox.

- [ ] Add notification service
  - **Type:** Add
  - **Files:** `src/services/notifications.ts`
  - **Notes:** Payment event notifications (received, accepted, failed, expired, paid request, reminder sent). Security notifications (new device, unusual transaction, account restricted, funding source changed). Support notifications (case updated, action required).

- [ ] Add notification routes / inbox API
  - **Type:** Add
  - **Files:** `src/routes/notifications.ts`, `src/server.ts`

- [ ] Add notification preference controls
  - **Notes:** User-configurable opt-in/opt-out per category.

### Tests

- [ ] `tests/notifications.inbox.test.ts`
- [ ] `tests/notifications.event-trigger.test.ts`

---

## 7.2 Account Recovery & Security Flows

**Priority:** P1
**Depends on:** 0.1 (auth/session model)

### Tasks

- [ ] Add account recovery schema/tokens
  - **Type:** Add/Migrate
  - **Files:** schema + migrations
  - **Notes:** Login/session recovery, device loss flow, phone number change process, email recovery flow, re-verification flow.

- [ ] Add recovery routes
  - **Type:** Add
  - **Files:** `src/routes/recovery.ts`, `src/services/recovery.ts`
  - **Notes:** Account lock/unlock workflow, suspicious access review flow, secure fallback if user loses access to primary device.

- [ ] Add session/device inventory endpoints
  - **Type:** Add
  - **Files:** `src/routes/sessions.ts`, `src/services/sessions.ts`
  - **Notes:** Device/session inventory, session revocation, multi-device management.

### Tests

- [ ] `tests/recovery.flow.test.ts`
- [ ] `tests/sessions.inventory-revoke.test.ts`
