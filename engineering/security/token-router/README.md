# OPES Core Banking — Pinned-JWKS, tenant-subject routing proof

**Non-production security laboratory.** This is a cryptographically signed-token validator and a bank-specific database-principal *selection* model, not an HTTP gateway, pooled database connection broker, live credential manager, mTLS capability issuer or financial authorization fence.

## Security design
- Parse signed JWT access tokens with PyJWT; pin trusted OIDC issuer, expected API audience, allowed `RS256`, known `kid`-to-RSA JWKS keys, required `iss,aud,sub,exp,iat,nbf,jti`, `at+jwt` type and max 5-minute token lifetime.
- Forbid token-controlled key URLs (`jku/x5u`), embedded `jwk`, `crit` and remote key discovery. The trusted issuer JWKS arrives via offline-controlled configuration, not via an untrusted URL.
- A validated token alone cannot grant bank access. Derive tenant and permission from an authoritative **server-side** membership record keyed by `(issuer,subject)`. Require the bank path ID to match it. Only then select a preconfigured per-bank DB login, without returning credentials.
- Never trust `X-Institution-ID`, `X-Tenant-ID`, `X-Bank-ID`, `X-DB-Principal` request headers or the token's self-asserted institution claim.
- No bearer access token grants permission for irreversible journal posting; that requires the separate fenced authority protocol and 15 DoR controls.

## Negative tests
20 unittest cases use a freshly generated RSA private/public key pair for each CI process. Cases include tampered signature, unknown kid, attacker-supplied key URLs, invalid type/algorithm, expired/future tokens, tenant/path mismatch, wrong issuer/audience, revoked/unrecognized membership and missing permissions. No private key or real bank identity is shipped in source.

## Open risks
- Production JWKS rotation and KMS custody, issuer discovery allowlists, revocation epochs/short-lived membership cache, persistent member authority lookup, distributed consistency, OIDC nonce/exchange semantics, and high availability.
- Binding selected bank principal to an **authenticated** PostgreSQL connection pool with pool reset, credential rotation, workload certificate mTLS and compromised-secret response.
- Cross-service revocation-versus-irreversible-command order, already documented in SEC-TENANT-ROUTING-001 review 05. The one-DB synthetic authority tests do not prove distributed behavior.
- Threat model, operational audit, performance, fault injection, formal review. Not production DoR-ready.

Sources: [RFC 8725 JWT BCP](https://www.rfc-editor.org/rfc/rfc8725), [OWASP API Security Top 10](https://owasp.org/API-Security/editions/2023/en/0x11-t10/).
