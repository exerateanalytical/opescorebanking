# GOV-REC-001 — Historical Source Audit, Batch 174 / Checkpoint BL

Date: 2026-11-04. Source: GitHub exerateanalytical/opescorebanking@9c2476b94a1af7dbfac31684679332bc9e401207. Registered plan: governance/GOV_REC_001_SUBBATCH_PLAN_151_180_2026-11-04.md.

## Source completeness (not engineering acceptance)
Read every 7 tracked source blob in `regulatory/checkpoints/BL/`; each blob SHA was independently compared with the pinned source tree. Verbatim text source copies are in the ZIP SOURCE/ directory. This covers only this checkpoint directory, not the original missing cumulative archives or the complete programme.

## Inherited assertions, not accepted facts
- Previous historical checkpoint: BK.
- Reported phase: Phase 4 — Accounting Core / Financial Integrity.
- Reported active package: NOT STATED.
- Reported package state: OPEN_P0_BLOCKED.
- Reported DoR: FAIL.
- WP IDs mentioned in source text: WP-ACC-004, WP-ACC-005.
- Exact historical next task (claim): WP-ACC-005 — Checkpoint BM: obtain issuer-authenticated written clarification of D-2025/328 'du quart' versus 'au quart' calculation semantics, R-2020/01 vs R-2020/02 citation, 37 vs 36 roster and SCLOG vs SLOG legal entity; obtain current amended R-2010/02/R-2020/01 clauses, authenticated original binaries/hashes, institution-specific COBAC satisfactory-financial-condition evidence and effective dates. Continue PCEC and 01/25–02/25 judicial/publication/settlement evidence; preserve P0 hold..
- JSON parse failures: none.

## Source ledger
| Name | Git blob SHA | SHA-256 of retrieved text | Bytes | WP mentions |
|---|---|---|---:|---|
| `CLAUSE_SEMANTICS_AND_IDENTITY_GATES.json` | `812f474472d14cfd2c9cf0d0aa2ccb6bca41a57a` | `90eeac7b431a8369c745297d97d29bb865b9f59ac14fce20e40e96655b62ca12` | 4634 | WP-ACC-005 |
| `CONTINUATION_STATE.json` | `d9d5449198d426306b72b31366a6be1334b0bc7c` | `3a80500bc1c5a03c9e9fc9ff9a83a4d74d35960a122d72c27f9259d476f3d2f7` | 1458 | WP-ACC-004, WP-ACC-005 |
| `CONTROL_AND_TEST_DESIGN.md` | `493a8855ce9264a88ab8a383bc7df8e1be76a453` | `cd32af538354d6be3daaf78b10e85263d4f114a7caab4718ffa3c2cd9cbc6945` | 6379 | — |
| `EXECUTION_REPORT.md` | `8122c2e111f4a2c71d4f182be0da573a8e65d481` | `4722aff27be5e8e8927382bdf155905c40b14600ce56de0c1f885fe45555b8ac` | 1369 | WP-ACC-005 |
| `QUALITY_REVIEW.md` | `c3ae2cea141096cd3a9a453c0714bf5d2bf30c21` | `17f00298504c444b87dcb73f882d0dd24ab9835f7edd40d27ad6d09a88f226b4` | 2520 | WP-ACC-005 |
| `README.md` | `137023d32abb1ba44eb35655343420aff8311f49` | `230a2bb392223af98c9168252670fb213470f910156eeb61b7a5860d17bdf343` | 1657 | WP-ACC-004, WP-ACC-005 |
| `SOURCE_AND_EVIDENCE_DELTA.md` | `8780b07da8fb2a08e08c90896e23af949ab1bb12` | `271dd4f06fa823e2fe114b270a25ce8d85e4b14396e23046f8712b8ea35f50a4` | 2761 | — |

