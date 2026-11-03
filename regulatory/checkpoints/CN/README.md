# Checkpoint CN — WP-ACC-005: Article 8 source-access failure and draft crosswalk quarantine

Date: 2026-11-03. Predecessor: CM (read from canonical GitHub repository). Phase 4 — Accounting Core and Financial Integrity. **SAFE PARTIAL RESEARCH CHECKPOINT; WP-ACC-005 OPEN / P0 BLOCKED.** This is not a completed work package.

## Evidence and reproducibility

- Prior canonical record reviewed: `regulatory/checkpoints/CM/README.md`. It records the previously observed I-2015/01 Article 8(d) reference to account 312, versus surrounding 322-prefixed account family, without official corrigendum.
- Fresh issuer-restricted searches on 2026-11-03 for `lettre PCEC`, `312`, `322`, I-2015/01 and R-2018/01 transition provisions returned **no results**. This is **not proof of absence** of an official clarification.
- Fresh direct request for the official scanned I-2015/01 PDF at https://www.beac.int/wp-content/uploads/2016/10/instruction_cobac_i_2015_01_pcec.pdf **timed out**. No article/page was freshly visually inspected this run.
- Existing official R-99/01 evidence, recorded in CM, identifies `lettres PCEC` as a correction/clarification channel; no issuer letter resolving the discrepancy was obtained in this run.
- R-2018/01 Article 33 adoption/effectiveness mismatch remains a **previously evidenced question**; no new signed transition guidance was obtained.

## Article 8 draft crosswalk — controlled incomplete evidence register

This is a **schema and uncertainty register**, not a claim to have extracted or verified individual leaf accounts.

| Candidate source scope | Provenance status | Proposed target | Decision | Reason |
|---|---|---|---|---|
| I-2015/01 Article 8(b), account family 322 (as reported in CL/CM) | PREVIOUS-REPORT ONLY; fresh source page unavailable | UNDETERMINED | BLOCKED | Need exact signed page and operative edition |
| I-2015/01 Article 8(d), printed 312 reference (as reported in CL/CM) | PREVIOUS-REPORT ONLY; fresh source page unavailable | UNDETERMINED | BLOCKED — AMBIGUOUS 312/322 | Context does not authorize substitution |
| Article 8(d), 322-prefixed children (as reported in CL/CM) | PREVIOUS-REPORT ONLY; individual child codes NOT independently extracted | UNDETERMINED | BLOCKED | Do not fabricate leaf codes, labels or semantics |
| Any pre-2015 source account affected by Article 8 | UNVERIFIED | UNDETERMINED | BLOCKED | Need original PCEC source and full amendment chain |
| Any post-2018 affected account | UNVERIFIED | UNDETERMINED | BLOCKED | Need current signed PCEC amendments and institutional applicability |

**Certified leaf-level mappings: zero.** No source-to-target account substitution or accounting policy is authorized. The crosswalk must be expanded only when primary pages are available and article/page, printed account code, label, source edition, effective interval and authoritative supersession are evidenced.

## Reviewable extraction and activation contract

For each future candidate leaf row, capture `source_document_id`, `source_sha256`, `source_printed_page`, `source_article`, `source_account_code`, `source_account_label_exact`, `source_semantic_id`, `source_valid_from/to`, `target_document_id`, `target_account_code`, `target_semantic_id`, `transformation_type`, `legal_basis`, `effective_date`, `recorded_at`, `institution_profile`, `reporting_taxonomy`, `legal_approval`, `cfo_approval`, `independent_reconciliation_evidence`, `activation_status`. Every unknown is an explicit null with a blocker, not an inferred value.

A draft row must never be activated by an operator alone. Require signed source, regulator clarification where ambiguous, legal and CFO review, maker-checker, immutable change evidence, balanced migration journals if needed, closed-period handling, trial-balance tie-out and rollback procedure. No existing posted journal is rewritten; historical account semantics remain version-bound.

### Negative acceptance specifications (not executed)

1. Reject mapping of 312 to 322 solely from contextual inference.
2. Reject leaf-account row without source-page and signed edition.
3. Reject migration when old/new codes match but semantic IDs differ.
4. Reject migration lacking CFO/legal dual approval or reconciled trial balance.
5. Reject retroactive journal mutation based only on R-2018/01 Article 33.
6. Reject PCEMF-to-PCEC cross-application and CERBER reporting-taxonomy substitution.
7. On failed migration or unknown outcome, quarantine and reconcile; never retry into duplicate posting.

## Quality and risk gate

Regulatory: official clarification and signed amendment chain missing (P0). Financial: leaf mappings and institution-approved ledger impacts missing (P0). Architecture: versioned semantic identity specified, not implemented. Security: dual approval and tamper-evident audit required, not tested. Operations: reconciliation and recovery untested. Evidence: primary Article 8 PDF access failed. Payment interfaces: SYGMA V10/participant authorization/HSM gates unaffected. No production code or tests executed. **Definition of Ready FAILED.**

## Execution accounting

Attempted **1** work package (WP-ACC-005 continuation); completed **0**; kept open **1**; blocked from closure **1**. One safe partial documentation checkpoint CN; P0 blockers resolved **0**. Production code **0**; executable tests **0**. No dependent package attempted.

## NEXT EXACT TASK

**WP-ACC-005 — Checkpoint CO:** Obtain an authenticated readable copy of I-2015/01 Article 8 and any official PCEC erratum/letter addressing 312/322; transcribe each affected printed leaf code and label with article/page provenance, then compare against original and subsequent signed PCEC editions. If still inaccessible, preserve the explicit block and refine issuer evidence-acquisition records, without activating mappings or advancing dependent accounting work.
