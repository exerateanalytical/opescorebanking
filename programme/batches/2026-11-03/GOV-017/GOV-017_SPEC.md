# GOV-017 — Historical archive provenance and binary custody programme

OPES Core Banking | 2026-11-03 | Batch 17/30 | Status: DRAFT DELIVERED; INDEPENDENT REVIEW OPEN
Source context: governance/PROGRAMME_RECOVERY_BASELINE_2026-11-03.md; governance/LOCAL_ARTIFACT_RECOVERY_INVENTORY_2026-11-03.md; governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.1_2026-11-03.md; regulatory/checkpoints/CT/README.md. Source claims distinguished from proposed design requirements.

## Proposed operational requirements
1. **GOV-017-R01:** Inventory actual archive objects independently of manifests, filenames or historical prose asserting files were or were not uploaded.
2. **GOV-017-R02:** Preserve source path, byte size, Git blob SHA, optional independently computed SHA-256, purported creation date, uploader, source conversation and parent checkpoint.
3. **GOV-017-R03:** Existing repository paths under regulatory/recovery/archives must be compared with governance/LOCAL_ARTIFACT_RECOVERY_INVENTORY_2026-11-03.md rather than accepting older upload claims.
4. **GOV-017-R04:** Treat cumulative ZIPs and nested layers as possible duplicates or supersets; compare normalized per-entry path and content digest before merging.
5. **GOV-017-R05:** Reject ZIP slip paths, absolute paths, symlink escapes, decompression bombs and executable scripts before archive extraction.
6. **GOV-017-R06:** Maintain raw historical bytes as immutable evidence; extracted code or documents belong in a separately reviewed canonical tree.
7. **GOV-017-R07:** Distinguish available in remote Git, local-only, named-but-not-found and content-unverified statuses; file existence is not source completeness.
8. **GOV-017-R08:** Generate an archive reconciliation report with exact evidence counts, inaccessible artifacts and unmatched checksums; never infer missing source from an empty search result.

## Deliverables for review
- Archive custody schema and validation checklist
- Historical inventory conflict log
- Safe archive extraction protocol

## Acceptance criteria — NOT YET PASSED
- [ ] AC-1: Remote binary verified from its own blob bytes
- [ ] AC-2: Hash claims only when computed
- [ ] AC-3: No presumed equivalence from matching filenames

## Open evidence and next reviewers
- Complete historical local-vs-remote archive byte comparison not executed

## Quality declaration
This document is a substantive first-pass design artifact, not reviewed production policy. Work-package status remains pending acceptance. Executed tests: 0. Code introduced: 0. Certification/approval claimed: none. Keep unresolved P0-dependent functions disabled.
