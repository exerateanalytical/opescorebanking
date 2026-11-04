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

## Additional executed security hardening
Commit `4975d2be0d2d88c4d21b26a54172a69a2c3dc0fe` added PostgreSQL authenticated SESSION_USER-to-institution bindings and tests for bank A, bank B, and unbound bank principals. The service/database principal cannot gain another bank's data by modifying the mutable custom tenant GUC. GitHub Actions [41858116656](https://github.com/exerateanalytical/opescorebanking/actions/runs/41858116656) passed. Gateway OIDC security and credential routing are **still open**.

## Remaining material engineering gaps
1. Trusted OIDC token-to-institution authorization and bank-specific database credentials; a mutable PostgreSQL custom GUC is NOT independent proof of a bank's identity.
2. Complete precision-typed domain-specific contracts for 25 domain groups; older payload objects are generic drafts, not accepted interfaces.
3. Domain-specific validated physical models, RLS, composite FKs, immutability, money constraints, audit and retention; 25 older SQL draft models are not approved migrations.
4. Verified ledger journal invariants, reverse/reconcile, idempotency, maker-checker enforcement and code-level tests.
5. Bank-specific rails only at live deployment; payment adapters and ISO 20022 simulators may be developed now.
6. Full 15-criterion production DoR for each actual production-bound vertical slice.
7. Historical source custody and independent evidence audit remain open but do NOT delay isolated software development.

**NEXT EXACT TASK: FOUNDATION-TENANT-CONTRACTS-001 — enforce and test trusted token identity-to-bank-database principal binding; then execute concrete CIF/PRD/ACT/LED contracts and financial-integrity laboratory.**


## Verified engineering execution update — 2026-11-04
Source checkpoint: `programme/checkpoints/2026-11-04/ENG-REMEDIATION-001/`. A 52,168-byte ZIP containing source and manifests was fetched from GitHub main and independently rehashed. SHA-256: `871b663f54176e61a6a2631ed41528b17a150068fa4ca39e9d8e44a36caa3ff0`. Remote commit: `23a558f17e93371ca326c402a2fe9d77432463f4`.

**Engineering work packages attempted this run: 8. Independently accepted as production complete: 0. Kept open: 8. Newly blocked: 0.** These are work-package engineering sub-slices mapped to sponsor-approved SEC, CIF, PRD, ACT, LED and DAT domains; they are not a new accepted overall WBS denominator.

Executed CI evidence:
- [41909907072](https://github.com/exerateanalytical/opescorebanking/actions/runs/41909907072) — 7 passed PostgreSQL-backed concurrency/T43/T47 tests.
- [41910375468](https://github.com/exerateanalytical/opescorebanking/actions/runs/41910375468) — 10 passed exact-field CIF/PRD/ACT/LED OpenAPI contract tests.
- [41910690348](https://github.com/exerateanalytical/opescorebanking/actions/runs/41910690348) — 13 passed synthetic immutable double-entry/compensating journal tests.
- [41911013397](https://github.com/exerateanalytical/opescorebanking/actions/runs/41911013397) — 20 passed cryptographically signed, pinned-JWKS tenant routing and token denial tests.
- [41911537994](https://github.com/exerateanalytical/opescorebanking/actions/runs/41911537994) — PostgreSQL 16 live SQL integration PASS for seven bank-scoped CIF/PRD/ACT/LED tables and cross-bank negative tests.

**50 Python tests + PostgreSQL integration checks passed.** Two initial contract/SQL validation runs failed and were corrected, then rerun successfully; only successful final runs are counted as passed. No end-to-end production bank transactions were tested.

Engineering truth: typed and CI-validated contract **drafts** exist for 4 of 25 domain groups; 21 still require independent field-specific contract design. Seven hardened PostgreSQL tables cover four domain **laboratory** scopes; the original 25 generic SQL domain drafts remain unapproved. The in-memory ledger tests prove no production persistence or crash recovery. Bank-local authority fencing passed within one PostgreSQL transactional test boundary; global/distributed revocation ordering, durable real-money posting, ledger/outbox atomicity, HSM/mTLS credential custody and regulated release remain unverified.

ADR-OPES-003 selects bank-local financial command authorization for further engineering without declaring the P0 production barrier closed. The owner-approved vendor autonomy, 312/322 statutory mapping quarantine, and the 15 production DoR criteria remain in force.

**NEXT EXACT TASK — SEC-TENANT-ROUTING-001:** Integrate signed token membership with authenticated bank PostgreSQL principals and durable journal/outbox atomic execution fence; run crash/revocation race and unknown outcome tests; then continue 21 remaining domain contract/schema groups. Do not invent production readiness.
