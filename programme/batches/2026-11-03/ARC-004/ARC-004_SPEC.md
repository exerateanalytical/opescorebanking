# ARC-004 — Architecture principles and quality constraints

OPES Core Banking | 2026-11-03 | Batch 24/30 | Status: ARCHITECTURE DRAFT DELIVERED; ACCEPTANCE OPEN
Based on prior governance and CT/CP checkpoint documents already verified in exerateanalytical/opescorebanking. This is a candidate technical specification, not code or a claim of regulatory approval.

## Domain requirements and control design
1. **ARC-004-R01:** All channel and partner operations use versioned, authenticated service interfaces; no direct database access from frontends.
2. **ARC-004-R02:** Define authoritative domain ownership and typed interfaces; prevent competing writes to accounting records.
3. **ARC-004-R03:** Require explicit access decisions for tenant, role, legal entity, transaction and maker-checker where applicable.
4. **ARC-004-R04:** Use reliable event publication and consumer deduplication so documented workflows survive retries and restarts.
5. **ARC-004-R05:** Keep reporting projections rebuildable from authoritative sources and subject to independent reconciliation.
6. **ARC-004-R06:** Design for effective-dated configuration, source provenance, reviewable changes and backward-compatible integration.
7. **ARC-004-R07:** Expose operational health, correlation identifiers, redacted errors, support diagnostics and explicit recovery playbooks.
8. **ARC-004-R08:** Treat code readiness, operational readiness and legal authorization as separate evidence-backed approval gates.

## Deliverables for acceptance
- Architecture principle register
- Design review checklist
- Anti-pattern examples

## Acceptance tests to prepare (NOT RUN)
- [ ] AC-1: Each principle has an owner and acceptance evidence
- [ ] AC-2: No UI-only permission control
- [ ] AC-3: Design review blocks disputed finance activation

## Evidence and approval gaps
- Cross-disciplinary review and solution ADR signoff outstanding

## Completion boundary
Delivered design draft only. No tests executed, no production code, no certified financial configuration. Implement only after domain DoR, source authority and institution review.
