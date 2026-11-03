# ARC-008 — Transactional outbox/inbox and durable delivery policy

OPES Core Banking | 2026-11-03 | Batch 28/30 | Status: DESIGN DRAFT DELIVERED; APPROVAL OPEN
Provenance: governance/PROGRAMME_RECOVERY_BASELINE_2026-11-03.md; governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.1_2026-11-03.md; regulatory/checkpoints/CT/README.md. This proposes technical governance, not executable code or a certified regulatory conclusion.

## Proposed requirements / policy
1. **ARC-008-R01:** Write authoritative domain change and outbound event record atomically in the owning database transaction.
2. **ARC-008-R02:** Publish outbox records asynchronously and record delivery attempts; treat broker acknowledgement as message delivery, not business completion.
3. **ARC-008-R03:** Consumer inbox stores event identity and processing disposition so repeated deliveries do not repeat business side effects.
4. **ARC-008-R04:** Document retry class per failure: transient, validation, authorization, version conflict and unknown business outcome.
5. **ARC-008-R05:** Escalate non-processable messages for monitored operations review; never discard money-relevant messages silently.
6. **ARC-008-R06:** Explicitly handle restarts between database commit, outbox transmission, consumer receipt and acknowledgement.
7. **ARC-008-R07:** Include event version and producer signature/authorization metadata where warranted by security review; do not assume any one broker is mandatory.
8. **ARC-008-R08:** Track publication lag, inbox duplicate rate, poison count, reconciliation errors and recovery time with measurable acceptance thresholds chosen after load and fault tests.

## Design deliverables
- Outbox/inbox state model
- Retry and error classification matrix
- Fault-injection scenario list

## Acceptance scenarios (unexecuted)
- [ ] AC-1: Committed event survives publish failure
- [ ] AC-2: Duplicate event does not duplicate side effect
- [ ] AC-3: Failed messages remain observable

## Pending decisions and constraints
- Broker, data transaction model and test harness not established

## Evidence status
Delivered only a documented technical draft. Work-package completion is not asserted. Tests executed: 0. Production code: 0. Institute-specific and disputed regulatory controls remain blocked until signed authority and review are established.
