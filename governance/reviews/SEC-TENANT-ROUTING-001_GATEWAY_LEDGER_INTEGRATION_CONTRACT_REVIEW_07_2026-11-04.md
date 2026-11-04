# SEC-TENANT-ROUTING-001 — Gateway/ledger integration contract review 07
Date: 2026-11-04. Status: DRAFT, WP OPEN, P0 production acceptance blocked.
Baseline: main 414a4145e6cc9a07d767aa451de6a0027a6854c9. Supersedes neither ADR-OPES-003 nor review 06. The 50 previously reported Python tests and PostgreSQL checks belong to ENG-REMEDIATION-001; **zero tests executed for this review**.

## Decision and consistency boundary
Retain ADR-OPES-003 bank-local authority. A global OIDC issuer authenticates subject; bank-local membership and permissions authorize actions. A verified access token never by itself selects a database credential. The gateway must resolve a bank from a server-maintained institution registry and confirm active membership from that bank's authoritative store. The database connection broker selects only an allowlisted bank-specific PostgreSQL principal; neither client-supplied bank header nor token tenant claim can override this. The authenticated DB principal must be checked at checkout and at transaction start. A global revocation is PENDING until every affected bank authority durably acknowledges ENFORCED; offline authorities do not count as acknowledged.

## Proposed bounded API contract (not implemented)
POST /v1/banks/{bank_id}/financial-commands: bearer **access token** (not OIDC ID token), expected issuer, audience, allowed algorithm and pinned JWKS; bank_id must match authorized membership. Body: command_id UUID, idempotency_key, operation_type, canonical_operation_digest, expected_membership_revision, request data validated by operation-specific schema. Reject mismatched digest on repeated command_id with 409 and never issue another posting. The response is a durable state (REJECTED, ACCEPTED, COMMITTED, UNKNOWN) and correlation ID, not an invented settlement acknowledgment. Network timeout is UNKNOWN until queried by command_id.

POST /v1/banks/{bank_id}/memberships/{membership_id}/revocations: privileged maker-checker action, stable revocation_request_id; returns REQUESTED/PENDING/ENFORCED, including bank-specific acknowledgments. ENFORCED is never returned before local fences drain. Separate emergency suspension denies new commands immediately but must not pretend to cancel already committed effects.

## Required PostgreSQL atomic boundary
Single bank-local database transaction: lock membership row first, check ACTIVE and epoch, lock/insert unique command_id and digest, validate SoD and authority revision, create balanced immutable journal header/lines with exact minor-unit amounts, persist command terminal state and transactional outbox record, commit atomically. No externally visible COMMITTED before DB commit. Posting cannot occur through an alternate unguarded endpoint. Bank-local revocation obtains the same membership lock, moves to REVOKING and rejects subsequent authorizations, then marks ENFORCED only after earlier local effects are durable and known. Outbox publication is asynchronous, retryable and deduplicated by immutable event ID; it cannot create a second journal. Remote rail settlement is outside the DB atomic boundary and may remain UNKNOWN.

## Failure and adversarial matrix for next executable slice
G01 forged access token; G02 valid ID token as bearer; G03 wrong audience; G04 revoked key; G05 revoked membership after token issuance; G06 forged bank path; G07 bank A principal attempted on bank B; G08 connection-pool cross-bank reuse; G09 two concurrent command_id/digest submissions; G10 same idempotency key different digest; G11 revocation interleaved before lock; G12 revocation while posting holds lock; G13 crash before DB commit; G14 crash after commit before HTTP response; G15 outbox publish retry; G16 delayed external rail response; G17 loss of revocation control plane; G18 DR promotion with stale replay registry. Each test must capture DB journal rows, outbox rows, membership revision, DB principal, command terminal state, request correlation, and replay count. None is yet executed.

## Open engineering questions / P0
P0-SEC-01: bank-local membership projection freshness, global revoke fanout and bank failover consistency not yet proven. For any unreachable bank, global revocation remains PENDING; no false cross-bank linearizability guarantee.
P0-SEC-02: HSM/key custody, production mTLS workload identity, database credential rotation and connection pool draining remain unverified.
P0-FIN: durable production posting schema, immutable journal enforcement, idempotent outbox and crash/DR evidence not yet implemented. COBAC 312/322 mapping remains quarantined, not encoded into journal engine.
P1: operational alerts for stuck PENDING/UNKNOWN; audit evidence retention and independent reviewer sign-off; measurable failover RPO/RTO.

## Quality and DoR checkpoint
Regulatory: statutory mapping isolated, no claim of COBAC compliance. Financial: balanced immutable journals required but not implemented. Architecture: local authority chosen; global revocation conditional. Security: no trust in tenant header or ID token. AML/SoD: bank-local policy evaluation required. Privacy: minimum token claims and audit retention still to specify. Operations: fail closed on authority partition, UNKNOWN outcomes require reconciliation. Testability: 18 deterministic scenarios enumerated, no new execution. DoR 1 partial, 2 open, 3 partial, 4 partial, 5 partial, 6 partial, 7 FAIL, 8 FAIL, 9 draft, 10 partial, 11 unexecuted, 12 partial, 13 partial, 14 FAIL, 15 repo available. NOT READY FOR PRODUCTION.

## Delivery accounting
One registered work package attempted, zero accepted complete, one open, one production-blocked. No new tests, no ZIP checkpoint because no completed package. Historical drafts and the ENG-REMEDIATION-001 50 tests remain separate evidence.

NEXT EXACT TASK: SEC-TENANT-ROUTING-001 — implement and execute an isolated synthetic cross-service gateway-to-bank-local-posting integration slice, proving G01–G18 (especially crash after commit, revocation lock ordering, cross-bank principal isolation, and outbox replay) with CI evidence, then repeat the 15 DoR review. Do not enable real money or external rail credentials.
