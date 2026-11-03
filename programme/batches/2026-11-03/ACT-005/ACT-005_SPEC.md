# ACT-005 — Product approval, release and suspension controls

**OPES Core Banking | Batch 65/90 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Objective and boundary
Set up institution-controlled product approval with independent risk, finance and compliance signoffs before offers are operational.

## Candidate record and API fields
| Field | Type | Meaning |
|---|---|---|
| `product_change_id` | `uuid` | request ID |
| `institution_id` | `uuid` | owner |
| `product_id` | `uuid` | catalogue identity |
| `terms_version` | `string` | review candidate |
| `maker_id` | `string` | proposer |
| `reviewer_roles` | `list` | review participants |
| `financial_impact_ref` | `uuid` | posting impact |
| `approval_decision` | `enum` | pending/approved/rejected |
| `effective_at` | `datetime` | authorized start |
| `audit_evidence_refs` | `list` | decision evidence |

## Lifecycle workflow
1. Submit reviewed product edition and risk assessment.
2. Validate financial mapping and product eligibility dependencies.
3. Collect legal/CFO/compliance approvals with non-self-approval checks.
4. Prepare release rollback and change notification.
5. Activate only approved effective-dated product edition.
6. Suspend future intake if authority expires without modifying past contracts.

## Requirements, financial and authorization invariants
1. **ACT-005-REQ-01** Approval cannot be inferred from a ZIP checkpoint or deployment.
2. **ACT-005-REQ-02** Bank product regulation may differ by institution and license type.
3. **ACT-005-REQ-03** No single proposer can grant final financial product activation.
4. **ACT-005-REQ-04** Unreviewed fees/rates cannot post to ledger.
5. **ACT-005-REQ-05** Suspension stops new issuance without rewriting historical agreements.
6. **ACT-005-REQ-06** Every decision is reproducible from evidence and approved version.

## Acceptance tests — NOT EXECUTED
- [ ] **ACT-005-T01** Self-approval denied.
- [ ] **ACT-005-T02** Missing CFO mapping blocks release.
- [ ] **ACT-005-T03** Old contract remains intact after suspension.
- [ ] **ACT-005-T04** Expired license disables new enrolment.
- [ ] **ACT-005-T05** Duplicate approval command cannot double activate.

## Acceptance and independent review gate
Actual institutional product committee, applicable regulatory evidence and finance/risk approval.

Status: This is a candidate design document, not operational bank software. No production code, executed tests, independent signoff or regulatory certification is asserted. The PCEC 312/322 mapping conflict and unverified external payment/settlement participation remain P0 and prohibit dependent activation.
