# BRN-015 — Branch banking calendar, opening and end-of-day operations

Batch 135 | OPES Core Banking | 2026-11-03 | DRAFT, REVIEW OPEN

## Purpose
Define branch business date, holidays, shift closure and EOD dependency gates without false completion from elapsed time.

## Candidate data model
| Name | Type | Intent |
|---|---|---|
| `business_day_id` | uuid | Date instance |
| `institution_id` | uuid | Bank owner |
| `branch_id` | uuid | Location |
| `business_date` | date | Approved calendar |
| `opening_check_ref` | uuid | Prior-day readiness |
| `cash_shift_status` | string | Teller closure state |
| `reconciliation_ref` | uuid | Finance evidence |
| `pending_exception_count` | integer | Unresolved cases |
| `day_state` | string | Planned open closing closed |

## State transitions and guards
1. PLANNED>OPEN:calendar and opening checks
2. OPEN>CLOSING:cutoff enforced
3. CLOSING>RECONCILING:all shift evidence
4. RECONCILING>CLOSED:qualified finance approval
5. CLOSING>EXCEPTION:unresolved cash or funds

## Workflow and recovery
1. Resolve institution-approved business calendar, dates and time zone
2. Check branch opening permissions, teller readiness and prior-day exceptions
3. Record transaction cutoffs and freeze eligible shifts
4. Reconcile cash, ledger, in-transit cash and pending payment records
5. Record independent close or documented exceptions and next-day carry-forward

## Required controls
1. BRN-015-REQ-01: Calendar midnight does not automatically certify financial EOD
2. BRN-015-REQ-02: Unreconciled transfer/cash variance remains on explicit exception ledger
3. BRN-015-REQ-03: Branch closing cannot change posted journal value date arbitrarily
4. BRN-015-REQ-04: Local holidays require approved institution calendar version
5. BRN-015-REQ-05: Pending actions use durable business-date attribution
6. BRN-015-REQ-06: No self-certified exception-free closing by single teller

## Acceptance cases — NOT RUN
- [ ] BRN-015-T01: Holiday blocks ordinary branch opening when configured
- [ ] BRN-015-T02: Unbalanced shift prevents closed status
- [ ] BRN-015-T03: Missing ledger recon creates exception
- [ ] BRN-015-T04: Duplicate EOD invocation idempotent
- [ ] BRN-015-T05: Late operation recorded in approved business date

## Evidence gate
Approved institution calendars and cutoffs, CFO review and executed EOD scenarios.

Code: none. Tests executed: zero. Independent review: pending. No regulatory certification. Historical accounting 312/322 and bank-specific rail participation P0s remain blocked.
