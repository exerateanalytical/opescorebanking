# OPES Core Banking — Canonical Master Plan and WBS Recovery Register v0.1
Date: 2026-11-03
Baseline commit inspected: cd71c4fce3e246349399da7ec1009c90930f9596 (main)
Authority: PROVISIONAL INVENTORY, NOT APPROVED SCOPE OR WP COMPLETION.
Owner: OPESWARE TECHNOLOGIES. Work package: GOV-REC-001.

## Destination and completion contract
Deliver a regulator/auditor-ready CEMAC-configurable enterprise core banking platform spanning governance/regulatory profiles, identity/KYC, product factory/accounts, immutable double-entry ledger, teller/vault, payments/clearing/settlement/reconciliation, lending, treasury, AML/fraud/risk, prudential reporting, digital channels, infrastructure/DR, migration, certification and release. Completion requires per-WP DoR/DoD and acceptance evidence; a checkpoint file or ZIP is NOT a completed WP. Production code requires all 15 DoR gates for its independent bounded context.

## Verified repository inventory at baseline
- Git tree returned without truncation: 348 blob paths; 419 total tree entries (including directories).
- regulatory/checkpoints/: 317 blob paths, including 59 checkpoint README records, consecutively AN through CT in the visible series.
- Other tracked blobs: 31 (348 - 317); these include historical ZIP archives, recovery manifests, governance notes, a workflow, and a recovery script.
- No exhaustive historical commit-ancestry review, binary archive content reconciliation, or full acceptance-evidence audit has yet occurred.
- Current reported phase: historical Phase 4 Accounting Core and Financial Integrity. Active WP-ACC-005 OPEN/P0 BLOCKED. WP-ACC-004 is REPORTED COMPLETE but not independently reaudited. Other WPs UNKNOWN.
- Current 312/322 discrepancy: COBAC Instruction I-2015/01 Article 8(d), with prior evidence in checkpoints CP–CT. No signed correction authenticated; disputed mappings remain fail-closed.
- Last verified checkpoint CT, not AD/AE; do not regress to earlier lineage.

## Proposed programme phase register (NOT a verified historical denominator)
P00 governance, institution profiles, regulations
P01 platform architecture and cross-cutting controls
P02 customer identity, CIF, KYC/KYB
P03 product factory, accounts, deposits
P04 accounting core and ledger
P05 branch, teller, vault
P06 payments, clearing, settlement, reconciliation
P07 credit, collateral, collections, impairment
P08 treasury, liquidity, FX, investments
P09 AML, fraud, risk, prudential and regulatory reporting
P10 digital/mobile/corporate/agency channels
P11 infrastructure, cybersecurity, operations, DR, migration
P12 independent certification, pilot and release
These 13 categories are provisional grouping labels only; do not conflate with historic Phase 4 numbering or claim a complete set of WPs.

## WBS recovery register (enumerated known WPs only)
| WP ID | Deliverable and acceptance gate | Status | Evidence | Dependencies |
| --- | --- | --- | --- | --- |
| GOV-REC-001 | Complete source inventory, historical checkpoint/commit reconciliation, archive extraction and evidence-backed WP register | IN_PROGRESS | governance/PROGRAMME_RECOVERY_BASELINE_2026-11-03.md; current tree inventory | repository access |
| GOV-REC-002 | Historical phase and WP crosswalk with duplicates, claims and source provenance | NOT_STARTED | none | GOV-REC-001 |
| GOV-REC-003 | Reviewed canonical WBS: exhaustive WP IDs, scope, owners, DoR/DoD, deliverables, dependencies and change control | NOT_STARTED | none | GOV-REC-002 |
| GOV-REC-004 | Approved count reconciliation and progress dashboard; total = verified complete + in progress + blocked + not started, no double counting | NOT_STARTED | none | GOV-REC-003 |
| GOV-REC-005 | Domain-specific independent implementation readiness evidence and risk signoffs | NOT_STARTED | none | GOV-REC-003 and relevant regulatory/domain gates |
| WP-ACC-004 | Historical Accounting Core WP closure evidence re-audit | REPORTED_COMPLETE_NOT_VERIFIED | inherited AN/CD statement | source/evidence reconciliation |
| WP-ACC-005 | Authoritative PCEC, regulatory accounting mapping and financial-integrity readiness | BLOCKED_P0 | checkpoints CP–CT; CT/README.md | signed correction or applicable binding instrument, legal/CFO review |
| WP-PAY-GIMAC-001 | Payments participation and GIMAC integration requirements (historical WP identifier) | OPEN_NOT_ATTEMPTED per AN continuation | regulatory/recovery/source/AN/CONTINUATION_STATE.json | institutional participation evidence |
No other WP is presumed nonexistent; this is a DISCOVERED subset, not an exhaustive WBS. Historical phase/WP IDs must be extracted from all 317 checkpoint files and original nested archives before count closure.

