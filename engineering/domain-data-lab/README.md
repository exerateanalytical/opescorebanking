# OPES Core Banking — Four-domain relational constraints laboratory

**Synthetic PostgreSQL 16 laboratory, not production schema or posting service.**
Complements typed CIF/PRD/ACT/LED OpenAPI contracts under `engineering/contracts/`.

## Real database controls implemented and tested
- CIF party/identity lifecycle and KYC case with bank-tenant composite keys, real evidence references, review-separation constraints and actor membership foreign keys.
- PRD product and immutable-revision candidate rows, reviewed-by distinct from maker, proper currency and nonnegative amount constraints, effective-dated contract terms.
- ACT **account opening requests**, with composite institution+party+KYC+product-version references. This intentionally does not create live bank accounts or maintain balances.
- LED **journal proposals and lines**, with positive integer minor-unit amounts, unique line numbering and composite institution+account-request references. There is deliberately no POSTED state and no authority to create money.
- PostgreSQL FORCE RLS on all seven tables (two CIF, two PRD, one ACT, two LED). Trusted `SESSION_USER` bank binding from the existing tenant foundation, scoped foreign keys, SELECT/INSERT-only bank runtime rights, no UPDATE/DELETE.

## Explicit gaps before production
- Real customer identifier and regulated KYC data security (masking, retention, encryption, lawful basis and consent).
- Fully enforced KYC/SoD workflow and product approval transitions; current DDL is defensive data shape only.
- Bank account lifecycle, ledger-backed balance projections, account freeze/hold/closure, interest and fees, lending and treasury.
- Persistent immutable balanced journals (including crash atomicity), postings, reversals, independent reconciliation and source-of-funds attribution.
- Tenant-specific DB connections and router with OIDC/mTLS trust, periodic privilege audit, secrets and HSM.
- Authentic current COBAC account taxonomy for disputed 312/322 leaf mappings; core ledger-independent semantics may proceed.
- End-to-end performance, DR, operational and independent acceptance evidence. No 15/15 DoR completion claimed.

All fixtures in tests are synthetic. No real PII or payment network access.
