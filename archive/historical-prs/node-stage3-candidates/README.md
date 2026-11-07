# OPES Core Banking — Stage 3 25-domain single-batch engineering delivery

**Date:** 2026-11-06. **Delivery status:** EXECUTABLE CANDIDATE PACKAGE / NOT PRODUCTION-ACCEPTED.
**Base:** owner-approved domain register, 25 domains. Existing typed CIF/PRD/ACT/LED drafts and historical 25-domain generic YAML/SQL proposals are retained, not overwritten.

## Batch inventory

- 25 individual strict OpenAPI 3.1 documents, each with **three domain-specific candidate command endpoints + one bank-scoped read endpoint**: 75 POST commands and 25 GET endpoints, total 100.
- Each command has exact domain fields, disallows unknown properties and arbitrary \`payload\`, declares operation-specific permissions, idempotency/correlation IDs, trusted bank scope, typed response codes, and its own evidence references.
- 25 domain-specific PostgreSQL 16 candidate tables with actual typed columns, precision restrictions, enum checks, bank-composite keys, forced RLS, bank-principal membership checks, read-only lab grants, and strict data-scope proof using 50 two-bank synthetic records.
- Backend-only JavaScript domain service runtime with validated request schemas, real domain invariants (balanced journal proposals, amount/rate ranges, DR targets, screening bounds), domain-segregated maker-checker candidate lifecycle and test-only deterministic idempotency/audit events.
- A 25-domain candidate HTTP dispatcher with strict request envelope, scoped signed-in principal/membership adapters, explicit blocked financial/regulatory operations, bounded payload and sanitized errors.
- **All 25 domains** share an independently verified backend identity/permissions/store contract; the system refuses to execute unless trusted adapters are supplied.

## Security and domain boundaries

All lifecycle transitions end in \`REVIEWED_NOT_EFFECTIVE\` or \`REJECTED\`. There is no \`POSTED\`, \`SETTLED\`, \`ISSUED\`, \`ACTIVE_ENTITLEMENT\`, \`OFFICIAL_FILING\`, \`DISPOSAL\`, or \`DEPLOYED\` outcome. The runtime implements **CANDIDATE logic only**; it must never be directly exposed as the final bank command system. A simulated store is explicitly limited to \`NODE_ENV=test\`.

PostgreSQL schema/setup scripts deliberately run **only against disposable \`opes_test\` on PostgreSQL 16 as the superuser**. They are **not** a production migration and refuse other environments. Bank A/B logins can only SELECT through RLS; no user role can INSERT/UPDATE/DELETE candidate tables. Role/password values are synthetic and known, not real infrastructure credentials.

The 25 service groups' critical rules are not all proven by this package. Domain-specific monetary, accounting, compliance, statutory, integration and bank-configuration rules require accepted tests and verified source policy. Historical proposals from \`programme/consolidated/ONE_BATCH_ENGINEERING_DELIVERY_2026-11-04/full_specification\` remain source evidence, not accepted implementation.

## Stage 3 exit / production blockers (open)

1. Replace synthetic store with trusted, transactionally durable bank-bound PostgreSQL command write/read ports for **each** domain; prove idempotency atomicity, revocation ordering, rollback, concurrent checker races, immutable event/outbox evidence and no direct SQL privilege bypass.
2. Wire production issuer/JWKS lifecycle, real institution membership/branch scope, vault-managed per-bank credentials, TLS peer verification, audit and secret rotation/revocation.
3. Integrate source-of-truth systems and effective-dated product/policy/PCEC mappings, especially COBAC 312/322 quarantine, with acceptance by competent independent owners.
4. Complete all domain-specific workflows beyond 3 candidate commands: reversals, exceptions, cancellation, closure, transfers, settlement UNKNOWN, fraud/AML, collections, treasury and reconciliation. This package **does not claim** that those workflows exist.
5. Implement true domain API services, secure PostgreSQL migrations and event deliveries in the selected production backend architecture. This JS candidate runtime is not a production-complete set of banking services.
6. Establish exhaustive leaf-level WBS denominator and 15 DoR/DoD gates, architecture ADR, field/privacy retention review, end-to-end contract compatibility and operational DR/performance/security tests.

**The user requested all Stage 3 completed in one batch. The single batch covers all 25 domains at candidate contract/schema/validation level, but it would be inaccurate to mark Stage 3 production-complete. No new production WP is accepted by this work alone.**

## Exact execution / repeatability

\`\`\`bash
NODE_ENV=test node --test engineering/stage3-one-batch/tests/*.test.mjs
\`\`\`

GitHub Actions workflow: \`.github/workflows/opes-stage3-25-domains.yml\` applies all 25 schemas to a fresh PostgreSQL 16 CI service, seeds 50 synthetic records, tests both bank principals and unbound denial. **Do not run these scripts on live databases**.

## Next work without duplicate screens/forms

The immutable financial posting and recovery P0 in \`SEC-TENANT-ROUTING-001\` must be closed with source-grounded executable evidence before activation. Contract snapshots should be reconciled with the existing screens/form/report PRs, not copy screen prototypes into backend implementation.

## Extended PostgreSQL integration checkpoint (same Stage 3 batch)

`db/100_durable_command_core.sql` adds a lab-only actor-bound command path spanning all 25 typed domain tables, with current authenticated DB login mapped to one bank and actor, versioned atomic state transitions, idempotency registry, immutable audit, and an inert candidate outbox. An independent checker can review but cannot create/submit; maker cannot self-review. Database privileges forbid direct table writes. `src/pg-candidate-store.mjs` exposes a scoped Postgres driver adapter for the existing services. `db/tests/006_pg_25_domain_integration.mjs` integrates ephemeral signed Ed25519 test JWTs with all 25 durable SQL transitions and checks 75 commands, 75 audit entries and 75 undelivered candidate outbox rows.

**This does not make the Stage 3 financial and regulatory domain services complete or deployable.** Candidates remain non-effective, do not change customer balances or entitlements, and do not implement external payment settlement or live control data. Trust routing and source custody must be independently production implemented and accepted.
