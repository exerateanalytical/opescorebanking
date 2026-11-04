# GOV-REC-001 — AN archive existence reconciliation (2026-11-04)

Status: INTERIM EVIDENCE; no independent WP acceptance and no new numbered batch delivery.

## Material correction to prior reports
The earlier conclusion that the AN cumulative archive was absent from the repository is contradicted by the current remote Git tree at main commit `d5fb320e20db10c53335b539d2f58b3534ca0268`. The path `regulatory/recovery/archives/OPES_Core_Banking_Checkpoint_AN_2026-10-09.zip` EXISTS as a Git blob (blob SHA-1 `f32ffba2476df66f839deec722adaf063d697bbf`, size 589143 bytes). GitHub's path-filtered commit history attributes the archive to commit `419d83826457fc1ed7614fcebf1040260d368033` dated 2026-11-03 07:58:42 UTC, message `archive(regulatory): restore byte-exact original checkpoint AN`. Therefore **ARCHIVE_PRESENT_IN_REMOTE** is established. Earlier archive-absence findings are superseded on existence only.

## Reconstruction claims requiring independent verification
`tools/recovery/build_checkpoint_an.py` claims expected AN SHA-256 `9ee3193e10f9e00f125f9cb29161563278ab5fa8698461bc6cbfcffeebbb44c5`; its expected nested AM SHA-256 is `9d15b534696a3edc9eca4dd131b1b7c6f751c6820e571827f4f748df4a598e93`. The script verifies the source checksums and nested predecessor and checks byte-exact output against the expected AN hash. This is a reproducible *claim in repository code*, not an independent rehash in this review.

Git tree also contains `regulatory/recovery/source/AN/` with nine source files including `SHA256SUMS.txt`. The separate `regulatory/checkpoints/AN/` eight extracted files are **not byte-identical in every case** to the recovery source: README, ACCEPTANCE_TESTS, CONTINUATION_STATE, REQUIREMENTS and SOURCE_REGISTER have differing Git blob SHAs; QUALITY_REVIEW, GAP_UPDATE and EVIDENCE_REQUEST_PLAN share matching Git blob SHAs. Treat differences as source variants pending line-by-line reconciliation; do not silently equate them.

## Acceptance disposition
- Remote existence and archive path: VERIFIED by GitHub tree and commit history.
- Archive binary SHA-256, ZIP entry integrity, nested AM byte equality: NOT INDEPENDENTLY REEXECUTED in this run. Git blob SHA is not a substitute for ZIP SHA-256.
- Original artifact custody / original-versus-reconstructed provenance: NOT VERIFIED. A reproducible byte-identical reconstruction does not alone establish original acquisition chain.
- Regulatory authority, WP-ACC-004 acceptance, WP-ACC-005 312/322 correction, GIMAC institutional entitlement: NOT VERIFIED; WP-ACC-005 remains BLOCKED_P0.
- Production implementation DoR: FAIL. Banking tests executed: zero. Verified accepted work packages this run: zero.
- Historical programme denominator: UNKNOWN. Numbered batch 181 remains open; no ZIP 181 delivered.

## Next exact task
GOV-REC-001 / batch 181: independently download/read the remote AN ZIP bytes through a binary-capable authenticated route; calculate SHA-256, run ZIP CRC/integrity checks, enumerate entries and nested AM archive, compare against `SHA256SUMS.txt` and both AN source directories, and record an evidence-backed provenance verdict. Do not equate the archive's Git presence with independent archive validation or financial/regulatory readiness.
