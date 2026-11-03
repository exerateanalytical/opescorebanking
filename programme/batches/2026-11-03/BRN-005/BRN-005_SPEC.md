# BRN-005 — Teller withdrawals and controlled cash payout

OPES Core Banking — Batch 125 | 2026-11-03 | DRAFT DELIVERED / REVIEW OPEN

## Purpose
Keep mandate verification, funds authorization, ledger posting and physical payout independently evidenced.

## Data contract
| Field | Type | Intent |
|---|---|---|
| `withdrawal_id` | `uuid` | Unique operation |
| `institution_id` | `uuid` | Legal owner |
| `account_id` | `uuid` | Debit contract |
| `drawer_session_id` | `uuid` | Cash custody |
| `amount_minor` | `string` | Exact amount |
| `mandate_ref` | `uuid` | Withdrawal authority |
| `posting_ref` | `uuid` | Ledger proof |
| `handover_ref` | `uuid` | Cash recipient acknowledgment |

## State transitions and guards
1. REQUESTED>APPROVED:authorized mandate and funds
2. APPROVED>POSTING_PENDING:approved ledger rule
3. POSTING_PENDING>PAYOUT_READY:journal proof exists
4. PAYOUT_READY>PAID:signed handover
5. ANY>EXCEPTION:uncertain funds or custody

## Controlled workflow
1. Check active teller session and customer identity
2. Validate account restrictions and mandate scope
3. Atomically authorize spendable funds and a posting command
4. Verify ledger result before authorized payout
5. Count and sign cash receipt and reconcile drawer

## Required invariants
1. BRN-005-R01: No cash release based only on network acknowledgement
2. BRN-005-R02: No direct modification of ledger balances by teller UI
3. BRN-005-R03: Same command cannot produce duplicate cash payout
4. BRN-005-R04: Expired customer signing mandate cannot authorize payout
5. BRN-005-R05: Cash shortages require independent exception workflow
6. BRN-005-R06: P0 mapping uncertainty blocks affected posting

## Negative and acceptance tests — NOT EXECUTED
- [ ] BRN-005-T01: Duplicate command yields one approved withdrawal
- [ ] BRN-005-T02: Cross-institution account ID denied
- [ ] BRN-005-T03: Suspended teller payout rejected
- [ ] BRN-005-T04: Unknown posting result keeps cash unreleased
- [ ] BRN-005-T05: Payout receipt count reconciles exact notes

## Approval gates
CFO-approved posting rules, institution withdrawal policy and audited funds/custody tests.

Evidence status: drafted design only; no executable banking tests or production code. No regulator or institutional signoff. Historic WP-ACC-005 P0 312/322 and bank-specific rail participation unresolved.
