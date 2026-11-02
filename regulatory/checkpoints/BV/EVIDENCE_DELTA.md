# BV — Evidence delta and legal-status controls (2026-11-02)

## Canonical continuity
Predecessor: BU, verified main 185eeecd42d725c7bc8d65bf930ac87c2269d145. Active package WP-ACC-005 remains OPEN/P0. This is research/design only; not a closure or production implementation.

## BV-S1 — Signed-looking historical R-2019/02 reproduction (SECONDARY HOST)
URL: https://kalieu-elongo.com/wp-content/uploads/2019/11/reglement_cobac_r-201902_relatif_aux_normes_prudentielles_applicables_aux_etablissements_de_paiement.pdf
Six-page PDF reproduction of COBAC R-2019/02, adopted 23 September 2019. All six page images visually inspected in web PDF viewer; original PDF bytes could NOT be independently downloaded from execution container (DNS failure), so no local SHA-256 or issuer authentication. Historical text has 22 articles. Do not confuse appearance of seal/signature with provenance verification.
- Art 1 scope is **payment institutions**; not automatically all banks/EMFs. Art 2 historical minimum paid-in capital **500m FCFA**.
- Arts 3–8 define historical net-funds requirements, activity-based tranches, e-money float component, discretionary supervisory uplift and deferred-debit/credit coverage. The historical rates and amounts are **not approved as current executable thresholds**; amendment chain, institution category, approved denominator and methodology unresolved.
- Art 10 requires segregated safeguarding accounts and **at least weekly** reconciliation with holding banks, including distributor/subdistributor funds. This is not equivalent to client balance or settlement finality.
- Art 13 historical significant security incident definition includes a monetary criterion and reporting to COBAC/BEAC; later R-2024/01 has broader triggers.
- Arts 15–16 address outsourcing/distributors; Arts 17–18 traceability and payment-account positions; Art 19 refers to credit-institution accounting plan; Art 20 regulatory reporting and potential exemptions/instructions; Art 21 states historical effective date 1 October 2019.

## BV-S2 — BEAC-hosted COBAC 2024 annual report (ISSUER HOST, OPERATIVE TEXT EMBEDDED)
URL: https://www.beac.int/wp-content/uploads/2016/10/Rapport-annuel-de-la-COBAC-2024-PDF-14.8-Mo_compressed-1.pdf
Official 2024 annual report reproduces **COBAC R-2024/01** in full, Articles 1–42, beginning around printed p.107. Art 2 expressly covers credit institutions, EMFs, payment institutions and supervised holdings, subject to differentiated EMF provisions. Art 30 lists multiple significant-incident triggers beyond monetary loss and requires traceable notification to COBAC without delay, plus later reports. Arts 34–36 cover continuity and recovery testing; Arts 37–40 cover change control and data quality. Art 41 states **entry into force 1 January 2025** and transitional periods of **12 months** for credit/payment institutions and **18 months** for EMFs, and repeals specified earlier inconsistent provisions.
**Terminology discrepancy:** the SAME report's explanatory discussion around printed p.79 calls **1 January 2026** (credit/payment) and **1 July 2026** (EMFs) 'entrée en vigueur', whereas reproduced operative Art 41 says 1 January 2025 plus transition. These dates may reflect *end of transition* rather than legal commencement; record both verbatim and seek authoritative confirmation. Do not encode 2026 as the operative effective date by inference.

## BV-S3 — Official 2019 classification (ISSUER REPORT)
URL: https://www.beac.int/wp-content/uploads/2021/04/RSF-AC_19_VF-publish-ok.pdf
BEAC 2019 Financial Stability Review, pp.43–44: R-2019/01 = PSP licensing/change; R-2019/02 = payment-institution prudential norms; R-2019/03 = monetary sanctions. Corroborates BU's R-2019/03 research-footnote conflict; not a signed amendment.

## BV-S4 — R-2019/01 text (SECONDARY OCR ONLY)
URL: https://www.scribd.com/document/1027603665/Reglement-COBAC-R2019-01-Relatif-a-l-Agrement-Et-Aux-Modifications-de-Situation-Des-Prestataires-de-Services-de-Paiement
An eight-page third-party OCR transcription, especially Arts 1–5, indicates institution-specific licensing and evidence of services, channels, technical architecture, financial flows, fraud/AML, continuity and payer consent. OCR contains visible transcription errors. **Not an authenticated operative text**; do not copy exact language, deadlines, or institution-specific authorization from this transcription into executable policies.

## Custody, exclusions and P0
Direct container HTTPS fetch of BV-S1 failed DNS resolution; original issuer PDF, hash, signed current amendment chain, institution-specific authorization, PCEC mapping, signed rail participation/finality, BEAC restitution applicability, D-2025/328 correction and 01/25–02/25 evidence remain outstanding. No regulatory inquiry was transmitted. No historical numeric threshold was approved for production.

## New disposition
BV-C01: historical R-2019/02 text can inform a *non-executable* requirements traceability register, subject to issuer authentication. BV-C02: R-2024/01 has broader institution scope and significant-incident criteria; avoid treating 2019 monetary-only trigger as exhaustive. BV-C03: distinguish legal effective date from transitional compliance deadline. BV-C04: safeguarding is separate from ledger posting and external settlement. All remain open for final legal/institution review.
