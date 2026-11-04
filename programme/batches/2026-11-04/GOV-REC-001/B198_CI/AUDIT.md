# GOV-REC-001 — Historical Source Audit, Batch 198 / Checkpoint CI

Date: 2026-11-04. Source: GitHub exerateanalytical/opescorebanking@ee13700c466053bdc3a5e4fb468e65fad939aee1. Registered plan: governance/GOV_REC_001_SUBBATCH_PLAN_151_180_2026-11-04.md.

## Source completeness (not engineering acceptance)
Read every 1 tracked source blob in `regulatory/checkpoints/CI/`; each blob SHA was independently compared with the pinned source tree. Verbatim text source copies are in the ZIP SOURCE/ directory. This covers only this checkpoint directory, not the original missing cumulative archives or the complete programme.

## Inherited assertions, not accepted facts
- Previous historical checkpoint: NOT STATED.
- Reported phase: NOT STATED.
- Reported active package: NOT STATED.
- Reported package state: NOT STATED.
- Reported DoR: NOT STATED.
- WP IDs mentioned in source text: WP-ACC-005.
- Exact historical next task (claim): NOT STATED.
- JSON parse failures: none.

## Source ledger
| Name | Git blob SHA | SHA-256 of retrieved text | Bytes | WP mentions |
|---|---|---|---:|---|
| `README.md` | `7f6bd88d99b2440f956ba8d82c49763eed029288` | `a51c71be0310629e607e1a558af13ba6f84c32d961a1cf2da3e566a801e8ca4f` | 7746 | WP-ACC-005 |

## Material source-asserted gaps and control holds
- `regulatory/checkpoints/CI/README.md:4` — Status: SAFE RESEARCH CHECKPOINT ONLY. WP-ACC-005 remains OPEN / P0 BLOCKED. No implementation or test execution.
- `regulatory/checkpoints/CI/README.md:16` — ¦ COBAC R-98/01 ¦ 1 ¦ Establishes PCEC for credit institutions in Central Africa. ¦ Issuer-hosted readable text; original 1998 instrument, later amendment chain unresolved. ¦
- `regulatory/checkpoints/CI/README.md:33` — ¦ PCEC-BASE-CMR ¦ R-98/01 art. 5 ¦ Original Cameroon adoption ¦ Accounting years opened from 1999-07-01 ¦ UNKNOWN ¦ BLOCKED ¦
- `regulatory/checkpoints/CI/README.md:34` — ¦ PCEC-BASE-OTHER ¦ R-98/01 art. 5 ¦ Original other CEMAC adoption ¦ Accounting years opened from 2000-01-01 ¦ UNKNOWN ¦ BLOCKED ¦

## Multidisciplinary QA and DoR status
Regulatory/legal: historical citations and effective dates require direct primary issuer validation; source claims alone do not establish adoption or legal status. CFO/ledger: no monetary journal, accounting account mapping or migration updated. PCEC 312/322 textual inconsistency remains P0. Architecture: document lineage is not proof of Git ancestry or independent WP completion. Identity/security/AML: no privilege, customer KYC, sanctions or payment-rail entitlement assumed. Workflow/payments: external outcomes and reversals remain fail-closed. Data/privacy: preserved source-path, line-level excerpt, Git blob and SHA-256 evidence; legal retention authority not independently adjudicated. Resilience/ops: no deployment or recovery test. Testing: zero banking tests executed in this audit. No reviewer signatures or 15-gate DoR pass; all historical success statements remain unverified.

## Batch conclusion
Evidence archive may be marked DRAFT REMOTELY DELIVERED only after GitHub main branch, per-file extracted content, ZIP Git blob and downloaded ZIP SHA-256 independently match. This does NOT complete GOV-REC-001 nor WP-ACC-005; historical WBS denominator UNKNOWN. Next audit: batch 199 (or reconciliation after batch 180).
