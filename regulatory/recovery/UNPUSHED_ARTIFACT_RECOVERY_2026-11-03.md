# OPES Core Banking — Unpushed Artifact Recovery Record

Recovery date: 2026-11-03  
Repository: exerateanalytical/opescorebanking

## Current status

A renewed recovery scan on 2026-11-03 found the original Library-backed binaries for checkpoint archives **AE through AM**. Their exact byte sizes match the historical inventory committed at `e8b9b10cf1bc3fcd60ad54bd789964994851a1a1`, their full SHA-256 hashes begin with the previously recorded prefixes, and every recovered ZIP passed `unzip -t` integrity testing.

The full hashes are committed in:

`regulatory/recovery/RECOVERED_CHECKPOINTS_AE_AM_SHA256_2026-11-03.txt`

The remaining five target artifacts were not found on the active Project/Library/runtime surfaces.

Important: the recovered ZIP bytes are available again, but the connected GitHub write interface used by this recovery session does not accept a Library file reference or local container path for binary uploads. Therefore this record does **not** claim that the ZIP binaries themselves are present in GitHub yet.

## Recovered checkpoint archives

| Artifact | Exact bytes | Full SHA-256 | Recovery verification |
|---|---:|---|---|
| OPES_Core_Banking_Checkpoint_AE_2026-10-09.zip | 546061 | 4ac19ba584f09bed9223271536cc66482fc787b3f12c2e585a76c2a037e41dc5 | Exact historical prefix matched; ZIP integrity OK |
| OPES_Core_Banking_Checkpoint_AF_2026-10-09.zip | 551363 | 93142a5d5f43fd33c12f67a2c61debd6ce374be90d49360f86a19fd9a3690b3e | Exact historical prefix matched; ZIP integrity OK |
| OPES_Core_Banking_Checkpoint_AG_2026-10-09.zip | 556408 | 2dc66f7ac1cd8570e48a2fe441e03830dd2beee0fdeaa2b9b9855fe189e978d4 | Exact historical prefix matched; ZIP integrity OK |
| OPES_Core_Banking_Checkpoint_AH_2026-10-09.zip | 561357 | 4ee6565bf4fa071477daf55fe4cf14290a2d28bbeb137685878552082ce4f546 | Exact historical prefix matched; ZIP integrity OK |
| OPES_Core_Banking_Checkpoint_AI_2026-10-09.zip | 565959 | 3f2489488610939b2b53046424a58d5ec9e4687103fe3b09843ff36420b31679 | Exact historical prefix matched; ZIP integrity OK |
| OPES_Core_Banking_Checkpoint_AJ_2026-10-09.zip | 571166 | 9f7d2b81325d3ebaf04065a203cd2ed7218fa4a90f7595449e68335262642588 | Exact historical prefix matched; ZIP integrity OK |
| OPES_Core_Banking_Checkpoint_AK_2026-10-09.zip | 575544 | 9f3d15833635b145e17416e55df007fe1dd16cecdc54dcf0b9091748151451cf | Exact historical prefix matched; ZIP integrity OK |
| OPES_Core_Banking_Checkpoint_AL_2026-10-09.zip | 579859 | f396b94e123c7b81a0f13fa0b8163af22f6c92189afbb609892267452536a023 | Exact historical prefix matched; ZIP integrity OK |
| OPES_Core_Banking_Checkpoint_AM_2026-10-09.zip | 584358 | 9d15b534696a3edc9eca4dd131b1b7c6f751c6820e571827f4f748df4a598e93 | Exact historical prefix matched; ZIP integrity OK |

Checkpoint AM contains the prior checkpoint chain, including `prior_checkpoint_AL.zip`; the recovered archives were preserved unchanged.

## Still not recovered

| Artifact | Previously recorded size/status |
|---|---:|
| OPES_Core_Banking_Checkpoint_AN_2026-10-09.zip | 589143 bytes; historical SHA-256 prefix `9ee3193e10f9e00f` |
| OPES_Core_Banking_Research_Delta_2026-11-01_R01.zip | ~9 KB |
| OPES_Core_Banking_Consolidated_Research_2026-11-01.docx | ~68 KB |
| OPES_Core_Banking_Consolidated_Research_2026-11-01.pdf | ~369 KB |
| OPES_Core_Banking_Available_Batches_Consolidated_2026-11-03.zip | ~5.94 MB |

## Recovery searches performed

The recovery process checked:

- Banking Project conversation files;
- personal ChatGPT Library, including date-scoped file listing;
- active runtime storage;
- prior Banking conversation context;
- GitHub default branch and known historical commits.

The Library scan found AE through AM. No active raw-byte references were found for AN or the four November artifacts.

## Existing GitHub evidence

- `2472f98130427a523f0bb0613abc1585eea5f4da` created `regulatory/checkpoints/AN/README.md` and explicitly states that complete historical checkpoint ZIPs were not uploaded.
- `e8b9b10cf1bc3fcd60ad54bd789964994851a1a1` created `regulatory/HISTORICAL_ARCHIVE_INVENTORY.md` with the AE–AN exact sizes and SHA-256 prefixes.
- `4786a866bd7da7bfafb70742b57187f8f5c510e2` commits the full SHA-256 manifest for recovered AE–AM.

## Binary-upload rule

Do not reconstruct a binary under an original filename unless its identity is proven against the recorded size/hash evidence.

When a binary-transfer path is available:

1. transfer each unchanged recovered original;
2. store it under a dedicated archival path;
3. fetch/verify the remote blob;
4. compare the downloaded bytes against the full SHA-256 above;
5. update this record with the binary commit SHA.



## 2026-11-03 binary recovery completion

Checkpoint archives AE through AM were successfully committed unchanged to `main` under:

`regulatory/recovery/archives/`

Recovery commit:

`dc956d2cf317f0123d4af3b57c5953fc917db2ed` — `archive: recover original core banking checkpoints AE-AM`

Verification completed after the push:
- all nine remote Git blob SHAs match the Git blob SHAs computed from the recovered local originals;
- the one-time recovery workflow verified the full SHA-256 values before committing;
- ZIP integrity checks passed;
- the temporary workflow removed itself after success.

Therefore AE, AF, AG, AH, AI, AJ, AK, AL and AM are no longer unpushed artifacts.

Still unrecovered/unpushed from the original 14-item set:
- OPES_Core_Banking_Checkpoint_AN_2026-10-09.zip
- OPES_Core_Banking_Research_Delta_2026-11-01_R01.zip
- OPES_Core_Banking_Consolidated_Research_2026-11-01.docx
- OPES_Core_Banking_Consolidated_Research_2026-11-01.pdf
- OPES_Core_Banking_Available_Batches_Consolidated_2026-11-03.zip
