# BA — Primary-source evidence and chain of custody
Research date: 2026-11-01. All sources are issuer-hosted by BEAC; being on an issuer domain does **not** by itself establish certified legal effect, absence of amendments, cryptographic integrity, or institutional applicability.

| Source | BEAC issuer-hosted URL | Specific observed material | Evidence state |
|---|---|---|---|
| COBAC I-2002/01 | https://www.beac.int/wp-content/uploads/2016/10/cbI-2002_01.pdf | 7 scanned pages; historical PCEC account amendments; Article 20 (prior AY) | Browser-accessible; binary not retained |
| COBAC I-2003/01 | https://www.beac.int/wp-content/uploads/2016/10/Bulletin-COBAC-n%C2%B06.pdf | Bulletin 6, printed pp.187–191: Art.2 2651/2652 contradiction; Art.7 908→918, 928→938; Art.9 2004-01-01 | Browser text inspected; binary not retained |
| COBAC I-2015/01 | https://www.beac.int/wp-content/uploads/2016/10/instruction_cobac_i_2015_01_pcec.pdf | Scanned pp.2,7,14: Art.3 2651 public/2652 private; Art.4 29651 private/29652 public; Art.8(d) 312 heading/322 children; Art.15 signature-date commencement 2015-07-06 | Visual pages inspected; binary not retained |
| COBAC R-2003/03 | https://www.beac.int/wp-content/uploads/2016/10/cbR-2003-03.pdf | 10 scanned pages; pp.8–10: Art.20 securities identification, Art.22 legal ownership/off-balance timing, Art.24 original prudential treatment, Art.30 2004-01-01 commencement | Visual pp.1,8,9,10 inspected; binary not retained |
| COBAC R-2010/03 | https://www.beac.int/wp-content/uploads/2016/10/rcobac2010-N0300.pdf | 2 scanned pages; Art.1 substitutes R-2003/03 Art.24; Art.2 says entry into force at signature. Signature date not reliably legible in inspected scan. | Both pages visually inspected; binary not retained |

## Direct-binary acquisition attempt
Using Python `requests.get` from the working container, HTTPS GET was attempted for each of the five URLs above. All five failed with `ConnectionError` caused by `NameResolutionError` for `www.beac.int` (temporary DNS resolution failure). A separate container download attempt for I-2002/01 also failed. This is an environment network limitation; it is **not** evidence the documents are unavailable from the issuer. No bytes were saved, no document SHA-256 was computed, no certificate or digital signature verified.

## Source-custody acceptance contract (proposed)
1. Acquire exact original response bytes from an issuer URL over a trusted, logged transport; record final URL, redirects, fetch time UTC, response status, content type, byte count, SHA-256 and access operator. Save immutable binary to versioned evidence storage; do not use a screenshot/text extraction as a substitute.
2. Validate PDF structure, expected page count, visible text, attachment/signature status and source metadata; flag any missing page or inconsistent scan. **Hash = integrity fingerprint only, not proof of legal authenticity or entry into force.**
3. Preserve both original and superseding instruments. Require legal reviewer to validate issuer, adoption, official publication, effective date, subsequent amendments, judicial effect, institutional applicability and formal interpretations.
4. Require separate accounting approver to sign exact chart and provision-account mappings; require independent reviewer for prudential treatment and external settlement claims. No single source-acquisition operator can self-approve a release.
5. If source is replaced at the same URL with a different hash, quarantine the new version and retain prior immutable evidence; do not silently update active mappings.
6. A regulation with illegible signature date or conflicting provisions remains `LEGAL_REVIEW_REQUIRED` even if it has a valid hash.

## Outstanding external evidence
No issuer-certified consolidated 2026 PCEC, formal COBAC interpretation of 2003 2651/2652 and 2015 312/322, institutional asset-to-provision mapping, current securities-prudential supersession opinion, legal opinion on R-2018/01 Article 33, authenticated full 01/25–02/25 instruments and publication/judicial records, or institution-specific settlement approval was obtained this run. No regulatory contact was made.
