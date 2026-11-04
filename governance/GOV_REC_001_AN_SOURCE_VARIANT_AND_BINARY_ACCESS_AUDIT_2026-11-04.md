# GOV-REC-001 — AN source-variant and binary-access audit
Date: 2026-11-04. Status: INTERIM EVIDENCE; registered GOV-REC-001 remains IN_PROGRESS. No WP acceptance or numbered batch 181 delivery.

## Canonical state checked
GitHub main HEAD at start: `0bab9a6e60ae1e32c73b7969544c15b0440f26c3`. Read `governance/CANONICAL_PROGRAMME_STATE.json` and active `MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.2_2026-11-04.md`: batch 180 last draft evidence delivery; WBS denominator UNKNOWN; GOV-REC-001 active; WP-ACC-005 P0 BLOCKED.

## Remote AN archive and binary-access outcome
The remote archive is already present at `regulatory/recovery/archives/OPES_Core_Banking_Checkpoint_AN_2026-10-09.zip` (Git blob `f32ffba2476df66f839deec722adaf063d697bbf`, previously observed size 589143). The GitHub text-only fetch endpoint rejects the binary contents with HTTP 400 / non-UTF-8, and the connector blob fetch raises UnicodeDecodeError. A direct container HTTPS retrieval of raw.githubusercontent.com failed with ConnectionError; sandbox download also could not obtain the bytes. Therefore the actual archive SHA-256, ZIP CRC, nested AM integrity and custody remain NOT INDEPENDENTLY VERIFIED. Do not infer them from Git SHA-1 or the builder's expected hash.

## Exact source-variant reconciliation
Compared both GitHub directories using direct file reads: `regulatory/checkpoints/AN/` versus `regulatory/recovery/source/AN/`.

| File | Difference established | Interpretation |
|---|---|---|
| README.md | Different substantive text: checkpoints README records phase, inherited WP and blocked states; recovery README is a short archive description | NOT interchangeable; retain both with provenance |
| ACCEPTANCE_TESTS.json | Checkpoint version has exactly one additional trailing LF; otherwise byte-equivalent text after trimEnd | Formatting-only difference; Git blob identities differ |
| CONTINUATION_STATE.json | Exactly one trailing LF difference | Formatting-only difference |
| REQUIREMENTS.json | Checkpoint version has a literal en dash in `Article 23–26`; recovery source encodes the same character as JSON `\\u2013`, and lacks terminal LF | Semantic text equivalent for this field, binary source NOT identical |
| SOURCE_REGISTER.json | Exactly one trailing LF difference | Formatting-only difference |
| QUALITY_REVIEW.md, GAP_UPDATE.md, EVIDENCE_REQUEST_PLAN.md | Previous Git tree comparison found matching blob identities | No change claimed here |

Recovery-source `SHA256SUMS.txt` is present, Git blob `2466a5670fc1431ff54032d9d45f7d964adda38b`; it lists nine entries including nested AM ZIP. `tools/recovery/build_checkpoint_an.py` is present, Git blob `5574b15b09da973ab67a12874f24025eda033791`, and claims expected AN SHA-256 `9ee3193e10f9e00f125f9cb29161563278ab5fa8698461bc6cbfcffeebbb44c5` and AM SHA-256 `9d15b534696a3edc9eca4dd131b1b7c6f751c6820e571827f4f748df4a598e93`. These are unexecuted claims in this audit, not observed digest results.

## Review and gates
Regulatory: no authenticated 312/322 resolution; fail closed. Financial: no account mapping, journal posting or balance mutation authorized. Architecture: preserve both source variants and archive provenance. Security: do not trust unverified archive bytes. Audit: Git blob IDs and exact differences recorded. Operations: binary retrieval unavailable, not a proof of archive corruption. Tests: no banking tests executed; no ZIP CRC test executed. Acceptance: no independently accepted WP, no DoR pass, no new ZIP 181.

## NEXT EXACT TASK
GOV-REC-001 / batch 181: obtain remote AN ZIP bytes through an authenticated binary-capable GitHub transport, compute SHA-256 and ZIP CRC, enumerate ten expected entries including nested AM, compare SHA256SUMS and both source variants, then document archive custody/lineage. Continue independent historical evidence acquisition while transport is unavailable; WP-ACC-005 remains P0 BLOCKED.
