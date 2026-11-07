# Java 25 production-framework migration — 25 domain review commands

- Origin: PR #11 typed 25-domain Stage 3 contracts, independent candidate runtime. All 25 OpenAPI specs and domain catalog are carried by exact Git blobs into Spring Boot 4.1.2 production application resources.
- Java 25 `DomainController`, `DomainCatalog`, `DomainService` replace Node.js candidate dispatch for **review-only workflows**: 25 create, 25 submit, 25 review, 25 read.
- PostgreSQL `V4__typed_review_case_25_domains.sql` creates 25 domain-specific typed tables plus bank-scoped review cases, permissions, idempotency, audit and internal-only outbox. The same bank PostgreSQL login and independently verified OIDC principal required by the ledger vertical slice apply.
- Maker, independent checker, version CAS, read authority, bank isolation, and durable atomic audit/outbox are enforced within the same database transaction.
- `REVIEWED_NOT_EFFECTIVE` is not an account activation, ledger posting, loan disbursement, rail settlement, card issuance, AML filing, product publication or regulated state. NO financial/official effect has been implemented in this migration.
- The 726 screens, 726 forms, 407 documents and 378 reports are separate candidate/front-end bundles and require source-preserving React/TypeScript integration, server-side entitlements and authoritative data adapters before live use.
- The V4 migration has no test bank data or test credentials. Any fixture rows in CI are synthetic and never seeded by the app.
- **P0:** direct SQL function is SECURITY DEFINER and receives issuer/subject from app; unauthorised DB clients could impersonate actors if bank runtime login stolen. Production deployment requires per-request signed principal binding or a trusted restricted command gateway beyond the current login-based model; real ledger and 25 domain release gates remain blocked.
