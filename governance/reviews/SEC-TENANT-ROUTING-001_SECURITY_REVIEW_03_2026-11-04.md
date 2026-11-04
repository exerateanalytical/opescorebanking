# SEC-TENANT-ROUTING-001 — Authorization and credential-binding decision (review 03)
Date: 2026-11-04. Status: DESIGN REFINED; P0 implementation gate OPEN. Supersedes the ambiguous "verify JWT" statement in the initial checkpoint, not its history.

## Decision A: resource-server token contract
Banking APIs accept only **RFC 9068 JWT access tokens**, typ `at+jwt` or `application/at+jwt`, with strict configured issuer, resource audience, subject, client_id, issued-at, expiry and unique jti. ID tokens are categorically rejected; an OIDC login session is not an API authorization credential. The gateway must verify signature against the exact issuer's pinned JWKS origin, allowlisted asymmetric algorithms, key usage and time constraints; reject unsigned/unknown/ambiguous key, duplicate JSON fields, unsupported critical headers and token-controlled remote key URLs. Validate audience as a resource identifier, not the frontend client ID. No default wildcard issuers or audiences. Scope is necessary but not sufficient for tenant access. Enforce exact issuer and subject namespace pair.

For any opaque tokens, a **separate versioned ADR and introspection profile** is required before acceptance; this decision does not silently support opaque tokens. Client-credentials subjects are service principals and cannot inherit human entitlements.

## Decision B: tenant-membership and credential broker
1. A validated access token produces `(issuer,subject,client_id,token_jti,token_exp)`; no tenant authority is accepted from token claims or request headers.
2. Request institution identifier is a **requested resource selection only**. A server-owned membership authority resolves `(issuer,subject,selected_institution)` to ACTIVE membership, permitted role/operation, status and policy revision. Check the requested bank is active and the actor is authorized for that exact operation, including maker/checker separation where applicable.
3. Revocation and membership-version freshness MUST be verified using an authoritative strongly consistent lookup or a documented bounded-freshness mechanism with a risk-accepted maximum revocation latency. Until latency is established and tested, **use an authoritative lookup per authorization**. Unavailable authority => deny, no DB checkout.
4. Broker accepts only a server-generated, authenticated, single-use/short-lived authorization context bound to institution, principal, operation and correlation ID; it **never accepts a client bank header as broker authority**. Context integrity and expiry must be verified at the broker, including protection from replay. Broker maintains immutable institution -> vault secret identity -> database login mapping under privileged provisioning controls.
5. Select a **bank-specific** connection pool with a distinct database login. Verify actual PostgreSQL `SESSION_USER` maps to the intended institution on each checkout; reject owner/superuser/BYPASSRLS and cross-bank role grants. Any mismatch => terminate connection, revoke broker lease, alert, no query.
6. No SQL executes until both the gateway authorization and DB principal checks succeed. Rollback/reset/discard connections after every request; prove no cross-bank session leakage under concurrency and cancellation. Treat connection reuse and credential rotation as explicit state machines.
7. Separate vendor control plane from bank data plane and education sandbox. Never allow education credentials or simulated institutions into production data plane.

## Denial/error state machine
TOKEN_REJECTED -> 401 invalid_token -> no membership lookup or DB checkout.
TOKEN_VALID -> MEMBERSHIP_LOOKUP -> (UNAVAILABLE|REVOKED|NOT_MEMBER|WRONG_SCOPE) -> 403/503 as appropriate, no DB checkout.
AUTHORIZED -> BROKER_CONTEXT_ISSUED -> (EXPIRED|REPLAY|BANK_MISMATCH) -> fail closed, security event, no query.
BROKER_VERIFIED -> POOL_CHECKOUT -> (ROLE_MISMATCH|RESET_FAILURE) -> terminate connection and alert.
CONNECTION_VERIFIED -> OPERATION -> (TIMEOUT|CANCEL|DB_ERROR) -> rollback, reconcile side effects if applicable, never assume unknown financial outcome is safe to retry.
SUCCESS -> release connection only after verified cleanup; append privacy-minimized decision evidence.

## Financial and regulatory boundary
This is non-monetary security architecture. It cannot post journals or grant ledger privileges; all financial commands still require separate ledger authorization, idempotency and reconciliation. Institution profiles and legal retention obligations remain effective-dated. No COBAC or BEAC compliance certification is implied.

## Acceptance matrix extensions (UNEXECUTED)
- T26 ID token with correct issuer and valid signature but `typ=JWT` -> reject before membership.
- T27 JWT access token audience equals frontend client only -> reject.
- T28 Two subjects share same `sub` across distinct issuers -> no membership collision.
- T29 Valid token for institution A plus header institution B -> deny unless separately authorized for B.
- T30 Revoked bank A membership with valid unexpired access token -> deny before checkout.
- T31 Membership authority outage -> fail closed, no cached grant unless explicit approved bounded-freshness profile.
- T32 Broker replayed context -> reject second checkout.
- T33 Bank A context routed to bank B pool -> terminate and alert.
- T34 DB role has BYPASSRLS or ownership -> reject pool initialization.
- T35 Concurrent request cancellation followed by bank switch -> no stale session or prepared state.
- T36 Vendor administrator token on bank customer API -> deny absent explicitly scoped institution grant.
- T37 Education token on production API -> reject.
- T38 Signing-key rotation with old kid removed -> reject old token when key no longer trusted.
- T39 Untrusted jku/x5u URL -> no outbound fetch.
- T40 Access token expired during privileged operation -> operation policy requires fresh authorization before new command; never retroactively claim financial rollback.

## Independent quality review
Security: clearer token-type boundary; key rotation and broker lease tests open.
Architecture: control/data-plane ownership defined; trusted context transport mechanism open.
Accounting: no direct posting authority; financial command idempotency remains independent.
Privacy/audit: pseudonymized actor, issuer, bank, policy version, decision and correlation; never raw token or secret.
Operations: membership outage, vault outage and connection cleanup fail closed; recovery runbook and SLO not yet evidenced.
Regulatory: primary technical RFC verified; institution-specific legal controls remain separately open.
QA: acceptance scenarios defined, **none executed in this review**.
**DoR: FAIL** gates 2, 6, 8, 9, 10, 11, 12, 13 and 14 remain incomplete/partial. Do not start production gateway implementation.

## Primary references
- https://www.rfc-editor.org/rfc/rfc9068 (JWT access-token profile)
- https://www.rfc-editor.org/rfc/rfc8725 (cross-JWT confusion, audience)
- https://openid.net/specs/openid-connect-core-1_0.html (ID tokens)
- https://owasp.org/API-Security/editions/2023/en/0x00-header/

NEXT EXACT TASK: SEC-TENANT-ROUTING-001 — define authenticated broker-context transport, membership authority consistency/revocation contract and key/pool rotation state machines, then independently review DoR and prepare synthetic negative-test harness.
