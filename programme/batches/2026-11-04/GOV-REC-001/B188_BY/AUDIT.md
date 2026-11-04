# GOV-REC-001 — Historical Source Audit, Batch 188 / Checkpoint BY

Date: 2026-11-04. Source: GitHub exerateanalytical/opescorebanking@ee13700c466053bdc3a5e4fb468e65fad939aee1. Registered plan: governance/GOV_REC_001_SUBBATCH_PLAN_151_180_2026-11-04.md.

## Source completeness (not engineering acceptance)
Read every 7 tracked source blob in `regulatory/checkpoints/BY/`; each blob SHA was independently compared with the pinned source tree. Verbatim text source copies are in the ZIP SOURCE/ directory. This covers only this checkpoint directory, not the original missing cumulative archives or the complete programme.

## Inherited assertions, not accepted facts
- Previous historical checkpoint: NOT STATED.
- Reported phase: Phase 4 — Accounting Core / Financial Integrity.
- Reported active package: NOT STATED.
- Reported package state: OPEN_P0_BLOCKED.
- Reported DoR: FAIL.
- WP IDs mentioned in source text: WP-ACC-004, WP-ACC-005.
- Exact historical next task (claim): WP-ACC-005 — Checkpoint BZ: authenticate current charter and 2014 surveillance instruction, BEAC/SANGHA reporting and signed 001/GR/2024; obtain institution charter/conventions, official settlement-account statements and BEAC Art 56 procedure; reconcile with 2023 restitution and COBAC ICT rules; retain all inherited P0..
- JSON parse failures: none.

## Source ledger
| Name | Git blob SHA | SHA-256 of retrieved text | Bytes | WP mentions |
|---|---|---|---:|---|
| `CONTINUATION_STATE.json` | `dece04788b0771f92a2abe09cb23d8dc9968fec3` | `40898c11746b07b84641d3b99523475fa12c3f5e5b1cc5093db868975cae6505` | 1989 | WP-ACC-004, WP-ACC-005 |
| `CONTROL_AND_TEST_DESIGN.md` | `43c2ebb56aa6ad7af2e2cd8d2492929cc2d27a7e` | `1364c006dc58369859c34bfdb751cf5358f3716890ca6b1ca76e105beb3adf28` | 4384 | — |
| `EVIDENCE_DELTA.md` | `8352a6ead66eab3a02085957739a3795ffaed88b` | `70bc1a71c5a0fb49e2b1c0c276890133cff8ec1215e126bc1fc0f98fcb86bb5b` | 3911 | — |
| `EXECUTION_REPORT.md` | `415110b97ac3e4b0318966f6cfb0f570170d6fcc` | `283cf9e2bd5bf1df1b65a88fa9bd52ad53d3f57ba962fc65227fcf7793471f71` | 1921 | WP-ACC-004, WP-ACC-005 |
| `PAYMENT_SUPERVISION_AND_SETTLEMENT_GATES.json` | `cb18b91365d48afb678ebc6740d8acc453b3e339` | `298ebba3a4613c997229e9521585a80bb441deb3c7ad4bcc9a5aac3e445c36c6` | 9254 | WP-ACC-005 |
| `QUALITY_REVIEW.md` | `ed9603fc4c87d7b89811a842835d55852a302199` | `2697e5456886fabec256cbce1bf5717e1e78f903a30eefe3fa348a827db3d9ff` | 2535 | WP-ACC-005 |
| `README.md` | `6fff7508281d562817dc8c31ede07ecfbd53847c` | `c6103b74e3d12788c18927842d4dcf49c755c427f9f35f044664581e8a0d7ac4` | 2376 | WP-ACC-004, WP-ACC-005 |

