# GOV-016 — Historical checkpoint lineage and evidence crosswalk

OPES Core Banking | 2026-11-03 | Batch 16/30 | Status: DRAFT DELIVERED; INDEPENDENT REVIEW OPEN
Inspected context: governance/PROGRAMME_RECOVERY_BASELINE_2026-11-03.md; governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.1_2026-11-03.md; regulatory/checkpoints/AN/README.md; regulatory/checkpoints/BA/README.md; regulatory/checkpoints/BP/README.md; regulatory/checkpoints/CA/README.md; regulatory/checkpoints/CP/README.md; regulatory/checkpoints/CT/README.md.

## Scope, findings and proposed control requirements
1. **GOV-016-R01:** Current inspected GitHub tree contains 59 checkpoint README paths in the visible AN–CT sequence; these represent recorded documents, not 59 accepted work packages.
2. **GOV-016-R02:** AN continuation identifies WP-ACC-004 as inherited last complete, WP-ACC-005 OPEN/BLOCKED, and WP-PAY-GIMAC-001 OPEN/NOT ATTEMPTED; inherited complete claim remains unverified.
3. **GOV-016-R03:** Checkpoint BA documents securities-accounting issuer research and P0 conflict retention; no production implementation or tests were claimed.
4. **GOV-016-R04:** Checkpoint BP documents BEAC 2025 ISO 20022 instruction and circular examination, negative scenarios as specifications only, and missing participant evidence.
5. **GOV-016-R05:** Checkpoint CA records explicit migration calendar chronology conflicts and distinguishes message/profile conformance from actual settlement and entitlement.
6. **GOV-016-R06:** Checkpoint CP documents issuer-hosted image inspection of COBAC I-2015/01 printed Article 8(d) 312 parent versus 322 child codes; this is not a signed correction.
7. **GOV-016-R07:** Checkpoint CT states Bulletin COBAC 6 page analysis not yet completed and requests signed post-2015 authority; next historical continuation CU remains independent of new proposed governance batches.
8. **GOV-016-R08:** Maintain per-checkpoint path, predecessor, historic phase/WP identifiers, claims of completion, source evidence level, Git lineage and explicit duplicate/revised-status flags.

## Deliverables to be accepted
- Historical checkpoint sample crosswalk AN/BA/BP/CA/CP/CT
- 59-README coverage statement (not full 317-file audit)
- Lineage review backlog

## Acceptance criteria — NOT YET PASSED
- [ ] AC-1: Do not equate checkpoint to WP completion
- [ ] AC-2: Carry P0 forward unmodified
- [ ] AC-3: Uninspected checkpoint files remain UNKNOWN

## Outstanding evidence
- Full 317-file content extraction and complete commit ancestry still outstanding

## Review statement
This is documentary progress, not production code or regulated acceptance. Tests actually executed in this batch: 0. No new legal assertion independently reverified against primary PDFs in this batch. Accounting and payments remain fail-closed at their P0 gates.
