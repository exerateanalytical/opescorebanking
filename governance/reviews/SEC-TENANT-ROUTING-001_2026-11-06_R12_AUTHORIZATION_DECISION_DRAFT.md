# SEC-TENANT-ROUTING-001 — R12 authorization and replay decision record (DRAFT)
Date: 2026-11-06 (Africa/Douala). Baseline main: 1e6980af5383725c6dff071d4a00a2e512b1823e.
Status: OPEN / P0. This is a source-grounded design decision proposal, NOT executed testing, DoR acceptance, or production implementation.

## Scope and evidence
Inspected `engineering/labs/security-ledger/006_idempotency_recovery_experimental.sql` on main. `sec_idemp_006.post` locks member FOR UPDATE and denies non-ACTIVE membership/revision before retrieving any prior operation. It then validates each account ACTIVE before resolving idempotency conflict. Unique(operation_type,idempotency_key) omits bank_id. No durable UNKNOWN registry exists. These are source observations, not PostgreSQL test outcomes.

## Proposed fail-closed R12 policy (pending independent approval)
A revoked or revision-mismatched originator cannot use the ordinary posting endpoint to retrieve a prior journal. A separately authenticated, bank-scoped recovery actor may request *read-only* outcome resolution with explicit RECOVER_OPERATION permission, current membership, case reference, dual control for sensitive disclosure, and append-only audit. Recovery must never create a new posting, bypass tenant authorization, reveal another bank's operation, or imply external settlement. A still-authorized originator with current revision may retrieve an already committed matching operation even when the referenced account has since CLOSED, but must never create a new posting against a closed account. No stale membership revision is accepted as current authorization.

## Operation registry requirements
Registry key: (bank_id, operation_type, idempotency_key), unique and scoped by authenticated bank context, not caller-controlled JSON. Store immutable economic digest, owner identity, operation state, journal reference if committed, request correlation, creation/commit timestamps and audit references. States must distinguish RESERVED/IN_PROGRESS, COMMITTED, DEFINITIVELY_REJECTED_BEFORE_POSTING and UNKNOWN; avoid converting UNKNOWN to failure on timeout. A journal reference is returned only after verifying immutable digest, bank and permitted disclosure scope. No digest or reference is disclosed on mismatch. Canonical digest computation validates typed economic values and account identifiers but does not require accounts ACTIVE; new posting performs fresh account and period checks after registry fencing.

## Concurrency and authorization gate
Document a single lock order across bank membership, registry row, journal and accounts; establish how concurrent membership revocation, account closure, retry and crash interact. The authoritative tenant context must be bound to an authenticated principal at the database boundary, and application roles must not directly INSERT/UPDATE ledger or registry tables. The existing SESSION_USER fixture is insufficient proof of OIDC-to-DB identity. Database constraints must enforce bank-scoped foreign keys on accounts, journal, lines and registry.

## Executable acceptance cases to prepare (none executed)
R12-A: revoked originator replay => denied, no journal disclosure, no new posting.
R12-B: current recovery principal + valid scope + matching digest => read-only committed reference, exactly one journal/outbox.
R12-C: recovery principal wrong bank => indistinguishable denial, zero disclosure.
R12-D: authorized originator, committed operation, account now CLOSED => original reference, no new posting.
R12-E: fresh key, CLOSED account => rejected before posting.
R12-F: key reused with changed amount/account/line order => conflict, no original reference leaked.
R12-G: concurrent revocation and recovery => deterministic permitted/denied outcome under documented lock ordering.
R12-H: ambiguous database timeout => UNKNOWN until authoritative resolution, no blind repost.
R12-I: crash after commit before response => exactly one journal, exactly one durable outbox record.
R12-J: forged bank_id or direct table write => rejected by DB privileges and constraints.
Each case needs reproducible SQL, independent sessions where applicable, expected SQLSTATE, row-count assertions, PostgreSQL 16 version, captured logs, and independent reviewer signature.

## Other quality observations
The fixture's `(item->>'account_id')::uuid` cast can raise a database parsing exception on malformed input; specify a controlled validation error and no partial writes. Its line numbering via `count(*)+1` per line is not a production posting strategy. Both are lower-priority than bank isolation and replay correctness.

## Programme gates
GOV-WBS-RECON-001 accepted denominator UNKNOWN; GOV-REC-001 historical reconciliation OPEN; WP-ACC-005 COBAC 312/322 P0 OPEN. DoR 3, 6, 8, 9, 11, 13, 14 and 15 are not demonstrated for this slice. No production code, executed banking test, certification or ZIP checkpoint is claimed.

Run accounting: one continued work package attempted; zero verified-complete; one remains OPEN/P0; zero new numbered batches; zero executed tests. This review artifact is not a completed batch and is not ZIP-delivered.

NEXT EXACT TASK: SEC-TENANT-ROUTING-001 — implement the bank-scoped disposable PostgreSQL 16 R12-A through R12-J harness and execute it with concurrent sessions, crash/timeout evidence and independent review before any DoR acceptance.
