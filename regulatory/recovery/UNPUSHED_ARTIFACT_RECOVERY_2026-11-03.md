# OPES Core Banking — Unpushed Artifact Recovery Record

Recovery date: 2026-11-03
Repository: exerateanalytical/opescorebanking
Purpose: preserve exact known provenance for OPES Core Banking artifacts whose original binary bytes are not currently recoverable from the active ChatGPT Project/Library/runtime surfaces.

## Important status

This record is **not** a substitute for the missing binaries. Do not rename, repackage, or treat this file as proof that the listed artifacts were uploaded.

The active recovery search checked:
- current Banking project conversation files;
- ChatGPT Library title/name search;
- local runtime `/mnt/data`;
- prior Banking conversation context;
- GitHub default-branch search and known historical commits.

No recoverable raw bytes or reusable attachment/file IDs were found for the 14 target artifacts in the active environment.

## Checkpoint archives generated 2026-10-09

The prior local verification inventory committed at `e8b9b10cf1bc3fcd60ad54bd789964994851a1a1` recorded the following exact byte sizes and SHA-256 prefixes. The original ZIP bytes were explicitly **not uploaded**.

| Artifact | Exact bytes | SHA-256 prefix | Recovery status |
|---|---:|---|---|
| OPES_Core_Banking_Checkpoint_AE_2026-10-09.zip | 546061 | 4ac19ba584f09bed | Original sandbox path was /mnt/data/OPES_Core_Banking_Checkpoint_AE_2026-10-09.zip; bytes unavailable in current runtime |
| OPES_Core_Banking_Checkpoint_AF_2026-10-09.zip | 551363 | 93142a5d5f43fd33 | Original sandbox path known; bytes unavailable |
| OPES_Core_Banking_Checkpoint_AG_2026-10-09.zip | 556408 | 2dc66f7ac1cd8570 | Original sandbox path known; bytes unavailable |
| OPES_Core_Banking_Checkpoint_AH_2026-10-09.zip | 561357 | 4ee6565bf4fa0714 | Original sandbox path known; bytes unavailable |
| OPES_Core_Banking_Checkpoint_AI_2026-10-09.zip | 565959 | 3f2489488610939b | Original sandbox path known; bytes unavailable |
| OPES_Core_Banking_Checkpoint_AJ_2026-10-09.zip | 571166 | 9f7d2b81325d3eba | Original sandbox path known; bytes unavailable |
| OPES_Core_Banking_Checkpoint_AK_2026-10-09.zip | 575544 | 9f3d15833635b145 | Original sandbox path known; bytes unavailable |
| OPES_Core_Banking_Checkpoint_AL_2026-10-09.zip | 579859 | f396b94e123c7b81 | Original sandbox path known; bytes unavailable |
| OPES_Core_Banking_Checkpoint_AM_2026-10-09.zip | 584358 | 9d15b534696a3edc | Original sandbox path known; bytes unavailable |
| OPES_Core_Banking_Checkpoint_AN_2026-10-09.zip | 589143 | 9ee3193e10f9e00f | Original sandbox path was /mnt/data/OPES_Core_Banking_Checkpoint_AN_2026-10-09.zip; bytes unavailable in current runtime |

Checkpoint AN was recorded as containing 39 nested ZIP layers and 490 non-ZIP entries across layers. Repository file `regulatory/HISTORICAL_ARCHIVE_INVENTORY.md` is an inventory only and is not the binary archive.

## November artifacts

| Artifact | Previously reported size | Original generation path known from prior chat | Recovery status |
|---|---:|---|---|
| OPES_Core_Banking_Research_Delta_2026-11-01_R01.zip | ~9 KB | /mnt/data/OPES_Core_Banking_Research_Delta_2026-11-01_R01.zip | No attachment/file ID recovered; raw bytes unavailable |
| OPES_Core_Banking_Consolidated_Research_2026-11-01.docx | ~68 KB | /mnt/data/OPES_Core_Banking_Consolidated_Research_2026-11-01.docx | No attachment/file ID recovered; raw bytes unavailable |
| OPES_Core_Banking_Consolidated_Research_2026-11-01.pdf | ~369 KB | Prior chat confirmed PDF generation/download, but no reusable file ID/path was recovered in active context | Raw bytes unavailable |
| OPES_Core_Banking_Available_Batches_Consolidated_2026-11-03.zip | ~5.94 MB | /mnt/data/OPES_Core_Banking_Available_Batches_Consolidated_2026-11-03.zip | Prior report said it contained 13 artifacts and was not complete; no attachment/file ID recovered |

## Existing GitHub checkpoint evidence

- `2472f98130427a523f0bb0613abc1585eea5f4da` created `regulatory/checkpoints/AN/README.md` and explicitly states that complete historical checkpoint ZIPs were not uploaded.
- `e8b9b10cf1bc3fcd60ad54bd789964994851a1a1` created `regulatory/HISTORICAL_ARCHIVE_INVENTORY.md` with the AE–AN exact sizes and SHA-256 prefixes above.

## Required recovery rule

Do not reconstruct a binary under an original filename unless its byte identity can be proven against the known size/hash evidence.

When any original artifact becomes accessible again:
1. obtain the original bytes;
2. compute SHA-256;
3. compare against the historical evidence where available;
4. upload the unchanged original to GitHub under a dedicated archival path;
5. verify the remote blob/commit;
6. update this recovery record with the full SHA-256 and commit SHA.

