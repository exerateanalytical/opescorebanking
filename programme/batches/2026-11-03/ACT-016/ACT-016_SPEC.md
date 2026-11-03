# ACT-016 — Account holds, liens and availability restrictions

**OPES Core Banking | Batch 76/90 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Objective and boundary
Define enforceable restrictions on account operations with proven legal authority and controlled release.

## Candidate record and API fields
| Field | Type | Meaning |
|---|---|---|
| `hold_id` | `uuid` | stable restriction |
| `account_id` | `uuid` | affected account |
| `institution_id` | `uuid` | legal entity |
| `hold_type` | `enum` | legal/credit/security/operational |
| `authority_ref` | `uuid` | source instruction |
| `amount_limit` | `string|null` | exact affected amount |
| `effective_from` | `datetime` | start |
| `expires_at` | `datetime|null` | only if lawful |
| `maker_id` | `string` | initiator |
| `release_approval_ref` | `uuid|null` | checker evidence |

## Lifecycle workflow
1. Receive authorized hold instruction from qualified source.
2. Verify account and authority against institution policy.
3. Determine allowed operations, amount and effective interval.
4. Apply hold with atomic state/control version change.
5. Block relevant debits or activities via server-side enforcement.
6. Release or modify only through authorized reviewed case.

## Requirements and financial invariants
1. **ACT-016-REQ-01** A hold may restrict availability without editing posted ledger history.
2. **ACT-016-REQ-02** Expired timer alone cannot overrule binding court order.
3. **ACT-016-REQ-03** Conflicting holds require explicit precedence and review.
4. **ACT-016-REQ-04** Cross-institution legal instructions are not automatically transferable.
5. **ACT-016-REQ-05** A hold must be auditable, reason-coded and reversible under authority.
6. **ACT-016-REQ-06** An unauthorized caller cannot apply or remove a hold.

## Acceptance tests — NOT EXECUTED
- [ ] **ACT-016-T01** Restricted account payment blocked.
- [ ] **ACT-016-T02** Legal hold expiry misconfigured does not silently release.
- [ ] **ACT-016-T03** Hold release without checker denied.
- [ ] **ACT-016-T04** Partial hold respects exact amount.
- [ ] **ACT-016-T05** Concurrent hold and payment governed by durable ordering.

## Acceptance and independent review gate
Qualified legal lien/attachment rules, institution operations controls and concurrency tests.

Status: design specification, not operational banking software. Production code: 0. Executed tests: 0. Independent approvals: NONE. Original posted journals, externally evidenced settlement and current regulatory rules are not overridden. Current inherited WP-ACC-005 P0 COBAC 312/322 remains unresolved.
