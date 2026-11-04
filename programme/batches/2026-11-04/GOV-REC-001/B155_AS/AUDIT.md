# GOV-REC-001 — Historical Source Audit, Batch 155 / Checkpoint AS

Date: 2026-11-04. Source: GitHub exerateanalytical/opescorebanking@9c2476b94a1af7dbfac31684679332bc9e401207. Registered plan: governance/GOV_REC_001_SUBBATCH_PLAN_151_180_2026-11-04.md.

## Source completeness (not engineering acceptance)
Read every 8 tracked source blob in `regulatory/checkpoints/AS/`; each blob SHA was independently compared with the pinned source tree. Verbatim text source copies are in the ZIP SOURCE/ directory. This covers only this checkpoint directory, not the original missing cumulative archives or the complete programme.

## Inherited assertions, not accepted facts
- Previous historical checkpoint: AR.
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
| `ACCEPTANCE_SCENARIOS.json` | `ea9078937a3195bb56036de20f67dff509e43a8f` | `0c402329fc7aec590612e5b9fc74dd0da9ff0b6bf710a63c47986b1c06d9774d` | 2610 | — |
| `CONTINUATION_STATE.json` | `23fa8e3df37bd780954dddf49ed9a9ed0b84c9c2` | `c260b8f985e00db7332a9f3d17f0cb1e961af184fad25eaa97b1d316fc2cdf39` | 1616 | WP-ACC-004, WP-ACC-005 |
| `EVIDENCE_MATRIX.json` | `4c1de97b74c1d182fe57a2b64c26fb1aa744fd51` | `f7bc4595a1564631764a307ae7a308657bc5736850bbcd374d03801c318290d3` | 4496 | WP-ACC-005 |
| `EXECUTION_REPORT.md` | `4ff19a6788ba19c5e6ff19e9e98c379e3cb3cf62` | `29a9f105b0af8dd302223f64a04eb08715c6c2669e245505145c0d1617942cdf` | 1707 | WP-ACC-005 |
| `PRIMARY_EVIDENCE.md` | `9a93fa08f6057e1aaebefc0646bb9dc49fcc1751` | `c981337c835c9f4495bf8791a9bb31b5ee0f090e0962cc981674d9c2f9c0f9f7` | 4762 | — |
| `QUALITY_REVIEW.md` | `6815b9c240d590904c69c801851611e4da308a2a` | `b58072553f59077a12824190d19ab61c3ee4556726feb4f01d7fc7429be7e517` | 2525 | WP-ACC-005 |
| `README.md` | `ed04760ac80237e985ffac6773a1f1630ad81cb2` | `22cc1ad3c11140adbdde7ecc398842c20520aee4b483d82b3447b3bf1398ffaa` | 1943 | WP-ACC-004, WP-ACC-005 |
| `REQUIREMENTS_AND_CONTROLS.md` | `16551de967f626e72ea15ab5a7b1bd3416f173a4` | `7d7690379698f936d951c86d595701569e4511e94dc00d8b0a2644f83d141655` | 4032 | — |

