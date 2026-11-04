# SEC-TENANT-ROUTING-001 — Review 04: broker capability, revocation and rotation
Date: 2026-11-04 | Status: DESIGN DRAFT, NOT DoR-READY | Parent: review 03 | Source HEAD: 63f24615d74e9f272852a712bc8313a5c7f015b6

## Boundary and assumptions
The API gateway verifies RFC 9068 access tokens, never ID tokens. Institution selection is a resource request, not authorization. The membership authority is an independent control-plane service. The database broker is a privileged component isolated from internet-facing gateways; it alone maps institution IDs to dedicated bank-specific DB principals. No bank can grant itself membership via a request header, token claim, database GUC or broker API. All states and tests below are PROPOSED, not deployed.

## Authenticated broker capability: protocol decision (draft)
1. Gateway verifies token signature, exact issuer, audience, typ, algorithm and temporal claims. It resolves the exact `(issuer, subject, institution, operation, resource)` against the authoritative membership service. Human and service principals are distinct. Authorization is evaluated for each command; maker/checker authorization is evaluated against the persisted initiating actor, not only the request.
2. Gateway sends a mutually authenticated TLS 1.3 request to the broker using a dedicated workload identity. The broker checks the workload identity against an explicit allowlist of issuer/service identities and permitted operations. Never trust forwarded X-Forwarded-* identity headers.
3. A dedicated authorization service issues a short-lived, audience-restricted, single-use signed capability. Its canonical claims: `iss, aud=bank-db-broker, sub=workload-id, jti, iat, nbf, exp, institution_id, actor_ref, issuer_ref, operation, resource_scope, membership_revision, policy_revision, correlation_id, request_digest, authz_decision_id`. The authorization service—not the browser or gateway—constructs the claims after membership validation. Sign using a dedicated asymmetric key in a managed signing boundary; do not reuse API access-token keys.
4. Broker independently verifies mTLS workload identity, signature, exact audience, issuer, expiry, operation and digest binding, revision freshness, and capability one-time use. `jti` redemption is atomic in a durable, highly available replay register with uniqueness on issuer/jti; if the register is unavailable, deny. Capability is bound to the authenticated workload identity, not a transferable bearer token.
5. Broker does NOT accept a raw user JWT as a replacement for the capability. It selects a server-owned institution->vault-reference->DB-login mapping, checks the bank and operation against the capability, obtains an isolated bank pool, and verifies authenticated PostgreSQL SESSION_USER and RLS scope before returning a constrained execution handle. The gateway never receives DB passwords or unrestricted SQL connections.
6. The handle supports only the authorized operation/resource scope and expires on completion or cancellation. No arbitrary SQL; use allowlisted prepared domain commands and parameterized queries. Cross-bank joins, bypass roles, superuser and table-owner runtime roles prohibited.
7. Security logs contain decision ID, pseudonymous actor, bank, workload, key ID, policy revision, lease state and correlation ID; never raw JWT, capability, DB secret or account payload. Append-only protected audit sink; availability failure for mandatory audit events must fail closed for privileged commands.

## Authority consistency and revocation
- Until a maximum tolerated revocation delay is approved and tested, membership is checked authoritatively for each command and again at broker redemption when a policy/membership revision changes. No cache-based grant if the authority is unavailable.
- Membership decision is bound to an explicit revision and decision timestamp. Broker verifies freshness through a protected authority query; a stale or unavailable revision fails closed. Concurrent revocation wins if committed before redemption; if revocation occurs after redemption, long-running privileged operations must reauthorize at a defined checkpoint before irreversible side effects. Race handling requires a linearizable revision read and an auditable ordering point; a mere timestamp is insufficient.
- A revoked member cannot obtain new leases. Active leases must be revoked or forcibly terminated for high-risk permissions; termination does not imply financial reversal. Unknown external outcomes require reconciliation before retry.
- Separate membership states: INVITED, ACTIVE, SUSPENDED, REVOKED, EXPIRED. Only ACTIVE may authorize; version increments on any permission/status change. Deny if institution is SUSPENDED, CLOSED, or in an unauthorized environment.
- A broker outage or stale authority must never fall back to client-supplied tenant identity. Explicitly model degraded read-only service only under a separately approved policy; default DENY.

