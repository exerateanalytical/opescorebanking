# OPES Core Banking — Consolidated Remaining-Phase Draft Register (single draft delivery)

Date: 2026-11-04. Status: **DRAFT / NOT ACCEPTED / NOT IMPLEMENTED**. Repository: exerateanalytical/opescorebanking. This is a single consolidated planning-and-specification draft, not a claim that all engineering work, regulatory evidence, executable tests, or certification is finished. Existing numbered batches 001–209 are preserved and not reissued.

## Baseline and strict scope
The GitHub record includes 29 recovered historical-source audit ZIPs numbered 181–209, and earlier draft domain checkpoints. The programme-wide exhaustive WBS and accepted-work denominator have not been established; consequently this document is an **explicit proposed inventory/change request**, not a replacement for an approved WBS. Before individual tasks are marked complete, reconcile each row with the canonical source ledger, all prior draft artifacts and reviewer approvals. Historical GOV-REC-001 remains open; P0 WP-ACC-005 (PCEC 312/322) remains fail-closed; institutional payment-rail participation is not assumed. No production code, bank tests or certification is asserted here.

## Global financial and security invariants
Every financial posting must have immutable, balanced double-entry journals, exact integer/decimal monetary units, no direct balance mutation, stable idempotency keys and deduplication, explicit pending/clearing/settled/final/failed/unknown states, controlled compensating reversals, independent reconciliation, period control and audit trace. Unknown external payment outcomes must never be converted to success or retried as a fresh posting. Every privileged or sensitive action requires server-enforced institution scoping, least privilege, appropriate authentication, maker-checker/SoD and tamper-evident evidence. Effective-dated regulatory and product rules must be versioned, never silently overwritten.

## Common completion contract for every domain
Each row below requires: named accountable owner and independent reviewer (unassigned until designated); approved scope and institution profile; primary regulatory source register with page/article/effective date; requirements/invariants; happy/failure/reversal/recovery state machines; roles/SoD; accounting mappings; AML/security/privacy; API/events with retry semantics; schema/retention; executable acceptance cases; observability/reconciliation; validated dependencies; P0 disposition; repository/test environment. **All 15 DoR criteria must pass for any production implementation.** Independent reviewers cover regulatory, finance, architecture, security, AML, workflow, privacy, settlement, operations, testing, usability, performance and auditor evidence. Drafting alone satisfies none of these gates.

## Consolidated remaining-phase domain drafts
### GOV — Governance, institution profiles and master WBS
**Proposed work scope:** Regulated institution types, licensing perimeter, RACI, evidence owners, acceptance authority, change control, legal source register, critical-path dependencies.

**Required specification bundle:** capability map; actor/role matrix; effective-dated policy references; workflow and state-transition tables including failure, cancellation, correction and recovery; entity/data ownership and retention; OpenAPI/event payloads and versioning; accounting journal examples or explicit no-posting proof; operational reconciliation and exception queues; threat/abuse cases; observability; executable test matrix and evidence pointers.

**Acceptance evidence required:** Approved institution profile, signed scope, exhaustive inventory, independently accepted WBS and source custody. **Status:** DRAFT_SCOPE_ONLY; owner/reviewer TBD; regulatory applicability TBD; no acceptance implied.

### REG — Regulatory interpretation and effective-dated rules
**Proposed work scope:** COBAC/BEAC/CEMAC/UMAC/GABAC/OHADA/Cameroon/FATF obligations, applicability, effective dates, primary-page citations, conflict log, regulatory change workflow.

**Required specification bundle:** capability map; actor/role matrix; effective-dated policy references; workflow and state-transition tables including failure, cancellation, correction and recovery; entity/data ownership and retention; OpenAPI/event payloads and versioning; accounting journal examples or explicit no-posting proof; operational reconciliation and exception queues; threat/abuse cases; observability; executable test matrix and evidence pointers.

**Acceptance evidence required:** Authenticated primary sources and reviewer-approved interpretations; 312/322 PCEC ambiguity isolated. **Status:** DRAFT_SCOPE_ONLY; owner/reviewer TBD; regulatory applicability TBD; no acceptance implied.

### ARC — Domain architecture and platform contracts
**Proposed work scope:** Bounded contexts, aggregate ownership, transaction boundaries, transactional outbox/inbox, CQRS decisions, API lifecycle, schema evolution, anti-corruption layers.

