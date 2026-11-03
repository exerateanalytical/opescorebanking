# ARC-003 — Deployment and continuity option assessment

OPES Core Banking | 2026-11-03 | Batch 23/30 | Status: ARCHITECTURE DRAFT DELIVERED; ACCEPTANCE OPEN
Based on prior governance and CT/CP checkpoint documents already verified in exerateanalytical/opescorebanking. This is a candidate technical specification, not code or a claim of regulatory approval.

## Domain requirements and control design
1. **ARC-003-R01:** Compare approved-institution on-premises, hosted-private and carefully scoped hybrid deployment options without selecting technology prematurely.
2. **ARC-003-R02:** Document legal entity, site, jurisdiction, data residency and regulator requirements for each option.
3. **ARC-003-R03:** Separate development, qualification and production datasets, access rights and operational approvals.
4. **ARC-003-R04:** Design for redundant runtime services, resilient persistence, monitored integrations and tested disaster recovery; select numeric targets with institution evidence.
5. **ARC-003-R05:** Define operational response to database failover, interrupted processing, unavailable external rails and delayed reconciliation feeds.
6. **ARC-003-R06:** Use auditable deployment manifests, change approvals, reversible non-financial changes and controlled financial corrections.
7. **ARC-003-R07:** Require performance sizing from expected peak workload and measured load tests, not arbitrary throughput declarations.
8. **ARC-003-R08:** Record technology choices as ADR proposals evaluated against supportability, cost, safety and operational skills.

## Deliverables for acceptance
- Deployment comparison matrix
- Continuity and data-residency review form
- Capacity evidence requirements

## Acceptance tests to prepare (NOT RUN)
- [ ] AC-1: Hosting selected only after legal/ops review
- [ ] AC-2: Recovery maintains accounting consistency
- [ ] AC-3: No unverified SLA advertised

## Evidence and approval gaps
- Approved hosting jurisdiction, workload envelope and RPO/RTO undefined

## Completion boundary
Delivered design draft only. No tests executed, no production code, no certified financial configuration. Implement only after domain DoR, source authority and institution review.
