# SEC-TENANT-ROUTING-001 — Revocation versus irreversible-command experiment

**Classification:** synthetic PostgreSQL test laboratory, **not** a production financial authorization service. This package explicitly addresses the prior canonical security review 05's T43/T47 concurrency proof gap.

## Formal safety model: single atomic database boundary

**Authority state:** Each membership has `(state, institution_state, revision)`. Every authorization lease contains `(membership, institution, command digest, command id, idempotency key, revision, state)`. A durable redemption table has `PRIMARY KEY (issuer,jti)`.

**Linearization discipline:** All `grant`, `redeem`, `execute_synthetic` and `revoke` operations lock **the same membership row FOR UPDATE** before reading, mutating, or committing authority-relevant state. The synthetic irreversible effect and lease transition occur in that same PostgreSQL transaction. A revocation can acknowledge **ENFORCED** only once it obtains the lock and commits; prior holders have already committed or aborted. Existing effects are never removed on revoke.

**Safety property S1:** No effect can commit after an ENFORCED revocation was acknowledged in this specific transactional boundary.

**Safety property S2:** For a given `(issuer,jti)`, no more than one redemption transitions ISSUED->REDEEMED. Concurrent brokers race at the durable PostgreSQL membership lock and redemption PK.

**Safety property S3:** A matching idempotency key may return the existing lease; a different digest or command ID under that key is denied. No duplicate synthetic effect is posted for the same membership and command.

**Safety property S4:** A stale lease, inactive institution, revoked member, or missing membership denies grant, redeem, and execution.

**Liveness property L1 (conditional):** If the PostgreSQL authority is available, transactions terminate, and no competing lock holder remains indefinitely, a healthy request makes progress. Timeouts must cause unknown/deny, not silent rebinding or replay. **No distributed-system liveness guarantee is claimed.**

## Cross-service warning
The bank's actual ledger, message broker and external rails are not guaranteed to share this ACID boundary. Therefore no general property 'zero commits after revocation' is claimed for cross-service actions. To carry this proof into production, the ledger must participate in a formally reviewed fence and commit protocol or use an explicitly acknowledged in-flight revocation policy. Real payments with UNKNOWN external outcomes require independent reconciliation. This remains P0-SEC-01.

## Tests
`pytest` is not required. Run with `psycopg`:
- T43: two concurrent threads with independent database connections redeem the same JTI, exactly one succeeds.
- T47: revoke-before-grant; grant-before-revoke; redeem-before-revoke; execute-before-revoke; and deterministic action/revoke interleaving while row lock held.
- Exact idempotency-key conflicting-digest denial.

All membership IDs, command digests and effects are synthetic and randomly generated. No real balances, customer data, private keys, or payment network credentials.

References: [PostgreSQL 16 Transaction Isolation](https://www.postgresql.org/docs/16/transaction-iso.html), [RFC 8725 JWT BCP](https://www.rfc-editor.org/rfc/rfc8725), and previous canonical review 05 under `governance/reviews/`.
