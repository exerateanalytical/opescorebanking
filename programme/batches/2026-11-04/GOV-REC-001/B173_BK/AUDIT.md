# GOV-REC-001 — Historical Source Audit, Batch 173 / Checkpoint BK

Date: 2026-11-04. Source: GitHub exerateanalytical/opescorebanking@9c2476b94a1af7dbfac31684679332bc9e401207. Registered plan: governance/GOV_REC_001_SUBBATCH_PLAN_151_180_2026-11-04.md.

## Source completeness (not engineering acceptance)
Read every 7 tracked source blob in `regulatory/checkpoints/BK/`; each blob SHA was independently compared with the pinned source tree. Verbatim text source copies are in the ZIP SOURCE/ directory. This covers only this checkpoint directory, not the original missing cumulative archives or the complete programme.

## Inherited assertions, not accepted facts
- Previous historical checkpoint: BJ.
- Reported phase: Phase 4 — Accounting Core / Financial Integrity.
- Reported active package: NOT STATED.
- Reported package state: OPEN_P0_BLOCKED.
- Reported DoR: FAIL.
- WP IDs mentioned in source text: WP-ACC-004, WP-ACC-005.
- Exact historical next task (claim): WP-ACC-005 — Checkpoint BL: obtain signed COBAC rectification/interpretation of D-2025/328 Article 2 (R-2020/02 vs R-2020/01) and 37/36 discrepancy; obtain issuer-authenticated R-2020/01 and R-2020/02, subsequent amendments, original bytes/hashes/publication/notification, Article 7 precise quotity and bank-specific eligibility decisions; continue PCEC and 01/25–02/25 source/judicial/settlement evidence. Preserve P0 hold..
- JSON parse failures: none.

## Source ledger
| Name | Git blob SHA | SHA-256 of retrieved text | Bytes | WP mentions |
|---|---|---|---:|---|
| `CONTINUATION_STATE.json` | `aa4eb9de5c9c5435e9e0b22764cbcf5fb8e72b96` | `360aa792973c7c4828d74660e0d011941c5ef3f77a130a459e5cb066562c1aaf` | 1691 | WP-ACC-004, WP-ACC-005 |
| `CONTROL_AND_TEST_DESIGN.md` | `1b01e8aca95bb0a4df45aabc4a640180b7238286` | `9a0abea7e28b8794d3b8300ce5382982621b1dd746f445c08d1d90bafc54902c` | 5613 | — |
| `EXECUTION_REPORT.md` | `bc0433d85cead5c0f1c89b1bf2824e5019df668b` | `4b3343687fc28e2eaa7ae5d26588ac3dded27f8e5c9a5051b0092d9f1bc2acc3` | 1865 | WP-ACC-004, WP-ACC-005 |
| `QUALITY_REVIEW.md` | `70913c04e4c5777de9df112f9ff08f75513c1f28` | `47bcc680252c7c6f723e3401f5b53a2aa07fafcc08af723a88e765b98229a129` | 2464 | WP-ACC-005 |
| `README.md` | `7a9680651621cc0195a94e7f93a96914db52a5da` | `1aada15bb191bd2d7d6614345bc65fc527d0838869e0b6090ba35c54c50d3ffd` | 4052 | WP-ACC-004, WP-ACC-005 |
| `REGULATORY_CONFLICT_AND_GATE_REGISTER.json` | `2ba69187f06843f7d3c49b22f10ebf200c0cec5c` | `8ceae220273ed7edd14dbe07ebb366a8e7fb4379debe2adb50bec5dfc8a0ea34` | 3995 | WP-ACC-004, WP-ACC-005 |
| `SOURCE_AND_AUTHORITY_DELTA.md` | `2572cea391a0743fa9c551597d0a3c21261bc463` | `3dd121697c7b845043b96c80d0d056f9cf67a8e547729efe837ac0bebbaa4c6b` | 4868 | — |

