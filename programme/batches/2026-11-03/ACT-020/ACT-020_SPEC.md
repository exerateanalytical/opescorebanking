# ACT-020 — Account and deposit phase design acceptance dossier

**OPES Core Banking | Batch 80/90 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Objective and boundary
Build a quality gate for ACT-001 through ACT-019 without presenting draft specifications as deployed or fully approved product functionality.

## Candidate record and API fields
| Field | Type | Meaning |
|---|---|---|
| `acceptance_pack_id` | `uuid` | review dossier |
| `institution_id` | `uuid` | target profile |
| `product_scope` | `list` | affected offerings |
| `account_control_refs` | `list` | ACT document links |
| `financial_invariant_refs` | `list` | ledger rules |
| `regulatory_evidence_refs` | `list` | verified sources |
| `tests_planned` | `list` | acceptance scenarios |
| `tests_executed` | `list` | actual run evidence |
| `open_p0` | `list` | unresolved financial holds |
| `decision_state` | `enum` | draft/review/accepted/blocked |

## Lifecycle workflow
1. Cross-check proposed 20 ACT packages against historical source inventory.
2. Validate legal products, CIF/KYC, ownership, fees and mandate dependencies.
3. Review accounts/deposit flows for money conservation and reversal.
4. Trace each requirement to API, data, audit and test cases.
5. Execute future negative and reconciliation tests in real environment.
6. Accept only bounded implementation slices with 15-point DoR.

## Requirements and financial invariants
1. **ACT-020-REQ-01** 20 delivered ZIPs do not equal 20 completed product work packages.
2. **ACT-020-REQ-02** A documented deposit workflow is not a functioning financial system.
3. **ACT-020-REQ-03** Accounting PCEC 312/322 ambiguity blocks affected posting/migration.
4. **ACT-020-REQ-04** No rail finality without bank-specific evidence.
5. **ACT-020-REQ-05** Independent QA and CFO acceptance required for financial flows.
6. **ACT-020-REQ-06** Any unmet control must be assigned a blocker and owner.

## Acceptance tests — NOT EXECUTED
- [ ] **ACT-020-T01** Audit all 19 predecessor draft artifacts and missing approvals.
- [ ] **ACT-020-T02** Trace sample deposit to authorized journal and source.
- [ ] **ACT-020-T03** Prove duplicate action cannot create two postings.
- [ ] **ACT-020-T04** Verify balance statement reconciliation.
- [ ] **ACT-020-T05** Reject unauthorized product release.

## Acceptance and independent review gate
Approved institution product/legal profile, real tests, reviewer signatures and reconciled historical WBS.

Status: design specification, not operational banking software. Production code: 0. Executed tests: 0. Independent approvals: NONE. Original posted journals, externally evidenced settlement and current regulatory rules are not overridden. Current inherited WP-ACC-005 P0 COBAC 312/322 remains unresolved.
