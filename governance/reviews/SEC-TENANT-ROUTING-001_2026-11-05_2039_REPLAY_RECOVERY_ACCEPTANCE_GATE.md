# SEC-TENANT-ROUTING-001 — replay recovery acceptance gate (2026-11-05 20:39 Africa/Douala)

Status: OPEN / design-review checkpoint, NOT a production approval. Continuation from main 9452133e67bb25dfa034918e0c2e14ae1456d901; do not replace or re-run LAB-006/007. This is a review of the committed-replay precedence defect documented in governance/reviews/SEC-TENANT-ROUTING-001_2026-11-05_REPLAY_PRECEDENCE_REVIEW.md.

## Decision candidate (requires executable proof)
A bank-local durable operation registry is the sole source for command outcome. Unique key: (bank_id, command_kind, idempotency_key). Store canonical payload digest, authenticated command owner/scope, immutable journal reference, outcome state, creation/commit metadata. A committed operation is retrievable only after current trusted authentication, bank-local authorization, scope and operation ownership checks; a closed posting account must NOT invalidate retrieval of an already committed result. A revoked principal receives denial without existence disclosure; privileged audited recovery requires a distinct explicit permission, not impersonation. A reused key with different digest returns conflict with no journal information. New commands require current account/period validation and a bank-local transactional first-writer fence. A duplicate racing with an in-flight writer must wait/retry deterministically or return UNKNOWN; never post twice.

Do not encode the authorization check as a mutable tenant GUC, do not accept an unverified bank claim, and do not infer external settlement finality from local COMMIT. On lost response, retry must consult the durable operation record, not execute the financial posting path first. The journal and operation record and outbox intent must commit atomically in one PostgreSQL transaction; otherwise the outcome remains UNKNOWN pending reconciliation. Never mark UNKNOWN as failed solely on network timeout.

## Required executable matrix — all pending
R01: original COMMIT then account CLOSED then identical authorized replay => same journal reference, journal count unchanged, outbox count unchanged.
R02: account CLOSED before first request => denied, no journal/outbox.
R03: original COMMIT then owner revoked => deny replay without outcome disclosure; independently authorized recovery principal can retrieve with tamper-evident audit.
R04: same key different economic digest => conflict; zero new postings/outbox.
R05: bank B uses bank A key => independent namespace, zero bank A disclosure.
R06: COMMIT then simulated HTTP response loss => retry recovers exact committed journal after account closure.
R07: two concurrent first writers + concurrent close/revoke => one durable outcome maximum; record transaction isolation, lock order, serialization/retry traces.
R08: crash before COMMIT => no committed journal/outbox; safe retry may become first writer.
R09: outbox dispatcher duplicate delivery => downstream dedup key and event identity prove one economic effect.
R10: token rotation and expired token => current cryptographic identity and membership checks; no stale authorization bypass.
R11: missing operation with uncertain DB/network result => UNKNOWN, no speculative repost.
R12: authorized replay of operation from a previous membership revision => explicitly adjudicated policy; never implicitly bypass current membership.

## Evidence acceptance
Run a disposable PostgreSQL 16 integration harness with actual database principals and transaction boundaries, reproducible setup/teardown, independent row counts and SQLSTATE/error assertions, and CI logs tied to commit SHA. Record per-test pass/fail, account and membership transitions, journal/outbox IDs, interleaving traces and independent reviewer findings. No test is claimed executed here.

## Remaining blockers and controls
P0: production gateway OIDC-to-bank-principal trust boundary, ledger/outbox crash atomicity, revocation/first-writer ordering. WP-ACC-005 statutory 312/322 classification remains quarantined; do not apply disputed taxonomy to production posting/reporting. GOV-REC-001 archival custody and GOV-WBS-RECON-001 accepted denominator remain open. Live rail participation is a deployment-only entitlement, not a vendor software-development prerequisite.

## Run outcome
One registered work package (SEC-TENANT-ROUTING-001) attempted; zero accepted/completed, one open, one P0-blocked from production. This review file is a draft evidence artifact, not a ZIP checkpoint and not a new numbered batch. No executable tests or production code produced in this review.

NEXT EXACT TASK: SEC-TENANT-ROUTING-001 — implement the isolated PostgreSQL 16 R01–R12 harness against a copied experimental schema (never modify historical LAB-006/007), execute and capture CI/SQL traces, and resolve committed-replay precedence without weakening revocation or tenant boundaries.
