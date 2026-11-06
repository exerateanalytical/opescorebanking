# SEC-TENANT-ROUTING-001 — integration boundary and failure-injection acceptance plan 07
Date: 2026-11-06. Status: ENGINEERING REVIEW DRAFT / P0 OPEN / NOT PRODUCTION READY.
Source baseline: governance/CANONICAL_PROGRAMME_STATE.json; governance/reviews/SEC-TENANT-ROUTING-001_FORMAL_ORDERING_MODEL_06_2026-11-04.md. Parent inspection: main 237f9b59e0c9e54ae0d4fe8d0c43de3516e0174f.

## Scope and non-claims
This work refines the existing SEC-TENANT-ROUTING-001, not a new batch or independently accepted work package. No application tests, database tests, regulatory certification or production acceptance performed in this review. Prior synthetic labs are evidence for their bounded scopes only.

## Proposed bank-local topology (decision candidate; NOT accepted ADR)
1. API gateway validates signature against pinned, rotated issuer JWKS, exact issuer/audience/algorithm, nbf/exp, bank-scoped command digest and workload channel identity. Never trust client bank headers or mutable database session variables as identity.
2. A trusted broker resolves the verified subject and intended bank to a bank-local authenticated PostgreSQL principal using an allowlisted server-side mapping; database credentials come from short-lived managed secrets, never from token claims.
3. Bank-local membership, permissions, revocation epoch, command idempotency, immutable journal and outbox must share one durable transaction and enforced lock ordering: membership -> command -> journal -> outbox. Bank-local PostgreSQL authenticated principal and RLS must enforce bank scope independently of API assertions.
4. Global administration revocation is REQUESTED/PENDING until every bank-local authority that can commit on that membership has durably acknowledged ENFORCED. No success response before all required acknowledgements. A missing authority yields PENDING with incident escalation.
5. For live rail effects, local outbox transaction records intent, not external settlement. Delivery uses dedupe and external correlation; timeout yields UNKNOWN, never FAILED or a second payment. External settlement remains subject to reconciliation.

## Integration contracts requiring proof
- Authenticated command context: issuer, subject, audience, jti, token key id, bank, command id, digest, permission, membership version, checker decision reference, trace id, expiry; server-side resolved bank principal. Log hashes/IDs, never bearer token or secrets.
- Command uniqueness: UNIQUE(bank_id, command_id), immutable operation digest; UNIQUE(issuer,jti) at redemption scope with durable retention matching maximum replay risk. Repeat same digest returns the original durable outcome; conflicting digest denies.
- Database credential rotation: existing pooled sessions must be drained/revalidated before reuse; a rotated or revoked principal cannot continue executing privileged financial commands. Prove server-side binding after pool reconnect, failover and revoked secret.
- Durable response envelope: COMMITTED, REJECTED, PENDING or UNKNOWN with immutable command id and reconciliation lookup; no automatic retry of UNKNOWN as a fresh command.

## Deterministic executable acceptance matrix (NOT EXECUTED)
T01 valid issuer/bank-A subject -> bank-A principal; bank-B database checkout denied.
T02 wrong issuer/audience/algorithm/kid, expired token, stale JWKS, replayed jti -> deny before any bank DB checkout.
T03 forged bank header, changed command digest, wrong bank-local membership -> deny; zero journal rows.
T04 revoke before grant; grant before revoke but redeem after revoke; redeem before fence then revoke -> deny at prescribed boundary.
T05 held bank-local fence then revoke -> revocation PENDING until commit/abort; ENFORCED strictly after local irreversible commit/abort.
T06 crash after COMMIT but before HTTP response -> persisted COMMITTED + exactly one balanced journal + exactly one outbox event; replay resolves original result.
T07 crash before COMMIT -> no partial journal/outbox; recovery can retry only after proving no committed effect.
T08 outbox delivered then worker crash before delivery ack -> duplicate delivery attempt must not cause duplicate downstream effect; correlation/reconciliation records retained.
T09 external rail timeout -> UNKNOWN; no invented settlement/finality or fresh payment retry.
T10 membership admin emergency revoke during broker credential rotation -> no post-ENFORCED financial commit under revoked membership.
T11 PostgreSQL failover/connection pool reuse -> no bank-A session/principal usable for bank-B, including stale prepared statements and RLS context.
T12 concurrent identical command across two brokers -> one commit, one durable result; conflicting digest -> rejected.
T13 authority network partition -> deny new commands, preserve PENDING revocation, emit actionable alert.
T14 restore from backup/DR -> compare replay registry, command ledger, outbox and journal high-water marks before accepting writes; no assumed RPO=0.
T15 journal per-currency debit/credit equality, exact minor units, posted immutability, controlled reversal and independent reconciliation.
Each test must capture deterministic schedule/seed, transaction IDs, principal identity, commit sequence, before/after counts, durable audit evidence, failure injection location and CI run URL. Required: actual gateway + broker + PostgreSQL 16 + pool + OIDC issuer/JWKS test fixture, not in-memory mocks alone.

## Critical blockers and quality review
P0-SEC-01: bank-local membership authority topology, global-to-local revocation propagation and crash consistency unproven. Proposed protocol above is not equivalent to proven distributed safety.
P0-SEC-02: real broker workload authentication, key/HSM custody, mTLS, secret rotation and failover not demonstrated.
Financial: no production journal/outbox atomicity proof. Regulatory: WP-ACC-005 COBAC PCEC 312/322 mapping remains quarantined; unrelated neutral ledger lab may continue. Operations: no demonstrated UNKNOWN reconciliation or DR recovery. Privacy: audit payload minimization and retention policy require signoff. Architecture: need concrete gateway/broker/DB deployment diagram and executable interface.
15 DoR gates: NOT SATISFIED; production promotion forbidden. No new ZIP because no independently completed work package; do not consume batch 211 without actual deliverables and acceptance evidence.

NEXT EXACT TASK: SEC-TENANT-ROUTING-001 — inspect current gateway/broker/PostgreSQL implementation paths and construct a minimal real-boundary T01/T02/T06 executable harness with fail-closed revocation and credential-rotation fixtures; run and record evidence before claiming any DoR gate closed.
