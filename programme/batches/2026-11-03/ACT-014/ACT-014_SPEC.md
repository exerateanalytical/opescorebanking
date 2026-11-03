# ACT-014 — Account termination and final financial settlement workflow

**OPES Core Banking | Batch 74/90 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Objective and boundary
Specify account closure as a controlled contract lifecycle with explicit reconciliation and obligations handoff.

## Candidate record and API fields
| Field | Type | Meaning |
|---|---|---|
| `closure_id` | `uuid` | case identity |
| `account_id` | `uuid` | closing contract |
| `institution_id` | `uuid` | entity |
| `requested_by` | `string` | initiator |
| `reason_code` | `string` | approved reason |
| `outstanding_claims` | `list` | liens/fees/pending transfers |
| `final_balance_ref` | `uuid` | verified ledger snapshot |
| `settlement_instruction_ref` | `uuid|null` | authorized payout |
| `checker_id` | `string|null` | independent approver |
| `closed_at` | `datetime|null` | closure effective |

## Lifecycle workflow
1. Receive closure request and verify contract owner.
2. Validate liens, holds, overdrafts, pending payments and tax obligations.
3. Reconcile authoritative balance and financial transactions.
4. Authorize final payout/transfer independently where required.
5. Confirm settlement and closure prerequisites before changing state.
6. Retain immutable customer statements, contract and decision history.

## Requirements and financial invariants
1. **ACT-014-REQ-01** No closure on unreconciled payment or unknown external outcome.
2. **ACT-014-REQ-02** Financial closure entries require approved balanced journal.
3. **ACT-014-REQ-03** Bank cannot treat account closure as cancellation of obligations.
4. **ACT-014-REQ-04** No silent deletion of customer records subject to retention.
5. **ACT-014-REQ-05** Customer termination rights and notices follow applicable legal policy.
6. **ACT-014-REQ-06** Maker-checker applies to high-impact close-out and payouts.

## Acceptance tests — NOT EXECUTED
- [ ] **ACT-014-T01** Pending transfer blocks premature closure.
- [ ] **ACT-014-T02** Unreconciled balance blocks approval.
- [ ] **ACT-014-T03** Closing request duplicate is idempotent.
- [ ] **ACT-014-T04** Closed account rejects new authorized debit.
- [ ] **ACT-014-T05** Historical statement available post closure.

## Acceptance and independent review gate
Institution termination rules, settlement/accounting authority and executed financial reconciliation tests.

Status: design specification, not operational banking software. Production code: 0. Executed tests: 0. Independent approvals: NONE. Original posted journals, externally evidenced settlement and current regulatory rules are not overridden. Current inherited WP-ACC-005 P0 COBAC 312/322 remains unresolved.
