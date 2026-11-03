# Checkpoint CI — WP-ACC-005: PCEC primary-text article anchors and effective-date control

Date: 2026-11-03. Predecessor: CH (commit b6b82134089b25435d14c901f77f557c1884ef99). Phase 4 — Accounting Core and Financial Integrity.
Status: SAFE RESEARCH CHECKPOINT ONLY. WP-ACC-005 remains OPEN / P0 BLOCKED. No implementation or test execution.

## Primary documents inspected (issuer-hosted)

1. COBAC R-98/01, official BEAC-hosted PDF, 2 pages: https://www.beac.int/wp-content/uploads/2016/10/Re%CC%80glement-COBAC-R-9801-relatif-au-plan-comptable-des-e%CC%81tablissements-de-cre%CC%81dit.pdf . The text is machine-readable and its article-level provisions were inspected.
2. COBAC I-2015/01, official BEAC-hosted 14-page PDF: https://www.beac.int/wp-content/uploads/2016/10/instruction_cobac_i_2015_01_pcec.pdf . The PDF has no machine-readable text in the web extraction; its first and final pages were visually inspected. **Articles 2–13 have NOT been extracted or compared**. Do not treat this as complete legal review.
3. Official BEAC issuer-hosted directory index lists R-99/01 and distinct EMF-2010/01 and EMF-2010/02 PCEMF documents: https://www.beac.int/wp-content/uploads/2016/10/ . Index listing is discovery only, not review of their operative article texts.

## Article-level verified findings

| Instrument | Article | Verified text-level effect | Evidence confidence / limit |
|---|---|---|---|
| COBAC R-98/01 | 1 | Establishes PCEC for credit institutions in Central Africa. | Issuer-hosted readable text; original 1998 instrument, later amendment chain unresolved. |
| COBAC R-98/01 | 2 | References annexed principles, chart, account-identification attributes and methodological notes for foreign-currency and leasing transactions. | Annex not authenticated as complete current operative annex. |
| COBAC R-98/01 | 3 | Assigns application modalities, synthesis statement rules, nomenclature and account-to-report correspondence to instructions of COBAC President. | This is a **separate reporting-instruction dependency**, not permission to invent a CRSP schema. |
| COBAC R-98/01 | 4 | Requires covered credit institutions to organize accounting under PCEC. | Scope must be assessed against actual institution license. |
| COBAC R-98/01 | 5 | Original application dates: accounting years opened 1999-07-01 for Cameroon; 2000-01-01 for other five CEMAC states, with optional early adoption notification. | Historical initial dates only; not proof of today's consolidated requirements. |
| COBAC R-98/01 | 6 | Establishes consequences for noncompliance and repeal of prior contrary provisions from applicable dates. | No claim about later supersession. |
| COBAC R-98/01 | 7–8 | Notification and implementation responsibility provisions. | Historical original text. |
| COBAC I-2015/01 | 1 | States PCEC is modified through articles 2–14 of the instruction. | Visually inspected page 1; substantive amendments 2–13 remain unreviewed. |
| COBAC I-2015/01 | 14 | Adds credit-classification identification attributes and refers to COBAC R-2014/01 definitions. | Visually inspected page 14; R-2014/01 later status not yet established. |
| COBAC I-2015/01 | 15 | Instruction enters into force from signature date; signed at Libreville 06 July 2015. | Visually inspected page 14. **Not the website upload date.** |

I-2015/01 preamble references R-98/01, R-99/01, R-2003/01, R-2014/01, I-2002/01 and I-2003/01. This establishes a **minimum historical dependency chain**, not a complete post-2015 amendment/supersession chain.

## Effective-dated legal mapping — initial evidence matrix

