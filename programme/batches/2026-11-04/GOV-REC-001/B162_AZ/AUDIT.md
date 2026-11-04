# GOV-REC-001 — Historical Source Audit, Batch 162 / Checkpoint AZ

Date: 2026-11-04. Source: GitHub exerateanalytical/opescorebanking@9c2476b94a1af7dbfac31684679332bc9e401207. Registered plan: governance/GOV_REC_001_SUBBATCH_PLAN_151_180_2026-11-04.md.

## Source completeness (not engineering acceptance)
Read every 7 tracked source blob in `regulatory/checkpoints/AZ/`; each blob SHA was independently compared with the pinned source tree. Verbatim text source copies are in the ZIP SOURCE/ directory. This covers only this checkpoint directory, not the original missing cumulative archives or the complete programme.

## Inherited assertions, not accepted facts
- Previous historical checkpoint: AY.
- Reported phase: Phase 4 — Accounting Core / Financial Integrity.
- Reported active package: NOT STATED.
- Reported package state: OPEN_P0_BLOCKED.
- Reported DoR: FAIL.
- WP IDs mentioned in source text: WP-ACC-004, WP-ACC-005.
- Exact historical next task (claim): WP-ACC-005 — Checkpoint BA: obtain durable issuer-hosted I-2002/01, I-2003/01 and I-2015/01 binaries with hashes and legal custody; validate 2003 Art.7 custody-account correction edges and 2015 265/296 provision relations with COBAC/institution; resolve 2651/2652 and 312/322 source conflicts, 2018 Article 33 legal effect and outstanding 01/25–02/25 publication/Court/settlement approvals. Preserve P0 holds..
- JSON parse failures: none.

## Source ledger
| Name | Git blob SHA | SHA-256 of retrieved text | Bytes | WP mentions |
|---|---|---|---:|---|
| `ACCEPTANCE_SCENARIOS.json` | `c32f272e5fb6bd891feaec5fd194911db0ad0e81` | `c9b8fad8d4eaa558e968a33898b3d79b35a08c9b40a9d54079f17e14258d26e1` | 4393 | — |
| `CLAUSE_CROSSWALK.json` | `5045980d15fdc4affd4e232b0dd07850f7e9bbad` | `41aafc35343c04903ea583fa0d7cd07f4674ea09791e6fd944652930b5dbedac` | 5791 | WP-ACC-005 |
| `CONTINUATION_STATE.json` | `55a04ac1d1e5d93656f1696c411bd3753c8b4e26` | `a266bb3ef7fd6b324a4ea89a0b30816b622a5aee41e259fa3a55f85e6d96a4b1` | 1397 | WP-ACC-004, WP-ACC-005 |
| `CONTROL_DESIGN.md` | `7d99bc56e4c0569f115d4d3b40301e4e7f97d4ad` | `e6903daeafdf6bbd3f388147373398cd87aeeb2d586cb4b4267aa67ef0cd3703` | 3544 | — |
| `EXECUTION_REPORT.md` | `5985b929e9f3862c6e698a215ed42a59230b2673` | `16580977b1817750f438674fcda7c8f6373f2478100ea043e2651118c50d32d3` | 1686 | WP-ACC-005 |
| `QUALITY_REVIEW.md` | `a15aa30151198948e01e710de08e461b4fde7ad3` | `11c3c9d0aefc4b35abfc504abf662de03dafd5fbddb87d3336739eb0900f0e00` | 2553 | WP-ACC-005 |
| `README.md` | `0f5b9bd7d95ea07c739d4267e0cc1b96df07439d` | `e9b45f0fad82049af375163c06e1f0f248fabde576788522622abb469d066e74` | 2592 | WP-ACC-004, WP-ACC-005 |

