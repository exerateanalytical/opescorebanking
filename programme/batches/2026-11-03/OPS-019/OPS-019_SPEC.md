# OPS-019 — Bank operations runbooks and controlled daily processing

OPES Core Banking | Checkpoint batch 99 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Design accountable end-of-day, opening, reconciliation, incident and customer-service handovers without treating elapsed time as evidence of completion.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `runbook_id` | `string` | versioned procedure |
| `institution_id` | `uuid` | regulated operator |
| `business_date` | `date` | approved calendar |
| `run_type` | `enum` | open/eod/reconciliation/recovery |
| `operation_owner` | `string` | assigned role |
| `precondition_refs` | `list` | required upstream results |
| `control_result` | `enum` | not_run/pass/fail/exception |
| `exception_ref` | `uuid|null` | open case |
| `reviewer_id` | `string` | independent checker |

## Workflow and recovery design
1. Determine institution business date and approved calendar.
2. Verify starting reconciliation and known open financial exceptions.
3. Run only eligible controlled tasks in dependency order.
4. Capture actual task logs, outputs, snapshots and exceptions.
5. Require independent finance/operations review before closing monetary cycle.
6. Publish signed handoff and next-business-day recovery state.

## Invariants and enforcement requirements
1. **OPS-019-R01** Clock time cannot automatically certify end-of-day completion.
2. **OPS-019-R02** Open suspense or unknown settlement remains visible in reconciliations.
3. **OPS-019-R03** No direct alteration of posted journals during operational cleanup.
4. **OPS-019-R04** Runbook revisions are effective dated and approval controlled.
5. **OPS-019-R05** Interrupted task resumes idempotently from recorded cursor.
6. **OPS-019-R06** Operator roles cannot self-certify sensitive finance controls.
7. **OPS-019-R07** Customer facing reports must use source-confirmed business date.

## Acceptance and negative scenarios — planned, not run
- [ ] **OPS-019-T01** EOD refuses to pass with unreconciled trial balance.
- [ ] **OPS-019-T02** Interrupted process restart creates no duplicate charge.
- [ ] **OPS-019-T03** Unauthorized operator cannot sign financial closure.
- [ ] **OPS-019-T04** Holiday calendar mismatch triggers exception.
- [ ] **OPS-019-T05** Prior day's evidence remains independently retrievable.

## Dependency and reviewer gate
CFO/Operations endorsed bank calendar, real source reconciliation and executed EOD rehearsal.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
