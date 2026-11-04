# GOV-REC-001 — AN archive independent SHA-256 verification
Date: 2026-11-04. Evidence status: PARTIAL VERIFIED. Work package: IN_PROGRESS. Batch 181: NOT DELIVERED.

## Acquisition and verification
Fetched `regulatory/recovery/archives/OPES_Core_Banking_Checkpoint_AN_2026-10-09.zip` from GitHub's contents connector with explicit `encoding=base64`, using the `exerateanalytical` authenticated account. The connector returned Git blob `f32ffba2476df66f839deec722adaf063d697bbf`. Independently decoded the Base64 in the execution runtime into a byte array and computed SHA-256 over **the entire decoded byte sequence** using a locally implemented SHA-256 compression routine (64 SHA-256 constants derived from prime cube roots, eight initial constants derived from prime square roots, standard 512-bit padding and 64 rounds). This is a calculation on fetched bytes, not a copy of the reconstruction script's expected digest.

- Actual decoded bytes: **589143**
- Independently calculated archive SHA-256: **9ee3193e10f9e00f125f9cb29161563278ab5fa8698461bc6cbfcffeebbb44c5**
- Expected SHA-256 previously stated by the repository's reconstruction script: **9ee3193e10f9e00f125f9cb29161563278ab5fa8698461bc6cbfcffeebbb44c5**
- SHA-256 comparison: **MATCH**.
- Git blob identity returned by GitHub: `f32ffba2476df66f839deec722adaf063d697bbf`.

## Assurance boundary
This proves consistency of the fetched archive bytes with the expected reconstruction digest. It **does not** prove that the archive was originally produced on 9 October, that its entries decompress correctly, that embedded CRC32 values match recomputed CRC32, that the nested AM archive is intact, that both source directories are semantically identical, or that any historical work package was accepted. The prior central-directory inventory lists ten entries but their contents have not yet been independently inflated. GitHub blob SHA is distinct from SHA-256.

## Risk and quality disposition
Regulatory/legal: original custody and primary-source authenticity unresolved. Financial: WP-ACC-005 disputed 312/322 mapping remains P0 BLOCKED. Architecture: no implementation authorized. Security/audit: record the verified digest and immutable remote blob. Testing: this run performed a byte-level SHA-256 computation, **not banking tests, decompression tests or regulatory certification**. Programme WBS denominator UNKNOWN. DoR not satisfied.

## NEXT EXACT TASK
GOV-REC-001 / batch 181: independently DEFLATE-decompress all ten AN ZIP entries, recompute each CRC32 and SHA-256, validate the nested AM ZIP, compare extracted bytes with both historical AN source directories and `SHA256SUMS.txt`, then assess custody/provenance. Do not close GOV-REC-001 or count batch 181 delivered until its complete acceptance and distinct ZIP delivery requirements are met.
