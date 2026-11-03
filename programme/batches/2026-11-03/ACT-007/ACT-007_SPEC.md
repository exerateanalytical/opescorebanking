# ACT-007 — Account lifecycle states, holds and closure authority

**OPES Core Banking | Batch 67/90 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Objective and boundary
Control OPEN, RESTRICTED, DORMANT and CLOSED account transitions separately from money movement.

## Candidate record and API fields
| Field | Type | Meaning |
|---|---|---|
| `account_id` | `uuid` | stable account |
| `institution_id` | `uuid` | owner |
| `state` | `enum` | proposed/active/restricted/dormant/closing/closed |
| `state_version` | `integer` | concurrency token |
| `restriction_codes` | `list` | holds |
| `restriction_authority_ref` | `uuid` | legal/operations basis |
| `requested_by` | `string` | maker |
| `approved_by` | `string|null` | checker |
| `effective_at` | `datetime` | state activation |
| `history_ref` | `uuid` | immutable prior state |

## Lifecycle workflow
1. Receive authenticated state change request.
2. Check current state, version and legal/financial preconditions.
3. Evaluate outstanding mandates, claims, lien, payments and balances.
4. Route controlled actions to independent checker.
5. Apply new state once and publish scoped event.
6. Retain prior status and incident/appeal evidence.

## Requirements, financial and authorization invariants
1. **ACT-007-REQ-01** State change must not mutate posted ledger history.
2. **ACT-007-REQ-02** Account closure cannot erase positive or negative financial obligations.
3. **ACT-007-REQ-03** Unreconciled transfers or holds prevent unsafe closure.
4. **ACT-007-REQ-04** Expired holds require explicit legal release policy not timer guess.
5. **ACT-007-REQ-05** No self-approval for finance-sensitive state change.
6. **ACT-007-REQ-06** Historical statements use contemporaneous state and product version.

## Acceptance tests — NOT EXECUTED
- [ ] **ACT-007-T01** Stale version rejects concurrent closure.
- [ ] **ACT-007-T02** Closed account rejects new payments.
- [ ] **ACT-007-T03** Closure with unsettled transaction blocked.
- [ ] **ACT-007-T04** Hold release without authority denied.
- [ ] **ACT-007-T05** No journal from status-only transition.

## Acceptance and independent review gate
Institution-approved lifecycle and dormant-account policy; ledger reconciliation and operator approval rules.

Status: This is a candidate design document, not operational bank software. No production code, executed tests, independent signoff or regulatory certification is asserted. The PCEC 312/322 mapping conflict and unverified external payment/settlement participation remain P0 and prohibit dependent activation.
