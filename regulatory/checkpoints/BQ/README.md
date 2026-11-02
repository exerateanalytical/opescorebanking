# BQ — Issuer-confirmed SYSTAC2 production and bounded payment-rail authority
**2 November 2026 | WP-ACC-005 | Phase 4 Accounting Core / Financial Integrity | OPEN — P0 BLOCKED**

Predecessor: BP, verified main at `8ab6aa2e757975a67d04954e44dbe59f8fe3cff2` before this checkpoint. No dependency advance; WP-ACC-004 remains last reported completed (not reaudited).

## Material delta (not a repeat of BP)
BEAC's **signed press release dated 12 August 2026** explicitly confirms **SYSTAC2 entered production Monday 3 August 2026**. It covers retail payments (transfers, direct debits, cheques and cards), is designed to ISO 20022, and comprises automated clearing (central and participant compartments), disputes and a **future** instant-payments module. BEAC states that **SYGMA V10 was still being finalized on 12 August**, with launch anticipated in following weeks; a forecast is **not** proof of a later launch. Source: https://www.beac.int/wp-content/uploads/2026/08/CP_MISE-EN-PROD-SYSTAC.pdf (two image pages inspected).

This is a **narrow P0 evidence advance**: the historical BP migration annex is superseded **for SYSTAC2 actual platform launch only**, not for bank-specific onboarding, SYGMA V10 live status, instant payments, message certification, settlement-finality contracts or accounting readiness. Retain the annex chronology discrepancy as a documentary issue.

## Engineering result
Added two-axis rail capability model (issuer platform live state vs institution's actual participation), version/feature/effective-date gates, dispute and instant-service isolation, and 12 negative acceptance specifications. No code, banking tests, signatures, participant schemas or institution agreements obtained. No ledger posting or regulatory policy activation authorized.

See SOURCE_EVIDENCE_AND_LIMITATIONS.md, RAIL_DEPLOYMENT_AND_CAPABILITY_GATES.json, CONTROL_AND_TEST_DESIGN.md, QUALITY_REVIEW.md, CONTINUATION_STATE.json and EXECUTION_REPORT.md.

**NEXT EXACT TASK:** WP-ACC-005 — Checkpoint BR: obtain newer issuer-confirmed SYGMA V10 production and settlement finality status (or explicitly retain UNKNOWN), authenticated institution-specific SYSTAC2/SYGMA agreements, CEMAC-BANK profiles and message authentication contracts; validate feature-level instant-payment go-live independently; continue COBAC 2020/2021 amendment chain, D-2025/328 correction, approved PCEC and 01/25–02/25 legal/judicial/settlement evidence. Preserve P0 hold.
