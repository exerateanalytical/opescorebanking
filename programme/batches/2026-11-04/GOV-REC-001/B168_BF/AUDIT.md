# GOV-REC-001 — Historical Source Audit, Batch 168 / Checkpoint BF

Date: 2026-11-04. Source: GitHub exerateanalytical/opescorebanking@9c2476b94a1af7dbfac31684679332bc9e401207. Registered plan: governance/GOV_REC_001_SUBBATCH_PLAN_151_180_2026-11-04.md.

## Source completeness (not engineering acceptance)
Read every 7 tracked source blob in `regulatory/checkpoints/BF/`; each blob SHA was independently compared with the pinned source tree. Verbatim text source copies are in the ZIP SOURCE/ directory. This covers only this checkpoint directory, not the original missing cumulative archives or the complete programme.

## Inherited assertions, not accepted facts
- Previous historical checkpoint: BE.
- Reported phase: Phase 4 — Accounting Core / Financial Integrity.
- Reported active package: NOT STATED.
- Reported package state: OPEN_P0_BLOCKED.
- Reported DoR: FAIL.
- WP IDs mentioned in source text: WP-ACC-004, WP-ACC-005.
- Exact historical next task (claim): WP-ACC-005 — Checkpoint BG: acquire and hash official R-2025/02 original PDF, verify Bulletin publication and amendments and reconcile Articles 6–7 legal effect; inspect COBAC 2025 Annual Report; acquire signed R-2020/01 R-2021/01 R-2021/02 and institution-specific capital/PCEC approvals; continue 01/25–02/25 court/settlement evidence. Preserve P0 hold..
- JSON parse failures: none.

## Source ledger
| Name | Git blob SHA | SHA-256 of retrieved text | Bytes | WP mentions |
|---|---|---|---:|---|
| `CONTINUATION_STATE.json` | `2f52bf9298914f3377732b51d2d0a134db183e0c` | `1aeeea658b05718e29e26d067ff75fe43b667ecc711b6dce09021d46b8ceab1f` | 1235 | WP-ACC-004, WP-ACC-005 |
| `CONTROL_AND_TEST_DESIGN.md` | `afc22b19bc5009ddc144015ccf6d3606cbe855cb` | `566aa09d07aff6c474802cae60b211471c9bb6291fadc1fb685dadf1851ffeb8` | 3264 | — |
| `EVIDENCE_DELTA.md` | `316b909e25ec4f3ffc1084b7d05bd7335fe83ce5` | `6b1f43261739eec47642e9b659c7573a7300005d8bbcd176f7ba6c2eb737c0ed` | 3138 | — |
| `EXECUTION_REPORT.md` | `938e1384611c193a7a0b116abee5e1ab8ef3cba5` | `163fc80cce510890043df7d83cb049581bf6b58b210febddc9c1352bb368c231` | 1301 | WP-ACC-005 |
| `QUALITY_REVIEW.md` | `08328d7bd0c9c12ed91abdcdd8d8766887a5a6a6` | `9b1793c36c366eaf68032f47d4a7dbaaaa12fc0a7701baa61dfc29fbb4a6caf4` | 1749 | WP-ACC-005 |
| `README.md` | `33411d27df8f8b2b5109b908729ef1692ffac068` | `acd1f0bad3c2962388349c43c8a727ffee821217b5d9ed25aabb59649e856029` | 1725 | WP-ACC-004, WP-ACC-005 |
| `REGULATORY_CAPITAL_RULES.json` | `6ad9f83f7aeaad103117ee1509df4caf5971046f` | `3bf4224d2955bd708e94f8352fd32470360f198c2f8110964e474e92c73115ce` | 2632 | — |

## Material source-asserted gaps and control holds
- `regulatory/checkpoints/BF/CONTINUATION_STATE.json:8` — "status": "OPEN_P0_BLOCKED",
- `regulatory/checkpoints/BF/CONTINUATION_STATE.json:13` — "work_packages_blocked_from_closure": 1,
- `regulatory/checkpoints/BF/CONTROL_AND_TEST_DESIGN.md:11` — SOURCE_DISCOVERED → TEXT_REVIEWED → PUBLICATION_PROVEN → AMENDMENTS_RECONCILED → LEGAL_APPROVED → INSTITUTION_APPROVED → POLICY_APPROVED → ACTIVE; any conflict or missing evidence → HOLD/REVIEW_REQUIRED. Capital plan: DRAFT → SUBMITTED → ACKNOWLEDGED → APPROVED or REJECTED or UNKNOWN; submission alone never means approval. Evaluation: NOT_APPLICABLE / INDETE
- `regulatory/checkpoints/BF/CONTROL_AND_TEST_DESIGN.md:21` — 9. Missing amendment history must prevent unconditional legal compliance certification.
- `regulatory/checkpoints/BF/EVIDENCE_DELTA.md:23` — - Regulation 02/25 printed p10/Arts 23–26, court orders, COBAC–MINFI originals and bank-specific PCEC/settlement remain unresolved.
- `regulatory/checkpoints/BF/EXECUTION_REPORT.md:2` — Phase 4, WP-ACC-005. Predecessor BE continuation fetched from GitHub. **Work packages attempted 1; completed 0; kept open 1; blocked from closure 1; dependent packages attempted 0.**
- `regulatory/checkpoints/BF/QUALITY_REVIEW.md:16` — **Gate:** WP-ACC-005 OPEN/P0 BLOCKED; DoR FAIL; do not start dependent financial code. Preserve all historic gaps and checkpoint lineage.
- `regulatory/checkpoints/BF/README.md:4` — Located and read the **complete eight-article text** of COBAC Regulation **R-2025/02**, hosted as an official PDF attachment by the **Republic of Congo Ministry of Finance, Budget and Public Portfolio**, dated 10 December 2025: https://www.finances.gouv.cg/fr/download/file/fid/9490 . Its official ministry catalogue entry is https://www.finances.gouv.cg/fr/no
- `regulatory/checkpoints/BF/README.md:7` — WP-ACC-005 remains **OPEN / P0 BLOCKED**. Preserve no automatic capital threshold activation, no capital-created ledger entries, no dormant-account transfers, no settlement fiction. No production code or banking tests.

## Multidisciplinary QA and DoR status
Regulatory/legal: historical citations and effective dates require direct primary issuer validation; source claims alone do not establish adoption or legal status. CFO/ledger: no monetary journal, accounting account mapping or migration updated. PCEC 312/322 textual inconsistency remains P0. Architecture: document lineage is not proof of Git ancestry or independent WP completion. Identity/security/AML: no privilege, customer KYC, sanctions or payment-rail entitlement assumed. Workflow/payments: external outcomes and reversals remain fail-closed. Data/privacy: preserved source-path, line-level excerpt, Git blob and SHA-256 evidence; legal retention authority not independently adjudicated. Resilience/ops: no deployment or recovery test. Testing: zero banking tests executed in this audit. No reviewer signatures or 15-gate DoR pass; all historical success statements remain unverified.

## Batch conclusion
Evidence archive may be marked DRAFT REMOTELY DELIVERED only after GitHub main branch, per-file extracted content, ZIP Git blob and downloaded ZIP SHA-256 independently match. This does NOT complete GOV-REC-001 nor WP-ACC-005; historical WBS denominator UNKNOWN. Next audit: batch 169 (or reconciliation after batch 180).
