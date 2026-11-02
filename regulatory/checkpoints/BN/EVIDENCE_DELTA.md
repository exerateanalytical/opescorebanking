# BN — Evidence delta and clause provenance (2026-11-02)

## Primary / issuer-hosted documents inspected
1. **COBAC R-2010/02 original, BEAC host:** https://www.beac.int/wp-content/uploads/2016/10/Reglement-_COBAC-_R_2010_02_divrisq.pdf. Seven PDF image pages were visually inspected. Printed pages show Articles 1–5 and 7–11; final page displays a second “Article 9” and “Article 10” after Article 11. This is a *historical baseline*, not an authenticated current consolidation. No original PDF bytes or SHA-256 were acquired. Specific findings:
   - Article 1: historical single-beneficiary and total large-exposure framework, with accounting social/consolidated source; later amendments supersede relevant numbers.
   - Article 2: net-own-funds cross-reference to older R-93/02/R-2001/01; current denominator requires R-2016/03 and later amendment reconciliation.
   - Article 3 (printed p.3): linked-beneficiary presumptions include common control, common parent, common de-facto management, dependent public entities, and specified ownership/cross-guarantee/business-link conditions. COBAC may authorize separation if independence is proven. **No software-only exception**.
   - Article 4 (printed pp.3–4): loans, leasing, securities, correspondent claims and off-balance commitments are in scope; some security/guarantee deductions and substitution mechanics are conditional. No blanket collateral deduction.
   - Article 5 (printed pp.4–5): historical exposure-weight categories and a BEAC-classification adjustment; **not current executable rates**.
   - Article 7 (printed p.7): historic exceptional half reduction for certain important enterprises, annual roster and institution quality conditions; amended by R-2020/01. Never implement original half treatment as current.
   - Article 8: internal monitoring, centralized connected-beneficiary exposures and sector concentration information; Article 9: periodic reports subject to instruction; Article 11: possible temporary COBAC derogation.
2. **BEAC 2021 Financial Stability Review, printed p.38:** https://www.beac.int/wp-content/uploads/2022/08/RSF_AC_2021.pdf. Explicitly identifies COBAC R-2021/01 (amending R-2010/01) and **R-2021/02 (amending R-2010/02)**; describes conditional zero-weighting of state-issued securities where a secure repayment mechanism exists. The report is official explanatory material, **not the full operative amended regulation**. No claim that every state security has 0% treatment.
3. **BEAC regulation catalogue:** https://www.beac.int/supervision-bancaire/reglements-de-cobac/. Links the 2010 original but is not an exhaustive current amendment consolidation.
4. **Republic of Congo government-hosted D-2025/328:** https://www.finances.gouv.cg/fr/download/file/fid/9493 (government catalogue https://www.finances.gouv.cg/fr/d%C3%A9cision-cobac-d-2025328-arr%C3%AAtant-la-liste-des-entreprises-de-grand-standing-et-dimportance). Browser-extracted body rechecked; the operative Article 1 enumerates 11+6+10+2+7=36, while recital says 37. Recital cites R-2020/01, operative Article 2 cites R-2020/02; recital SCLOG vs operative SLOG; 'au quart' vs 'du quart'; one-year validity without separately proven publication/notification/effective-date chain. No issuer correction found in targeted searches. Original bytes, hash and signature not obtained.

## Acquisition and authenticity limitations
- Direct container download of D-2025/328 failed on DNS resolution; browser extraction does not establish PDF byte hash or signer authenticity.
- Original 2010 BEAC scan was visually reviewed through PDF page rendering; no original bytes/hashes were acquired.
- R-2020/01 and R-2021/02 original current consolidated operative texts and subsequent amendments not authenticated; no issuer legal interpretation or bank-specific COBAC eligibility approval.
- Do not confuse: source-hosting credibility, document byte integrity, cryptographic signature validity, legal promulgation, current effectiveness and institution-specific entitlement. Each requires distinct evidence.
- No external regulatory correspondence was transmitted.

## Open P0
BN-P0-01: current R-2010/02 amendment chain, including R-2020/01 and R-2021/02, is incomplete.
BN-P0-02: D-2025/328 conflicts and exact reduction semantics unresolved.
BN-P0-03: linked-obligor aggregation/guarantee substitution, current risk weighting, denominator and reporting basis not institution-approved.
BN-P0-04: bank-specific supervisory eligibility and legal-entity identity unproven.
Inherited: PCEC GL mapping, Regulations 01/25–02/25 judicial/publication/settlement evidence, original document custody.