## Key rotation state machine
PROPOSED -> VERIFIED_IN_STAGING -> PUBLISHED -> ACTIVE -> RETIRING -> REVOKED -> DESTROYED.
- New signing key cannot become ACTIVE before JWKS publication propagation and verification. Old key may remain verification-only during a bounded overlap; a compromised key goes directly to REVOKED with immediate deny and incident response.
- No token-controlled jku/x5u or arbitrary JWKS fetching; pinned issuer metadata and bounded cache. Unknown kid triggers at most rate-limited trusted refresh, never trust-on-first-use.
- Evidence: key custody, dual control, activation time, revocation timestamp, test vectors, audit trail and key material destruction record. Key and membership rollback procedures are not authorization bypasses.

## Database credential and pool rotation
PROVISIONED -> VERIFIED -> ACTIVE -> DRAINING -> REVOKED -> DESTROYED.
- Provision a new per-bank DB login/secret under segregated control, validate RLS and SESSION_USER before enabling traffic. Never assign multiple banks to one runtime DB principal.
- During rotation, new checkouts use VERIFIED new credentials; old connections drain with a bounded deadline, then terminate. Failed cleanup quarantines the pool; no reuse.
- On bank mismatch, role elevation, session reset failure or pool leak: terminate connection, invalidate lease, security alert and preserve minimal evidence. Do not retry financial commands automatically.
- Emergency credential compromise: revoke old principal, close pools, force reauthorization; business continuity may degrade, but cross-bank isolation is non-negotiable.

## Concrete negative-test requirements — T41–T55, UNEXECUTED
T41 capability accepted over TLS without client workload identity => DENY.
T42 capability subject does not match mTLS service identity => DENY.
T43 same jti redeemed concurrently on two brokers => exactly one redemption, other DENY.
T44 replay register unavailable => DENY, no pool checkout.
T45 signed capability digest does not match operation body => DENY.
T46 capability with stale membership revision after revocation => DENY.
T47 membership revocation races broker redemption => ordering-point invariant and no post-revocation new lease.
T48 authority outage after token verification => DENY, no cached entitlement.
T49 expired capability with active bank membership => DENY.
T50 revoked signing key in trusted JWKS cache => DENY after revocation signal; no stale-key acceptance.
T51 unknown kid supplies jku to attacker domain => no outbound fetch, DENY.
T52 bank A credential rotated while bank B requests in flight => no cross-bank principal leakage.
T53 old bank DB login remains usable after drain deadline => test FAIL / operational alarm.
T54 pool reset fails after cancelled transaction => quarantine, no subsequent checkout.
T55 audit sink unavailable for privileged authorization => DENY with no command execution.

## Review loop and unresolved gates
Security: mTLS+capability design is specific, but key custody, distributed replay atomicity and revocation linearizability lack an implementation/evidence plan.
Architecture: issuer, authority and broker ownership clarified; trust-domain deployment topology and service identity lifecycle still open.
Financial: no direct journal posting authority; financial outcomes on cancellation remain UNKNOWN until ledger reconciliation.
Regulatory: this is a technical design, not an assertion of COBAC/BEAC certification. Institution legal profile and retention remain unverified.
Data/privacy: pseudonymous audit fields specified; lawful retention, deletion and cross-border processing need institution profiles.
Resilience: fail-closed paths defined; recovery time, recovery point, availability budgets and DR evidence untested.
QA: T41–T55 are proposed only. No new tests executed in this review.
Auditor: preserve signed decision, revision, lease and key lifecycle evidence; evidence custody/immutability needs independent assessment.
DoR gates 2, 6, 8, 9, 10, 11, 12, 13, 14 remain NOT VERIFIED. No production implementation authorization.

## Primary technical reference pointers (not fresh regulatory certifications)
RFC 9068 https://www.rfc-editor.org/rfc/rfc9068
RFC 8725 https://www.rfc-editor.org/rfc/rfc8725
RFC 8705 https://www.rfc-editor.org/rfc/rfc8705
NIST SP 800-63 https://pages.nist.gov/800-63-4/
OWASP API Security Top 10 https://owasp.org/API-Security/editions/2023/en/0x00-header/

NEXT EXACT TASK: SEC-TENANT-ROUTING-001 — specify and independently review the linearizable revocation/replay authority and signed broker-capability trust topology; derive executable synthetic T41–T55 tests without claiming production DoR.
