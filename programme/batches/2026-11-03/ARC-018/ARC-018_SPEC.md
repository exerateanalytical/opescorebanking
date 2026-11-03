# ARC-018 — Identity security and cryptographic trust boundaries

**OPES Core Banking | Batch 38 of 60 | 2026-11-03 | DRAFT / NOT YET ACCEPTED**

## Objective
Place authentication, privilege control, sensitive data and cryptographic operations behind independently reviewable trust boundaries.

## Candidate entity and evidence contract
| Field | Type | Description |
|---|---|---|
| `subject_id` | `string` | authenticated actor |
| `institution_id` | `uuid` | regulated entity |
| `session_id` | `uuid` | auditable session |
| `authentication_strength` | `string` | risk-appropriate factors |
| `role_policy_version` | `string` | approved RBAC/ABAC rules |
| `operation_scope` | `string` | authorized action |
| `key_reference` | `string` | KMS/HSM key alias, never key material |
| `approval_ref` | `uuid|null` | maker-checker evidence |
| `decision_timestamp` | `datetime` | authorization point |

## Workflow
1. Authenticate actor with trusted OIDC federation and validated audience.
2. Resolve institution, branch, role and risk of requested action server-side.
3. Apply step-up authentication and maker-checker where transaction risk requires.
4. Authorize object-level resource and domain command boundaries.
5. Delegate signing/encryption to isolated cryptographic boundary with audited key alias.
6. Record access, policy decision and privilege changes in restricted audit store.

## Requirements / design invariants
1. **ARC-018-REQ-01** No frontend-only authorization or trust of user-supplied institution identifiers.
2. **ARC-018-REQ-02** Do not store raw secrets, private keys, passwords or bearer tokens in app logs or message bus.
3. **ARC-018-REQ-03** Separate developers, production operators, security approvers and key custodians.
4. **ARC-018-REQ-04** Use approved key rotation, revocation, recovery and compromise procedures.
5. **ARC-018-REQ-05** Require expiration and independent review of elevated/break-glass roles.
6. **ARC-018-REQ-06** Mask personal identifiers and account data according to approved privacy classification.

## Planned negative and property tests — NONE EXECUTED
- [ ] **ARC-018-TEST-01** Wrong audience token cannot reach domain command.
- [ ] **ARC-018-TEST-02** Approver and maker cannot be same subject for restricted operation.
- [ ] **ARC-018-TEST-03** Cross-institution account object access rejected.
- [ ] **ARC-018-TEST-04** Expired signing credential blocks production use.
- [ ] **ARC-018-TEST-05** Security audit export omits secrets and unapproved personal details.

## Definition of Ready and approval gap
Threat model, institutional IAM/HSM policy, cryptographic review and executed security/access tests.

This is documentation only. No source code generated, no executable tests run, no banking certification or institution approval obtained. Preserve account-mapping and payments P0 gates documented in checkpoint CT, and record actual reviewer decisions before changing status to VERIFIED_COMPLETE.
