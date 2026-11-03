# Checkpoint CK — WP-ACC-005: R-2018/01 primary-text classification/provisioning gate and incomplete 2015 amendment review

Date: 2026-11-03. Predecessor: CJ. Phase 4 — Accounting Core and Financial Integrity. **SAFE RESEARCH CHECKPOINT ONLY; WP-ACC-005 OPEN / P0 BLOCKED.** No implementation, executable tests, certification, or approved regulatory parameters.

## Scope and evidence access

- Canonical CJ reviewed before proceeding: `regulatory/checkpoints/CJ/README.md`.
- Official issuer index, consulted 2026-11-03: https://www.beac.int/supervision-bancaire/reglements-de-cobac/
- **Newly examined primary text**: COBAC R-2018/01, issuer-hosted 12-page PDF, adopted 16 January 2018: https://www.beac.int/wp-content/uploads/2016/10/reglement_cobac_r_2018-01_relatif_a_la_classification_a_la_comptabilisation_et_au_provisionnement_des_creances.pdf
- I-2015/01 source URL: https://www.beac.int/wp-content/uploads/2016/10/instruction_cobac_i_2015_01_pcec.pdf . **Access blocked in this run** (web PDF fetch timeout; local runtime network DNS unavailable). Therefore the mandated full visual review of Articles 2–13 **was not completed**. CJ's selected-page observations remain historical partial evidence; do not claim an exhaustive account-change matrix.
- The official issuer's R-2018/01 text was available through web text extraction, not independently visually inspected on every page. Its printed effective-date line is ambiguous in extracted text and needs screenshot confirmation. **No operative-date claim is approved**.

## Provision-to-engineering control matrix: R-2018/01 (primary text, subject to later amendment/effectivity review)

| Articles | Source-observed rule | Engineering consequence | Remaining approval gate |
|---|---|---|---|
| 1–3 | Credit institutions covered; classification, recognition and provisioning in conjunction with PCEC and R-2016/04; performing, sensitive, distressed, and on/off-balance exposure scope. | Model licensed-institution applicability and exposure class independent of account number. | Current amendments, institutional licensing profile. |
| 7–9 | Immobilized, unpaid and doubtful exposures include instrument-specific aging, legal and qualitative triggers; 90/180-day cases appear. | Event-driven delinquency evidence, instrument-type calendar and qualitative overrides; no simplistic global DPD threshold. | Legal review of all trigger exceptions and current rules. |
| 10 | Doubtful classification contagion across counterparty and defined related persons/group. | Related-party graph, explainable group-wide reclassification and review trail. | R-2010/02 related-party definitions and exceptions. |
| 13–14 | Restructuring approval hierarchy, probation and reclassification conditions. | Separate restructures, maker-checker authority, cash-source proof, probation timers, independent risk review. | Legal reviewer confirmation and amendments. |
| 15 | Classification-specific accounting treatment; uncollected interest/fees on troubled exposures must not be recognized as collected income; reversals/off-balance treatment. | Ledger design must support controlled reversal and separate memorandum/off-balance tracking; no balance mutation. | CFO-approved PCEC journal mappings, tax and reporting reconciliation. |
| 16–18 | General vs specific provisions; historical numeric minima and time-based provisioning schedules stated in this 2018 instrument. | Effective-dated provision-policy candidates only; reject activation without later amendment chain and approved accounting mappings. | Current operative rule, date, exemptions, bank risk policy. |
| 19–22 | Guarantee eligibility and legal perfection, maturity and mortgage valuation criteria. | Evidence-backed collateral eligibility and valuation expiry, not a checkbox. | Collateral/legal source chain, operational validation. |
| 23–25 | Specific provision accounts, recoveries/reclassifications and prompt category tagging. | Distinct provisioning journal, exposure classification timeline, off-balance exposure lifecycle. | PCEC mapping and reporting instructions. |
| 26–30 | COBAC can impose classification; minimum standards; prior regulator approval for related-party write-off; periodic reporting; restrictions on provision release. | Regulator override workflow, pre-approval evidence and fail-closed write-off, separate reporting taxonomy. | Regulator correspondence/permissions and CERBER operative instructions. |
| 32 | Explicitly repeals contrary earlier provisions, notably COBAC R-2014/01. | Record explicit R-2014/01 supersession for conflicting classification/provisioning rules; **not** wholesale repeal of I-2015/01 or PCEC. | Exact conflict mapping with 2015 Articles 2–13 and subsequent instruments. |
| 33–34 | Effective-date clause and notification appear, but extracted effective-date numeral is unclear. | Effective date marked **UNVERIFIED** until page-image inspection. | Screenshot/manual reading and any later effectivity changes. |

