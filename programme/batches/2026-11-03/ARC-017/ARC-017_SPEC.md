# ARC-017 — Performance envelope and capacity validation plan

**OPES Core Banking | Batch 37 of 60 | 2026-11-03 | DRAFT / NOT YET ACCEPTED**

## Objective
Establish measurable workload models before selecting performance targets or claiming banking-system scalability.

## Candidate entity and evidence contract
| Field | Type | Description |
|---|---|---|
| `workload_id` | `string` | scenario ID |
| `institution_profile_id` | `uuid` | licensed scope |
| `operation_class` | `enum` | read/posting/transfer/report/batch |
| `peak_tps` | `integer` | approved modeled transactions per second |
| `concurrency` | `integer` | active sessions |
| `p95_latency_ms` | `integer` | measured target |
| `error_budget` | `string` | approved SLO policy |
| `ledger_reconcile_seconds` | `integer` | measured cutoff |
| `queue_lag_ms` | `integer` | outbox and inbox delay |
| `dataset_profile` | `string` | realistic anonymized dataset volume |

## Workflow
1. Collect institutional branch/channel/batch and seasonality assumptions.
2. Define separately steady, peak, stress, saturation and recovery scenarios.
3. Generate approved anonymized workload fixtures with realistic account and event distribution.
4. Measure request p50/p95/p99, queue lag, posting conservation and report consistency.
5. Repeat under database failure, broker replay and delayed external network conditions.
6. Publish hardware profile, reproducible results, bottlenecks and acceptance decisions.

## Requirements / design invariants
1. **ARC-017-REQ-01** Do not infer capacity from a marketing target or an unexecuted synthetic benchmark.
2. **ARC-017-REQ-02** Correctness and end-of-day reconciliation outrank higher nominal TPS.
3. **ARC-017-REQ-03** Record external dependency constraints separately from internal application performance.
4. **ARC-017-REQ-04** Measure tenant isolation and authorization cost under concurrent workloads.
5. **ARC-017-REQ-05** Performance tests must ensure zero duplicate or unbalanced journal postings.
6. **ARC-017-REQ-06** Stress tests must preserve complete audit and traceability while redacting sensitive data.

## Planned negative and property tests — NONE EXECUTED
- [ ] **ARC-017-TEST-01** Run peak posting workload and compare journal debits/credits.
- [ ] **ARC-017-TEST-02** Measure read projection staleness during high event volume.
- [ ] **ARC-017-TEST-03** Introduce broker lag and verify recovery without duplicate commands.
- [ ] **ARC-017-TEST-04** Test per-institution resource limits under multitenant load.
- [ ] **ARC-017-TEST-05** Benchmark restore and reconciliation before allowing production resume.

## Definition of Ready and approval gap
Signed workload assumptions, available benchmark environment, executed load/fault tests and independent Operations/CFO result review.

This is documentation only. No source code generated, no executable tests run, no banking certification or institution approval obtained. Preserve account-mapping and payments P0 gates documented in checkpoint CT, and record actual reviewer decisions before changing status to VERIFIED_COMPLETE.
