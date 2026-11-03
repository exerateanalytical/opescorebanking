# Checkpoint CL — WP-ACC-005: visually verified I-2015/01 account-change matrix and R-2018/01 effective-date correction

Date: 2026-11-03. Predecessor: CK. Phase 4 — Accounting Core and Financial Integrity. **SAFE REGULATORY RESEARCH CHECKPOINT ONLY. WP-ACC-005 OPEN / P0 BLOCKED.** No production implementation, executed tests, regulatory certification or CFO-approved posting map.

## Evidence and method

Official issuer-hosted 14-page image-only scan, **all substantive Articles 2–13 visually inspected on printed pages 2–13** (PDF zero-based pages 1–12):
- COBAC Instruction I-2015/01: https://www.beac.int/wp-content/uploads/2016/10/instruction_cobac_i_2015_01_pcec.pdf
- COBAC Regulation R-2018/01, including visual inspection of printed page 12 (PDF zero-based page 11): https://www.beac.int/wp-content/uploads/2016/10/reglement_cobac_r_2018-01_relatif_a_la_classification_a_la_comptabilisation_et_au_provisionnement_des_creances.pdf
- Previous canonical checkpoint: `regulatory/checkpoints/CK/README.md`.

The source is a scanned legal document. Account labels below are carefully selected visual transcriptions and **not an exhaustive machine-readable chart of every leaf account**. The matrix covers each of Articles 2–13, all relevant change categories, representative and safety-critical identifiers, and page references. The authoritative scan must remain attached as provenance for later independently reviewed full transcription. No issuer-source hash was obtained.

## Article-by-article amendment matrix (historical 2015 version, not current-approved chart)

| I-2015/01 article | Printed page(s) | Account / classification changes observed | Migration and control implications |
|---|---|---|---|
| 2 | 2 | Account 191 divided into **1911** general credit-risk provisions and **1912** other general banking-risk provisions; comment to account 19 inserts historical general provision basis/rates. | Do not conflate 1911 with specific provision accounts. 2015 rates are historical, not current-approved. |
| 3 | 2 | 265 investment securities subdivided into 2651 public and 2652 private; **26511/26512** and **26521/26522** distinguish BEAC-refinancing-eligible versus other securities. | Preserve eligibility as independently evidenced property, not merely inferred from account code. |
| 4 | 2–3 | 29651 private and 29652 public investment securities further split into **296511/296512**, **296521/296522** by BEAC refinancing eligibility. | Track account tree and collateral eligibility separately; page 3 carries final 296522. |
| 5 | 3 | Class 3 introductory commentary inserts distinction between performing and sensitive receivables, including debit current/checking accounts. | Classification depends on borrower risk evidence even without arrears; later R-2018/01 rules must be checked. |
| 6 | 3–4 | Account 30 long-term loans: prior product-type divisions **301–306** deleted/replaced with **301 performing** and **302 sensitive**; product subaccounts reappear underneath, e.g. 3011–3017 and 3021–3027; restructuring subaccounts **30171–30173**, **30271–30273**. | **Critical identifier reuse:** old 301 means property investment loans; new 301 means performing long-term loans. No historical journal may be reinterpreted using new semantics without effective-dated mapping. |
| 7 | 4–5 | Account 31 medium-term loans: old **311–317** deleted/replaced by **311 performing** and **312 sensitive**; product subaccounts and restructuring leaves **31171–31173**, **31271–31273**. | Old 311 property loans versus new 311 performing medium-term loans is another incompatible semantic reuse. |
| 8 | 5–7 | Account 32 short-term loans: old **320–325,327** product divisions deleted/replaced by **321 performing**, **322 sensitive**; detailed product leaves **3210–3217**, **3220–3227** with subleaves e.g. **32111–32113**, **32211–32213**, **32171–32173**, **32271–32273**. | **Source drafting anomaly:** printed page 7 Article 8(d) calls the sensitive short-term division “312” while the actual leaves start 3220 and Article 8(b) creates 322. Flag for official clarification; do not silently alter source text or assume an approved corrigendum. |
| 9 | 8–10 | Account 34 distressed receivables: old **343**, **344**, **345** and former 3441–3444/3451–3453 removed; **3421–3425** for immobilized; new **344** eligible-guarantee-covered doubtful receivables and **345** other doubtful receivables; **3441–3444**, **3451–3452**, **3458** related-party irrecoverable and **3459** other irrecoverable. Extensive commentary added on eligible guarantees, restructuring and related-party write-offs. | Old and new 344/345 identifiers overlap but meanings differ. Historical age bands and collateral assumptions require effective-dated mappings and R-2018/01 comparison. Related-party write-off requires regulator approval gate. |
| 10 | 10–11 | Account 37 current/checking accounts: **3711/3712/3713** and **3721/3722/3723** for performing, sensitive, other; commentary allows identification attributes as alternative for performing/sensitive distinctions. | Account-code representation versus attributes is a governed policy choice, not grounds for losing classification history. |
| 11 | 11–12 | Account 39 customer impairment provisions: former **393**, **394**, **395** with prior subdivisions removed/redefined; new **394** eligible-guarantee-covered doubtful and **395** other doubtful; leaves **3941–3943**, **3951–3952**. | Same-code reuse for 394/395 demands versioned semantic crosswalk; reconcile with R-2018/01 provisioning methodology before any rates or posting. |
| 12 | 12–13 | Account 92 off-balance customer commitments: old **921–925,929** by instrument removed/replaced with **921 performing**, **922 sensitive**, detailed **9211–9219** and **9221–9229** by instrument. | Former 921 acceptance-to-pay now denotes all performing commitments. Never migrate by identical code alone; preserve contingent-exposure states. |
| 13 | 13–14 | Account 95 pledged securities: **9511/9512** public and **9521/9522** private investment/other securities in monetary-market collateral categories. | Distinguish asset ownership, pledged status, legal enforceability, BEAC eligibility, and off-balance memorandum representation. |

