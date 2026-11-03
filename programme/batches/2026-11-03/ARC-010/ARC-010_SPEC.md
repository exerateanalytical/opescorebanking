# ARC-010 — Data architecture, classification and lifecycle blueprint

OPES Core Banking | 2026-11-03 | Batch 30/30 | Status: DESIGN DRAFT DELIVERED; REVIEW AND TESTS OPEN
Source context: governance/PROGRAMME_RECOVERY_BASELINE_2026-11-03.md; governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.1_2026-11-03.md; regulatory/checkpoints/CT/README.md. These requirements are proposed engineering controls, not implemented functionality.

## Requirements, invariants and recovery behavior
1. **ARC-010-R01:** Define authoritative stores for customer master data, account lifecycle, financial journals, payment orchestration and approved reference data, with one write owner each.
2. **ARC-010-R02:** Use explicit primary identifiers, legal entity, institution scope, creation version, source provenance, effective dates and audit record references.
3. **ARC-010-R03:** Model exact currency and monetary units using a deterministic representation; enforce referential integrity for journals, lines and approved chart mappings.
4. **ARC-010-R04:** Maintain immutable posted journal and correction reference chain; never delete or overwrite posting history to change an account balance.
5. **ARC-010-R05:** Use versioned configuration for products, fees, rates and regulatory reporting rules with reviewed effective intervals.
6. **ARC-010-R06:** Separate sensitive customer data from audit/event payloads where possible; enforce retention, access logging, encryption and deletion restrictions under applicable legal profile.
7. **ARC-010-R07:** Define outbox/inbox tables and projection checkpoints so eventual-consistency read stores are rebuildable and traceable to source commits.
8. **ARC-010-R08:** Reconcile data migrations with source/target record counts, balance totals, exception inventory, dual approval and signed rollback/correction plan.
9. **ARC-010-R09:** Establish data-quality controls for duplicate customers, orphaned account references, late messages, inconsistent dates and mismatched accounting partitions.
10. **ARC-010-R10:** Document backup, restore, archival and data-sovereignty requirements for institution signoff before choosing a DB/hosting product.

## Required acceptance artifacts
- Conceptual data ownership and classification matrix
- Migration reconciliation and lineage checklist
- Data lifecycle acceptance scenarios

## Acceptance scenarios — PLANNED, NOT RUN
- [ ] AC-1: Journal and line conservation under migration
- [ ] AC-2: No cross-tenant data exposure
- [ ] AC-3: Regulatory history reproducible by effective date

## Open evidence and approval gaps
- First institution's data-protection, retention and infrastructure acceptance pending

## Delivery classification
Design document completed and uploaded; WP acceptance remains open. Production code: 0; tests executed: 0; regulatory approval claimed: 0. Accounting mapping 312/322 and external rail entitlements remain P0-gated.