**Required specification bundle:** capability map; actor/role matrix; effective-dated policy references; workflow and state-transition tables including failure, cancellation, correction and recovery; entity/data ownership and retention; OpenAPI/event payloads and versioning; accounting journal examples or explicit no-posting proof; operational reconciliation and exception queues; threat/abuse cases; observability; executable test matrix and evidence pointers.

**Acceptance evidence required:** ADRs, dependency graph, consistency models, failure-mode proofs, contract compatibility tests. **Status:** DRAFT_SCOPE_ONLY; owner/reviewer TBD; regulatory applicability TBD; no acceptance implied.

### SEC — Identity, security, privacy and cryptography
**Proposed work scope:** OIDC/MFA, RBAC+ABAC, tenant/institution scope, SoD, maker-checker, PAM, HSM/KMS, secrets, secure SDLC, supply chain, privacy retention, audit integrity.

**Required specification bundle:** capability map; actor/role matrix; effective-dated policy references; workflow and state-transition tables including failure, cancellation, correction and recovery; entity/data ownership and retention; OpenAPI/event payloads and versioning; accounting journal examples or explicit no-posting proof; operational reconciliation and exception queues; threat/abuse cases; observability; executable test matrix and evidence pointers.

**Acceptance evidence required:** Threat models, least-privilege matrix, key ceremonies, pen-test plans, audit-log verification. **Status:** DRAFT_SCOPE_ONLY; owner/reviewer TBD; regulatory applicability TBD; no acceptance implied.

### CIF — Customer information, KYC/KYB and beneficial ownership
**Proposed work scope:** CIF identity lifecycle, duplicate resolution, legal persons, BO, risk tiers, evidence and consent, screening, onboarding, dormant/closed records.

**Required specification bundle:** capability map; actor/role matrix; effective-dated policy references; workflow and state-transition tables including failure, cancellation, correction and recovery; entity/data ownership and retention; OpenAPI/event payloads and versioning; accounting journal examples or explicit no-posting proof; operational reconciliation and exception queues; threat/abuse cases; observability; executable test matrix and evidence pointers.

**Acceptance evidence required:** State diagrams, KYC evidence schemas, maker-checker, privacy and AML acceptance tests. **Status:** DRAFT_SCOPE_ONLY; owner/reviewer TBD; regulatory applicability TBD; no acceptance implied.

### PRD — Banking product factory and pricing
**Proposed work scope:** Versioned deposits, credit, fees, interest, charges, tax, eligibility, calendar, product effective dates and migration.

**Required specification bundle:** capability map; actor/role matrix; effective-dated policy references; workflow and state-transition tables including failure, cancellation, correction and recovery; entity/data ownership and retention; OpenAPI/event payloads and versioning; accounting journal examples or explicit no-posting proof; operational reconciliation and exception queues; threat/abuse cases; observability; executable test matrix and evidence pointers.

**Acceptance evidence required:** Product version immutability, four-eyes approvals, pricing replay, accounting mapping sign-off. **Status:** DRAFT_SCOPE_ONLY; owner/reviewer TBD; regulatory applicability TBD; no acceptance implied.

### ACT — Accounts, deposits and mandates
**Proposed work scope:** Opening, mandate/signatory, holds, liens, freezes, interest accrual, dormant/reactivation, closure, statements, joint accounts.

**Required specification bundle:** capability map; actor/role matrix; effective-dated policy references; workflow and state-transition tables including failure, cancellation, correction and recovery; entity/data ownership and retention; OpenAPI/event payloads and versioning; accounting journal examples or explicit no-posting proof; operational reconciliation and exception queues; threat/abuse cases; observability; executable test matrix and evidence pointers.

**Acceptance evidence required:** Full exception/reversal states, authorization and ledger reconciliation cases. **Status:** DRAFT_SCOPE_ONLY; owner/reviewer TBD; regulatory applicability TBD; no acceptance implied.

### LED — General ledger and accounting core
**Proposed work scope:** Immutable posted journal, balanced debit/credit, chart of accounts, posting rules, FX, suspense, period close, reversals, event replay and subledger reconciliation.

**Required specification bundle:** capability map; actor/role matrix; effective-dated policy references; workflow and state-transition tables including failure, cancellation, correction and recovery; entity/data ownership and retention; OpenAPI/event payloads and versioning; accounting journal examples or explicit no-posting proof; operational reconciliation and exception queues; threat/abuse cases; observability; executable test matrix and evidence pointers.

**Acceptance evidence required:** PCEC classification authority, zero-sum property tests, idempotency and period-close acceptance. **Status:** DRAFT_SCOPE_ONLY; owner/reviewer TBD; regulatory applicability TBD; no acceptance implied.

