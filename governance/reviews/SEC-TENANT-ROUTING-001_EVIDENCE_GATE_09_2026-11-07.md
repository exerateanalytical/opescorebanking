# SEC-TENANT-ROUTING-001 — Evidence gate 09 (2026-11-07)

Status: IN_PROGRESS; P0-SEC-01 and P0-SEC-02 OPEN. This is a source-level review, not an executable test or production acceptance.

## Canonical starting point

Read current main at `516254463f8cb13326223428ae1e31f4f8fee88b` (not presumed immutable on future runs): `README.md`, `governance/consolidation/UNIFIED_SOURCE_INVENTORY.json`, `governance/consolidation/REMAINING_WORK.md`, `governance/CANONICAL_PROGRAMME_STATE.json`, and review 08. No open PR was returned by GitHub search at review time. Do not replay closed PRs #2–14 or deploy archived Node/JS sources.

## New source-level finding: CI boundary gap

The consolidated `.github/workflows/opes-core-production-ledger.yml` defines PostgreSQL 16 CI steps using static fixture-created `opes_prodtest_a`, `opes_prodtest_b` and unbound database logins; SQL scripts verify posting, cross-bank denial and revocation. These are useful *database-principal* checks, **not** proof of a production gateway verifying an external OIDC token, binding its subject to bank-local membership, selecting a workload-authenticated database principal, and preserving command identity across a killed HTTP response.

The workflow's `mvn clean verify` and psql steps alone cannot establish T01/T02/T06 real-boundary acceptance. A CI definition is not proof that this branch's checks ran or passed. Current main also exposes six signed control-record modules; none is a deployed revocation fanout or bank-local credential broker.

## Minimal dependency-correct acceptance implementation plan

1. **T01 — signed identity:** select the existing production Java security entry point, reject unsigned/wrong-audience/wrong-issuer/expired/revoked tokens, bind `iss+sub` to durable bank-local membership, and deny tenant-header overrides. Use a test OIDC issuer with pinned key material; never embed production secrets.
2. **T02 — bank principal:** route through one explicit bank-authority broker with authenticated workload identity; bind each checked-out PostgreSQL session to its approved bank principal. Test same-bank allowed, bank-B denied, unbound denied, stale membership denied and pool reuse after rotation. Reject client-supplied database principal/GUC selectors.
3. **T06 — commit/reply crash:** issue one immutable bank-scoped command ID/digest through the actual HTTP-to-DB boundary, durably commit balanced journal+registry+outbox in one transaction, terminate the request process before the HTTP response, then replay the *same* command. Assert one journal, one registry outcome and one logical outbox event, not just matching HTTP status. Reject changed digest under same command ID.
4. **Evidence:** capture exact source paths, immutable commit, Java/PG16 environment versions, commands, CI run URL/conclusion, injected failure position, negative-test assertions and database row evidence. Redact all secrets and customer data.

## Explicit exclusions and release gates

No statutory 312/322 mapping, real-money settlement, external rail connection, regulator approval or production readiness is inferred. Keep `WP-ACC-005` quarantined. Historical batch ZIPs remain untouched. Source inventories (726 screens/forms, 407 documents, 378 reports, 25 typed review domains) are **not** operational acceptance counts. This review changes no accepted-work-package denominator.

## Review disposition

One registered work package, `SEC-TENANT-ROUTING-001`, remains OPEN. No new test was executed; no production code was changed; no completed checkpoint ZIP is warranted. Independent acceptance: NONE. P0-SEC-01/P0-SEC-02: OPEN.

**NEXT EXACT TASK:** inspect the Java production security controller/filter, database connection acquisition, ledger command endpoint, and existing integration tests at the latest main HEAD; implement the smallest T01/T02/T06 real-boundary harness in `services/opes-core-api` with PostgreSQL 16 and capture CI evidence before advancing the work package.
