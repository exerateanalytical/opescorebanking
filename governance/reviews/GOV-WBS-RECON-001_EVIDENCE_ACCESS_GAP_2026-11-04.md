# GOV-WBS-RECON-001 — Evidence-access checkpoint (2026-11-04)
Status: IN_PROGRESS; NOT INDEPENDENTLY ACCEPTED; NOT AN ENGINEERING BATCH COMPLETION.
Owner: OPESWARE TECHNOLOGIES. Required reviewers: independent programme auditor and architecture lead.
Pinned remote: main a19fa05f9ba300bcc6a38d4b98a509e1d073cd7c (GitHub compare against main returned identical, ahead 0).
Predecessor: governance/reviews/GOV-WBS-RECON-001_POINTER_EVIDENCE_REVIEW_2026-11-04.md.

## Actual read evidence and provenance
1. Fetched governance/CANONICAL_PROGRAMME_STATE.json, blob 0012c7394650eab015b3a1fe08f466e88e12fbd1. It *asserts* recovery paths through batch 209, original archive custody NOT_VERIFIED, 150 historical engineering WP directories, 120 original contracts and 30 absent contracts. These are recorded audit assertions, not re-enumerated tree counts in this checkpoint.
2. Fetched governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.3_2026-11-04.md, blob 0bd56eedd37ada3bb8587fd4328b83df854a822b. Its 1,294-file, 221-ZIP, 146-corrupt-original and 146-reconstruction totals are prior audit claims; no byte-level archive rerun occurred here.
3. Fetched historical v0.2 register, blob 7c2fbcff5dc3b23632ae568bff05aed280866fac. Its batch-181 NEXT TASK is superseded by later observed recovery paths; preserve it as historical evidence, not active instruction.
4. Fetched predecessor pointer review, blob 5f0be85674dbdc16ffc869e32f387bb2b9d94ac3. Its acceptance checklist remains open.
5. GitHub code search for literal 'batch 209', 'batch 210' and 'GOV-WBS-RECON-001' returned zero results; this is NOT evidence of file absence. Available GitHub connector operations in this run did not expose a recursive tree listing or binary archive download. The execution container could not resolve github.com, so git clone/ls-remote and original ZIP hash recomputation were unavailable.

## Provenance classification and fail-closed decision
- Observed canonical metadata: REPOSITORY_TEXT_OBSERVED (content and Git blob SHA confirmed).
- Original 209 ZIP bytes and manifest: NOT_INSPECTED; neither existence nor integrity asserted.
- Batch 210 ZIP bytes and manifest: NOT_INSPECTED; neither existence nor integrity asserted.
- Original historical ZIPs: ORIGINAL_CUSTODY_UNVERIFIED; prior reported CRC failures must not be re-labelled as repaired originals.
- Reconstructed ZIPs: DERIVED_RECONSTRUCTION (must link source blob IDs, original paths, reconstruction algorithm, byte SHA-256 and reviewer).
- Independently accepted WP count / approved WBS denominator: UNKNOWN.
- WP-ACC-005 PCEC 312/322: BLOCKED_P0; no executable disputed mapping.
- WP-PAY-GIMAC-001: NOT_AUTHORIZED; no assumed rail access or settlement finality.
- Production implementation DoR: NOT_VERIFIED; no production banking tests executed.

## Required artifact-to-WP crosswalk (schema; NOT fabricated rows)
Each row MUST include: source_path, source_blob_sha, observed_commit_sha, batch_id, historical_checkpoint_id, wp_id, source_kind [ORIGINAL|DERIVED|RECONSTRUCTED|UNKNOWN], original_archive_sha256, reconstructed_archive_sha256, archive_crc_result, manifest_sha256, dependency_ids, regulatory_source_url, regulatory_effective_date, reviewer, independent_acceptance_evidence, conflict_notes.
An UNKNOWN field must stay null. File presence alone cannot imply WP closure.

## Unresolved verification tasks (dependency ordered)
A. Obtain recursive Git tree for pinned SHA with path/blob/mode, record complete inventory and hash of sorted path list.
B. Identify actual batch-209 and batch-210 paths from that tree; fetch each manifest and original archive bytes (binary-capable authenticated transport); recompute SHA-256 and ZIP CRC; compare to recorded manifests.
C. Reconcile original-vs-derived custody and duplicate domain ownership, including ACT-001 versus PRD, across all historical WP paths.
D. Produce exhaustive evidence-backed crosswalk and submit for independent architecture/audit acceptance. Only after approval establish WBS denominator and exact remaining count.

## Execution and QA
Registered WP attempted: 1 (GOV-WBS-RECON-001). Verified WP completions: 0. Kept open: 1. New blockers: 0; inherited blockers persist. This file is a durable evidence-access checkpoint, not a completed batch, no ZIP is justified. No production code, banking tests, legal interpretations or financial mappings changed.
NEXT EXACT TASK: GOV-WBS-RECON-001/A — acquire full recursive Git tree at a fresh pinned main SHA with blob identities; then identify batch-209/210 exact paths before requesting original archive bytes.
