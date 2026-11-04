# GOV-REC-001 — Historical Source Audit, Batch 171 / Checkpoint BI

Date: 2026-11-04. Source: GitHub exerateanalytical/opescorebanking@9c2476b94a1af7dbfac31684679332bc9e401207. Registered plan: governance/GOV_REC_001_SUBBATCH_PLAN_151_180_2026-11-04.md.

## Source completeness (not engineering acceptance)
Read every 7 tracked source blob in `regulatory/checkpoints/BI/`; each blob SHA was independently compared with the pinned source tree. Verbatim text source copies are in the ZIP SOURCE/ directory. This covers only this checkpoint directory, not the original missing cumulative archives or the complete programme.

## Inherited assertions, not accepted facts
- Previous historical checkpoint: BH.
- Reported phase: Phase 4 — Accounting Core / Financial Integrity.
- Reported active package: NOT STATED.
- Reported package state: OPEN_P0_BLOCKED.
- Reported DoR: FAIL.
- WP IDs mentioned in source text: WP-ACC-004, WP-ACC-005.
- Exact historical next task (claim): WP-ACC-005 — Checkpoint BJ: acquire authenticated issuer originals/publication and hashes for R-2009/01 and R-2025/02; signed COBAC interpretation of Articles 4/6/7 and bank-specific approvals; inspect COBAC 2025 report and signed R-2021/01–02; bank-approved PCEC/capital mapping and 01/25–02/25 legal/judicial/settlement evidence. Preserve P0 hold..
- JSON parse failures: none.

## Source ledger
| Name | Git blob SHA | SHA-256 of retrieved text | Bytes | WP mentions |
|---|---|---|---:|---|
| `AUTHORITY_MODEL.json` | `6e5fc9ad2ad26c372563faa792e3929ba0506aa7` | `de9b793d71f66f4777dfeb941138c4c451af46709f84f7cf88ff3e5d8e0d59d2` | 4150 | — |
| `CONTINUATION_STATE.json` | `49b8dea8d885f0e1c701635701582e2d755f8fc0` | `22ca6a6936882a679f2cdcdfdb4a25b716f0b32b25b5d3baba4f33f1446d07d8` | 1433 | WP-ACC-004, WP-ACC-005 |
| `CONTROL_AND_TEST_DESIGN.md` | `3760cdc2789d15a673e0e4aa398b0ed9fbe42684` | `a595c1e41fb00fe6b4a9880236a6da7d4c4387f858fb71bed6d454f87e5aa03d` | 5296 | — |
| `EVIDENCE_DELTA.md` | `e2a9b0cfa99ee006b29a172c4bab6bcc543e0711` | `3a185f56969012af2227fe223eb80788dee246b2c13fe1eadd7dfa1f7f74765a` | 4110 | — |
| `EXECUTION_REPORT.md` | `e4372e3aaa0cb3c1f84bf715a2ff0936dc554200` | `850cce385810dc1cd93b186ffa6a6fc7f0220ac4fb1bbdf9154fe397febaa2e5` | 1298 | WP-ACC-005 |
| `QUALITY_REVIEW.md` | `c7280792da6f7b6d759fadcbc9e792116e217f7a` | `6c9a890ed78b0b26e38ab248f73ff99910bad63570fb089230697e25ee38cfa5` | 2082 | WP-ACC-005 |
| `README.md` | `e07eb9f7d3b2b4085d2042bb12c03882c48e1621` | `4dc97ac773316785bfc40e57c374ca98fe4fb3150588b94a6101a7b03e746ba0` | 2507 | WP-ACC-004, WP-ACC-005 |

