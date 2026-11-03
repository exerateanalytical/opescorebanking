# BRN-003 — Cash drawer opening, custody and opening balance evidence

**OPES Core Banking — Execution batch 123/150**

**State:** DRAFT DELIVERED / INDEPENDENT ACCEPTANCE OPEN. Date: 2026-11-03. This is a provisional work-package slot, not verified historical completion.

## Bounded-context objective
Preserve physical cash custody and opening count provenance distinctly from customer ledger balances.

## Proposed resource contract
| Field | Type | Purpose |
|---|---|---|
| `drawer_session_id` | `uuid` | Cash custody period |
| `institution_id` | `uuid` | Regulated bank |
| `branch_id` | `uuid` | Cash location |
| `drawer_id` | `uuid` | Registered equipment |
| `custodian_id` | `string` | Assigned teller |
| `opening_count_ref` | `uuid` | Denomination count |
| `opening_cash_total` | `string` | Exact cash units |
| `handover_receipt_ref` | `uuid` | Signed source |
| `supervisor_id` | `string` | Independent checker |
| `status` | `string` | Prepared counted accepted open |

## Guarded states
1. `PREPARED>COUNTED` — physical denomination check
2. `COUNTED>ACCEPTED` — independent verified handover
3. `ACCEPTED>OPEN` — dual confirmation
4. `OPEN>FROZEN` — incident or shift closing
5. `FROZEN>CLOSED` — reconciliation

## Lifecycle / happy-path and recovery controls
1. Bind teller and supervisor to registered drawer and shift.
2. Count notes/coins by configured denomination and currency.
3. Compare observed count with prior signed closing balance.
4. Record over/short exception before opening if needed.
5. Approve custody transfer with distinct maker/checker.
6. Open drawer only after verified starting position.

## Domain invariants
1. **BRN-003-R01** Cash drawer count is not a bank customer posting.
2. **BRN-003-R02** Unverified handover cannot open drawer.
3. **BRN-003-R03** Opening balance cannot be typed as arbitrary untraceable number.
4. **BRN-003-R04** Currency/denomination totals use exact arithmetic.
5. **BRN-003-R05** Mismatch creates an exception and prevents silent reconciliation.

## Acceptance cases — NONE EXECUTED
- [ ] **BRN-003-TEST-01** Opening count mismatch raises exception.
- [ ] **BRN-003-TEST-02** Double acceptance yields one open session.
- [ ] **BRN-003-TEST-03** Custodian cannot be both maker and checker.
- [ ] **BRN-003-TEST-04** Foreign-branch drawer denied.
- [ ] **BRN-003-TEST-05** Cash balance never changes customer balance.

## Evidence and release gate
Approved cash custody procedures, denomination configuration, two-person count and reconciliation evidence.

**Safety:** no source-control ZIP can certify regulatory, financial, security or production readiness. Inherited WP-ACC-005 COBAC I-2015/01 312/322 P0 remains blocked, as do institution-specific settlement entitlement checks. This package documents proposed controls only; code: NOT IMPLEMENTED, tests: NOT RUN, independent sign-offs: ABSENT.
