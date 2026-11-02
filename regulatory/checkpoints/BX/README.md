# BX — Accounting Core / financial integrity regulatory continuation

**Date:** 2026-11-02. **Predecessor:** BW, remote main `cca263fbd67994f98b517cf13e13e8caa7703b80`. **Active WP:** WP-ACC-005 (OPEN/P0). **Last completed WP:** WP-ACC-004 (inherited, not independently reaudited). **DoR:** FAIL.

## Distinct work performed

1. Re-examined issuer-hosted reproduced COBAC R-2024/01 **Articles 29 and 34–40** to establish an operational evidence chain missing from prior incident-classification checkpoints: annual security testing, real failover/failback, pre-release tests, independent data consistency and mandatory data dictionary. See [source analysis](EVIDENCE_DELTA.md).
2. BEAC's DSMP report published on its site in 2026 explicitly identifies **Instruction 001/GR/2024, dated 22 January 2024**, on technical standards for electronic payment instruments. This is a **new primary-instrument acquisition dependency**; its text is not authenticated and no policy is activated from the summary.
3. Developed proposed [authority and recovery gates](CONTROL_MATRIX.json), [14 negative test specifications](TEST_DESIGN.md), and [multidisciplinary review](QUALITY_REVIEW.md). No tests were executed.

## Regulatory caution

Article 41 in the issuer-hosted reproduction gives 1 January 2025 commencement and transitional periods for existing institutions, while explanatory narrative labels 2026 dates as entry into force. This remains **unresolved for production legal activation**. Article 30 incident thresholds and channels remain subject to current amendment/instruction verification. Signed standalone original and binary SHA-256 unavailable. These points are not silently closed.

**Production financial implementation:** NOT AUTHORIZED. No new ledger code, certifications, institution approvals, conformance claims or settlement assertions.

**NEXT EXACT TASK:** `WP-ACC-005 — Checkpoint BY`: authenticate R-2024/01 standalone and amendments, obtain binding Article 41/30 guidance and signed BEAC Instruction 001/GR/2024, map institution-specific RTO/RPO, test and data-dictionary evidence; continue inherited accounting/settlement/legal P0 acquisition. Maintain hold.
