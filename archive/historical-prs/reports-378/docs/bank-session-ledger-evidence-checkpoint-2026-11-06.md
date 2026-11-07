# Reporting integration checkpoint — bank-bound sessions and immutable ledger evidence

**As of 2026-11-06. Engineering branch only — draft / NOT ACCEPTED.**

## New implementation

### 1. Trusted bank-specific PostgreSQL session router

- Server-only \`createBankScopedSessionRouter\` in \`src/report-bank-session-router.js\`.
- Caller cannot select institution, database role, hostname, password or raw SQL.
- The router resolves a subject/issuer from an independently controlled bank-actor binding store, loads a role-scoped secret, and starts a **dedicated, directly authenticated PostgreSQL session**.
- It checks the actual \`SESSION_USER\`, rechecks binding version/active/expiry after establishing the session, and allows only the three defined review-function queries.
- On denial it releases the connection; repeated release is idempotent; the wrapper is unusable afterwards.
- A clear production TLS server verification contract exists. Non-TLS is permitted only for the disposable PostgreSQL CI lab (\`NODE_ENV=test\`, \`opes_test\`, localhost). The connector itself must independently verify the TLS peer and use a secret store.
- The existing application review store and maker-checker API remain fail-closed. No public HTTP route is bound to the router.

### 2. Actual OIDC → PostgreSQL integration test

The PostgreSQL 16 GitHub Actions lab now invokes \`tests/12_node_oidc_pg_integration.mjs\` using \`pg@8.16.3\` on a **disposable database**. It constructs ephemeral Ed25519-signed OIDC access tokens and exercises:

1. Token signature/issuer/audience/expiry validation.
2. Separate trusted bank-actor identity mapping and CI-only role secret retrieval.
3. A dedicated authenticated PostgreSQL role, including \`SESSION_USER\` and \`session_scope()\` cross-check.
4. Bank A maker submission and independent Bank A checker approval (no publication).
5. Bank B denial when attempting to load/review the Bank A report, despite a forged bank claim in the signed test token.
6. Token tampering rejection and binding revocation denial.

This is a **real PostgreSQL integration test with synthetic figures**, not an operational identity provider, deployment or banking authorization grant.

### 3. Independent ledger source verification

\`src/report-ledger-evidence.js\` defines an immutable bank/branch/currency/period/revision-scoped canonical SHA-256 over posted journal lines. It verifies that a signed source manifest's digest matches a freshly loaded immutable journal, and separately checks independent trial-balance evidence using strict double-entry and per-account comparison.

The evidence adapters require different ledger and trial-balance source identities, immutable/closed revisions, matching reconciliation references, and bank/currency isolation. Source records never leave the backend via the readiness result. The existing Ed25519 source-signature verifier can consume these \`verifyDigest\` and \`verifyLineage\` callbacks.

**Important:** Read-only journal and independent trial-balance functions remain injected source contracts — no actual bank ledger data-plane, custodian, KMS, or regulatory mapping authority is connected. An independently supplied expected balance is not proof of its regulatory correctness.

## Unfinished P0 acceptance

- Deploy a real verified OIDC issuer/JWKS lifecycle and bank-owned role/secret store, including rotation/revocation under load and fully isolated institution data planes.
- Wire genuine read-only ledger and trial-balance sources with immutable revision seals, signatures, bank-scope enforcement, independent reconciliation custody and period close.
- Run crash recovery, bank role/credential rotation, multi-node concurrency, cross-bank access and penetration tests against a production-like topology.
- Prove bank-specific accounting/PCEC and regulatory formula mappings with controlled legal reference and effective date, independent approved golden records and maker-checker.
- Complete official report issuer, signature, retention/WORM, privacy, accessibility, EN/FR translations and audit certification.
- Close unresolved tenant replay/ledger P0 findings in the separate core platform security programme.

**Release policy:** 378 report prototypes and 3,780 acceptance gates remain **0 certified live reports**. No official PDF/CSV, regulator submission, posting, settlement or real customer data ingestion is activated. Never treat a passing lab build as proof of production bank safety.
