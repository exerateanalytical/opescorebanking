# OPES Core Banking — Checkpoint BS (2026-11-02)

**Canonical predecessor:** BR at `2e57766beaa6d7dc5abfdc68801a98e4be31d18d` verified from GitHub `main` before this work. **Active:** WP-ACC-005, OPEN / P0 BLOCKED. **Last reported completed:** WP-ACC-004 (inherited, not reaudited). **DoR:** FAIL. **No banking code or executed tests.**

## Nonduplicative evidence delta
The previous BR checkpoint described BEAC 004/DGE/DSMP/2023 as a PSP erroneous-transfer circular with unresolved banking applicability. BS cross-checks it against the issuer-hosted **Règlement 04/18/CEMAC/UMAC/COBAC** and identifies a material **entity/category and product/channel interpretation problem**: 2018 Article 5 expressly lists credit institutions among eligible PSPs; the 2023 circular's introductory 'exclusively' description resembles the narrower 2018 Article 6 payment-institution concept. Further, the 2023 circular's Section I concerns mobile-phone transfers, but Section IV expressly mentions instant transfers or merchant payments **by mobile phone or not**. Neither blanket bank exclusion nor automatic application to every bank rail is defensible without issuer/current-law interpretation.

BEAC's payment-system architecture page distinguishes direct, indirect and sub-participants and refers to signed conventions. This is not evidence that any specific bank has one. No later BEAC confirmation for SYGMA V10 production or SYSTAC2 instant activation was found.

**Files:** [Evidence](EVIDENCE_DELTA.md), [legal scope and entitlement gates](LEGAL_SCOPE_AND_ENTITLEMENT_GATES.json), [control/test design](CONTROL_AND_TEST_DESIGN.md), [quality review](QUALITY_REVIEW.md), [continuation state](CONTINUATION_STATE.json), [execution report](EXECUTION_REPORT.md).

**NEXT EXACT TASK:** WP-ACC-005 — Checkpoint BT. Preserve all P0 holds and hourly continuation.
