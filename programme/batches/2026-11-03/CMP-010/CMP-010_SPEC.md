# CMP-010 — Compliance phase acceptance matrix and P0 release dependencies

Batch 150 | OPES Core Banking | 2026-11-03 | DRAFT, REVIEW OPEN

## Purpose
Document actual closure requirements for CMP-001 through CMP-009, explicitly retaining regulatory/legal gaps and separating checkpoint creation from reviewed implementation.

## Candidate data model
| Name | Type | Intent |
|---|---|---|
| `acceptance_pack_id` | uuid | Review dossier |
| `institution_id` | uuid | Licensed bank |
| `package_ids` | array | Compliance scope |
| `authority_refs` | array | Primary regulations |
| `screening_evidence_refs` | array | Source edition proofs |
| `risk_rule_refs` | array | Approved policies |
| `executed_test_refs` | array | Real test logs |
| `reviewer_roles` | array | Compliance legal security QA |
| `open_p0_refs` | array | Critical blockers |
| `decision_state` | string | Draft blocked review accepted |

## State transitions and guards
1. DRAFT>IN_REVIEW:source coverage established
2. IN_REVIEW>BLOCKED:missing legal or execution proof
3. IN_REVIEW>ACCEPTED:all applicable gates passed
4. ACCEPTED>SUPERSEDED:material amendment
5. BLOCKED>IN_REVIEW:new independent evidence

## Workflow and recovery
1. Reconcile nine CMP packages to prior historical work and applicable authoritative sources
2. Verify sanctions/PEP/AML source versions, internal rules, evidence custody and confidentiality
3. Build executable screening, role, deduplication, reporting and reversal-negative tests
4. Obtain independent qualified legal, Compliance, CFO, CISO and QA decisions
5. Issue narrowly scoped acceptance only for implemented portions with linked evidence

## Required controls
1. CMP-010-REQ-01: Ten ZIP documentation packages are not ten accepted compliance capabilities
2. CMP-010-REQ-02: No regulator or licensed-institution signoff can be fabricated
3. CMP-010-REQ-03: A partial AML algorithm does not establish current legal conformity
4. CMP-010-REQ-04: Historical WP-ACC-005 312/322 conflict still blocks affected reporting mapping
5. CMP-010-REQ-05: Institution-specific payment permission cannot be inferred from standard message conformance
6. CMP-010-REQ-06: No test passed without actual execution evidence
7. CMP-010-REQ-07: All approval decisions carry version, reviewer, legal entity and unresolved exceptions

## Acceptance cases — NOT RUN
- [ ] CMP-010-T01: Incomplete source authority blocks acceptance
- [ ] CMP-010-T02: Unsigned regulatory reporting dataset fails gate
- [ ] CMP-010-T03: Unauthorized suspicious activity export rejected
- [ ] CMP-010-T04: Mock scan results cannot count as live certification
- [ ] CMP-010-T05: Acceptance pack identifies unresolved dependencies

## Evidence gate
Complete historical WBS and legal authority review, actual executed tests, approved bank AML/reporting policies and signed independent acceptance.

Code: none. Tests executed: zero. Independent review: pending. No regulatory certification. Historical accounting 312/322 and bank-specific rail participation P0s remain blocked.
