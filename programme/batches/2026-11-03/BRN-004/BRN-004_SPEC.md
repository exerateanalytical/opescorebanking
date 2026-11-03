# BRN-004 — Teller cash deposit intake and controlled financial handoff

**OPES Core Banking — Execution batch 124/150**

**State:** DRAFT DELIVERED / INDEPENDENT ACCEPTANCE OPEN. Date: 2026-11-03. This is a provisional work-package slot, not verified historical completion.

## Bounded-context objective
Design a cash deposit workflow with authenticated customer, physical cash proof and approved ledger command; no premature customer credit.

## Proposed resource contract
| Field | Type | Purpose |
|---|---|---|
| `cash_deposit_id` | `uuid` | Idempotent counter operation |
| `institution_id` | `uuid` | Bank entity |
| `drawer_session_id` | `uuid` | Accountable cash custody |
| `customer_account_id` | `uuid` | Authorized deposit destination |
| `declared_amount` | `string` | Exact expected units |
| `counted_amount` | `string` | Observed units |
| `count_evidence_ref` | `uuid` | Denomination proof |
| `receipt_id` | `uuid` | Customer receipt identifier |
| `ledger_command_ref` | `string` | Idempotent posting request |
| `status` | `string` | Draft counted posted exception |

## Guarded states
1. `DRAFT>COUNTED` — physical cash accepted
2. `COUNTED>VALIDATED` — account and risk checks
3. `VALIDATED>POSTING_PENDING` — approved mapping exists
4. `POSTING_PENDING>POSTED` — ledger proof reconciled
5. `ANY>EXCEPTION` — mismatch or uncertain result

## Lifecycle / happy-path and recovery controls
1. Verify account deposit eligibility, teller shift and customer identification.
2. Count denomination-level cash with the teller and customer confirmation.
3. Record physical custody before invoking an approved financial command.
4. Request exactly-once logical deposit posting using stable command ID.
5. Reconcile posted journal, drawer movement and customer receipt.
6. Route unknown or failed posting to restricted exception queue.

## Domain invariants
1. **BRN-004-R01** Cash receipt alone does not establish completed customer posting.
2. **BRN-004-R02** No unbalanced or unapproved PCEC mapping may be used.
3. **BRN-004-R03** A retry cannot create a second credit or cash movement.
4. **BRN-004-R04** Cash custody and ledger evidence reconcile independently.
5. **BRN-004-R05** Status-only correction cannot mutate posted journal.

## Acceptance cases — NONE EXECUTED
- [ ] **BRN-004-TEST-01** Duplicate deposit command posts at most once.
- [ ] **BRN-004-TEST-02** Account closed for deposits rejected.
- [ ] **BRN-004-TEST-03** Ledger failure leaves cash custody exception.
- [ ] **BRN-004-TEST-04** Count mismatch stops posting.
- [ ] **BRN-004-TEST-05** Cross-institution destination denied.

## Evidence and release gate
CFO-approved accounts, teller rules, PCEC resolution, actual cash/ledger integration tests.

**Safety:** no source-control ZIP can certify regulatory, financial, security or production readiness. Inherited WP-ACC-005 COBAC I-2015/01 312/322 P0 remains blocked, as do institution-specific settlement entitlement checks. This package documents proposed controls only; code: NOT IMPLEMENTED, tests: NOT RUN, independent sign-offs: ABSENT.
