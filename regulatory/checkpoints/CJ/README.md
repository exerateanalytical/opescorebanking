# Checkpoint CJ — WP-ACC-005: PCEC amendment authority, computerized-accounting controls and partial I-2015/01 provision review

Date: 2026-11-03. Predecessor: CI. Phase 4 — Accounting Core and Financial Integrity. **SAFE RESEARCH CHECKPOINT ONLY; WP-ACC-005 OPEN / P0 BLOCKED.** No production implementation, certification or tests.

## Newly inspected primary issuer sources

1. COBAC R-99/01 (2 December 1999), full four-article text: https://www.beac.int/wp-content/uploads/2016/10/cbR-99_01.pdf
2. COBAC R-2003/01 (15 January 2003), issuer-hosted searchable PDF: https://www.beac.int/wp-content/uploads/2016/10/R-2003_01.pdf
3. COBAC I-2015/01 (signed 6 July 2015), issuer-hosted 14-page scan: https://www.beac.int/wp-content/uploads/2016/10/instruction_cobac_i_2015_01_pcec.pdf . **Only selected pages (2, 4, 8, 12) of articles 2–13 visually inspected this run; NOT a complete article-by-article review.**
4. Official COBAC regulations index (checked 2026-11-03): https://www.beac.int/supervision-bancaire/reglements-de-cobac/ . Includes R-2018/01 on classification, accounting and provisioning of receivables. This is a **material post-2015 dependency**, not proof of its supersession effect without reading the text.

## Provision-level authority matrix (historical text; current effectivity NOT approved)

| Instrument / provision | Observed requirement or authority | Design implication | Unresolved |
|---|---|---|---|
| R-99/01 art. 1 | COBAC President may issue instructions modifying divisional account labels/content or creating divisional accounts. | Instructions are first-class PCEC versioning inputs. | Later changes/notification. |
| R-99/01 art. 2(a) | Secretary-General may issue 'lettres PCEC' for account clarification, corrections and minor changes, including subaccounts. | Track letters as possible account-schema changes, not only regulations. | Complete letter register. |
| R-99/01 art. 2(b) | Secretary-General may issue 'lettres CERBER' for regulatory-reporting collection corrections and PCEC-related changes. | Separate reporting taxonomy and delivery version from accounting chart. | Operative CERBER documentation. |
| R-99/01 art. 3 | Changes outside delegated powers require COBAC regulation. | Capture instrument authority and change type. | Approval hierarchy current validity. |
| R-99/01 art. 4 | Entry into force is tied to notification, not merely signature. | Never assume 1999-12-02 effective date. | Notification proof. |
| R-2003/01 art. 10–13 | Requires secure accounting organization, complete timely records, documentary audit trail, double entry, XAF and chronological records. | Mandatory journal provenance, balancing, currency and evidence contracts. | Later amendments/applicability. |
| R-2003/01 art. 15–17 | Defines mandatory books and computerized accounting controls; art. 16 prescribes correction through negative entry and accurate replacement; art. 17 requires irreversible validated entries, chronological closing, recovery/audit evidence. | Preserve original entries and reversal/correction linkage; distinguish value date from posting date; prohibit post-close insertion and mutation. | Reconcile detailed close cadence and current amendments. |
| R-2003/01 art. 17(d) | Value date in already closed period is recorded in first open period, with original value date separately indicated. | Separate immutable accounting period, effective/value date and late-entry reason. | Current status and CFO policy. |
| R-2003/01 art. 18–20 | Financial statement preparation deadlines and ten-year book/voucher retention (art. 19); statement models depend on separate instructions. | Deadline/retention policy must be legally versioned; no invented reporting schemas. | Later rules, privacy/retention conflicts and actual submission deadlines. |
| I-2015/01 art. 2 (scan p.2) | Subdivides account 191 into 1911 and 1912; contains historical general-credit-risk provisioning percentages. | Account/provision rules require effective-dated evidence and classification-rule reconciliation. | **DO NOT ACTIVATE percentages**: later R-2018/01 and other texts not reviewed. |
| I-2015/01 art. 3 (scan p.2) | Subdivides investment securities account 265 into public/private and BEAC refinancing-eligible categories. | Potential chart-version candidate only. | Later amendments. |
| I-2015/01 art. 7 (scan p.4) | Replaces former medium-term loan divisional-account grouping with healthy/sensitive categories. | Historical change of semantic account IDs; migration requires explicit mapping. | Entire article and later classification regime. |
| I-2015/01 art. 9 (scan p.8) | Reworks doubtful receivable accounts, deletes/recreates account families and distinguishes eligible guarantees. | Old account identifiers cannot be treated as immutable semantics across versions. | Article continues beyond sampled page; current classification regime. |
| I-2015/01 art. 12 (scan p.12) | Reworks off-balance-sheet customer commitments into healthy/sensitive classes. | Separate off-balance-sheet and exposure-classification model. | Article continues beyond sampled page; later amendments. |

