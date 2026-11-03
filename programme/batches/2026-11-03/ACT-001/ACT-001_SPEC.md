# ACT-001 — Product factory and catalogue ownership

**OPES Core Banking | Batch 61 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Goal and bounded-context rationale
Specify bank product definitions distinct from individual customer contracts and regulatory permissions.

## Candidate data model
| Field | Type | Purpose |
|---|---|---|
| `product_id` | `uuid` | stable identifier |
| `institution_id` | `uuid` | licensed entity |
| `product_family` | `enum` | deposit/current/savings/credit |
| `product_code` | `string` | unique code |
| `display_name` | `string` | customer-facing label |
| `status` | `enum` | draft/review/approved/retired |
| `version` | `string` | immutable edition |
| `effective_from` | `datetime` | activation interval |
| `eligibility_policy_id` | `string` | policy link |
| `approval_ref` | `uuid` | maker-checker reference |

## Proposed workflow
1. Open a draft product owned by one institution.
2. Define family, supported currencies and permitted customer segments.
3. Link applicable jurisdiction and regulatory authority evidence.
4. Attach pricing, accounting and lifecycle policy candidates.
5. Route product to finance/risk/legal approvals.
6. Publish only institution-approved immutable edition.

## Invariants and domain requirements
1. **ACT-001-REQ-01** Product definition does not itself create account or move funds.
2. **ACT-001-REQ-02** Product changes create versions rather than rewriting active customer contracts.
3. **ACT-001-REQ-03** Each product currency and institution combination is validated.
4. **ACT-001-REQ-04** Product approval cannot bypass unresolved PCEC mapping.
5. **ACT-001-REQ-05** Retired editions remain readable for historical calculation.
6. **ACT-001-REQ-06** Default product availability is disabled pending approvals.
7. **ACT-001-REQ-07** Product catalogue cannot assert a licensed offering without institution authorization.

## Negative / acceptance test cases — NOT EXECUTED
- [ ] **ACT-001-T01** Draft product cannot open an account.
- [ ] **ACT-001-T02** Conflicting product code for same institution rejected.
- [ ] **ACT-001-T03** Prior contract remains pinned to prior terms.
- [ ] **ACT-001-T04** Cross-institution product ID rejected.
- [ ] **ACT-001-T05** Unapproved currency cannot be activated.

## Definition-of-Ready and closure evidence
Licensed institution profile, product owner, regulatory eligibility, CFO mapping and acceptance reviewer.

**Status:** Design evidence drafted, not reviewed, implemented, executed or certified. Tests: 0 run. Production code: 0. History: proposed ACT package distinct from historic accounting WP-ACC-005; that package's COBAC 312/322 issue and institution-specific approved PCEC mapping remain P0 blocked. Finance-bearing workflow activation is forbidden until resolved.