## Material source-asserted gaps and control holds
- `regulatory/checkpoints/AZ/ACCEPTANCE_SCENARIOS.json:65` — "expected": "Reject policy activation; log source discrepancy, maker-checker escalation.",
- `regulatory/checkpoints/AZ/ACCEPTANCE_SCENARIOS.json:79` — "expected": "Quarantine with owner, aging and audit; do not conceal discrepancy or post financial balance.",
- `regulatory/checkpoints/AZ/CONTINUATION_STATE.json:9` — "status": "OPEN_P0_BLOCKED",
- `regulatory/checkpoints/AZ/CONTINUATION_STATE.json:13` — "blocked_from_closure": 1,
- `regulatory/checkpoints/AZ/CONTROL_DESIGN.md:19` — 6. `CustodyInstruction`: RECEIVED → VALIDATED → CLASSIFIED → RECORDED → RECONCILED; uncertain ownership/source → INVESTIGATION_REQUIRED. No state transition directly posts money.
- `regulatory/checkpoints/AZ/EXECUTION_REPORT.md:3` — **Work package:** WP-ACC-005, still OPEN/P0-blocked. **Predecessor:** AY, verified commit `f085981c65378e110486ed22fe70fbec931e4106`. This is a research delta checkpoint, not WP completion or regulatory certification.
- `regulatory/checkpoints/AZ/EXECUTION_REPORT.md:10` — ¦ Blocked from closure ¦ 1 ¦
- `regulatory/checkpoints/AZ/EXECUTION_REPORT.md:22` — **Evidence:** COBAC Bulletin 6, printed pp.190–191, I-2003/01 Art.7(a)/(b), and I-2015/01 Arts.3–4,8, on issuer-hosted BEAC. Source custody remains blocked by working-container network access; do not claim a hash or cryptographic verification. This checkpoint corrects a material omission in the AY crosswalk without retroactively altering AY files or any post
- `regulatory/checkpoints/AZ/QUALITY_REVIEW.md:3` — - **Regulatory/legal — FAIL for activation.** Primary-hosted 2003 Art.7(a)/(b) explicitly corrects 2002 908→918 and 928→938. 2003 Art.9 states 2004-01-01. Later current consolidation, publication/effect evidence, 2018 legal opinion and 01/25–02/25 judicial/implementation evidence unresolved.
- `regulatory/checkpoints/AZ/README.md:3` — **Date:** 2026-11-01. **Phase:** 4, Accounting Core / Financial Integrity. **Active WP:** WP-ACC-005 (OPEN, P0-blocked). **Predecessor:** AY, verified main commit `f085981c65378e110486ed22fe70fbec931e4106`. **Last completed WP:** WP-ACC-004 (inherited, not independently reaudited).
- `regulatory/checkpoints/AZ/README.md:19` — `CLAUSE_CROSSWALK.json` records observed amendments, provenance and unresolved issues. `CONTROL_DESIGN.md` sets proposed chart/custody boundaries. `ACCEPTANCE_SCENARIOS.json` specifies unexecuted cases. `QUALITY_REVIEW.md`, `CONTINUATION_STATE.json`, and `EXECUTION_REPORT.md` preserve review and continuation.

## Multidisciplinary QA and DoR status
Regulatory/legal: historical citations and effective dates require direct primary issuer validation; source claims alone do not establish adoption or legal status. CFO/ledger: no monetary journal, accounting account mapping or migration updated. PCEC 312/322 textual inconsistency remains P0. Architecture: document lineage is not proof of Git ancestry or independent WP completion. Identity/security/AML: no privilege, customer KYC, sanctions or payment-rail entitlement assumed. Workflow/payments: external outcomes and reversals remain fail-closed. Data/privacy: preserved source-path, line-level excerpt, Git blob and SHA-256 evidence; legal retention authority not independently adjudicated. Resilience/ops: no deployment or recovery test. Testing: zero banking tests executed in this audit. No reviewer signatures or 15-gate DoR pass; all historical success statements remain unverified.

## Batch conclusion
Evidence archive may be marked DRAFT REMOTELY DELIVERED only after GitHub main branch, per-file extracted content, ZIP Git blob and downloaded ZIP SHA-256 independently match. This does NOT complete GOV-REC-001 nor WP-ACC-005; historical WBS denominator UNKNOWN. Next audit: batch 163 (or reconciliation after batch 180).
