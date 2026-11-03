# BRN-020 — Branch teller and vault phase assurance dossier

Batch 140 | OPES Core Banking | 2026-11-03 | DRAFT, REVIEW OPEN

## Purpose
Create an explicit acceptance gate for twenty branch/cash design packages, separating documentary delivery from real cash and ledger certification.

## Candidate data model
| Name | Type | Intent |
|---|---|---|
| `assurance_pack_id` | uuid | Review dossier |
| `institution_id` | uuid | Target bank |
| `work_package_refs` | array | BRN-001 through BRN-019 |
| `source_evidence_refs` | array | Policy and legal authorities |
| `cash_test_refs` | array | Real physical control tests |
| `ledger_test_refs` | array | Accounting invariants |
| `security_test_refs` | array | Access controls |
| `reviewer_roles` | array | Cash CFO CISO QA |
| `open_findings` | array | Unresolved blockers |
| `decision_state` | string | Draft blocked accepted |

## State transitions and guards
1. DRAFT>IN_REVIEW:register complete
2. IN_REVIEW>BLOCKED:missing P0 evidence
3. IN_REVIEW>APPROVED:all gates satisfied
4. APPROVED>SUPERSEDED:material scope change
5. BLOCKED>IN_REVIEW:new evidence verified

## Workflow and recovery
1. Crosswalk BRN 001–019 drafts to historical programme work and branch policy
2. Review exact cash source evidence, custody, KYC and teller role model
3. Verify business state machines, API contracts and accounting posting dependencies
4. Execute real physical count, concurrent replay, security and ledger tests
5. Obtain independent CFO/Operations/CISO/QA approvals before any deployment

## Required controls
1. BRN-020-REQ-01: Twenty ZIPs do not mean twenty completed banking capabilities
2. BRN-020-REQ-02: No cash-related posting passes without PCEC interpretation review
3. BRN-020-REQ-03: Bank-specific cash/branch licensing evidence must be authentic
4. BRN-020-REQ-04: No test case is marked passed without execution log
5. BRN-020-REQ-05: All P0 deficiencies remain listed, not waived
6. BRN-020-REQ-06: Phase approval has exact reviewer, commit and environment

## Acceptance cases — NOT RUN
- [ ] BRN-020-T01: Trace each BRN package to concrete acceptance evidence
- [ ] BRN-020-T02: Reject dossier without cash reconciliation proof
- [ ] BRN-020-T03: Reject self-approval of vault transfer
- [ ] BRN-020-T04: Reject ledger correction by direct balance mutation
- [ ] BRN-020-T05: Reject missing bank policy as approved

## Evidence gate
Historical WBS reconciliation, physical cash tests, qualified banking reviewers and 15-point DoR controls.

Code: none. Tests executed: zero. Independent review: pending. No regulatory certification. Historical accounting 312/322 and bank-specific rail participation P0s remain blocked.
