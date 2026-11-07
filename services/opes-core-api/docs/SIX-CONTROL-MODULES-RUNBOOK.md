# OPES Core Banking — Six operational-control modules

**Source status:** Java 25 / Spring Boot 4.1.2 / PostgreSQL 16+, React/TypeScript. This documents actual operational **record management** and review, not live payment or deployment authority.

## Modules
- GOV: versioned bank policy register with title, category, effective/review dates, content SHA-256, owner, formal independent approval, retirement and immutable history
- ARC: bounded-context API/contract register with semantic version, contract SHA-256, compatibility, architecture decision, independent approval
- TST: test evidence/run history, exact pass/fail counts, environment and build digest; failures prohibit acceptance
- INF: service and health-observation evidence, health status, monitoring evidence digest, incident and runbook references; DOWN requires incident identification
- DR: recorded backup/restore exercises with target/observed RPO/RTO, hash proof, independent approval; exceedances prohibit accepted state
- REL: controlled release candidate approvals; a production-target decision requires prior accepted TST, INF (HEALTHY) and DR records in the same bank. **Does not perform actual deployment**.

## Runtime and authorization
1. `OPES_OIDC_ISSUER`, `OPES_OIDC_JWKS_URI`, `OPES_OIDC_AUDIENCE` are required. Real JWT verification requires allowed RS256/ES256, signed issuer and audience.
2. `OPES_BANK_CREDENTIALS_FILE` is an external POSIX 0400/0600 file with a distinct NOINHERIT/NOBYPASSRLS PostgreSQL login for each bank.
3. `OPES_OPS_HMAC_KEYS_FILE` is a **separate external POSIX 0400/0600 file**; each line is `<bank UUID>=<64-128 lowercase hex characters>`. Keys must be unique per bank and different from database passwords. No CI test key or fixture can be used in production. Keep the other independently provisioned matching key version in `opes_core.ops_signing_key` under dedicated DBA policy, never grant table SELECT to the application login. Planned rotation requires coordinated changes and a restart.
4. DBA must review/install pgcrypto in PostgreSQL 16 before `V5` and use a dedicated nonruntime migration identity. Follow all previous V1-V4 migration controls; never run CI fixtures in a real institution.
5. Explicit grant `USAGE` on `opes_core` and EXECUTE on `ops_execute`, `ops_read`, `ops_upload_evidence`, `ops_verify_evidence`, `ops_get_evidence` to the authenticated bank runtime SQL principal. Grant **no direct table permissions**.
6. Bank administration must create issuer+subject membership, and per-domain CREATE/SUBMIT/DECIDE/RETIRE/READ/UPLOAD/VERIFY grants, active and expiring. Approval and evidence verification must be performed by a different actor from the creator.

## HTTP routes
```
POST /v1/banks/{bankId}/operations/{gov|arc|tst|inf|dr|rel}/items
POST /v1/banks/{bankId}/operations/{module}/items/{itemId}/submit
POST /v1/banks/{bankId}/operations/{module}/items/{itemId}/decision
POST /v1/banks/{bankId}/operations/{module}/items/{itemId}/retire
GET  /v1/banks/{bankId}/operations/{module}/items
GET  /v1/banks/{bankId}/operations/{module}/items/{itemId}
GET  /v1/banks/{bankId}/operations/{module}/items/{itemId}/history
POST /v1/banks/{bankId}/operations/{module}/evidence
POST /v1/banks/{bankId}/operations/{module}/evidence/{evidenceId}/review
GET  /v1/banks/{bankId}/operations/{module}/evidence/{evidenceId}
GET  /v1/banks/{bankId}/operations/{module}/evidence/{evidenceId}/download
```

HTTP requires a real, correctly scoped Bearer JWT. Commands require a stable `Idempotency-Key` (16-128 chars); create envelope `{itemId,fields}`. Approval transitions require `{expectedVersion,evidenceId,decision}`, with decision only on independent review. An ambiguous acknowledgment is **UNKNOWN_PENDING_RECONCILIATION**; retry with the exact same idempotency key and item ID, not a new command. Evidence upload requires multipart `file` and stable `Evidence-ID`; upload is max 1 MiB, whitelisted content type, original filename validation, durable checksum, non-rendered attachments. A different actor must inspect and mark evidence VERIFIED before any transition can consume it. Evidence is not editable after registration.

## Evidence and actual controls
Content checksums are verified inside PostgreSQL and Java; evidentiary references cannot be invented as free UUIDs. Content is stored as `bytea` with immutable metadata and audit events. Evidence access is authorized, downloaded only as an attachment, and no public signed URL is created.

**Acceptance blockers:** malware inspection with an independently accepted scanning provider and audit proof; retention, privacy, key rotation and compromise response; real OIDC/IdP deployment; incident monitoring ingestion (INF currently records observations); live restore tooling (DR is an exercise register); real CD automation (REL is an approval register); concurrency/failover, browser E2E, penetration tests, institutional sign-off, infrastructure secrets custody, backups and restored-state tests. Monetary GL and settlement are separate systems and remain governed by their own acceptance gates. These blockers must not be automatically marked resolved because unit tests pass.
