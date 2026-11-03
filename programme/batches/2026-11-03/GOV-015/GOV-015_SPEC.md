# GOV-015 — Controlled scope, version and architectural change procedure

OPES Core Banking | 2026-11-03 | Batch 15/30 | Status: DRAFT DELIVERED; INDEPENDENT REVIEW OPEN
Inspected context: governance/PROGRAMME_RECOVERY_BASELINE_2026-11-03.md; governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.1_2026-11-03.md; regulatory/checkpoints/AN/README.md; regulatory/checkpoints/BA/README.md; regulatory/checkpoints/BP/README.md; regulatory/checkpoints/CA/README.md; regulatory/checkpoints/CP/README.md; regulatory/checkpoints/CT/README.md.

## Scope, findings and proposed control requirements
1. **GOV-015-R01:** Require change request with origin, reason, affected package IDs, legal/cost/security impact, alternatives, rollback and reviewer list.
2. **GOV-015-R02:** Freeze an approved WBS version per release and create new WBS revision for scope addition/removal; preserve old identifiers.
3. **GOV-015-R03:** Use semver or equivalent explicit revisions for APIs/events; prohibit breaking changes without compatibility and client-transition proof.
4. **GOV-015-R04:** Account for financial policy change effective dates and journal behavior; never mutate posted entries to emulate a policy update.
5. **GOV-015-R05:** Review security impact for auth scope changes, secrets management, IAM roles, cryptography and data residency changes.
6. **GOV-015-R06:** Use dual approval for changes to settlement rules, account mappings, fees, credit impairment policy and compliance reporting.
7. **GOV-015-R07:** Require regression test evidence and independent reconciliation for changed monetary processing; rollback must not reverse settled money by unsafe local status editing.
8. **GOV-015-R08:** Record Git commit SHA, source artifact digest, issue ID, reviewers and approved deployment window.

## Deliverables to be accepted
- Change request template
- Impact analysis checklist
- Version and rollback control matrix

## Acceptance criteria — NOT YET PASSED
- [ ] AC-1: No undocumented scope drift
- [ ] AC-2: Backward-incompatible API/event changes reviewed
- [ ] AC-3: Financial policy changes have authorized effective date

## Outstanding evidence
- No signed change board or accepted baseline yet

## Review statement
This is documentary progress, not production code or regulated acceptance. Tests actually executed in this batch: 0. No new legal assertion independently reverified against primary PDFs in this batch. Accounting and payments remain fail-closed at their P0 gates.