## Counting rules and current metrics
Verified exhaustive planned WP denominator: UNKNOWN.
Verified complete WPs: 0 established by this audit (NOT a claim that no historical WP was completed).
Remaining WPs: UNKNOWN.
Known identified WPs in this provisional register: 8, of which 5 GOV recovery/control WPs are newly defined; these are NOT the entire programme.
Known P0 blocked: WP-ACC-005.
Checkpoint README count 59 is not a WP count, nor a completion percentage.
Source claims must be tagged REPORTED, VERIFIED, CONTRADICTED, or UNKNOWN; missing evidence never becomes PASS.

## Critical path and execution controls
1. GOV-REC-001: enumerate all checkpoint files, extract phase/WP IDs and assertions; reconcile all historical archive bytes and commit ancestry, including missing/unpushed recovery artifacts.
2. GOV-REC-002: map aliases, predecessor relationships, duplicate content and historic completion claims.
3. GOV-REC-003: propose and review exhaustive domain WBS, explicit deliverables and DoD; obtain approval before publishing a final denominator.
4. GOV-REC-004: publish reconciled remaining work count and critical path.
5. GOV-REC-005: review truly independent implementation slices against 15 DoR gates; no forced code start.
Parallel independent evidence work: WP-ACC-005 checkpoint CU may research historical COBAC bulletins, but no disputed account activation, posting, migration, or reporting mapping.
Each subsequent run must read this register, update only evidence-supported states, commit every completed safe checkpoint, and independently verify remote SHA/path.

## Acceptance checklist for GOV-REC-001
[PASS] GitHub main branch head/tree inspected and blob/checkpoint counts recorded.
[PASS] Prior governance baseline and CT continuation reviewed.
[OPEN] All 317 checkpoint files parsed for phase, WP, completion, blockers and provenance.
[OPEN] Full commit ancestry and exact parentage reconciled.
[OPEN] Original cumulative AN ZIP and all available historical archives independently hashed, unpacked, and compared to canonical files.
[OPEN] All discoverable historical conversations and artifacts cross-indexed with provenance; inaccessible material explicitly recorded.
[OPEN] WP register complete enough to support an auditable scope baseline.
Thus GOV-REC-001 remains OPEN. No documentation-completion percentage is authorized.

## Risk/quality review
Legal: PCEC conflict and current amendment authority unresolved.
CFO/accounting: immutable journal, exact arithmetic, maker-checker and independent reconciliation remain mandatory; no accounting implementation authorized.
Security/AML: no external entitlement or identity policy fabricated.
Architecture: keep provisional phase taxonomy separate from historical numbering; no hidden dependencies.
Data/audit: evidence links and status provenance required for every closure.
Operations/tests: zero executable tests claimed in this inventory; no certification inferred.
Quality decision: SAFE GOVERNANCE CHECKPOINT ONLY, NOT WP COMPLETE.

## NEXT EXACT TASK
GOV-REC-001 continuation: programmatically parse the 317 regulatory/checkpoints files and recovered AN archive for unique historical WP identifiers, phase references, completion assertions and parent checkpoints; produce a machine-readable evidence-backed crosswalk with source paths and confidence, then reconcile commit ancestry. Maintain WP-ACC-005 P0 hold.
