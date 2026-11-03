# GOV-009 — Effective dating, amendments and regulatory version control

OPES Core Banking | 2026-11-03 | Batch 9/30 | Status: DRAFT DELIVERED; INDEPENDENT REVIEW OPEN
Source context: governance/PROGRAMME_RECOVERY_BASELINE_2026-11-03.md; governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.1_2026-11-03.md; regulatory/checkpoints/CP/README.md; regulatory/checkpoints/CT/README.md. No renewed primary-law verification performed in this batch.

## Scope and proposed control requirements
1. **GOV-009-R01:** RegulatoryRule must include authority_id, document_version, clause_ref, jurisdiction, institution_class, effective_from/to, verification_status and source_digest where measured.
2. **GOV-009-R02:** Never overwrite an approved historical rule; amend by new version with legal-effective date and transaction-processing cutover date as separate fields.
3. **GOV-009-R03:** Distinguish publication date, signature date, legal commencement, technical migration milestone and actual institution activation.
4. **GOV-009-R04:** A signed instrument with an inconsistent calendar must retain original dates and CONFLICTED status pending issuer correction.
5. **GOV-009-R05:** Reprocess historical balances only under an explicitly approved correction/migration event; prohibit retroactive silent journal edits.
6. **GOV-009-R06:** At rule evaluation, select a unique authorized version; multiple overlapping active rules fail closed and create a review case.
7. **GOV-009-R07:** Store amendment and supersession edges at clause level with reviewer, before/after scope and reason; no assumption that a new regulation replaces all prior parts.
8. **GOV-009-R08:** Record rule change impacts on reporting, product pricing, risk classification, alerts, ledger posting and audit retrieval.

## Deliverables for formal acceptance
- Versioned rule schema
- Conflict resolution state diagram
- Migration cutover acceptance design

## Acceptance criteria — NOT YET PASSED
- [ ] AC-1: No active overlap for same authority/profile interval
- [ ] AC-2: Historical postings reproducible using prior rules
- [ ] AC-3: Disputed year cannot enable production

## Unresolved evidence and sign-offs
- BEAC 2025 annex inconsistencies unresolved; competent amendment sources pending

## Quality and test declaration
Design-stage document. Executable test cases specified by related registers but no tests run here (0). Production code added: 0. Audited WP completions: 0. Regulatory source contradictions remain fail-closed. A verified push establishes only artifact custody, not design approval or regulatory compliance.
