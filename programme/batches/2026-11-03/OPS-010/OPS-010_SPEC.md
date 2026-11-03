# OPS-010 — Backup, restore, DR and financial recovery acceptance model

**OPES Core Banking | Batch 90/90 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Objective and boundary
Specify safe disaster recovery and evidence-based service resumption across ledger, event transport, financial integrations and identity stores.

## Candidate record and policy fields
| Field | Type | Meaning |
|---|---|---|
| `recovery_plan_id` | `string` | versioned recovery plan |
| `institution_id` | `uuid` | bank boundary |
| `environment_id` | `string` | target restoration scope |
| `backup_snapshot_ref` | `string` | source artifact |
| `source_commit_ref` | `string` | app version |
| `journal_watermark` | `string` | accounting checkpoint |
| `outbox_watermark` | `string` | event delivery cursor |
| `external_outcomes` | `list` | uncertain settlements |
| `reconciliation_evidence_ref` | `uuid|null` | control review |
| `approval_status` | `enum` | planned/tested/approved/blocked |

## Operations workflow
1. Create institution-approved backup and recovery policy with RPO/RTO requirements.
2. Take encrypted consistent backups with key recovery scope and source evidence.
3. Restore in isolated recovery environment with validated data integrity.
4. Resume outbox/inbox from trusted cursors and deduplicate messages.
5. Reconcile journal, customer balances, cash positions and external outcome cases.
6. Reopen production traffic only on independent operations/CFO approval.

## Requirements and security controls
1. **OPS-010-REQ-01** Unreconciled payment outcomes cannot be considered settled due to failover.
2. **OPS-010-REQ-02** Restore cannot skip posted journal entries or modify original posting history.
3. **OPS-010-REQ-03** Recovery objectives must be measured and institution-approved, not advertised without tests.
4. **OPS-010-REQ-04** Backup copies remain encrypted and isolated from routine application permissions.
5. **OPS-010-REQ-05** Duplicate event replay cannot create duplicate financial value.
6. **OPS-010-REQ-06** Disaster recovery approval is separate from ZIP delivery or programme document acceptance.

## Acceptance tests — NOT EXECUTED
- [ ] **OPS-010-T01** Restore a measured snapshot and compare source totals.
- [ ] **OPS-010-T02** Crash after posting before event publish and recover once.
- [ ] **OPS-010-T03** Replay inbox events without duplication.
- [ ] **OPS-010-T04** Test unknown external settlement after outage.
- [ ] **OPS-010-T05** Reject resumption without CFO reconciliation approval.

## Acceptance and independent review gate
Approved bank RPO/RTO, encrypted backup custody, executed restoration/fault tests and independent financial security signoff.

Status: design specification, not deployed infrastructure or banking software. Production code: 0. Executed tests: 0. Independent approvals: NONE. Existing 312/322 PCEC contradiction and payment institution entitlement remain P0 and separate from this independent operations design.
