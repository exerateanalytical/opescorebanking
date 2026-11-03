# CMP-004 — Compliance investigation cases and maker-checker escalation

Batch 144 | OPES Core Banking | 2026-11-03 | DRAFT, REVIEW OPEN

## Purpose
Model confidential compliance cases, evidence chain and escalation authority without leaking suspicion or enabling unreviewed customer sanctions.

## Candidate data model
| Name | Type | Intent |
|---|---|---|
| `compliance_case_id` | uuid | Investigation |
| `institution_id` | uuid | Regulated owner |
| `subject_ref` | uuid | Customer or transaction |
| `trigger_refs` | array | Alerts and documents |
| `assigned_analyst_id` | string | Responsible investigator |
| `confidentiality_level` | string | Access category |
| `reviewer_ref` | string | Independent checker |
| `disposition` | string | Investigate clear escalate hold |
| `closure_evidence_ref` | uuid | Reasoned proof |
| `case_state` | string | Open investigating review closed |

## State transitions and guards
1. OPEN>INVESTIGATING:analyst assigned
2. INVESTIGATING>REVIEW:documented proposed finding
3. REVIEW>ESCALATED:qualified supervisory decision
4. REVIEW>CLOSED:reasoned approval
5. CLOSED>REOPENED:new material source evidence

## Workflow and recovery
1. Open case from validated customer, transaction or compliance trigger
2. Restrict evidence access by institution and need-to-know role
3. Record analysis, legal authority, source dates and counterevidence
4. Route sensitive decisions to independent reviewer
5. Close or escalate while preserving immutable case and audit history

## Required controls
1. CMP-004-REQ-01: Analyst cannot self-approve legally sensitive case outcome
2. CMP-004-REQ-02: A risk alert cannot independently freeze assets without lawful authority
3. CMP-004-REQ-03: Customer notifications must not reveal confidential AML reporting
4. CMP-004-REQ-04: Case evidence changes are append-only/versioned
5. CMP-004-REQ-05: Closure does not delete statutory banking records
6. CMP-004-REQ-06: Unresolved cases remain visible in oversight and performance reporting

## Acceptance cases — NOT RUN
- [ ] CMP-004-T01: Unauthorized teller cannot view case
- [ ] CMP-004-T02: Same maker/checker rejected
- [ ] CMP-004-T03: Missing legal hold authority blocks freeze
- [ ] CMP-004-T04: New evidence reopens with history intact
- [ ] CMP-004-T05: Cross-bank case evidence denied

## Evidence gate
Qualified compliance authority, institutional case SOP, applicable AML confidentiality provisions and access-control tests.

Code: none. Tests executed: zero. Independent review: pending. No regulatory certification. Historical accounting 312/322 and bank-specific rail participation P0s remain blocked.
