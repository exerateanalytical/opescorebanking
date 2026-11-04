# GOV-REC-001 — Historical Source Audit, Batch 185 / Checkpoint BV

Date: 2026-11-04. Source: GitHub exerateanalytical/opescorebanking@ee13700c466053bdc3a5e4fb468e65fad939aee1. Registered plan: governance/GOV_REC_001_SUBBATCH_PLAN_151_180_2026-11-04.md.

## Source completeness (not engineering acceptance)
Read every 7 tracked source blob in `regulatory/checkpoints/BV/`; each blob SHA was independently compared with the pinned source tree. Verbatim text source copies are in the ZIP SOURCE/ directory. This covers only this checkpoint directory, not the original missing cumulative archives or the complete programme.

## Inherited assertions, not accepted facts
- Previous historical checkpoint: NOT STATED.
- Reported phase: Phase 4 — Accounting Core / Financial Integrity.
- Reported active package: NOT STATED.
- Reported package state: OPEN_P0_BLOCKED.
- Reported DoR: FAIL.
- WP IDs mentioned in source text: WP-ACC-004, WP-ACC-005.
- Exact historical next task (claim): WP-ACC-005 — Checkpoint BW: authenticate signed operative R-2019/01–02 and amendment chains; reconcile R-2024/01 Article 41 legal commencement versus report transitional dates; obtain current COBAC incident guidance, institution-approved safeguarding/PCEC/reporting and payment restitution/participation/finality evidence; maintain P0..
- JSON parse failures: none.

## Source ledger
| Name | Git blob SHA | SHA-256 of retrieved text | Bytes | WP mentions |
|---|---|---|---:|---|
| `CONTINUATION_STATE.json` | `9fc2fcbebaa7fdf72b9d7f6a1d27d4adc43377ea` | `3f443103fac3fd9352d88b95b92cbdc6b832f5bc63faaec1ba972a56f4d4c610` | 1755 | WP-ACC-004, WP-ACC-005 |
| `CONTROL_AND_TEST_DESIGN.md` | `a67521bbf516f2975ff779be667791a9e1ecd901` | `1461889e107ceae735240c2761c5f289669607a8ec693687d8c22dc48acd8a10` | 5739 | WP-ACC-005 |
| `EVIDENCE_DELTA.md` | `1610ab58d66aee7fae9917acfd1b84d7841c9a71` | `0ff00b2fc0b047319980c7aeb522eee8bfbedc9c1c4d9b89b30bd6836268ace2` | 5405 | WP-ACC-005 |
| `EXECUTION_REPORT.md` | `5d9c662773bf45040206db8575fa16153b1b45dc` | `b7bc8e499a189cb04a7fda3f5cb23d42d86752f11a87356ead90a09a95727642` | 1859 | WP-ACC-004, WP-ACC-005 |
| `QUALITY_REVIEW.md` | `6040296c6cf0336dbb06372388aaa8695079c907` | `e0d6f1e5116bfd639c32a3831aac5b4cb971195ab2bf350d8430b0c9e715295e` | 2235 | WP-ACC-005 |
| `README.md` | `09918069ea3fb419b1ecd253f462f362c2d7a1fd` | `14592b888cb0e96d1a1188f569ecd6346d5ed8dbf8bfc10f137390968398c858` | 1636 | WP-ACC-005 |
| `REGULATORY_CONTROL_GATES.json` | `6e58f5fa07207840ae6f7e96d517443366ed1cb9` | `aa641fe37ed81af8abdb5d9e22fc89db82f6c02dbbf4512902ec5763654dbee4` | 9692 | WP-ACC-005 |

