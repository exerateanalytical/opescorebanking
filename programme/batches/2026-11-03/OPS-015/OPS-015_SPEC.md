# OPS-015 — Capacity planning and nonfunctional service objectives

OPES Core Banking | Checkpoint batch 95 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Define measured service objectives, throughput, saturation response and operator budget without confusing benchmark claims with verified banking capacity.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `capacity_profile_id` | `string` | controlled scenario |
| `institution_id` | `uuid` | legal entity |
| `workload_class` | `enum` | account/read/posting/report/settlement |
| `peak_rate` | `integer` | assumed load until measured |
| `concurrent_sessions` | `integer` | assumed active users |
| `p99_latency_ms` | `integer` | proposed threshold |
| `queue_backlog_max` | `integer` | maximum event delay |
| `reconciliation_window` | `string` | finance approved period |
| `resource_limits_ref` | `string` | compute and storage constraints |
| `test_evidence_ref` | `uuid|null` | real benchmark results |

## Workflow and recovery design
1. Gather branch, channel, month-end and seasonal customer operation volumes.
2. Define minimum service availability and business transaction safety objectives.
3. Create isolated synthetic load fixtures with realistic account distributions.
4. Measure response, queue lag, database locks and ledger reconciliation under load.
5. Model safe throttling, graceful degradation and retry behavior.
6. Approve capacity envelope only using reproducible measured evidence.

## Invariants and enforcement requirements
1. **OPS-015-R01** Marketing TPS target is not a validated performance result.
2. **OPS-015-R02** Correctness of journal and event idempotency is non-negotiable at peak load.
3. **OPS-015-R03** Rate limiting must not lose accepted banking instructions.
4. **OPS-015-R04** Do not mark a settlement backlog cleared without independent source reconciliation.
5. **OPS-015-R05** Cross-institution contention and noisy-neighbor interference must be measured.
6. **OPS-015-R06** Resource changes remain traceable through change control.
7. **OPS-015-R07** Latency targets are bounded by approved institution risk appetites.

## Acceptance and negative scenarios — planned, not run
- [ ] **OPS-015-T01** Concurrent posting requests preserve balance integrity.
- [ ] **OPS-015-T02** Capacity rejection exposes explicit retry-safe state.
- [ ] **OPS-015-T03** Large backlogs recover without duplicate journal entries.
- [ ] **OPS-015-T04** Resource exhaustion cannot expose another institution's records.
- [ ] **OPS-015-T05** Reconciliation window honored under tested peak scenario.

## Dependency and reviewer gate
Operations/CFO signed workload assumptions, executed tests and independent performance acceptance.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
