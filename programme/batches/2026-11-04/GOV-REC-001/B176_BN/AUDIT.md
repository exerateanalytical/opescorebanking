# GOV-REC-001 — Historical Source Audit, Batch 176 / Checkpoint BN

Date: 2026-11-04. Source: GitHub exerateanalytical/opescorebanking@9c2476b94a1af7dbfac31684679332bc9e401207. Registered plan: governance/GOV_REC_001_SUBBATCH_PLAN_151_180_2026-11-04.md.

## Source completeness (not engineering acceptance)
Read every 7 tracked source blob in `regulatory/checkpoints/BN/`; each blob SHA was independently compared with the pinned source tree. Verbatim text source copies are in the ZIP SOURCE/ directory. This covers only this checkpoint directory, not the original missing cumulative archives or the complete programme.

## Inherited assertions, not accepted facts
- Previous historical checkpoint: BM.
- Reported phase: Phase 4 — Accounting Core / Financial Integrity.
- Reported active package: NOT STATED.
- Reported package state: OPEN_P0_BLOCKED.
- Reported DoR: FAIL.
- WP IDs mentioned in source text: WP-ACC-004, WP-ACC-005.
- Exact historical next task (claim): WP-ACC-005 — Checkpoint BO: obtain issuer-authenticated full operative R-2020/01 and R-2021/02 with amendment chain and the corrected D-2025/328; resolve 2010 scan article-number anomaly, 2026 relief semantics, count, citation, identity and effective dates. Secure bank-specific COBAC eligibility, connected-obligor/guarantee/sovereign-weighting methodology and approved PCEC mappings; continue Regulations 01/25–02/25 publication, judicial and settlement evidence. Preserve P0 hold..
- JSON parse failures: none.

## Source ledger
| Name | Git blob SHA | SHA-256 of retrieved text | Bytes | WP mentions |
|---|---|---|---:|---|
| `CLAUSE_LINEAGE_AND_EXPOSURE_MODEL.json` | `cb69bbdbfaca46fc06bf51028f8887aa7d8338d0` | `09bd161349ddbb343488dda6d64fe4dcd175a4ec8ee3ee6c7c61732a27de4fe3` | 6141 | WP-ACC-005 |
| `CONTINUATION_STATE.json` | `823beb36b2622c0a7a379ec0a2bae0293355ae8b` | `6be28ff8ef587b3a76f19acc261723264052f64e5ef9f5052688a809e057fc92` | 2299 | WP-ACC-004, WP-ACC-005 |
| `CONTROL_AND_TEST_DESIGN.md` | `53139c88e0d4c5d40f262ff4d2236db7507d70b8` | `aa27c70310d209726b94591c7276ca84197cb6b062d0b09d38823db3585094bd` | 5562 | — |
| `EVIDENCE_DELTA.md` | `ca95cef4ad11fabe45c0f300afbdb81272c91e1b` | `84f3a201f743e57401a20ef3c3f66343a80d39ed075de790042fa17003d752b8` | 4665 | — |
| `EXECUTION_REPORT.md` | `c59218d83d66e3fc3c6ecb1fbcadfa3b77d2104c` | `166e398ee104259fef6e733d6ce08da722fd1b14eb22f06956353d52562ae746` | 2203 | WP-ACC-005 |
| `QUALITY_REVIEW.md` | `dc370d784c515091334f17c5a0647e34cfd86f50` | `8e3e1dbcb0272afb02eec8992e5ab6834ec77a9684aa7ac1d9385ea7a6df0f38` | 2306 | WP-ACC-005 |
| `README.md` | `fefb3b6057724d4a25f1adb0c7f24532098f4b5d` | `4bfd5d8765a5407bcf7fba8a31ec0091018fc80f2eeec0cd4458900ee81350b5` | 2623 | WP-ACC-004, WP-ACC-005 |

