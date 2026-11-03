# ARC-005 — Architecture decision register and ADR templates

OPES Core Banking | 2026-11-03 | Batch 25/30 | Status: DESIGN DRAFT DELIVERED; APPROVAL OPEN
Provenance: governance/PROGRAMME_RECOVERY_BASELINE_2026-11-03.md; governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.1_2026-11-03.md; regulatory/checkpoints/CT/README.md. This proposes technical governance, not executable code or a certified regulatory conclusion.

## Proposed requirements / policy
1. **ARC-005-R01:** ADR-001 PROPOSED: accounting journal authority remains a single Ledger domain; other contexts request postings via authorized domain contracts.
2. **ARC-005-R02:** ADR-002 PROPOSED: distribute business changes through durable recorded events rather than relying on best-effort callbacks.
3. **ARC-005-R03:** ADR-003 PROPOSED: money-moving commands carry stable idempotency identifiers scoped to institution, operation and requesting actor.
4. **ARC-005-R04:** ADR-004 PROPOSED: institution profile, regulator evidence and permitted capability form a gated deployment configuration, not a runtime guess.
5. **ARC-005-R05:** ADR-005 PROPOSED: query/read projections may lag writes but must expose freshness and reconciliation status for critical screens.
6. **ARC-005-R06:** An ADR records context, decision, alternatives, acceptance criteria, rejected risks, reviewers, date, effective release and supersession ID.
7. **ARC-005-R07:** Require legal, finance, security and operations signoff for ADRs crossing their authority boundaries; document a dissent path.
8. **ARC-005-R08:** Use DRAFT, PROPOSED, ACCEPTED, SUPERSEDED and REJECTED states; current ADR candidates are not accepted architecture mandates.

## Design deliverables
- ADR-001 to ADR-005 candidates
- Decision log schema
- Architecture board review queue

## Acceptance scenarios (unexecuted)
- [ ] AC-1: All accepted ADRs have named reviewers
- [ ] AC-2: Alternatives and rollback consequences documented
- [ ] AC-3: No draft ADR passed as accepted

## Pending decisions and constraints
- Architecture council and institution signatories not appointed

## Evidence status
Delivered only a documented technical draft. Work-package completion is not asserted. Tests executed: 0. Production code: 0. Institute-specific and disputed regulatory controls remain blocked until signed authority and review are established.