## Material source-asserted gaps and control holds
- `regulatory/checkpoints/BK/CONTINUATION_STATE.json:8` — "status": "OPEN_P0_BLOCKED",
- `regulatory/checkpoints/BK/CONTINUATION_STATE.json:13` — "work_packages_blocked_from_closure": 1,
- `regulatory/checkpoints/BK/CONTINUATION_STATE.json:26` — "next_exact_task": "WP-ACC-005 — Checkpoint BL: obtain signed COBAC rectification/interpretation of D-2025/328 Article 2 (R-2020/02 vs R-2020/01) and 37/36 discrepancy; obtain issuer-authenticated R-2020/01 and R-2020/02, subsequent amendments, original bytes/hashes/publication/notification, Article 7 precise quotity and bank-specific eligibility decisions; 
- `regulatory/checkpoints/BK/CONTROL_AND_TEST_DESIGN.md:22` — **Proposed API boundaries:** `POST /v1/regulatory/evidence` accepts source reference only into QUARANTINED pending hash and review; `POST /v1/regulatory/rosters/{id}/reconcile` produces an immutable discrepancy report, never silently edits a count; `POST /v1/risk/exposure-assessments` defaults to STANDARD_NO_RELIEF if any gate is absent; `POST /v1/regulatory
- `regulatory/checkpoints/BK/EXECUTION_REPORT.md:4` — **Work packages attempted 1; completed 0; kept open 1; blocked from closure 1; dependent packages attempted 0.** Work package WP-ACC-005 remains OPEN/P0 BLOCKED. Last completed WP-ACC-004 inherited/not independently reaudited.
- `regulatory/checkpoints/BK/QUALITY_REVIEW.md:5` — ¦ Regulatory/legal ¦ BLOCKED ¦ Signed issuer correction of R-2020/02 citation, annual roster discrepancy, amendment/publication chain ¦
- `regulatory/checkpoints/BK/QUALITY_REVIEW.md:6` — ¦ Financial/accounting/CFO ¦ BLOCKED ¦ Bank-approved PCEC mapping; no ledger side effects from prudential labels ¦
- `regulatory/checkpoints/BK/QUALITY_REVIEW.md:7` — ¦ Credit/prudential risk ¦ BLOCKED ¦ R-2020/01 Article 7 formula, bank-side eligibility, eligible exposure perimeter and current amendments ¦
- `regulatory/checkpoints/BK/QUALITY_REVIEW.md:13` — ¦ Payments/settlement ¦ BLOCKED/OUT OF SCOPE ¦ No posting or settlement from eligibility; unresolved 01/25–02/25 evidence ¦
- `regulatory/checkpoints/BK/README.md:2` — Date: 2026-11-02. Verified predecessor: BJ (GitHub `CONTINUATION_STATE.json` and contradiction register inspected). Phase 4 — Accounting Core / Financial Integrity. Last reported completed package: WP-ACC-004 (inherited, not reaudited). Active package: WP-ACC-005 OPEN/P0 BLOCKED.
- `regulatory/checkpoints/BK/README.md:10` — Do not auto-activate 2026 preferential large-exposure treatment. Keep `D-2025/328` as unapproved reference evidence with a conflicting roster count (37 in recitals, 36 enumerated), conflicting cross-instrument reference, uncertain precise reduction semantics, unverified original bytes, no signed issuer rectification, no bank-specific authorization and no ban
- `regulatory/checkpoints/BK/README.md:23` — WP-ACC-005 — Checkpoint BL: acquire issuer-authenticated rectification or written interpretation of D-2025/328's Article 2 cross-reference and 37/36 discrepancy; obtain original signed R-2020/01/R-2020/02 and later amendments, confirm precise Article 7 quotity semantics and institution-specific COBAC eligibility, retain original bytes/hashes/notification/eff
- `regulatory/checkpoints/BK/REGULATORY_CONFLICT_AND_GATE_REGISTER.json:74` — "reason": "Quotity reduction scope/formula and subsequent amendments not certified",
- `regulatory/checkpoints/BK/SOURCE_AND_AUTHORITY_DELTA.md:14` — ## New or refined unresolved issues

## Multidisciplinary QA and DoR status
Regulatory/legal: historical citations and effective dates require direct primary issuer validation; source claims alone do not establish adoption or legal status. CFO/ledger: no monetary journal, accounting account mapping or migration updated. PCEC 312/322 textual inconsistency remains P0. Architecture: document lineage is not proof of Git ancestry or independent WP completion. Identity/security/AML: no privilege, customer KYC, sanctions or payment-rail entitlement assumed. Workflow/payments: external outcomes and reversals remain fail-closed. Data/privacy: preserved source-path, line-level excerpt, Git blob and SHA-256 evidence; legal retention authority not independently adjudicated. Resilience/ops: no deployment or recovery test. Testing: zero banking tests executed in this audit. No reviewer signatures or 15-gate DoR pass; all historical success statements remain unverified.

## Batch conclusion
Evidence archive may be marked DRAFT REMOTELY DELIVERED only after GitHub main branch, per-file extracted content, ZIP Git blob and downloaded ZIP SHA-256 independently match. This does NOT complete GOV-REC-001 nor WP-ACC-005; historical WBS denominator UNKNOWN. Next audit: batch 174 (or reconciliation after batch 180).
