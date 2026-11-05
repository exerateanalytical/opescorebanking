# SEC-TENANT-ROUTING-001 — source-grounded recovery gap register (2026-11-05 21:42 Africa/Douala)

Status: OPEN; non-production review. Base remote main e134252c8772ee9c61815b3ee498da5bc7ce3406. Source inspected: engineering/labs/security-ledger/006_idempotency_recovery_experimental.sql and prior R01–R12 acceptance gate. This review does not replace LAB-006/007.

## Verified source-level observations
1. The function sec_idemp_006.post validates account ACTIVE state inside the JSON line loop **before** INSERT ... ON CONFLICT and prior-operation retrieval. Hence an authorized replay after account closure cannot return its committed journal. This is an observed code-path defect, not an executed test result.
2. The operation uniqueness constraint is (operation_type,idempotency_key), with no bank_id. The member and account tables likewise have no bank_id; this fixture cannot establish bank-local idempotency or isolation.
3. Authorization uses SESSION_USER and member revision/state; there is no trusted gateway-to-DB cryptographic principal binding. Current membership revocation is intentionally fail-closed; replay recovery must not bypass it.
4. The economic digest is built from line order, currency and account IDs, but account lookup is coupled to account availability. Canonical digest calculation must not require ACTIVE state. Keep strict account identity and exact integer validation.
5. operation, lines and outbox are written within the caller transaction; a real crash/retry test must prove atomicity and concurrent behavior. This source inspection does not prove crash recovery, outbox delivery deduplication, or external settlement.
6. No explicit independent journal table, bank-local operation registry, authenticated recovery permission, or durable UNKNOWN state exists in LAB-006. Its stated disposable-only scope remains binding.

## Dependency-safe experiment design
Copy the fixture into a NEW isolated PostgreSQL 16 database/schema. Introduce bank-scoped member, account and operation keys and an explicit operation outcome registry. Separate a verified current-authority result-retrieval path from new-posting validation. Compute the canonical economic digest without requiring accounts to be ACTIVE; for a previously committed matching operation, return its immutable journal reference only after tenant/owner/scope authorization. For a missing operation, perform first-writer fencing and ACTIVE account/period checks inside a single atomic transaction. Preserve UNKNOWN when DB outcome is uncertain; never speculative repost. Enforce distinct audited recovery permission for revoked-originator cases. Require independent outbox and journal counts in R01–R12.

## Additional review gates before experiment acceptance
- Document lock ordering across membership, operation key and accounts, including concurrent revoke/close; prove no deadlock or privilege bypass.
- Explicitly define whether prior membership revision may be used for replay (R12); default deny absent current authorization.
- Verify database privileges prevent untrusted direct table writes or forged bank identifiers.
- Prove key reuse with changed economic digest does not leak original journal ID.
- Ensure previous commit retrieval cannot be mistaken for rail settlement finality.
- Capture executable SQLSTATE, PostgreSQL version, CI commit SHA, interleaving traces and independent reviewer signoff.

## Unresolved programme blockers
P0: SEC-TENANT-ROUTING-001 committed replay/tenant authority; WP-ACC-005 COBAC 312/322 interpretation. GOV-REC-001 provenance reconciliation and GOV-WBS-RECON-001 accepted denominator remain OPEN. No production DoR or regulatory compliance claim.

## Run accounting
One registered work package attempted (continued SEC-TENANT-ROUTING-001), zero accepted complete, one OPEN/P0; zero new numbered ZIP checkpoints, zero executable tests run, zero production implementation. This is a review artifact only, not a completed batch. Binary ZIP delivery and acceptance remain pending.

NEXT EXACT TASK: SEC-TENANT-ROUTING-001 — create isolated PostgreSQL 16 bank-scoped operation-registry experimental harness, execute R01–R12 with concurrency/crash traces, and adjudicate R12 before any production DoR claim.
