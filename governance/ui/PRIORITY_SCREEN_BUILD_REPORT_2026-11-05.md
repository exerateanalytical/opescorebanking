# OPES Core Banking — Priority Screen Build Report
Date: 2026-11-05. Branch: `feature/core-banking-726-screen-workspace`.
## Exact scope
- Previous 726 route register unchanged, 114 canonical draft IDs retained.
- 215 priority domain routes now resolve to proposed domain-specific contracts: CIF 40, ACT 50, BRN 35, LED 40, CRD 50.
- 24 original draft screen IDs have manually curated screen-specific field definitions. 191 expansion IDs use domain/task-derived draft fields and workflow descriptions, pending product-owner review.
- Responsive screen picker, previous/next navigation, four tabs, domain lifecycle overview and grouped local-draft inputs implemented.
- Client-side checks include required inputs, safe-integer money, reasonable percentage limits, date ordering, distinct GL pair and XAF cash-count preview. These do not replace server validation.
- UI screen capability records remain **NOT_ACCEPTED** for all routes. No real bank data, ledger posting, maker-checker or payment rail is wired.
## Gap register
P0 UI-001: 726-to-domain canonical WBS validation (612 expansion IDs provisional).
P0 UI-002: exact legally and operationally required input/output fields for all screen states and bank types not approved.
P0 UI-003: institution-scoped authorization, maker-checker and transactional server calls unconnected.
P0 UI-004: branch cash denomination matrix and non-XAF currency counting require bank-approved specifications.
P0 UI-005: journal entry needs full variable-leg editor, certified posting contract, reversals and concurrency acceptance; two-leg synthetic form only.
P0 UI-006: credit underwriting requires configurable affordability/stress rules, evidence sources, collateral lifecycle and independent committee policy.
P1 UI-007: localization, keyboard and screen reader manual checks, visual comparison on all screens and 200% text zoom not completed.
P1 UI-008: responsive no-overflow sweeps are mechanical and do not prove zero cramping, distortion or color collision on every form state.
P1 UI-009: document templates, complete transactional forms and reports intentionally sequenced after screen implementation.
## Evidence
CI catalogue/contract tests and headless browser route sweeps. Treat exact CI run status as independently verified, not inferred from this report. No live backend/regulator certification claim.
