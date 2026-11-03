# OPS-016 — Service reliability engineering and maintenance policy

OPES Core Banking | Checkpoint batch 96 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Set service ownership, error budgets and controlled degraded states that preserve financial integrity during maintenance and outages.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `service_id` | `string` | owned workload |
| `institution_id` | `uuid` | operating entity |
| `criticality` | `enum` | financial/regulated/supporting |
| `availability_slo` | `string` | approved objective |
| `oncall_role` | `string` | incident owner |
| `dependency_refs` | `list` | upstream services |
| `degraded_modes` | `list` | permitted safe functions |
| `maintenance_window` | `string` | approved interval |
| `error_budget_policy` | `string` | escalation threshold |
| `postmortem_ref` | `uuid|null` | incident follow-up |

## Workflow and recovery design
1. Classify services by financial and regulatory criticality.
2. Establish accountable ownership, alerts and dependency call tree.
3. Specify safe read-only and fail-closed degraded modes.
4. Define maintenance approval and customer-channel notifications.
5. Measure actual error rates and recovery indicators.
6. Review service failures with recorded root cause and remediation.

## Invariants and enforcement requirements
1. **OPS-016-R01** Banking traffic cannot silently switch from posting to speculative buffered money changes.
2. **OPS-016-R02** Fail-open behavior for money-moving authorization is prohibited.
3. **OPS-016-R03** Read-only status must be visible and consistent with source cursor.
4. **OPS-016-R04** Maintenance events preserve durable idempotency and audit trail.
5. **OPS-016-R05** No unapproved automatic rail resubmission on outage recovery.
6. **OPS-016-R06** SLO violation is recorded as evidence rather than hidden by averages.
7. **OPS-016-R07** Independent finance review controls reopening after ledger divergence.

## Acceptance and negative scenarios — planned, not run
- [ ] **OPS-016-T01** Loss of account database makes posting fail closed.
- [ ] **OPS-016-T02** Read-only degraded mode displays accurate freshness.
- [ ] **OPS-016-T03** Maintenance drain preserves accepted requests.
- [ ] **OPS-016-T04** Critical alert triggers accountable escalation.
- [ ] **OPS-016-T05** Recovery without reconciliation remains blocked.

## Dependency and reviewer gate
Approved error-budget and recovery policy, operational runbooks and executed chaos or maintenance simulations.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
