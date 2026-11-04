# GOV-REC-001 — AN original-archive provenance and acceptance gate
Date: 2026-11-04. Status: IN_PROGRESS / historical evidence, not accepted WP or delivered numbered batch.

## Evidence examined
- `regulatory/checkpoints/AN/README.md` blob `84f1f3b545877579b30335781b8dbdcd93c2f2a7`: explicitly states complete cumulative historical ZIPs have not been uploaded to repository.
- `regulatory/checkpoints/AN/CONTINUATION_STATE.json` blob `e5e10140d795daecd760a170216c5128f50e22e1`: claims predecessor AM, WP-ACC-004 inherited complete, WP-ACC-005 open/blocked, six unspecified here tests not executed, zero code and Definition of Ready FAIL.
- `governance/GOV_REC_001_AN_EIGHT_BLOB_AUDIT_2026-11-04.md` blob `577876b6c3e01a9ced0878d0f6e395f0fde0d642`: enumerates eight extracted AN source blobs; explicitly does not establish cumulative archive authenticity.

## Acceptance criteria for recovery of the *original* AN ZIP
1. Obtain original binary ZIP bytes and acquisition metadata (source, acquisition timestamp, custodian, original filename). An archive newly reconstructed from eight extracted files MUST NOT be represented as the original cumulative ZIP.
2. Compute ZIP SHA-256 and byte length independently, store them with provenance; record ZIP entry names, compressed/uncompressed sizes, CRC32 and archive test results. CRC32 detects accidental corruption but is not authenticity evidence.
3. Compare extracted file bytes against the eight GitHub blob contents; document each match/mismatch and any additional cumulative contents, preserving unknown files.
4. Verify chronology: original AM source/commit and AN successor evidence, without treating checkpoint names or self-declared `previous` fields as proof of ancestry.
5. Distinguish the recovered artifact's existence from regulatory authenticity, accounting readiness and accepted work-package closure. Require independent reviewers and sign-off records.
6. If no original archive exists, preserve status ORIGINAL_ARCHIVE_NOT_VERIFIED; retain the eight sources as partial reconstruction evidence only.
7. For any *new* numbered batch, create a distinct ZIP containing actual new deliverables, manifest, per-entry SHA-256, evidence provenance and continuation state; push binary ZIP plus extracted sources; independently retrieve remote ZIP bytes and verify SHA-256 before declaring delivery.

## P0 controls and unresolved external evidence
WP-ACC-005 remains BLOCKED_P0. No executable mapping of disputed PCEC 312/322; no customer balance mutation, settlement, rail participation or financial reporting derived from disputed account classes. Issuer-authenticated Regulation 02/25 including printed page 10, separate certified judicial dispositions for 01/25 and 02/25, original COBAC–MINFI correspondence, and institution-specific approved PCEC/settlement requirements are outstanding. The repository's own source records do not prove any of these have been obtained. No assertion of regulatory interpretation is made by this procedure.

## Review / disposition
Financial integrity: fail closed. Regulatory provenance: insufficient. Security and audit: immutable blob references available, original archive provenance missing. Testing: no banking tests run in this review. Implementation DoR: FAIL. Historical WP denominator: UNKNOWN pending approved, reconciled WBS. No batch 181 ZIP delivered; no accepted WP completion. This document is an interim audit-control deliverable only.

## NEXT EXACT TASK
GOV-REC-001 / batch 181: locate the original AN ZIP through accessible project attachments/library or a verified repository object, compare original bytes and entry inventory against the eight recovered GitHub blobs, and record an explicit ORIGINAL_ARCHIVE_VERIFIED or ORIGINAL_ARCHIVE_NOT_VERIFIED disposition. Do not advance dependent accounting implementation.
