# BU — Regulatory citation integrity and payment-authority lineage (2 Nov 2026)

**Canonical predecessor:** BT, remote main commit `28ca0df05ad3451e8b6b41698c39b423c59b49b9` (rechecked before this work). **Active:** WP-ACC-005, Phase 4 Accounting Core / Financial Integrity. **Status:** OPEN P0 BLOCKED; Definition of Ready FAIL. This is a dependency-safe research checkpoint, not completion of WP-ACC-005, certification, or approval to code.

**Finding:** A BEAC-hosted 2020 research article's footnote 7 cites COBAC **R-2019/03** as the prudential instrument for payment institutions. BEAC's official 2019 Financial Stability Review (printed pp.43–44) separately identifies **R-2019/02** as the payment-institution prudential regulation and **R-2019/03** as monetary-sanctions implementation. The 2020 footnote therefore conflicts with stronger issuer documentary evidence. The actual current operative legal texts remain to be authenticated. This is a **citation-integrity issue**, not a new regulatory amendment or binding interpretation.

See [source evidence](EVIDENCE_DELTA.md), [authority gates](LEGAL_CITATION_INTEGRITY_GATES.json), [controls and test specifications](CONTROL_AND_TEST_DESIGN.md), [quality review](QUALITY_REVIEW.md), [continuation](CONTINUATION_STATE.json), and [execution report](EXECUTION_REPORT.md).

**No** bank-specific legal scope, payment participation, PCEC mapping, settlement or prudential calculation is approved. No production implementation, executable tests, security scans or regulatory contact occurred. **Single continuation:** WP-ACC-005 — BV.
