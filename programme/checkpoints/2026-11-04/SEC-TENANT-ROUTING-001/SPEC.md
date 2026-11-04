# SEC-TENANT-ROUTING-001: Identity-to-bank database routing security design
Status: DRAFT DESIGN DELIVERED; NOT production DoR-complete. Parent CI 41858116656 PASSED SQL role isolation, not JWT authorization.
## Trust chain
1. Verify JWT signature using allowlisted issuer JWKS, pinned algorithms, issuer, audience, expiry, not-before and subject. Reject token-provided jku/x5u and unknown signing algorithms.
2. Resolve issuer+subject to active server-side bank membership; never trust institutionId from path, header or token as authorization. Check granular permissions, expiry, revocation and SoD.
3. Map verified membership to bank-specific credential via protected server configuration. Never select DB credentials from unverified request data.
4. Verify PostgreSQL authenticated SESSION_USER on pool checkout against bank route. Partition connection pools by bank, rollback/reset on return, and discard mismatched principals.
5. Deny access if JWKS, membership store or credential broker is unavailable; never fall back to client-controlled GUC. Redact secrets, tokens and PII from audit logs.
6. Vendor administration requires separately authorized time-limited audited access. Education Edition must remain isolated with synthetic data and no production rail credentials.
## Fifteen adversarial acceptance tests
T01 Bank A JWT + Bank B path -> 403/404, no Bank B connection.
T02 Invalid signature -> 401.
T03 alg=none -> 401.
T04 Wrong issuer/audience -> 401.
T05 Revoked membership -> 403.
T06 Unknown kid or untrusted jku -> 401.
T07 Unbound DB login -> zero visible rows (earlier SQL CI PASSED).
T08 Cross-bank pool reuse -> deny and discard.
T09 Vendor support without bank authorization -> 403.
T10 Education identity to production bank -> deny.
T11 Membership store outage -> 503, no connection.
T12 Forged Bank B GUC under Bank A authenticated SQL login -> Bank A only (earlier SQL CI PASSED).
T13 Expired bank membership -> 403.
T14 Maker/checker bypass -> 403.
T15 DB route points to unexpected login -> deny, alarm and discard.
## Quality and DoR review
Regulatory: no claim of authorization; customer bank deployment-specific duties remain. Financial: no money movement. Security: JWT verification and routing code absent. Data: per-bank keys/retention remain open. Operations: pool mismatch alerts required. Audit: record actor hash, issuer, bank, policy revision, decision and correlation. Testability: T07/T12 only previously evidenced; new gateway tests unexecuted. **Production implementation NOT READY**.
References: https://www.rfc-editor.org/rfc/rfc8725 ; https://www.rfc-editor.org/rfc/rfc7517 ; https://owasp.org/API-Security/editions/2023/en/0x00-header/ .
