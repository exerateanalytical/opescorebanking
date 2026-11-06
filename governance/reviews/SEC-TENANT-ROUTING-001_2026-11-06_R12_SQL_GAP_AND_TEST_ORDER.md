# SEC-TENANT-ROUTING-001 — R12 source-to-test gap and execution ordering
Date: 2026-11-06. Baseline inspected: main f7a5f1336478184f63e3f029aa5ef2910831b3e8.
Status: OPEN / P0. Engineering review only; not a completed checkpoint, executed test, production migration, or regulatory certification.

## Source observations (verified by reading LAB-006)
Source: `engineering/labs/security-ledger/006_idempotency_recovery_experimental.sql`.
1. `member`, `account`, `operation`, `line`, `outbox` lack `bank_id`; `UNIQUE(operation_type,idempotency_key)` is global. Consequently a multi-bank uniqueness/isolation guarantee is NOT established.
2. `post` locks `member FOR UPDATE`, checks `SESSION_USER` and current revision, then checks every account ACTIVE before looking up an existing idempotency key. Revoked replay and replay after account closure cannot recover an earlier result via this endpoint.
3. `operation` has no UNKNOWN state, committed timestamp, authoritative result lookup, or recovery permission model. A timeout cannot safely be treated as failure or retried with a new key.
4. `account_id` is cast from JSON text to UUID without an explicit controlled parsing path; malformed UUID can raise an unclassified SQL error.
5. Ledger/outbox inserts share one transaction in this fixture, but there is no independent crash/restart proof or bank-scoped foreign key enforcement. `SESSION_USER` is not proof of an authenticated token-to-bank credential chain.
6. The function is SECURITY INVOKER and the file warns against GRANT to application logins. No direct-write-denial proof or privilege inventory is supplied by this fixture.

## Required design decisions before executable R12 acceptance
- Separate `POST_NEW` from `RESOLVE_OUTCOME` operations. Outcome resolution is read-only, requires a current authorized principal, bank-scoped membership and purpose-bound recovery permission, and never re-posts.
- Derive tenant scope from trusted server/database principal mapping; reject caller-supplied bank identifiers as authority. Every registry, journal, account, line and outbox FK must enforce tenant scope.
- Lock order proposal for review: membership authority row -> bank-scoped operation registry row -> account rows in stable account UUID order -> journal/lines/outbox. Resolve lock inversion against any existing close/revoke flow before implementing. The proposal is NOT a proven deadlock-free order.
- Record `UNKNOWN` as an epistemic outcome when commit acknowledgment is absent. Do not infer failure from network timeout. Reconcile from the authoritative registry/journal and external rails independently.
- A matching prior committed operation can be disclosed only after checking tenant, current authorization, original economic digest and disclosure policy; do not require the historical account still be ACTIVE. A fresh post must require current account eligibility.
- Registry uniqueness: `(bank_id,operation_type,idempotency_key)`; store canonical digest version, owner, state, immutable journal reference if committed, correlation and audit evidence. Define key-retention and archival policy before release.

## Execution-ready acceptance specification (NOT EXECUTED)
R12-A: revoked originator, matching prior key => permission denied; journal and digest not disclosed; row counts unchanged.
R12-B: current bank recovery actor with explicit permission, matching digest => read-only committed reference; operation/journal/outbox count stays 1.
R12-C: bank B recovery actor queries bank A key => indistinguishable denial; zero foreign disclosure.
R12-D: current originator retries committed key after account closure => original reference, zero new posting.
R12-E: new key with closed account => controlled rejection before any journal/outbox.
R12-F: reused key with changed economic digest => conflict without leaking old digest or journal reference.
R12-G: revocation concurrent with recovery => outcome ordered by membership lock and verified against acknowledgment boundary.
R12-H: client timeout after ambiguous commit => UNKNOWN, authoritative lookup, no new key/repost.
R12-I: crash after durable commit before response => exactly one journal and one outbox event after restart.
R12-J: forged tenant field and direct table writes => privilege/FK denial, no cross-bank effects.
For each: PostgreSQL 16 version, fresh disposable database, two isolated bank roles, explicit GRANT inventory, exact SQLSTATE, row-count/ledger assertions, captured concurrent-session timelines, logs and independent reviewer evidence are required.

## Quality and DoR disposition
Financial: balanced journal invariants must remain enforced at database commit; replay must not mutate balances. Security: OIDC-to-DB identity, tenant FKs, permission separation, audit and direct-write denial unproven. Operations: UNKNOWN resolution and crash/restart evidence missing. Testability: the ten R12 cases are specifications only. DoR 3,6,8,9,11,13,14,15 remain open. GOV-REC-001 and GOV-WBS-RECON-001 remain open; WP-ACC-005 312/322 external statutory mapping remains quarantined. No production readiness claimed.

Run accounting: 1 registered ongoing WP attempted (SEC-TENANT-ROUTING-001); 0 verified-complete; 1 open/P0; 0 new numbered batches; 0 tests executed. This review file is an intermediate artifact, not a completed ZIP checkpoint.

NEXT EXACT TASK: SEC-TENANT-ROUTING-001 — construct a bank-scoped disposable PostgreSQL 16 R12 harness with explicit principal roles and registry state machine, then execute R12-A..J including two-session revocation and postcommit crash evidence; retain P0 until independently reviewed.