## Material source-asserted gaps and control holds
- `regulatory/checkpoints/BL/CLAUSE_SEMANTICS_AND_IDENTITY_GATES.json:6` — "status": "OPEN_P0_BLOCKED",
- `regulatory/checkpoints/BL/CLAUSE_SEMANTICS_AND_IDENTITY_GATES.json:33` — "Article 1 historical phased single-beneficiary limit: 45% until 2020-12-31, 40% from 2021-01-01, 35% from 2022-01-01, 25% from 2023-01-01; later amendments/current validity not verified",
- `regulatory/checkpoints/BL/CLAUSE_SEMANTICS_AND_IDENTITY_GATES.json:34` — "Article 1 historical aggregate large-risk limit 800% of net own funds, with large-risk threshold 10% from 2023-01-01; later amendments not verified",
- `regulatory/checkpoints/BL/CONTINUATION_STATE.json:8` — "status": "OPEN_P0_BLOCKED",
- `regulatory/checkpoints/BL/CONTINUATION_STATE.json:13` — "work_packages_blocked_from_closure": 1,
- `regulatory/checkpoints/BL/CONTROL_AND_TEST_DESIGN.md:15` — - BL-REQ-05: require institution-specific satisfactory-financial-condition evidence (exact documentary form unresolved), independent group exposure aggregation and legal/risk/CFO maker-checker before any preferential assessment.
- `regulatory/checkpoints/BL/CONTROL_AND_TEST_DESIGN.md:23` — `CreditRiskPolicy`: `ExposureRuleCandidate(source_ids, arithmetic_semantics=UNRESOLVED, baseline_limit_version?, institution_eligibility_evidence?, effective_window?)`.
- `regulatory/checkpoints/BL/CONTROL_AND_TEST_DESIGN.md:37` — 6. 37th entity invented from a proposal list: reject; 36 operative rows remain an unresolved discrepancy.
- `regulatory/checkpoints/BL/EXECUTION_REPORT.md:8` — ¦ Blocked from closure ¦ 1 ¦
- `regulatory/checkpoints/BL/EXECUTION_REPORT.md:19` — **Definition of Ready: FAIL.** Critical legal ambiguity and source authenticity remain unresolved. No production financial implementation or automatic regulatory relief permitted.
- `regulatory/checkpoints/BL/QUALITY_REVIEW.md:5` — ¦ Regulatory/legal ¦ **P0 BLOCKED** ¦ 'du quart' vs 'au quart'; R-2020/01 vs /02; 37 vs 36; signed corrigendum and current amendment chain ¦
- `regulatory/checkpoints/BL/QUALITY_REVIEW.md:6` — ¦ Financial/CFO/accounting ¦ **P0 BLOCKED** ¦ Separate 25% large-exposure ceiling from 25% exceptional relief; approved PCEC and capital calculations missing ¦
- `regulatory/checkpoints/BL/QUALITY_REVIEW.md:7` — ¦ Prudential risk ¦ **P0 BLOCKED** ¦ Explicit eligible risk perimeter, bank financial-condition evidence, formula and net own funds ¦
- `regulatory/checkpoints/BL/QUALITY_REVIEW.md:12` — ¦ Data/privacy/retention ¦ OPEN ¦ Immutable custody, provenance, legal hold and data retention unresolved ¦
- `regulatory/checkpoints/BL/README.md:3` — **Predecessor:** BK verified on remote `main`, parent commit `d6d61f1b9168b6e358a68949e92d732e0e298baf`. **Phase:** 4 Accounting Core / Financial Integrity. **Active package:** WP-ACC-005 OPEN/P0 BLOCKED. **Last completed:** WP-ACC-004 (inherited, not independently reaudited).
- `regulatory/checkpoints/BL/README.md:6` — Primary government-hosted indexed text of D-2025/328 and scanned third-party reproduction of R-2020/01 were re-examined. New decision-critical issue: **'du quart (25%)' vs 'au quart (25%)'**, plus historical Article 1 25% concentration ceiling that must not be conflated with Article 7 exceptional relief. Congo entity **SCLOG/SLOG** is a separate identity dis

## Multidisciplinary QA and DoR status
Regulatory/legal: historical citations and effective dates require direct primary issuer validation; source claims alone do not establish adoption or legal status. CFO/ledger: no monetary journal, accounting account mapping or migration updated. PCEC 312/322 textual inconsistency remains P0. Architecture: document lineage is not proof of Git ancestry or independent WP completion. Identity/security/AML: no privilege, customer KYC, sanctions or payment-rail entitlement assumed. Workflow/payments: external outcomes and reversals remain fail-closed. Data/privacy: preserved source-path, line-level excerpt, Git blob and SHA-256 evidence; legal retention authority not independently adjudicated. Resilience/ops: no deployment or recovery test. Testing: zero banking tests executed in this audit. No reviewer signatures or 15-gate DoR pass; all historical success statements remain unverified.

## Batch conclusion
Evidence archive may be marked DRAFT REMOTELY DELIVERED only after GitHub main branch, per-file extracted content, ZIP Git blob and downloaded ZIP SHA-256 independently match. This does NOT complete GOV-REC-001 nor WP-ACC-005; historical WBS denominator UNKNOWN. Next audit: batch 175 (or reconciliation after batch 180).
