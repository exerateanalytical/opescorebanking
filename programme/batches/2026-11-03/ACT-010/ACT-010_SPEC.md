# ACT-010 — Savings interest accrual and application control

**OPES Core Banking | Batch 70/90 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Objective and boundary
Specify versioned interest calculations and transparent accrual-versus-posting separation using exact arithmetic.

## Candidate record and API fields
| Field | Type | Meaning |
|---|---|---|
| `accrual_id` | `uuid` | calculation batch |
| `account_id` | `uuid` | source account |
| `product_terms_version` | `string` | approved interest policy |
| `rate_version` | `string` | effective rate edition |
| `interest_basis` | `string` | approved day count |
| `period_from` | `date` | inclusive range |
| `period_to` | `date` | exclusive end |
| `currency` | `string` | account currency |
| `calculated_amount` | `string` | exact fixed decimal |
| `posting_status` | `enum` | calculated/reviewed/posted/blocked |

## Lifecycle workflow
1. Select approved terms and effective rate per historical period.
2. Choose authorized calendar, day-count and eligibility method.
3. Read verified historical accounting balances and exclusions.
4. Compute exact accrual with reproducible intermediate calculations.
5. Review exception cases and tax treatment under qualified policy.
6. Request idempotent balanced posting and reconcile final credit.

## Requirements and financial invariants
1. **ACT-010-REQ-01** No floating-point interest computation.
2. **ACT-010-REQ-02** Backdated corrections must not overwrite earlier posted interest.
3. **ACT-010-REQ-03** Dormancy, restriction and tax impacts are policy-versioned, not guessed.
4. **ACT-010-REQ-04** Accrual calculation alone cannot create a customer balance.
5. **ACT-010-REQ-05** Rounding must be deterministic per approved currency rule.
6. **ACT-010-REQ-06** Unapproved PCEC mapping blocks operational interest posting.

## Acceptance tests — NOT EXECUTED
- [ ] **ACT-010-T01** Leap-period interest reproducibility.
- [ ] **ACT-010-T02** Same batch cannot double-accrue.
- [ ] **ACT-010-T03** Rate change respects effective interval.
- [ ] **ACT-010-T04** Correction creates new accounting reference.
- [ ] **ACT-010-T05** Account closure excludes ineligible period.

## Acceptance and independent review gate
Bank-approved interest methodology, applicable law, CFO posting rules and property tests.

Status: design specification, not operational banking software. Production code: 0. Executed tests: 0. Independent approvals: NONE. Original posted journals, externally evidenced settlement and current regulatory rules are not overridden. Current inherited WP-ACC-005 P0 COBAC 312/322 remains unresolved.
