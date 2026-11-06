# OPES Core Banking production-source deployment runbook

## Build
- JDK **25 LTS** and Maven 3.9+, pinned Spring Boot **4.1.2**: `mvn -B -ntp clean verify`.
- The server fails startup unless `OPES_OIDC_ISSUER`, `OPES_OIDC_JWKS_URI`, `OPES_OIDC_AUDIENCE`, and `OPES_BANK_CREDENTIALS_FILE` are configured.
- No default customer, bank, permission, app-role, TLS bypass, or payment-rail simulator exists.
- Endpoints: `POST /v1/banks/{bankId}/ledger/journals` and `GET /v1/banks/{bankId}/ledger/commands/{commandId}`. Exact `Idempotency-Key` UUID header must equal `commandId` payload. Commands never represent external settlement.

## Separate migration boundary
The application runtime must NEVER connect as migration owner or database superuser. Migrations `src/main/resources/db/migration/V1__bank_scoped_posted_ledger.sql` and `V2__bank_authorized_post_command.sql` require an audited dedicated deployment job. Keep a versioned checksum and controlled recovery plan; rehearsal/test both upgrade and rollback before live release. Migration owner must be `NOSUPERUSER NOBYPASSRLS` and must own `opes_core` schema/functions. Financial/legal approval of the migration remains pending. All source paths in `ci/` are **synthetic CI fixtures and must NEVER be executed in a live institution**.

## Bank-specific credentials (externally mounted POSIX owner-only file)
Path from `OPES_BANK_CREDENTIALS_FILE`. Example keys (placeholder strings below, **not real secrets**):

```properties
bank.<BANK_UUID>.url=jdbc:postgresql://<db-host>:5432/<bank-db>?sslmode=verify-full&sslrootcert=/run/secrets/<bank-ca>
bank.<BANK_UUID>.user=<bank_runtime_login>
bank.<BANK_UUID>.password=<injected_from_vault>
```

File permissions 0400 or 0600, no symlinks. Each bank login: `LOGIN NOINHERIT NOSUPERUSER NOBYPASSRLS NOCREATEDB NOCREATEROLE NOREPLICATION`. No direct `SELECT/INSERT/UPDATE/DELETE` permissions on any bank table; grant schema USAGE and only the three audited functions `current_bank_id`, `post_journal`, `resolve_command`. Database role-to-bank mapping in `bank_principal` and membership are administered by a segregated approved provisioning control. Rotate secrets with a controlled app rolling restart (dynamic rotation is not implemented).

**Security caveat:** DB function accepts issuer/subject from the backend, so role-secret compromise is an identity-impersonation risk unless DB access is exclusively to attested application instances or accompanied by a cryptographically verifiable per-request attestation. This is a **P0 release blocker**, not a detail hidden by the fact that the Java API validates JWTs.

## Posting permission, approval and money
The API validates JWT, bank binding, exact currency-balanced debit/credit amounts, and requires an existing `posting_authorization` with independent maker/checker identifiers and digest. No API is provided to self-approve a posting. Financial command is not authorized if approval is absent, mismatched, expired or consumed. The ledger never stores authoritative account balance snapshots; balances are derived from immutable lines after independent reconciliation.

`POST` returns **201 only after database commit acknowledgement**; a failure after COMMIT attempt is `503 / UNKNOWN_PENDING_RECONCILIATION`. A client must `GET /commands/{same-id}`, not generate a new idempotency key. Network errors before commit can still have ambiguous outcomes; clients must resolve unknowns using the original command ID. `GET` requires current bank membership recovery permission.

## Operational acceptance gates (unverified)
Before real-money activation: issuer/KMS/JWKS pinning+rotation and DB-role hardening, real maker/checker issuance, transaction rollback and stale approval behavior, RLS visibility and direct-write denial, parallel duplicate/revocation ordering, crash/restart of HTTP workers, actual PostgreSQL primary failover and reconciliation, immutable ledger reversals, end-of-day/period closure, independent account balance projections, outbox relay/dedup, DR backup+restore, performance and privacy/regulatory mapping evidence. Release control must fail closed until all independent reviews are completed.
