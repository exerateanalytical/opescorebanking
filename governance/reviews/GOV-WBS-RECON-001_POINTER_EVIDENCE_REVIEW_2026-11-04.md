# GOV-WBS-RECON-001 — canonical pointer and evidence classification review
Date: 2026-11-04
Status: IN_PROGRESS; independent acceptance OPEN
Verified read baseline: main 9d6b79537c2b389e4d6f0f3280943832d21eee2e (compare with main: identical).

## Verified source observations
- governance/CANONICAL_PROGRAMME_STATE.json declares 150 historical WP directories, 120 original contracts, 30 missing original contracts, 59 historical checkpoint directories and recovery paths through batch 209.
- governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.3_2026-11-04.md reports 1,294 tracked files, 1,073 text files, 221 ZIP inspections, 146 failed original ZIPs, and 146 reconstructed representations. These are assertions in a committed audit, not independently re-executed archive tests in this review.
- v0.2 recovery register still says NEXT EXACT TASK batch 181; that is a superseded historical instruction, not a current execution target.
- CANONICAL_PROGRAMME_STATE.json next_action prioritizes WP-ACC-005 and product-contract acceptance but fails to identify the single critical-path GOV-WBS-RECON-001 task. A machine-readable latest accepted checkpoint ID is absent.
- No authoritative evidence in the inspected documents upgrades recovered batch 209 to independently accepted work-package completion; batch 210 remains unverified.

## Control decision
Do not rewrite historical v0.2/v0.3 or the original checkpoint artifacts. Do not increment batch numbering, report 150 WPs completed, or approve any financial implementation. Preserve 15 DoR gates and P0 WP-ACC-005. This review is a reconciliation note, not a completed checkpoint or independent regulatory validation.

## Proposed canonical-state schema correction (requires review before mutation)
Add distinct fields: remote_head_sha, last_observed_delivery_batch_id, last_integrity_verified_batch_id, last_independently_accepted_wp_id (nullable), original_archive_custody_status, approved_wbs_denominator (nullable), next_exact_task_id, and evidence_as_of_commit. Do not conflate observed file presence with verified custody or independent acceptance.

## Required crosswalk columns
source_path; git_blob_sha; observed_commit_sha; batch_id; historical_checkpoint_id; work_package_id; source_kind (ORIGINAL/DERIVED/RECONSTRUCTED); archive_crc_status; independent_acceptance_status; dependency_ids; regulatory_provenance; reviewer; review_evidence_path; conflict_notes.
No source without independently verified provenance may be promoted to ORIGINAL_VERIFIED.

## Acceptance checks before closing GOV-WBS-RECON-001
1. Pin a fresh HEAD and enumerate full tree with blob IDs; validate counts directly.
2. Compare batch 209 and any batch 210 artifacts against registered scope, ZIP manifests and exact byte hashes.
3. Recompute checksums on original and reconstructed archives independently.
4. Build exhaustive historical source-to-WP crosswalk; resolve duplicate/overlap ownership including ACT-001 vs PRD.
5. Obtain independent architecture/audit acceptance; only then approve denominator and canonical pointer.

## Open risk / next exact task
GOV-WBS-RECON-001: enumerate and verify actual remote file tree and batch-209/210 artifacts at pinned HEAD; reconcile original-vs-derived custody, then produce evidence-backed crosswalk. Do not begin dependent implementation.
