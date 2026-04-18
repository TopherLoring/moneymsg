# MoneyMsg Business Documents

## Version Tracking

| Field | Value |
|---|---|
| Version | v1.1.0 |
| Updated | 2026.04.18 03:56 AM CT |
| Status | Review |
| Parent | TopherLoring Industries |
| Project | MoneyMsg |
| Author | Christopher Rowden |

## Changelog

### v1.1.0 — 2026.04.18 03:56 AM CT

- Updated governed business-document rules to require both date and time in version tracking
- Aligned business-document timestamp format to the repository-wide U.S. AM/PM standard with timezone

### v1.0.0 — 2026.04.17

- Initial release
- Added canonical business-document index for MoneyMsg
- Defined the active business documentation categories and source-of-truth handling
- Established migration targets for scattered partner, blueprint, and integration materials

## Purpose

This document is the canonical index for MoneyMsg business documentation inside the repository. It exists to stop business-critical material from being scattered across the repo root, unpacked folders, or duplicate exports.

## Canonical Business Document Categories

### Product and Blueprint

- Product blueprint
- User flows
- transaction state machine
- platform behavior and fee structure
- project architecture overview

### Partner and Integration

- provider integration guides
- partner requirements guides
- partner application packages
- external compliance and onboarding requirements

### Legal and Compliance

- regulatory notes
- KYC and AML policy references
- privacy and data-handling material
- partner obligations and operational risk notes

### Commercial and Operations

- positioning and product strategy
- launch planning
- release communications
- operational task lists

## Observed Active Source Material To Consolidate

The following document groups were observed across the available repository mirror and should be consolidated into canonical active files under `docs/business/`:

- MoneyMsg blueprint documents
- partner application package documents
- partner requirements guides
- provider integration guides
- transaction state machine notes and diagrams
- behavior model and fee structure notes
- architecture and overview text documents

## Canonical Handling Rules

1. Keep one active canonical file per business subject.
2. Move duplicate exports, unpacked copies, and superseded variants to `docs/archive/`.
3. Do not store business-critical docs at the repo root unless they are the repo `README.md`, `CHANGELOG.md`, or root `TODO.md`.
4. Every governed business document must use the standard version tracking header with a timestamp in the format `YYYY.MM.DD hh:mm AM/PM TZ`.
5. When two documents overlap, the more current and more complete version wins and the loser gets archived.

## Required Follow-Up Consolidation

- Convert blueprint material into one canonical blueprint file
- Convert partner documentation into one canonical partner requirements file and one canonical partner package file
- Separate business documentation from engineering standards docs
- Archive redundant unpacked copies
- Link each active business document from this index once the physical migration pass is complete

## Definition of Done

This document is complete when every active MoneyMsg business document has a canonical location under `docs/business/` and every superseded copy has been moved to `docs/archive/` or removed.
