# BRN-018 — Teller transaction limits, anti-fraud and protective holds

Batch 138 | OPES Core Banking | 2026-11-03 | DRAFT, REVIEW OPEN

## Purpose
Apply approved branch-specific volume, value and role-based controls to cash services while recording non-final risk alerts separately.

## Candidate data model
| Name | Type | Intent |
|---|---|---|
| `limit_decision_id` | uuid | Decision |
| `institution_id` | uuid | Legal entity |
| `branch_id` | uuid | Office |
| `teller_id` | uuid | Staff actor |
| `cash_operation_id` | uuid | Proposed transaction |
| `currency` | string | Denomination |
| `amount_minor` | string | Exact amount |
| `limit_policy_ref` | string | Effective rule |
| `risk_alert_ref` | uuid | Case evidence |
| `decision` | string | Allow challenge deny review |

## State transitions and guards
1. REQUESTED>ALLOW:policy satisfied
2. REQUESTED>CHALLENGE:step-up needed
3. REQUESTED>REVIEW:fraud indicators
4. CHALLENGE>ALLOW:approved checker
5. ANY>DENY:restriction or risk rule

## Workflow and recovery
1. Load bank-approved teller, drawer and customer limit policies
2. Aggregate exact transaction totals using an approved business-day window
3. Evaluate mandate, denomination availability and any legal restrictions
4. Escalate risk alert without leaking customer investigation detail
5. Approve or reject before cash handover and record authoritative decision

## Required controls
1. BRN-018-REQ-01: No universal cash threshold can be asserted without bank policy
2. BRN-018-REQ-02: Risk flag cannot directly edit posted journal or accuse a person
3. BRN-018-REQ-03: Override to a monetary limit requires independent checker
4. BRN-018-REQ-04: Limit evaluation must be concurrency-safe and scope-aware
5. BRN-018-REQ-05: Access to fraud cases is restricted and audited
6. BRN-018-REQ-06: Repeated request must not evade daily counts or perform double debit

## Acceptance cases — NOT RUN
- [ ] BRN-018-T01: Simultaneous operations cannot evade daily cap
- [ ] BRN-018-T02: Expired limit policy blocks new transaction
- [ ] BRN-018-T03: Self-approved override rejected
- [ ] BRN-018-T04: Wrong branch risk context denied
- [ ] BRN-018-T05: Suspicious activity review leaves journal unchanged

## Evidence gate
Qualified risk/AML, institution-specific limits and real concurrent enforcement testing.

Code: none. Tests executed: zero. Independent review: pending. No regulatory certification. Historical accounting 312/322 and bank-specific rail participation P0s remain blocked.
