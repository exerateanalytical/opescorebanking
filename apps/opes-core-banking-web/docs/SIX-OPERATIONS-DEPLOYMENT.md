# Six-module staff web deployment

Build-time Vite configuration (never contains secrets):

```
VITE_OPES_BANK_ID=<institution UUID>
VITE_OPES_OIDC_ISSUER=https://...
VITE_OPES_OIDC_CLIENT_ID=<public PKCE client>
VITE_OPES_OIDC_AUTHORIZE_URL=https://.../authorize
VITE_OPES_OIDC_TOKEN_URL=https://.../token
VITE_OPES_API_BASE=<empty for preferred same-origin API gateway>
```

The public OIDC client must be registered for exact `https://<staff-app-host>/auth/callback` redirect and S256 PKCE. No implicit grant, client secret, or persistent browser token is used. Deploy via trusted TLS/reverse proxy; configure CSP to include the trusted IdP authorization/token origins as appropriate. Proxy `/v1/banks` requests to the Spring Boot service with strict request body limits and no wildcard CORS.

A true bank user can sign in, select GOV/ARC/TST/INF/DR/REL, create typed records, list, open, submit with verified proof, get an independent decision, retire, and read immutable history. Evidence files are uploaded as private immutable binary records with SHA-256, and independently approved before decisions use their UUIDs. Server-side institution membership and SQL grants decide every operation. No test users, default bank or fictitious financial results.

The front-end still requires a human-run browser acceptance audit on supported devices and live IdP setup, accessibility review, threat model, incident/DR runbook, and institution acceptance before production operation.
