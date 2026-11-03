# GOV-003 — Stakeholder and independent assurance roster

Date: 2026-11-03 | Programme: OPES Core Banking | Execution batch: 3 of 30
Status: DRAFT DELIVERABLE; REVIEW / SIGN-OFF OUTSTANDING. No production implementation, tests, audit certification or regulatory approval is claimed.
Source baseline: governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.1_2026-11-03.md; regulatory/checkpoints/CT/README.md (inspected at f1e095e4bdf5a6fb15ad469f2441e3661ce0b5a0).

## Objective
Define real decision rights for finance, legal, risk, technical and operating assurance without inventing named owners.

## Proposed requirements and enforceable controls
1. **GOV-003-R01:** Accountable sponsor owns commercial scope and budget but cannot waive accounting, legal or security P0 gates.
2. **GOV-003-R02:** CFO/financial-control authority approves accounting invariants, posting rule design, reconciliation, chart mappings and impairment consequences.
3. **GOV-003-R03:** Qualified legal/regulatory authority reviews instrument provenance, amendment chain, effective dates and disputed interpretations.
4. **GOV-003-R04:** CISO/security assurance authority controls identity, secrets, cryptography, privileged actions, PCI boundaries and incident-response gates.
5. **GOV-003-R05:** Head of Payments owns rail rules, participant contracts, external-finality evidence and reconciliation interfaces; does not infer settlement from message ACK.
6. **GOV-003-R06:** Head of Risk/Compliance owns AML/KYC, fraud monitoring, case controls, regulatory reporting and risk-classification policy.
7. **GOV-003-R07:** Architecture authority approves bounded-context ownership, event contracts, versioning and dependency isolation; must not override regulatory veto.
8. **GOV-003-R08:** Operations/BCP authority approves disaster recovery exercises, observability, runbooks, capacity and change-window readiness.
9. **GOV-003-R09:** Independent QA and internal/external audit require read-only evidence access, exact execution logs and non-repudiable reviewer decisions.

## Required deliverables
- Role register with named-position placeholders, deputies and separation constraints
- Approval-by-control-domain matrix
- Conflict-of-interest constraints and evidence-read permissions

## Acceptance criteria (NOT YET PASSED)
- [ ] AC-01: Each P0 gate has an explicit accountable decision-making role
- [ ] AC-02: No single role can create and approve its own finance-sensitive configuration
- [ ] AC-03: Review assignments are recorded before any WP is marked VERIFIED_COMPLETE

## Open dependencies and named blockers
- Actual individuals and institutional accountable signatories unassigned
- Independent audit organization not selected

## Quality and test declaration
- Regulatory and legal validity: requires independently authenticated authority and qualified review.
- Finance and ledger controls: any release must preserve immutable journals, double entry, exact decimal arithmetic, controlled reversal and independent reconciliation.
- Security: cross-tenant access, maker-checker and least privilege must be tested where applicable.
- Evidence: all acceptance results require file paths, reviewer, date, environment and actual execution result.
- This batch writes a design/control document only. Executed tests: 0. Verified WP closures: 0.

## Next dependency-correct task
Obtain independent reviewer assignments and evidence for listed acceptance criteria; do not activate financial or payment functions using unverified assumptions.