## Material source-asserted gaps and control holds
- `regulatory/checkpoints/AS/ACCEPTANCE_SCENARIOS.json:10` — "given": "A third-party PDF provides number 02/25 but printed page 10 is missing",
- `regulatory/checkpoints/AS/CONTINUATION_STATE.json:8` — "status": "OPEN_P0_BLOCKED",
- `regulatory/checkpoints/AS/CONTINUATION_STATE.json:12` — "work_packages_blocked_from_closure": 1,
- `regulatory/checkpoints/AS/CONTINUATION_STATE.json:23` — "canonical_next_exact_task": "WP-ACC-005 — Checkpoint AT: obtain issuer-authenticated complete signed 01/25 and 02/25 with printed page 10 and annexes, map the officially confirmed 2025-07-12 adoption event to numbered instruments, certify CEMAC Bulletin issue/page/effective-date chain, separate court dispositions, original COBAC–MINFI letter, final implemen
- `regulatory/checkpoints/AS/EVIDENCE_MATRIX.json:111` — "missing_printed_page": "10",
- `regulatory/checkpoints/AS/EXECUTION_REPORT.md:4` — **Attempted 1; completed 0; kept open 1; blocked from closure 1; dependent packages attempted 0.**
- `regulatory/checkpoints/AS/PRIMARY_EVIDENCE.md:2` — Research date: 2026-11-01. No external request sent. Source PDF images were inspected via browser rendering. The original PDF bytes were **not** retained in this checkpoint; no SHA-256 or digital signature verification is claimed. Issuer hosting and visible signatures/stamps support provenance at the public-publication level but are not certified instrument 
- `regulatory/checkpoints/AS/PRIMARY_EVIDENCE.md:38` — - Incomplete third-party 02/25 reproduction with printed page 10 missing remains **unfit for authoritative extraction**.
- `regulatory/checkpoints/AS/PRIMARY_EVIDENCE.md:41` — Upgrade the **adoption-event** finding only; **do not** upgrade instrument identity, text completeness, publication, effective date, court effect, accounting approval or transfer authorization. Qualified CEMAC counsel must assess final legal applicability against original signed records. Missing source binaries and signatures are explicit evidence-custody ga
- `regulatory/checkpoints/AS/QUALITY_REVIEW.md:2` — **Outcome: WP-ACC-005 OPEN / P0 BLOCKED / DoR FAIL.** No approval to implement. Adoption-event provenance is strengthened, but the legally and financially controlling evidence chain is not complete.
- `regulatory/checkpoints/AS/QUALITY_REVIEW.md:4` — ¦ Perspective ¦ Review and unresolved issue ¦
- `regulatory/checkpoints/AS/QUALITY_REVIEW.md:11` — ¦ Workflow/state consistency ¦ Adoption node cannot skip legal, CFO, four-eyes or reconciliation gates; missing/failure paths remain unimplemented. ¦
- `regulatory/checkpoints/AS/README.md:2` — Date: 2026-11-01. Predecessor: AR, verified on remote `main`. Phase 4: Accounting Core and Financial Integrity. Last completed WP: WP-ACC-004 (inherited, not reaudited). Active WP: WP-ACC-005 (OPEN, P0 BLOCKED).
- `regulatory/checkpoints/AS/REQUIREMENTS_AND_CONTROLS.md:17` — 4. Financial operation idempotency, exact arithmetic, double-entry and immutable posted journals remain unchanged. Unknown external outcomes remain unresolved pending independent reconciliation.
- `regulatory/checkpoints/AS/REQUIREMENTS_AND_CONTROLS.md:23` — - **GAP-ACC-069 OPEN P0 candidate**: instrument-specific publication issue/page/date and effective-date chain; now explicitly distinguish adoption communiqué evidence from this missing proof.

## Multidisciplinary QA and DoR status
Regulatory/legal: historical citations and effective dates require direct primary issuer validation; source claims alone do not establish adoption or legal status. CFO/ledger: no monetary journal, accounting account mapping or migration updated. PCEC 312/322 textual inconsistency remains P0. Architecture: document lineage is not proof of Git ancestry or independent WP completion. Identity/security/AML: no privilege, customer KYC, sanctions or payment-rail entitlement assumed. Workflow/payments: external outcomes and reversals remain fail-closed. Data/privacy: preserved source-path, line-level excerpt, Git blob and SHA-256 evidence; legal retention authority not independently adjudicated. Resilience/ops: no deployment or recovery test. Testing: zero banking tests executed in this audit. No reviewer signatures or 15-gate DoR pass; all historical success statements remain unverified.

## Batch conclusion
Evidence archive may be marked DRAFT REMOTELY DELIVERED only after GitHub main branch, per-file extracted content, ZIP Git blob and downloaded ZIP SHA-256 independently match. This does NOT complete GOV-REC-001 nor WP-ACC-005; historical WBS denominator UNKNOWN. Next audit: batch 156 (or reconciliation after batch 180).
