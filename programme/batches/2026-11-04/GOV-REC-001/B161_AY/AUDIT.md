# GOV-REC-001 — Historical Source Audit, Batch 161 / Checkpoint AY

Date: 2026-11-04. Source: GitHub exerateanalytical/opescorebanking@9c2476b94a1af7dbfac31684679332bc9e401207. Registered plan: governance/GOV_REC_001_SUBBATCH_PLAN_151_180_2026-11-04.md.

## Source completeness (not engineering acceptance)
Read every 8 tracked source blob in `regulatory/checkpoints/AY/`; each blob SHA was independently compared with the pinned source tree. Verbatim text source copies are in the ZIP SOURCE/ directory. This covers only this checkpoint directory, not the original missing cumulative archives or the complete programme.

## Inherited assertions, not accepted facts
- Previous historical checkpoint: AX.
- Reported phase: Phase 4 — Accounting Core / Financial Integrity.
- Reported active package: NOT STATED.
- Reported package state: OPEN_P0_BLOCKED.
- Reported DoR: FAIL.
- WP IDs mentioned in source text: WP-ACC-004, WP-ACC-005.
- Exact historical next task (claim): WP-ACC-005 — Checkpoint AZ: obtain durable authenticated I-2002/01 binary and source hash; reconcile all 2002/2003/2015 PCEC amendment clauses into a non-executable effective-dated matrix, seek authoritative COBAC clarification of 2651/2652 and 312/322, qualified legal opinion on R-2018/01 Article 33, and institution-approved chart; continue 01/25–02/25 publication/Court/settlement evidence. Preserve P0 holds..
- JSON parse failures: none.

## Source ledger
| Name | Git blob SHA | SHA-256 of retrieved text | Bytes | WP mentions |
|---|---|---|---:|---|
| `ACCEPTANCE_SCENARIOS.json` | `2d4c4ac906d66a8e32f41bfc5a06429ee0776821` | `b54b51a789919aedd077d434eb6cc9e3aa06f16b13e3c8c041cc21543647581a` | 5001 | — |
| `AMENDMENT_RECONCILIATION.json` | `86acc968c9fe03d130491fe3a3e4e14d7865be05` | `7f4289d39edae96ad4e6adb5600ecee34b37d0ce562d5efd09dbd9e963a28f20` | 5118 | WP-ACC-005 |
| `CONTINUATION_STATE.json` | `3ced5f58838870c06b5e7a6e9f8fadb9bc29c7f0` | `a51c2e47af89f9504f0c54e6998110a9de8bd632cd3d91e780e5de2d0ed3c2cb` | 1386 | WP-ACC-004, WP-ACC-005 |
| `CONTROL_DESIGN.md` | `94f9ab42c12f98869060660a67969aa9d5b8e9e4` | `87ed6fa51d347c4cd2098c47eae3312dd8f1eef847c76bc4217101d129a92d8d` | 4504 | — |
| `EXECUTION_REPORT.md` | `1faa8cc048351b9d186bd8b54fcb5445804d65ad` | `7b3d987c1e9309cc8bfc25dfd00c7a6a2a011ec9b4b0d1d3d5e5e8b4a10a186f` | 2000 | WP-ACC-005 |
| `PRIMARY_EVIDENCE.md` | `78de1e46c29f600c7b13dcb85189ee186d6c4a38` | `a316480ad2859963d15f243f4e06e32fed8f6d9067b735017ec02412b616a51d` | 3330 | — |
| `QUALITY_REVIEW.md` | `bdbbf5a38b938323275902f3034fbcc23ba90c24` | `581f01c7349b18b3c3e0041f0db1edc2b1806cd9a29fc115d471afdf2e290250` | 2465 | WP-ACC-005 |
| `README.md` | `5dce5beec031787287b16aa11adb6d7c87b3b477` | `8eb35caaa668148b5fe6768e88b30b72bc1ecef22a79b0b8796a16e956ae1890` | 1824 | WP-ACC-005 |

