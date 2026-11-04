# GOV-REC-001 — Historical Source Audit, Batch 196 / Checkpoint CG

Date: 2026-11-04. Source: GitHub exerateanalytical/opescorebanking@ee13700c466053bdc3a5e4fb468e65fad939aee1. Registered plan: governance/GOV_REC_001_SUBBATCH_PLAN_151_180_2026-11-04.md.

## Source completeness (not engineering acceptance)
Read every 1 tracked source blob in `regulatory/checkpoints/CG/`; each blob SHA was independently compared with the pinned source tree. Verbatim text source copies are in the ZIP SOURCE/ directory. This covers only this checkpoint directory, not the original missing cumulative archives or the complete programme.

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
| `README.md` | `5b628493775bdb8c1a6b8894bf29fd9ce49bcbd4` | `803ab7693f53163db61d95fff28e26b635397b72ac34c11b82ca4cbae6d2bdf7` | 5752 | WP-ACC-005 |

## Material source-asserted gaps and control holds
- `regulatory/checkpoints/CG/README.md:3` — Status: SAFE DOCUMENTATION CHECKPOINT; WP-ACC-005 OPEN / P0 BLOCKED. No code, bank authorization, certification, or executed tests.
- `regulatory/checkpoints/CG/README.md:16` — Required fields for a future RailActivationEvidence record: evidence_id; institution_id; rail_id; version; environment; issuer; issuer_document_reference; issuer_document_digest_if_measured; issuer_authenticity_verification; verified_by; verified_at; effective_from; effective_until; revoked_at; participant_entitlement_reference; settlement_account_authority_
- `regulatory/checkpoints/CG/README.md:27` — Design-only tests (NOT EXECUTED): reject legacy-SYGMA-as-V10 authority; reject cross-institution approval; reject revoked RMA/key; reject schema-version mismatch; reject ACK-as-finality; hold outcome-unknown; reject missing liquidity evidence; prevent duplicate financial journal on retries; allow reconciliation under rail suspension without new transmissions
- `regulatory/checkpoints/CG/README.md:30` — Regulatory: issuer evidence insufficient; legal applicability and amendment chain unresolved. Accounting: chart mapping and recognition unresolved. Payments: finality and institution-scoped activation not authorized. Security: key/RMA trust boundary not authenticated. AML/fraud/privacy: institution-specific policy and retention unresolved. Architecture: sepa

## Multidisciplinary QA and DoR status
Regulatory/legal: historical citations and effective dates require direct primary issuer validation; source claims alone do not establish adoption or legal status. CFO/ledger: no monetary journal, accounting account mapping or migration updated. PCEC 312/322 textual inconsistency remains P0. Architecture: document lineage is not proof of Git ancestry or independent WP completion. Identity/security/AML: no privilege, customer KYC, sanctions or payment-rail entitlement assumed. Workflow/payments: external outcomes and reversals remain fail-closed. Data/privacy: preserved source-path, line-level excerpt, Git blob and SHA-256 evidence; legal retention authority not independently adjudicated. Resilience/ops: no deployment or recovery test. Testing: zero banking tests executed in this audit. No reviewer signatures or 15-gate DoR pass; all historical success statements remain unverified.

## Batch conclusion
Evidence archive may be marked DRAFT REMOTELY DELIVERED only after GitHub main branch, per-file extracted content, ZIP Git blob and downloaded ZIP SHA-256 independently match. This does NOT complete GOV-REC-001 nor WP-ACC-005; historical WBS denominator UNKNOWN. Next audit: batch 197 (or reconciliation after batch 180).
