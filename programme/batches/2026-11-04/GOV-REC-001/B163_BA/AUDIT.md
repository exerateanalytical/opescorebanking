# GOV-REC-001 — Historical Source Audit, Batch 163 / Checkpoint BA

Date: 2026-11-04. Source: GitHub exerateanalytical/opescorebanking@9c2476b94a1af7dbfac31684679332bc9e401207. Registered plan: governance/GOV_REC_001_SUBBATCH_PLAN_151_180_2026-11-04.md.

## Source completeness (not engineering acceptance)
Read every 8 tracked source blob in `regulatory/checkpoints/BA/`; each blob SHA was independently compared with the pinned source tree. Verbatim text source copies are in the ZIP SOURCE/ directory. This covers only this checkpoint directory, not the original missing cumulative archives or the complete programme.

## Inherited assertions, not accepted facts
- Previous historical checkpoint: AZ.
- Reported phase: Phase 4 — Accounting Core / Financial Integrity.
- Reported active package: NOT STATED.
- Reported package state: OPEN_P0_BLOCKED.
- Reported DoR: FAIL.
- WP IDs mentioned in source text: WP-ACC-004, WP-ACC-005.
- Exact historical next task (claim): WP-ACC-005 — Checkpoint BB: acquire and hash issuer PDFs through a trusted network path; reconcile R-2003/03 Article 22 and R-2010/03 Article 24 against currently effective prudential instruments; obtain institution/COBAC interpretation of PCEC 2651/2652, 312/322, and 265x↔2965x mappings; resolve R-2018/01 Article 33 and outstanding authenticated 01/25–02/25 publication, judicial, implementing and settlement evidence. Preserve P0 holds..
- JSON parse failures: none.

## Source ledger
| Name | Git blob SHA | SHA-256 of retrieved text | Bytes | WP mentions |
|---|---|---|---:|---|
| `ACCEPTANCE_SCENARIOS.json` | `7bebf1542949bf8568ac657aa4240e851fd44272` | `ea4f419a38c9e7b7bcfa911661182fa4feb32564d59c16a93922bcaa94555cb6` | 6285 | — |
| `CONTINUATION_STATE.json` | `4c04f618e1f583954c83f47646963ffd9d74f127` | `dfa80997f1f0ba7df0b5bf780a4c2990387e67a3640f59b9e72524d73fc6c0e9` | 1639 | WP-ACC-004, WP-ACC-005 |
| `EXECUTION_REPORT.md` | `02a2403b250e007ded41e1cee1eaa2066aefea91` | `69940ad0b845f9a124ff659f8a1257d217a4383b4c578191fabd227201bed527` | 2278 | WP-ACC-005 |
| `FINANCIAL_INTEGRITY_DECISIONS.md` | `59cf2e2ad8e7b71c344712cae5c7a6a7e7c63b7b` | `da841526ecd955a9a66358e4c8e206184af2c0022d0ddc25e441cc36d201848d` | 4647 | WP-ACC-005 |
| `PRIMARY_EVIDENCE_AND_CUSTODY.md` | `103ed0802a9a3ca750b586e8704a7f4a066a8e63` | `9eb0a3b5c665f2c4da982b908355eb2491bc8e36edbabed8ca810c8dede6bf69` | 4191 | — |
| `QUALITY_REVIEW.md` | `aa64a37d0a60e986569a2b050191495f1ea239d0` | `f9ece263c0a7f66e1d1a8612359fc0245b6a7028ead46d3ff71dbd71ba273a83` | 3407 | WP-ACC-005 |
| `README.md` | `8ae5bbaf534f6f3c5f598283d5859cf313deda78` | `a4ab36b36948e83b5925fea990743d273a1d3a49bf4691aec0fba068ecb32df5` | 3176 | WP-ACC-005 |
| `SECURITIES_AMENDMENT_GRAPH.json` | `1eb855d41f5e6ef27f7015b358db997d20c976f7` | `970f761b5d4e22b35db2330104cbe9d074e8bf3c0ad24053271c4d3ab9e6c462` | 5269 | WP-ACC-005 |

