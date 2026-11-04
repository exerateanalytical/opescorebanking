# GOV-REC-001 — AN binary retrieval and ZIP central-directory verification
Date: 2026-11-04. Status: INTERIM EVIDENCE; GOV-REC-001 IN_PROGRESS; no WP acceptance and no numbered batch 181 completion.

## Retrieval improvement
GitHub connector fetch_file with encoding=base64 successfully returned the remote binary archive at `regulatory/recovery/archives/OPES_Core_Banking_Checkpoint_AN_2026-10-09.zip`. Previous reports asserting no binary-capable connector route are superseded for this particular retrieval. GitHub blob SHA: `f32ffba2476df66f839deec722adaf063d697bbf`. Decoded byte length: **589143**. Base64 decoded in an isolated JavaScript execution and parsed as bytes, not as UTF-8 text.

## Observed ZIP metadata
The ZIP end-of-central-directory signature was located at byte offset **589121**. The central directory parses as **10 entries**. Each uses ZIP compression method 8 (DEFLATE). Names, stored CRC32 and uncompressed byte counts:

| Entry | Central-directory CRC32 | Uncompressed bytes |
|---|---|---:|
| README.md | 41e928e4 | 159 |
| SOURCE_REGISTER.json | a7ce6308 | 1216 |
| REQUIREMENTS.json | 7c6738b8 | 1117 |
| ACCEPTANCE_TESTS.json | bb615998 | 878 |
| QUALITY_REVIEW.md | 12f258b8 | 1388 |
| CONTINUATION_STATE.json | 7ef3e332 | 821 |
| GAP_UPDATE.md | 09615fe4 | 256 |
| EVIDENCE_REQUEST_PLAN.md | 34771bd7 | 445 |
| prior_checkpoint_AM.zip | d1848071 | 584358 |
| SHA256SUMS.txt | be33908c | 770 |

This is a real binary ZIP directory parsing result, **not** a decompression/CRC integrity test. The CRC32 values are ZIP metadata only, not independently recomputed over decompressed entries. Nested AM bytes have not been independently decompressed or validated. The expected AN SHA-256 `9ee3193e10f9e00f125f9cb29161563278ab5fa8698461bc6cbfcffeebbb44c5` remains a builder claim, not an independently observed hash.

## Reconciliation / quality gates
- Historical source variants remain documented in `governance/GOV_REC_001_AN_SOURCE_VARIANT_AND_BINARY_ACCESS_AUDIT_2026-11-04.md`. README divergence is substantive; preserve both variants.
- This audit establishes remote ZIP presence, binary retrieval, length and directory inventory. It does **not** establish original-versus-reconstructed custody, nested archive integrity, source content equivalence or historical acceptance.
- WP-ACC-005 (312/322 accounting classification) remains P0 BLOCKED. No production ledger mapping, financial posting, settlement or regulator compliance is authorized.
- The canonical WBS denominator remains UNKNOWN; documentation archive batches 1–180 remain draft evidence, not accepted work packages. No banking tests or production implementation were executed.

## NEXT EXACT TASK
GOV-REC-001 / batch 181: independently compute SHA-256 over the retrieved AN bytes; decompress all ten entries and recompute CRC32; validate nested AM ZIP and SHA256SUMS; reconcile extracted entry bytes with both historical source directories and establish archive provenance. Only then decide whether the provenance checkpoint can close. Preserve WP-ACC-005 P0 fail-closed.
