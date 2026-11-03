# CIF-012 — Politically exposed person assessment and control

**OPES Core Banking | Batch 52/60 | Date 2026-11-03 | DRAFT / REVIEW OPEN**

## Objective
Treat PEP exposure as an evidence-backed risk-review category rather than a blanket prohibition, while retaining institution-specific current legal requirements.

## Candidate structured data model
| Attribute | Type | Definition |
|---|---|---|
| `pep_case_id` | `uuid` | review case |
| `party_id` | `uuid` | screened person |
| `institution_id` | `uuid` | regulated scope |
| `list_source` | `string` | approved evidence provider |
| `source_edition` | `string` | source version |
| `pep_relationship_type` | `enum` | self/family/close_associate/potential |
| `office_or_role` | `string|null` | observed public function |
| `relevance_interval` | `date_range|null` | time scope |
| `matching_evidence` | `list` | reason-coded source refs |
| `pep_decision` | `enum` | unresolved/confirmed/false_positive/expired_review |

## Workflow sequence
1. Identify applicable PEP and related-person policies per institution and product.
2. Screen subject plus required connected parties using permitted sources.
3. Review candidate role, relationship, jurisdiction and effective timeframe.
4. Escalate uncertain matches for human disposition and reasoned evidence.
5. Apply approved risk-appropriate diligence and monitoring controls.
6. Set periodic/event-driven review with immutable version history.

## Proposed policy controls
1. **CIF-012-REQ-01** Name similarity alone does not establish PEP status.
2. **CIF-012-REQ-02** PEP indication does not automatically establish criminality, sanctions or prohibition.
3. **CIF-012-REQ-03** Screening must distinguish current, former and related-person findings where policy requires.
4. **CIF-012-REQ-04** Do not hardcode a universal declassification period without applicable legal approval.
5. **CIF-012-REQ-05** Treat unavailable provider or disputed match as explicit pending case, not cleared.
6. **CIF-012-REQ-06** Protect restricted PEP investigation data and limit disclosures by role and purpose.

## Acceptance scenarios — NOT EXECUTED
- [ ] **CIF-012-T01** False-positive match requires reviewed evidence and audit.
- [ ] **CIF-012-T02** Potential PEP with missing source cannot auto-clear.
- [ ] **CIF-012-T03** Former public-office record evaluated under effective-dated policy.
- [ ] **CIF-012-T04** Unauthorized staff cannot see restricted investigation notes.
- [ ] **CIF-012-T05** Source edition change triggers controlled reassessment.

## Approval dependency
Qualified AML interpretation, approved PEP sources and institution-specific screening and EDD policies.

**Assurance status:** This is an evidence-labeled draft requiring jurisdiction and institution-specific compliance review. No live screening, customer data processing, production code, tests or statutory acceptance occurred in the batch. Financial accounting/payment blockers from CT remain outside this work and are not bypassed.
