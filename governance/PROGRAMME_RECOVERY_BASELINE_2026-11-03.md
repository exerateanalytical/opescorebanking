# OPES Core Banking — Programme Governance Recovery Baseline
Status: PROVISIONAL / NOT AN APPROVED MASTER BASELINE
Date: 2026-11-03
Owner: OPESWARE TECHNOLOGIES
Canonical repository: exerateanalytical/opescorebanking

## Purpose
Correct a programme-control defect: checkpoint identifiers and evidence-writing iterations have been presented without a reconciled authoritative phase/WBS denominator. No further checkpoint may be interpreted as phase completion or production readiness merely because it was pushed.

## Verified source sample
- Repository identity and private main branch verified using connected GitHub.
- regulatory/checkpoints/CD/README.md fetched and reviewed. It records WP-ACC-005 OPEN/P0 BLOCKED; Phase 4 Accounting Core; inherited WP-ACC-004 last reported completed but NOT independently reaudited.
- regulatory/consolidated/PROGRAMME_CONSOLIDATION_2026-11-01.md fetched and sampled. It references numerous preceding checkpoint records and zero executed tests in the sampled entries. Its content is not a complete phase/WBS inventory.
- Earlier reports claim progression AD through CD; individual historical commits and all conversations have NOT been exhaustively audited in this recovery step.

## Mandatory measurement taxonomy
1. CHECKPOINT_DELIVERED: files committed and independently retrieved, with SHA and paths.
2. WP_COMPLETE: explicit deliverables and acceptance evidence, peer quality review and sign-off.
3. PHASE_COMPLETE: all mandatory WP exit gates met and dependencies accepted.
4. IMPLEMENTATION_COMPLETE: executable code and tests verified.
5. PRODUCTION_READY: security, financial, regulatory, DR, operational and bank-specific approvals evidenced.
Never infer one from another.

## Provisional programme phase taxonomy — PROPOSED, NOT HISTORICAL FACT
P00 Programme governance, scope, institutional profiles and regulatory evidence
P01 Domain architecture, platform foundations and cross-cutting controls
P02 Identity, customer information, onboarding and KYC/KYB
P03 Product factory, accounts, deposits and lifecycle
P04 Accounting core, immutable ledger and financial integrity (CURRENT REPORTED PHASE)
P05 Branch, teller, cash, vault and operational finance
P06 Payments, clearing, settlement and reconciliation
P07 Lending, collateral, collections and impairment
P08 Treasury, liquidity, securities, FX and investments
P09 AML, sanctions, fraud, risk and prudential/regulatory reporting
P10 Digital, mobile, corporate, agency and external banking channels
P11 Infrastructure, cybersecurity, observability, continuity, migration and operations
P12 End-to-end certification, pilot, regulatory evidence and production release

These are 13 PROPOSED phase categories (P00–P12), NOT a claim that the historical programme had 13 phases, and NOT a completed count. A phase can span several workstreams and institutions. Do not renumber existing historical phases without mapping.

## Work-package register: initial evidence-qualified entries
| WP | Phase (historical) | Status | Evidence | Confidence |
| --- | --- | --- | --- | --- |
| WP-ACC-004 | Phase 4 | REPORTED COMPLETE / NOT REAUDITED | CD README inherited statement | low |
| WP-ACC-005 | Phase 4 | OPEN / P0 BLOCKED | CD README fetched | high for reported state |

All other WP IDs and their dispositions are UNRECONCILED; not presumed nonexistent or complete.

## Required canonical registers
- PHASE_REGISTER: phase ID, historical alias, objective, entry/exit gates, owners, approval, status, evidence refs.
- WBS_REGISTER: WP ID, bounded context, scope, dependencies, planned deliverables, estimate class, priority, DoR, DoD, owner, state, evidence.
- CHECKPOINT_LEDGER: checkpoint ID, parent commit, WP, file paths, commit SHA, research delta, tests actually executed, closure evidence.
- REQUIREMENT_TRACEABILITY: requirement ID, legal provenance/effective interval, invariant, ADR, domain, API, data, control, tests and review.
- GAP_REGISTER: P0/P1, impact, dependent packages, owner, resolution evidence, due-by only when approved.
- CHANGE_LOG: baseline additions/removals, reason, impact on denominator and critical path.
- SOURCE_INVENTORY: GitHub commits/files, conversation records, archives, inaccessible sources and SHA256.

## Completion arithmetic
Do NOT publish remaining batch counts or completion percentages until an approved and exhaustively enumerated WBS exists. Count WPs only once; research checkpoints are not WPs. Report planned baseline WPs, approved scope changes, completed with evidence, open, blocked, and not started, with reconciliation equality and a dated snapshot.

## Current P0 holds
Current signed BEAC ISO 20022 migration correction, SYGMA V10 activation, private CMA technical specs and CEMAC-BANK editions, institution-specific participation/settlement entitlement, approved PCEC mapping, current COBAC amendments, CRSP instructions, restitution and finality interpretation. No ledger/payment production code authorization.

## Mandatory recovery sequence
R1 Enumerate all GitHub paths and commit ancestry from initial commit to current HEAD, preserving original files.
R2 Reconcile checkpoint parentage and actual work-package closures, flag duplicates and broken ancestry.
R3 Retrieve and index accessible historical project chats and archives; mark inaccessible material explicitly.
R4 Reconstruct original phase taxonomy, all WP IDs, deliverables, dependencies, gates and evidence; publish a variance report against the proposed taxonomy.
R5 Review WBS and phase baseline for approval; only then publish verified planned/completed/remaining denominators.
R6 Keep existing hourly automation enabled; no duplicate automation, no invented delivery or forced implementation.

## Immediate next exact task
GOV-REC-001: enumerate canonical repository tree and full commit history, extract all phase/WP/checkpoint identifiers, reconcile historical phase map, and create an evidence-backed WBS inventory. Continue WP-ACC-005 P0 implementation hold.
