# GOV-004 — Governance ceremonies and stop/go decision controls

Date: 2026-11-03 | Programme: OPES Core Banking | Execution batch: 4 of 30
Status: DRAFT DELIVERABLE; REVIEW / SIGN-OFF OUTSTANDING. No production implementation, tests, audit certification or regulatory approval is claimed.
Source baseline: governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.1_2026-11-03.md; regulatory/checkpoints/CT/README.md (inspected at f1e095e4bdf5a6fb15ad469f2441e3661ce0b5a0).

## Objective
Make phase and release progression evidence-based instead of time-based or checkpoint-count-based.

## Proposed requirements and enforceable controls
1. **GOV-004-R01:** Establish architecture review on ADR changes, accounting review on mapping/posting changes, security review on identity or cryptographic changes and regulatory review on legal applicability changes.
2. **GOV-004-R02:** Record decisions as immutable signed or otherwise accountable entries with decision ID, version, proposer, reviewer, vote, dissent, evidence list and timestamp.
3. **GOV-004-R03:** Treat severe unresolved accounting/regulatory/security ambiguities as FAIL_CLOSED; allow only independent domains to progress with documented isolation.
4. **GOV-004-R04:** Require a change impact analysis when an assumption moves from draft to approved or a primary authority changes.
5. **GOV-004-R05:** Define per-WP gate states NOT_STARTED, IN_PROGRESS, BLOCKED, REVIEW_READY and VERIFIED_COMPLETE; no auto-promotion from a pushed ZIP.
6. **GOV-004-R06:** Require review of negative acceptance scenarios: reversal, duplicates, retry, boundary access, unknown external outcome, outage and migration rollback.
7. **GOV-004-R07:** Require a verified continuation point and explicit blocker register after every execution run.
8. **GOV-004-R08:** Require a remote source-control checkpoint with archival provenance and content digest before counting a batch as DELIVERED.

## Required deliverables
- Decision-record schema and agenda
- P0 escalation and independent-work bypass prohibition
- DoR/DoD and phase stop/go checklist

## Acceptance criteria (NOT YET PASSED)
- [ ] AC-01: No unreviewed draft is represented as approved policy
- [ ] AC-02: Status reconciliation sums across registered packages without duplicate identifiers
- [ ] AC-03: P0 exceptions have a signed escalation rather than silent override

## Open dependencies and named blockers
- Board/forum members not appointed
- Review cadence and quorum need sponsor ratification

## Quality and test declaration
- Regulatory and legal validity: requires independently authenticated authority and qualified review.
- Finance and ledger controls: any release must preserve immutable journals, double entry, exact decimal arithmetic, controlled reversal and independent reconciliation.
- Security: cross-tenant access, maker-checker and least privilege must be tested where applicable.
- Evidence: all acceptance results require file paths, reviewer, date, environment and actual execution result.
- This batch writes a design/control document only. Executed tests: 0. Verified WP closures: 0.

## Next dependency-correct task
Obtain independent reviewer assignments and evidence for listed acceptance criteria; do not activate financial or payment functions using unverified assumptions.
