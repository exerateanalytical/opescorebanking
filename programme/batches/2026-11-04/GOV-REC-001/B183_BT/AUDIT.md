# GOV-REC-001 — Historical Source Audit, Batch 183 / Checkpoint BT

Date: 2026-11-04. Source: GitHub exerateanalytical/opescorebanking@ee13700c466053bdc3a5e4fb468e65fad939aee1. Registered plan: governance/GOV_REC_001_SUBBATCH_PLAN_151_180_2026-11-04.md.

## Source completeness (not engineering acceptance)
Read every 7 tracked source blob in `regulatory/checkpoints/BT/`; each blob SHA was independently compared with the pinned source tree. Verbatim text source copies are in the ZIP SOURCE/ directory. This covers only this checkpoint directory, not the original missing cumulative archives or the complete programme.

## Inherited assertions, not accepted facts
- Previous historical checkpoint: NOT STATED.
- Reported phase: Phase 4 — Accounting Core / Financial Integrity.
- Reported active package: NOT STATED.
- Reported package state: OPEN_P0_BLOCKED.
- Reported DoR: FAIL.
- WP IDs mentioned in source text: WP-ACC-004, WP-ACC-005.
- Exact historical next task (claim): WP-ACC-005 — Checkpoint BU: obtain issuer-authenticated operative current amendments to 04/18, R-2019/01–02 and Circular 004/2023, request BEAC/COBAC legal clarification on bank/product/channel applicability, validate institution contracts/permissions, continue COBAC/PCEC/01-25/02-25 P0. No production implementation..
- JSON parse failures: none.

## Source ledger
| Name | Git blob SHA | SHA-256 of retrieved text | Bytes | WP mentions |
|---|---|---|---:|---|
| `CONTINUATION_STATE.json` | `27ea8c0f19dead22a886abe5144cc82e2fafe5d2` | `1af376d7000ec71db17200010bf506ce56689247ab7bc2ccdb12e14276d1a319` | 2063 | WP-ACC-004, WP-ACC-005 |
| `CONTROL_AND_TEST_DESIGN.md` | `4338813c22d526a91698cf24ffb2ed5b2715ac99` | `30aa0794123fb10d84488692e75afa913f1a314bf10d9963af2e6a9f5d81a83e` | 5905 | — |
| `EXECUTION_REPORT.md` | `5545d43532293080de44114d77ad22b23e8fac16` | `5432febec9d55682e7d81fd33928e16d0cd5b18b99da780d13926ed5357995a5` | 2052 | WP-ACC-005 |
| `QUALITY_REVIEW.md` | `615de7a4a45dccbd37a19a4e5e901a755b21a8c0` | `10378111b51421471868b825cb05216bcbd7dd9dfe3e2ce8e1781a8ffd55e36c` | 2150 | WP-ACC-005 |
| `README.md` | `c21e569192b57e986bc116b5584420643a61a3d8` | `3da5d3ab764e8c33298bcb3ebe58be862b5a37a6d1bf92c0e3d14524796590a3` | 2512 | WP-ACC-005 |
| `SCOPE_RECONCILIATION_AND_POLICY_GATES.json` | `b00c516bc24939a4ea2809c0e34b20184954486b` | `3a081becacf177d4b28db0740d280106bef373c1978be49cf62a9eab501ab3da` | 5042 | WP-ACC-005 |
| `SOURCE_EVIDENCE_AND_LIMITATIONS.md` | `fc70bc500e3d481c92c8f78f6240e0d071629780` | `b1bf95d82c43aac804aa51f48f50669e39398302d58e86ffac8baaa935bfd36d` | 3693 | — |

