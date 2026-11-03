# BRN-006 — Cash drawer shift closeout and variance resolution

OPES Core Banking — Batch 126 | 2026-11-03 | DRAFT DELIVERED / REVIEW OPEN

## Purpose
Require accountable physical cash counts and reconciliation of opening custody, posted activity, in-transit cash and exceptions.

## Data contract
| Field | Type | Intent |
|---|---|---|
| `closeout_id` | `uuid` | Unique shift close |
| `institution_id` | `uuid` | Bank owner |
| `drawer_session_id` | `uuid` | Active shift |
| `opening_total` | `string` | Exact starting cash |
| `inflows_total` | `string` | Cash receipts |
| `outflows_total` | `string` | Cash payouts |
| `physical_total` | `string` | Observed count |
| `variance_total` | `string` | Difference |
| `reviewer_ref` | `uuid` | Independent checker |

## State transitions and guards
1. OPEN>COUNTING:transactions frozen
2. COUNTING>RECONCILING:count signed
3. RECONCILING>CLOSED:verified equality
4. RECONCILING>EXCEPTION:variance identified
5. EXCEPTION>CLOSED:independent resolution

## Controlled workflow
1. Freeze posting initiation and capture final shift cursor
2. Reconcile accepted receipts and payouts to ledger journal references
3. Count physical denominations under controlled custody
4. Calculate expected, observed and difference exactly
5. Require independent supervisor signoff or explicit shortage case

## Required invariants
1. BRN-006-R01: Closeout status cannot fabricate accounting reconciliation
2. BRN-006-R02: Teller cannot self-certify a variance
3. BRN-006-R03: Original posted journals remain immutable
4. BRN-006-R04: Unresolved operations cannot disappear from shift totals
5. BRN-006-R05: Count reports retain time and note denominations
6. BRN-006-R06: Variance write-off is a separately approved financial operation

## Negative and acceptance tests — NOT EXECUTED
- [ ] BRN-006-T01: Unbalanced shift refuses clean close
- [ ] BRN-006-T02: Duplicate closeout is idempotent
- [ ] BRN-006-T03: Self-checker rejected
- [ ] BRN-006-T04: Late event reported instead of concealed
- [ ] BRN-006-T05: Exact cash conservation equation holds

## Approval gates
Bank cash count SOP, physical evidence and independent accounting/operations acceptance.

Evidence status: drafted design only; no executable banking tests or production code. No regulator or institutional signoff. Historic WP-ACC-005 P0 312/322 and bank-specific rail participation unresolved.
