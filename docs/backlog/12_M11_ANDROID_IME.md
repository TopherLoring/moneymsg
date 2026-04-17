## Version Tracking

| Field | Value |
|---|---|
| Version | v1.0.0 |
| Updated | 2026.04.17 |
| Status | Final |
| Parent | TopherLoring Industries |
| Project | MoneyMsg — Milestone 11: Android IME Build |
| Author | Christopher Rowden |

## Changelog

### v1.0.0 — 2026.04.17

- Initial extraction from implementation plan

---

# Milestone 11 — Android IME Build

**Core principle:** MoneyMsg is a specialized payment/action IME panel, not a full replacement keyboard. It lives in the keyboard system for instant conversation access. It does not compete with Gboard on typing quality.

---

## 11.1 IME Shell & Compact Launcher

**Priority:** P1
**Depends on:** 3.1, 3.2

### Tasks

- [ ] Implement IME shell using `InputMethodService`
  - **Type:** Add
  - **Language:** Kotlin
  - **Notes:** Keep memory and state light. Avoid turning it into a full typing competitor.

- [ ] Build compact launcher mode
  - **Notes:** Visible in keyboard area with: wallet balance, Send, Request, Split, Add Money, Cash Out. Quick entry into expanded composer.

- [ ] Add "switch back" behavior
  - **Notes:** After insertion, auto-return to prior keyboard if possible. Otherwise present obvious collapse/return affordance.

- [ ] Add IME-safe auth/session handling
  - **Notes:** No persistent sensitive data in keyboard. Use short-lived tokens. Fetch only what is needed. Add biometric/step-up handoff when required.

### UI States

- compact idle
- compact with detected intent
- stale balance state
- error/fallback to app

---

## 11.2 Expanded Composer Mode

**Priority:** P1
**Depends on:** 11.1, 4.2, 4.3

### Tasks

- [ ] Build expanded payment composer
  - **Notes:** Fields: action type, recipient field/suggestions, amount, memo, funding source choice (if relevant), confirm button.

- [ ] Add clarification UX for unresolved recipient or missing amount
  - **Notes:** "How much?" / "Which Chris?" / "Choose recipient" — tiny follow-ups, not full-form entry.

- [ ] Add recipient suggestion row under the amount/recipient section
  - **Notes:** Show: recent contacts, frequent counterparties, thread-aware suggestions. Confidence-tiered display.

- [ ] Add intent detection modes
  - **Notes:** Detect mode ("I'll send you the 35 for gas" → chip: Send $35). Request mode ("Can you pay me back for dinner?" → chip: Request Money). Split mode ("Let's split this four ways" → chip: Split $). Reminder mode ("You still owe me" → chip: Nudge Request). Repeat mode (recognize rent, utilities, rides, dinner, freelance patterns).

### UI States

- expanded composer
- recipient clarification
- insufficient balance
- processing

---

## 11.3 Wallet Mini-Panel

**Priority:** P1
**Depends on:** 11.1, 3.1

### Tasks

- [ ] Build wallet mini-panel
  - **Notes:** Display: available balance, locked/pending balance. Buttons: Add Money, Cash Out, Transfer, Activity, Settings, Open App.

- [ ] Add fast cached balance display
  - **Notes:** Show last-known balance instantly. Refresh in background with short-lived token. Show stale-state indicator if needed (e.g., "Last updated 2m ago"). Do not make keyboard depend on slow live fetch every open.

- [ ] Add app handoff triggers
  - **Notes:** Funding source linking, full wallet transfer/cashout/load, settings, activity. Each action deep-links into exact app screen (not just home).

- [ ] Add insufficient-balance behavior
  - **Notes:** Suggest Add Money. Suggest funded send.

- [ ] Add post-completion wallet refresh and state sync

### UI States

- wallet panel open
- stale balance state

---

## 11.4 Payment Object Insertion Pipeline

**Priority:** P1
**Depends on:** 11.2, 5.1

### Tasks

- [ ] Build insertion renderer for chat artifacts
  - **Notes:** Insert polished text/card payload, not raw URL. Use display text that looks like a payment action. Examples: "💸 Pay $20 to Chris", "Request: $42 for dinner", "Split $118 · 4 people", "MoneyMsg Payment · Tap to Pay".

- [ ] Add sender-side confirmation view before insertion

- [ ] Add thread follow-up message generation
  - **Notes:** After completion, offer: "Paid", "Accepted", "Declined", "Completed" as generated in-thread responses.

- [ ] Add graceful degradation
  - **Notes:** Rich object where possible. Formatted text + hidden action path where chat app only supports plain text.

### UI States

- inserted successfully

---

## IME Design Rules (Non-Negotiable)

- Never insert naked raw URLs in normal UX
- Never try to be a full general-purpose typing keyboard
- Balance display: cached first, refresh in background
- Settings, funding sources, full wallet management → hand off to companion app
- Short-lived tokens only — no persistent sensitive data in IME
- Every payment action requires explicit user confirmation before insertion
