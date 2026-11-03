# ACT-011 — Account-to-ledger contract and authoritative balance views

**OPES Core Banking | Batch 71/90 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Objective and boundary
Define safe balance presentation tied to immutable journals and pending obligations, without allowing account service to alter money.

## Candidate record and API fields
| Field | Type | Meaning |
|---|---|---|
| `balance_query_id` | `uuid` | traceable request |
| `institution_id` | `uuid` | legal entity |
| `account_id` | `uuid` | account contract |
| `as_of` | `datetime` | valuation cutoff |
| `currency` | `string` | currency code |
| `ledger_snapshot_ref` | `string` | source cursor |
| `posted_balance` | `string` | exact amount |
| `pending_credits` | `string` | non-final funds |
| `pending_debits` | `string` | reserved instructions |
| `available_balance` | `string` | policy-derived view |

## Lifecycle workflow
1. Authenticate actor and account membership/mandate scope.
2. Resolve authoritative ledger snapshot and as-of time.
3. Compute posted and available balances separately.
4. Apply approved holds and pending obligations without manufacturing postings.
5. Return freshness and reconciliation status with values.
6. Escalate unbalanced or stale snapshots to financial controls.

## Requirements and financial invariants
1. **ACT-011-REQ-01** Account service cannot directly mutate ledger tables.
2. **ACT-011-REQ-02** Available balance is not necessarily posted balance.
3. **ACT-011-REQ-03** Pending inbound funds may not be spendable without approved settlement evidence.
4. **ACT-011-REQ-04** Cross-currency conversion requires explicit reviewed rate source.
5. **ACT-011-REQ-05** Balance snapshots must reconcile to exact journal history.
6. **ACT-011-REQ-06** Failures must not return misleading zero as a fallback.

## Acceptance tests — NOT EXECUTED
- [ ] **ACT-011-T01** Stale projection visibly marked.
- [ ] **ACT-011-T02** Cross-tenant balance query denied.
- [ ] **ACT-011-T03** Pending credit does not automatically increase posted amount.
- [ ] **ACT-011-T04** Ledger replay yields same as-of balance.
- [ ] **ACT-011-T05** Direct balance-update path absent.

## Acceptance and independent review gate
CFO-approved balance semantics, verified accounting rules and ledger reconciliation tests.

Status: design specification, not operational banking software. Production code: 0. Executed tests: 0. Independent approvals: NONE. Original posted journals, externally evidenced settlement and current regulatory rules are not overridden. Current inherited WP-ACC-005 P0 COBAC 312/322 remains unresolved.
