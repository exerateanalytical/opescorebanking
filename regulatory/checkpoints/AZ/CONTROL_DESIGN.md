# AZ — Proposed accounting and custody controls (NOT APPROVED)

## Clause-aware amendment graph
Represent each clause as an immutable evidence object `{instrument_id,article,issuer_url,document_hash_or_null,observed_text_location,observation_time,interpretation_status}`. A successor edge `{predecessor_clause,successor_clause,change_type,effective_date_claim,legal_review,accounting_review}` must be approved before release. **I-2003/01 Art.7(a)/(b) specifically replaces 908 with 918 and 928 with 938**, not a global text search/replace. Preserve the source clause and historical reporting release for all posted journals.

## Domain ownership
- **Regulatory Authority Registry:** legal source custody, adoption/publication/effect/judicial dispositions and interpretation; cannot post money.
- **Chart of Accounts Authority:** institution- and effective-dated PCEC mappings, versioned source-to-code reconciliation and maker-checker approval; cannot post money.
- **Custody/Securities:** third-party legal ownership, depositor and security-class dimensions, off-balance evidence and reconciliation; cannot assert settlement.
- **Accounting Core:** only component permitted to commit balanced, exact-money, immutable journals with idempotency and correction/reversal lineage.
- **Payments/Settlement:** external finality solely from authenticated external evidence and independent reconciliation; internal branch 459 notice is not settlement.

## Fail-closed rules
1. The 2002-era 908 and 928 are historical identifiers; 2003 Article 7 successors 918/938 require legal-date and institution-profile review. No silent conversion of posted records.
2. For third-party custody, validate legal owner, correspondent/customer classification, depositor ID, instrument category, source instruction and retention before any reporting. A custody record is not an asset purchase.
3. Do not infer provision account `29651` corresponds to investment account `2651` by suffix; 2015 Articles 3–4 show non-parallel public/private labels. Require explicit approved account/provision relation.
4. Preserve 2003 2651/2652 internal contradiction and 2015 312/322 conflict as independent P0 evidence items. No auto-fix, no guessed errata.
5. `ChartRelease` state: DRAFT → EVIDENCE_REVIEWED → LEGAL_REVIEWED → ACCOUNTING_REVIEWED → DUAL_APPROVED → SCHEDULED → ACTIVE; contradiction → QUARANTINED. Activation checks issuer binary custody, legal applicability, institution profile, version, audit and rollback plan.
6. `CustodyInstruction`: RECEIVED → VALIDATED → CLASSIFIED → RECORDED → RECONCILED; uncertain ownership/source → INVESTIGATION_REQUIRED. No state transition directly posts money.
7. `PostingIntent` must include original business event, release ID, exact integer minor units, balanced lines, idempotency key, maker-checker proof and audit references. Retried execution returns original result or an explicit unknown; never duplicates.
8. Reconciliation must prove source-to-legacy and source-to-target aggregates with no unexplained difference, including off-balance custody quantities and securities categories; independent reviewer signs evidence.

## External dependencies and non-claims
No current consolidated PCEC, institution-approved 265/296 provision crosswalk, COBAC clarification, 2018 legal opinion, complete 01/25–02/25 instruments/publication/judicial decisions, or settlement approval is present. No production contract, executable test, schema migration, integration or cryptographic validation is claimed.
