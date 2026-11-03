# OPS-011 — High availability, failover and journal quorum assurance

OPES Core Banking | Checkpoint batch 91 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Define service and data failover without allowing concurrent masters, divergent accounting journals or unverifiable settlement outcomes.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `failover_id` | `uuid` | recovery decision |
| `institution_id` | `uuid` | bank entity |
| `service_group_id` | `string` | failure domain |
| `fencing_epoch` | `integer` | monotonic leader generation |
| `authoritative_commit_ref` | `string` | durable journal anchor |
| `replay_cursor` | `string` | outbox/inbox checkpoint |
| `external_outcome_state` | `enum` | known/unknown/reconciled |
| `operator_approval_ref` | `uuid` | independent authorization |

## Workflow and recovery design
1. Detect degradation and determine failed consistency boundary.
2. Fence failed writer before promoting replacement.
3. Validate candidate replica commit/watermark and audit consistency.
4. Promote leader under documented quorum policy.
5. Replay outstanding events with inbox deduplication and unknown-outcome quarantine.
6. Reconcile journal and external obligations before restoring sensitive traffic.

## Invariants and enforcement requirements
1. **OPS-011-R01** Prevent split-brain posting through fencing and unique writer ownership.
2. **OPS-011-R02** Failover cannot alter historical posted journals.
3. **OPS-011-R03** Replica freshness is measured, never inferred from availability.
4. **OPS-011-R04** Unknown settlement remains unknown until source evidence exists.
5. **OPS-011-R05** Bank-specific RPO/RTO values require approved measured exercises.
6. **OPS-011-R06** HSM credentials and rail entitlements do not transfer implicitly.
7. **OPS-011-R07** All failover decisions and promoted generations are audited.

## Acceptance and negative scenarios — planned, not run
- [ ] **OPS-011-T01** Simultaneous writer attempt rejects stale fencing epoch.
- [ ] **OPS-011-T02** Crash after journal commit preserves exactly one posting.
- [ ] **OPS-011-T03** Lagging replica cannot certify zero data loss.
- [ ] **OPS-011-T04** External payment timeout cannot trigger blind replay.
- [ ] **OPS-011-T05** Reconciliation gate blocks reopening on journal imbalance.

## Dependency and reviewer gate
Qualified CFO/Operations review, realistic failure environment and measured HA/DR acceptance evidence.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
