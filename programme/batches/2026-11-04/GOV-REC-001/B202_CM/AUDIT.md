# GOV-REC-001 — Historical Source Audit, Batch 202 / Checkpoint CM

Date: 2026-11-04. Source: GitHub exerateanalytical/opescorebanking@ee13700c466053bdc3a5e4fb468e65fad939aee1. Registered plan: governance/GOV_REC_001_SUBBATCH_PLAN_151_180_2026-11-04.md.

## Source completeness (not engineering acceptance)
Read every 1 tracked source blob in `regulatory/checkpoints/CM/`; each blob SHA was independently compared with the pinned source tree. Verbatim text source copies are in the ZIP SOURCE/ directory. This covers only this checkpoint directory, not the original missing cumulative archives or the complete programme.

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
| `README.md` | `37c1af4aa6744efcd95235f09b62cc0a5fc8d65c` | `2c8bf239b675f75c5405667521b914bbbb298fa5d6b1efa25993237aaba2dcdd` | 7747 | WP-ACC-005 |

## Material source-asserted gaps and control holds
- `regulatory/checkpoints/CM/README.md:3` — Date: 2026-11-03. Predecessor: CL. Phase 4 — Accounting Core and Financial Integrity. **SAFE PARTIAL RESEARCH CHECKPOINT. WP-ACC-005 OPEN / P0 BLOCKED.** No production code, executed tests, approved account crosswalk or certification.
- `regulatory/checkpoints/CM/README.md:7` — 1. Read canonical `regulatory/checkpoints/CL/README.md` from GitHub before continuing. It documents the visually inspected I-2015/01 Articles 2–13 and the unresolved Article 8(d) account 312/322 discrepancy.
- `regulatory/checkpoints/CM/README.md:10` — 4. Official I-2015/01 indexed copy: https://www.beac.int/wp-content/uploads/2016/10/instruction_cobac_i_2015_01_pcec.pdf — current live PDF fetch timed out; relied on previously visually inspected CL record for the specific page-7 discrepancy, **not** on a new independent visual reading this run.
- `regulatory/checkpoints/CM/README.md:15` — ## Decision on 312/322 discrepancy

## Multidisciplinary QA and DoR status
Regulatory/legal: historical citations and effective dates require direct primary issuer validation; source claims alone do not establish adoption or legal status. CFO/ledger: no monetary journal, accounting account mapping or migration updated. PCEC 312/322 textual inconsistency remains P0. Architecture: document lineage is not proof of Git ancestry or independent WP completion. Identity/security/AML: no privilege, customer KYC, sanctions or payment-rail entitlement assumed. Workflow/payments: external outcomes and reversals remain fail-closed. Data/privacy: preserved source-path, line-level excerpt, Git blob and SHA-256 evidence; legal retention authority not independently adjudicated. Resilience/ops: no deployment or recovery test. Testing: zero banking tests executed in this audit. No reviewer signatures or 15-gate DoR pass; all historical success statements remain unverified.

## Batch conclusion
Evidence archive may be marked DRAFT REMOTELY DELIVERED only after GitHub main branch, per-file extracted content, ZIP Git blob and downloaded ZIP SHA-256 independently match. This does NOT complete GOV-REC-001 nor WP-ACC-005; historical WBS denominator UNKNOWN. Next audit: batch 203 (or reconciliation after batch 180).
