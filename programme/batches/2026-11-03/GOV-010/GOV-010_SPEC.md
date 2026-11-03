# GOV-010 — Legal-to-engineering requirement traceability contract

OPES Core Banking | 2026-11-03 | Batch 10/30 | Status: DRAFT DELIVERED; INDEPENDENT REVIEW OPEN
Source context: governance/PROGRAMME_RECOVERY_BASELINE_2026-11-03.md; governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.1_2026-11-03.md; regulatory/checkpoints/CP/README.md; regulatory/checkpoints/CT/README.md. No renewed primary-law verification performed in this batch.

## Scope and proposed control requirements
1. **GOV-010-R01:** Assign stable requirement_id, control_id and version independent of Git file path, checkpoint label or phase naming.
2. **GOV-010-R02:** Link each operative obligation to issuer, instrument, clause/page, effective interval, legal interpretation, jurisdiction and institution profile.
3. **GOV-010-R03:** Record downstream bounded context, state machine, role/action permission, data entity, API/event contract, financial effect, test case and run evidence.
4. **GOV-010-R04:** Preserve separate statuses OBSERVED_SOURCE, LEGAL_REVIEW_PENDING, APPROVED_REQUIREMENT, IMPLEMENTED, TESTED and OPERATIONALLY_ACCEPTED.
5. **GOV-010-R05:** Disallow a requirement from being declared TESTED without test case identifier, environment, actual execution date, logs and result.
6. **GOV-010-R06:** Require negative test traceability for authorization bypass, duplicate payment, posted-journal mutation, unknown outcome and inconsistent rule versions.
7. **GOV-010-R07:** Use change impact links to invalidate previously accepted test evidence when material business rules, schemas or permissions change.
8. **GOV-010-R08:** Require reviewers for legal, CFO, security and operations where a requirement affects their respective regulated controls.

## Deliverables for formal acceptance
- Requirement traceability canonical schema
- Source-to-test coverage rubric
- Invalidation/change-impact rules

## Acceptance criteria — NOT YET PASSED
- [ ] AC-1: Every requirement links to justified source or explicitly identified business policy
- [ ] AC-2: No code marked compliant from draft alone
- [ ] AC-3: Acceptance evidence is immutable and reproducible

## Unresolved evidence and sign-offs
- No comprehensive legal instrument audit in this execution

## Quality and test declaration
Design-stage document. Executable test cases specified by related registers but no tests run here (0). Production code added: 0. Audited WP completions: 0. Regulatory source contradictions remain fail-closed. A verified push establishes only artifact custody, not design approval or regulatory compliance.
