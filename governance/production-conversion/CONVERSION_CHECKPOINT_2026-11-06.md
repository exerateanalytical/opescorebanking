# OPES Core Banking — production-language conversion master checkpoint
**Checkpoint date:** 2026-11-06  
**Production backend:** Java 25 LTS + Spring Boot 4.1.2 + PostgreSQL 16+  
**Production web:** React 19 + TypeScript 7 + Vite 8  
**Status:** Source conversion partially complete, real-money and legal/regulatory release acceptance BLOCKED.

## Independently verified, committed

| Source work | Original | Migrated target | What is working | What remains |
|---|---|---|---|---|
| Ledger service | prior SQL/Python labs | Java 25, Spring Boot, PostgreSQL | One independently-authorized committed journal, double-entry balance check, idempotency, read-only outcome, audit and outbox | Production OIDC+DB principal cryptographic attestation, failover, reversal, reconciliation, formal accounting and regulatory review |
| Stage 3 APIs | PR #11 Node.js candidate services | 25 contracts, Java domain controller/service/catalog, PostgreSQL 25 typed tables | 25 groups, 75 verified create/submit/checker commands, 25 reads; maker-checker and RLS fail-closed | Full accounting, credit, payments, cards, treasury, regulatory and customer services; no external effects |
| Screens | PR #2 / 726 routes | React/TypeScript 726 routes + 726 full blueprints | Read-only metadata, per-screen proposed fields and accessible navigation | Staff authentication, real data retrieval, complex screens, action handlers, accessibility/visual QA |
| Forms | PR #5 / 726 variants | 726 full form schemas and validation rules in TS JSON manifest | Read-only per-form preview, required/conditional rule metadata | Server validation, controlled submissions, saved form data, maker-checker, receipt/consent |
| Documents | PR #3 / 407 specimens | 407 full template field/layout contracts in TS build | Proposed fields/specifications visible | Verified issuance, approved language and template variants, cryptographic signing/QR, controlled print/PDF |
| Reports | PR #6 to #10 / 378 prototypes | 378 detailed report filters/metrics/lineage source contracts in TS build | Read-only definition, filters, source evidence requirements | Source-connectors, verified calculations and aggregation, reconciled financial/regulatory reporting, reviewer publication gates |

Both new application tracks have passed CI on GitHub at the checkpoint:
- **<https://github.com/exerateanalytical/opescorebanking/actions/runs/42306434437>** — Java 25 compilation and 7 tests; real PG16 review and ledger security/invariant regression.
- **<https://github.com/exerateanalytical/opescorebanking/actions/runs/42306434472>** — React/TypeScript manifest generation, typecheck, registry tests and Vite bundle.

### Rules for continued production engineering

1. Work from **draft PR #13**, stacked on **draft PR #12**; do not merge the old candidate runtimes wholesale. Current feature head at checkpoint: `2bf8da895b7384a7f9cd4a4b1de90825f0cc6782`.
2. Java 25/Spring Boot for all authoritative back-end operations. PostgreSQL transactions must implement bank-specific authenticated principals, server-side entitlement checks, maker/checker, immmutable audit, idempotent outcome recovery and outbox.
3. React/TypeScript for browser/web; compile historical JS prototype definitions into inert JSON at build time only. Never use generated spec controls to imply actual bank state.
4. Never replace tested, signed-off interfaces with generic CRUD placeholders. Real product-specific workflows and legal templates require domain-by-domain validation.
5. Treat maker/checker **review** state `REVIEWED_NOT_EFFECTIVE` as review only. Conversion counts do not mean production business acceptance.
6. Continue implementation from financial account + ledger + payment and CIF authority dependencies, then deliver authenticated BFF and client controls, source-backed documents/reports. Review actual latest main and PR stack first.

### P0 release limitations
Existing bank database RPCs still receive the issuer/subject from the trusted backend and do **not** independently verify a per-request actor attestation if the runtime DB credentials are compromised. This is a **must-fix** before real banking. Product factory, account opening, AML determination, credit drawdown, live clearing, regulatory submissions, field issuance and payroll remain outside current production-accepted scope. The original training/demo fixtures remain confined to CI or legacy draft branches; they are not seeded into the Java application.

**Conclusion:** The technology baseline and significant source migration are established. No credible evidence supports saying “all banking software is complete” or “everything is 100% converted and live.”
