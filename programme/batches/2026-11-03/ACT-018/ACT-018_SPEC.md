# ACT-018 — Account service API contracts and event projections

**OPES Core Banking | Batch 78/90 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Objective and boundary
Define versioned account command/query contracts and minimal event payloads under institution-scoped authorization.

## Candidate record and API fields
| Field | Type | Meaning |
|---|---|---|
| `request_id` | `uuid` | correlation key |
| `idempotency_key` | `string` | deduplication |
| `institution_id` | `uuid` | server-scoped entity |
| `account_id` | `uuid` | resource |
| `actor_id` | `string` | authenticated subject |
| `expected_version` | `integer` | optimistic lock |
| `command_type` | `string` | requested action |
| `result_state` | `enum` | completed/pending/conflict/denied |
| `account_event_id` | `uuid` | outbox identity |
| `ledger_ref` | `uuid|null` | financial authority |

## Lifecycle workflow
1. Authenticate and resolve institution plus account mandate.
2. Validate typed schema and expected aggregate version.
3. Check approval and financial delegation boundaries.
4. Apply account-domain state change atomically with outbox.
5. Publish event with minimal PII and stable schema version.
6. Return safe response with trace and status semantics.

## Requirements and financial invariants
1. **ACT-018-REQ-01** Account service cannot write ledger or settlement database directly.
2. **ACT-018-REQ-02** All command retries use stable idempotency keys.
3. **ACT-018-REQ-03** API responses must distinguish business success from accepted request.
4. **ACT-018-REQ-04** All queries scoped at backend resource level.
5. **ACT-018-REQ-05** Events cannot expose unrestricted KYC data.
6. **ACT-018-REQ-06** Read projections record freshness and source version.

## Acceptance tests — NOT EXECUTED
- [ ] **ACT-018-T01** IDOR attempt denied.
- [ ] **ACT-018-T02** Duplicate account-opening command yields one account.
- [ ] **ACT-018-T03** Stale command version conflicts.
- [ ] **ACT-018-T04** Outbox replay is idempotent.
- [ ] **ACT-018-T05** No financial journal from status-only event.

## Acceptance and independent review gate
Approved API/role contracts, customer privacy review and executable integration tests.

Status: design specification, not operational banking software. Production code: 0. Executed tests: 0. Independent approvals: NONE. Original posted journals, externally evidenced settlement and current regulatory rules are not overridden. Current inherited WP-ACC-005 P0 COBAC 312/322 remains unresolved.