## Material source-asserted gaps and control holds
- `regulatory/checkpoints/BA/ACCEPTANCE_SCENARIOS.json:9` — "expected": "Trade state may advance; ownership posting and finality must remain blocked; unresolved off-balance treatment routed for institution approval.",
- `regulatory/checkpoints/BA/CONTINUATION_STATE.json:9` — "status": "OPEN_P0_BLOCKED",
- `regulatory/checkpoints/BA/CONTINUATION_STATE.json:13` — "blocked_from_closure": 1,
- `regulatory/checkpoints/BA/EXECUTION_REPORT.md:3` — **Phase:** 4 — Accounting Core / Financial Integrity. **Work package:** WP-ACC-005, still OPEN/P0-blocked. **Verified predecessor:** AZ `b61bc35ffcc93ca200ea2b97208917e8f5ba3c9b`. BA is a research checkpoint, **not** WP completion or banking/regulatory certification.
- `regulatory/checkpoints/BA/EXECUTION_REPORT.md:10` — ¦ Blocked from closure ¦ 1 ¦
- `regulatory/checkpoints/BA/FINANCIAL_INTEGRITY_DECISIONS.md:11` — R-2010/03 Article 1 historically replaces R-2003/03 Article 24 and describes a six-month treatment for certain public trading securities. It is not a blanket exemption and is **not certified as current in 2026**. Design a separate effective-dated Prudential Rules context which reads source-classified, ownership-confirmed positions and emits reproducible calc
- `regulatory/checkpoints/BA/FINANCIAL_INTEGRITY_DECISIONS.md:17` — I-2015/01 Article 2 includes historical 0.5% annual and 2% stock provisioning figures and Article 14 references R-2014/01. The previously reviewed R-2018/01 supersession makes literal reuse unsafe without legal reconciliation. The provisioning calculation engine must resolve `(institution_profile, instrument, applicable_date, legal_release_id, credit_class, 
- `regulatory/checkpoints/BA/FINANCIAL_INTEGRITY_DECISIONS.md:22` — ## Unresolved risks and owner roles (not assigned to real individuals)
- `regulatory/checkpoints/BA/PRIMARY_EVIDENCE_AND_CUSTODY.md:17` — 2. Validate PDF structure, expected page count, visible text, attachment/signature status and source metadata; flag any missing page or inconsistent scan. **Hash = integrity fingerprint only, not proof of legal authenticity or entry into force.**
- `regulatory/checkpoints/BA/README.md:3` — **Active package:** WP-ACC-005 — OPEN, P0-blocked

## Multidisciplinary QA and DoR status
Regulatory/legal: historical citations and effective dates require direct primary issuer validation; source claims alone do not establish adoption or legal status. CFO/ledger: no monetary journal, accounting account mapping or migration updated. PCEC 312/322 textual inconsistency remains P0. Architecture: document lineage is not proof of Git ancestry or independent WP completion. Identity/security/AML: no privilege, customer KYC, sanctions or payment-rail entitlement assumed. Workflow/payments: external outcomes and reversals remain fail-closed. Data/privacy: preserved source-path, line-level excerpt, Git blob and SHA-256 evidence; legal retention authority not independently adjudicated. Resilience/ops: no deployment or recovery test. Testing: zero banking tests executed in this audit. No reviewer signatures or 15-gate DoR pass; all historical success statements remain unverified.

## Batch conclusion
Evidence archive may be marked DRAFT REMOTELY DELIVERED only after GitHub main branch, per-file extracted content, ZIP Git blob and downloaded ZIP SHA-256 independently match. This does NOT complete GOV-REC-001 nor WP-ACC-005; historical WBS denominator UNKNOWN. Next audit: batch 164 (or reconciliation after batch 180).