## Material source-asserted gaps and control holds
- `regulatory/checkpoints/BI/AUTHORITY_MODEL.json:135` — "MISSING",
- `regulatory/checkpoints/BI/CONTINUATION_STATE.json:8` — "status": "OPEN_P0_BLOCKED",
- `regulatory/checkpoints/BI/CONTINUATION_STATE.json:13` — "work_packages_blocked_from_closure": 1,
- `regulatory/checkpoints/BI/CONTROL_AND_TEST_DESIGN.md:8` — ¦ BI-REQ-03 ¦ Distinguish subscribed, paid-up, own funds, settlement and compliance status ¦ Capital Evidence + Accounting Core ¦ R-2025/02 Article 5, financial invariants ¦ DESIGN; bank PCEC missing ¦
- `regulatory/checkpoints/BI/CONTROL_AND_TEST_DESIGN.md:10` — ¦ BI-REQ-05 ¦ Reject automated compliance conclusions where regulator/corporate evidence is missing ¦ Compliance Review ¦ P0 evidence gap ¦ DESIGN ¦
- `regulatory/checkpoints/BI/CONTROL_AND_TEST_DESIGN.md:44` — Missing authority store -> fail closed for rule promotion; regulator communication outcome UNKNOWN -> investigate without inferred approval; audit must reconstruct each document/version/actor/approval and distinguish historical case correspondence from normative rule. No direct balance mutation, no retry-driven duplicate posting, no invented cash, liquidity 
- `regulatory/checkpoints/BI/EVIDENCE_DELTA.md:20` — Authenticated complete 01/25–02/25, missing printed 02/25 page 10, separate certified court dispositions, original COBAC–MINFI correspondence, official publication/effective dates, signed implementing texts; institution-approved PCEC, capital, liability and settlement mappings; signed R-2021/01–02, current prudential amendment chain; 2025 COBAC report body; 
- `regulatory/checkpoints/BI/EXECUTION_REPORT.md:2` — **Canonical predecessor:** BH remotely fetched; BI did not duplicate BH's case matrix. **Current:** Phase 4, WP-ACC-005 OPEN/P0 BLOCKED.
- `regulatory/checkpoints/BI/EXECUTION_REPORT.md:4` — **Work packages attempted 1; completed 0; kept open 1; blocked from closure 1; dependent attempted 0.** New source examined: signed/scanned BEAC-hosted historical LC-COB/44 (2009-11-24), establishing a distinct historical corporate-approval layer; current 2025 Article 6 COBAC approval remains separate. Official R-2025/02 rechecked. Official 2025 COBAC annual
- `regulatory/checkpoints/BI/QUALITY_REVIEW.md:4` — ¦ Regulatory/legal ¦ FAIL/P0 ¦ 2025 Article 4/6/7 institution-specific interpretation, official publication and amendments missing; 2009 circular is historical ¦
- `regulatory/checkpoints/BI/QUALITY_REVIEW.md:20` — No new P0 closure. WP-ACC-005 OPEN/P0 BLOCKED, DoR FAIL. Production code 0; executed banking tests 0; regulator requests 0; original source hashes 0. Continue research; no dependent work package advanced.
- `regulatory/checkpoints/BI/README.md:2` — Date: 2026-11-02. Verified predecessor: BH, remotely retrieved. Phase 4 Accounting Core / Financial Integrity. Last reported completed WP: WP-ACC-004 (inherited; not independently reaudited). Active WP-ACC-005 OPEN / P0 BLOCKED.
- `regulatory/checkpoints/BI/README.md:7` — The full issuer-hosted R-2025/02 text was rechecked for Article 6 (submission by 2026-06-30; 2026–2029 milestones) and Article 7 (R-2009/01 continuing through 2026 for existing institutions). The legal interaction is still unresolved. A BEAC 2025 COBAC annual report link was verified but body fetch failed due to 19,385,240-byte size; no report findings inven

## Multidisciplinary QA and DoR status
Regulatory/legal: historical citations and effective dates require direct primary issuer validation; source claims alone do not establish adoption or legal status. CFO/ledger: no monetary journal, accounting account mapping or migration updated. PCEC 312/322 textual inconsistency remains P0. Architecture: document lineage is not proof of Git ancestry or independent WP completion. Identity/security/AML: no privilege, customer KYC, sanctions or payment-rail entitlement assumed. Workflow/payments: external outcomes and reversals remain fail-closed. Data/privacy: preserved source-path, line-level excerpt, Git blob and SHA-256 evidence; legal retention authority not independently adjudicated. Resilience/ops: no deployment or recovery test. Testing: zero banking tests executed in this audit. No reviewer signatures or 15-gate DoR pass; all historical success statements remain unverified.

## Batch conclusion
Evidence archive may be marked DRAFT REMOTELY DELIVERED only after GitHub main branch, per-file extracted content, ZIP Git blob and downloaded ZIP SHA-256 independently match. This does NOT complete GOV-REC-001 nor WP-ACC-005; historical WBS denominator UNKNOWN. Next audit: batch 172 (or reconciliation after batch 180).
