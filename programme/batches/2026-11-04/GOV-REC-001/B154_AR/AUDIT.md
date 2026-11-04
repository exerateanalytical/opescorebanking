# GOV-REC-001 — Historical Source Audit, Batch 154 / Checkpoint AR

Date: 2026-11-04. Source: GitHub exerateanalytical/opescorebanking@9c2476b94a1af7dbfac31684679332bc9e401207. Registered plan: governance/GOV_REC_001_SUBBATCH_PLAN_151_180_2026-11-04.md.

## Source completeness (not engineering acceptance)
Read every 10 tracked source blob in `regulatory/checkpoints/AR/`; each blob SHA was independently compared with the pinned source tree. Verbatim text source copies are in the ZIP SOURCE/ directory. This covers only this checkpoint directory, not the original missing cumulative archives or the complete programme.

## Inherited assertions, not accepted facts
- Previous historical checkpoint: AQ.
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
| `ACCEPTANCE_SCENARIOS.json` | `4356286924c833084c84fd74b11f026290a21b18` | `4e38979d30b27a36576938f99d86ab4902c0edb34915d7d460e1b31f1520f7a0` | 3269 | — |
| `CONTINUATION_STATE.json` | `927f60ea7bc5d4a8dd063a4a5501e00b8fee838c` | `6c9c3e70c12f24ca0bb52995d12826a6208e49521e81983f77edf0ea65c63b81` | 1373 | WP-ACC-004, WP-ACC-005 |
| `EVIDENCE_REQUESTS_FR.md` | `76b8609069e302ed296a97f2534188105ea5c853` | `dfd95d63558a835bc446049e841fa97bb260d0e1f46eafc6d54537c92705aace` | 3121 | — |
| `EXECUTION_REPORT.md` | `c24571fb7dbc2ce53de6c05ee169e46df8002a7c` | `fce34c11218f057d2946897fb73636cec3cfe452c5f129c4e4206ab4141d22e9` | 1378 | WP-ACC-005 |
| `GAP_DELTA.md` | `0613661726e3462119b8c62357c3799bc6af5e82` | `5471d25cbb1e98a2dcb52145012b3f0ee66f62bd96927edb905a86c63c41393c` | 1761 | — |
| `POLICY_AUTHORITY_GATE_SPEC.md` | `931a6e72807676e1553513d27f0304cf6ddfed17` | `f108b30df3b9950b64d41824fea27ac2f1ff25e8039cd61ed12d5851e5dcedc8` | 4423 | WP-ACC-005 |
| `PRIMARY_LAW_ANALYSIS.md` | `66abbb08fde7f10b4c9cc99641eb8f641567cb23` | `26737e0dba55cf2d9f87aaef11cd660866f2f0369ab9a6061ea06654341c0007` | 3116 | — |
| `PUBLICATION_CHAIN_REGISTER.json` | `6fa8d21058957eedc65daffa90448eeade87d690` | `0d517f79718af18153832b8a49f1ff6d0ff3611e11faf97be8d07593cda34767` | 2051 | — |
| `QUALITY_REVIEW.md` | `b70c412d2555fdf6920d725cda4d828430b87aff` | `5218086809bacf54b7b7971b5993f7587762ffd55fcb54a18b73b7769ed25adc` | 2110 | WP-ACC-005 |
| `README.md` | `2dc2473a7cc10e3c736a4c3440885151c7ac3ed1` | `7fe5a06882d8f733c04aa6a421fe3f28e1451e33d499fbe53bd1612a71ebfeeb` | 1860 | WP-ACC-004, WP-ACC-005 |

