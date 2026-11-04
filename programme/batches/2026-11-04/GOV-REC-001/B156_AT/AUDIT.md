# GOV-REC-001 — Historical Source Audit, Batch 156 / Checkpoint AT

Date: 2026-11-04. Source: GitHub exerateanalytical/opescorebanking@9c2476b94a1af7dbfac31684679332bc9e401207. Registered plan: governance/GOV_REC_001_SUBBATCH_PLAN_151_180_2026-11-04.md.

## Source completeness (not engineering acceptance)
Read every 8 tracked source blob in `regulatory/checkpoints/AT/`; each blob SHA was independently compared with the pinned source tree. Verbatim text source copies are in the ZIP SOURCE/ directory. This covers only this checkpoint directory, not the original missing cumulative archives or the complete programme.

## Inherited assertions, not accepted facts
- Previous historical checkpoint: AS.
- Reported phase: Phase 4 — Accounting Core / Financial Integrity.
- Reported active package: NOT STATED.
- Reported package state: OPEN_P0_BLOCKED.
- Reported DoR: FAIL.
- WP IDs mentioned in source text: WP-ACC-004, WP-ACC-005.
- Exact historical next task (claim): NOT STATED.
- JSON parse failures: none.

## Source ledger
| Name | Git blob SHA | SHA-256 of retrieved text | Bytes | WP mentions |
|---|---|---|---:|---|
| `ACCEPTANCE_SCENARIOS.json` | `e68401375df71556f8ded4db0d2d978e9aae1093` | `9eb02d472d2e6581ea6ab6fd39093e092cb5da5c6d1084b012b99b498f037441` | 2778 | — |
| `CONTINUATION_STATE.json` | `b90736039573c0ab6d8ee87264850a65f3800ca7` | `42de2dee5e1b7c44ebee5a084523e7810bf25b2649c55af753344ce139f5e400` | 1589 | WP-ACC-004, WP-ACC-005 |
| `EXECUTION_REPORT.md` | `88a1af17c61b80409626a9e67b327153d23b1576` | `5b8f92081d003bfa9b1bd8b1da6069c24ed5d9f7525b930f88b83faebee80cbf` | 1789 | WP-ACC-005 |
| `PUBLICATION_AUTHORITY_MATRIX.json` | `c47c7692b032d4c1e41f29b345ef69a625f2888c` | `4be3e1042f42e98a77489803ec0260b69ffde9649a42379a29aa7977a59ffde9` | 2089 | WP-ACC-005 |
| `QUALITY_REVIEW.md` | `808efc2d8fcc4c673dad8d2c6d8cbce3884913b1` | `7eadd9ae6363f87aedcf3b7c6dc2104ce22607b72eecfca394b473d08c0e1544` | 2162 | WP-ACC-005 |
| `README.md` | `9f2fc4571b3e6711f663b30f8602fdef77dcaec3` | `e80380ee71590b318ff4935d40f82f701d76dfc3c9435bb4bd75f51d076e1ee6` | 1890 | WP-ACC-005 |
| `REQUIREMENTS_AND_CONTROLS.md` | `2eb14025e9c7e807d36c008def27d04b0c427adc` | `fd8498726773454f0f9789d00a85a67d3f6cbb099b0e16754e94b164ec4e4719` | 3629 | WP-ACC-005 |
| `SOURCE_DELTA.md` | `eff032b4ec4d30217f005da79f5a3fe6a474967b` | `b29c81c2ed5f935f0dd8b5a11ac9794d0fa8030ee9b0c20159359c9297b6304f` | 4279 | — |

