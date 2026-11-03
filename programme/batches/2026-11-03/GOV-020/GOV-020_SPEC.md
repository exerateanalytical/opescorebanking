# GOV-020 — Audit readiness, evidence retention and independent reconstruction

OPES Core Banking | 2026-11-03 | Batch 20/30 | Status: DRAFT DELIVERED; INDEPENDENT REVIEW OPEN
Source context: governance/PROGRAMME_RECOVERY_BASELINE_2026-11-03.md; governance/LOCAL_ARTIFACT_RECOVERY_INVENTORY_2026-11-03.md; governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.1_2026-11-03.md; regulatory/checkpoints/CT/README.md. Source claims distinguished from proposed design requirements.

## Proposed operational requirements
1. **GOV-020-R01:** Design evidence packs so an independent examiner can reconstruct requirements, legal authority, change approvals, code commit, deployment, posted journals and reconciliations.
2. **GOV-020-R02:** Use stable evidence IDs, capture source custody, effective date, reviewer signature, execution environment, hash algorithm and explicit result.
3. **GOV-020-R03:** Enforce append-only audit for ledger events and controlled corrections; an event status change must not create or destroy money.
4. **GOV-020-R04:** Distinguish financial audit logs, application access logs, security events, regulatory decision records and regulator communications.
5. **GOV-020-R05:** Record maker-checker evidence on sensitive operations with original author, approver, objective, before/after state and correlation ID.
6. **GOV-020-R06:** Ensure data retention/deletion controls do not destroy legally required audit trails or expose customer/health-style sensitive personal data.
7. **GOV-020-R07:** Build reproducibility scenarios for duplicate commands, outage, DR replay, regulatory change, cross-tenant access denial and reversal/return flows.
8. **GOV-020-R08:** Require access-controlled audit export with pagination, integrity checks, restricted PII and documented chain of custody.
9. **GOV-020-R09:** An audit evidence bundle remains NOT CERTIFIED until independently reviewed; self-generated labels do not establish regulatory certification.

## Deliverables for review
- Audit evidence packet format
- Retention and access matrix
- Reconstruction scenario catalogue

## Acceptance criteria — NOT YET PASSED
- [ ] AC-1: Independent reviewer can trace journal-to-source-to-approval
- [ ] AC-2: Missing critical artifacts are explicit FAIL
- [ ] AC-3: Evidence retains complete provenance

## Open evidence and next reviewers
- Independent auditor, retention schedule and production evidence not yet available

## Quality declaration
This document is a substantive first-pass design artifact, not reviewed production policy. Work-package status remains pending acceptance. Executed tests: 0. Code introduced: 0. Certification/approval claimed: none. Keep unresolved P0-dependent functions disabled.