**Important correction to prior ambiguity:** R-99/01 distinguishes PCEC instructions, PCEC letters and CERBER reporting letters. The earlier unverified acronym 'CRSP' must not be assumed to identify the reporting framework; R-99/01 expressly names **CERBER**. This does not prove current reporting technology or schema.

## Controls and negative acceptance cases (SPECIFIED ONLY, NOT EXECUTED)

- Reject an account-policy activation when the underlying instruction or PCEC letter is missing, authority invalid, effective-date evidence absent or supersession uncertain.
- Reject use of 2015 provisioning percentages as current rules until R-2018/01 and subsequent operative instruments are reviewed.
- A corrected entry must retain original immutable journal and explicit correcting entry/negative reversal and new entry; no edit-in-place.
- Late-arriving accounting value dates must not insert transactions into closed periods. Preserve both historical value date and actual open-period posting date.
- Reject chart migration where reused account number changes meaning without approved crosswalk and reconciliation.
- Treat report taxonomy as distinct from account chart, with separate CERBER letter provenance and effective dates.
- Preserve maker-checker, SoD, independent reconciliation, tamper-evident audit, recovery and least privilege; no financial recognition on mere ACK or unknown external settlement.
- Retention and reporting deadlines remain legal-policy candidates pending later amendments and institution profile; do not hard-code.

## Quality review / readiness

Regulatory: R-99/01 reviewed in full, R-2003/01 selected key provisions reviewed; I-2015/01 partial scan only; **not consolidated operative law**. Financial: balances, reversals and close controls mapped conceptually; CFO-approved accounts absent. Architecture: account identity/version migration and CERBER boundary now explicit. Security: no executable authorization or HSM evidence. AML/risk: R-2018/01 classification impact not assessed. Data: immutable provenance and retention requirements identified, not implemented. Payments: SYGMA V10 and institution entitlements unresolved. Operations: late entries and audit reconstruction modeled as proposed controls. Tests: cases specified, **zero executed**. **Definition of Ready FAIL**.

## P0 / P1 blockers

P0: Full visual examination of I-2015/01 articles 2–13; authoritative R-2018/01 and R-2014/01 effectivity/supersession and classification analysis; complete PCEC instruction/letter and CERBER letter chains; institution license/profile; CFO-approved PCEC mappings; payment-rail activation/participation/signing evidence. PCEMF remains a separate institution category. P1: scanned page evidence register, explicit legal reviewer approval, controlled source hashing, account-to-report crosswalk and policy change approval.

## Execution accounting

Work packages attempted: 1 (WP-ACC-005 continuation). Completed: 0. Open: 1. Blocked from closure: 1. Safe research checkpoints: 1 (CJ). P0 closed: 0. Production code: 0. Tests executed: 0. No dependent work packages attempted.

## NEXT EXACT TASK

**WP-ACC-005 — Checkpoint CK:** Visually inspect **every remaining page** of I-2015/01 articles 2–13, extract an exhaustive article/page/account-change matrix, then read issuer-hosted R-2018/01 and compare its legal effect on the 2015 provisioning/classification clauses; keep PCEC/CERBER and PCEMF separately gated. No production implementation until complete current authority chain and CFO-approved mappings.
