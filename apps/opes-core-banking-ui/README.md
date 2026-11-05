# OPES Core Banking — Staff UI Screen Programme (Initial implementation)
Date: 2026-11-05. Owner: Opesware Technologies.
Branch: feature/core-banking-726-screen-workspace
Current checkpoint source: 92f9107d0c162380c5387ea0af333ed27cf23e47 — 114 screen IDs (not implemented).
**Catalogue:** 726 distinct routes; 114 canonical draft IDs plus 612 proposed expansion IDs, across 25 owner-approved technical domains and Banking Education extension (EDU). Expansion is NOT approved programme WBS.
**Implementation status:** routes, shared responsive shell, draft-only interactions; NO production banking API, no financial posting, no live data and no accepted 726 business workflows. Count must not be presented as 726 functionally completed screens.
**User requirement:** screen-first before document templates, full forms and reports. This package does not implement templates or reports.
**Security:** only transient in-memory drafts; no sensitive data persisted locally. No fake financial transaction. All server-side submit/post/approve/export actions blocked until per-bank auth, tenant-scoping, approved contracts and 2-person authorization verified.
**Run:** serve directory with any local HTTP server: `python3 -m http.server 8000`; open `/apps/opes-core-banking-ui/`. Node 22+: `node --test tests/*.test.mjs` from this directory.
**Quality gates:** no glows; Inter/system fonts; 320–1440px responsive; mobile <=2 dashboard columns; accessible focus, labels, live statuses and reduced motion; no horizontal page overflow (tables isolated scrolling).
**Next:** reconcile route specs with real 25-domain APIs; complete per-screen exact field contracts, actions, validation, permissions, acceptance and visual-browser test matrix. Mark missing or unverified as gaps; never claim zero gaps without evidence.

## Priority functional UI increment — 2026-11-05
A domain-specific client contract has been introduced for 215 routes across CIF (40), ACT (50), BRN (35), LED (40) and CRD (50). **24 existing canonical screen IDs** have individually curated proposed fields; 191 expanded routes inherit contextual task-based field groups and workflow stages. All are still draft client contracts, not regulator/bank-approved data definitions, production workflows, or accepted screens. See `src/priority-contracts.js` and `tests/priority-contracts.test.mjs`. The UI now displays a per-domain screen selector, domain lifecycle stages, grouped per-screen fields, and local synthetic form validation. Production submit/approve/post remain blocked. No document-template/form/report phase has started.
