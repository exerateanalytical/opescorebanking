# SEC-TENANT-ROUTING-001 — postcommit fault-injection harness engineering contract
Date: 2026-11-05
Status: DESIGN REVIEW / NOT EXECUTED / NOT PRODUCTION READY
Parent: SEC-TENANT-ROUTING-001
Predecessor: governance/reviews/SEC-TENANT-ROUTING-001_POSTCOMMIT_UNKNOWN_ACCEPTANCE_PLAN_2026-11-05.md
Baseline commit: c868229433c3db80d991b1fdfc72bd367c09f55a

## Scope and isolation
This contract specifies a *test-only* extension to existing PostgreSQL 16 laboratory checkpoints SEC-LED-LAB-003..005. It must not be interpreted as a production API, migration, regulatory implementation, or accepted WP. Do not modify existing lab schema without inspecting its actual DDL, roles, RLS policies, CI workflows and transaction functions. Existing laboratory evidence establishes neither a real OIDC gateway nor post-COMMIT response loss.

## Mandatory durable transaction contract
For a bank-local operation, the same database COMMIT must atomically make visible:
- one canonical bank-scoped operation record keyed by (bank_id, operation_type, idempotency_key), with immutable canonical request digest, operation status, and journal reference;
- one immutable balanced posted journal with its lines and currency-specific debit/credit equality;
- one durable outbox record with event ID, aggregate reference and payload version.

No cache, HTTP reply, event broker acknowledgement, or client-supplied status can be the authoritative commit witness. The operation's idempotency key must not be globally reusable across banks for lookups: bank and verified actor authorization are checked on every read. Same key + different canonical digest is a conflict; no journal may be posted. Digest canonicalization must include operation version, tenant/bank, debtor, creditor, amount in exact minor units or decimal with currency-specific scale, currency, and material business fields. Avoid raw JSON serialization order as a digest input.

## Crash cut-points (deterministic test controls, disabled in production)
C0 before transaction BEGIN; C1 after acquiring bank-local authorization/serialization fence; C2 after operation insert; C3 after journal/outbox writes but before COMMIT; C4 immediately after confirmed COMMIT return but before HTTP reply serialization; C5 after reply serialization but before socket send; C6 after broker publish acknowledgement but before inbox/dispatch marker commit.
Use test-only barriers (two independent workers, parent orchestrator) to release each cut-point, terminate exactly the verified worker PID rather than database server or arbitrary process, and capture a monotonic trace. A crash at C3 must roll back all three durable objects. A crash at C4 or C5 must retain all three objects and return UNKNOWN to the caller when no response was observed. A crash at C6 may redeliver but must not repeat consumer side effects.

## Observable response states
- CONFIRMED_POSTED: authoritative committed operation and journal identified after bank-local lookup; not a claim of external settlement.
- UNKNOWN: no reliable acknowledgement and authoritative lookup unavailable or indeterminate. Must preserve original operation key and expose a bounded retry/recovery route.
- REJECTED_CONFLICT: same bank/type/key with a different canonical request digest; no new journal.
- REJECTED_AUTH: failed bank-local actor authorization; do not reveal whether a guessed operation exists.
- FAILED_NOT_COMMITTED: only when an authoritative database result proves rollback/non-commit; absence of HTTP reply never suffices.

A query that finds no row immediately after a timeout is not alone proof of failure while the original transaction may still be in flight. Use bounded wait, authoritative transaction resolution, and UNKNOWN where ambiguity remains.

## Minimum executable assertions
A01: after C3 kill, zero operation, zero posted journal and zero outbox rows for unique test correlation.
A02: after C4 kill, exactly one operation, one balanced immutable journal and one outbox record survive; caller may see UNKNOWN.
A03: 20 simultaneous same-key/same-digest requests across independent connections converge on one journal ID, no duplicate lines or outbox IDs.
A04: same key with altered amount, currency, account, or bank is rejected or independently scoped as specified; no cross-bank lookup disclosure.
A05: journal debit and credit sums equal by currency, using exact NUMERIC, never floating-point.
A06: network/database unavailable during resolution yields UNKNOWN, never FAILED or SETTLED.
A07: publish-before-marker crash yields at-least-once delivery; consumer inbox uniqueness produces one business effect.
A08: revoked bank membership cannot authorize a new posting after revocation linearizes; document ordering when a previously authorized transaction holds the fence.
A09: re-run after primary restart/failover retains operation/journal/outbox atomicity; asynchronous failover data-loss guarantees must be documented, not assumed.
A10: a correction produces a new reversal journal and retains original immutable lines.

## Evidence and execution requirements
Capture PostgreSQL version, exact DDL and grants, transaction isolation, RLS policies, code SHA, CI run URL, crash trigger trace, backend PID selection evidence, per-assertion query output, reconciled debit/credit totals, operation/outbox counts, and negative-path audit logs. Run a clean-room database fixture and repeat at least twice; mark nondeterministic results as failed pending investigation. Include a teardown plan that prevents privileged test hooks in production. A green CI badge is insufficient without actual assertion traces.

## Dependency gates / review
- Financial: immutable posted journals, no status-driven balance writes, no synthetic settlement.
- Security: verified OIDC signature/issuer/audience/expiry, membership version, least-privilege bank-local DB principal and no tenant context supplied solely by caller are still NOT PROVEN.
- Operations: retry storms must be bounded, UNKNOWN must be operator-reconcilable, and outbox delivery must not imply payment finality.
- Architecture: inspect existing DDL before adding test code; preserve original labs and use an isolated test namespace.
- Regulatory: no statutory account mapping or compliance conclusion is asserted here; WP-ACC-005 remains quarantined.

## Acceptance / continuation
This document is an implementable test contract, not evidence that tests ran. SEC-TENANT-ROUTING-001 stays IN_PROGRESS; independent acceptance 0. No production DoR granted. NEXT EXACT TASK: inspect existing lab SQL/CI sources, add isolated C3/C4/C6 crash barriers and A01–A07 assertions, run them on PostgreSQL 16, archive logs with checksums, then separately address OIDC-to-principal integration.
