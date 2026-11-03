# ARC-012 — Institution scoping and data isolation

**Programme:** OPES Core Banking | **Batch:** 32/60 | **Document status:** DRAFT DELIVERED / REVIEW OPEN | **Date:** 2026-11-03

## Purpose and accountability
Specify the policy boundary separating multiple financial institutions, branches and users across shared technical infrastructure.
The proposed authority belongs to the domain named by this package; actual owner, responsible engineer, legal reviewer and institution profile must be assigned in the authoritative WBS. This document is a proposed design, not an approved rule or banking certification.

## Candidate data / interface contract
| Field | Type | Intent |
|---|---|---|
| `institution_id` | `uuid` | immutable authorization partition |
| `legal_entity_id` | `uuid` | regulated entity reference |
| `user_subject` | `string` | OIDC authenticated actor |
| `acting_role_id` | `string` | role asserted after server-side policy |
| `branch_scope` | `list` | authorized operational branches |
| `resource_owner_id` | `uuid` | record ownership |
| `operation` | `string` | requested action |
| `policy_version` | `string` | approved authorization version |
| `decision_id` | `uuid` | audited policy decision |

## End-to-end workflow
1. Authenticate subject and validate token issuer/audience.
2. Resolve licensed institution from a trusted server-side context.
3. Bind actor role, branch and purpose to one policy decision.
4. Verify resource ownership and action entitlement before query/write.
5. Apply institution filter in data access and event publication.
6. Record denied access and alert on anomalous cross-scope attempts.

## Domain invariants and implementation constraints
1. **ARC-012-REQ-01** Never trust client-supplied institution ID without server-side membership proof.
2. **ARC-012-REQ-02** Enforce authorization on individual objects and nested relationship references.
3. **ARC-012-REQ-03** Make role policies versioned, maker-checker controlled and independently auditable.
4. **ARC-012-REQ-04** Separate encryption keys, secrets, settlement credentials and production identities by approved trust scope.
5. **ARC-012-REQ-05** Prohibit default fallbacks from one institution's policy or accounts into another's workflow.
6. **ARC-012-REQ-06** Support explicit supervisory access only under recorded legal authority and least privilege.

## Acceptance scenarios — specified, not executed
- [ ] **ARC-012-T-01** Cross-tenant customer ID fetch returns denied without data leakage.
- [ ] **ARC-012-T-02** Cross-tenant mutation is rejected even for an authorized user of another institution.
- [ ] **ARC-012-T-03** Token from wrong audience or revoked role cannot access records.
- [ ] **ARC-012-T-04** Event consumer ignores payload with mismatched institution scope.
- [ ] **ARC-012-T-05** Admin cannot approve their own institution-level privilege escalation.

## Critical dependencies and assurance status
- **To approve:** Institution profile, legal privacy review, IAM design approval and executable isolation test evidence.
- **Global controls:** enforce institutional authorization, immutable financial postings, exact monetary arithmetic, independent reconciliation, regulatory evidence and maker-checker as applicable.
- **Known hold:** COBAC I-2015/01 account 312/322 conflict and bank-specific payment authorization remain unresolved in inherited checkpoint CT. Do not activate disputed financial functions.
- **Evidence:** GitHub delivery evidences custody only. Peer review: NOT DONE; banking tests: NOT RUN; production code: NOT ADDED; regulatory certification: NOT CLAIMED.

## Next reviewer action
Confirm institution profile, accountable approvers, test fixtures and referenced authority before advancing this work package toward verified acceptance.