## Material source-asserted gaps and control holds
- `regulatory/checkpoints/AR/ACCEPTANCE_SCENARIOS.json:5` — "expected": "deny policy activation; record source gate unresolved",
- `regulatory/checkpoints/AR/ACCEPTANCE_SCENARIOS.json:10` — "given": "An online article claims 2025-09-01 effective date but Bulletin issue/page missing",
- `regulatory/checkpoints/AR/ACCEPTANCE_SCENARIOS.json:59` — "expected": "remain unresolved; no finality, no duplicate retry",
- `regulatory/checkpoints/AR/CONTINUATION_STATE.json:8` — "status": "OPEN_P0_BLOCKED",
- `regulatory/checkpoints/AR/CONTINUATION_STATE.json:12` — "work_packages_blocked_from_closure": 1,
- `regulatory/checkpoints/AR/CONTINUATION_STATE.json:22` — "canonical_next_exact_task": "WP-ACC-005 — Checkpoint AS: authenticate CEMAC Bulletin Officiel publication references and complete signed 01/25 and 02/25 (including missing printed page 10), independent certified court orders, COBAC–MINFI original letter, June 2026 implementing text status and bank-specific PCEC/settlement approvals; preserve policy hold and
- `regulatory/checkpoints/AR/EVIDENCE_REQUESTS_FR.md:16` — For every received item: issuer confirmation through a separate verified channel, SHA-256, original binary retention, page/annex inventory, acquisition date, access controls, evidence version, reviewer, legal opinion and discrepancy register.
- `regulatory/checkpoints/AR/EXECUTION_REPORT.md:2` — Phase 4, WP-ACC-005. Remote predecessor AQ inspected and verified; no later AR/AS continuation state existed at beginning of run. **Attempted 1; completed 0; kept open 1; blocked from closure 1; dependent packages attempted 0.**
- `regulatory/checkpoints/AR/POLICY_AUTHORITY_GATE_SPEC.md:7` — Any unresolved contradiction, missing page, unverified legal effect or expired institution-specific sign-off routes to `ON_HOLD`; a newly authenticated stay/amendment triggers `REASSESSMENT_REQUIRED` without rewriting historical policies or posted journals. `RETIRED` and `SUPERSEDED` are terminal for new instructions but retain audit history.
- `regulatory/checkpoints/AR/PRIMARY_LAW_ANALYSIS.md:9` — Earlier AQ concentrated on the missing printed page 10, court cases and contradictory inactivity thresholds. AR additionally requires a **certified issue/page reference from the CEMAC Bulletin Officiel and relevant national Journal Officiel publication** for each instrument, together with a complete signed copy and any amendments/errata. A secondary article 
- `regulatory/checkpoints/AR/PUBLICATION_CHAIN_REGISTER.json:40` — "missing_printed_page": "10 (Article 23 continuation and Articles 24–26)",
- `regulatory/checkpoints/AR/PUBLICATION_CHAIN_REGISTER.json:52` — "rule": "UNKNOWN means evidence not obtained by programme; never assert invalidity, repeal, suspension or non-publication from absence."
- `regulatory/checkpoints/AR/QUALITY_REVIEW.md:2` — Outcome: **WP-ACC-005 OPEN / P0 BLOCKED; Definition of Ready FAIL**.
- `regulatory/checkpoints/AR/QUALITY_REVIEW.md:5` — ¦ Regulatory/legal ¦ FAIL: Article 43 creates publication-chain evidence need; official issue/page and complete signed 02/25 absent; court effects unresolved. ¦
- `regulatory/checkpoints/AR/QUALITY_REVIEW.md:15` — ¦ Observability/auditability ¦ OPEN: immutable evidence chain and reconstructable approvals proposed; not verified in system. ¦
- `regulatory/checkpoints/AR/QUALITY_REVIEW.md:18` — ¦ Regulator/auditor evidence ¦ FAIL: signed original, Bulletin proof, court dispositions and CFO approvals missing. ¦
- `regulatory/checkpoints/AR/README.md:4` — This checkpoint adds a **primary-law publication/effective-date evidence gate** based on Articles 40–44 of the CEMAC revised Treaty, a publication-chain register for 01/25 and 02/25, a non-executable authority-to-policy promotion specification, targeted French evidence requests and new negative acceptance cases. It does **not** reconstruct missing Article 23
- `regulatory/checkpoints/AR/README.md:6` — WP-ACC-005 remains OPEN / P0 BLOCKED. The lack of authenticated page 10, separate court dispositions, issuer publication proof, original COBAC–MINFI correspondence and bank-approved PCEC/settlement mappings prevents implementation. Preserve immutable double-entry, no status-driven posting, no automatic transfers.
- `regulatory/checkpoints/AR/README.md:10` — - Incomplete third-party reproduction of 02/25: https://legecam.cm/wp-content/uploads/2025/08/Reglement-N%C2%B002_traitement-comptes-inactifs-des-avoirs-en-desherence.pdf (AQ evidence; missing printed page 10).

## Multidisciplinary QA and DoR status
Regulatory/legal: historical citations and effective dates require direct primary issuer validation; source claims alone do not establish adoption or legal status. CFO/ledger: no monetary journal, accounting account mapping or migration updated. PCEC 312/322 textual inconsistency remains P0. Architecture: document lineage is not proof of Git ancestry or independent WP completion. Identity/security/AML: no privilege, customer KYC, sanctions or payment-rail entitlement assumed. Workflow/payments: external outcomes and reversals remain fail-closed. Data/privacy: preserved source-path, line-level excerpt, Git blob and SHA-256 evidence; legal retention authority not independently adjudicated. Resilience/ops: no deployment or recovery test. Testing: zero banking tests executed in this audit. No reviewer signatures or 15-gate DoR pass; all historical success statements remain unverified.

## Batch conclusion
Evidence archive may be marked DRAFT REMOTELY DELIVERED only after GitHub main branch, per-file extracted content, ZIP Git blob and downloaded ZIP SHA-256 independently match. This does NOT complete GOV-REC-001 nor WP-ACC-005; historical WBS denominator UNKNOWN. Next audit: batch 155 (or reconciliation after batch 180).
