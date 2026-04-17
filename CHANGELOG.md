# CHANGELOG

––––––––––––––––––––––––––––––
VERSION TRACKING
––––––––––––––––––––––––––––––
Version:     v1.0.0
Updated:     2026.04.17
Status:      Review
Parent:      TopherLoring Industries
Project:     MoneyMsg
Author:      Christopher Rowden
––––––––––––––––––––––––––––––
CHANGELOG
––––––––––––––––––––––––––––––
v1.0.0 — 2026.04.17

- Initial release
- Added repository-level changelog for MoneyMsg
- Established a versioned documentation anchor for repo governance, releases, tasks, business documents, and archive management
- Recorded the first standards-focused refactor pass for AI-agent-friendly repository organization

## 2026.04.17 — Repository Standards Refactor Pass

### Added
- `docs/architecture/REPOSITORY-STANDARDS.md`
- `docs/business/BUSINESS-DOCUMENTS.md`
- `docs/releases/NEWS.md`
- `docs/tasks/TODO.md`
- `docs/archive/README.md`

### Defined
- Canonical documentation zones for architecture, business, releases, tasks, and archive material
- Archive policy for obsolete, redundant, generated, unpacked, and superseded assets
- AI-agent navigation guidance based on stable top-level paths and predictable documentation placement

### Flagged for physical relocation
- `node_modules/`
- `dist/`
- `Documents_unpacked/`
- any unpacked duplicate business-doc exports
- any tracked environment residue, generated bundles, or legacy scratch files

### Notes
- This pass establishes standards and destination paths immediately.
- A second pass should physically relocate or delete tracked redundant assets once full file-by-file enumeration is available through the repo connector or a raw repo snapshot.