# CIF-016 — Onboarding segregation of duties and maker-checker approval

**OPES Core Banking | Batch 56/60 | 2026-11-03 | DRAFT DELIVERED / REVIEW OPEN**

## Scope
Specify non-self-approvable approval flows for customer activation, sensitive identity changes and risk overrides with tamper-resistant evidence.

## Proposed domain model
| Attribute | Type | Reason |
|---|---|---|
| `approval_case_id` | `uuid` | controlled decision request |
| `institution_id` | `uuid` | regulated entity |
| `party_id` | `uuid` | affected identity |
| `requested_change_type` | `string` | approval scope |
| `maker_subject` | `string` | originating actor |
| `checker_subject` | `string|null` | independent reviewer |
| `proposed_revision` | `string` | controlled candidate version |
| `approval_state` | `enum` | pending/approved/rejected/expired |
| `decision_reason` | `string` | recorded evidence |
| `policy_version` | `string` | authorization rule edition |

## Status transition and recovery workflow
1. Record a proposed customer activation or high-impact change.
2. Identify maker, legal entity, reviewer roles and SoD policy version.
3. Freeze reviewed proposal revision and evidence digest.
4. Route to authorized independent checker with conflict-of-interest validation.
5. Apply approved transition once with stable command identity.
6. Record immutable approval and notify dependent controls if decision changes risk/access.

## Proposed requirements / invariants
1. **CIF-016-R01** Maker cannot approve same application or risk override.
2. **CIF-016-R02** Checker must have institution and approval-scope entitlement at decision time.
3. **CIF-016-R03** Approval against stale proposal revision is rejected.
4. **CIF-016-R04** Do not allow API/UI or scheduled job to bypass approval boundary.
5. **CIF-016-R05** Emergency override requires separately approved temporary privilege and post-event review.
6. **CIF-016-R06** Revoking checker authority cannot validate future requests based on old role.

## Planned acceptance cases — NOT RUN
- [ ] **CIF-016-T01** Same actor attempts submit and approve and gets denial.
- [ ] **CIF-016-T02** Approval after proposal change returns version conflict.
- [ ] **CIF-016-T03** Cross-institution checker cannot approve another entity's case.
- [ ] **CIF-016-T04** Expired approval request fails closed.
- [ ] **CIF-016-T05** Repeated approve command applies one transition.

## Dependency and reviewer gate
Institution policy delegation matrix, privileged access review, test identities and signed approval rules.

**Status controls:** This draft is not approved law, implementation, test pass or certification. No live data was used; tests executed: 0; production code added: 0; accepted WP: 0. Qualified legal/identity/risk/security/operations reviewers must approve relevant portions before implementation.
