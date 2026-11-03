# ARC-007 — Domain event envelope and schema governance

OPES Core Banking | 2026-11-03 | Batch 27/30 | Status: DESIGN DRAFT DELIVERED; APPROVAL OPEN
Provenance: governance/PROGRAMME_RECOVERY_BASELINE_2026-11-03.md; governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.1_2026-11-03.md; regulatory/checkpoints/CT/README.md. This proposes technical governance, not executable code or a certified regulatory conclusion.

## Proposed requirements / policy
1. **ARC-007-R01:** Propose event envelope fields event_id, event_type, schema_version, tenant_id, aggregate_id, aggregate_version, occurred_at, recorded_at and correlation_id.
2. **ARC-007-R02:** Distinguish business fact events from commands, requests and projection notifications; a received message alone is not a bank accounting posting.
3. **ARC-007-R03:** Document producer owner, consumer roster, field-level data classification, retention and compatibility rules for each event.
4. **ARC-007-R04:** Require immutable event identifiers and typed aggregate version to detect duplicate delivery and stale/out-of-order processing.
5. **ARC-007-R05:** Build backward-compatible schema evolution with explicit breaking-change migration plan and consumer confirmation.
6. **ARC-007-R06:** Minimize personal details in general-purpose event buses; use references and access-controlled retrieval when possible.
7. **ARC-007-R07:** Document replay semantics, side-effect safeguards, consumer recovery and poison-message escalation; event handling must be observable.
8. **ARC-007-R08:** Define proposed examples CustomerVerified, AccountOpened, JournalPosted, PaymentSubmissionRecorded, SettlementEvidenceAttached and ReconciliationCompleted.

## Design deliverables
- Event catalogue candidate
- Envelope JSON schema draft
- Consumer compatibility checklist

## Acceptance scenarios (unexecuted)
- [ ] AC-1: Every event has one accountable producer
- [ ] AC-2: No event implies finality without supporting evidence
- [ ] AC-3: Replay cannot duplicate financial consequences

## Pending decisions and constraints
- Event transport and schema registry selection not ratified

## Evidence status
Delivered only a documented technical draft. Work-package completion is not asserted. Tests executed: 0. Production code: 0. Institute-specific and disputed regulatory controls remain blocked until signed authority and review are established.
