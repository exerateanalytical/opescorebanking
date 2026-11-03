# CIF-006 — Customer onboarding case and progression state machine

**OPES Core Banking | Batch 46/60 | 2026-11-03 | DRAFT DELIVERED; ACCEPTANCE OPEN**

## Purpose
Define institution-authorized individual and organization onboarding as a case workflow that does not create a usable bank account before mandatory identity and risk gates.

## Candidate records and legal scope
| Attribute | Type | Meaning |
|---|---|---|
| `case_id` | `uuid` | onboarding case |
| `institution_id` | `uuid` | licensed entity |
| `party_id` | `uuid` | canonical identity link |
| `onboarding_channel` | `enum` | branch/web/mobile/agent/corporate |
| `applicant_kind` | `enum` | person/organization |
| `case_status` | `enum` | draft/submitted/evidence_pending/review/approved/rejected/withdrawn |
| `assigned_reviewer` | `string|null` | review queue actor |
| `required_evidence` | `list` | profile-dependent artifacts |
| `risk_decision_ref` | `uuid|null` | approved risk review |
| `submitted_at` | `datetime|null` | submission audit |

## Case progression
1. Start institution-scoped case with selected product intent and privacy notice.
2. Collect minimum party data plus requested services without activating an account.
3. Validate documents, duplicate signals, mandates and identity declarations.
4. Route incomplete, suspicious or mismatched cases to review with reasons.
5. Obtain compliance and maker-checker approvals for applicable risk class.
6. Create accepted customer relationship only after all mandatory case checks pass.

## Verification and authorization invariants
1. **CIF-006-REQ-01** A case approval must not itself post money or activate credit/payment services.
2. **CIF-006-REQ-02** Applicant cannot change submitted evidence without versioning and reviewer notification.
3. **CIF-006-REQ-03** All case status transitions must be explicitly authorized and logged.
4. **CIF-006-REQ-04** Never auto-approve cases with unresolved sanctions, identity mismatch or unauthorized representative.
5. **CIF-006-REQ-05** Return machine-readable reasons for missing documents without leaking sensitive screening results.
6. **CIF-006-REQ-06** Allow resumption after offline/network failure without duplicate cases via idempotency.

## Test cases to implement — NOT EXECUTED
- [ ] **CIF-006-TEST-01** Duplicate submit creates one case.
- [ ] **CIF-006-TEST-02** Attempted approval with missing KYC requirements rejected.
- [ ] **CIF-006-TEST-03** Reviewer approves own submitted case denied where maker-checker required.
- [ ] **CIF-006-TEST-04** Case created in one institution cannot be read in another.
- [ ] **CIF-006-TEST-05** Withdrawn case cannot be used to open an account.

## Closure prerequisites
Onboarding channel policy, institution mandatory evidence matrix, identity/risk requirements and independent reviewer workflow.

No approval may be inferred from creating or pushing this draft. Context ownership, effective law, user roles, identity security, audit and privacy need qualified approval. Production code generated: 0. Tests executed: 0. Work package independently accepted: NO. Existing regulatory/accounting/payment holds continue.
