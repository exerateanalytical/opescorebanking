# OPES Core Banking — Historical Archive Inventory (local verification)

The latest cumulative checkpoint archive is `OPES_Core_Banking_Checkpoint_AN_2026-10-09.zip`. It contains **39 nested ZIP layers** and **490 non-ZIP archive entries across layers** (including repeated README, manifest and checksum files). This is an **inventory, not an upload of the binary archives**. These files have not been transferred to GitHub.

| Layer | Checkpoint (where known) | Bytes | Entries | SHA-256 prefix |
|---:|---|---:|---:|---|
| 0 | AN | 589143 | 10 | 9ee3193e10f9e00f |
| 1 | AM | 584358 | 8 | 9d15b534696a3edc |
| 2 | AL | 579859 | 9 | f396b94e123c7b81 |
| 3 | AK | 575544 | 9 | 9f3d15833635b145 |
| 4 | AJ | 571166 | 10 | 9f7d2b81325d3eba |
| 5 | AI | 565959 | 10 | 3f2489488610939b |
| 6 | AH | 561357 | 11 | 4ee6565bf4fa0714 |
| 7 | AG | 556408 | 11 | 2dc66f7ac1cd8570 |
| 8 | AF | 551363 | 12 | 93142a5d5f43fd33 |
| 9 | AE | 546061 | 11 | 4ac19ba584f09bed |

Additional 29 earlier nested layers exist, beginning at 540,287 bytes and ending at 22,402 bytes. This record deliberately does not assert they are uploaded.

## Blocker
Direct Git transport from the working container cannot resolve `github.com`. The connected GitHub connector supports creating text files but does not expose a local-container-file upload or release asset operation. No production code has been written; checkpoint files are regulatory research and specifications.

## Required for completion
Transfer the complete original cumulative AN ZIP without re-encoding, then compare remote SHA-256 to the local original; extract and commit the canonical source files, preserving provenance, without overwriting unrelated repository work.