| Rule ID | Instrument | Rule family | Earliest text-derived effective anchor | Latest operative version | Implementation status |
|---|---|---|---|---|---|
| PCEC-BASE-CMR | R-98/01 art. 5 | Original Cameroon adoption | Accounting years opened from 1999-07-01 | UNKNOWN | BLOCKED |
| PCEC-BASE-OTHER | R-98/01 art. 5 | Original other CEMAC adoption | Accounting years opened from 2000-01-01 | UNKNOWN | BLOCKED |
| PCEC-AMEND-2015 | I-2015/01 art. 15 | Instruction effective from signature | 2015-07-06 | UNKNOWN; later amendments unverified | BLOCKED |
| PCEC-CLASSIFICATION | I-2015/01 art. 14 | Credit classification identification | 2015-07-06 as instrument signature date | UNKNOWN; dependent on R-2014/01 and subsequent rules | BLOCKED |
| PCEMF-SEPARATE | EMF-2010/01 and EMF-2010/02 | Microfinance chart boundary | NOT VERIFIED | UNKNOWN | BLOCKED |
| PCEC-REPORTING | R-98/01 art. 3 | Synthesis reporting instructions | Requires separate issuer instruction | UNKNOWN | BLOCKED |

Never use these historical dates to select current account mappings automatically. An effective-dated rule requires issuer source, precise scope, publication/signature/effectivity evidence, supersession chain, institution applicability, reviewer and CFO approval.

## Design decisions and negative acceptance cases (NOT EXECUTED)

- Financial journal engine remains generic, exact, immutable, balanced, and idempotent; no account codes or postings derived from historical legal instruments without approved institution mapping.
- Distinguish legal signature date, source upload date, accounting-year applicability, amendment effectivity and revocation/supersession date.
- A regulator's reporting taxonomy must not be inferred from a chart-of-accounts annex; reporting templates, submission frequency, validations and delivery channel require separate issuer evidence.
- PCEMF is institution-type gated and cannot silently inherit PCEC.
- Reject rule activation where institution license is unknown; reject a future superseded chart version; reject effective-date gaps/overlaps; reject a 2018 file upload as 2015 legal effectivity; reject account mapping with absent CFO approval; reject unauthenticated CRSP expansion or reporting format; reject duplicate postings and ACK-as-settlement.

## Multidisciplinary quality review

Regulatory: verified limited article anchors; **not** full amendment-chain or current operative legal consolidation. Accounting: no approved chart or posting mappings. Architecture: effective-dated institution-scoped rule contract remains conceptual. Security: source integrity, maker-checker and authorization required. AML/fraud/privacy: institution-specific obligations unverified. Payments: SYGMA V10 activation, participant profile and signing/HSM P0 unchanged. Resilience/operations: unknown-outcome reconciliation remains a required design control. Testing/audit: negative scenarios specified, **0 executed**. DoR: **FAIL**.

## Outstanding P0 / P1 evidence

P0: I-2015/01 articles 2–13 extraction and review; full R-99/01, R-2003/01, R-2014/01, I-2002/01, I-2003/01 and later amendment chain; current institution category/license and CFO-approved chart; current reporting instructions/templates (CRSP term still unverified); SYGMA V10 activation and institution-specific entitlements/signing.
P1: provenance of scanned source page-level excerpts, reviewer sign-off, report-to-account crosswalk, controlled evidence storage.

## Execution report

Work packages attempted: 1 (WP-ACC-005 continuation). Completed: 0. Kept open: 1. Blocked from closure: 1. Safe documentation checkpoints: 1 (CI). Production code: 0. Executed tests: 0. P0 closures: 0. No dependent work package attempted.

## NEXT EXACT TASK

WP-ACC-005 — Checkpoint CJ: inspect issuer-hosted COBAC I-2015/01 articles 2–13 page-by-page and extract precise amended account/attribute clauses; obtain and review R-99/01 and R-2003/01 primary texts, then build provision-by-provision supersession and institution applicability matrix. Preserve PCEMF and CRSP reporting uncertainty. Do not authorize accounting implementation without full DoR.
