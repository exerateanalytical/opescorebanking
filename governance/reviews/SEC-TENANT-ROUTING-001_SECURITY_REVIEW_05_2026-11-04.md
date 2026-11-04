# SEC-TENANT-ROUTING-001 — Review 05: linearization and trust-boundary assurance
Date: 2026-11-04 | Source baseline: 190ae77617dfaa5de01f56880e73e81eb8f94d25 | Status: OPEN / P0 SECURITY / NOT DoR-READY
Continuation of reviews 01–04. This review is not a completed work package, deployment approval, or executed test result.

## Critical finding: previous revocation rule is insufficient
A linearizable membership revision read at authorization and another at redemption does not itself prevent a concurrent revoke from committing immediately after redemption and before irreversible command execution. A valid authorization lease must have an explicit revocation fence. Merely shortening token expiry, re-reading timestamps, invalidating caches, or terminating PostgreSQL connections cannot establish the financial command ordering guarantee.

## Proposed authority protocol — design for review, not accepted
**Authority owner:** a single logically authoritative membership/permission service, backed by a transactionally consistent store. Distinct institution membership and institution lifecycle revisions; both checked. The authority must never trust a tenant header or self-asserted JWT institution claim.

**State:** membership_id, institution_id, actor_ref, status, permission_set_version, membership_revision, institution_revision, revoked_at, environment; decision_id, command_id, operation_digest, lease_id, capability_jti, expiry, status and epoch/fence.

**Grant ordering point:** a serializable authority transaction checks ACTIVE membership and ACTIVE institution, verifies permitted operation and maker/checker separation against persisted initiating actor, then records a unique command authorization lease with current revisions and a fencing epoch. Only one outstanding authorization for an idempotency key and operation digest; conflicting digests reject.

**Redemption ordering point:** broker atomically redeems jti once and validates active lease, workload identity, token audience, digest, revision and expiry. Replay uniqueness must be durable across all broker replicas, not merely per-process. If the replay authority is partitioned, broker fails closed.

**Irreversible action fence:** before a financially consequential operation, the domain command handler must acquire a valid authorization fence whose validity is ordered against revocation by the same authoritative consistency boundary. A cross-service check-then-act is NOT sufficient. For operations that cannot share a transaction with the authority, design a bounded lease/epoch protocol with explicitly modeled in-flight authorization and revocation semantics; do not claim zero post-revocation commits until a formal interleaving model and executable concurrency tests demonstrate it. Already committed financial transactions are not silently rolled back when membership is revoked.

**Revocation ordering point:** revoke atomically changes membership status and increments revision/epoch, denies new grants, invalidates pending unredeemed leases, and initiates active-lease cancellation. Acknowledge revocation as ENFORCED only after the chosen safety policy for in-flight irreversible commands is satisfied; otherwise report REVOCATION_PENDING with auditable affected leases. Do not conflate revocation requested, committed and fully enforced.

**External rail uncertainty:** a request submitted before revocation can have UNKNOWN external outcome. Never resend on revocation, timeout, or broker restart without an idempotency/reconciliation decision.

## Signed capability trust topology
User access token -> trusted gateway token verifier -> membership authority -> isolated authorization issuer -> mTLS-bound broker -> bank-specific DB principal -> allowlisted domain command.
No public gateway access to bank DB credentials. No browser-issued capabilities. Dedicated issuer key separate from OIDC access token signing keys; pinned issuer/audience/algorithm; no dynamic untrusted jku/x5u. Bind capability to workload certificate identity, command digest, resource scope, bank, membership and institution revisions, decision and lease IDs. Broker enforces atomic single-use redemption. Domain handler independently checks operation scope and fence, rather than treating broker DB access as permission to post funds.

