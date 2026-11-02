# OPES Core Banking — Checkpoint BZ
Date: 2026-11-02. Phase 4, Accounting Core / Financial Integrity.
Canonical predecessor: BY; independently read remote main at `923ad456a46df31a950c288c8afb131f40458f8e`.
Active: WP-ACC-005 OPEN / P0 BLOCKED. Last completed: WP-ACC-004 inherited, not independently reaudited.

## Incremental contribution
Examined issuer-hosted scanned **Instruction 01/GR/2014** on payment-system surveillance (new to this work package) against the previously examined 2014 BEAC payment charter. The signed page of the instruction visually displays **17 MAI 2014**, while the issuer's 2019 financial-stability report and charter refer to **17 MARS 2014**. This is an unresolved issuer-document date/provenance conflict; neither date is to be encoded as an approved legal effective date.

Article 3 of the 2014 instruction describes categories outside its *express* surveillance scope; Articles 4–6 distinguish BEAC-managed SYGMA/SYSTAC and certain SWIFT activity. Do not transpose the 2014 exclusions into current 2018/2024 payment-product licensing rules. Articles 8/10 address participant approval, suspensions and CRSP circulars. Articles 16–20 define surveillance reference domains and leave report format/frequency to later CRSP circulars. Articles 23–26 cover findings, corrective plans, injunctions and possible participation suspension/exclusion. The current instrument, amendments, CRSP reporting circulars, participant agreements, operational schemas and individual bank authority are still missing.

## Assurance decision
Regulatory interpretation, reporting channels, signed agreements, PCEC accounting, settlement evidence and the current amendment chain remain P0-blocked. No production code, banking tests, notification, certified conformance or P0 closure. The PDF was viewed through an issuer-hosted browser rendering; the binary could not be downloaded/hashed because of DNS resolution failure. All proposed controls are non-executable design only.

See EVIDENCE_DELTA.md, SURVEILLANCE_CONTROL_GATES.json, CONTROL_AND_TEST_DESIGN.md, QUALITY_REVIEW.md, CONTINUATION_STATE.json and EXECUTION_REPORT.md.

**NEXT EXACT TASK:** `WP-ACC-005 — Checkpoint CA`: obtain issuer-authenticated correction/official publication establishing the operative signing and commencement date of Instruction 01/GR/2014; acquire current amendment/circular chain and bank-specific surveillance reporting, participation and incident evidence; authenticate signed 001/GR/2024; reconcile 2014 charter Art 56 with current restitution/finality agreements; preserve inherited P0 blockers.
