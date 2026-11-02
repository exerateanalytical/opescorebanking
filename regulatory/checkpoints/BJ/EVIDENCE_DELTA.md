# BJ — Evidence register and source confidence (2026-11-02)

| ID | Source / locator | Observation | Confidence and limits |
|---|---|---|---|
| BJ-SRC-001 | Republic of Congo Ministry of Finance hosted COBAC D-2025/328, https://www.finances.gouv.cg/fr/download/file/fid/9493 | PDF extracted lines 0–94; signed-body date 2025-12-12; annual 2026 list; 53 submissions / claimed 37 eligible; enumerated 36 (11+6+10+2+7); recital R-2020/01 vs Article 2 R-2020/02. | Government-hosted document text directly inspected. PDF screenshot failed HTTP 403, binary download failed DNS, no original hash/signature or official notification chain. |
| BJ-SRC-002 | Ministry document catalogue, https://www.finances.gouv.cg/fr/d%C3%A9cision-cobac-d-2025328-arr%C3%AAtant-la-liste-des-entreprises-de-grand-standing-et-dimportance | Catalogue shows date Dec 02 2025 while decision body says Dec 12 2025. | Metadata conflict; catalogue date may be clerical, no proof of legal date. |
| BJ-SRC-003 | Reproduction of COBAC R-2020/01 (dated 2020-04-15), https://www.kalieu-elongo.com/wp-content/uploads/2021/02/reglement_cobac_r-2020_01-dovision-des-risques.pdf | Title and Art.7 address amendments to R-2010/02 and annual eligible-company lists; reduction of quotities by quarter. | Secondary-hosted reproduction; original issuer binary/publication not independently authenticated. |
| BJ-SRC-004 | BEAC/COBAC 2024 annual report, https://www.beac.int/wp-content/uploads/2016/10/Rapport-annuel-de-la-COBAC-2024-PDF-14.8-Mo_compressed-1.pdf | Section II.5 describes complaints handling and calls instrument 'R-2020/01 relatif aux conditions de fonctionnement', conflicting with risk-division identity. | Primary institutional annual report, but descriptive paragraph is not operative regulation; possible editorial citation error, not silently corrected. |
| BJ-SRC-005 | Academic 2021 legal commentary, https://www.labase-lextenso.fr/l-essentiel-droits-africains-des-affaires/2021-n5/reglement-amiable-des-litiges-bancaires-la-reclamation-et-la-mediation-consacrees-et-organisees-DAA200a8 | Identifies COBAC R-2020/06 dated 2020-07-30 for consumer complaints and mediation. | Secondary corroboration; full issuer text not obtained; no executable deadlines adopted. |
| BJ-SRC-006 | BEAC 2021 financial stability review, https://www.beac.int/wp-content/uploads/2022/08/RSF_AC_2021.pdf | Prior checkpoint evidence of R-2021/01–02 amendments on sovereign exposure; complete operative text remains unavailable. | Context only, not substituted for amendments. |
| BJ-SRC-007 | Government-hosted R-2025/02, https://www.finances.gouv.cg/fr/download/file/fid/9490 | Prior BI verified Article 4/6/7 transitional interaction; still unresolved. | Rechecked source discoverability; no new certified interpretation or original bytes. |

### Evidence acquisition attempts
Direct supported downloader to `https://www.finances.gouv.cg/fr/download/file/fid/9490` failed; Python HTTPS failed DNS; PDF screenshot for D-2025/328 failed HTTP 403. No original-byte SHA-256 or PDF signature was verified. Web-readable PDF text is not original-byte authentication.

### Priority and provenance decisions
- P0 candidate: D-2025/328 contradictory 37 vs 36 roster; never create missing entity.
- P0 candidate: R-2020/01 vs R-2020/02 citation conflict in Article 2; no executable relief.
- P1 candidate: government catalogue 2 Dec vs signed-body 12 Dec date; official publication/notification gate.
- P1 candidate: 2024 annual report misattributes complaints rules to R-2020/01; complaints requirements must trace to issuer-signed R-2020/06 and 01/20.
- Candidate labels require canonical gap-owner assignment; **no existing P0 gap is closed**.

No external requests were sent. The 2025 COBAC annual report body and signed R-2021/01–02 remain inaccessible/unobtained.