### BRN — Branch, teller, vault and cash custody
**Proposed work scope:** Cash drawers, vault limits, dual custody, transfers, balancing, shortages/overages, CIT, EOD, offline branch recovery.

**Required specification bundle:** capability map; actor/role matrix; effective-dated policy references; workflow and state-transition tables including failure, cancellation, correction and recovery; entity/data ownership and retention; OpenAPI/event payloads and versioning; accounting journal examples or explicit no-posting proof; operational reconciliation and exception queues; threat/abuse cases; observability; executable test matrix and evidence pointers.

**Acceptance evidence required:** Custody chain and cash conservation tests, maker-checker, daily balancing evidence. **Status:** DRAFT_SCOPE_ONLY; owner/reviewer TBD; regulatory applicability TBD; no acceptance implied.

### PAY — Payments, clearing and settlement
**Proposed work scope:** Internal transfers, domestic and regional rails, ISO 20022 where applicable, mandates, cutoffs, return/reject, reconciliation, external unknown outcomes.

**Required specification bundle:** capability map; actor/role matrix; effective-dated policy references; workflow and state-transition tables including failure, cancellation, correction and recovery; entity/data ownership and retention; OpenAPI/event payloads and versioning; accounting journal examples or explicit no-posting proof; operational reconciliation and exception queues; threat/abuse cases; observability; executable test matrix and evidence pointers.

**Acceptance evidence required:** Verified rail entitlement, participant rulebooks, settlement-finality proofs and duplicate prevention. **Status:** DRAFT_SCOPE_ONLY; owner/reviewer TBD; regulatory applicability TBD; no acceptance implied.

### CRD — Credit origination and servicing
**Proposed work scope:** Application, underwriting, collateral, disbursement, schedules, accrual, delinquency, restructuring, collections, impairment, write-off.

**Required specification bundle:** capability map; actor/role matrix; effective-dated policy references; workflow and state-transition tables including failure, cancellation, correction and recovery; entity/data ownership and retention; OpenAPI/event payloads and versioning; accounting journal examples or explicit no-posting proof; operational reconciliation and exception queues; threat/abuse cases; observability; executable test matrix and evidence pointers.

**Acceptance evidence required:** Credit policy approval, accounting schedules, ECL/impairment interpretations and test vectors. **Status:** DRAFT_SCOPE_ONLY; owner/reviewer TBD; regulatory applicability TBD; no acceptance implied.

### TRE — Treasury, liquidity and ALM
**Proposed work scope:** Cash positioning, nostro/vostro, placements, interbank, FX, liquidity limits, maturity ladder, stress, intraday funding.

**Required specification bundle:** capability map; actor/role matrix; effective-dated policy references; workflow and state-transition tables including failure, cancellation, correction and recovery; entity/data ownership and retention; OpenAPI/event payloads and versioning; accounting journal examples or explicit no-posting proof; operational reconciliation and exception queues; threat/abuse cases; observability; executable test matrix and evidence pointers.

**Acceptance evidence required:** Source-validated limits, independent pricing, reconciliation and liquidity reporting. **Status:** DRAFT_SCOPE_ONLY; owner/reviewer TBD; regulatory applicability TBD; no acceptance implied.

### AML — AML/CFT, sanctions, fraud and enterprise risk
**Proposed work scope:** Screening, case management, transaction monitoring, suspicious activity, PEP, model governance, fraud rules, risk appetite, incident evidence.

**Required specification bundle:** capability map; actor/role matrix; effective-dated policy references; workflow and state-transition tables including failure, cancellation, correction and recovery; entity/data ownership and retention; OpenAPI/event payloads and versioning; accounting journal examples or explicit no-posting proof; operational reconciliation and exception queues; threat/abuse cases; observability; executable test matrix and evidence pointers.

**Acceptance evidence required:** GABAC/FATF applicability, calibrated controls, SoD, false-positive review and regulator evidence. **Status:** DRAFT_SCOPE_ONLY; owner/reviewer TBD; regulatory applicability TBD; no acceptance implied.

### REP — Regulatory, statutory and management reporting
**Proposed work scope:** COBAC/BEAC returns, prudential ratios, OHADA accounting, data lineage, corrections, submission approval and archive.

**Required specification bundle:** capability map; actor/role matrix; effective-dated policy references; workflow and state-transition tables including failure, cancellation, correction and recovery; entity/data ownership and retention; OpenAPI/event payloads and versioning; accounting journal examples or explicit no-posting proof; operational reconciliation and exception queues; threat/abuse cases; observability; executable test matrix and evidence pointers.

