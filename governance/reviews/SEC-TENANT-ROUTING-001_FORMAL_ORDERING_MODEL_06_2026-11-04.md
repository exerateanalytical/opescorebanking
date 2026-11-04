# SEC-TENANT-ROUTING-001 — Formal ordering model 06
Date: 2026-11-04 | Base: 11240ac4a03fdd4c23f94015ce0d13270baeb750 | Status: DRAFT / P0 OPEN / no production DoR

## Scope and precise guarantee
Guarantee G1: after revocation is acknowledged **ENFORCED**, no command whose irreversible-effect linearization point is later than that acknowledgement may be committed using the revoked membership. Revocation REQUESTED is **not** equivalent to ENFORCED. Transactions committed before enforcement remain immutable; external rail outcomes may be UNKNOWN and must be reconciled. G1 is not yet proven in the distributed deployment.

**Critical architectural choice:** a mere grant/redeem revision check, finite TTL, epoch, or local cache does not satisfy G1. We propose an authoritative command execution gate, held through the irreversible local journal commit, with revocation waiting for all such gates to finish or reporting PENDING. The gate must share a serializable consistency boundary with the local irreversible transaction, or a separately reviewed distributed protocol must establish equivalent ordering. Do not claim that a remote lease plus wall-clock expiry makes a local commit atomic.

## Formal state
Membership: (bank, actor, status ACTIVE|REVOKING|REVOKED, revision, epoch).
Command: (bank, command_id, operation_digest, decision_id, state NEW|AUTHORIZED|REDEEMED|FENCED|COMMITTED|FAILED|UNKNOWN, fence_epoch).
Replay key: (issuer, jti) UNIQUE, status REDEEMED, command_id.
Fence: (membership, command_id, epoch, status HELD|RELEASED), with durable active-fence accounting.
Revocation: (membership, request_id, status REQUESTED|PENDING|ENFORCED, acknowledged_at).
All durable records are bank-scoped; authority identity is server-derived, not a client tenant header.

## Transition system and ordering
A. Grant: ACTIVE membership, ACTIVE bank, server-side permission and maker/checker check, unique (bank,command_id) and digest; durable authorization decision. No money movement.
B. Redeem: atomic INSERT into durable UNIQUE (issuer,jti) registry; validate signed issuer, audience, workload certificate, command digest, bank, membership revision, TTL. Duplicate returns REPLAY_DENIED; never run command twice.
C. AcquireFence: serializable authority checks membership ACTIVE and exact epoch; atomically records active fence. Domain cannot rely solely on this step if it cannot keep the fence valid through local commit.
D. CommitLocal: under a **transactionally enforced fence** (e.g. membership and posting rows governed by same serializable database/transaction, with lock order membership -> command -> journal), check command digest/idempotency, journal balanced in exact minor units, post immutable entries, set COMMITTED and release fence atomically. For distributed authority and ledger, this is NOT implemented; requires proven cross-service fence coordination and revocation drain semantics.
E. RequestRevoke: mark REVOKING, increment epoch, deny all new grants and fences; record revocation request.
F. EnforceRevoke: only after all previously granted irreversible-effect fences have either committed/aborted with durable known outcome; set REVOKED and acknowledge ENFORCED. A crash or unknown external outcome must not be silently counted as aborted.
G. Recovery: reconstruct pending fences/commands from durable records, verify journal and external rail reconciliation; never blindly retry unknown outcomes.
H. External effect: submitting to a third-party rail is not atomically coordinated by the local DB. The enforceable guarantee must be explicitly narrowed to **new local authorization and submission** after ENFORCED; outcomes from previously submitted instructions may arrive afterward. This is not a security bypass.