## Material source-asserted gaps and control holds
- `regulatory/checkpoints/BY/CONTINUATION_STATE.json:9` — "status": "OPEN_P0_BLOCKED",
- `regulatory/checkpoints/BY/CONTINUATION_STATE.json:14` — "work_packages_blocked_from_closure": 1,
- `regulatory/checkpoints/BY/CONTINUATION_STATE.json:29` — "2014 charter preamble 2013/2014 surveillance-instruction reference discrepancy"
- `regulatory/checkpoints/BY/CONTROL_AND_TEST_DESIGN.md:7` — 3. Reconcile confirmed external movement with clearing/settlement and customer obligations; open discrepancy case if amount, value date or account mismatches.
- `regulatory/checkpoints/BY/CONTROL_AND_TEST_DESIGN.md:9` — 5. Preserve unresolved legal disputes, unknown external outcomes and independent reconciliation evidence. No customer debit or credit until contractual/legal authorization is established.
- `regulatory/checkpoints/BY/CONTROL_AND_TEST_DESIGN.md:17` — ¦ BY-T01 ¦ Unsigned charter enables rail ¦ Reject participation entitlement; log missing signature ¦
- `regulatory/checkpoints/BY/CONTROL_AND_TEST_DESIGN.md:20` — ¦ BY-T04 ¦ External statement amount differs from requested restitution ¦ Quarantine discrepancy; independent reconciliation ¦
- `regulatory/checkpoints/BY/EVIDENCE_DELTA.md:1` — # BY — Evidence, authority, and unresolved conflicts
- `regulatory/checkpoints/BY/EVIDENCE_DELTA.md:13` — ¦ BY-E08 ¦ BEAC-hosted 2014 charter p.2 ¦ Preamble appears to reference '01/GR/2013' with date 17 Mar 2014, while Art. 1 references '01/GR/2014' ¦ Internal citation discrepancy: confirm against original signed surveillance instruction; do not silently normalize ¦
- `regulatory/checkpoints/BY/EXECUTION_REPORT.md:9` — ¦ Blocked from closure ¦ 1 ¦
- `regulatory/checkpoints/BY/EXECUTION_REPORT.md:19` — **Evidence:** BEAC-hosted historical 2014 payment-systems charter, especially Arts 3/34/36/38/42/43/45/56; BEAC 2024 Financial Stability Review p.41 on payment-system incident surveillance/SANGHA/GIMAC DISPUTES; public payment-instructions index omission of signed 001/GR/2024 (still identified by issuer report). Art 56 ex officio debit is not an authorizatio
- `regulatory/checkpoints/BY/PAYMENT_SUPERVISION_AND_SETTLEMENT_GATES.json:67` — "gate": "Daily reconciliation must identify missing/excess/duplicate/unmatched external movements",
- `regulatory/checkpoints/BY/PAYMENT_SUPERVISION_AND_SETTLEMENT_GATES.json:193` — "rule": "unknown outcome must remain unresolved pending issuer receipt"
- `regulatory/checkpoints/BY/QUALITY_REVIEW.md:4` — ¦ regulatory/legal ¦ OPEN ¦ Current charter, signed adoption, Art 56 procedure and 001/GR/2024 missing ¦
- `regulatory/checkpoints/BY/QUALITY_REVIEW.md:18` — **Stop decision:** WP-ACC-005 remains OPEN/P0-BLOCKED; dependent packages not advanced. Historical 2014 charter is material source evidence, not proof of current bank participation or right to implement. The BEAC 2024 surveillance review describes operational reporting and SANGHA, but neither establishes current COBAC incident thresholds nor an authenticated
- `regulatory/checkpoints/BY/QUALITY_REVIEW.md:20` — **Legal citation discrepancy:** Charter preamble appears to say 01/GR/2013 dated 17 Mar 2014; Article 1 says 01/GR/2014. Require issuer-authenticated 2014 surveillance instruction before cross-referencing.
- `regulatory/checkpoints/BY/README.md:2` — **Phase 4 / WP-ACC-005: OPEN, P0-blocked.** Predecessor BX, independently verified remote main 263c38b7ca0261011c032d81b829869e8ed7be5a. Last completed work package WP-ACC-004 is inherited and not reaudited.
- `regulatory/checkpoints/BY/README.md:5` — An issuer-hosted **2014 BEAC/CRSP payment-system good-conduct charter** was located and read. Article 3 envisages each participant's signed approval. Article 56 distinguishes settlement irrevocability from a separately justified fund-return request and describes possible **BEAC-initiated debit of a settlement account after review and advance notice**. This i

## Multidisciplinary QA and DoR status
Regulatory/legal: historical citations and effective dates require direct primary issuer validation; source claims alone do not establish adoption or legal status. CFO/ledger: no monetary journal, accounting account mapping or migration updated. PCEC 312/322 textual inconsistency remains P0. Architecture: document lineage is not proof of Git ancestry or independent WP completion. Identity/security/AML: no privilege, customer KYC, sanctions or payment-rail entitlement assumed. Workflow/payments: external outcomes and reversals remain fail-closed. Data/privacy: preserved source-path, line-level excerpt, Git blob and SHA-256 evidence; legal retention authority not independently adjudicated. Resilience/ops: no deployment or recovery test. Testing: zero banking tests executed in this audit. No reviewer signatures or 15-gate DoR pass; all historical success statements remain unverified.

## Batch conclusion
Evidence archive may be marked DRAFT REMOTELY DELIVERED only after GitHub main branch, per-file extracted content, ZIP Git blob and downloaded ZIP SHA-256 independently match. This does NOT complete GOV-REC-001 nor WP-ACC-005; historical WBS denominator UNKNOWN. Next audit: batch 189 (or reconciliation after batch 180).
