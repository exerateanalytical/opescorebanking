# SEC-TENANT-ROUTING-001 — independent LAB-006 concurrency and recovery review
Date: 2026-11-05, Africa/Douala. Status: OPEN / REVIEW EVIDENCE ONLY. Source: engineering/labs/security-ledger/006_idempotency_recovery_experimental.sql at main 816641b00a47533155a95a44f40745405048a6fa. No test execution claimed.

## Additional source-level findings (not acceptance)
1. The SQL function is SECURITY INVOKER, and direct table writes are required by its caller. Merely revoking DML from an untrusted application principal breaks this function. A separate narrow SECURITY DEFINER boundary requires an explicit non-login owner, fixed search_path, schema-qualified references, controlled EXECUTE grants, and tests for privilege escalation, object shadowing and owner bypass.
2. `SESSION_USER` binds a database login but does not bind a cryptographically verified OIDC subject, audience, issuer, expiry or authenticated bank routing. Never infer bank identity from caller-provided bank_id alone. Production-shaped tests must use independent bank principals, fail closed on ambiguous routing, and prove revocation ordering.
3. `ON CONFLICT DO NOTHING` and subsequent SELECT can be a valid committed-replay design under defined transaction isolation, but the current source has no committed two-session harness, crash point, lock-timeout policy or evidence of behavior under SERIALIZABLE retry, deadlock or unavailable database. Preserve UNKNOWN on uncertain commit outcome; never retry with a fresh idempotency key.
4. The canonical digest includes ordered economic lines and currency, but excludes actor/bank and command schema version beyond a fixed literal. The operation uniqueness and prior-member check do not establish bank scope. Define a versioned economic-command canonicalization contract and explicit same-key/different-payload semantics before production reuse.
5. The source uses a numeric accumulator and bigint per-line conversion; overflow, extreme line counts, currency scale and posting-period controls need explicit boundary/property tests. The fixture checks debits equal credits but does not establish journal immutability, per-bank isolation, period closure, authorization or reconciliation.
6. Outbox insert is transactionally coupled to operation and lines in the lab, but no consumer inbox, delivery-ack race, independent reconciliation or duplicate event delivery proof exists. Distinguish committed journal from externally delivered event and final settlement.

## Ordered next experiment (separate disposable lab; preserve 006/007 unchanged)
A. Model bank, principal, membership, account, operation, journal and outbox with composite bank-scoped foreign keys and constraints. Deny direct DML to untrusted principals. Include negative cross-bank lookup and same-key/different-bank tests.
B. Design an audited, least-privilege posting and lookup boundary with verified principal-to-bank binding; do not claim OIDC integration until signature/issuer/audience/expiry and revocation are tested at a real gateway.
C. Run two independent PostgreSQL connections with a deterministic after-COMMIT/before-HTTP-reply failure point, and test identical replay, conflicting replay, simultaneous first-writer races, unavailable lookup, deadlocks, credential rotation, direct DML denial and outbox duplicate delivery.
D. Record PostgreSQL version, migration SHA, runner code, exact command lines, test logs, GitHub Actions run and independent financial/security review. DoR remains failed until all 15 gates pass.

## Programme continuity
Historical ZIP batches 001–210 remain unchanged. WP-ACC-005 COBAC 312/322 statutory classification remains quarantined. GOV-REC-001 archival custody and GOV-WBS-RECON-001 approved leaf denominator remain open. This review is not a new accepted work package or checkpoint ZIP. Verified production WP count remains unestablished; do not extrapolate from laboratory CI.

Run: attempted 1 registered WP (SEC-TENANT-ROUTING-001); completed 0; open 1; production-blocked 1; tests executed 0; new ZIP 0; remaining programme WPs UNKNOWN.
NEXT EXACT TASK: SEC-TENANT-ROUTING-001 — implement and execute a separate bank-scoped, least-privilege PostgreSQL 16 post-COMMIT crash/replay harness, preserving LAB-006/007 and recording negative cross-bank and direct-DML tests.
