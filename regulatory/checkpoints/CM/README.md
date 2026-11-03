# Checkpoint CM — WP-ACC-005: source-authority escalation and non-destructive account migration control

Date: 2026-11-03. Predecessor: CL. Phase 4 — Accounting Core and Financial Integrity. **SAFE PARTIAL RESEARCH CHECKPOINT. WP-ACC-005 OPEN / P0 BLOCKED.** No production code, executed tests, approved account crosswalk or certification.

## Evidence actually examined this run

1. Read canonical `regulatory/checkpoints/CL/README.md` from GitHub before continuing. It documents the visually inspected I-2015/01 Articles 2–13 and the unresolved Article 8(d) account 312/322 discrepancy.
2. Official COBAC instructions index: https://www.beac.int/supervision-bancaire/instructions-de-cobac/ — lists I-2015/01 and earlier I-2002/01. No correction of Article 8(d) identified in the indexed materials reviewed this run.
3. Official R-99/01: https://www.beac.int/wp-content/uploads/2016/10/cbR-99_01.pdf — Article 1 permits instructions modifying divisional accounts; Article 2 authorizes **lettres PCEC** for errors/omissions, clarifications and minor changes, and **lettres CERBER** for reporting corrections. Thus searching only for subsequent regulations/instructions is insufficient to certify a correction.
4. Official I-2015/01 indexed copy: https://www.beac.int/wp-content/uploads/2016/10/instruction_cobac_i_2015_01_pcec.pdf — current live PDF fetch timed out; relied on previously visually inspected CL record for the specific page-7 discrepancy, **not** on a new independent visual reading this run.
5. Official R-2018/01: https://www.beac.int/wp-content/uploads/2016/10/reglement_cobac_r_2018-01_relatif_a_la_classification_a_la_comptabilisation_et_au_provisionnement_des_creances.pdf — independently visually rechecked printed page 12, Article 33: effective **1 January 2018**; adoption at Libreville **16 January 2018**. Article 1 applies in conjunction with PCEC; Article 32 repeals contrary earlier provisions.
6. Official microfinance index: https://www.beac.int/supervision-bancaire/microfinance/reglements-de-microfinance/ — separately identifies EMF-2010/01 and EMF-2010/02, reinforcing non-interchangeable PCEMF scope.
7. Official COBAC communications index: https://www.beac.int/supervision-bancaire/la-commission-bancaire/communiques-de-presse/ — identifies a 21 February 2025 CERBER reporting meeting; does not provide approved reporting schemas or PCEC corrections.

## Decision on 312/322 discrepancy

**OPEN / NO OFFICIAL CORRIGENDUM LOCATED.** CL documents Article 8(b) creating division 322 for sensitive short-term credit and Article 8(d) referring to 312 while enumerating 322-prefixed children. This is strong internal contextual evidence of a drafting inconsistency, **not** sufficient legal authority to replace the printed 312 with 322 in an operative chart. Under R-99/01, a PCEC clarification letter or authoritative later instruction is an appropriate evidence target. Do not represent absence in the consulted index as proof no correction exists.

### Required source-request specification (not sent)

Request from COBAC/BEAC: (a) signed I-2015/01 source and all errata/lettres PCEC concerning Article 8(d); (b) subsequent PCEC instructions, letters and applicable versions; (c) definitive effective dates and institution applicability; (d) confirmation whether the text '312' is an error and, if so, the legally authorized replacement; (e) applicable CERBER crosswalk and transition guidance; (f) any circular concerning R-2018/01 Article 33 and retrospective accounting treatment. Record document reference, issuer, date, signatory, delivery channel, original file hash and independent legal review. No external request was transmitted.

## Proposed crosswalk schema — DESIGN ONLY

Each migration row MUST contain: institution licence/profile; source PCEC edition and effective interval; source account code and immutable semantic ID; source article/page; target edition/effective interval; target account code and semantic ID; transformation category (unchanged/split/merge/reclassification/retired/ambiguous); transaction-time vs accounting-effective-time vs recorded-at time; applicable credit classification; financial impact; control totals; reversibility; evidence URI/hash; legal and CFO approvers; decision and activation status.

**Current row status:** account families 30/31/32/34/37/39/92/95 are candidate crosswalk scopes per CL; **zero leaf-level rows independently certified in this run**. Old 301/311/921/344/345 codes may have incompatible semantics in later versions. An identical code must never imply an identical accounting meaning.

### Fail-closed migration and acceptance design

- Never rewrite historical posted journals or silently relabel them under the latest account dictionary.
- Resolve historical balances against the chart version valid for the original posting; introduce any new opening/reclassification journal only under separately authorized, balanced, immutable entries and reconciled cutover controls.
- Reject any ambiguous mapping, including the 312/322 source discrepancy, before approval.
- Require dual independent legal and CFO approval, segregation of duties, signed control totals and rollback/recovery plan before migration activation.
- Preserve closed-period controls and record separately: legal effective date, publication/notification date, institution adoption date, reporting period and operational activation date.
- Never infer that a regulation effective on 1 January but adopted 16 January automatically authorizes retrospective journal mutation. Record legal interpretation and auditor/CFO-approved transition treatment before any retroactive reporting or adjustment.
- Reconcile loan classification, provisioning, off-balance commitments and CERBER independently; do not infer financial posting from a status change.
- Negative test specifications (not executed): duplicate migration command; ambiguous code collision; unapproved retroactive policy; closed-period update; incomplete source evidence; failed trial-balance tie-out; changed CERBER taxonomy; absent maker-checker; missing institution licence.

## Quality review and unresolved gates

Regulatory: R-99/01 establishes the correction mechanism, but no authoritative 312/322 correction found. Accounting: zero approved leaf-account crosswalk rows. Architecture: bitemporal account identity and semantic versioning proposed; not implemented. Security: legal/CFO maker-checker and immutable audit required. AML/fraud: related-party overrides require independent evidence. Operations: rollback and reconciliation plan specified, untested. Data/privacy: document retention and legal holds unresolved. Testing: scenarios specified, no execution. Auditor readiness: evidence chain and institution approvals missing. Payments: SYGMA V10 activation, participation and signing/HSM gates unchanged. **Definition of Ready FAILED.**

## Execution accounting

Attempted: **1** work package (continuation of WP-ACC-005). Completed: **0**. Kept open: **1**. Blocked from closure: **1**. Safe partial research checkpoints: **1 (CM)**. P0 blockers resolved: **0**. Code: **0**. Tests executed: **0**. No dependent work package attempted.

## NEXT EXACT TASK

**WP-ACC-005 — Checkpoint CN:** Search issuer PCEC clarification letters/errata and later signed amendments for authoritative resolution of I-2015/01 Article 8(d) 312/322; if unavailable, preserve the ambiguity and build a source-page-provenanced *draft* leaf-account crosswalk for Article 8 only, with explicit ambiguous rows and no financial activation. Separately collect any COBAC transition instruction addressing R-2018/01 Article 33. Continue without bypassing institution-specific legal/CFO and CERBER/PCEMF gates.
