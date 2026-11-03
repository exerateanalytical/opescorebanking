# ARC-016 — Resilience, failure states and disaster recovery

**OPES Core Banking | Batch 36/60 | 2026-11-03 | DRAFT DELIVERED; REVIEW OPEN**

## Objective
Specify recoverable business-state handling for service, database and message failures without creating, losing or misclassifying financial value.

## Candidate domain contract
| Attribute | Type | Meaning |
|---|---|---|
| `recovery_case_id` | `uuid` | failure incident identity |
| `institution_id` | `uuid` | affected legal entity |
| `failure_class` | `enum` | database/transport/broker/identity/rail |
| `last_authoritative_commit` | `string` | durable state anchor |
| `outbox_watermark` | `string` | publication cursor |
| `inbox_watermark` | `string` | consumer cursor |
| `reconciliation_cutoff` | `timestamp` | source comparison point |
| `recovery_state` | `enum` | detected/quarantined/replayed/reconciled/closed |
| `approved_by` | `string` | independent operations signatory |

## Process
1. Detect incident and suspend unsafe money-moving routes where needed.
2. Protect committed journal, outbox and audit data from destructive replay.
3. Restore validated backup or failover replica with known recovery cursor.
4. Replay eligible unprocessed messages through consumer deduplication.
5. Reconcile journal totals, external settlements, fees and outstanding outcomes.
6. Obtain separate operations/CFO acceptance before resuming affected flows.

## Design invariants
1. **ARC-016-R01** Recovery cannot edit an original posted journal or manufacture missing payment finality.
2. **ARC-016-R02** Use institution-approved RPO/RTO values only after tested measurement.
3. **ARC-016-R03** Unknown external payments remain quarantined until source statements or authority clarify.
4. **ARC-016-R04** Backup consistency must include journal, outbox, keys and audit references.
5. **ARC-016-R05** Runbooks must account for lost acknowledgements and duplicate deliveries.
6. **ARC-016-R06** DR rehearsals must produce evidence, not only a plan or architectural drawing.

## Tests to execute (NONE RUN)
- [ ] **ARC-016-T01** Kill publisher after DB commit and verify exactly one recovered business effect.
- [ ] **ARC-016-T02** Replay consumer batch twice without duplicate posting.
- [ ] **ARC-016-T03** Restore backup and reconcile source account totals.
- [ ] **ARC-016-T04** Simulate missing external statement and prevent finality declaration.
- [ ] **ARC-016-T05** Require dual authorization to reopen rail after a severe outage.

## Definition of Ready / acceptance
Operational recovery environment, signed RPO/RTO, real fault-injection execution and independent CFO/Operations review.

**Safety and provenance:** draft based on the verified repository programme baseline and inherited CT checkpoint. Historical WP-ACC-005 P0 COBAC 312/322 issue and unverified institution payments entitlements remain blocked. No executable code, independently accepted WP, real tests or institutional/regulatory certification asserted. Require named reviewers and source evidence.
