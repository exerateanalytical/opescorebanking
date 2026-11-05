# SEC-TENANT-ROUTING-001 — committed replay versus mutable account state
Date: 2026-11-05. Status: OPEN / source review only; no execution, DoR acceptance, or production authorization.

Source inspected: `engineering/labs/security-ledger/006_idempotency_recovery_experimental.sql` on GitHub main. This review supplements, rather than replaces, the existing 2026-11-05 concurrency/recovery review.

## Concrete correctness defect to resolve in the next disposable experiment
`sec_idemp_006.post` locks and validates every referenced account as ACTIVE before looking up the previously committed idempotency operation. Consequently, a caller replaying an identical already-committed request after an account is CLOSED receives `account unavailable` instead of the original journal identifier. This conflates a new posting eligibility check with retrieval of an already-committed outcome. It also makes recovery after a lost HTTP response depend on mutable account state.

A related ordering issue: membership revision/state is deliberately checked first to avoid unauthorized disclosure; this is appropriate as a fail-closed policy, but a revoked caller cannot recover the committed outcome. A separate privileged, audited recovery channel is required. Do not weaken the revocation fence to solve the account-closure problem.

## Required design decision
Separate (1) authenticated and bank-scoped authorization to retrieve the result of a previously committed command from (2) account eligibility and posting-period validation for a genuinely new command. For a matching committed replay, return the original journal identifier only to an authorized caller with the same verified tenant and authorized operation scope; do not repost, revalidate mutable account ACTIVE status, or emit a second outbox event. For a conflicting digest, return a non-disclosing conflict. For a missing or uncertain prior operation, perform new-command validation only after a transactionally safe first-writer decision; preserve UNKNOWN if database outcome cannot be established.

This separation must not permit a replay to bypass tenant isolation, principal revocation, or operation ownership. Define the versioned digest and exact account-identity authorization contract before implementation.

## Required executable negative/positive matrix (NOT EXECUTED)
1. Commit journal, close one participating account, replay same key/economics with same authorized tenant: original journal returned, no new journal/outbox.
2. Close account before first submission: new posting denied; no journal/outbox.
3. Commit journal, revoke caller, replay: no disclosure; authorized audited recovery principal may retrieve under explicit policy.
4. Commit journal, change economic payload, replay: conflict; no new journal/outbox.
5. Commit journal in bank A; bank B reuses same key: no cross-bank disclosure, bank-scoped uniqueness and authorization enforced.
6. Commit journal, crash before reply, retry after account closure: deterministic recovery of committed outcome, without duplicate posting.
7. Concurrent first writers, account closure, revocation and retries: establish serializable or explicitly chosen isolation behavior and record traces.

## Quality gate and continuation
P0 ledger/tenant isolation, regulatory account classification, archival reconciliation and WBS denominator remain open. This note is a source-level finding only; no banking tests executed; no accepted WP closed; no checkpoint ZIP created. Do not advance dependent production implementation.

NEXT EXACT TASK: SEC-TENANT-ROUTING-001 — in a separate disposable PostgreSQL 16 harness, implement and execute bank-scoped committed-replay recovery tests including account closure, revocation, and post-COMMIT response loss; preserve LAB-006/007 unchanged and capture executable evidence.
