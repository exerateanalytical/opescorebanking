# OPES Core Banking — Whole-repository reconciliation findings
**Baseline** `7ea5a0e9cc274269fcfc7cdf7bf51e6e411359e2`; full Git recursive tree `7ea5a0e9cc274269fcfc7cdf7bf51e6e411359e2`, not truncated. Status: **complete metadata inventory, partial full-content semantic review**. This is not an exhaustive independent content/acceptance audit.
## Actual counts
- 1287 tracked blobs totaling 13,707,935 bytes; 221 ZIPs.
- 150 distinct 2026-11-03 engineering WP directory IDs; **these IDs are not an accepted exhaustive programme denominator**.
- 59 regulatory checkpoint directories and 317 tracked checkpoint source blobs.
- Full specification: 143 tracked files, including 25 apis, 25 data, 25 workflows, 25 ui, 25 tests.
- 4 exact Git-blob duplicates (8 paths), preserved for provenance. See DUPLICATE_BLOBS.json.
## Detected contradictions
- **MANIFEST_FILE_COUNT:** programme/consolidated/ONE_BATCH_ENGINEERING_DELIVERY_2026-11-04/full_specification/DELIVERY_MANIFEST.json. Manifest declared 141; tracked directory contains 143.
- **BOUNDARY_OWNERSHIP:** programme/batches/2026-11-03/ACT-001/ACT-001_CONTRACT.json. Legacy ACT-001 titled "Product factory and catalogue ownership" overlaps proposed PRD bounded context; preserve ACT-001 and adopt content-aware mapping.
- **STALE_GOVERNANCE_POINTER:** governance/CANONICAL_PROGRAMME_STATE.json. Governance index mentions latest archive batch 180, although B209_CT artifacts are present; historic pointer is stale, not evidence of unfinished upload.
## Source precedence
1. Actual pinned Git tree path/size/blob evidence establishes presence and exact byte identity at HEAD.
2. Full source content and immutable history establish what a source *claims*, not external acceptance.
3. Proposed newer domain drafts and education edition are design candidates. Specific historical contract requirements must be mapped by content, not by the ACT/PRD prefix alone.
4. Binding verified primary CEMAC/Country law > bank contract/approved policy > international engineering reference > vendor default. No EU/US/UK rule supersedes CEMAC law.
5. Independent CFO/legal/security/auditor evidence needed to mark WP verified.
## Gaps to preserve, not fabricate
- **WP-ACC-005** (BLOCKED_P0): Unresolved authoritative PCEC 312/322 account identity and effective-dated interpretation. Required: Issuer-authenticated primary instruments and legal/CFO signoff.
- **WP-PAY-GIMAC-001** (BANK_SPECIFIC_ENTITLEMENT_UNVERIFIED): No participation/settlement agreement for customer bank. Required: Bank contract, authorized scheme profiles and settlement participation.
- **GOV-REC-001** (OPEN): Original archive custody, full nested archive integrity and source acceptance not established. Required: Independently verified original bytes, source hierarchy and external reviewer.
- **GOV-WBS-RECON-001** (OPEN): Exhaustive approved leaf-WP denominator is absent. Required: Owner-approved exhaustive scope, reviewed actual content crosswalk.
Full content of every source ZIP, historical blob, regulator source and 15 DoR gates is **not independently verified** by this metadata audit. Existing accepted WP denominator **UNKNOWN**. No production code/tests/certification attributed to this audit.
## Education licensing correction
Education software licence ≠ regulated banking licence. Training deployments must remain isolated from live financial data, payments and keys. Existing `full_specification/education/` artifacts are retained; academic workflows are realistic but simulated.