## Effective dates — visually resolved historical facts

- I-2015/01 Article 15, printed page 14: effective from signature; signature date visually reads **06 July 2015**.
- R-2018/01 Article 33, printed page 12: **effective from 1 January 2018**; document adopted/signed at Libreville **16 January 2018**. **This creates an explicit retroactive-effective-date question**, not a typo to silently fix. Confirm subsequent promulgation, application guidance, transition handling and amendments before configuring operative periods.
- R-2018/01 Article 32 repeals contrary provisions, particularly R-2014/01; it does not repeal the entire 2015 PCEC chart. I-2015/01 Article 14 references R-2014/01 for classifications; that reference must be annotated as historically superseded in conflicting scope, not erased from the historical text.
- The R-2018/01 source text contains classification, provisioning and collateral rules. This matrix does not assert the entire later amendment chain is complete.

## Proposed policy, domain, event and data safeguards — not implemented

1. `AccountDefinition`: institution profile, account code, semantic definition, parent, source instrument/article/page, legal effective interval, system adoption interval, status, approved crosswalk. Account code alone is **not** a stable primary key.
2. `AccountMigrationCrosswalk`: from-version/to-version, old/new semantic IDs, transformation rationale, signed CFO approval, control totals, reversibility plan and reconciliation evidence; prohibit ambiguous one-to-one mapping for reused identifiers.
3. `ExposureClassification`: separate risk state, collateral legal evidence, counterparty-group contagion, review, regulatory override and effective-date version. No classification state change directly posts money.
4. `RegulatoryEvidence`: source URI, page/article, verification timestamp, scanned-source hash when acquired, issuer, signed effective date, amendments, supersession and reviewer approval.
5. `JournalPosting`: immutable balanced double entry, exact currency arithmetic, idempotent command identity, correction by compensating journal, no backdated edit and independent reconciliation.
6. `RegulatoryPolicyActivation`: DRAFT -> LEGAL_REVIEW -> CFO_REVIEW -> DUAL_APPROVED -> SCHEDULED -> ACTIVE; any missing primary evidence, unresolved semantic collision, institution profile or P0 causes FAIL_CLOSED.
7. Proposed event contracts: `AccountChartVersionApproved`, `ExposureClassificationReviewed`, `ProvisionPolicyActivated`, `CrosswalkReconciliationFailed`. Outbox/inbox, versioned schemas, deterministic idempotency and audit trail required before implementation.

