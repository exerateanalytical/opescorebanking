# Local artifact recovery inventory — 2026-11-03
Status: PARTIAL / NOT A COMPLETE BACKUP
Source: current working container /mnt/data. File names, byte lengths and SHA-256 prefixes computed from local bytes. These files are NOT uploaded by this manifest; a manifest is not a substitute for source bytes.

| Artifact | Bytes | SHA-256 prefix |
|---|---:|---|
| OPES_Core_Banking_Checkpoint_AE_2026-10-09.zip | 546061 | 4ac19ba584f09bed |
| OPES_Core_Banking_Checkpoint_AF_2026-10-09.zip | 551363 | 93142a5d5f43fd33 |
| OPES_Core_Banking_Checkpoint_AG_2026-10-09.zip | 556408 | 2dc66f7ac1cd8570 |
| OPES_Core_Banking_Checkpoint_AH_2026-10-09.zip | 561357 | 4ee6565bf4fa0714 |
| OPES_Core_Banking_Checkpoint_AI_2026-10-09.zip | 565959 | 3f2489488610939b |
| OPES_Core_Banking_Checkpoint_AJ_2026-10-09.zip | 571166 | 9f7d2b81325d3eba |
| OPES_Core_Banking_Checkpoint_AK_2026-10-09.zip | 575544 | 9f3d15833635b145 |
| OPES_Core_Banking_Checkpoint_AL_2026-10-09.zip | 579859 | f396b94e123c7b81 |
| OPES_Core_Banking_Checkpoint_AM_2026-10-09.zip | 584358 | 9d15b534696a3edc |
| OPES_Core_Banking_Checkpoint_AN_2026-10-09.zip | 589143 | 9ee3193e10f9e00f |
| OPES_Core_Banking_Research_Delta_2026-11-01_R01.zip | 9247 | 5ff903be73e0d0d9 |
| OPES_Core_Banking_Consolidated_Research_2026-11-01.docx | 68498 | 6e54583233168e6a |
| OPES_Core_Banking_Consolidated_Research_2026-11-01.pdf | 369271 | bb81e5b38089a64a |
| OPES_Core_Banking_Available_Batches_Consolidated_2026-11-03.zip | 5939492 | 733298994715ddba |

## Verification and limits
- Connected GitHub repository exerateanalytical/opescorebanking is private, main branch.
- regulatory/checkpoints/AN/README.md was fetched and already exists; it explicitly says cumulative ZIPs are not uploaded.
- Direct git ls-remote from local container failed because github.com DNS resolution was unavailable.
- Connected GitHub text-file API can write this inventory but does not constitute a bulk binary archive upload.
- Cross-chat inventory, full Git history, code completeness, and per-file equivalence of these archives against GitHub have NOT been audited.
- No assertion that all historical work was pushed, or that production code is present.
## Next action
Transfer the actual 14 artifact files through a binary-capable authenticated Git environment; check archive nesting and SHA-256, compare with canonical repository, deduplicate, preserve originals, then push and independently verify remote hashes. Do not overwrite concurrent updates.
