# CIF-005 — Party relationships, mandates and lifecycle validity

OPES Core Banking — Batch 45 of 60 | 2026-11-03 | **DRAFT ONLY; INDEPENDENT ACCEPTANCE OPEN**

## Purpose
Separate familial, employment, corporate representation and financial mandates, with evidence and time-bound authorization.

## Candidate schema
| Attribute | Type | Intended meaning |
|---|---|---|
| `relationship_id` | `uuid` | stable link ID |
| `source_party_id` | `uuid` | grantor/related party |
| `target_party_id` | `uuid` | representative or related party |
| `relationship_type` | `enum` | director/employee/guardian/agent/signatory/associate |
| `mandate_scope` | `list` | allowed roles/actions |
| `source_document_ref` | `uuid` | legal evidence |
| `starts_at` | `datetime` | effective grant |
| `ends_at` | `datetime|null` | expiry |
| `approval_status` | `enum` | draft/active/suspended/revoked |
| `checker_id` | `uuid|null` | independent approval |

## Controlled workflow
1. Identify both parties and their institution-specific identity states.
2. Select relationship type and permissible mandate scope.
3. Collect supporting evidence and effective/expiry dates.
4. Validate no contradictory or self-approval relationships are created.
5. Obtain authorized mandate approval where policy requires.
6. Revise, suspend or revoke with notifications and immutable history.

## Requirements / invariants
1. **CIF-005-REQ-01** A relationship does not automatically authorize account withdrawal or payment signing.
2. **CIF-005-REQ-02** Authority is evaluated per action, institution, time and explicit mandate scope.
3. **CIF-005-REQ-03** No revoked or expired mandate can approve a new financial instruction.
4. **CIF-005-REQ-04** Guardianship, beneficial ownership and corporate signing authority are independent statuses.
5. **CIF-005-REQ-05** Subject and object must be institution-authorized and existence-validated.
6. **CIF-005-REQ-06** Evidence must be retained even after a mandate is revoked where legally required.

## Negative and acceptance test specifications — NOT EXECUTED
- [ ] **CIF-005-T01** Expired mandate denied even with still-valid user login.
- [ ] **CIF-005-T02** Beneficial owner without mandate cannot authorize a transaction.
- [ ] **CIF-005-T03** Revocation takes effect for subsequent commands.
- [ ] **CIF-005-T04** Self-authorization blocked on controlled mandate creation.
- [ ] **CIF-005-T05** Historic mandate state reproducible at transaction date.

## Gate and audit notes
Institution mandate products, delegation policy and local legal/guardian evidence requirements.

No bank onboarding system was implemented or deployed by this batch. Tests executed: 0. Approval/signoff: none. Maintain the existing COBAC chart mapping and BEAC payment entitlement holds in their dependent workstreams. Technical completeness requires per-institution legal/KYC review, evidence-backed decisions and a bounded-context Definition of Ready.