## Material source-asserted gaps and control holds
- `regulatory/checkpoints/BV/CONTINUATION_STATE.json:9` — "status": "OPEN_P0_BLOCKED",
- `regulatory/checkpoints/BV/CONTINUATION_STATE.json:14` — "work_packages_blocked_from_closure": 1,
- `regulatory/checkpoints/BV/CONTROL_AND_TEST_DESIGN.md:8` — **Safeguarding:** FUNDS_RECEIVED -> PAYMENT_PENDING -> SEGREGATION_REQUIRED -> HOLDING_BANK_EVIDENCE_PENDING -> RECONCILED or DISCREPANCY_OPEN -> INVESTIGATION -> CONTROLLED_CORRECTION -> RECONCILED. External bank evidence, not status updates, establishes funding; posted journals are never edited.
- `regulatory/checkpoints/BV/CONTROL_AND_TEST_DESIGN.md:15` — - `POST /safeguarding-reconciliations` accepts signed bank statement reference, time window, exact integer minor units, tenant, idempotency key; generates a discrepancy case, not automatic balance repair.
- `regulatory/checkpoints/BV/CONTROL_AND_TEST_DESIGN.md:17` — - Events: `RegulatoryPolicyQuarantined`, `SafeguardingDiscrepancyDetected`, `IncidentNotificationEvidenceRecorded`. Outbox/inbox and replay keys mandatory; no event is itself a journal entry.
- `regulatory/checkpoints/BV/CONTROL_AND_TEST_DESIGN.md:31` — - **BV-T09** — A customer funds safeguarding discrepancy is auto-corrected by directly editing a posted journal; reject and require controlled correction.
- `regulatory/checkpoints/BV/EVIDENCE_DELTA.md:10` — - Arts 3–8 define historical net-funds requirements, activity-based tranches, e-money float component, discretionary supervisory uplift and deferred-debit/credit coverage. The historical rates and amounts are **not approved as current executable thresholds**; amendment chain, institution category, approved denominator and methodology unresolved.
- `regulatory/checkpoints/BV/EVIDENCE_DELTA.md:18` — **Terminology discrepancy:** the SAME report's explanatory discussion around printed p.79 calls **1 January 2026** (credit/payment) and **1 July 2026** (EMFs) 'entrée en vigueur', whereas reproduced operative Art 41 says 1 January 2025 plus transition. These dates may reflect *end of transition* rather than legal commencement; record both verbatim and seek a
- `regulatory/checkpoints/BV/EXECUTION_REPORT.md:14` — ¦ Blocked from closure ¦ 1 ¦
- `regulatory/checkpoints/BV/QUALITY_REVIEW.md:5` — ¦ Regulatory/legal ¦ Historical signed-looking R-2019/02 on third-party host inspected, but issuer authentication/current amendments absent; R-2024/01 effective-date/transition wording discrepancy isolated. ¦ P0 OPEN ¦
- `regulatory/checkpoints/BV/QUALITY_REVIEW.md:12` — ¦ Payments/settlement ¦ Safeguarding position not external finality; bank participation/BEAC private message profiles still missing. ¦ P0 OPEN ¦
- `regulatory/checkpoints/BV/QUALITY_REVIEW.md:15` — ¦ Usability/accessibility ¦ Explicit legal ambiguity and discrepancy statuses proposed; no UI or accessibility test. ¦ OPEN ¦
- `regulatory/checkpoints/BV/README.md:15` — **No banking code or tests; no P0 closed; original PDF binaries/hashes and current legal/institution approvals remain missing.** Single next checkpoint: **BW**.
- `regulatory/checkpoints/BV/REGULATORY_CONTROL_GATES.json:72` — "rule": "independent safeguarding reconciliation and discrepancy cases; preserve historical weekly requirement without asserting current universal frequency",
- `regulatory/checkpoints/BV/REGULATORY_CONTROL_GATES.json:193` — "expected": "A customer funds safeguarding discrepancy is auto-corrected by directly editing a posted journal; reject and require controlled correction.",

## Multidisciplinary QA and DoR status
Regulatory/legal: historical citations and effective dates require direct primary issuer validation; source claims alone do not establish adoption or legal status. CFO/ledger: no monetary journal, accounting account mapping or migration updated. PCEC 312/322 textual inconsistency remains P0. Architecture: document lineage is not proof of Git ancestry or independent WP completion. Identity/security/AML: no privilege, customer KYC, sanctions or payment-rail entitlement assumed. Workflow/payments: external outcomes and reversals remain fail-closed. Data/privacy: preserved source-path, line-level excerpt, Git blob and SHA-256 evidence; legal retention authority not independently adjudicated. Resilience/ops: no deployment or recovery test. Testing: zero banking tests executed in this audit. No reviewer signatures or 15-gate DoR pass; all historical success statements remain unverified.

## Batch conclusion
Evidence archive may be marked DRAFT REMOTELY DELIVERED only after GitHub main branch, per-file extracted content, ZIP Git blob and downloaded ZIP SHA-256 independently match. This does NOT complete GOV-REC-001 nor WP-ACC-005; historical WBS denominator UNKNOWN. Next audit: batch 186 (or reconciliation after batch 180).
