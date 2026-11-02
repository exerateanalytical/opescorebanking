# BR — primary and vendor evidence, authority and limitations

## BR-S1 — BEAC signed circular, 24 November 2023
Issuer URL: https://www.beac.int/wp-content/uploads/2023/12/Lettre-circulaire-N%C2%B0-004-DGE-DSMP-2023.pdf
Catalogue: https://www.beac.int/systemes-paiement/instructions-circulaires-reglements/
Method: visually inspected issuer-hosted 3-page scanned PDF through browser screenshot; original binary download attempt failed; no independently calculated SHA-256, no digital-signature cryptographic verification.
- p1: payment-service-provider (PSP) erroneous mobile transfers; erroneous recipient or recipient coordinates; aims consumer protection and preservation of instant order irrevocability.
- p2: recipient credited immediately but funds available only 5 minutes after notification; payer can request restitution within 5 minutes of debit/execution notice. Later request may freeze disputed funds only if available balance is at least the amount. Recipient PSP immobilizes funds and notifies recipient; consent constitutes a payment/transfer instruction. Nonresponse is treated as acceptance after 24h for merchant payments and 48h for other transfers/payments. If recipient disputes, funds remain frozen and claimant must seek judicial remedy; preserve notices.
- p3: PSPs offering mobile or non-mobile instant transfers or merchant payments were directed to implement by 31 March 2024, amend card/wallet contracts and notices; circular states effective on signature.
Interpretation limitations: historical 2023 instrument; applicability to a specific licensed bank, EMF or PSP, later supersession, court orders, data retention and interaction with 2026 SYSTAC2/instant rails require issuer counsel/institution sign-off. Do not implement timing as universal policy.

## BR-S2 — BEAC public SYGMA page (historical informational source)
URL: https://www.beac.int/systemes-paiement/systemes-de-reglement-brut/
Viewed 2026-11-02. Says legacy SYGMA operational since 19 Nov 2007, central-bank settlement irrevocable when account provision is sufficient; describes SWIFT/private links and RMA exchange. Page contains historical examples and does not identify V10 release or current certification requirements. No inference of live V10 or automatic participant onboarding.

## BR-S3 — ProgressSoft vendor announcement, 24 August 2026
URL: https://www.progressoft.com/fr/news/la-beac-et-progresssoft-franchissent-une-nouvelle-etape-dans-la-modernisation-des-paiements-dans-les-six-etats-membres-de-la-cemac
Vendor claims SYSTAC2 live 3 Aug 2026; 71 simultaneously migrated participants, 59+ banks, six treasuries, six national BEAC directorates; ASP-hosted central/participant ACH, cheque clearing, dispute module; instant payment solution planned subsequently. Vendor is a project participant, not the scheme rulebook or regulator; 71 count is not a verified per-bank entitlement register.

## BR-S4 — BEAC 12 August 2026 release (BQ inherited)
URL: https://www.beac.int/wp-content/uploads/2026/08/CP_MISE-EN-PROD-SYSTAC.pdf
Issuer confirms SYSTAC2 platform production 3 Aug 2026, instant module later, SYGMA V10 finalizing as of 12 Aug. BR did not acquire a later issuer-confirmed launch notice. BQ findings retained, not re-counted as new.

## Non-authoritative operational risk signal
14 August 2026 news reporting post-launch retail clearing delays: https://leconomie.info/article/cemac-le-deploiement-du-systac-2-de-la-beac-grippe-les-operations-bancaires . This is a press claim, not BEAC incident record or verified outage metrics; useful only to design unknown-outcome, queue-age and reconciliation tests.

## Unresolved primary evidence
Current SYGMA V10 live/finality notice; SYSTAC2 instant activation; bank-specific signed participation, settlement account and authorization; private CEMAC-BANK MyStandards profiles/signatures and conformance; 2023 circular current applicability/supersession and exact PSP product scope; original PDF hashes; COBAC 2020–2021 operative amendment chain; D-2025/328 correction; approved PCEC and 01/25–02/25 legal/judicial/settlement documentation. No regulator contacted.