## Cross-regulation conflict and review register

| Issue | Evidence | Status and gate |
|---|---|---|
| R-2014/01 reference in I-2015/01 Article 14 | Printed page 14 versus R-2018/01 Article 32 | **PARTIALLY RECONCILED:** explicit later repeal of R-2014/01; update cross-reference policy only after legal interpretation. |
| 2015 general provisioning rates versus R-2018/01 Article 17 | 2015 page 2 and 2018 printed page 8 | Historically aligned in displayed figures; **not certified currently operative** absent later amendments. |
| Doubtful classifications and eligible guarantees | 2015 pages 8–10 versus R-2018/01 Articles 7–10, 18–22 | Need rule-by-rule effective-dated precedence and legal review. |
| Article 8(d) account 312/322 inconsistency | I-2015/01 printed page 7 | **OPEN SOURCE AMBIGUITY:** seek COBAC correction or authoritative interpretation. |
| R-2018/01 Article 33 retroactive effective date | Printed page 12 | **OPEN EFFECTIVITY/TRANSITION REVIEW:** verify whether later guidance modifies application and whether retrospective accounting adjustment is required. |
| PCEC vs PCEMF | Distinct licensed-institution frameworks | **OPEN:** obtain target institution's actual licence and approved regulatory profile. |
| CERBER reporting taxonomy | R-99/01 reporting clarification mechanisms | **OPEN:** issuer instructions, schemas, effective dates and mappings missing. |
| CFO-approved PCEC journals and closed-period corrections | No signed institution policy | **P0 OPEN:** no posting map or account migration authorized. |
| SYGMA V10 activation, participant authority, HSM signing | Previous checkpoint blockers | **P0 OPEN:** unrelated evidence not resolved by accounting-source discovery. |

## Quality review

Regulatory: articles 2–13 visually examined; source drafting inconsistency and subsequent chain open. Financial: semantic account collisions detected; no mapping authorized. Architecture: versioned account semantics specified. Security: maker-checker and fail-closed policy design, not implemented. AML/fraud: related-party approval controls remain design. Payments/reconciliation: no rail integration evidence. Privacy/retention: effective-dated audit provenance proposed, policy pending. DR/operations: no operational test. Testability: acceptance scenarios described but not executed. Regulator/auditor readiness: source citations present, institution legal sign-off absent. **Definition of Ready FAILED.**

### Proposed acceptance tests — NOT EXECUTED
- Old 301/311/921 transactions must not be relabelled as new categories solely because code matches.
- Ambiguous 312/322 account mapping rejected pending signed legal resolution.
- 2015 classification rule referring to repealed R-2014/01 cannot be activated without explicit supersession resolution.
- R-2018/01 policy cannot activate solely from adoption date 16 January when printed effective date is 1 January.
- Provision calculation cannot post without effective-dated rule, approved account mapping and balanced journal.
- Related-party write-off cannot proceed without requisite regulator approval.
- Replayed event and failed crosswalk reconciliation cannot duplicate or conceal ledger entries.

## Execution accounting

Work packages attempted: **1** (WP-ACC-005 continuation); completed: **0**; remaining open: **1**; blocked from closure: **1**. Research checkpoints safely delivered: **1 (CL)**. P0 blockers resolved: **0**. Production code: **0**. Executable tests: **0**. No dependent package started.

## NEXT EXACT TASK

**WP-ACC-005 — Checkpoint CM:** Obtain official clarification or later issuer amendment addressing I-2015/01 Article 8(d) “312” versus “322”, then build a full, independently reviewed leaf-account crosswalk (2015 versus original PCEC and later amendments) with source-page provenance. Reconcile the R-2018/01 Article 33 retroactive-effective-date implications and obtain institution-specific CFO/legal approval before any chart activation or financial implementation.
