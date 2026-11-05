# SEC-TENANT-ROUTING-001 — LAB-007 execution blocker and source review
Date: 2026-11-05
Status: IN_PROGRESS / P0 FAIL-CLOSED
Scope: disposable PostgreSQL 16 idempotency laboratory only. Not production implementation or regulator acceptance.

## Verified inputs
- engineering/labs/security-ledger/006_idempotency_recovery_experimental.sql (previously delivered)
- engineering/labs/security-ledger/007_idempotency_recovery_acceptance.sql
- engineering/labs/security-ledger/007_idempotency_recovery_assertions_runner.sql
- Prior source audit and post-COMMIT acceptance contract remain controlling.

## Finding and correction
The setup file contained literal backslash-n sequences in SQL comments, causing the intended GRANT statement to remain part of a line comment. The source has now been corrected to real newline separators. The grant is deliberately broad and must be confined to a disposable laboratory; never reuse for production. Remote file content was fetched again after commit.

## Execution evidence
No PostgreSQL 16 server, psql client or Docker binary was found in the current execution container. Accordingly, **zero PostgreSQL assertions were run**, and neither A01/A02 nor C4 is accepted. This review is a source-level assessment, not a database execution report.

## Additional source risks requiring verification
1. LAB-006 uses SESSION_USER and member.db_principal, not signed OIDC claims; no production identity assurance is established.
2. Idempotency uniqueness is global to the synthetic operation type, not bank-scoped; tenant isolation remains unproven.
3. The runner is rollback-only; committed retry, separate connections, race ordering and C4 response-loss recovery are not covered.
4. No immutable journal enforcement, authoritative per-currency reconciliation, or independent outbox consumer deduplication is demonstrated.
5. The role setup uses a passwordless LOGIN; execution requires a disposable trusted local authentication arrangement, not a production configuration.
6. SQL assertion failures must be captured with ON_ERROR_STOP and process exit status, not inferred from notices.
7. A concurrent replay must be exercised across distinct database connections and independently check exactly one committed operation, journal and outbox record.

## Required next evidence
Provision isolated PostgreSQL 16 with pgcrypto, create a fresh disposable database, run LAB-006 and LAB-007 setup, connect as lab006_runner, execute rollback-only assertions, then implement and execute committed replay and C4 crash cases. Record exact PostgreSQL version, commands, exit codes, timestamps, stdout/stderr, database counts, source hashes and environment identity. Review all results before advancing the parent work package.

## Programme accounting
Registered WP attempted: 1 (SEC-TENANT-ROUTING-001). Accepted WPs: 0. Parent WP open: 1. Existing P0 unresolved: 1. Newly blocked WPs: 0. Approved programme denominator: UNKNOWN. No archive created or delivered in this increment; connector text-file delivery alone is not compliant ZIP checkpoint delivery. Historical GOV-REC-001 and WP-ACC-005 remain open.
NEXT EXACT TASK: Run LAB-006 and LAB-007 against disposable PostgreSQL 16 and capture executable assertion evidence; then implement committed separate-connection retry and deterministic C4 crash test.
