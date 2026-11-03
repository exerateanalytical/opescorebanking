# OPS-007 — Network segmentation, API perimeter and zero-trust controls

**OPES Core Banking | Batch 87/90 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Objective and boundary
Specify isolated trust zones for public endpoints, bank services, accounting, audit, keys, databases and rail adapters.

## Candidate record and policy fields
| Field | Type | Meaning |
|---|---|---|
| `zone_id` | `string` | trust segment |
| `environment_id` | `string` | isolated environment |
| `service_identity` | `string` | workload principal |
| `source_zone` | `string` | origin |
| `destination_zone` | `string` | target |
| `protocol` | `string` | allowed transport |
| `policy_version` | `string` | network rules |
| `authentication_mode` | `string` | mTLS/OIDC as approved |
| `authorization_ref` | `string` | allowed operation |
| `change_approval_ref` | `uuid` | review evidence |

## Operations workflow
1. Inventory inbound, east-west and outbound service dependencies.
2. Assign trust zones and service identities by business domain.
3. Allow only documented service-to-service traffic.
4. Protect accounting, KMS, privileged admin and external rail paths.
5. Log connection decisions without leaking payloads.
6. Test deny-by-default and review exceptions for emergency channels.

## Requirements and security controls
1. **OPS-007-REQ-01** Public gateway cannot directly access core accounting database.
2. **OPS-007-REQ-02** Rail adapter requires approved signed protocol and participant network rules.
3. **OPS-007-REQ-03** Administrative access uses controlled bastion/PAM with trace.
4. **OPS-007-REQ-04** Cross-institution connectivity not implicitly allowed.
5. **OPS-007-REQ-05** Environment trust roots are not shared blindly.
6. **OPS-007-REQ-06** Network policy changes require approved documented impact.

## Acceptance tests — NOT EXECUTED
- [ ] **OPS-007-T01** Deny direct internet-to-ledger DB.
- [ ] **OPS-007-T02** Reject unauthorized service identity.
- [ ] **OPS-007-T03** Block staging-to-production settlement route.
- [ ] **OPS-007-T04** Deny unauthorized lateral traffic.
- [ ] **OPS-007-T05** Record unexpected egress attempt.

## Acceptance and independent review gate
CISO network topology acceptance, institution-hosting policy and executed isolation/penetration testing.

Status: design specification, not deployed infrastructure or banking software. Production code: 0. Executed tests: 0. Independent approvals: NONE. Existing 312/322 PCEC contradiction and payment institution entitlement remain P0 and separate from this independent operations design.
