# CIF-003 — Legal entity identity and organization registry

OPES Core Banking — Batch 43 of 60 | 2026-11-03 | **DRAFT ONLY; INDEPENDENT ACCEPTANCE OPEN**

## Purpose
Represent corporate customers, associations, public bodies and other legal entities with source-backed registration status and controlled relationship to authorized representatives.

## Candidate schema
| Attribute | Type | Intended meaning |
|---|---|---|
| `organization_party_id` | `uuid` | canonical party ID |
| `legal_form_code` | `string` | jurisdiction-specific legal form |
| `registered_name` | `string` | registered legal name |
| `trade_names` | `list` | commercial aliases |
| `registration_number` | `string|null` | issuer-specific identifier |
| `registry_authority` | `string` | competent registry reference |
| `incorporation_date` | `date|null` | validated formation date |
| `registered_address_ref` | `uuid` | registered premises |
| `status_observed` | `string` | declared source status |
| `evidence_refs` | `list` | restricted official documents |

## Controlled workflow
1. Open organization party case with jurisdiction and legal form.
2. Collect legal name, registrations, address and operating purpose.
3. Cross-check documents against authorized source or reviewer.
4. Record source dates, expiry and mismatch evidence.
5. Link authorized officers and beneficial owners through separate relationships.
6. Approve/reject organization identity before eligible customer activation.

## Requirements / invariants
1. **CIF-003-REQ-01** An unverified registration number is never accepted as proof of legal existence.
2. **CIF-003-REQ-02** Trade name cannot replace legal entity name or legal entity identifier.
3. **CIF-003-REQ-03** Registry status is time-bounded evidence and may be stale.
4. **CIF-003-REQ-04** Authorized signatory status and beneficial ownership are distinct relationships.
5. **CIF-003-REQ-05** Licensing for regulated corporate sectors requires separate source evidence.
6. **CIF-003-REQ-06** Organization records must be partitioned by institution and protected by legal privacy requirements.

## Negative and acceptance test specifications — NOT EXECUTED
- [ ] **CIF-003-T01** Same registration number in two jurisdictions is not automatically same entity.
- [ ] **CIF-003-T02** Expired authority to represent blocks restricted onboarding actions.
- [ ] **CIF-003-T03** Suspended registry status triggers review.
- [ ] **CIF-003-T04** Cross-institution document disclosure is denied.
- [ ] **CIF-003-T05** Changing registered name leaves prior evidence and audit history.

## Gate and audit notes
Institution KYB policy, accepted registry evidence sources and qualified legal review.

No bank onboarding system was implemented or deployed by this batch. Tests executed: 0. Approval/signoff: none. Maintain the existing COBAC chart mapping and BEAC payment entitlement holds in their dependent workstreams. Technical completeness requires per-institution legal/KYC review, evidence-backed decisions and a bounded-context Definition of Ready.
