# SEC-TENANT-ROUTING-001 — bank-scoped membership correction contract (2026-11-07)

Status: IN_PROGRESS / DESIGN REVIEW; not a completed work package, not a new numbered batch, not production DoR acceptance.

## Verified starting point
Authenticated GitHub main at inspection: `2c88b53850c821db134ea24d8bb143be02c82144`. Source inspected: `engineering/security/token-router/router.py`, `engineering/security/tenant-routing/authority.py`, and review 09. The existing router indexes `memberships[(issuer, subject)]` and then compares its single result against the requested bank. This prevents simultaneous legitimate membership in banks A and B for one OIDC subject. The separate authority laboratory uses a UUID membership ID and a PostgreSQL row lock; no proven identity-to-membership bridge exists between these components.

## Proposed bounded correction (NOT YET IMPLEMENTED)
1. Use an immutable authoritative directory keyed by `(institution_id, issuer, subject)` or a validated equivalent membership ID with a uniqueness constraint on that triple. Reject duplicate and contradictory records during directory load; never silently overwrite.
2. Validate the institution UUID against a server-managed bank directory before membership lookup. The requested bank path is a selector only; never infer authority from a header or unverified JWT claim.
3. Verify token signature, pinned issuer, audience, algorithm, type, key ID, expiry, issued-at, not-before, unique JTI and requested scope before querying any bank principal. Check the selected bank's active membership, revision and permission independently. A bank-specific token claim, when present, MUST match the selected bank; absence may be permitted only by an explicitly reviewed token profile.
4. Select only the bank-scoped principal from a trusted server-side mapping; refuse missing principal, duplicate principals, unknown bank, revoked membership and stale revision. No fallback tenant, shared privileged principal, or caller-controlled SQL role.
5. Define a durable bridge from verified `(issuer,subject,institution_id)` to bank-local membership ID and a separate workload-authenticated credential broker. Never equate the current in-memory membership to the PostgreSQL membership lock by assumption.

## Required executable acceptance matrix
| ID | Scenario | Required observation |
| --- | --- | --- |
| T01-A | Same subject active in bank A and B | A path routes only A principal; B path routes only B principal |
| T01-B | Bank A revoked, B active | A denied; B remains authorized with independent revision |
| T01-C | Unknown bank, unknown subject, duplicate directory row | Fail closed before principal checkout |
| T01-D | Forged X-bank/X-tenant/X-db-principal headers | Denied; no principal checkout |
| T01-E | Signed token bank claim conflicts with selected path | Denied even if membership exists |
| T01-F | Missing bank principal or principal reused by two banks | Fail closed at configuration/authorization |
| T02-A | Invalid signature, issuer, audience, kid, alg, typ, exp, nbf, iat, jti | Denied before DB checkout; audit reason without token leakage |
| T02-B | Credential rotation while requests are in flight | Old credential cannot acquire new session after revocation; existing sessions fenced per documented policy |
| T02-C | Revocation concurrent with posting attempt | No post-revocation authorization; global status remains PENDING until bank-local durable acknowledgment |
| T06-A | Durable COMMIT succeeds, process killed before HTTP reply | Client sees UNKNOWN; retry with same bank-scoped command ID returns persisted terminal result; exactly one journal and outbox record |
| T06-B | Same key, changed payload or different bank | Reject collision; no second financial effect |
| T06-C | Commit outcome genuinely unknown due to DB/network fault | No invented success/failure; reconcile durable command state before retrying side effects |
| T06-D | Outbox publisher retries after crash | Consumer deduplicates by stable event identity; no duplicate posting or external-finality assertion |

## Evidence required to close this package
A disposable real HTTP gateway + pinned test OIDC signer + authenticated broker + PostgreSQL 16 bank-local principal boundary; exact migration and schema; reproducible test commands; injected crash point after commit; row-level journal/outbox counts and balanced sums; session_user and authorization evidence; credential-rotation logs; CI run URL, immutable commit SHA, test output and independent review. Static source inspection and synthetic unit tests alone cannot close T01/T02/T06.

## Quality review / fail-closed decision
Security: existing one-membership index is a P0-SEC-02 multi-bank correctness defect; no evidence of actual leakage. Financial: durable command result and post-commit UNKNOWN contract remain unproven. Architecture: bridge to bank-local membership and broker absent. Regulatory: WP-ACC-005 COBAC 312/322 mapping remains quarantined. Operations: credential rotation and crash recovery unproven. Audit: no executed real-boundary test in this review. Preserve P0-SEC-01 and P0-SEC-02 OPEN; production DoR NOT VERIFIED; no production implementation authorization.

NEXT EXACT TASK: SEC-TENANT-ROUTING-001 — implement and test the bank-scoped membership directory correction in the disposable router laboratory first (T01-A through T01-F), then construct the real gateway/broker/PostgreSQL boundary and execute T02/T06 before any production promotion.