## Material source-asserted gaps and control holds
- `regulatory/checkpoints/BN/CLAUSE_LINEAGE_AND_EXPOSURE_MODEL.json:76` — "gate": "instruction and schema missing"
- `regulatory/checkpoints/BN/CLAUSE_LINEAGE_AND_EXPOSURE_MODEL.json:108` — "gate": "original clauses and eligibility evidence missing"
- `regulatory/checkpoints/BN/CLAUSE_LINEAGE_AND_EXPOSURE_MODEL.json:153` — "unresolved": [
- `regulatory/checkpoints/BN/CONTINUATION_STATE.json:9` — "status": "OPEN_P0_BLOCKED",
- `regulatory/checkpoints/BN/CONTINUATION_STATE.json:14` — "work_packages_blocked_from_closure": 1,
- `regulatory/checkpoints/BN/CONTINUATION_STATE.json:36` — "D-2025/328 conflicting semantics/count/citation/identity remain unresolved"
- `regulatory/checkpoints/BN/CONTROL_AND_TEST_DESIGN.md:12` — - BN-REQ-08: Annual roster entry, bank-specific supervisory eligibility and formula version are independent gates. Missing or conflicting legal evidence returns `NO_COMPLIANCE_DETERMINATION`.
- `regulatory/checkpoints/BN/CONTROL_AND_TEST_DESIGN.md:32` — 6. An off-balance guarantee is omitted from the inventory solely because it is not a posted GL debit: block incomplete assessment.
- `regulatory/checkpoints/BN/CONTROL_AND_TEST_DESIGN.md:43` — Fail-closed and alert on incomplete sources, amendment ambiguity, identity conflict, source integrity failure, stale guarantees, missing bank approvals, duplicate events, inaccessible legal holds or irreconcilable bitemporal versions. Preserve recovery/replay logs. Operational metrics and alert thresholds remain to be institution-approved.
- `regulatory/checkpoints/BN/EVIDENCE_DELTA.md:14` — 4. **Republic of Congo government-hosted D-2025/328:** https://www.finances.gouv.cg/fr/download/file/fid/9493 (government catalogue https://www.finances.gouv.cg/fr/d%C3%A9cision-cobac-d-2025328-arr%C3%AAtant-la-liste-des-entreprises-de-grand-standing-et-dimportance). Browser-extracted body rechecked; the operative Article 1 enumerates 11+6+10+2+7=36, while r
- `regulatory/checkpoints/BN/EVIDENCE_DELTA.md:25` — BN-P0-02: D-2025/328 conflicts and exact reduction semantics unresolved.
- `regulatory/checkpoints/BN/EXECUTION_REPORT.md:3` — **Disposition:** OPEN/P0 BLOCKED. **DoR:** FAIL. **No dependent work package attempted.**
- `regulatory/checkpoints/BN/EXECUTION_REPORT.md:10` — ¦ Blocked from closure ¦ 1 ¦
- `regulatory/checkpoints/BN/QUALITY_REVIEW.md:4` — ¦ Regulatory/legal ¦ Official BEAC-hosted historical R-2010/02 inspected; current 2020/2021 amendments and 2026 corrigendum missing; final-page article-number anomaly ¦ P0 BLOCKED ¦
- `regulatory/checkpoints/BN/QUALITY_REVIEW.md:5` — ¦ Financial/accounting ¦ Historical exposure weights are not current authority; prudential projections never mutate GL or settlement ¦ P0 BLOCKED ¦
- `regulatory/checkpoints/BN/QUALITY_REVIEW.md:7` — ¦ Cyber/identity/cryptography ¦ Issuer-hosted visual review is not cryptographic document authentication; legal-entity IDs and bank authorization unavailable ¦ P0 BLOCKED ¦
- `regulatory/checkpoints/BN/QUALITY_REVIEW.md:8` — ¦ AML/fraud/risk ¦ Connected-beneficiary grouping and guarantees need documented provenance; beneficial ownership and sanction controls unaffected ¦ P0 BLOCKED ¦
- `regulatory/checkpoints/BN/README.md:2` — **Phase:** 4 — Accounting Core / Financial Integrity. **Package:** WP-ACC-005 (OPEN / P0 BLOCKED). **Predecessor:** BM, remotely verified on main at `cb37148b97a72fbb71c972adae545703ee05ae92`.
- `regulatory/checkpoints/BN/README.md:9` — - The BEAC-hosted 2021 financial-stability review explicitly confirms R-2021/02 amended R-2010/02 and discusses **conditional** zero treatment for certain state-issued instruments with secured repayment. Original operative 2021 amendment remains missing. No automatic zero-weighting is authorized.

## Multidisciplinary QA and DoR status
Regulatory/legal: historical citations and effective dates require direct primary issuer validation; source claims alone do not establish adoption or legal status. CFO/ledger: no monetary journal, accounting account mapping or migration updated. PCEC 312/322 textual inconsistency remains P0. Architecture: document lineage is not proof of Git ancestry or independent WP completion. Identity/security/AML: no privilege, customer KYC, sanctions or payment-rail entitlement assumed. Workflow/payments: external outcomes and reversals remain fail-closed. Data/privacy: preserved source-path, line-level excerpt, Git blob and SHA-256 evidence; legal retention authority not independently adjudicated. Resilience/ops: no deployment or recovery test. Testing: zero banking tests executed in this audit. No reviewer signatures or 15-gate DoR pass; all historical success statements remain unverified.

## Batch conclusion
Evidence archive may be marked DRAFT REMOTELY DELIVERED only after GitHub main branch, per-file extracted content, ZIP Git blob and downloaded ZIP SHA-256 independently match. This does NOT complete GOV-REC-001 nor WP-ACC-005; historical WBS denominator UNKNOWN. Next audit: batch 177 (or reconciliation after batch 180).
