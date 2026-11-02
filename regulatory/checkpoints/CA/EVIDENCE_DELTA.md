# CA — Primary-source evidence and unresolved interpretation
**Inspected 2026-11-03.** The issuer-hosted documents were inspected in web PDF text **and visual page images**. Original PDF bytes could not be downloaded by the container due to DNS resolution failure; no SHA-256, digital-signature validation, official bulletin chain or latest-amendment attestation is claimed.

## E-CA-01: BEAC Instruction 001/GR/2025, signed 17 Nov 2025
Primary signed scanned text: https://www.beac.int/wp-content/uploads/2016/10/Instruction-N%C2%B0001-GR-2025_norme-ISO-20022.pdf
- Page 1: issuer, title, signature-date stamp; Article 1 (page 2) institutes ISO 20022 variant **ISO Accelerator Pack (IAP)**.
- Article 2 (page 2): applies to CEMAC financial-sector entities whose payment platforms interact with BEAC-managed SYGMA and SYSTAC2; enumerates banks, EMFs, payment institutions, authorized interbank managers, treasuries, postal financial services and financial institutions. **Do not treat scope as proof of participation.**
- Article 3 (page 2): separate international SWIFT CBPR+ rules, domestic large-value BEAC_SYGMA_ISO20022 and domestic retail BEAC_SYSTAC_ISO20022. SYGMA profiles are published via SWIFT MyStandards, with access modalities defined by circular.
- Articles 4–6 (page 3): compliance with BEAC technical formats and regional migration calendar; BEAC project support; further clarification by circular.
- Article 7 (page 3): entry into force on signing date. This is **legal commencement**, not technical go-live.
- Annex (pages 4–5): schedule headed November 2025, but rows 5–6 and 9–12 display dates in 2025 that are chronologically incompatible with post-signature future activities (e.g. pilot March 2025 and go-live April–May 2025). Some dates/ranges ambiguous; task 12 repeated. **P0 provenance discrepancy: obtain issuer-corrected timeline and independent go-live confirmation.**
- Annex lists participant materials: `BEAC_SYGMA_ISO20022_BEAC_IAP_TIA` MyStandards collection, vendor REST MT–MX API specification `CMA-I 3005-21 PTD 002`, MX signature guide `CMA-I 3005-21 PTD 001`, message formats `CMA-I 3005-21 MFR 003`. These materials were **not obtained**, and are not assumed publicly accessible.
- Preamble shows a truncated year `15 mars 202` for an underlying regulation. Keep unresolved; not an operative-date inference.

## E-CA-02: BEAC Lettre Circulaire 013/GR/2025, signed 19 Nov 2025
Primary signed scanned text: https://www.beac.int/wp-content/uploads/2016/10/Lettre-Circulaire-N%C2%B013-GR-2025_portail-dacc%C3%A8s-MyStandard.pdf
- Pages 1–2: SYGMA V10 described as **in deployment at circular signing**, not proven live now; closed `CEMAC-BANK` community, BEAC administrator approval, institutional domain vetting.
- Page 2: 29 named message types, ADMI 2, PACS 6, CAMT 21. The publication includes a table of legacy MT to MX equivalents; equivalence does not establish exact current implementation-guide semantics or field-level validation.
- Page 2: access request through SWIFT MyStandards; members can inspect rules, examples, and use portal conformance tools. **A public ISO schema or a portal screenshot is not evidence of issuer profile approval.**
- Page 2: participants invited to join within one month from circular entry into force; circular effective on signature. This is a published invitation, not verified institution-specific enforcement or a current onboarding entitlement.
- No CEMAC-BANK membership, signed participation agreement, scheme acceptance certificate, participant-specific profile version, or MyStandards conformance receipt was acquired.

## E-CA-03: BEAC payment-system official catalogue
https://www.beac.int/systemes-paiement/instructions-circulaires-reglements/
Lists the two signed 2025 documents, strengthening issuer provenance. Does not establish full amendment chains, individual bank rights or current SYGMA V10 production state.

## E-CA-04: Carry-forward sources
2014 surveillance instruction: https://www.beac.int/wp-content/uploads/2016/10/instruction_01_gr_du_17032014_surveillance_sp_cemac.pdf
2014 charter: https://www.beac.int/wp-content/uploads/2016/10/Charte_Systemes_Paiement.pdf
2024 payment-services report referencing unsigned/unacquired 001/GR/2024: https://www.beac.int/wp-content/uploads/2026/04/RAPPORT-SUR-LES-SERVICES-DE-PAIEMENT-DANS-LA-CEMAC-2024-.pdf
BZ conflicts and all previously open legal questions remain unchanged; no speculative correction.

## Source and acquisition classification
- ISSUER_HOSTED_SIGNED_TEXT_VISUALLY_EXAMINED: E-CA-01 and E-CA-02.
- ISSUER_CATALOGUE: E-CA-03.
- ISSUER_REPORT_SECONDARY_DESCRIPTION: 001/GR/2024 only.
- ORIGINAL_BINARY_HASH_VERIFIED: **NO**; SIGNED_AMENDMENT_CHAIN_VERIFIED: **NO**; INSTITUTION_ENTITLEMENT_VERIFIED: **NO**; RAIL_GO_LIVE_VERIFIED: **NO**.

## Evidence requests (NOT transmitted)
BEAC DSMP/CRSP: corrected 2025 annex; current SYGMA V10 and SYSTAC2 service activation by rail; 2014 legal citation/date correction; current CRSP circulars and referential; signed 001/GR/2024 and amendments; approved participant-specific access, message profile and conformance procedures; settlement finality and statement evidence.
Institution legal/operations: bank license and participation contract; CEMAC-BANK access authorization; controlled test results and independent sign-off; bank-approved PCEC, cash/settlement reconciliation, incident routing and DR acceptance.
