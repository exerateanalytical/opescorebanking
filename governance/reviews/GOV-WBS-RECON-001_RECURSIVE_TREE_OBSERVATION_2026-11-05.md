# GOV-WBS-RECON-001 — independently observed Git tree inventory (2026-11-05)

Status: IN_PROGRESS, evidence checkpoint only; no accepted WP closure, no production readiness claim.

## Source and method
GitHub authenticated connector GET /repos/exerateanalytical/opescorebanking/git/trees/main?recursive=1, pinned returned commit `842bfd74c40aaad860479d4ad79773a03366df9b`. The response explicitly returned `truncated:false`. In-memory enumeration of the returned tree (not a cached historical report): **1,760 entries = 343 trees + 1,417 blobs**, of which **229 blob paths end in .zip**, **210 ZIP paths fall under programme/batches/**, and **11 ZIPs fall under regulatory/recovery/archives/**. These are path counts, not valid archive or accepted-work-package counts. Git tree path/blob identities are available for further crosswalk; a durable sorted-path-list digest was not independently computed in this connector runtime.

## Exact recovered archive locations
- Batch 209: `programme/batches/2026-11-04/GOV-REC-001/B209_CT/OPES_Core_Banking_Batch_209_GOV_REC_001_CT_2026-11-04.zip`.
- Batch 210: `programme/batches/2026-11-04/GOV-REC-001/B210_ALL/OPES_Core_Banking_Batch_210_GOV_REC_001_ALL_2026-11-04.zip`.
- The batch-210 folder also contains `MANIFEST.json`, `SOURCE_CROSSWALK.json`, `FILE_TO_WP_CROSSWALK.csv`, `HISTORICAL_WORK_PACKAGES.json`, `ZIP_SHA256SUMS.txt` and `RUN_REPORT.json`.

## Critical interpretation
The historical GOV-WBS-RECON-001/A tree-access gap is resolved **for discovery and path identification only**. The previously recorded batch-210 remote byte-level verification is historical evidence; this checkpoint did not download or rehash either ZIP. Historical original-vs-reconstruction custody, completeness of all 25 domain leaf work packages, reviewer acceptance, and the approved denominator remain UNKNOWN. No automatic status promotion is authorized. Do not duplicate batches 001–210.

The latest observed main commit message is `security-ledger: document LAB-008 privilege bypass and evidence gate`. That finding remains P0: `lab006_runner` has direct DML privileges under LAB-007, so a passing replay test cannot establish privilege-safe immutable journal posting. Maintain strict laboratory-only isolation, no financial production release, and no asserted 15/15 DoR.

## Next evidence requirements
1. Pin this tree SHA in an artifact-to-WP crosswalk; independently compute and store SHA-256 of the sorted `path + blob_sha + mode` inventory from the full response.
2. Fetch batch-209 and batch-210 manifests and archive bytes through a binary-capable authenticated route; verify SHA-256, entry CRC and original-vs-derived custody. Do not overwrite archives.
3. Reconcile crosswalk rows with owner-approved 25-domain register and evidence reviewer, keeping unaccepted items OPEN.
4. Independently continue SEC-TENANT-ROUTING-001 least-privilege negative tests; do not use this inventory as a reason to promote the ledger laboratory.

## Execution accounting
One registered work package `GOV-WBS-RECON-001` attempted; zero accepted complete; one kept open; zero newly blocked; two inherited P0/hold categories remain (security ledger privilege bypass and disputed 312/322 reporting mapping). No ZIP is warranted for an incomplete checkpoint. No executable tests run here.

**NEXT EXACT TASK:** `GOV-WBS-RECON-001/B` — retrieve the pinned tree's batch-209 and batch-210 manifests and original ZIP bytes, independently validate SHA-256/CRC and classify original-versus-derived custody without promoting work-package acceptance.
