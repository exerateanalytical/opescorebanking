# BRN-007 — Vault cash denomination inventory

OPES Core Banking — Batch 127 | 2026-11-03 | DRAFT DELIVERED / REVIEW OPEN

## Purpose
Represent secured cash vault holdings and counted denominations without treating physical inventory as a customer deposit balance.

## Data contract
| Field | Type | Intent |
|---|---|---|
| `vault_inventory_id` | `uuid` | Inventory snapshot |
| `institution_id` | `uuid` | Owner |
| `branch_id` | `uuid` | Physical location |
| `vault_id` | `uuid` | Registered safe |
| `currency` | `string` | Denomination currency |
| `denomination_code` | `string` | Physical note code |
| `piece_count` | `integer` | Observed count |
| `custodian_id` | `string` | Authorized officer |
| `snapshot_ref` | `uuid` | Audit cutoff |

## State transitions and guards
1. PREPARED>COUNTING:dual custody opened
2. COUNTING>REVIEW:count complete
3. REVIEW>RECONCILED:checker accepts
4. ANY>RESTRICTED:security incident
5. RESTRICTED>ACTIVE:cleared by qualified security

## Controlled workflow
1. Authorize vault access with permitted custodians
2. Count each note/coin denomination and attest custody
3. Compute exact totals by currency, not converted approximations
4. Reconcile movements and prior signed counts
5. Raise restricted-access variance case if physical mismatch

## Required invariants
1. BRN-007-R01: Vault cash cannot be spent by editing account balances
2. BRN-007-R02: Denomination count cannot be negative or fractional
3. BRN-007-R03: No implicit conversion across currencies
4. BRN-007-R04: Every inventory snapshot has immutable custody lineage
5. BRN-007-R05: Bank staff without vault scope cannot approve count
6. BRN-007-R06: Missing physical evidence does not count as zero inventory

## Negative and acceptance tests — NOT EXECUTED
- [ ] BRN-007-T01: Negative piece count invalid
- [ ] BRN-007-T02: Wrong vault identity denied
- [ ] BRN-007-T03: Duplicate inventory snapshot flagged
- [ ] BRN-007-T04: Count total exactly equals denomination sum
- [ ] BRN-007-T05: Missing independent checker prevents reconciliation

## Approval gates
Bank physical security, vault custody and denomination policies, independently observed count.

Evidence status: drafted design only; no executable banking tests or production code. No regulator or institutional signoff. Historic WP-ACC-005 P0 312/322 and bank-specific rail participation unresolved.
