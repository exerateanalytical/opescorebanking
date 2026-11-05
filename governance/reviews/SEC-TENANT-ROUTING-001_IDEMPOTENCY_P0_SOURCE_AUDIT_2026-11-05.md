# SEC-TENANT-ROUTING-001 — source-level P0 idempotency audit (2026-11-05)
Status: OPEN / BLOCKS C4 retry acceptance / NO PRODUCTION APPROVAL.
Source baseline: GitHub main 11fb427a40c102314cd2ff1c4041c1e2b07fbb25.
Inspected: engineering/labs/security-ledger/004_bank_local_atomic_posting_lab.sql; tests/005_concurrent_revocation_and_crash.sh; .github/workflows/sec-ledger-lab-004.yml; governance/reviews/SEC-TENANT-ROUTING-001_POSTCOMMIT_HARNESS_CONTRACT_2026-11-05.md; governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.5_2026-11-04.md.

## Critical source findings
**P0-SEC-IDEMP-01 — retry is coupled to generated identifiers.** The SQL computes v_digest from p_command_id, p_journal_id and p_idempotency_key (also membership revision and raw p_lines::text). The ON CONFLICT(command_id) branch compares that digest; UNIQUE(idempotency_key) is a separate constraint without a same-key recovery branch. A client retrying the same economic command with the same key but fresh command/journal UUIDs will violate UNIQUE(idempotency_key), rather than return the existing journal. A retry using the original command UUID but a new journal UUID will fail the digest comparison. Thus C4 response-loss recovery with independently generated retry IDs is NOT supported by this source. The current precommit-crash test does not exercise this scenario. Do not declare A02/A03 accepted.

**P0-SEC-IDEMP-02 — digest is not a canonical economic-request digest.** p_lines::text is the JSONB textual rendering and the digest includes transport/generated identities. Define a versioned canonical economic-command encoding with exact integer amounts, currency, ordered account/side semantics, bank scope and immutable business references. Exclude response-generated journal/event IDs from equality. Treat membership revisions separately as authorization evidence; every retry lookup must reauthorize the actor, and any revoked actor must receive no cross-bank disclosure.

**P1-SEC-OBS-01 — existing harness cannot prove postcommit UNKNOWN.** The shell harness terminates a backend sleeping inside an uncommitted transaction (C3-like). There is no deterministic worker-side barrier after confirmed COMMIT and before response transmission (C4), nor a consumer inbox/outbox publish-before-marker crash (C6). A SQL backend cannot be killed *after its commit* to simulate the HTTP worker crash unless the test architecture explicitly separates application process from PostgreSQL backend and captures the commit acknowledgement. Build an isolated application-process orchestrator and a durable evidence trace.

**P1-SEC-SCOPE-01 — bank scope is database-local only.** posting_command UNIQUE(idempotency_key) is correct only within a genuinely bank-specific database; there is no bank_id column in this lab. Never reuse this schema in a shared database or claim bank-global uniqueness without composite bank keys, RLS and principal fencing.

**P1-SEC-AUTH-01 — no verified OIDC binding.** The function matches member_authority.db_principal to SESSION_USER but does not prove signed token issuer/audience/subject or secure credential routing. This remains an external integration dependency, not proof of trusted bank identity.

## Required correction design (not yet implemented)
1. Preserve existing historical lab migrations and evidence; introduce an isolated 006 experimental fixture, not an in-place production migration.
2. Model operation identity as (verified_bank, operation_type, idempotency_key); unique constraint must match actual tenancy topology. Store canonical_request_digest and immutable posted_journal_id. Ensure atomic operation + balanced journal + outbox COMMIT.
3. Acquire bank-local authorization/revocation fence BEFORE any lookup that could disclose operation existence. For same key/digest return the prior committed journal even when fresh transport-generated IDs are supplied. For same key/different economic digest reject without new posting. For revoked principal reject even for replay.
4. Resolve duplicate-key races with database-enforced uniqueness and bounded retry/lookup; do not mistake a still-running original transaction for FAILED_NOT_COMMITTED. Preserve UNKNOWN until authoritative outcome known.
5. Build A01–A07 using separate worker process and DB connection; C3 termination before COMMIT; C4 kill application worker after confirmed DB COMMIT and before response; C6 publish/marker crash with inbox dedupe. Record PIDs, barrier timestamps, DB row counts, balanced per-currency sums, outbox IDs and evidence checksums.
6. Run twice on clean PostgreSQL 16 fixtures. Negative tests: same key/new UUIDs, changed amount, changed account, concurrent 20 clients, revoked membership, unavailable database, outbox duplicate. No settlement/finality claim.
7. Quality gates: financial invariant, concurrency, auth, operational UNKNOWN recovery, and external audit review. Production DoR remains fail-closed.

## Execution accounting
Registered parent WP attempted: 1 (SEC-TENANT-ROUTING-001). Verified-complete WPs: 0. Open: 1. Newly identified P0 defect: 1. New executable tests run: 0. New ZIP checkpoint: none; this is an intermediate source-audit increment, not a completed batch. Approved global WBS denominator: UNKNOWN. Historical GOV-REC-001 and WP-ACC-005 remain open.

NEXT EXACT TASK: SEC-TENANT-ROUTING-001 — design and implement a disposable 006 idempotency recovery fixture correcting P0-SEC-IDEMP-01/02, first test same key/same economics/new generated IDs and changed economics under two independent connections, then implement C4 postcommit application-worker crash harness; run PostgreSQL 16 and capture actual traces before acceptance.
