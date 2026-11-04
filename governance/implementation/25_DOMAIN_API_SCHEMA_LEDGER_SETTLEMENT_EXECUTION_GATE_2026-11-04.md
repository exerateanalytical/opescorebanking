# OPES Core Banking — 25-domain API/schema and financial-engine implementation gate
Date: 2026-11-04
Status: ENGINEERING WORK REGISTER / NOT PRODUCTION ACCEPTED
Owner: OPESWARE TECHNOLOGIES
Source: OWNER_APPROVED_DOMAIN_OWNERSHIP_REGISTER_2026-11-04.json and CANONICAL_PROGRAMME_STATE.json.
No prior files superseded. No tests executed by this change.

## Verified starting evidence
25 sponsor-approved domain groups. 4 high-priority typed API drafts, 21 substantive API replacements outstanding. Seven PostgreSQL RLS laboratory tables span CIF, PRD, ACT, LED; this is not 25 accepted schemas. Production postable journal absent. The canonical state records 50 previously executed laboratory Python tests and PostgreSQL checks, not proof of production readiness. GOV-REC-001 historical custody and WP-ACC-005 COBAC 312/322 classification remain open. No live payment rail credentials are necessary for independent software development.

## Required deliverable matrix
Each row requires: (1) OpenAPI 3.1 with domain-owned endpoints, request/response/error types, authz, idempotency, pagination, versioning, operation semantics, events; (2) domain-owned PostgreSQL migrations with keys, constraints, tenant isolation, access policies, retention and migration rollback plan; (3) contract/migration/invariant tests; (4) evidence and 15-gate DoR assessment. No domain is marked complete by this register.

| ID | Domain | API boundary | Persistence boundary |
|---|---|---|---|
| GOV | Governance | institution policies, effective dates, approvals | policy_versions, approvals, institution_profiles |
| ARC | Architecture | domain registry, capability metadata | bounded_context_registry, contract_versions |
| CIF | Party/KYC/KYB | parties, identities, due diligence | parties, identities, verification_cases |
| PRD | Product factory | products, versions, pricing rules | product_versions, product_rules |
| ACT | Accounts/deposits | account lifecycle, holds, deposit instructions | accounts, account_holds, deposit_instructions |
| LED | Ledger | journal commands, entries, balances as projections | journal_headers, journal_lines, posting_commands, outbox |
| BRN | Branch/teller | tills, cash movements, vault custody | tills, vaults, cash_movements |
| PAY | Payments | instructions, rail attempts, status | payment_instructions, rail_attempts, settlement_links |
| CRD | Credit | facilities, schedules, disbursements | facilities, schedules, loan_events |
| TRE | Treasury | positions, limits, liquidity | treasury_positions, limits, liquidity_events |
| AML | AML/fraud | screening, alerts, cases | screenings, alerts, cases |
| REP | Reporting | report jobs, versions, evidence | report_runs, report_artifacts, provenance |
| CHN | Channels | sessions, channel intents | channel_sessions, intents |
| CARD | Cards | tokenized instruments, processor events | card_tokens, processor_events |
| CRM | Service | cases, messages, preferences | service_cases, communications |
| FEE | Fees | fee quotes, assessments, waivers | fee_rules, assessments, waivers |
| REC | Reconciliation | statements, matches, breaks | statements, matches, breaks |
| SEC | Security | identities, grants, revocations | memberships, grants, revocation_fences |
| DAT | Data governance | consent, retention, access requests | consents, retention_policies, access_requests |
| API | API management | clients, credentials, subscriptions | api_clients, scopes, subscriptions |
| INF | Infrastructure | health, key inventory, operations | service_inventory, key_metadata, operational_events |
| DR | Recovery | recovery plans, exercises, evidence | recovery_plans, drills, recovery_evidence |
| ADM | Administration | roles, approvals, privileged operations | roles, entitlements, approvals |
| TST | Testing | suites, evidence, assertions | test_suites, test_runs, evidence |
| REL | Releases | deployments, migrations, rollback | release_manifests, migration_runs |

These are proposed ownership objects, not confirmed schema migrations. Cross-domain foreign keys and shared writes require explicit ADR; use stable identifiers and published contracts across bounded contexts.

## Ledger minimum acceptance invariants
- Every posted journal balances per currency using exact integer minor units or explicitly controlled decimal precision; never floating-point.
- Posted journal rows immutable, reversals additive and linked to original; no direct balance mutation.
- Posting command has unique (bank_id, command_id) and immutable canonical request digest; retry of identical command cannot post twice; conflicting digest fails.
- One bank-local atomic transaction persists command terminal state, balanced journal and outbox; externally published events cannot post again.
- Membership/authorization fence is checked inside the posting transaction; revocation acknowledgement cannot misstate in-flight irreversible effects.
- Account balances are derived projections with independent reconciliation and replay.
- Bank-specific PostgreSQL principals and least-privilege RLS are tested under pooled concurrent connections.
- Unknown external outcomes are explicitly UNKNOWN until reconciliation; no fabricated finality.

## Settlement minimum acceptance states
CREATED -> VALIDATED -> SUBMITTED -> ACKNOWLEDGED -> CLEARING_PENDING -> SETTLEMENT_PENDING -> SETTLED, with REJECTED, RETURNED, CANCEL_REQUESTED, CANCELLED, FAILED, UNKNOWN and DISPUTED branches. Transitions require rail-specific effective-dated rules and authoritative evidence. External settlement and internal accounting are distinct; clearing suspense, nostro, payable/receivable and fees need explicit posting matrices. A received callback alone cannot create money or establish finality. Reconciliation consumes independently sourced statements, matches by stable identifiers, records breaks and escalation. Never mark SETTLED from local submission alone.

## Dependency-safe implementation sequence
1. Reconcile existing typed API and laboratory SQL assets to this matrix without overwriting accepted work.
2. Define shared API error envelope, authorization/tenant contract, idempotency, schema migration conventions and event envelope.
3. Complete SEC bank-local routing and authorization-fence G01-G18 synthetic integration evidence.
4. Complete LED posting schema, transaction atomicity, immutable journal and reconciliation test evidence; keep 312/322 classifications isolated.
5. Complete REC independent reconciliation contract; then PAY clearing/settlement simulator and uncertainty handling.
6. Complete domain contracts and migrations in dependency order, each with targeted executable evidence, never by generating 25 generic CRUD templates.
7. Run independent security/financial/regulatory review, DR tests and migration upgrade/rollback checks before any production claim.

## Work accounting
This file is one new planning/gap-remediation deliverable. It is not 25 completed API contracts, 25 implemented database schemas, a production ledger or a production settlement engine. Zero tests run; zero production WPs accepted. Historical accepted WP denominator UNKNOWN.
NEXT EXACT TASK: Reconcile actual existing OpenAPI and SQL paths against the 25 approved domain IDs and produce a path-by-path missing/partial/verified inventory before generating replacements.