## Material source-asserted gaps and control holds
- `regulatory/checkpoints/AT/ACCEPTANCE_SCENARIOS.json:9` — "given": "Reject 02/25 scan missing printed page 10 even though terminal signature page visible",
- `regulatory/checkpoints/AT/CONTINUATION_STATE.json:8` — "status": "OPEN_P0_BLOCKED",
- `regulatory/checkpoints/AT/CONTINUATION_STATE.json:12` — "work_packages_blocked_from_closure": 1,
- `regulatory/checkpoints/AT/CONTINUATION_STATE.json:20` — "02/25 academic scan physically 10 PDF pages but missing printed page 10 and Articles 24-26",
- `regulatory/checkpoints/AT/EXECUTION_REPORT.md:9` — ¦ Work packages blocked from closure ¦ 1 ¦
- `regulatory/checkpoints/AT/EXECUTION_REPORT.md:19` — **Quality review:** legal, accounting, architecture, security, AML, workflow, data, settlement, resilience, testability, operations, usability, maintainability and audit evidence reviewed. P0 unresolved; DoR FAIL.
- `regulatory/checkpoints/AT/EXECUTION_REPORT.md:24` — `WP-ACC-005 — Checkpoint AU`: obtain issuer-certified complete 01/25 and 02/25 (printed page 10 included), Community Official Bulletin publication chain and authenticated effective dates, separate court dispositions, original COBAC–MINFI letter, final implementing instruments and bank-approved PCEC/settlement mapping. Keep financial activation blocked.
- `regulatory/checkpoints/AT/PUBLICATION_AUTHORITY_MATRIX.json:23` — "missing_articles": [
- `regulatory/checkpoints/AT/QUALITY_REVIEW.md:2` — Outcome: **WP-ACC-005 OPEN / P0 BLOCKED / DoR FAIL**. Review is design scrutiny, not independent expert certification.
- `regulatory/checkpoints/AT/QUALITY_REVIEW.md:7` — ¦ Accounting/financial integrity ¦ FAIL: institution-specific signed PCEC mapping and settlement recognition/reversal rules missing; public-sector PCE/CEMAC must not be substituted. ¦
- `regulatory/checkpoints/AT/QUALITY_REVIEW.md:11` — ¦ Workflow/state ¦ HOLD: missing page and wrong-publication-series negative transitions specified, not executed. ¦
- `regulatory/checkpoints/AT/QUALITY_REVIEW.md:18` — ¦ Regulator/auditor evidence ¦ FAIL: missing certified instruments, Bulletin pages, judicial orders, correspondence and bank CFO approvals. ¦
- `regulatory/checkpoints/AT/README.md:3` — Active work package: WP-ACC-005 (PCEC regulatory accounting extraction). Status: OPEN / P0 BLOCKED.
- `regulatory/checkpoints/AT/REQUIREMENTS_AND_CONTROLS.md:5` — - **AT-R02 Page inventory gate:** for a scanned instrument store physical PDF page count, printed page numbers, article spans, missing/duplicate pages, annex completeness, provenance, and reviewer attestations. A discontinuity (02/25 printed page 10) triggers `SOURCE_INCOMPLETE_HOLD` even if terminal signature page exists.
- `regulatory/checkpoints/AT/REQUIREMENTS_AND_CONTROLS.md:9` — - **AT-R06 Provenance-preserving corrections:** source conflict, missing page recovery, newly certified publication or judicial order creates a superseding evidence decision, never edits posted journals, retroactively changes balances or silently replays transfers.
- `regulatory/checkpoints/AT/REQUIREMENTS_AND_CONTROLS.md:15` — Evidence Registry owns source inventory and page integrity; Legal Applicability owns law and court effect; Policy Governance owns approval and effective-dated activation; Accounting Core owns immutable double-entry journals; Payments owns instructions and external status; independent Reconciliation owns external outcome confirmation. All financial activation
- `regulatory/checkpoints/AT/SOURCE_DELTA.md:10` — Observed: printed numbering runs through page 9 and resumes at printed page 11 on the last PDF page; **printed page 10 is absent**. Article 23 begins on printed page 9 and Articles 24–26 are missing. The terminal reproduced printed page 11 contains Articles 27–31; Article 30 appears to state 1 September 2025, and Article 31 calls for publication in the Commu

## Multidisciplinary QA and DoR status
Regulatory/legal: historical citations and effective dates require direct primary issuer validation; source claims alone do not establish adoption or legal status. CFO/ledger: no monetary journal, accounting account mapping or migration updated. PCEC 312/322 textual inconsistency remains P0. Architecture: document lineage is not proof of Git ancestry or independent WP completion. Identity/security/AML: no privilege, customer KYC, sanctions or payment-rail entitlement assumed. Workflow/payments: external outcomes and reversals remain fail-closed. Data/privacy: preserved source-path, line-level excerpt, Git blob and SHA-256 evidence; legal retention authority not independently adjudicated. Resilience/ops: no deployment or recovery test. Testing: zero banking tests executed in this audit. No reviewer signatures or 15-gate DoR pass; all historical success statements remain unverified.

## Batch conclusion
Evidence archive may be marked DRAFT REMOTELY DELIVERED only after GitHub main branch, per-file extracted content, ZIP Git blob and downloaded ZIP SHA-256 independently match. This does NOT complete GOV-REC-001 nor WP-ACC-005; historical WBS denominator UNKNOWN. Next audit: batch 157 (or reconciliation after batch 180).
