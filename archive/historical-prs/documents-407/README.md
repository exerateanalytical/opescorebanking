# OPES Core Banking — 407 Printable Document Specimens v0.1

Scope: 407 individually named designs across 25 planned document families. THESE ARE NOT LEGALLY APPROVED OR PRODUCTION-ISSUED BANK DOCUMENTS.

## Modules
- Registry: src/registry-seeds.js, exact 407 named types.
- Structured specifications: src/templates.js, proposed fields, layout and regulatory gates.
- Pure HTML renderer: src/render.js, specimen-only and HTML-escaped.
- Print CSS: src/print-css.js, A4/A4 landscape/A5 family designs.
- Browser studio: index.html and src/app.js, searchable 407-template gallery.
- Exporter: scripts/export-all.mjs, creates 407 HTML, 407 JSON files, manifest and SHA-256.
- Unit tests: tests/documents.test.mjs.

## Usage
Serve the repository root with Python HTTP server and open /apps/opes-core-banking-documents/.
To export, run node apps/opes-core-banking-documents/scripts/export-all.mjs.
To test, run node --test apps/opes-core-banking-documents/tests/*.test.mjs.

## Non-negotiable restrictions
- All previews bear SPECIMEN / NOT VALID; no trusted issuance.
- No bank-backed customer data, transactions, ledger statement amounts, signatures or QR verification.
- No regulator-approved loan terms, TEG, payroll statutory calculations or prudential returns.
- CEMAC consumer protection and pricing, COBAC/PCEC sector-specific accounting, Cameroon labour/payroll require verification.
- Credit agreements contain explicit legal placeholders, not enforceable clauses.
- English specimens only. French legal translation is not completed.
- All outputs are NOT_ACCEPTED and must remain blocked for customer distribution until legal/technical/security verification.

## Per-template definition of done: NOT MET
Effective regulatory and institutional legal clauses; complete domain fields and conditional rules; authorization and signature provenance; English/French approved wording; ledger and policy calculation integrity; accessible print and pagination; audit trail; tamper-proof verification; retention; regulator approval where required; negative/security/tenant isolation tests; final acceptance.

This is a separate branch from the 726-screen draft PR #2 and does not overwrite newer banking work on main.
