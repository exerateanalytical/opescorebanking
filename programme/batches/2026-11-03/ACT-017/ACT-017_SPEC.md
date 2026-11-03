# ACT-017 — Account access, overdraft and funds-availability decision model

**OPES Core Banking | Batch 77/90 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Objective and boundary
Define a deterministic funds-availability authorization check distinct from actual ledger posting and separate from approved credit products.

## Candidate record and API fields
| Field | Type | Meaning |
|---|---|---|
| `availability_decision_id` | `uuid` | decision |
| `account_id` | `uuid` | source account |
| `institution_id` | `uuid` | scope |
| `posted_balance` | `string` | ledger-proven amount |
| `pending_debits` | `string` | authorized reservations |
| `legal_holds` | `string` | restricted amount |
| `credit_limit_ref` | `uuid|null` | approved facility |
| `proposed_amount` | `string` | debit request |
| `available_amount` | `string` | exact derived result |
| `decision_state` | `enum` | allow/deny/review |

## Lifecycle workflow
1. Validate customer mandate, account status and debit action.
2. Read authoritative ledger checkpoint and effective holds.
3. Include approved overdraft/facility terms only if binding.
4. Calculate available amount using exact currency precision.
5. Deny/hold when data stale, disputed or insufficient.
6. Return decision version to posting service for atomic validation.

## Requirements and financial invariants
1. **ACT-017-REQ-01** Displayed availability is not an authoritative money balance.
2. **ACT-017-REQ-02** Unapproved overdraft cannot fund an instruction.
3. **ACT-017-REQ-03** Credit facility does not imply banking account permission.
4. **ACT-017-REQ-04** Concurrent funds requests require reservation/atomicity protection.
5. **ACT-017-REQ-05** Cross-currency balances require approved conversion method.
6. **ACT-017-REQ-06** A denied decision must not create accounting entries.

## Acceptance tests — NOT EXECUTED
- [ ] **ACT-017-T01** Parallel debits cannot overspend approved funds.
- [ ] **ACT-017-T02** Stale snapshot must revalidate before commit.
- [ ] **ACT-017-T03** Closed account unavailable despite positive balance.
- [ ] **ACT-017-T04** Unapproved overdraft ignored.
- [ ] **ACT-017-T05** Cross-tenant available balance denied.

## Acceptance and independent review gate
CFO-approved funds policy, authorized loan facility semantics and concurrent posting tests.

Status: design specification, not operational banking software. Production code: 0. Executed tests: 0. Independent approvals: NONE. Original posted journals, externally evidenced settlement and current regulatory rules are not overridden. Current inherited WP-ACC-005 P0 COBAC 312/322 remains unresolved.
