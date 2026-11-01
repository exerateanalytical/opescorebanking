# OPES Core Banking — Checkpoint BA (2026-11-01)
**Phase:** 4 — Accounting Core / Financial Integrity  
**Active package:** WP-ACC-005 — OPEN, P0-blocked  
**Verified predecessor:** AZ, remote main `b61bc35ffcc93ca200ea2b97208917e8f5ba3c9b`  
**Scope:** dependency-safe primary-source reconciliation; no production code, banking tests, or regulatory certification.

## Material delta over AZ
1. **Additional instrument chain:** Official BEAC-hosted COBAC Regulation R-2003/03 (10 scanned pages), concerning securities accounting/prudential treatment, and its amending Regulation R-2010/03 (2 scanned pages), are now added to the securities-accounting dependency map. R-2010/03 Article 1 **replaces Article 24** of R-2003/03, not the entire regulation. The amended Article 24 contains a historical six-month treatment for certain public trading securities. **Not an approved current prudential rule**: later capital, risk-weighting, large-exposure and liquidity supersession must be independently reviewed.
2. **Title/settlement boundary:** R-2003/03 Article 22 distinguishes transfer of legal ownership from negotiation and off-balance interim treatment. Do not conflate a trade, custody record, book entry, settlement instruction, or bank balance with proven legal ownership or settlement finality.
3. **2015 activation evidence:** I-2015/01 Article 15 states entry into force at signature, with a visible date of 6 July 2015. This is a historical instrument-level observation, not certification of its current applicability or of all cross-referenced risk rules.
4. **Source custody:** Direct container requests for five issuer-hosted PDF URLs failed on DNS resolution. Browser inspection of official-hosted scans is possible; **zero original PDF bytes retained, zero SHA-256 hashes**. A visible scanned signature is not a verified digital signature.
5. **Existing P0 conflicts preserved:** 2003 2651/2652 enumeration/commentary; 2015 312/322 header/children; 2015 2651/2652 versus 29651/29652 non-parallel labels; no institution-approved crosswalk; 01/25–02/25 legal publication/judicial/settlement evidence incomplete.

## Files
- `PRIMARY_EVIDENCE_AND_CUSTODY.md`: evidence and reproducible acquisition failures.
- `SECURITIES_AMENDMENT_GRAPH.json`: source-clause edges, ambiguity and activation controls.
- `FINANCIAL_INTEGRITY_DECISIONS.md`: non-executable domain and financial safeguards.
- `ACCEPTANCE_SCENARIOS.json`: newly specified negative/invariant scenarios.
- `QUALITY_REVIEW.md`: multidisciplinary gate review.
- `CONTINUATION_STATE.json` and `EXECUTION_REPORT.md`: exact continuity and run counts.

**Decision:** WP-ACC-005 remains OPEN/P0. DoR FAIL. No dependent financial work package advanced. All candidate policies remain non-executable and require qualified legal and institution approvals.

**NEXT EXACT TASK:** `WP-ACC-005 — Checkpoint BB`: acquire and hash issuer PDFs through a trusted network path; reconcile R-2003/03 Article 22 and R-2010/03 Article 24 against currently effective prudential instruments, and obtain institutional/COBAC interpretation of PCEC source conflicts and outstanding 01/25–02/25 evidence. Preserve P0 holds.
