# SEC-TENANT-ROUTING-001 — Source-boundary review 09 (2026-11-06)

Status: IN_PROGRESS; P0-SEC-01/P0-SEC-02 OPEN. Evidence is static source inspection, NOT executed integration tests or production approval.

## Provenance
Inspected GitHub main b8921235735be7317681739e10299121812a07a0 and canonical state, evidence gate 08, ADR-OPES-003, and the following exact files:
- engineering/security/token-router/router.py (synthetic token verifier and bank route selector)
- engineering/security/tenant-routing/authority.py (single-PostgreSQL membership lock laboratory)
- engineering/labs/security-ledger/008_committed_replay_runner.sh (committed retry SQL laboratory)
- governance/reviews/SEC-TENANT-ROUTING-001_INTEGRATION_ACCEPTANCE_PLAN_07_2026-11-06.md

## Material implementation gap discovered (P0-SEC-02)
`PinnedBankRouter.memberships` is keyed by `(issuer,subject)` and `authorize()` retrieves exactly one membership before checking `institution_path_id`. A person with legitimate membership in **two distinct banks** cannot be represented by that map without overwriting one membership. This is a concrete data-model limitation for the multi-institution product; it is not proof of cross-bank data exposure. A replacement must use an authoritative bank-scoped lookup such as `(institution_id,issuer,subject)`, with server-controlled institution directory, and must test two valid memberships, one revoked membership, forged bank headers, conflicting tenant claim, and missing bank principal. The caller-selected path is an untrusted *request*, never an authorization grant.

## Boundary and crash consistency
The router returns `TenantRoute` but does not establish a real HTTP gateway, mTLS workload identity, broker credential exchange, bank-local PostgreSQL session or durable command result. The authority laboratory uses a separate psycopg connection with a synthetic effect and cannot be composed with the router by assertion alone. LAB-008 exercises committed retry using a reusable idempotency key and asserts one operation, one outbox row, two balanced journal lines; it does NOT kill a gateway after COMMIT before reply, and does not prove an HTTP-level UNKNOWN recovery contract.

## Acceptance requirements for the next bounded engineering slice
1. Preserve the existing single-bank test behavior while adding a two-bank same-subject fixture and bank-scoped membership directory. Never choose a principal from a client header, JWT institution claim or mutable GUC.
2. Add a real test HTTP boundary that verifies signed OIDC access tokens and rejects malformed issuer/audience/kid/algorithm/expiry before broker checkout; use only disposable keys and databases.
3. Broker authenticates workload separately and maps verified bank to an allowlisted, dedicated DB principal; verify `session_user` and bank-local membership in PostgreSQL 16, with no fallback principal.
4. Persist command digest, terminal result, balanced journal and outbox atomically; simulate process termination *after durable COMMIT and before HTTP response*, then query by original bank-scoped command ID and prove exactly one journal and one outbox record.
5. Exercise cross-bank negative cases, credential rotation and revoked membership; keep global revocation PENDING until bank-local durable acknowledgment. External timeout must remain UNKNOWN.
6. Capture immutable commit, command, CI run, PostgreSQL version, test output, durable row counts and crash injection location. No test is passed until executed.

## Quality review
Architecture: multi-bank membership representation inadequate in synthetic router. Security: real gateway/broker/workload trust and credential rotation missing. Financial: LAB-008 is narrower than T06. Regulatory: COBAC 312/322 quarantine unchanged. Operations: postcommit UNKNOWN and global revoke propagation unproven. Audit: no real-boundary evidence. No new production DoR gate closed, no accepted WP and no batch ZIP issued for this still-open package.

## NEXT EXACT TASK
SEC-TENANT-ROUTING-001: correct the bank-scoped multi-membership identity model in a disposable integrated gateway/broker/PostgreSQL-16 test slice; execute T01/T02 and a real post-COMMIT/pre-HTTP-reply T06 crash/replay proof with immutable CI evidence before reconsidering P0-SEC-01/P0-SEC-02.
