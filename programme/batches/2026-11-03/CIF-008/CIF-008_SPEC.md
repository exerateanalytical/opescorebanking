# CIF-008 — Business identity, KYB evidence and authorized representative verification

**OPES Core Banking | Batch 48/60 | 2026-11-03 | DRAFT DELIVERED; ACCEPTANCE OPEN**

## Purpose
Define enterprise customer due diligence tying registered legal existence to company records, control structure and verified authority to act.

## Candidate records and legal scope
| Attribute | Type | Meaning |
|---|---|---|
| `kyb_case_id` | `uuid` | business onboarding case |
| `organization_party_id` | `uuid` | legal party |
| `registry_evidence_id` | `uuid` | source verification |
| `registration_state` | `enum` | declared/pending/confirmed/disputed |
| `legal_form_code` | `string` | jurisdiction taxonomy |
| `representation_mandate_ids` | `list` | authority grants |
| `ownership_graph_version` | `string` | beneficial ownership snapshot |
| `directors` | `list` | linked natural persons |
| `risk_assessment_ref` | `uuid|null` | review decision |
| `kyb_status` | `enum` | open/conditional/approved/rejected |

## Case progression
1. Identify registered organization and applicable legal-entity jurisdiction.
2. Collect formation/registry evidence and required business documents.
3. Validate status and authorized representatives through accepted sources.
4. Construct ownership/control graph and flag unknown controlling parties.
5. Screen relevant signatories and controllers under approved AML policy.
6. Authorize KYB only when applicable evidence and independent review are satisfied.

## Verification and authorization invariants
1. **CIF-008-REQ-01** Registry evidence and business license are distinct proofs.
2. **CIF-008-REQ-02** Representative authority must be effective-dated and action-scoped.
3. **CIF-008-REQ-03** Unknown beneficial ownership must be treated as unresolved, not zero risk.
4. **CIF-008-REQ-04** Business status must be tied to a source observation date and registry authority.
5. **CIF-008-REQ-05** No unverified business may be silently promoted into credit/payment privileges.
6. **CIF-008-REQ-06** Preserve versioned KYB evidence for subsequent changes in directors/control.

## Test cases to implement — NOT EXECUTED
- [ ] **CIF-008-TEST-01** Representatives with expired mandates cannot submit corporate payment permissions.
- [ ] **CIF-008-TEST-02** Missing required beneficial ownership evidence blocks normal approval.
- [ ] **CIF-008-TEST-03** Conflicting registry states raise review.
- [ ] **CIF-008-TEST-04** Cross-institution organization document reference denied.
- [ ] **CIF-008-TEST-05** Change of controlling shareholder triggers review without rewriting old evidence.

## Closure prerequisites
Applicable KYB obligations, legally approved documentary matrix, registry and control-verification procedures.

No approval may be inferred from creating or pushing this draft. Context ownership, effective law, user roles, identity security, audit and privacy need qualified approval. Production code generated: 0. Tests executed: 0. Work package independently accepted: NO. Existing regulatory/accounting/payment holds continue.
