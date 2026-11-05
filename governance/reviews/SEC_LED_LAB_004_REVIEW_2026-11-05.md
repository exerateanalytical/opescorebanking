# SEC-LED-LAB-004 — independent source review (2026-11-05)

Status: REVIEW OPEN; synthetic PG16 lab only. Baseline main e23afa2f25f02e54e35f7bf6769688a872be6dff. Source reviewed: engineering/labs/security-ledger/004_bank_local_atomic_posting_lab.sql and remote archive manifest. No tests executed in this review; prior CI run 41942320193 is separately recorded in the manifest.

## Verified source observations
- The posting function is SECURITY DEFINER, owner opes_lab_executor (NOLOGIN), and restricts direct public EXECUTE; deployment must explicitly grant bank login EXECUTE.
- Authorization locks member_authority FOR UPDATE before inserts, requires ACTIVE, can_post, expected revision and SESSION_USER match; this is a bank-local synthetic fence, not token issuer verification.
- Each line validates integer minor units, a single positive side, currency and active account; total debits equal credits. Journal, command and outbox inserts occur within the calling PostgreSQL transaction.
- Existing-command retry checks request digest and returns existing journal; an idempotency-key collision with a *different* command_id is a unique-constraint failure rather than a normalized domain error. Caller must classify this as conflict, not retry as a fresh payment.

## P0/P1 acceptance gaps — do not infer production readiness
1. P0: no proven end-to-end cryptographic OIDC subject-to-membership-to-SESSION_USER binding or credential issuance/rotation; the function trusts a pre-provisioned member row.
2. P0: no evidence of crash/reconnect/unknown-outcome reconciliation through a durable command query API and outbox delivery acknowledgement; DB atomicity alone is insufficient for externally observed finality.
3. P0: no independently verified maker-checker and transaction-limit authorization; lab explicitly excludes these.
4. P1: retry request digest includes raw JSON array representation and generated identifiers. A caller retrying the same business operation with a different event/journal UUID will conflict; define a stable canonical business-command identity and byte-exact canonicalization.
5. P1: confirm that CREATE/ALTER/GRANT, function-owner privileges, role inheritance and schema search_path are deployment-restricted, including denial tests for all non-service principals.
6. P1: currency minor-unit scale and permitted ISO currency versions must be profile-configured; numeric minor units do not establish correct currency exponent or accounting policy.
7. P1: test concurrent account close/revocation, duplicate command with different key, duplicate key with different command, outbox failure rollback, statement timeout, deadlock retry, and connection loss after COMMIT.

## Acceptance / next continuation
Do not close SEC-TENANT-ROUTING-001 or LED production DoR. Next exact task: **SEC-TENANT-ROUTING-001 / token-principal integration test** — implement a synthetic issuer/gateway-to-dedicated-bank-login binding harness, with negative cross-bank, revoked membership, credential mismatch and post-COMMIT unknown-outcome cases; execute PostgreSQL 16 CI and archive evidence before any production claim. Keep the COBAC 312/322 external mapping quarantined, without blocking neutral ledger engine work.

This review is a documentary checkpoint only, not a verified-complete WBS package or a numbered batch ZIP.