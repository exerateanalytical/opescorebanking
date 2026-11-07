# Six live control-record modules — frontend operational routes

**Runtime:** React 19/TypeScript 7; server Java 25/Spring Boot/PostgreSQL 16.

- `/operations` and `/operations/{gov|arc|tst|inf|dr|rel}`: scoped module pages
- Configured OIDC authorization code + PKCE with state, nonce, short-lived tokens in memory
- Bank is selected by deployment configuration, not by untrusted browser input
- `CREATE`, `SUBMIT`, independent `DECIDE`, `RETIRE`, scoped `LIST`, `READ`, `HISTORY` routed to bank-bound Spring Boot APIs
- No fabricated records or balances, no automatic release deployment, no external execution
- Response-uncertainty retry keeps the SAME item ID and idempotency key within page lifetime
- No tokens in localStorage/sessionStorage; sessionStorage temporarily holds the PKCE verifier and state only

**Required deployment settings:**

```text
VITE_OPES_BANK_ID=<institution UUID>
VITE_OPES_OIDC_ISSUER=https://...
VITE_OPES_OIDC_CLIENT_ID=<public SPA client>
VITE_OPES_OIDC_AUTHORIZE_URL=https://.../protocol/openid-connect/auth
VITE_OPES_OIDC_TOKEN_URL=https://.../protocol/openid-connect/token
VITE_OPES_API_BASE=<empty for same-origin secured API reverse proxy>
```

OIDC public client must enforce approved exact redirect URI `https://<staff-origin>/auth/callback` and Authorization Code + PKCE S256. Same-origin HTTPS is preferred; no CORS wildcard. Backend validates JWT issuer/audience and SQL role + signed command; no browser data is considered authoritative.

**Remaining pre-deployment controls:** reverse proxy/TLS/session gateway, approved evidence store/issuance, database operator proof key rotation, browser security and pentest, legal/regulatory review and application monitoring. These six modules manage records and decision evidence; they do not trigger real bank settlement, actual infrastructure monitoring, automated DR restores, or release deployment.