## Material source-asserted gaps and control holds
- `regulatory/checkpoints/BT/CONTINUATION_STATE.json:9` — "status": "OPEN_P0_BLOCKED",
- `regulatory/checkpoints/BT/CONTINUATION_STATE.json:14` — "work_packages_blocked_from_closure": 1,
- `regulatory/checkpoints/BT/CONTROL_AND_TEST_DESIGN.md:4` — **ADR-BT-01 (proposed, not accepted):** Split PSP legal category from payment institution exclusive-service constraint. Regulation 04/18 Article 5 + BEAC 2024 Financial Stability Review support broad PSP categories; the latter is explanatory and cannot supersede a binding circular. The circular's particular bank/product applicability stays `LEGAL_SCOPE_UNRES
- `regulatory/checkpoints/BT/CONTROL_AND_TEST_DESIGN.md:13` — ¦ Licensed bank ¦ Conventional transfer ¦ SYSTAC2 ¦ No signed legal interpretation/terms ¦ SCOPE_UNRESOLVED ¦
- `regulatory/checkpoints/BT/CONTROL_AND_TEST_DESIGN.md:14` — ¦ Licensed bank ¦ Instant merchant payment ¦ Mobile or non-mobile ¦ Circular Section IV potentially relevant, not adjudicated ¦ SCOPE_UNRESOLVED ¦
- `regulatory/checkpoints/BT/CONTROL_AND_TEST_DESIGN.md:15` — ¦ Licensed payment institution ¦ Erroneous mobile transfer ¦ Mobile ¦ Potential Section I relevance; current terms/amendments missing ¦ SCOPE_UNRESOLVED ¦
- `regulatory/checkpoints/BT/EXECUTION_REPORT.md:4` — **Work package:** WP-ACC-005 — OPEN P0 BLOCKED
- `regulatory/checkpoints/BT/EXECUTION_REPORT.md:14` — ¦ Work packages blocked from closure ¦ 1 ¦
- `regulatory/checkpoints/BT/EXECUTION_REPORT.md:25` — BEAC official Financial Stability Review (2024 edition, Encadré 3) confirms PSP includes credit institutions, EMFs and payment institutions; 'exclusively payment services' characterizes payment institutions. BEAC 2024 payment-services report corroborates distinct categories and refund/claims operations. **Neither publication is a binding legal interpretation
- `regulatory/checkpoints/BT/QUALITY_REVIEW.md:10` — ¦ Workflow/state ¦ Scope-unresolved, consent/contest, unknown external outcome and reconciliation separated ¦ Proposed only ¦
- `regulatory/checkpoints/BT/QUALITY_REVIEW.md:15` — ¦ Usability/accessibility ¦ Operators must see legal-scope unresolved and no auto-action; no UI implementation ¦ OPEN ¦
- `regulatory/checkpoints/BT/README.md:5` — **Work package:** WP-ACC-005 (OPEN, P0 BLOCKED)
- `regulatory/checkpoints/BT/README.md:7` — **Scope:** Narrow BS category-definition uncertainty using BEAC primary institutional publications; retain legal/financial implementation holds.
- `regulatory/checkpoints/BT/SCOPE_RECONCILIATION_AND_POLICY_GATES.json:36` — "unresolved": "whether and how 2023 circular applies to a specific bank/product/rail and customer contract",
- `regulatory/checkpoints/BT/SCOPE_RECONCILIATION_AND_POLICY_GATES.json:42` — "unresolved": "Section I mobile erroneous transfer versus Section IV instant/merchant mobile-or-not; precise scope and timers",
- `regulatory/checkpoints/BT/SCOPE_RECONCILIATION_AND_POLICY_GATES.json:48` — "unresolved": "actor-specific exceptions under 2018 Article 1; central-bank settlement leg not same as underlying customer payment"
- `regulatory/checkpoints/BT/SCOPE_RECONCILIATION_AND_POLICY_GATES.json:53` — "unresolved": "payment-institution-only restrictions not applicable to banks by category alone"

## Multidisciplinary QA and DoR status
Regulatory/legal: historical citations and effective dates require direct primary issuer validation; source claims alone do not establish adoption or legal status. CFO/ledger: no monetary journal, accounting account mapping or migration updated. PCEC 312/322 textual inconsistency remains P0. Architecture: document lineage is not proof of Git ancestry or independent WP completion. Identity/security/AML: no privilege, customer KYC, sanctions or payment-rail entitlement assumed. Workflow/payments: external outcomes and reversals remain fail-closed. Data/privacy: preserved source-path, line-level excerpt, Git blob and SHA-256 evidence; legal retention authority not independently adjudicated. Resilience/ops: no deployment or recovery test. Testing: zero banking tests executed in this audit. No reviewer signatures or 15-gate DoR pass; all historical success statements remain unverified.

## Batch conclusion
Evidence archive may be marked DRAFT REMOTELY DELIVERED only after GitHub main branch, per-file extracted content, ZIP Git blob and downloaded ZIP SHA-256 independently match. This does NOT complete GOV-REC-001 nor WP-ACC-005; historical WBS denominator UNKNOWN. Next audit: batch 184 (or reconciliation after batch 180).
