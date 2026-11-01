# BB proposed controls and negative acceptance scenarios — NOT EXECUTED
## Proposed controls
- Separate **legal instrument identity**, **clause identity**, **source reference text**, **authority-corrected reference**, **effective-date interval**, **supersession relationship**, **jurisdiction/institution applicability** and **approval evidence**. Never silently normalize conflicting numbers.
- Maintain a directed *clause-level* supersession graph. Reject a policy if a referenced definition has been expressly superseded without approved successor resolution. The 2016 net-own-funds replacement does not automatically repeal the 2010 risk-coverage regulation.
- Capital eligibility calculation, securities classification, trade ownership, settlement and accounting are distinct bounded responsibilities. A legal-text update must not mutate posted ledger history.
- Four-eyes approval by legal/compliance and CFO, with independent audit attestation for risk-rule activation; signed, immutable evidence custody; emergency rollback prevents new decisions but never retroactively rewrites settled journal postings.
- Instrument conflict/unknown outcome is fail-closed for automated capital/prudential reporting; issue review queue and produce explicit **UNRESOLVED** state rather than false compliance.
## Proposed acceptance scenarios (specification only)
1. Historical 2010 Article 2 referencing 1993 own-funds definition after 2017 → block until approved 2016 successor mapping.
2. 2010 preamble R-2009/01 citation vs capital instrument → preserve exact citation, flag conflict, no auto correction.
3. R-2003/03 Article 16 self-reference vs R-2003/04 index → flag and require signed authority decision.
4. R-2013/04 liquidity modification is misapplied to securities title transfer → reject cross-domain rule application.
5. R-2016/03 Article 36 is interpreted as blanket repeal of R-2010/01 → reject unsupported inferred repeal.
6. Retroactive rule amendment attempts to edit an immutable posted journal → reject and retain audit evidence.
7. Missing signed original PDF or source hash → do not promote source to cryptographically verified status.
8. Conflicting effective-date and source-publication evidence → policy remains INACTIVE pending legal signoff.
9. Institution capital mapping missing → capital report marked NOT_AUTHORIZED, not falsely compliant.
10. Trade executed without legal ownership or settlement confirmation → prevent title/finality assertion and inappropriate posting.
11. Duplicate evidence ingestion with same source identity but changed bytes → preserve both versions and open tamper/authority review.
12. Reversal or correction of misclassified securities → new balanced compensating journal only, no mutation.
All twelve scenarios are **proposed**, not executed; no production code or test runner exists.