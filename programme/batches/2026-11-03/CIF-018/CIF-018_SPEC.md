# CIF-018 — Customer information APIs and event contract boundaries

**OPES Core Banking | Batch 58/60 | 2026-11-03 | DRAFT DELIVERED; REVIEW OPEN**

## Objective and bounded scope
Define safe customer and relationship command/query interfaces without exposing sensitive KYC case details to unauthorized downstream consumers.

## Candidate domain model
| Field | Type | Meaning |
|---|---|---|
| `request_id` | `uuid` | correlation/idempotency identifier |
| `institution_id` | `uuid` | trusted caller scope |
| `party_id` | `uuid` | owned identity resource |
| `actor_subject` | `string` | authenticated caller |
| `action_code` | `string` | authorized command |
| `expected_version` | `integer` | optimistic concurrency |
| `response_status` | `enum` | success/denied/conflict/pending |
| `result_resource_ref` | `string` | approved view reference |
| `audit_ref` | `uuid` | traceable decision record |
| `api_edition` | `string` | versioned contract |

## Process, error and acceptance workflow
1. Authenticate API client and validate institution membership.
2. Authorize specific customer record and requested action at server boundary.
3. Validate typed request, command version, duplicate identity and purpose.
4. Apply approved state transition in authoritative CIF store.
5. Publish minimum-data domain event through reliable outbox.
6. Return typed response and correlate access decision to audit record.

## Proposed requirements / prohibitions
1. **CIF-018-REQ-01** Customer search must never allow IDOR or unscoped raw identifiers.
2. **CIF-018-REQ-02** CIF write commands cannot directly post financial journals or grant payment entitlement.
3. **CIF-018-REQ-03** Partner API fields exclude document images, restricted screening findings and identity secrets.
4. **CIF-018-REQ-04** Optimistic concurrency protects identity review decisions from silent overwrite.
5. **CIF-018-REQ-05** Public IDs and internal customer numbers have documented distinction and lifecycle.
6. **CIF-018-REQ-06** Command replay must return the original safe outcome without duplicating identity cases.

## Planned acceptance tests — NONE EXECUTED
- [ ] **CIF-018-TEST-01** Unscoped cross-institution GET is rejected.
- [ ] **CIF-018-TEST-02** Missing role denies candidate account linkage.
- [ ] **CIF-018-TEST-03** Stale expected_version yields conflict.
- [ ] **CIF-018-TEST-04** Duplicate create-case idempotency does not create second case.
- [ ] **CIF-018-TEST-05** Event envelope excludes document byte payloads.

## Dependencies and reviewer gate
Approved OpenAPI definitions, service identity/role matrix, retention privacy review and contract/integration tests.

**Evidence declaration:** Draft customer information system documentation only. No banking production code, testing, sanction screening or regulator certification performed. Work package VERIFIED_COMPLETE: NO. Historical COBAC account mapping and BEAC settlement activation remain separate P0 blockers. Follow institution-specific source verification before implementation.
