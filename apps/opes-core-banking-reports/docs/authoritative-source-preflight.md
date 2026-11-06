# Reporting Studio — authoritative source preflight increment

**Scope:** server-side source metadata preflight only; not live reporting, not a regulator filing, not a production launch.

## Code
- `src/report-source-preflight.js`: authenticated, bank/branch-scoped, read-only source gate.
- `tests/report-source-preflight.test.mjs`: negative tenant, authorization, ledger-reconciliation, provenance, audit and HTTP-boundary tests.
- Exposes a Node `http` request handler for `GET /api/v1/reports/{reportId}/source-readiness?period=YYYY-MM&currency=XAF`.
- HTTP requests never accept an institution, role, or principal from query parameters. The injected trusted authenticator must validate OIDC issuer/audience/signature/expiry; the trusted authorizer must establish entitlement and branch scope.
- The snapshot reader is a **future adapter contract**, not a wired ledger. A trusted verifier must independently confirm source signature, digest, approved mapping, lineage and bank scope. Passing untrusted snapshot booleans alone is insufficient.
- A durable audit writer is mandatory. An audit failure blocks the request. No bank rows, balances, identity tokens or customer PII are returned by this endpoint.

## Production safety
- No live data provider, trusted OIDC principal implementation, source signing verifier, regulatory legal mapping, or production audit sink is shipped in this increment.
- Even with fully mocked successful providers the result is `BLOCKED`, HTTP 503, and no official CSV/PDF/regulator submission or calculation is possible.
- Existing synthetic-only UI and exporters are unchanged. Keep PR #6 draft. This increment stacks above PR #6, which depends on draft PR #5 and PR #2.
- P0 tenant RLS, immutable ledger validation, committed replay idempotency, reconciliation evidence and regulator-specific mapping must be separately accepted before any release.

## Tests
`node --test apps/opes-core-banking-reports/tests/*.test.mjs`

## Remaining integration backlog
1. Deploy real server-side OIDC authentication and bank/branch entitlement adapters.
2. Implement ledger, deposit, payments, credit and treasury **read-only** source adapters with immutable as-of revisions.
3. Prove signed snapshot integrity, mapped PCEC source fields and ledger reconciliation per currency.
4. Implement report-specific authoritative calculations and independent golden-data comparisons; do not reuse synthetic formulas as certified accounting rules.
5. Complete maker-checker, publication authorization, retention, audit log, privacy and regulatory review before enabling official results.
