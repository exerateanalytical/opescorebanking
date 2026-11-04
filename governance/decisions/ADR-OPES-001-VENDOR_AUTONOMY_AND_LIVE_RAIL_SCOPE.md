# ADR-OPES-001 — OPESWARE vendor autonomy and payment-network boundary
**Decision date:** 2026-11-04
**Status:** Owner-approved programme decision; engineering implementation follows normal testing.

## Decision
OPESWARE independently develops, tests, markets, licenses, deploys and maintains OPES Core Banking as enterprise software. No agreement with a participating bank is a precondition for writing this product. A developer of core-banking software is not automatically a licensed deposit-taker, payment institution, or a direct member of SYGMA, SYSTAC or GIMACPAY.

For **actual live access** to a scheme, the deploying licensed institution or other duly authorized operator must have the relevant right of access and technical provisioning. This is a property of *the live integration deployment*, not of the product-development programme. OPESWARE may implement and test adapters using synthetic fixtures and local simulators without obtaining a scheme-participation agreement.

If OPESWARE itself later chooses to operate regulated payment services or act as a direct network participant, that is a separate activity requiring analysis of the applicable regulatory conditions. This decision does not purport to authorize it.

## Source basis
- BEAC official payment-system overview: https://www.beac.int/systemes-paiement/presentation-generale/ — distinguishes direct/indirect participation and conventions for participants.
- BEAC SYGMA: https://www.beac.int/systemes-paiement/systemes-de-reglement-brut/ — actual technical-access prerequisites.
- BEAC SYSTAC: https://www.beac.int/systemes-paiement/systeme-de-telecompensation/ — eligibility for participation and connectivity.
- COBAC Règlement 04/18: https://www.beac.int/wp-content/uploads/2019/07/REGLEMENT-N-04-18-CEMAC-UMAC-COBAC-du-21-d%C3%A9cembre-2018.pdf — context-specific payment service-provider arrangements; this does not imply every software supplier must have a participating bank.

## Engineering decisions
- Remove participating-bank approval from any general software-development, research, architecture, source-code, simulation or licensing DoR.
- Define **external_rail_mode = DISABLED | SIMULATED | CUSTOMER_AUTHORIZED_LIVE**. The default is DISABLED. SIMULATED never makes external transfers. CUSTOMER_AUTHORIZED_LIVE is configuration for a future actual deployed institution/operator, separate from source development.
- Use ISO 20022 vocabulary and BEAC scheme-specific message profiles in adapters, subject to actual profiles and access rights when connecting; never simulate external settlement as genuine finality.
- Network adapter can be developed without a bank. Bank-specific enrolment/credentials are acquired **at deployment**, if that integration is bought and activated.
- Education Edition: physically isolated simulation; no live network connection, settlement authority, or real customer data.
- Do not present technical contracts or simulator credentials as participation, certification, or regulatory authorization.

## Acceptance evidence
Review repository/test artefacts for forbidden unconditional bank-participation gates. Confirm no live secrets, network calls or settlement-finality claims in test defaults. Actual live integrations remain disabled until institution/operator entitlement is available.
