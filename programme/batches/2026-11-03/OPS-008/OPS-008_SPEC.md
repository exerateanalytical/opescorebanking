# OPS-008 — Monitoring, SLOs and operational reconciliation alerts

**OPES Core Banking | Batch 88/90 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Objective and boundary
Create metrics, incident alerts and operational runbooks with a clear distinction between system health and money/accounting integrity.

## Candidate record and policy fields
| Field | Type | Meaning |
|---|---|---|
| `signal_id` | `string` | metric or alert identifier |
| `institution_id` | `uuid` | scoped owner |
| `service_id` | `string` | monitored application |
| `signal_type` | `enum` | latency/error/lag/reconciliation/security |
| `objective_version` | `string` | approved SLO |
| `threshold` | `string` | measured value |
| `severity` | `enum` | info/warning/critical |
| `incident_ref` | `uuid|null` | linked case |
| `evidence_window` | `string` | observed time range |
| `owner_team` | `string` | response function |

## Operations workflow
1. Define risk-based service and reconciliation objectives.
2. Instrument API, database, broker and reconciliation checkpoints.
3. Detect late journal projections, duplicate events and unresolved payments.
4. Classify severity separately for availability, confidentiality and finance.
5. Route incidents to authorized operations and financial control.
6. Measure actual recovery and review false positives/coverage.

## Requirements and security controls
1. **OPS-008-REQ-01** Green uptime chart cannot prove ledger correctness.
2. **OPS-008-REQ-02** Unreconciled settlement must trigger independent finance review.
3. **OPS-008-REQ-03** Metrics exclude secrets and unnecessary personal data.
4. **OPS-008-REQ-04** SLO values require tested bank-specific baselines.
5. **OPS-008-REQ-05** Alert delivery itself must be monitored and redundant.
6. **OPS-008-REQ-06** Critical fraud or ledger alert cannot be silently disabled.

## Acceptance tests — NOT EXECUTED
- [ ] **OPS-008-T01** Simulate reconciliation mismatch triggers alert.
- [ ] **OPS-008-T02** Broker lag threshold escalates appropriately.
- [ ] **OPS-008-T03** Metrics preserve institution scoping.
- [ ] **OPS-008-T04** Down alert pipeline detected.
- [ ] **OPS-008-T05** No customer document content in trace.

## Acceptance and independent review gate
Operations/finance agreed SLOs, real telemetry instrumentation, alert tests and incident-runbook owners.

Status: design specification, not deployed infrastructure or banking software. Production code: 0. Executed tests: 0. Independent approvals: NONE. Existing 312/322 PCEC contradiction and payment institution entitlement remain P0 and separate from this independent operations design.