## Critical regulatory reconciliation finding

**R-2018/01 Article 32 expressly names R-2014/01 as repealed.** It does not expressly state that all I-2015/01 PCEC chart changes are repealed. Article 1 explicitly retains PCEC as a co-applicable source. Thus:
1. Do not automatically erase 2015 account definitions.
2. Do not implement 2015 credit-classification/provisioning rates without conflict and subsequent-rule review.
3. Maintain separate versioned legal instruments for PCEC account chart, classification, provisioning, CERBER reporting, and PCEMF microfinance.
4. Never treat a source's adoption date as its proven operative effective date.

## Proposed data and state contracts — design only

`RegulatoryInstrument(id,issuer,document_hash,article,publication_date,effective_from,effective_to,verification_status,applicability_profile,supersedes,approved_by)`.
`ExposureClassification(exposure_id,counterparty_id,group_id,instrument_type,classification,trigger_type,trigger_observed_at,legal_rule_version,reviewer,decision_at)`.
`ProvisionPolicy(version,institution_profile,exposure_class,guarantee_class,calculation_basis,thresholds,legal_basis,approval_state,effective_period)`.
`ClassificationEvent` and `ProvisionDecision` must be auditable and cannot independently create monetary ledger entries; posting requires separately authorized balanced journal command with idempotency key and reconciliation.
Proposed lifecycle: `OBSERVED -> EVIDENCE_PENDING -> REVIEW_PENDING -> APPROVED -> EFFECTIVE`; rejected, contested, superseded and regulatory-override paths remain separate and immutable.

## Security, operations and acceptance cases — specified, NOT executed

- Fail closed if classification rule is unverified, stale, institution-inapplicable or ambiguously effective.
- Flag counterparty-group contagion for all related exposures and retain provenance.
- Require regulator approval evidence before a related-party write-off where applicable.
- Prevent income recognition from unpaid distressed-exposure interest contrary to approved policy; never retroactively edit journals.
- Detect guarantee expiry, missing legal perfection and out-of-date collateral valuations.
- Reject account migration where historical account IDs changed semantic meaning and no approved crosswalk exists.
- Require maker-checker for provision policy activation and independent reconciliation for journals/reporting.
- Preserve existing payment-rail authorization, SYGMA V10, HSM, CFO-approved mapping and institution licensing P0 gates.

## Quality review and readiness

Regulatory: **partial**; R-2018/01 text inspected, I-2015/01 full page inspection blocked, later chain not established. Financial: journal controls remain conceptual; CFO approval absent. Architecture: proposed separations recorded, not implemented. Security/AML/risk: authorization and group contagion proposed, not certified. Data/retention: provenance proposed, retention chain open. Operations/DR: no runbook evidence. Tests: scenarios specified only, **0 executed**. **Definition of Ready FAILED**.

## Execution accounting

Work packages attempted: 1 (WP-ACC-005 continuation); completed: 0; open: 1; blocked from closure: 1. Safe research checkpoints: 1 (CK). P0 blockers resolved: 0. Production code: 0. Tests executed: 0. No dependent work package attempted.

## NEXT EXACT TASK

**WP-ACC-005 — Checkpoint CL:** Obtain reliable page-image access to I-2015/01; inspect all Articles 2–13 and build an article/page/account-number change matrix. Reconcile each conflicting 2015 classification/provisioning clause with R-2018/01, verify the 2018 effective-date scan, and preserve PCEC/CERBER/PCEMF and CFO approval gates. Do not activate parameters or implement ledger postings.
