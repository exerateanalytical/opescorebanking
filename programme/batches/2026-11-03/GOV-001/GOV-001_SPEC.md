# GOV-001 — Programme charter and non-negotiable outcomes

Date: 2026-11-03 | Programme: OPES Core Banking | Execution batch: 1 of 30
Status: DRAFT DELIVERABLE; REVIEW / SIGN-OFF OUTSTANDING. No production implementation, tests, audit certification or regulatory approval is claimed.
Source baseline: governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.1_2026-11-03.md; regulatory/checkpoints/CT/README.md (inspected at f1e095e4bdf5a6fb15ad469f2441e3661ce0b5a0).

## Objective
Establish a durable authorization boundary for a multi-institution CEMAC-configurable core banking platform; charter is a draft for sponsor ratification, not a regulatory endorsement.

## Proposed requirements and enforceable controls
1. **GOV-001-R01:** Define the product as configurable banking infrastructure, not a licensed bank or a substitute for an institution's legal authorizations.
2. **GOV-001-R02:** Scope system-of-record services: customer/CIF, products, accounts, double-entry ledger, teller/vault, clearing, lending, treasury, compliance, reporting, channels, operations and integration.
3. **GOV-001-R03:** Require every deployer to select a legally reviewed institution and jurisdiction profile before activating regulated features.
4. **GOV-001-R04:** Success is evidenced by financial invariants, independently reproduced reconciliation, enforceable permissions, recovery exercises, and institution-specific approvals—not lines of code or checkpoint counts.
5. **GOV-001-R05:** Adopt DDD boundaries, API-first integrations, traceable ADRs, a transactional outbox/inbox and asynchronous projections where fit; forbid mutable posted journals.
6. **GOV-001-R06:** Separate document completion, implementation completion, security/regulatory review, pilot acceptance and production authorization as different gates.
7. **GOV-001-R07:** Prohibit invented certification, central-bank access, payments entitlement, account classifications or operational cutover dates.
8. **GOV-001-R08:** Publish release boundary: design drafts and demonstrations may exist without activating disputed PCEC mappings or unverified settlement behavior.

## Required deliverables
- Signed charter with legal entity, sponsor, scope exclusions and accountable owner
- Definition of success with measurable balance/reconciliation/recovery controls
- Scope-to-phase mapping across provisional P00–P12
- Escalation owner for safety-critical disagreement

## Acceptance criteria (NOT YET PASSED)
- [ ] AC-01: Sponsor and regulated-institution representatives approve charter version
- [ ] AC-02: Legal/CFO/CISO/Operations acknowledge release exclusions and their independent vetoes
- [ ] AC-03: Every stated success criterion maps to an evidence artifact and reviewer

## Open dependencies and named blockers
- Sponsor signatory not established from inspected sources
- Target bank institution profiles and regulators' applicable editions not approved

## Quality and test declaration
- Regulatory and legal validity: requires independently authenticated authority and qualified review.
- Finance and ledger controls: any release must preserve immutable journals, double entry, exact decimal arithmetic, controlled reversal and independent reconciliation.
- Security: cross-tenant access, maker-checker and least privilege must be tested where applicable.
- Evidence: all acceptance results require file paths, reviewer, date, environment and actual execution result.
- This batch writes a design/control document only. Executed tests: 0. Verified WP closures: 0.

## Next dependency-correct task
Obtain independent reviewer assignments and evidence for listed acceptance criteria; do not activate financial or payment functions using unverified assumptions.
