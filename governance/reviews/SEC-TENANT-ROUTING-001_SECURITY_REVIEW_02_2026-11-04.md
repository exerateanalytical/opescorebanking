# SEC-TENANT-ROUTING-001 — Security and architecture review 02
Date: 2026-11-04. Status: IN_PROGRESS, NOT DoR-approved. Reviewed previous SPEC.md and CONTRACT.json at remote main 1320afd2a0aa3af497ccf826bf993e8fd36f3f60.

## P0 discovery: authentication token type confusion
Previous draft says “verify JWT” without differentiating **OAuth 2.0 access tokens** from OIDC **ID tokens**. ID tokens are for relying-party authentication, not automatically valid bearer authorization for a banking resource server. Accepting an ID token with the wrong audience/token profile could permit token substitution. Before implementation specify the supported access-token profile (JWT access token with issuer-specific type/claims and strict resource audience, or opaque token introspection); reject ID tokens at the banking API. Do not silently infer authorization from successful OIDC login.

## P0 discovery: membership authorization and DB login are not equivalent
An authenticated PostgreSQL SESSION_USER to institution binding prevents cross-bank RLS leakage *only if* the trusted service-to-bank credential broker cannot be tricked into selecting another institution's login. A JWT subject does not by itself prove bank membership. Define server-owned (issuer, subject, institution, membership status, permissions, version, effective window) binding; request institution is an object selection only, never authority. Require policy version freshness/revocation, deny on unavailable membership authority, enforce SoD and bank status. Authenticate service-to-DB connections with separate secrets and audit their checkout. PostgreSQL RLS is defense-in-depth, not a substitute for gateway authorization.

## P1 discovery: issuer/JWKS lifecycle incomplete
Pin issuer exact URL, discovery origin and JWKS URI by configuration; do not dereference token-supplied jku/x5u. Enforce explicit allowlisted asymmetric algorithms and key-use, reject ambiguous/multiple matching kid, duplicate JSON claims, invalid crit, unsigned tokens and issuer/audience mismatch. Specify bounded JWKS refresh, stale-key policy, key rotation, cache poisoning protections, TLS verification, denial on unknown kid, and operational alarm thresholds. Do not treat a JWKS fetch failure as permission to bypass signature verification.

## P1 discovery: pool identity and privilege
Separate pools and secret identities by bank and environment. Verify authenticated SESSION_USER on **every checkout**; never rely on SET ROLE as bank identity. Transactions must rollback, session settings reset, prepared statement and temp-state isolation verified before reuse; discard on reset failure. DB owner/superuser/BYPASSRLS prohibited for runtime. Connection broker must prevent confused-deputy cross-bank selection. Test role inheritance and privilege graph explicitly.

## P1 discovery: audit/privacy and failure semantics
Define append-only/tamper-evident security decision events with correlation ID, actor pseudonym, issuer, tenant, policy version, decision, key version and denial category; never log bearer tokens, signing material, PII or DB credentials. Timeouts and dependency outages must fail closed. No cross-bank data in error details. Alert on pool mismatch, denied bank switching, revoked membership and suspicious token-kid patterns. Define retention from applicable deployment profile, not invented universal years.

## DoR review (15 gates)
1 scope/boundary: PARTIAL; 2 institution/regulatory profile: OPEN; 3 regulatory provenance: PARTIAL (security standards, not legal certification); 4 invariants: PARTIAL; 5 workflows/failures: PARTIAL; 6 roles/SoD: OPEN; 7 accounting: NOT APPLICABLE to this non-monetary security boundary, but ledger access must remain denied; 8 security/privacy/audit: OPEN; 9 contracts/retries: OPEN; 10 data lifecycle: OPEN; 11 executable tests: PLANNED, not run for gateway; 12 operations: OPEN; 13 dependencies: PARTIAL; 14 P0: FAIL (token type confusion and credential broker authorization); 15 repository: PASS.
**Gate result: NOT READY for production implementation.**

## Updated acceptance additions (not executed)
T16 Valid OIDC ID token presented as API bearer -> 401, no DB checkout.
T17 Access token with valid signature but wrong resource audience -> 401.
T18 Duplicate issuer/audience JSON keys or unsupported crit -> 401.
T19 Stale/revoked membership despite valid access token -> 403.
T20 Unknown kid while JWKS unavailable -> fail closed, no DB checkout.
T21 Two different bank memberships on same subject: selection requires server-verified membership and explicit requested bank; no default escalation.
T22 DB login is owner/BYPASSRLS or has cross-bank role membership -> deployment gate fails.
T23 Checkout/return session state contamination -> discard pool connection.
T24 Education/sandbox issuer access token to production resource -> 401.
T25 Untrusted x5u/jku or kid injection attempt -> reject without network fetch to attacker URI.

## Source provenance (engineering standards, not COBAC legal claims)
- IETF RFC 8725 JWT BCP sections 3.1, 3.8–3.12: https://www.rfc-editor.org/rfc/rfc8725
- OpenID Connect Core 1.0, ID token validation (distinct from OAuth resource authorization): https://openid.net/specs/openid-connect-core-1_0.html
- OAuth JWT access-token profile RFC 9068: https://www.rfc-editor.org/rfc/rfc9068
- OWASP API Security 2023: https://owasp.org/API-Security/editions/2023/en/0x00-header/

## Decision
Do not close SEC-TENANT-ROUTING-001 or issue production-ready claim. Fix P0 token-profile and broker-authority contract, then review key lifecycle, database pool and negative-test harness. No production code or financial transaction logic is authorized by this review.
