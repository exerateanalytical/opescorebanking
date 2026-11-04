# GOV-REC-001 — Historical Source Audit, Batch 197 / Checkpoint CH

Date: 2026-11-04. Source: GitHub exerateanalytical/opescorebanking@ee13700c466053bdc3a5e4fb468e65fad939aee1. Registered plan: governance/GOV_REC_001_SUBBATCH_PLAN_151_180_2026-11-04.md.

## Source completeness (not engineering acceptance)
Read every 1 tracked source blob in `regulatory/checkpoints/CH/`; each blob SHA was independently compared with the pinned source tree. Verbatim text source copies are in the ZIP SOURCE/ directory. This covers only this checkpoint directory, not the original missing cumulative archives or the complete programme.

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
| `README.md` | `3b72fd718938d39e0baafbe6f5088fbfab76a605` | `f538c896910792d03a092c033d2c37781694930a1ff099bcb203367a4fa09776` | 6320 | WP-ACC-005 |

## Material source-asserted gaps and control holds
- `regulatory/checkpoints/CH/README.md:3` — Phase 4 — Accounting Core and Financial Integrity. Status: SAFE RESEARCH CHECKPOINT ONLY. WP-ACC-005 OPEN / P0 BLOCKED.
- `regulatory/checkpoints/CH/README.md:17` — EVID-CH-05 CRSP exact expansion, reporting schema, effective version, submission channel, and issuer-approved template: UNRESOLVED. Do not invent its meaning or a schema.
- `regulatory/checkpoints/CH/README.md:45` — Work packages attempted: 1 (WP-ACC-005 continuation); completed: 0; open: 1; blocked from closure: 1. New primary issuer document located: 1. P0 closed: 0. Production code: 0. Tests executed: 0. Documentation checkpoint: CH. No dependent package attempted.
- `regulatory/checkpoints/CH/README.md:48` — WP-ACC-005 — Checkpoint CI: extract and compare article-level provisions from issuer-hosted COBAC I-2015/01 against R-98/01, R-99/01, R-2003/01 and later amendments, build an effective-dated PCEC amendment matrix, explicitly segregate EMF/PCEMF and unresolved CRSP reporting evidence; do not implement accounting postings until institution/CFO approval and ful

## Multidisciplinary QA and DoR status
Regulatory/legal: historical citations and effective dates require direct primary issuer validation; source claims alone do not establish adoption or legal status. CFO/ledger: no monetary journal, accounting account mapping or migration updated. PCEC 312/322 textual inconsistency remains P0. Architecture: document lineage is not proof of Git ancestry or independent WP completion. Identity/security/AML: no privilege, customer KYC, sanctions or payment-rail entitlement assumed. Workflow/payments: external outcomes and reversals remain fail-closed. Data/privacy: preserved source-path, line-level excerpt, Git blob and SHA-256 evidence; legal retention authority not independently adjudicated. Resilience/ops: no deployment or recovery test. Testing: zero banking tests executed in this audit. No reviewer signatures or 15-gate DoR pass; all historical success statements remain unverified.

## Batch conclusion
Evidence archive may be marked DRAFT REMOTELY DELIVERED only after GitHub main branch, per-file extracted content, ZIP Git blob and downloaded ZIP SHA-256 independently match. This does NOT complete GOV-REC-001 nor WP-ACC-005; historical WBS denominator UNKNOWN. Next audit: batch 198 (or reconciliation after batch 180).
