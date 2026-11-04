# OPES Core Banking — Tenant and Contract Foundation

**Classification:** executable synthetic security laboratory and reviewable foundational implementation. Not yet a banking production migration, regulatory approval, payment-rail authorization, or full system readiness.

## Why this work is permitted
OPESWARE develops, licenses and tests its banking software independently. No participating-bank agreement is needed to build this foundation. Sponsor has approved scope/ownership. The SQL covers only non-monetary institution, actor, policy and regulatory mapping metadata; no balances, live customer PII, settlement or accounting posting.

## Source and target architecture
- Recommended deployment: dedicated institution data plane/database and isolated cryptographic material per regulated institution. Academic edition: **separate** data plane/network/keys and synthetic data exclusively.
- This test-schema uses PostgreSQL 16 shared-table RLS as defense in depth. Its tenant GUC is **NOT** a trusted identity source: ordinary SQL sessions can set custom GUCs. The trusted gateway must derive institution context from a verified OIDC token, enforce object-level authorization, and never expose arbitrary SQL or the database login. Production shared-tenancy requires further role/key isolation and penetration tests.
- Composite primary keys and composite foreign keys prevent cross-institution attachment. DDL enforces allowed lifecycle values and distinct review identities, but does not yet implement complete authorization, quorum, consent, retention, cryptographic audit, or regulatory effective-date transitions.
- Avoid promotion into production until risk/DoR reviews have verified all controls. SQL default privileges, migration roles, KMS, backups and PostgreSQL tenant role isolation still require integration engineering.

## Hardened authenticated-login isolation added after the original lab
`002_authenticated_principal_binding.sql` replaces the mutable tenant GUC as the RLS trust source with a sealed mapping from PostgreSQL `SESSION_USER` to institution ID. A narrowly scoped SECURITY DEFINER lookup reads the mapping; application roles cannot modify it. Distinct bank-specific authenticated database logins cannot `SET ROLE` into another institution. A third unbound login sees no bank data.

GitHub Actions run [41858116656](https://github.com/exerateanalytical/opescorebanking/actions/runs/41858116656) **passed** the original SQL isolation suite, eight field-typed OpenAPI tests, database-role hardening, Bank A/Bank B impersonation attempts and unbound-login denial tests.

This is a synthetic bank-lab proof, NOT a complete production gateway. The remaining boundary is application OIDC issuer/JWKS/audience validation, token-to-bank routing and safe connection-pool credential management, including secret rotation and adversarial tests. Production must never use the CI passwords.

## Reproduce tests
The GitHub workflow spins up PostgreSQL 16 and runs:
```
psql -h 127.0.0.1 -U postgres -d opes_test -v ON_ERROR_STOP=1 -f engineering/foundation/tenant/000_test_role.sql
psql -h 127.0.0.1 -U postgres -d opes_test -v ON_ERROR_STOP=1 -f engineering/foundation/tenant/001_schema.sql
psql -h 127.0.0.1 -U postgres -d opes_test -v ON_ERROR_STOP=1 -f engineering/foundation/tenant/tests/isolation.sql
```
Tests reject absent tenant context, cross-tenant enumeration/insertion, cross-tenant policy owner FK, ambiguous 312 activation, and an academic tenant inside the production schema.

## Explicit implementation gaps
- Database client principal isolation beyond trusted GUC plus dedicated per-bank data plane.
- OIDC issuer/JWKS verification, token audience, effective time, tenant/subject roles and denial audits in an application gateway.
- Maker-checker service-level policy and cryptographic evidence; database CHECK does not prove actor authorization.
- PCEC account mapping authority, accounting ledger invariants and production posting isolated from this foundation.
- Full 25-domain precise API contracts and physical schemas; this folder is a **foundation slice**, not their substitute.

## Relevant standards and official sources
- BEAC payment-system overview: https://www.beac.int/systemes-paiement/presentation-generale/
- COBAC rules portal: https://www.beac.int/supervision-bancaire/reglements-de-cobac/
- OWASP API Security 2023: https://owasp.org/API-Security/
- COBAC I-2015/01: https://www.beac.int/wp-content/uploads/2016/10/instruction_cobac_i_2015_01_pcec.pdf
