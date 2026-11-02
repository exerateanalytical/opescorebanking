# BS — Issuer evidence, interpretive tension and limitations

## Source BS-S1 — 2018 CEMAC/UMAC/COBAC payment-services regulation
Issuer-hosted scanned PDF: https://www.beac.int/wp-content/uploads/2019/07/REGLEMENT-N-04-18-CEMAC-UMAC-COBAC-du-21-d%C3%A9cembre-2018.pdf
- Printed Article 1 (page 2): applies to PSPs, technical partners, distributors and auditors, with enumerated exclusions including payments by the central bank/treasuries/postal financial services. **Do not confuse excluded operator transactions with all bank-initiated flows using BEAC rails.**
- Printed Article 2 (page 3): separates bank accounts, payment accounts and payment instructions.
- Printed Article 5 (page 5): eligible PSP categories expressly include **établissements de crédit**, **établissements de microfinance** and **établissements de paiement** subject to authorization.
- Printed Article 6 (page 5): defines payment institutions as entities professionally providing **exclusively** payment and related services. This narrower description is distinct from the broad Article 5 PSP category.
- Printed Articles 7–8 (page 6): restrictions specifically addressing **établissements de paiement** must not be misapplied wholesale to credit institutions.
- **Evidence quality:** Six selected pages visually inspected of a 29-page issuer-hosted scan; no claim that the full regulation or current amendment chain has been reviewed. Original PDF binary download failed DNS, so SHA-256 is absent. Current legal effect and subsequent amendments NOT authenticated.

## Source BS-S2 — BEAC circular 004/DGE/DSMP/2023
Issuer-hosted signed 3-page scan: https://www.beac.int/wp-content/uploads/2023/12/Lettre-circulaire-N%C2%B0-004-DGE-DSMP-2023.pdf
- Page 1: introductory sentence describes PSPs as establishments providing payment services **exclusively**; this creates an apparent category-definition tension against R-04/18 Articles 5–6. It may be drafting shorthand, not an intentional legal exclusion. Obtain authoritative interpretation.
- Page 1 Section I: erroneous mobile-phone transfers to incorrect recipient or recipient details.
- Page 2 Sections II–III: five-minute availability/initial request, later request conditional on available balance, hold/notification, consent/objection and 24h/48h nonresponse mechanisms. Do not encode without product-specific legal review.
- Page 3 Section IV: expressly refers to PSPs performing instant transfers or instant merchant payments **'par téléphone mobile ou non'**; therefore prior shorthand 'mobile-only' is insufficient to define the whole circular. It calls for contractual-term changes by 31 March 2024 and states effective on signature.
- **Evidence quality:** all three pages visually rechecked; no original PDF binary/hash, later amendments or issuer interpretation; no bank's customer/merchant contract obtained.

## Source BS-S3 — BEAC public payment-system reform page
https://www.beac.int/systemes-paiement/presentation-generale/
Describes direct participant (settlement account + technical access), indirect participant (known, settlement account but no direct technical access), and sub-participant (no own settlement account, not known). States participation is formalized by signed conventions. This informational text is not a signed bank agreement, not a live V10 protocol and not proof of per-bank conformity.

## Source BS-S4 — BEAC public payment-system document index
https://www.beac.int/systemes-paiement/instructions-circulaires-reglements/
Lists 2018 R-04/18 and 2023 Circular 004. No later amendment to this circular was identified on the inspected public index or targeted searches. **Absence from an index is not proof of no amendment or current applicability.**

## Remaining explicit unknowns
No issuer/COBAC opinion resolving broad PSP versus payment institution wording; no confirmed current amendment chain; no institution/product authorization, signed terms or technical participant convention; no issuer-confirmed SYGMA V10 or SYSTAC2 instant activation; no signed BEAC ISO 20022 CEMAC-BANK profiles, settlement finality or PCEC mappings; no D-2025/328 corrigendum, complete COBAC amendments or Regulations 01/25–02/25 legal evidence. **Do not activate rules or financial implementation.**
