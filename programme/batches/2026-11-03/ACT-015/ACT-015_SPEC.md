# ACT-015 — Statements, transaction history and evidence-backed presentation

**OPES Core Banking | Batch 75/90 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Objective and boundary
Make account statements reproducible from authoritative journal history with stable dates, reversals and transparent pending state.

## Candidate record and API fields
| Field | Type | Meaning |
|---|---|---|
| `statement_id` | `uuid` | export identity |
| `account_id` | `uuid` | contract |
| `institution_id` | `uuid` | scope |
| `period_from` | `date` | inclusive |
| `period_to` | `date` | exclusive |
| `opening_balance` | `string` | exact amount |
| `closing_balance` | `string` | exact amount |
| `source_cursor` | `string` | ledger checkpoint |
| `entry_refs` | `list` | posted transaction lines |
| `generated_at` | `datetime` | as-of timestamp |

## Lifecycle workflow
1. Authenticate requester and authorization to the account.
2. Select approved statement period and ledger snapshot.
3. Retrieve only posted and authorized entries with source references.
4. Show original and reversing adjustments as distinct transactions.
5. Reconcile opening, entries and closing totals.
6. Render consistent accessible PDF/CSV/API export with audit reference.

## Requirements and financial invariants
1. **ACT-015-REQ-01** Statement history cannot be invented from UI cache.
2. **ACT-015-REQ-02** Reversal history must not overwrite original entry.
3. **ACT-015-REQ-03** Debit/credit labels match bank-approved accounting semantics.
4. **ACT-015-REQ-04** No cross-account information from another institution.
5. **ACT-015-REQ-05** Currency and value-date distinctions are explicit.
6. **ACT-015-REQ-06** Pending transfers are labeled separately from posted activity.

## Acceptance tests — NOT EXECUTED
- [ ] **ACT-015-T01** Closing equals opening plus net posted movements.
- [ ] **ACT-015-T02** Reversed transaction remains visible.
- [ ] **ACT-015-T03** Export across institution denied.
- [ ] **ACT-015-T04** Repeated as-of export is reproducible.
- [ ] **ACT-015-T05** Interrupted export cannot fabricate partial totals.

## Acceptance and independent review gate
Approved statement format, finance/legal disclosures, ledger evidence and export security tests.

Status: design specification, not operational banking software. Production code: 0. Executed tests: 0. Independent approvals: NONE. Original posted journals, externally evidenced settlement and current regulatory rules are not overridden. Current inherited WP-ACC-005 P0 COBAC 312/322 remains unresolved.
