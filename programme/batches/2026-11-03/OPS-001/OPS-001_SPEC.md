# OPS-001 — Infrastructure environment taxonomy and separation

**OPES Core Banking | Batch 81/90 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Objective and boundary
Define bank-safe development, qualification, security testing, DR and production environments with unambiguous legal-entity boundaries.

## Candidate record and policy fields
| Field | Type | Meaning |
|---|---|---|
| `environment_id` | `string` | stable name |
| `environment_class` | `enum` | dev/test/qualification/preprod/prod/dr |
| `institution_id` | `uuid` | deployer scope |
| `jurisdiction` | `string` | data-location context |
| `resource_owner` | `string` | operations team |
| `network_zone` | `string` | approved trust zone |
| `identity_realm` | `string` | isolated IAM |
| `key_scope` | `string` | KMS/HSM boundary |
| `approval_state` | `enum` | draft/approved/active |
| `change_record_ref` | `uuid` | deployment evidence |

## Operations workflow
1. Select regulated institution and jurisdiction constraints.
2. Classify each proposed environment and its processing purpose.
3. Design segregated network, identity, key and data boundaries.
4. Define data masking and synthetic fixture restrictions.
5. Assign operations/security owners and provisioning approval.
6. Verify isolation and record environment inventory.

## Requirements and security controls
1. **OPS-001-REQ-01** No production customer records in unapproved test environment.
2. **OPS-001-REQ-02** Production signing keys cannot be reused in development.
3. **OPS-001-REQ-03** DR environment must preserve controlled accounting recovery semantics.
4. **OPS-001-REQ-04** Production external rail credentials are barred from nonproduction.
5. **OPS-001-REQ-05** Tenant scope enforced at service and network boundaries.
6. **OPS-001-REQ-06** Environment activation requires qualified legal and security authorization.

## Acceptance tests — NOT EXECUTED
- [ ] **OPS-001-T01** Production token rejected by staging.
- [ ] **OPS-001-T02** Development secrets unavailable in production.
- [ ] **OPS-001-T03** Sandbox endpoint cannot send production settlement.
- [ ] **OPS-001-T04** Cross-environment audit events remain attributable.
- [ ] **OPS-001-T05** Unapproved PII copy triggers denial.

## Acceptance and independent review gate
Institution hosting and sovereignty policy, network/IAM signoff and isolation test evidence.

Status: design specification, not deployed infrastructure or banking software. Production code: 0. Executed tests: 0. Independent approvals: NONE. Existing 312/322 PCEC contradiction and payment institution entitlement remain P0 and separate from this independent operations design.