## Material source-asserted gaps and control holds
- `regulatory/checkpoints/AY/AMENDMENT_RECONCILIATION.json:109` — "observed": "2018 rule supersedes conflicting 2014 classification; pre-signature stated effect unresolved.",
- `regulatory/checkpoints/AY/CONTINUATION_STATE.json:9` — "status": "OPEN_P0_BLOCKED",
- `regulatory/checkpoints/AY/CONTINUATION_STATE.json:13` — "blocked_from_closure": 1,
- `regulatory/checkpoints/AY/CONTROL_DESIGN.md:14` — - **AY-R09 — Ambiguity quarantine.** I-2015/01 art.8(d) 312/322 and I-2003/01 2651/2652 remain blocked. No guessed errata, silent OCR normalization or 'most likely' production mapping.
- `regulatory/checkpoints/AY/CONTROL_DESIGN.md:22` — - Legacy import: RECEIVED -> PARSED -> VALIDATED -> MATCHED -> POSTING_INTENT_APPROVED -> POSTED -> RECONCILED; uncertain -> QUARANTINED or INVESTIGATION_REQUIRED. No status alone posts money.
- `regulatory/checkpoints/AY/EXECUTION_REPORT.md:10` — ¦ Blocked from closure ¦ 1 ¦
- `regulatory/checkpoints/AY/EXECUTION_REPORT.md:24` — **Distinct verified result:** I-2002/01 was discovered at the issuer-hosted BEAC catalogue and read across all seven scanned pages. Its article 20 effective date and the 2015 article 8 explicit deletion/reuse of 321/324 meanings were compared. This is a genuine evidence advance; the unresolved 2015 312/322 and 2003 2651/2652 conflicts were not fabricated as 
- `regulatory/checkpoints/AY/PRIMARY_EVIDENCE.md:1` — # AY primary evidence and provenance — visual source inspection, not certified custody
- `regulatory/checkpoints/AY/PRIMARY_EVIDENCE.md:11` — - **I-2003/01**, official COBAC Bulletin No. 6: https://www.beac.int/wp-content/uploads/2016/10/Bulletin-COBAC-n%C2%B06.pdf. Earlier AX-C01 remains unresolved (2651/2652 internal inconsistency).
- `regulatory/checkpoints/AY/QUALITY_REVIEW.md:3` — - **Regulatory/legal: OPEN/P0.** Issuer-hosted I-2002/01 located and seven pages visually inspected; article 20 date now directly supported. Missing binary custody, formal COBAC clarifications, 2026 consolidation, judicial/legal opinions remain.
- `regulatory/checkpoints/AY/QUALITY_REVIEW.md:17` — **Safe checkpoint:** New official 2002 scan located and its historical provisions compared against explicit 2015 deletions. This closes only the *discovery* part of AX-C05, not the overall WP or financial activation gate. **WP-ACC-005 OPEN/P0-BLOCKED; DoR FAIL.**
- `regulatory/checkpoints/AY/README.md:2` — Date: 2026-11-01. Phase 4 Accounting Core / Financial Integrity. Predecessor: AX. **Research-only checkpoint. WP-ACC-005 remains OPEN/P0-BLOCKED; DoR FAIL.**
- `regulatory/checkpoints/AY/README.md:7` — The 2002 article 5 account 321 (commercial paper) and article 6 account 324 (public contract loans) are explicitly listed among the subdivisions **deleted** by I-2015/01 article 8(a). Article 8(b)-(c) then **reuses** 321 for healthy short-term credit and introduces 322 for sensitive short-term credit. This is an observed intentional amendment, not a reason t

## Multidisciplinary QA and DoR status
Regulatory/legal: historical citations and effective dates require direct primary issuer validation; source claims alone do not establish adoption or legal status. CFO/ledger: no monetary journal, accounting account mapping or migration updated. PCEC 312/322 textual inconsistency remains P0. Architecture: document lineage is not proof of Git ancestry or independent WP completion. Identity/security/AML: no privilege, customer KYC, sanctions or payment-rail entitlement assumed. Workflow/payments: external outcomes and reversals remain fail-closed. Data/privacy: preserved source-path, line-level excerpt, Git blob and SHA-256 evidence; legal retention authority not independently adjudicated. Resilience/ops: no deployment or recovery test. Testing: zero banking tests executed in this audit. No reviewer signatures or 15-gate DoR pass; all historical success statements remain unverified.

## Batch conclusion
Evidence archive may be marked DRAFT REMOTELY DELIVERED only after GitHub main branch, per-file extracted content, ZIP Git blob and downloaded ZIP SHA-256 independently match. This does NOT complete GOV-REC-001 nor WP-ACC-005; historical WBS denominator UNKNOWN. Next audit: batch 162 (or reconciliation after batch 180).
