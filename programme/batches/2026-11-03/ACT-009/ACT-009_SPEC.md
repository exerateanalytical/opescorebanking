# ACT-009 — Deposit initiation, booking and source reconciliation

**OPES Core Banking | Batch 69/90 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Objective and boundary
Separate an authorized customer deposit request from verified receipt of cash or external funds and from an accounting posting.

## Candidate record and API fields
| Field | Type | Meaning |
|---|---|---|
| `deposit_request_id` | `uuid` | stable command |
| `account_id` | `uuid` | destination contract |
| `institution_id` | `uuid` | legal owner |
| `source_type` | `enum` | branch_cash/cleared_transfer |
| `amount_minor` | `string` | exact monetary amount |
| `currency` | `string` | approved code |
| `funds_evidence_ref` | `uuid|null` | cash/rail proof |
| `posting_command_id` | `string` | unique ledger call |
| `deposit_state` | `enum` | initiated/confirmed/posting_pending/posted/exception |
| `reconciliation_ref` | `uuid|null` | independent match |

## Lifecycle workflow
1. Validate account eligibility, receiving branch and approved currency.
2. Create idempotent deposit instruction.
3. Obtain verifiable cash acceptance or external settlement evidence.
4. Request balanced immutable ledger posting only under approved mapping.
5. Reconcile receipt and authoritative journal with cash/rail source.
6. Issue customer receipt referencing completed transaction and exceptions.

## Requirements and financial invariants
1. **ACT-009-REQ-01** Unverified incoming payment notification is not a funded deposit.
2. **ACT-009-REQ-02** No deposit should create money solely from an API response.
3. **ACT-009-REQ-03** Branch cash custody and bank accounting require independent reconciliation.
4. **ACT-009-REQ-04** Posted journal cannot be updated for a customer correction.
5. **ACT-009-REQ-05** Duplicate deposit receipt cannot create duplicate postings.
6. **ACT-009-REQ-06** Suspended or closed account follows approved acceptance/return rule.

## Acceptance tests — NOT EXECUTED
- [ ] **ACT-009-T01** External transfer acknowledgement without settlement cannot post.
- [ ] **ACT-009-T02** Duplicate cash receipt results in one deposit.
- [ ] **ACT-009-T03** Failed ledger posting remains recoverable exception.
- [ ] **ACT-009-T04** Wrong institution destination denied.
- [ ] **ACT-009-T05** Reconciliation mismatch blocks false completion.

## Acceptance and independent review gate
Approved cash or external settlement source, PCEC mapping, CFO and operations acceptance.

Status: design specification, not operational banking software. Production code: 0. Executed tests: 0. Independent approvals: NONE. Original posted journals, externally evidenced settlement and current regulatory rules are not overridden. Current inherited WP-ACC-005 P0 COBAC 312/322 remains unresolved.
