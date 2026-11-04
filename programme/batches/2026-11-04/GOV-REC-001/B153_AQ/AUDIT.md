# GOV-REC-001 — Historical Source Audit, Batch 153 / Checkpoint AQ

Date: 2026-11-04. Source: GitHub exerateanalytical/opescorebanking@9c2476b94a1af7dbfac31684679332bc9e401207. Registered plan: governance/GOV_REC_001_SUBBATCH_PLAN_151_180_2026-11-04.md.

## Source completeness (not engineering acceptance)
Read every 6 tracked source blob in `regulatory/checkpoints/AQ/`; each blob SHA was independently compared with the pinned source tree. Verbatim text source copies are in the ZIP SOURCE/ directory. This covers only this checkpoint directory, not the original missing cumulative archives or the complete programme.

## Inherited assertions, not accepted facts
- Previous historical checkpoint: AP.
- Reported phase: Phase 4 — Accounting Core / Financial Integrity.
- Reported active package: NOT STATED.
- Reported package state: OPEN_P0_BLOCKED.
- Reported DoR: FAIL.
- WP IDs mentioned in source text: WP-ACC-004, WP-ACC-005, WP-PAY-GIMAC-001.
- Exact historical next task (claim): WP-ACC-005 — Checkpoint AR: obtain issuer-certified full Regulation 02/25 including printed page 10/Articles 23–26; authenticate original 2025-10-22 COBAC–MINFI letter; separately certify court status for 01/25 and 02/25; establish signed/published adoption status of June 2026 proposals and bank-specific PCEC/settlement approvals. Do not activate executable financial policy..
- JSON parse failures: none.

## Source ledger
| Name | Git blob SHA | SHA-256 of retrieved text | Bytes | WP mentions |
|---|---|---|---:|---|
| `AUTHORITY_DECISION_MATRIX.json` | `f1286d8d1cf74268e4e03b6fd722f8a3d50c9c45` | `b3dc754c275235323a259cf3728a6969425dee8ca95c13657e36127ae61332f1` | 2426 | — |
| `CONTINUATION_STATE.json` | `47a5bfa4e793a712bf8001b9a716ee6869909ce5` | `cc61ec8c114dd84bc500718bb5fec4ffb9d6ad83a104656418b2e7350270c345` | 1405 | WP-ACC-004, WP-ACC-005, WP-PAY-GIMAC-001 |
| `EVIDENCE_DELTA.md` | `59d5001013b0355c319bff8b8ce85ccb0fc09f51` | `1ff418d967c45364b1882b69dedfd3c012e2f0a1a55c35544581ec5419483f32` | 3804 | — |
| `EXECUTION_REPORT.md` | `d33dd05d4af09718390690e9a7d1c7a06c1de3e7` | `2107c111af835bec6b99a55fad099a188596fc806671b501470343b28f7e29fd` | 1317 | WP-ACC-004, WP-ACC-005 |
| `README.md` | `00274e573676cbc99523a649ccf29db9fa82f852` | `c17e45cf79b3a05b252805ad666abe54bb1a1ffd869a5bd3d113ae9410e1068a` | 746 | WP-ACC-004, WP-ACC-005 |
| `REVIEW_AND_GATES.md` | `d20f3a2b88585c61be0fd78008fbeacacfdb09ff` | `737e814fa15f065985c45ac5cac3bda14d2f5537cadab418f33952fddef8ed69` | 2680 | WP-ACC-005 |

## Material source-asserted gaps and control holds
- `regulatory/checkpoints/AQ/AUTHORITY_DECISION_MATRIX.json:6` — "status": "BLOCKED",
- `regulatory/checkpoints/AQ/AUTHORITY_DECISION_MATRIX.json:46` — "status": "BLOCKED",
- `regulatory/checkpoints/AQ/CONTINUATION_STATE.json:8` — "status": "OPEN_P0_BLOCKED",
- `regulatory/checkpoints/AQ/CONTINUATION_STATE.json:12` — "work_packages_blocked_from_closure": 1,
- `regulatory/checkpoints/AQ/EVIDENCE_DELTA.md:1` — # AQ — evidence provenance, discrepancy and missing-page assessment
- `regulatory/checkpoints/AQ/EVIDENCE_DELTA.md:6` — - Reproduction B: https://kalieu-elongo.com/wp-content/uploads/2025/07/Reglement-N%C2%B002_traitement-comptes-inactifs-des-avoirs-en-desherence.pdf . An independently hosted 10-PDF-page scan, but **also jumps from printed page 9 / Article 23 to printed page 11 / Article 27**. Its independent hosting does not cure the missing printed page 10. The missing page
- `regulatory/checkpoints/AQ/EXECUTION_REPORT.md:2` — Date: 2026-11-01. Phase 4 Accounting Core / Financial Integrity. Canonical predecessor AP remotely read and verified before work; local R01 treated as supplemental. WP-ACC-004 remains last inherited completed WP; WP-ACC-005 OPEN P0 BLOCKED.
- `regulatory/checkpoints/AQ/EXECUTION_REPORT.md:3` — **Work packages attempted 1; completed 0; kept open 1; blocked from closure 1; dependent packages attempted 0.**
- `regulatory/checkpoints/AQ/EXECUTION_REPORT.md:4` — Research: independently examined two hosted copies of 02/25 (both missing printed page 10), identified a secondary fragment of Article 26 from an alleged COBAC–MINFI letter, and recorded conflicting secondary inactivity thresholds. None resolves issuer completeness or certified legal effect.
- `regulatory/checkpoints/AQ/README.md:6` — Scope of AQ: independent search for the missing 02/25 text, reconcile contradictory public descriptions, and specify exact source-acceptance conditions. AP documents remain authoritative as historical records; R01 local research is supplemental, not a substitute for AP.
- `regulatory/checkpoints/AQ/REVIEW_AND_GATES.md:4` — - Regulatory/legal: FAIL — two copies share missing printed page 10; certified court status and original COBAC–MINFI letter absent. Press Article 26 fragment is a lead only.

## Multidisciplinary QA and DoR status
Regulatory/legal: historical citations and effective dates require direct primary issuer validation; source claims alone do not establish adoption or legal status. CFO/ledger: no monetary journal, accounting account mapping or migration updated. PCEC 312/322 textual inconsistency remains P0. Architecture: document lineage is not proof of Git ancestry or independent WP completion. Identity/security/AML: no privilege, customer KYC, sanctions or payment-rail entitlement assumed. Workflow/payments: external outcomes and reversals remain fail-closed. Data/privacy: preserved source-path, line-level excerpt, Git blob and SHA-256 evidence; legal retention authority not independently adjudicated. Resilience/ops: no deployment or recovery test. Testing: zero banking tests executed in this audit. No reviewer signatures or 15-gate DoR pass; all historical success statements remain unverified.

## Batch conclusion
Evidence archive may be marked DRAFT REMOTELY DELIVERED only after GitHub main branch, per-file extracted content, ZIP Git blob and downloaded ZIP SHA-256 independently match. This does NOT complete GOV-REC-001 nor WP-ACC-005; historical WBS denominator UNKNOWN. Next audit: batch 154 (or reconciliation after batch 180).
