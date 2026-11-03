# GOV-013 — Definition of Ready, Done and evidence acceptance matrix

OPES Core Banking | 2026-11-03 | Batch 13/30 | Status: DRAFT DELIVERED; INDEPENDENT REVIEW OPEN
Inspected context: governance/PROGRAMME_RECOVERY_BASELINE_2026-11-03.md; governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.1_2026-11-03.md; regulatory/checkpoints/AN/README.md; regulatory/checkpoints/BA/README.md; regulatory/checkpoints/BP/README.md; regulatory/checkpoints/CA/README.md; regulatory/checkpoints/CP/README.md; regulatory/checkpoints/CT/README.md.

## Scope, findings and proposed control requirements
1. **GOV-013-R01:** Apply 15 domain implementation DoR gates: scope, institutional profile, primary sources, invariants, workflows, roles, accounting, security, API/events, data, tests, operations, dependencies, no P0 and durable repository.
2. **GOV-013-R02:** Distinguish documentation DRAFT_DELIVERED, PEER_REVIEWED, OWNER_APPROVED and ACCEPTED; publishing a GitHub commit is not completion.
3. **GOV-013-R03:** Domain DoD includes functional specification, approved API/data contracts, all error paths, negative cases, test run evidence, security review and operational runbook.
4. **GOV-013-R04:** Financial DoD requires double-entry proof, immutable journals, exact money arithmetic, reversal procedures, daily reconciliation and failure recovery cases.
5. **GOV-013-R05:** Payment DoD requires authenticated participant entitlement, schema edition, safe retry, unknown-outcome handling, finality evidence and transaction-to-statement reconciliation.
6. **GOV-013-R06:** Operations DoD requires monitoring, capacity, backup restore, RPO/RTO validation, incident response and independent change signoff.
7. **GOV-013-R07:** Certification DoD requires qualified external evidence, institution-specific approval and signed acceptance; do not self-issue regulator certification.
8. **GOV-013-R08:** Use status BLOCKED when critical evidence is absent; no pressure from hourly quota may override this status.

## Deliverables to be accepted
- Machine-readable DoR/DoD checklist
- Evidence acceptance rubric
- Cross-domain release gate matrix

## Acceptance criteria — NOT YET PASSED
- [ ] AC-1: No package moves to VERIFIED_COMPLETE without all mandatory evidence
- [ ] AC-2: No code on unsatisfied DoR
- [ ] AC-3: Checkpoints remain distinct from accepted WPs

## Outstanding evidence
- Reviewers, test environment and institution approval still unassigned

## Review statement
This is documentary progress, not production code or regulated acceptance. Tests actually executed in this batch: 0. No new legal assertion independently reverified against primary PDFs in this batch. Accounting and payments remain fail-closed at their P0 gates.
