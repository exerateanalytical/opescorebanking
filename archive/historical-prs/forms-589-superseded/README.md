# OPES Core Banking — 589 Banking Forms and Workflow Prototypes

The planning estimate of **589 standalone forms** has been implemented as 589 uniquely identified client-side form contract prototypes over 25 institutional functional groups. This is a **new proposed register**, not a proven historical canonical number or 589 accepted live banking workflows.

## Files
- src/registry-seeds.js — 339 distinct task topics, five proposed variants, reconciled 589-form planning register.
- src/forms.js — typed definitions, 25 domain field profiles, 6 repeatable line types, conditional controls, statuses, workflow and API placeholders.
- src/validation.js — pure local field/amount/date/permission validation, balanced journal legs, cash totals, duplicate bulk beneficiaries and ownership percentages.
- src/app.js — native-feeling responsive prototype: domain search/navigation, 589 forms, fieldsets, repeatable rows, conditional inputs, local draft validation, synthetic sample data, draft inspect/JSON export, workflow/controls/audit tabs and role/state previews.
- scripts/export-all.mjs — all 589 individual JSON contracts with comprehensive field, action, workflow, exception and crosswalk CSVs and SHA-256 checksums.
- tests/unit.test.mjs and tests/browser-forms.mjs — deterministic tests and Chromium viewport/interaction audit.

## Run
From repo root serve a static HTTP server: python3 -m http.server 8769
Open http://127.0.0.1:8769/apps/opes-core-banking-forms/
Run node --test apps/opes-core-banking-forms/tests/unit.test.mjs
Run node apps/opes-core-banking-forms/scripts/export-all.mjs

## No production banking actions
The app collects ONLY fictional/synthetic data in memory. Nothing is transmitted to a bank API, localStorage, cookies or persisted system. Save draft and JSON export are local-only prototypes. NO submit, approval, ledger posting, cash posting, loan disbursement, regulatory filing, settlement, payment rail, PDF legal issue or regulated business operation is enabled. They remain explicitly disabled.

## Acceptance gates still outstanding
1. 589 planning forms need institution-specific product owner and regulator applicability verification.
2. Field specifications have been derived from 339 task subjects and MUST be reviewed for completeness, conditionality, limits, currencies, edge cases and effective regulations.
3. Exact mapping to the 726-screen PR #2 and 407-printable-template PR #3 remains **PENDING_ACCEPTED_MAPPING**.
4. OpenAPI/JSON schema contracts, tenant/RBAC and relationship/branch scoping, authoritative IDs, policy versioning, CAS, idempotency, atomic ledger/outbox, secure evidence, maker-checker and reconciliation require independent server implementation.
5. CEMAC/COBAC/BEAC live rail rules and issuer-specific approval remain unverified. Do not imply payment acceptance, settlement or legal finality.
6. Real source-data validation, data privacy/consent/retention, accessibility screen-reader/200%-zoom tests, complete French translation and UX acceptance remain incomplete.
7. Production business transactions accepted **0/589**.
8. Maintain isolation of the Banking Education Edition from real bank transactions and data.

The work is on a separate draft branch; existing main, PR #2 (screens), PR #3 (document specimens), and critical security/ledger work are unmodified.
