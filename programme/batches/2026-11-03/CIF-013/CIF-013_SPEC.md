# CIF-013 — Enhanced due diligence and escalated onboarding decisions

**OPES Core Banking | Batch 53/60 | Date 2026-11-03 | DRAFT / REVIEW OPEN**

## Objective
Create a controlled workflow for high-risk, opaque or unusual applicant cases with independent compliance approval and documented residual risk.

## Candidate structured data model
| Attribute | Type | Definition |
|---|---|---|
| `edd_case_id` | `uuid` | enhanced diligence case |
| `onboarding_case_id` | `uuid` | original applicant case |
| `risk_trigger_codes` | `list` | approved rationale |
| `source_of_funds_refs` | `list` | protected source evidence |
| `source_of_wealth_refs` | `list` | where lawfully required |
| `beneficial_owner_gap_refs` | `list` | unknown controller cases |
| `evidence_checklist_version` | `string` | jurisdiction/profile edition |
| `assigned_investigator` | `string` | qualified reviewer |
| `decision` | `enum` | open/more_information/approved_with_controls/rejected |
| `review_due_at` | `datetime|null` | monitoring follow-up |

## Workflow sequence
1. Create EDD case from risk, PEP, beneficial-ownership or other approved triggers.
2. Request proportionate additional information under lawful purpose.
3. Validate source documents and record contradictory or missing evidence.
4. Require independent compliance escalation and documented restrictions.
5. Approve, conditionally defer or reject with precise controlled disposition.
6. Set re-review triggers and additional monitoring obligations without bypassing sanctions controls.

## Proposed policy controls
1. **CIF-013-REQ-01** High-risk onboarding cannot be approved by a single unreviewed automated score.
2. **CIF-013-REQ-02** Do not fabricate legal thresholds for source-of-funds or due diligence requirements.
3. **CIF-013-REQ-03** Conditional approvals must state which operations remain restricted.
4. **CIF-013-REQ-04** Sensitive evidence accessible only to assigned compliance roles with audit.
5. **CIF-013-REQ-05** EDD approval does not waive independent identity, sanctions, signing-authority or account eligibility checks.
6. **CIF-013-REQ-06** Evidence retention and customer notices must comply with institution's lawful confidentiality restrictions.

## Acceptance scenarios — NOT EXECUTED
- [ ] **CIF-013-T01** EDD case unresolved blocks ordinary approval where policy requires.
- [ ] **CIF-013-T02** Conditional approval cannot activate prohibited payment capability.
- [ ] **CIF-013-T03** Investigator cannot self-approve under maker-checker policy.
- [ ] **CIF-013-T04** Missing source-of-funds document remains explicit open gap.
- [ ] **CIF-013-T05** Re-review trigger produces new immutable case version.

## Approval dependency
Reviewed applicable AML/EDD provisions, escalation authority, privacy rules and independent compliance sign-off.

**Assurance status:** This is an evidence-labeled draft requiring jurisdiction and institution-specific compliance review. No live screening, customer data processing, production code, tests or statutory acceptance occurred in the batch. Financial accounting/payment blockers from CT remain outside this work and are not bypassed.