**Acceptance evidence required:** Authenticated templates/rules, versioned calculation lineage, CFO reconciliation and sign-off. **Status:** DRAFT_SCOPE_ONLY; owner/reviewer TBD; regulatory applicability TBD; no acceptance implied.

### CHN — Digital, mobile, internet, corporate and agency banking
**Proposed work scope:** Channel entitlement, devices, MFA, limits, beneficiary controls, corporate dual approval, agents, customer notifications.

**Required specification bundle:** capability map; actor/role matrix; effective-dated policy references; workflow and state-transition tables including failure, cancellation, correction and recovery; entity/data ownership and retention; OpenAPI/event payloads and versioning; accounting journal examples or explicit no-posting proof; operational reconciliation and exception queues; threat/abuse cases; observability; executable test matrix and evidence pointers.

**Acceptance evidence required:** Server-side authorization, transaction-state consistency, accessibility and fraud abuse tests. **Status:** DRAFT_SCOPE_ONLY; owner/reviewer TBD; regulatory applicability TBD; no acceptance implied.

### API — External integrations and interoperability
**Proposed work scope:** Payment adapters, identity, national registries, GIMAC where contracted, bureau, messaging, file exchange, schema and retry contracts.

**Required specification bundle:** capability map; actor/role matrix; effective-dated policy references; workflow and state-transition tables including failure, cancellation, correction and recovery; entity/data ownership and retention; OpenAPI/event payloads and versioning; accounting journal examples or explicit no-posting proof; operational reconciliation and exception queues; threat/abuse cases; observability; executable test matrix and evidence pointers.

**Acceptance evidence required:** Signed integration contracts, sandbox evidence, timeouts and unknown-outcome recovery. **Status:** DRAFT_SCOPE_ONLY; owner/reviewer TBD; regulatory applicability TBD; no acceptance implied.

### DAT — Data governance, migration and master data
**Proposed work scope:** Data classification, residency, lineage, quality, import mapping, dedupe, migration dry-runs, reconciliation, retention and erasure exceptions.

**Required specification bundle:** capability map; actor/role matrix; effective-dated policy references; workflow and state-transition tables including failure, cancellation, correction and recovery; entity/data ownership and retention; OpenAPI/event payloads and versioning; accounting journal examples or explicit no-posting proof; operational reconciliation and exception queues; threat/abuse cases; observability; executable test matrix and evidence pointers.

**Acceptance evidence required:** Reconciled migration totals, rollback, sampled audit trails, legal retention authority. **Status:** DRAFT_SCOPE_ONLY; owner/reviewer TBD; regulatory applicability TBD; no acceptance implied.

### OPS — Infrastructure, SRE, DR and cyber operations
**Proposed work scope:** Topology, deployment, monitoring, SLOs, immutable backups, RPO/RTO, incident response, SIEM, key recovery, runbooks.

**Required specification bundle:** capability map; actor/role matrix; effective-dated policy references; workflow and state-transition tables including failure, cancellation, correction and recovery; entity/data ownership and retention; OpenAPI/event payloads and versioning; accounting journal examples or explicit no-posting proof; operational reconciliation and exception queues; threat/abuse cases; observability; executable test matrix and evidence pointers.

**Acceptance evidence required:** Executed DR drills, restore proofs, capacity and resilience tests, operational ownership. **Status:** DRAFT_SCOPE_ONLY; owner/reviewer TBD; regulatory applicability TBD; no acceptance implied.

### TST — Verification, performance, security and certification evidence
**Proposed work scope:** Unit/integration/property/contract/E2E, accounting invariant, concurrency, chaos, pentest, accessibility, performance, UAT and independent review.

**Required specification bundle:** capability map; actor/role matrix; effective-dated policy references; workflow and state-transition tables including failure, cancellation, correction and recovery; entity/data ownership and retention; OpenAPI/event payloads and versioning; accounting journal examples or explicit no-posting proof; operational reconciliation and exception queues; threat/abuse cases; observability; executable test matrix and evidence pointers.

**Acceptance evidence required:** Executable evidence, signed findings disposition, release gates and reproducible test reports. **Status:** DRAFT_SCOPE_ONLY; owner/reviewer TBD; regulatory applicability TBD; no acceptance implied.

### REL — Implementation, release, training and operational adoption
**Proposed work scope:** DoR-gated vertical slices, migration rehearsals, pilot, go/no-go, rollback, operator training, support, post-release controls.

