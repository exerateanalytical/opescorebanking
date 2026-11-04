# OPES Core Banking — Canonical engineering programme v0.5
Date: 2026-11-04. Programme sponsor: OPESWARE TECHNOLOGIES. **Scope and ownership approved by sponsor.**
Supersedes v0.4 for current engineering execution; previous recovery documents remain historically intact.

## Vendor autonomy
OPESWARE independently develops, tests, sells and licenses its banking application. Participating-bank agreements are NOT required to write software. Access/credentials for actual live payment rails attach to a deployment by an eligible authorized operator, not vendor product development. A bank CFO's signature is not a blanket code-development gate. Competent financial accounting integrity review and executable tests are essential before real money use.

## Approved scope map
See governance/OWNER_APPROVED_DOMAIN_OWNERSHIP_REGISTER_2026-11-04.json for 25 domains, owners, dependencies and sponsor approval. Historical 150 WP folders are source evidence, not 150 completed software packages or a guaranteed exhaustive leaf-level denominator.

## Official COBAC primary-source fallback rule
COBAC I-2015/01 Article 7(d) prints 312 medium-term sensitive loan; Article 8(b) prints 322 short-term sensitive loan; Article 8(d) prints 312 short-term parent but subdivisions 3220–3227 (official BEAC scan).
Use neutral internal ledger identifiers, immutable balanced journals and versioned external taxonomy mappings based on industry standards. Quarantine only the disputed statutory mapping's activation/reporting until justified; do not block unrelated engine coding. Do not claim industry standards resolve printed law.
Source: https://www.beac.int/wp-content/uploads/2016/10/instruction_cobac_i_2015_01_pcec.pdf

## Executed first software-foundation slice
Commit 860fecdbb1d88c0dabc7590f87a2647d31ebe012 introduced non-monetary PostgreSQL institution tables, strict composite tenancy keys, force-enabled RLS, mapping constraints, typed OpenAPI 3.1 endpoints and tests. GitHub Actions 41857001213 **PASSED** eight Python contract tests and PostgreSQL-backed tenant-isolation/security SQL checks. This is a synthetic laboratory, NOT an approved production release.

## Remaining material engineering gaps
1. Trusted OIDC token-to-institution authorization and bank-specific database credentials; a mutable PostgreSQL custom GUC is NOT independent proof of a bank's identity.
2. Complete precision-typed domain-specific contracts for 25 domain groups; older payload objects are generic drafts, not accepted interfaces.
3. Domain-specific validated physical models, RLS, composite FKs, immutability, money constraints, audit and retention; 25 older SQL draft models are not approved migrations.
4. Verified ledger journal invariants, reverse/reconcile, idempotency, maker-checker enforcement and code-level tests.
5. Bank-specific rails only at live deployment; payment adapters and ISO 20022 simulators may be developed now.
6. Full 15-criterion production DoR for each actual production-bound vertical slice.
7. Historical source custody and independent evidence audit remain open but do NOT delay isolated software development.

**NEXT EXACT TASK: FOUNDATION-TENANT-CONTRACTS-001 — enforce and test trusted token identity-to-bank-database principal binding; then execute concrete CIF/PRD/ACT/LED contracts and financial-integrity laboratory.**
