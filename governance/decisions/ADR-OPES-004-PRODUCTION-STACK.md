# ADR-OPES-004 — Production Application Stack and First Banking Vertical Slice

Date: 2026-11-06
Status: **IMPLEMENTATION BASELINE ADOPTED, PRODUCTION ACCEPTANCE OPEN**
Decision authority: OPESWARE owner directive “Now production. We must use production development now”.
Source baseline: `main` 237f9b59e0c9e54ae0d4fe8d0c43de3516e0174f.

## Decision
- Core backend: **Java 21** on **Spring Boot 4.1.2**, maintained as a modular monolith with DDD ownership and API-first contracts. One bounded-context ledger posting slice is implemented first, not 25 generic microservices.
- Data: **PostgreSQL 16+** with institution-scoped authenticated database principals, strong constraints, exact minor-unit arithmetic, immutable postings, transactions, explicit outbox and independent actor authorization.
- Identity: OIDC access tokens with validated issuer, expected audience, algorithm allowlist, configured issuer/JWKS, then bank-local authorization **inside** the posting transaction.
- Deployment: External identity, per-bank database credentials, owner-only mounted secret file, TLS certificate verification, separate migration and runtime duties. Production application does not bootstrap users/approve commands/seed fake accounts.
- Web/mobile clients remain separate decisions. Existing client prototypes and Node.js candidate service PRs remain source evidence; **do not mix those runtimes into the production backend**.

## Why this choice is not a language-performance claim
Spring Boot offers mature resource-server integration, predictable JDBC transaction boundaries and a cohesive deployable modular monolith. Correctness comes from PostgreSQL constraints, serialized idempotency and crash/recovery tests, not the language. ASP.NET Core and Node.js remain valid comparative alternatives should evidence warrant a formal ADR amendment. Use current stable 4.1.2, not 3.5.x beyond its open-source maintenance period. Official release: https://spring.io/blog/ (2026-10-23).

## Production code versus production approval
The directory `services/opes-core-api` is **production-targeted source**: real Spring HTTP endpoint and PostgreSQL migration (not disposable schema), no fake data in application, no synthetic issuers or bypass flags.
It is NOT certified, licensed or approved to handle real banking money yet. The migrated schema must pass independent financial, security, regulatory, operational, threat and DR reviews; no report of real postings exists.

## Critical invariants
- POST requires a current, verified JWT, a bank-owned database session login, matching bank-scoped issuer+subject membership, a current posting permission and a separately reviewed/approved command digest.
- The client-supplied bank path is only a routing hint; the database's `SESSION_USER` determines actual bank authority.
- One transaction writes a balanced, immutable journal, exact lines, terminal command registry, immutable audit, inert outbox, and consumes the approval.
- Replay matching the same command and digest may return the original receipt without re-posting. Changed digest fails. Lost HTTP response is `UNKNOWN_PENDING_RECONCILIATION`, resolved with GET using same command UUID.
- Never infer settlement finality from local posted accounting. Neutral ledger IDs avoid disputed COBAC 312/322 account classification.

## Pending production sign-off
- OIDC/JWKS key rotation, credentials/vault rotation and proof that a database-role credential cannot be used to impersonate arbitrary human actors through the command function; separate per-request trusted subject attestation is required.
- Formal maker/checker approval-service state machine (the ledger requires verified stored approval; there is no API to manufacture one).
- Concurrent revocation, crash-after-COMMIT-before-HTTP-ACK, gateway/outbox exactly-once publication semantics, balance restoration, year-end close, reconciliation, reversals and golden financial cases.
- Real regulator-backed PCEC mappings including 312/322, data/retention/rate policies, multi-bank operational isolation, SOC, secrets, backups and restore.
- 25-domain production service implementation remains incomplete; this ADR does not reclassify the separate Stage 3 candidate bundle as accepted.

## Alternate stack comparison criteria
Publish repeatable vertical-slice results for Java vs ASP.NET vs Node.js if changing this baseline: domain invariants, PostgreSQL transaction correctness, throughput at reference workload, crash/replay tests, team maintainability, upgrade capacity, security observability and reproducible CI. No unsupported claim that Java is “faster” or “more secure” by default.
