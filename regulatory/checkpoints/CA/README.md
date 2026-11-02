# Checkpoint CA — BEAC ISO 20022 operative authority and schedule-provenance controls
**Date:** 2026-11-03 (Africa/Douala). **Phase:** 4 Accounting Core / Financial Integrity. **Active:** WP-ACC-005, OPEN/P0-BLOCKED. **Predecessor:** BZ at `c582312568669071cb7ca60e852cdeb6ab900368`. **Last completed:** WP-ACC-004 (inherited, not reaudited).

## Safe evidence advancement
This checkpoint does not repeat BZ's 2014 conflict analysis. It adds direct examination of two BEAC issuer-hosted **signed** 2025 instruments that were not yet clause-authenticated in the predecessor:
- **Instruction 001/GR/2025, signed 17 November 2025:** Articles 1–7; ISO 20022 IAP variant; institutional applicability; distinct CBPR+, BEAC_SYGMA_ISO20022 and BEAC_SYSTAC_ISO20022 rule families; mandatory conformity to BEAC technical specifications and an annexed regional migration calendar. The signed instruction **does not prove** SYGMA V10 is live for any bank.
- **Lettre Circulaire 013/GR/2025, signed 19 November 2025:** closed SWIFT MyStandards **CEMAC-BANK** community; BEAC approval required; 29 advertised message types (ADMI 2, PACS 6, CAMT 21), old MT equivalence table; issuer-profile conformance testing capability; participant request to join within one month from circular effective date. No bank-specific access, profile export, validation result or production approval obtained.
- **New P0 schedule discrepancy:** 001/GR/2025 annex is headed November 2025 yet multiple later activities have dates in Jan–May **2025**, earlier than signing. It is unsafe to infer the intended 2026 dates or to declare migration completed from the annex. Other rows show ambiguous ranges and repeated task number 12.
- **Preamble transcription anomaly:** the instruction prints the year of a referenced 15 March instrument as `202`; do not guess the missing digit.
- BZ's 2014 signed-page May-vs-March and charter 2013-vs-2014 conflicts remain OPEN, with no official correction acquired.
- The BEAC public payment instructions catalogue currently lists 001/GR/2025 and LC 013/GR/2025, but a signed copy of **001/GR/2024** and operative CRSP reporting circulars were not located in this run. Catalogue omission is not repeal evidence.

## Financial-integrity consequences
Issuer-approved message schema is not equivalent to participant entitlement, successful qualification, settlement-account access, finality, central-bank statement, or production activation. Distinguish (i) message accepted, (ii) cleared, (iii) externally settled, (iv) reconciled. `pacs.002` status and `camt.054` notification cannot independently create money or authorize settlement finality; `pacs.004` return is a distinct, idempotent financial operation with controlled posting and reconciliation. Never edit original posted journals. No direct balance mutation, duplicate replay or fabricated liquidity.

## Artifacts
`EVIDENCE_DELTA.md`, `ISO20022_AUTHORITY_GATES.json`, `CONTROL_AND_TEST_DESIGN.md`, `QUALITY_REVIEW.md`, `CONTINUATION_STATE.json`, `EXECUTION_REPORT.md`.
**No production code, executed banking tests, security scans, bank integrations, legal opinions, regulatory requests, or certifications.**
