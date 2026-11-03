# BRN-016 — Foreign currency cash exchange and rate evidence

Batch 136 | OPES Core Banking | 2026-11-03 | DRAFT, REVIEW OPEN

## Purpose
Specify controlled physical FX exchange with bank-approved rate source, spread, rounding, currency custody and accounting entry preconditions.

## Candidate data model
| Name | Type | Intent |
|---|---|---|
| `exchange_id` | uuid | Unique conversion |
| `institution_id` | uuid | Licensed participant |
| `branch_id` | uuid | Cash desk |
| `source_currency` | string | Currency received |
| `target_currency` | string | Currency released |
| `source_amount` | string | Exact input |
| `rate_source_ref` | uuid | Approved FX quote |
| `target_amount` | string | Calculated exact output |
| `cash_handover_refs` | array | Two currency counts |
| `posting_ref` | uuid | Balanced financial journal |

## State transitions and guards
1. QUOTED>CONFIRMED:customer accepts exact quote
2. CONFIRMED>AUTHORIZED:limits and legal checks
3. AUTHORIZED>POSTING_PENDING:approved accounting treatment
4. POSTING_PENDING>EXCHANGED:both cash receipts verified
5. ANY>BLOCKED:FX authority or mapping missing

## Workflow and recovery
1. Confirm institution and teller have authority for requested FX service
2. Obtain bank-approved effective-dated rate, fee and expiry
3. Calculate exact source/target denomination amounts and disclose spread
4. Obtain required KYC and independent approval
5. Post only under reviewed accounting rules and reconcile both currency cash movements

## Required controls
1. BRN-016-REQ-01: Never use a cached unapproved rate for bank cash exchange
2. BRN-016-REQ-02: No cross-currency arithmetic without explicit quote and rounding rule
3. BRN-016-REQ-03: Physical handover requires two independent currency counts
4. BRN-016-REQ-04: Unverified FX entitlement or account classification blocks activation
5. BRN-016-REQ-05: Rate quote expiration requires renewal and customer reconfirmation
6. BRN-016-REQ-06: No implied real-time regulator exchange-rate source from a design document

## Acceptance cases — NOT RUN
- [ ] BRN-016-T01: Expired quote cannot execute
- [ ] BRN-016-T02: Missing target-currency inventory blocks payout
- [ ] BRN-016-T03: Cross-institution rate source denied
- [ ] BRN-016-T04: Duplicate exchange request does not double-convert
- [ ] BRN-016-T05: Journal and two cash inventories reconcile

## Evidence gate
Competent FX licensing/BEAC and institution policy, verified quote source, CFO mapping and executed dual-currency tests.

Code: none. Tests executed: zero. Independent review: pending. No regulatory certification. Historical accounting 312/322 and bank-specific rail participation P0s remain blocked.
