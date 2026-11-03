# GOV-011 — 260-package planning envelope and baseline reconciliation

OPES Core Banking | 2026-11-03 | Batch 11/30 | Status: DRAFT DELIVERED; INDEPENDENT REVIEW OPEN
Source context: governance/PROGRAMME_RECOVERY_BASELINE_2026-11-03.md; governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.1_2026-11-03.md; regulatory/checkpoints/CP/README.md; regulatory/checkpoints/CT/README.md. No renewed primary-law verification performed in this batch.

## Scope and proposed control requirements
1. **GOV-011-R01:** Adopt P00–P12 as proposed workstream categories; do not claim they reproduce historical phase numbering.
2. **GOV-011-R02:** Allocate 20 planning slots per proposed phase, 260 slots total, only as a provisional denominator subject to decomposition and sponsor approval.
3. **GOV-011-R03:** Use GOV-001 through GOV-020, ARC-001 through ARC-020, CIF-001 through CIF-020, ACT-001 through ACT-020, ACC-001 through ACC-020 and BRN-001 through BRN-020.
4. **GOV-011-R04:** Continue PAY-001 through PAY-020, CRD-001 through CRD-020, TRY-001 through TRY-020, CMP-001 through CMP-020, CHN-001 through CHN-020, OPS-001 through OPS-020 and REL-001 through REL-020.
5. **GOV-011-R05:** Retain historic WP-ACC-004, WP-ACC-005 and WP-PAY-GIMAC-001 as separate source identifiers until crosswalk resolves overlap; avoid falsely completing proposed ACC-004 because history reports WP-ACC-004.
6. **GOV-011-R06:** Each slot requires bounded context, scope, accountable owner, dependencies, deliverables, DoR, DoD, acceptance, source evidence, estimation class and risk status.
7. **GOV-011-R07:** Only a signed baseline with source reconciliations authorizes actual completed/remaining denominator; historic 59 checkpoint README records do not equal completed packages.
8. **GOV-011-R08:** Version scope additions/deletions through change control and maintain arithmetic total = verified complete + review-ready + in progress + blocked + not started, with disjoint status categories.

## Deliverables for formal acceptance
- Provisional 13×20 slot register
- Historical-to-proposed ID crosswalk fields
- Controlled denominator acceptance rules

## Acceptance criteria — NOT YET PASSED
- [ ] AC-1: Every of 260 slots uniquely identified
- [ ] AC-2: No historical completion silently copied to proposed slot
- [ ] AC-3: Approved total withheld until reconciliation

## Unresolved evidence and sign-offs
- Source archives and historical commit ancestry not exhaustively cross-referenced

## Quality and test declaration
Design-stage document. Executable test cases specified by related registers but no tests run here (0). Production code added: 0. Audited WP completions: 0. Regulatory source contradictions remain fail-closed. A verified push establishes only artifact custody, not design approval or regulatory compliance.
