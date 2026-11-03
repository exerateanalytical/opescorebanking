# CB — Source evidence and limits (2026-11-03)
**Work package:** WP-ACC-005, continuing verified CA. **State:** OPEN/P0 BLOCKED. This document adds specific documentary traceability and does not re-open or count CA's previously completed research.

## Direct issuer evidence (newly extracted detail)
1. **BEAC Instruction 001/GR/2025, signed 17 November 2025, annex pp.4–5.** Its list of documents for SYGMA V10 participants explicitly names:
   - `CMA-I 3005-21 PTD 002 — SYGMA Spécifications de l'API REST (MT-MX)`;
   - `CMA-I 3005-21 PTD 001 — SYGMA Guide de signature électronique MX`;
   - `CMA-I 3005-21 MFR 003 — SYGMA Formats des messages`;
   - MyStandards collection label `BEAC_SYGMA_ISO20022_BEAC_IAP_TIA`.
   These are **references**, not copies of the vendor documents or verified revision identifiers. They cannot authorize an API implementation or cryptographic signature profile. Source: https://www.beac.int/wp-content/uploads/2016/10/Instruction-N%C2%B0001-GR-2025_norme-ISO-20022.pdf (annex, final page).
2. **BEAC Circular 013/GR/2025, signed 19 November 2025, annex p.3.** It provides an MT-to-MX *functional equivalence* table, including MT103→pacs.008, MT202→pacs.009, MT202 RETURN→pacs.004, MT900/910→camt.054, MT950→camt.053, and several proprietary MT999 subcommands mapped to CAMT messages. This is not a normative field-level transformation specification: exact schema editions, conditionality, signatures, code lists, business status and account/settlement semantics remain in the restricted CEMAC-BANK community and referenced CMA documents. Source: https://www.beac.int/wp-content/uploads/2016/10/Lettre-Circulaire-N%C2%B013-GR-2025_portail-dacc%C3%A8s-MyStandard.pdf.
3. **Collection identity/version ambiguity:** Instruction annex refers to `BEAC_SYGMA_ISO20022_BEAC_IAP_TIA` while Circular uses `BEAC_SYGMA_ISO20022`. These may be related collection/version labels, not necessarily conflicting requirements. Treat as **unresolved exact profile identity**, requiring issuer approval and immutable profile digest; do not auto-normalize labels.
4. **Issuer chronology remains contradictory:** November 2025 instruction annex contains participant updates `NOV–FEV 2025`, qualification `DEC–JANV 2025`, training `JANV–FEV 2025`, pilot `MARS 2025`, go-live `AVRIL–MAI 2025` and duplicate task number 12. The document also has `JANV 2026` for a technical meeting. No issuer-corrected annex or verified SYGMA V10 production notice was found during this run. Neither 2025 nor a guessed 2026 date is authorized as a production milestone. Source: https://www.beac.int/wp-content/uploads/2016/10/Instruction-N%C2%B0001-GR-2025_norme-ISO-20022.pdf.
5. **Public catalogue checked 3 November 2026:** The BEAC payment-instructions catalogue lists Instruction 001/GR/2025 and Circular 013/GR/2025. This inspection did **not** reveal an identified corrected migration annex or the referenced CMA vendor documents. Catalogue incompleteness is possible; absence is **not proof** of nonexistence or repeal. Source: https://www.beac.int/systemes-paiement/instructions-circulaires-reglements/.

## Corroborating external reports — NOT issuer activation proof
Reports dated 13–14 August 2026, citing BEAC's 12 August communiqué, described SYSTAC2 operational since 3 August 2026 and SYGMA V10 as still forthcoming. These reports are useful dated *historical context only*. No verified November 2026 issuer go-live, production endpoint, settlement statement, or bank-specific certification was obtained. Example: https://droitmediasfinance.com/index.php/actualites/droit-tech-fintech/1358-beac-le-systeme-de-telecompensation-en-afrique-centrale-version-2-systac2-entre-en-production-aligne-sur-la-norme-iso-20022 .

## Acquisition and authority status
- Issuer-hosted public PDF content reviewed through web rendering; **original PDF bytes not independently acquired or SHA-256 hashed**. Direct HTTPS request from execution container failed DNS resolution again this run.
- No authorized CEMAC-BANK membership, message schema files, actual CMA documents, bank-specific agreement, conformance receipt, signed settlement statement, corrected annex, or issuer clarification obtained.
- No BEAC/COBAC/GIMAC/CRSP request transmitted. No operational connection attempted.
- All earlier P0 holds (2014 instrument dates/numbering, 001/GR/2024, COBAC amendments, PCEC mappings, D-2025/328 and 01/25–02/25) remain open.

## Evidentiary classification
`PUBLIC_SIGNED_ISSUER_VISUAL`: existence and visible content of 2025 instruments; not cryptographic custody. `SECONDARY_DATED`: August 2026 operational reporting; not present activation. `NOT_ACQUIRED`: CMA/API/signature/schema files, profile revisions, corrected timetable, participant certification, legal opinions, settlement statements. No implementation-ready rule is inferred from `NOT_ACQUIRED`.
