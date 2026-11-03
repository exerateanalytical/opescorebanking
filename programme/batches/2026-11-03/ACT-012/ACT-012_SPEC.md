# ACT-012 — Standing orders and recurring account instructions

**OPES Core Banking | Batch 72/90 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Objective and boundary
Design recurring payment mandates with unique scheduled occurrences, customer authorization and controlled unknown-outcome handling.

## Candidate record and API fields
| Field | Type | Meaning |
|---|---|---|
| `standing_order_id` | `uuid` | instruction identity |
| `account_id` | `uuid` | debit account |
| `beneficiary_ref` | `uuid` | approved payee |
| `institution_id` | `uuid` | scope |
| `schedule_rule` | `string` | approved recurrence |
| `next_due_at` | `datetime` | next occurrence |
| `authorized_amount` | `string` | exact currency amount |
| `mandate_ref` | `uuid` | signing evidence |
| `occurrence_id` | `uuid` | unique run |
| `state` | `enum` | active/paused/cancelled |

## Lifecycle workflow
1. Authorize and record customer recurring mandate.
2. Validate account, beneficiary and transaction limits.
3. Derive deterministic occurrence ID from approved schedule.
4. At due time revalidate mandate, restrictions and available funds.
5. Submit one idempotent payment instruction and retain outcome evidence.
6. Advance schedule only under approved recorded completion/exception semantics.

## Requirements and financial invariants
1. **ACT-012-REQ-01** Scheduler replay must not debit twice.
2. **ACT-012-REQ-02** Cancelled or expired mandate cannot execute new occurrence.
3. **ACT-012-REQ-03** Payment network acceptance is not finality.
4. **ACT-012-REQ-04** Unknown external outcome must remain investigable before retry.
5. **ACT-012-REQ-05** Insufficient funds policy is bank-configured and audited.
6. **ACT-012-REQ-06** Mandate revisions preserve past authorizations and executions.

## Acceptance tests — NOT EXECUTED
- [ ] **ACT-012-T01** Timer fires twice and yields one occurrence.
- [ ] **ACT-012-T02** Cancelled order does not execute.
- [ ] **ACT-012-T03** Account hold blocks instruction.
- [ ] **ACT-012-T04** Unknown external result does not blindly resubmit.
- [ ] **ACT-012-T05** Schedule daylight savings/calendar edge reproducible.

## Acceptance and independent review gate
Bank recurring-payment policy, approved mandate and payment rail entitlement plus reliability tests.

Status: design specification, not operational banking software. Production code: 0. Executed tests: 0. Independent approvals: NONE. Original posted journals, externally evidenced settlement and current regulatory rules are not overridden. Current inherited WP-ACC-005 P0 COBAC 312/322 remains unresolved.
