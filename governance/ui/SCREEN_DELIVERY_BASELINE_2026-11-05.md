# OPES Banking Screens — Baseline and Acceptance Gates
Date 2026-11-05. Baseline from 114 draft master screen register IDs, source blob `92f9107d0c162380c5387ea0af333ed27cf23e47`.
Current branch: `feature/core-banking-726-screen-workspace`.
The previously quoted 726 count is **a proposed UX allocation**, not a reviewed requirements denominator.
This implementation preserves all 114 canonical drafts and proposes 612 additional routes; each new route must have owner review for necessity, deduplication, fields, workflow transitions and role matrix.
## Definition of Done per screen
- Exact purpose, domain, persona, workflow, route, owner and source requirements linked.
- Input/output fields mapped to authoritative API and data schema; no guessed legal or bank-required fields.
- All controls, buttons, tabs, empty/loading/error/offline/pending states wired and tested; no silent success.
- Server-issued identity and tenant-scoped authorization enforce every action; maker-checker never client-authorized.
- 320/375/768/1024/1440 viewport checks including French translation, 200% text and device rotation.
- WCAG 2.2 AA automated + keyboard + screen reader test; contrast verified, not just asserted.
- No horizontal clipping, overlapping fields, cramping, gradients/glow, or ambiguous icon-only controls.
- Localization EN/FR, time/currency handling and sensitive-data masking.
- Unit/component/e2e/negative/race/offline tests executed and attached as evidence.
## Current gap state
Design routes created; backend integrations, schema-level forms, transactional operations, visual screenshot matrix, audit log and end-to-end tests NOT completed; DoD FAIL.
Preserve current security gate SEC-TENANT-ROUTING-001 and ledger P0 blocks. No main-branch force push.
