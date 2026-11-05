# SEC-TENANT-ROUTING-001 — continuity and acceptance fence (2026-11-05 15:44 Africa/Douala)

Status: OPEN / evidence checkpoint only. No production work package accepted.

## Directly observed repository evidence
- GitHub main HEAD before this note: d17092a37fc2b7a1d074c2e5d024670b40def64b.
- Canonical state: governance/CANONICAL_PROGRAMME_STATE.json; next_exact_task_id SEC-TENANT-ROUTING-001; approved exhaustive leaf-WBS denominator UNKNOWN; latest integrity-verified batch 210, not 150.
- Latest review: governance/reviews/SEC-TENANT-ROUTING-001_2026-11-05_1443_BOUNDARY_RECONCILIATION.md.
- Existing detailed test plan: governance/reviews/SEC-TENANT-ROUTING-001_POSTCOMMIT_UNKNOWN_ACCEPTANCE_PLAN_2026-11-05.md. Its ten scenarios are explicitly NOT RUN; this checkpoint does not duplicate or mark them passed.
- Existing PostgreSQL lab CI results in canonical state are laboratory-only. They do not prove production OIDC-to-DB-principal binding, post-COMMIT UNKNOWN recovery, or independent accounting acceptance.

## Decision / fail-closed gate
Do not create a new numbered draft batch or claim a production implementation slice merely to fill a 30-slot run. The next dependency-correct engineering action remains implementing and executing the existing post-COMMIT/pre-HTTP-response fault-injection acceptance harness, including stable bank-scoped idempotency, fingerprint conflict, revocation serialization, outbox/inbox deduplication, real OIDC validation, and authoritative UNKNOWN resolution. Do not allow an HTTP timeout to imply rollback, a retry to create a second journal, or a delivery status to create money. The statutory COBAC 312/322 mapping stays quarantined under WP-ACC-005; third-party rail entitlement is a live-deployment concern, not a prerequisite for developing the banking product.

## Acceptance evidence required
Record the exact source commit, PostgreSQL version, migration and privilege DDL, real cryptographic token verification path, fault-injection location, executed test command and CI run, SQL journal/idempotency/outbox assertions, cross-bank negative evidence, and independent security/accounting review. Without these, DoR remains NOT VERIFIED.

## Run accounting
One existing registered work package (SEC-TENANT-ROUTING-001) reviewed; 0 verified-complete; 1 remains open with P0 production gate; 0 newly delivered ZIP batches; no executable tests run in this review. Historical approved denominator remains UNKNOWN. This note is a review increment, not a completed batch and requires no fabricated ZIP.

NEXT EXACT TASK: SEC-TENANT-ROUTING-001 — implement the reproducible PostgreSQL-backed crash-after-COMMIT-before-HTTP-ack test harness against bank-scoped identity, immutable journal/idempotency/outbox, execute it, and archive actual test evidence before reconsidering DoR.
