# GOV-REC-001 — AN outer checksum register coverage audit
Date: 2026-11-04. Status: INTERIM EVIDENCE; GOV-REC-001 IN_PROGRESS; batch 181 NOT DELIVERED.

## Direct inspection
Starting main commit: f95d214057d56a5a23d7c8602f52bb697d3be343.
The canonical programme state records latest archive batch 180, historical WBS denominator UNKNOWN, GOV-REC-001 IN_PROGRESS, and WP-ACC-005 P0.
The file regulatory/recovery/archives/SHA256SUMS.txt contains nine SHA-256 lines covering AE through AM, but **no AN entry**. The same archives directory contains AE through AN ZIPs.
Prior independent AN digest record: 589143 bytes; SHA-256 9ee3193e10f9e00f125f9cb29161563278ab5fa8698461bc6cbfcffeebbb44c5, matching the reconstruction-script expectation.

## Material finding
The outer checksum register does not independently anchor AN. The matching AN digest establishes byte identity against a recorded reconstruction expectation, not historical creation date or original custody. The AN-embedded SHA256SUMS.txt is a separate, still unextracted ZIP entry. Do not conflate it with the outer register. The recovery manifest records original_bytes_recovered=false for AN. Preserve reconstructed-versus-original provenance; do not label the recovered archive an authenticated 9 October original.

## Assurance and quality gates
Full DEFLATE decompression of ten AN entries, independently recomputed CRC32, embedded checksums, nested AM ZIP integrity and both source-directory comparisons remain OPEN. The nine earlier checksum lines were not recomputed in this run. No banking tests, production code, regulatory certification or WP acceptance occurred. WP-ACC-005 disputed 312/322 accounting mapping remains P0 BLOCKED; no implementation authorized. The WBS denominator remains UNKNOWN. This document is an interim evidence commit, not a numbered ZIP checkpoint.

## NEXT EXACT TASK
GOV-REC-001 / batch 181: retrieve AN binary into a DEFLATE-capable runtime; decompress all ten entries under bounded resource limits, recompute CRC32 and SHA-256, validate embedded SHA256SUMS.txt and nested AM ZIP, compare extracted bytes against both historical source directories, and document original-versus-reconstructed custody. Do not close the work package or unblock accounting without evidence.
