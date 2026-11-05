# SEC-TENANT-ROUTING-001 — post-COMMIT UNKNOWN recovery acceptance plan
Status: DRAFT REVIEW / NOT EXECUTED / NOT PRODUCTION ACCEPTED
Baseline: main 2bb570a7e57501e747262ae5688587f493e09502 (2026-11-05). This document does not supersede earlier PG16 laboratory results.

## Boundary and decision
An HTTP timeout, gateway crash, connection loss, or process termination after PostgreSQL COMMIT and before client acknowledgement MUST be represented as UNKNOWN to the caller until authoritative operation lookup resolves it. Never infer failure from missing HTTP response, never retry by creating a new operation identity, and never mutate balances from transport status. Persist a bank-scoped immutable idempotency identity and canonical request fingerprint within the same durable transaction as the posted journal and outbox event. Enforce uniqueness at the database boundary, not merely application cache. A same-key different-payload replay MUST be rejected and audited. A same-key same-payload replay MUST return the durable original result, including journal identity, without reposting. All paths require verified bank-local authorization, with no cross-bank information leakage in lookup responses.

## Required executable acceptance scenarios (NOT RUN)
1. Crash injection immediately after database COMMIT and before HTTP response: lookup with original bank, actor and key resolves exactly one posted journal; no duplicate entries.
2. Lost acknowledgement followed by concurrent same-key replays from independent API workers: exactly one durable operation; all successful responses agree on journal ID and immutable amount/currency.
3. Replay with identical key but changed amount, currency, debtor, creditor or tenant: fail closed, no posting, structured security audit event.
4. Uncertain COMMIT outcome with database unreachable: return UNKNOWN / retryable status with stable operation lookup identifier, never assert failed or settled.
5. Outbox dispatcher crashes after downstream publish but before delivery marker: duplicate delivery is possible; consumer inbox uniqueness makes downstream effects idempotent; reconciliation detects missing acknowledgement.
6. DB credential rotation while a request is in flight: no fallback to shared elevated principal; transaction bound to verified bank-local identity; expired/revoked credential fails closed and is logged.
7. Authorization revocation racing with posting: enforce previously specified bank-local serialization fence, prove ordering with real PostgreSQL concurrent sessions.
8. Cross-bank replay and guessed operation IDs: no information disclosure; no journal visibility or mutation.
9. Recovery after primary failover: durable idempotency record, journal and outbox remain consistent; no invented settlement/finality.
10. Operator correction: append-only compensating journal with dual control, never UPDATE posted lines.

## Evidence required before production DoR
Capture exact migration SQL, uniqueness constraints, isolation level, DB role/grant/RLS definitions, OIDC issuer/audience/signature/expiry validation, bank membership version binding, reproducible fault injection, test source, CI run URL/SHA, transaction and outbox traces, negative-test assertions, and reconciliation report. Independent reviewers must inspect accounting, security, recovery, and data-integrity claims. A green synthetic lab alone is insufficient.

## Blockers and continuation
P0-SEC-01/02 remain open for real cryptographic OIDC-to-gateway-to-bank-principal binding and postcommit recovery. WP-ACC-005 statutory 312/322 classification remains isolated and blocked; do not encode unverified statutory mappings. This plan is a single evidence-planning increment under existing SEC-TENANT-ROUTING-001, not a newly accepted work package. No tests executed in this increment; no ZIP or verified archive delivery. Next: implement the fault-injection harness in the existing lab, run PostgreSQL 16 concurrency/crash tests, and record evidence before any production readiness claim.
