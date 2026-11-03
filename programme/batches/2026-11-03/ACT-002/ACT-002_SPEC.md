# ACT-002 — Product terms versioning and approved change lifecycle

**OPES Core Banking | Batch 62 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Goal and bounded-context rationale
Define effective-dated bank product terms and safe migration of existing contracts.

## Candidate data model
| Field | Type | Purpose |
|---|---|---|
| `terms_id` | `uuid` | versioned terms |
| `product_id` | `uuid` | parent product |
| `institution_id` | `uuid` | regulated owner |
| `version` | `string` | immutable revision |
| `effective_from` | `datetime` | applicability start |
| `effective_to` | `datetime|null` | end interval |
| `rate_plan_id` | `string` | pricing reference |
| `fee_schedule_id` | `string` | approved fees |
| `applicability` | `enum` | new_only/consented_existing |
| `approval_status` | `enum` | draft/approved/suspended |

## Proposed workflow
1. Propose terms change with business justification.
2. Classify whether new contracts or existing agreements are affected.
3. Analyze fee, interest, reporting and ledger consequences.
4. Collect approvals and customer notice/consent where legally required.
5. Validate effective dates without overlapping conflicting editions.
6. Activate approved version and preserve historical audit.

## Invariants and domain requirements
1. **ACT-002-REQ-01** No retroactive overwrite of customer contract terms.
2. **ACT-002-REQ-02** Contract migration requires contractual and legal authority.
3. **ACT-002-REQ-03** Effective dates distinguish legal approval from deployment time.
4. **ACT-002-REQ-04** Rates and fees must be represented by exact arithmetic policies.
5. **ACT-002-REQ-05** Do not compute customer interest using unapproved accounting mappings.
6. **ACT-002-REQ-06** Every term revision has traceable approver and source documents.
7. **ACT-002-REQ-07** Old versions remain available for statements and disputes.

## Negative / acceptance test cases — NOT EXECUTED
- [ ] **ACT-002-T01** Overlapping active versions rejected.
- [ ] **ACT-002-T02** Historic accrual reference retains original version.
- [ ] **ACT-002-T03** Unsigned migration not applied.
- [ ] **ACT-002-T04** Changing terms cannot edit posted journal.
- [ ] **ACT-002-T05** Out-of-window version unavailable to new account.

## Definition-of-Ready and closure evidence
Product committee and legal/CFO approval, customer notice rules and migration tests.

**Status:** Design evidence drafted, not reviewed, implemented, executed or certified. Tests: 0 run. Production code: 0. History: proposed ACT package distinct from historic accounting WP-ACC-005; that package's COBAC 312/322 issue and institution-specific approved PCEC mapping remain P0 blocked. Finance-bearing workflow activation is forbidden until resolved.
