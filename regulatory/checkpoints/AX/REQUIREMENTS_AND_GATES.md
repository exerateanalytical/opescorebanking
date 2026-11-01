# AX candidate requirements, authority graph and fail-closed gates
**Proposed only — no approved ADR, schema, API or code.**

- **AX-R01:** Chart codes are scoped to institution, accounting context, source instrument, and effective interval; reuse of a code with a different meaning requires an explicit approved mapping release.
- **AX-R02:** Conflicting instructions within the same source must be quarantined; no parser inference or implicit correction may become executable without documented legal and accounting authority.
- **AX-R03:** Regulatory dates must store at least document_date, stated_effective_date, publication_evidence_date, applicability_decision_date, approval_date and activation_date separately.
- **AX-R04:** Regulatory classification decisions cannot post or adjust money; Accounting Core exclusively authorizes balanced immutable entries.
- **AX-R05:** The institution must retain as-filed and restated report versions and demonstrate reproducible chart-version selection by historical business date.
- **AX-R06:** The legal supersession graph must resolve individual clauses and cross-references, not assume a complete replacement of the PCEC chart when only credit-classification rules change.
- **AX-R07:** General provisioning policy must evaluate the current regulation and its exceptions, eligible exposure base and institution approvals before producing a posting intent.
- **AX-R08:** Source binary, hash, custody, legal interpretation and approval evidence are mandatory before promoting an instrument-derived accounting rule to executable status.

## Authority graph (non-executable)
- SourceInstrument -> Clause -> SupersessionRelation -> LegalInterpretation -> InstitutionApplicability -> ApprovedChartRelease -> Mapping -> PostingPolicy.
- Each edge requires evidence ID, source locator, actor/approval, effective interval, and review status; do not conflate 2015 chart account codes with 2018 credit classification law.
- ChartRelease states: DRAFT -> EVIDENCE_REVIEW -> LEGAL_REVIEW -> ACCOUNTING_REVIEW -> DUAL_APPROVED -> SCHEDULED -> ACTIVE -> RETIRED; any unresolved P0 -> QUARANTINED. Only a later authorized, audited decision may restore it.
- A regulatory text with an apparent typo cannot be silently normalized; preserve original wording, alternative readings, explicit uncertainty, and signed interpretation.
- A business event records immutable accounting-rule snapshot and classification evidence. Posted journals never change on rule update; approved corrections produce distinct reversal/adjustment entries and separately versioned reporting.
- Before activation, enforce institution profile, complete source custody, supersession resolution, period policy, exact money arithmetic, double entry (including class 9), maker-checker, independent reconciliation and idempotent settlement evidence.

## Non-activation decision
All candidate 2651/2652, 312/322 and R-2018/01 historical-effect mappings are **RESEARCH_ONLY** until authoritative clarification, institution accounting sign-off and the complete Definition of Ready. No posting, provisioning, historical backfill, migration, UI authorization or compliance claim follows from this file.
