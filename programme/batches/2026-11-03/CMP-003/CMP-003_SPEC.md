# CMP-003 — Transaction monitoring scenarios and alert provenance

Batch 143 | OPES Core Banking | 2026-11-03 | DRAFT, REVIEW OPEN

## Purpose
Specify supervised risk monitoring using exact financial events and approved rule versions without interpreting an algorithmic alert as guilt or automatic sanction.

## Candidate data model
| Name | Type | Intent |
|---|---|---|
| `monitoring_run_id` | uuid | Evaluation batch |
| `institution_id` | uuid | Bank owner |
| `transaction_ref` | uuid | Authoritative event |
| `customer_ref` | uuid | Reviewed party |
| `scenario_id` | string | Versioned approved rule |
| `observation_window` | string | Source snapshot |
| `signal_evidence_refs` | array | Input provenance |
| `alert_id` | uuid | Deduplicated indicator |
| `case_ref` | uuid | Escalation identity |
| `outcome_state` | string | No_alert alert pending review |

## State transitions and guards
1. RECEIVED>VALIDATED:source event checked
2. VALIDATED>EVALUATED:effective rules applied
3. EVALUATED>ALERTED:scenario trigger
4. ALERTED>REVIEWED:human analyst disposition
5. ANY>EXCEPTION:source data missing

## Workflow and recovery
1. Read institution-authorized committed transaction events with source cursor
2. Resolve effective monitoring scenarios, thresholds and allowed customer context
3. Compute observations with deterministic windows and exact amounts
4. Create deduplicated risk signal and preserve rule/evidence version
5. Route alerts to authorized case analysts for documented review

## Required controls
1. CMP-003-REQ-01: Monitoring does not mutate posted journal or reverse funds
2. CMP-003-REQ-02: Event duplication cannot create duplicate enforcement actions
3. CMP-003-REQ-03: Alert status is not legal proof of suspicious conduct
4. CMP-003-REQ-04: Unapproved scenarios cannot be deployed silently
5. CMP-003-REQ-05: Cross-customer/cross-tenant comparisons require lawful purpose
6. CMP-003-REQ-06: Insufficient financial source data must be marked explicitly

## Acceptance cases — NOT RUN
- [ ] CMP-003-T01: Duplicate transaction event raises one logical alert
- [ ] CMP-003-T02: Unknown threshold edition blocked
- [ ] CMP-003-T03: Wrong bank transaction ignored
- [ ] CMP-003-T04: Stale source cursor flagged
- [ ] CMP-003-T05: Analyst disposition preserves original signal

## Evidence gate
Legally approved monitoring rules and source provenance, AML owner approval and executed monitoring tests.

Code: none. Tests executed: zero. Independent review: pending. No regulatory certification. Historical accounting 312/322 and bank-specific rail participation P0s remain blocked.