## Failure matrix (required behavior)
- Authority unavailable/partitioned: DENY new grants and redemptions; existing leases cannot be silently extended.
- Replay database partition: DENY; never degrade to in-memory jti cache.
- Signing key revoked: deny capabilities even if a stale JWKS cache contains the key; require trusted revocation propagation or bound maximum risk with policy approval.
- DB pool credential mismatch: quarantine pool and alert; do not retry financial command.
- Audit evidence unavailable for privileged command: fail closed before irreversible side effect; if after commit, preserve reconciliation obligation, never pretend the transaction did not occur.
- Duplicate command_id with different digest: CONFLICT, no second posting.
- Broker crashes after redemption before command outcome: UNKNOWN; recover through command ledger and reconciliation, not blind replay.
- Revocation after committed journal: access ends, posted journal remains immutable and any correction is a new controlled transaction.

## Synthetic executable test design — T41–T55
Use a PostgreSQL-backed authority and durable replay register in an isolated CI environment; two independent broker processes, a controlled fake clock, synthetic issuer/certificates, and fault-injection gates. Tests MUST be coded and run before claiming acceptance.
T41/T42 mTLS absent/mismatched workload -> 403 and no DB checkout.
T43 two brokers race identical (issuer,jti) -> exactly one committed redemption.
T44 replay authority disconnected -> zero grants and zero checkouts.
T45 tampered operation digest -> DENY before execution.
T46 membership revision stale -> DENY.
T47 deterministic interleavings: revoke before grant, between grant/redeem, after redeem/before commit, after commit; assert precisely defined ENFORCED semantics and immutable journals.
T48 authority outage -> no cached membership fallback.
T49 expired capability -> DENY despite valid membership.
T50 compromised signing key -> revocation signal blocks cached key.
T51 attacker jku/x5u -> no attacker-controlled network fetch.
T52 concurrent bank A credential rotation/bank B command -> SESSION_USER bank binding never crosses.
T53 old credential beyond drain deadline -> connection rejected and alarm.
T54 cancelled transaction with failed pool reset -> quarantine, no reuse.
T55 audit sink failure before privileged command -> no execution; after journal commit -> outcome UNKNOWN/RECONCILE, not a false rollback.
For each: capture deterministic seed, authority transaction order, token/certificate fixtures (never real secrets), database query trace, journal invariant checks, redacted audit evidence, and negative-case assertion.

## Quality review and unresolved decision log
P0-SEC-01: formal cross-service revoke/commit ordering semantics unresolved; choose authority fence and in-flight policy with executable interleaving proof.
P0-SEC-02: deployment topology, issuer and key custody, independent trust domains and certificate lifecycle unverified.
P1-SEC-03: durable replay-register availability and DR consistency not demonstrated.
P1-SEC-04: membership institution-profile retention, audit custody and effective-dated policy still undefined.
P1-SEC-05: exact bank credential-broker API and end-to-end permission/maker-checker tests missing.
Regulatory: this is security engineering, not COBAC certification. Financial: no authority to mutate posted journals or fabricate settlement. Data: audit minimization and retention pending institution profile. Operations: fail closed; no invented RTO/RPO. Review outcome: NOT READY.

## DoR decision
1 ownership: scoped, review open; 2 profile: NOT VERIFIED; 3 regulatory: technical references only; 4 invariants: PARTIAL; 5 failure/recovery: PARTIAL; 6 actor/SoD: PARTIAL; 7 accounting: NOT APPLICABLE to broker only, but downstream posting boundary NOT VERIFIED; 8 security: P0 OPEN; 9 contracts: DRAFT; 10 data lifecycle: OPEN; 11 executable acceptance: NOT IMPLEMENTED; 12 operations: OPEN; 13 dependencies: OPEN; 14 P0: FAILED; 15 repository: AVAILABLE. **Production implementation forbidden for this bounded context.**

NEXT EXACT TASK: SEC-TENANT-ROUTING-001 — formally specify revocation-versus-irreversible-command ordering and authoritative lease/fencing protocol with explicit safety/liveness properties; prepare a deterministic synthetic concurrency harness for T43/T47 without claiming executed tests or DoR completion.
