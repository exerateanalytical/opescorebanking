# OPS-005 — Privileged access management and session controls

**OPES Core Banking | Batch 85/90 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Objective and boundary
Define just-in-time privileged access, constrained banking operator roles and independent oversight.

## Candidate record and policy fields
| Field | Type | Meaning |
|---|---|---|
| `privilege_grant_id` | `uuid` | temporary authorization |
| `institution_id` | `uuid` | regulated scope |
| `operator_id` | `string` | authenticated actor |
| `role_code` | `string` | approved function |
| `resource_scope` | `list` | bounded systems |
| `justification_ref` | `uuid` | approved reason |
| `approver_id` | `string` | independent checker |
| `valid_from` | `datetime` | start |
| `valid_until` | `datetime` | end |
| `session_record_ref` | `uuid` | audit proof |

## Operations workflow
1. Receive time-bounded access request with ticket.
2. Check user identity, institution, scope and current policy.
3. Require independent owner approval and strong authentication.
4. Grant minimum privileges to specified systems.
5. Monitor actions and preserve redacted privileged-session evidence.
6. Revoke automatically at expiry and review emergency actions.

## Requirements and security controls
1. **OPS-005-REQ-01** Developers do not hold permanent production ledger-admin roles.
2. **OPS-005-REQ-02** Self-approval and standing break-glass grants are prohibited.
3. **OPS-005-REQ-03** Database superuser actions cannot bypass financial controls.
4. **OPS-005-REQ-04** Access to customer data requires lawful operational purpose.
5. **OPS-005-REQ-05** Every privileged session binds to accountable individual.
6. **OPS-005-REQ-06** Revocation must invalidate subsequent role decisions.

## Acceptance tests — NOT EXECUTED
- [ ] **OPS-005-T01** Self-approved admin request denied.
- [ ] **OPS-005-T02** Expired grant cannot access production.
- [ ] **OPS-005-T03** Session transcript proves actor and action without secrets.
- [ ] **OPS-005-T04** Wrong institution scope denied.
- [ ] **OPS-005-T05** Disabled operator session revoked.

## Acceptance and independent review gate
CISO and regulated-institution access policy, real PAM/IAM integration and privileged-activity tests.

Status: design specification, not deployed infrastructure or banking software. Production code: 0. Executed tests: 0. Independent approvals: NONE. Existing 312/322 PCEC contradiction and payment institution entitlement remain P0 and separate from this independent operations design.