**Required specification bundle:** capability map; actor/role matrix; effective-dated policy references; workflow and state-transition tables including failure, cancellation, correction and recovery; entity/data ownership and retention; OpenAPI/event payloads and versioning; accounting journal examples or explicit no-posting proof; operational reconciliation and exception queues; threat/abuse cases; observability; executable test matrix and evidence pointers.

**Acceptance evidence required:** 15/15 DoR per bounded slice, independent approvals, live operational acceptance. **Status:** DRAFT_SCOPE_ONLY; owner/reviewer TBD; regulatory applicability TBD; no acceptance implied.

## Cross-domain dependency and critical-path rules
1. GOV and REG establish approved institution scope and authoritative source traceability; SEC and ARC establish non-bypassable cross-cutting controls.
2. LED posting interfaces, classification authority and reconciliation are prerequisites for financial activation in ACT, BRN, PAY, CRD, TRE and REP; WP-ACC-005 prevents unsafe PCEC encoding.
3. CIF/KYC and AML authorization must precede account activation, digital access and customer payments.
4. PAY external settlement integration requires verified institutional entitlement and documented finality; no simulated successful settlement may be counted as production acceptance.
5. DAT migration cannot alter balances without journal/subledger reconciliation; OPS restore and TST invariant evidence precede REL production release.
6. Independent non-financial design work can proceed while accounting P0 is unresolved, but cannot be counted as implemented or regulator-ready.

## Programme-wide remaining deliverables and gates
**Documents:** approved master WBS; source/provenance ledger; requirements and regulatory traceability; ADRs; domain/event/API/data catalogs; role/SoD matrix; accounting/posting catalog; risk and threat registers; acceptance matrices; operational runbooks; migration plans; DR plan; test strategy; evidence index; deployment and release criteria; regulator/auditor pack. **Executable evidence:** buildable source, migrations, deterministic test fixtures, CI results, property-based financial tests, security scans, penetration-test findings, reconciliation results, DR restoration results, signed UAT and approvals. **Commercial/operational dependencies:** licensed institution profiles, signed integration/rail access, accountable reviewers, controlled environments and data-governance approvals.

## Proposed verification workflow (not executed)
For each of the 20 domain rows: (a) map every existing file/checkpoint and deduplicate, (b) establish exhaustive leaf-level registered WPs with dependencies, (c) obtain source-authenticated rules, (d) resolve critical ambiguities, (e) secure independent review, (f) close each of 15 DoR gates with evidence, (g) implement small verified slices, (h) execute financial/security/resilience tests, (i) sign off only proven acceptance. No global completion percentage until approved inventory denominator exists.

## Current gap register
- **P0 / WP-ACC-005:** COBAC/PCEC 312/322 classification and effective legal interpretation unresolved. Fail closed.
- **P0/External dependency:** institutional payment rail participation and settlement contracts unverified. No live integration claim.
- **GOV-REC-001:** archive lineage and custody still require final crosswalk, binary validation and provenance acceptance. Historical draft ZIP delivery is not WP closure.
- **P1/GOV-WBS:** exhaustive approved leaf-level master inventory, ownership, evidence acceptance and remaining denominator missing.
- **P1/DoR:** no bounded financial production slice independently evidenced as satisfying all 15 gates.

## Quality review verdict
Regulatory: HOLD (primary-source and effective-date validation incomplete). Financial: HOLD (PCEC and executable reconciliation). Architecture: HOLD (domain contracts not independently accepted). Security/AML: HOLD (threat models and signed policies incomplete). Data/privacy: HOLD (retention and data jurisdiction validation). Settlement: HOLD (rail participation unknown). Resilience: HOLD (no executed DR evidence). Testing: HOLD (no executed banking tests established). Usability: NOT ASSESSED. Performance: NOT ASSESSED. Auditor evidence: HOLD (independent provenance and reviewer signatures incomplete).

## Delivery and continuation
This single file is the **complete consolidated high-level draft across identified remaining programme areas**, not the exhaustive approved leaf-level work-package register. It intentionally does not fabricate detailed primary-law citations, account codes, API endpoints, accounting entries, signatures, code, tests, or production readiness. Existing prior drafts remain authoritative source material for reconciliation, not automatically accepted requirements.

**NEXT EXACT TASK:** GOV-WBS-RECON-001 — Build the exhaustive version-controlled leaf-level WBS and artifact-to-WP crosswalk from the actual repository tree, distinguish draft delivery from independent acceptance, assign owners/reviewers and explicit dependencies, and obtain plan approval before claiming the remaining denominator or commencing implementation.