## Safety properties (model-checker targets)
S1: at most one successful redemption per (issuer,jti).
S2: for a fixed (bank,command_id), at most one immutable financial posting and operation digest never changes.
S3: no bank B credential, subject or fence can authorize bank A command.
S4: ENFORCED implies no outstanding locally irreversible authorization fences for the revoked membership.
S5: no local irreversible posting linearizes after ENFORCED under revoked membership.
S6: journal sum(debits)==sum(credits) per currency, no direct balance mutation, no edit of posted journal.
S7: UNKNOWN is not treated as FAILED; recovery cannot duplicate posting or settlement.
S8: authority partition, stale revision, clock skew, replay-register outage or key revocation fails closed for new authorizations.

## Liveness and availability (conditional, never at expense of safety)
L1: with authority and journal storage healthy, bounded finite commands eventually resolve to COMMITTED/FAILED.
L2: revocation eventually ENFORCED if every in-flight local fence reaches a durable terminal outcome.
L3: an unresolvable in-flight command keeps revocation PENDING, with escalation and observable incident; do not fabricate a deadline-based ENFORCED response.
L4: failover must preserve linearization/replay durability. DR RPO=0 for these decisions is a **requirement to evaluate**, not an achieved deployment capability.

## T43 deterministic schedule
Two broker actors B1/B2 share one durable replay table. Barrier both before INSERT (issuer,jti), release simultaneously; expect exactly one INSERT success, other unique conflict. Repeat across process restarts, replica failover and DB partition. Capture serial order, seed, replay row, rejected actor, and zero bank DB checkouts for rejected redemption.

## T47 deterministic schedules
1. Revoke before grant: grant denied.
2. Grant then revoke before redemption: redemption denied.
3. Redeem then revoke before fence: fence denied.
4. Fence HELD then request revoke: request becomes PENDING; local commit may finish before ENFORCED, or abort; only then ENFORCED.
5. Local commit before revoke: immutable journal remains; new commands denied.
6. Crash while fence held: PENDING until durable recovery resolves, never assume no effect.
7. External submission before revoke, delayed settlement afterward: preserve pending/unknown state; no new submission after ENFORCED.
For each, assert S1–S8, capture linearization sequence and transaction logs, test repeated with randomized scheduler and fixed seeds.

## Trust boundaries and unresolved P0
P0-SEC-01 remains OPEN: the proposed co-transactional model is **not** compatible by default with a separately deployed membership authority and per-bank PostgreSQL databases. Select and formally verify an implementation topology: (a) bank-local authoritative membership fence within the same DB as bank-local journal, with signed global policy projection and revocation propagation semantics; or (b) rigorously proven distributed protocol with active-fence draining and explicit consistency guarantees. Do not assert global revocation effective until every relevant bank-local fence authority acknowledges it.
P0-SEC-02 remains OPEN: issuer/key custody, certificate lifecycle, authenticated broker workload and vault deployment topology need independent verification.
P1: maker-checker version changes, admin emergency revocation, audit outbox, disaster recovery and broker API contracts need executable acceptance.
No new executable tests were run in this review. Previous PostgreSQL tenant lab evidence remains separate from this unverified formal model.

## Multidisciplinary review
Security: explicit fence/revocation ordering is stronger than TTL-only design, but distributed correctness unproven.
Financial: immutable journal and UNKNOWN outcome invariants preserved.
Regulatory: no invented COBAC interpretation; account 312/322 classification remains isolated.
Operations: partition favors safety, revocation can remain PENDING and must alert.
Architecture: bank-local vs global membership authority is the decisive unresolved topology.
Audit: all state transitions require durable ordered evidence; retention and custody still open.
DoR: 1 partial; 2 open; 3 partial; 4 partial; 5 partial; 6 partial; 7 downstream boundary open; 8 P0 open; 9 draft; 10 open; 11 test schedules prepared, unexecuted; 12 partial; 13 open; 14 FAIL; 15 available. **NOT READY**.

NEXT EXACT TASK: SEC-TENANT-ROUTING-001 — choose and threat-model the bank-local vs distributed fence authority topology, specify its revocation acknowledgement protocol and deterministic executable synthetic T43/T47 test harness; do not authorize production implementation.
