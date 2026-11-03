# OPES Core Banking — Repository Asset Synchronization Audit
**Date:** 2026-11-03  
**Repository:** `exerateanalytical/opescorebanking`  
**Audited base `main` commit:** `c85494e5122377ee795d39ba85fb29f36da3f11f`  
**Status:** All reachable main-branch assets inventoried; four reported original November binaries remain unlocated. This is not a claim that every file ever produced in previous chats has been recovered.

## Verified before this audit commit
- **811 tracked blob paths**, 162 ZIP archives, tree response not truncated.
- **150 separately numbered programme batch ZIPs**, IDs 001–150 inclusive: 0 missing IDs and 0 duplicate IDs.
- All ten **AE–AN historical checkpoint ZIPs** in `regulatory/recovery/archives/`; unlike the previous missing-file register, **AN is now present** in GitHub at 589143 bytes and Git blob SHA-1 `f32ffba2476df66f839deec722adaf063d697bbf`. Original SHA-256 of AN has **not** been independently recomputed by this audit; historical expected SHA-256 prefix is `9ee3193e10f9e00f`. Size alone is not proof of byte identity.
- Additional preserved ZIPs: `regulatory/recovery/archives/OPES_Core_Banking_WP_ACC_005_Checkpoint_R_2026-10-20.zip` and `governance/checkpoints/GOV-REC-001/OPES_Core_Banking_GOV_REC_001_Checkpoint_2026-11-03.zip`.
- Previous historical regulatory checkpoints (including `regulatory/checkpoints/CT/`), research reports, manifests and governance material remain present; the full path/blob inventory is in `REPOSITORY_INVENTORY_BLOBS_2026-11-03.json`.

## Unrecovered originals (not re-created)
| Original filename | Reported bytes | Historical SHA-256 prefix | Repo status |
|---|---:|---|---|
| `OPES_Core_Banking_Research_Delta_2026-11-01_R01.zip` | 9247 | `5ff903be73e0d0d9` | NOT FOUND |
| `OPES_Core_Banking_Consolidated_Research_2026-11-01.docx` | 68498 | `6e54583233168e6a` | NOT FOUND |
| `OPES_Core_Banking_Consolidated_Research_2026-11-01.pdf` | 369271 | `bb81e5b38089a64a` | NOT FOUND |
| `OPES_Core_Banking_Available_Batches_Consolidated_2026-11-03.zip` | 5939492 | `733298994715ddba` | NOT FOUND |

Source: historical `regulatory/recovery/HISTORICAL_RECOVERY_AUDIT_UPLOADED_REPORT_REGISTER_2026-11-03.md` and prior recovery record. These are original-file byte identities, not directions to fabricate replacements. The local container for this session did not contain these originals. Direct targeted file-library and Google Drive name searches did not find them. Existing AE–AM duplicates on Google Drive were **not reuploaded**.

## Scope boundary
A Git `main` tree inventory checks files currently reachable through the branch, **not full historical git ancestry, unmaterialized files in prior chats, every download once created, or independent acceptance**. The archive count tracks delivery, not implemented software readiness.

Open financial/regulatory P0: `WP-ACC-005`, COBAC I-2015/01 Article 8(d) account 312/322 classification; bank-specific payment system participation remains unverified. `GOV-REC-001` historical work-package reconciliation remains IN_PROGRESS. No financial activation, production code, tests or certification asserted by this audit.

## Safe next step
Recover the four original November files from their source conversations/saved bytes, compare exact byte sizes and full SHA-256 with the historical source, push originals under distinct archival paths, then verify remote blob identity. Do not overwrite these missing slots with new synthetic documents.
