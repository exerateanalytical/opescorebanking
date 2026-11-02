# OPES Core Banking — Checkpoint BY (2026-11-02)
**Phase 4 / WP-ACC-005: OPEN, P0-blocked.** Predecessor BX, independently verified remote main 263c38b7ca0261011c032d81b829869e8ed7be5a. Last completed work package WP-ACC-004 is inherited and not reaudited.

## Verified evidence delta
An issuer-hosted **2014 BEAC/CRSP payment-system good-conduct charter** was located and read. Article 3 envisages each participant's signed approval. Article 56 distinguishes settlement irrevocability from a separately justified fund-return request and describes possible **BEAC-initiated debit of a settlement account after review and advance notice**. This is NOT permission for OPES to reverse settled journals or debit an institution's central-bank account. Articles 34, 36, 38, 42, 43 and 45 address participant continuity, configuration change notification, administrator segregation, daily payment-data processing, historical routing conventions and traceable communication. Current amendments, signed bank-specific adoption and convention are missing.

The issuer's 2024 financial stability review (published in 2025) separately describes **BEAC payment-system operational incident reporting**, SANGHA monitoring, and GIMAC DISPUTES, which must not be conflated with **COBAC R-2024/01 cybersecurity-incident notification**. The issuer's 2024 payment-services report names Instruction 001/GR/2024; the current public payment-instructions index inspected in this run does not list its signed text. Absence from this index is not proof of repeal.

## Safe design checkpoint
A proposed supervisor-specific reporting/outcome model and external-settlement debit reconciliation gates are recorded in `PAYMENT_SUPERVISION_AND_SETTLEMENT_GATES.json`. Fourteen unexecuted negative scenarios are in `CONTROL_AND_TEST_DESIGN.md`. No implementation, conformance, regulatory approval, tests or certification is claimed. The entire package remains open because of P0 evidence gaps.

**NEXT EXACT TASK:** `WP-ACC-005 — Checkpoint BZ`: authenticate current charter, 2014 surveillance instruction, BEAC reporting/SANGHA arrangements and 001/GR/2024 signed operative text; obtain bank-specific participant charter/convention, official settlement-account statements and regulator notification instructions; reconcile Art 56 with 2023 restitution and COBAC R-2024/01; preserve all inherited P0 gaps.
