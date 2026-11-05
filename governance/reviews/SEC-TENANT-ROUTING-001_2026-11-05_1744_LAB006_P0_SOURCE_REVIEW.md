# SEC-TENANT-ROUTING-001 — LAB-006 source-level P0 review (2026-11-05 17:44 Africa/Douala)

Status: REVIEW EVIDENCE ONLY; OPEN; no code, tests, regulatory acceptance, or production DoR asserted.
Observed main HEAD before review: c9ba7c7bdbed77b9cee0e3c9a7bcfffc2b75bdc0.
Sources reviewed: engineering/labs/security-ledger/006_idempotency_recovery_experimental.sql; 007_idempotency_recovery_acceptance.sql; 007_idempotency_recovery_assertions_runner.sql; governance/CANONICAL_PROGRAMME_STATE.json; governance/reviews/SEC-TENANT-ROUTING-001_POSTCOMMIT_UNKNOWN_ACCEPTANCE_PLAN_2026-11-05.md.

## Specific source-derived blockers

1. **P0 cross-bank namespace not represented.** LAB-006 operation UNIQUE(operation_type,idempotency_key) has no bank_id; member, account, line and outbox tables also have no bank_id. Consequently this fixture cannot establish bank-scoped uniqueness, lookup confidentiality or cross-bank replay isolation. Do not transplant it into a multi-bank posting service. Add bank_id to all relevant keys and foreign keys, use composite constraints and bank-specific authenticated DB principal and RLS/grant proofs; prove two banks can reuse an identical idempotency key independently, while cross-bank lookup is denied.
2. **P0 untrusted direct table mutation.** LAB-007 setup grants SELECT, INSERT, UPDATE on ALL TABLES in sec_idemp_006 to lab006_runner. The role can bypass post() and alter operation/line/outbox records. This is acknowledged as disposable-lab-only, but means no immutability or application privilege proof. For production-shaped experiments revoke all direct table DML, use narrowly audited SECURITY DEFINER functions with fixed search_path and owner isolation, or a dedicated narrowly privileged DB role design; prove direct INSERT/UPDATE/DELETE fail.
3. **P0 crash/UNKNOWN not tested.** LAB-007 runner executes BEGIN...ROLLBACK and therefore cannot prove durable replay after COMMIT or a worker death before HTTP acknowledgement. A two-connection committed fixture plus deterministic kill point and lookup endpoint is required. The current runner is expressly NOT EXECUTED in source comments.
4. **P0 OIDC identity chain missing.** LAB-006 uses SESSION_USER with manually provisioned membership and does not cryptographically validate issuer, audience, signature, expiry, token binding or membership revision at the gateway. A real OIDC-to-bank-local DB principal chain and revocation ordering test remain required.
5. **P1 replay semantics:** fingerprint intentionally excludes p_command, p_journal and p_event transport UUIDs. This is acceptable only if those IDs are not semantically part of the customer instruction; record and enforce the canonical economic command schema, ordering, version and actor/tenant scope before promoting. The current fixture compares member_id but not bank_id.

## Ordered acceptance criteria

A. Introduce bank-scoped operation and account ownership and prove composite foreign keys, bank-local unique idempotency, and negative cross-bank SQL/API tests.
B. Replace broad LAB-007 DML grants in a separate production-shaped lab fixture; assert untrusted logins cannot directly modify immutable journals, idempotency or outbox.
C. Execute committed, two-worker crash-after-COMMIT-before-reply tests; prove one journal/outbox, same-key same-payload replay returns identical journal, changed payload rejects, DB unavailable returns UNKNOWN.
D. Execute outbox publish-before-ack duplicate delivery with durable inbox dedupe, revocation races and credential rotation.
E. Execute real cryptographic OIDC validation with correct issuer/audience/signature/expiry and explicit bank membership; record PostgreSQL version, migrations, CI SHA/logs and independent accounting/security review.

No requirement here encodes unresolved COBAC 312/322 classification; WP-ACC-005 remains quarantined. No bank participation agreement is required to develop the software; live rail activation requires separate entitlement.

## Run report
Attempted existing registered WP: 1 (SEC-TENANT-ROUTING-001); verified complete: 0; open: 1; blocked for production: 1; new ZIP checkpoints: 0; tests executed: 0; WBS approved denominator: UNKNOWN. This is an independently inspectable source-review delta, not an accepted batch.

NEXT EXACT TASK: SEC-TENANT-ROUTING-001 — build a separate bank-scoped, least-privilege PostgreSQL 16 post-COMMIT crash/replay harness and run it against two independent bank principals, preserving LAB-006/007 as historical disposable fixtures.
