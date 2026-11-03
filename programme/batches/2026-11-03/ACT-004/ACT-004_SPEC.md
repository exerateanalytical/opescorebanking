# ACT-004 — Fees, tariff schedules and precise monetary calculation

**OPES Core Banking | Batch 64 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Goal and bounded-context rationale
Describe customer fees and tariff schedules without silently changing ledger balances.

## Candidate data model
| Field | Type | Purpose |
|---|---|---|
| `tariff_id` | `uuid` | versioned price list |
| `institution_id` | `uuid` | legal owner |
| `product_version` | `string` | terms linkage |
| `fee_type` | `string` | business service |
| `charge_basis` | `enum` | flat/percentage/tier |
| `currency` | `string` | ISO code |
| `rate_decimal` | `string` | fixed precision |
| `minimum_amount` | `string|null` | lower bound |
| `effective_at` | `datetime` | approved activation |
| `tax_policy_ref` | `string|null` | verified tax rules |

## Proposed workflow
1. Define service and applicability against product terms.
2. Select exact currency and decimal rounding conventions.
3. Specify fee base, exemptions, tiers and caps.
4. Assess tax, legal disclosure and accounting mapping dependencies.
5. Obtain maker-checker and customer notice approvals.
6. Produce auditable calculation, then authorized posting request.

## Invariants and domain requirements
1. **ACT-004-REQ-01** No floating-point money arithmetic.
2. **ACT-004-REQ-02** Fee computation does not directly modify account balance.
3. **ACT-004-REQ-03** Posted charges require authorized balanced journals.
4. **ACT-004-REQ-04** Exemptions and reversals are explicit versioned financial events.
5. **ACT-004-REQ-05** Tax calculation is disabled until jurisdictional source review.
6. **ACT-004-REQ-06** Fee plan changes cannot retroactively edit charged amounts.
7. **ACT-004-REQ-07** Disclosure and posting amount reconcile to same approved tariff version.

## Negative / acceptance test cases — NOT EXECUTED
- [ ] **ACT-004-T01** Tier boundaries yield deterministic exact result.
- [ ] **ACT-004-T02** Repeated fee command cannot double-charge.
- [ ] **ACT-004-T03** Expired tariff not applied.
- [ ] **ACT-004-T04** Fee reversal creates separate correction.
- [ ] **ACT-004-T05** Tax without approved policy fails closed.

## Definition-of-Ready and closure evidence
CFO/treasury pricing review, verified tax obligations, account/ledger mappings and executable money tests.

**Status:** Design evidence drafted, not reviewed, implemented, executed or certified. Tests: 0 run. Production code: 0. History: proposed ACT package distinct from historic accounting WP-ACC-005; that package's COBAC 312/322 issue and institution-specific approved PCEC mapping remain P0 blocked. Finance-bearing workflow activation is forbidden until resolved.
