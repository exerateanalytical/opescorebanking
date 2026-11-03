# Checkpoint CH — WP-ACC-005: primary PCEC amendment discovered; applicability gate remains OPEN
Date: 2026-11-03. Predecessor: CG (main commit 8df9e4036fb541b8ea65a64e33ab1b1bd222016a).
Phase 4 — Accounting Core and Financial Integrity. Status: SAFE RESEARCH CHECKPOINT ONLY. WP-ACC-005 OPEN / P0 BLOCKED.

## New authenticated issuer-source discovery
- BEAC-hosted **Instruction COBAC I-2015/01 portant modification du Plan Comptable des Etablissements de Crédit**: https://www.beac.int/wp-content/uploads/2016/10/instruction_cobac_i_2015_01_pcec.pdf . The document identifies itself as an amendment to PCEC and references COBAC R-98/01, R-99/01, R-2003/01, R-2014/01, and earlier instructions I-2002/01 and I-2003/01. This is PRIMARY TEXT FOUND, not a complete current operative consolidation. The publication URL's 2016 directory is not an effective date.
- BEAC official COBAC regulations index: https://www.beac.int/supervision-bancaire/reglements-de-cobac/ . Lists R-98/01 (PCEC), R-99/01 (updates), R-2003/01 (accounting organization), R-2018/01 (credit classification/provisioning), and the 2024 unique-approval regulation. Listing does not establish amendment chain or applicability.
- BEAC microfinance regulations index: https://www.beac.int/supervision-bancaire/microfinance/reglements-de-microfinance/ . Lists EMF-2010/01 and EMF-2010/02; the distinct PCEMF must NOT be conflated with PCEC.
- BEAC microfinance instruction index: https://www.beac.int/supervision-bancaire/microfinance/instructions-de-microfinance/ . Lists I-EMF-2010/03 reporting obligations; applicability depends on institution type.
- BEAC COBAC communications: https://www.beac.int/supervision-bancaire/la-commission-bancaire/communiques-de-presse . References CERBER reporting in 2025; not evidence that a particular CRSP/PCEC reporting schema is currently approved.

## Regulatory traceability / open source authentication
EVID-CH-01 COBAC I-2015/01: issuer-hosted text LOCATED; article-level extraction and complete amendment/supersession chain NOT YET VERIFIED.
EVID-CH-02 COBAC R-98/01 and R-99/01: official index LOCATED; full operative texts/amendments NOT YET VALIDATED.
EVID-CH-03 COBAC R-2003/01 and R-2018/01: official index LOCATED; applicability and latest amendments NOT YET VALIDATED.
EVID-CH-04 EMF-2010/01, EMF-2010/02 and I-EMF-2010/03: separate EMF regime LOCATED; no assumption of credit-institution equivalence.
EVID-CH-05 CRSP exact expansion, reporting schema, effective version, submission channel, and issuer-approved template: UNRESOLVED. Do not invent its meaning or a schema.
EVID-CH-06 legal entity category, license, country, product permissions, institution-approved PCEC/PCEMF chart and CFO signoff: UNAVAILABLE.

## Accounting recognition decision table — design hypotheses, NOT authoritative mappings
| Trigger | Evidence | Accounting decision | Control |
|---|---|---|---|
| Payment instruction received | authenticated instruction only | No settlement recognition | idempotent instruction identifier |
| Rail transport ACK | signed transport receipt | No settlement or customer available-funds credit merely from ACK | preserve ACK separately |
| Rail acceptance | authenticated acceptance | Do not infer finality; posting contingent on approved product and suspense policy | segregate state from journal |
| Settlement confirmed | issuer-authenticated settlement evidence + reconciliation | Candidate journal event ONLY after CFO-approved effective-dated mapping and legal finality rules | balanced immutable journal and independent reconciliation |
| Outcome unknown | no authoritative outcome | hold, query/reconcile; do not blind-retry or double-post | durable idempotency and exception queue |
| Reversal/correction | authorized correction evidence | compensating entries, never mutate posted journal | maker-checker and full audit |
| Insufficient liquidity | authenticated liquidity status | no fabricated settlement or balance | reject/queue according to approved rail rules |
| Cross-institution mapping | mismatched institution identifier | deny | tenant/institution boundary |

All debit/credit account numbers, recognition times, reporting codes, provisioning rules and availability rules remain explicitly UNASSIGNED pending primary-source interpretation and institution approval.

## Required next evidence packet
1. Issuer-authenticated full PCEC base, instructions and subsequent amendment chain, with article-level effective-dated traceability.
2. Institution legal/regulatory profile; identify whether bank, financial institution, EMF, or payment institution before selecting PCEC/PCEMF.
3. CFO-approved chart of accounts, product-to-journal matrix, suspense accounts, settlement and reconciliation policy.
4. COBAC/BEAC authenticated reporting taxonomy, templates, validation rules, frequencies, effective dates and delivery interface.
5. Independent legal/regulatory review of conflicting or superseded texts.

## Multidisciplinary review
Regulatory: important amendment discovered, current consolidation unverified. Financial: no account mappings approved. Architecture: preserve institution-specific effective-dated policy boundaries. Security: maker-checker, least privilege and evidence integrity remain required. AML/fraud/privacy: controls cannot be tailored before institution profile. Payments: prior SYGMA V10 rail activation and signing gates unchanged. Operations: reconciliation/unknown outcomes remain design-only. Test/audit: decision-table scenarios proposed, zero executable tests. **Definition of Ready: FAIL.** No code, production authorization, compliance certification, or P0 closure.

## Execution report
Work packages attempted: 1 (WP-ACC-005 continuation); completed: 0; open: 1; blocked from closure: 1. New primary issuer document located: 1. P0 closed: 0. Production code: 0. Tests executed: 0. Documentation checkpoint: CH. No dependent package attempted.

## NEXT EXACT TASK
WP-ACC-005 — Checkpoint CI: extract and compare article-level provisions from issuer-hosted COBAC I-2015/01 against R-98/01, R-99/01, R-2003/01 and later amendments, build an effective-dated PCEC amendment matrix, explicitly segregate EMF/PCEMF and unresolved CRSP reporting evidence; do not implement accounting postings until institution/CFO approval and full DoR.
