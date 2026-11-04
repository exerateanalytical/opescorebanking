# FOUNDATION-TENANT-CONTRACTS-001 — Executed verification evidence
Date: 2026-11-04
Scope: isolated non-monetary test foundation and contract validation.

## Verified GitHub Actions runs
1. Run https://github.com/exerateanalytical/opescorebanking/actions/runs/41857001213 — SUCCESS on commit 860fecdbb1d88c0dabc7590f87a2647d31ebe012. Eight Python unittest-based strict OpenAPI 3.1 contract cases PASSED; PostgreSQL 16 schema bootstrap and live synthetic tenant SQL tests PASSED.
2. Run https://github.com/exerateanalytical/opescorebanking/actions/runs/41858116656 — SUCCESS on commit 4975d2be0d2d88c4d21b26a54172a69a2c3dc0fe. Repeated eight contract tests, schema/bootstrap tests and checked authenticated bank login A/B/unbound SQL cases. All workflow steps SUCCESS.

## Exact verified controls
- Missing tenant context RLS denies reads.
- Tenant A/B rows not mutually visible; composite foreign keys reject cross-bank policy memberships.
- A direct cross-bank INSERT is denied.
- An ambiguous short-term COBAC `312` external mapping is rejected for ACTIVE state, while a DRAFT semantic mapping remains possible.
- A training-mode institution is rejected by the production banking-schema CHECK.
- Authenticated bank A and bank B login principals each see only their institution; a malicious `SET opes.institution_id` cannot grant the other bank's RLS scope after principal-binding migration.
- Unbound DB login has no bank row visibility.
- Eight Python OpenAPI schema checks validate operation authentication declarations, strict request object typing, idempotency requirements, invalid payload rejection.

## Not claimed
No real OIDC/JWKS token validation, live bank gateway, issuer authentication, sealed external HSM, regulator compliance approval, deposit ledger, real money or authorized rail integration tested. Not 15/15 production Definition-of-Ready.

**Next exact task:** OIDC/JWKS and subject authorization linked to the authenticated DB bank principal and per-institution connection pools, using synthetic test subjects and negative routing tests.
