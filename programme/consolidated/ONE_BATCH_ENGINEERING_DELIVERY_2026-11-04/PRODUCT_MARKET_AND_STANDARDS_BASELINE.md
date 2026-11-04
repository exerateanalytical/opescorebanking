# OPES Core Banking — Product market, institution tenancy and standards precedence
Date: 2026-11-04. Status: ENGINEERING DRAFT; commercial multi-bank product, NOT OPESWARE's internal bank. Applies across all domain drafts in this delivery; this is a superseding clarification of their institution-profile language.

## Product definition and target markets
OPESWARE TECHNOLOGIES is the software vendor. Its customers are independent banks and eligible regulated financial institutions. Phase 1: Cameroon, Central African Republic, Chad, Republic of the Congo, Equatorial Guinea, Gabon (CEMAC). Later: other African jurisdictions. Neither Opesware nor a customer is presumed to hold a banking licence, payment-system membership, or access to settlement rails merely by deploying software.

## Multi-institution isolation (mandatory)
- Logical tenant = regulated legal institution, with immutable institution UUID, licence class, country, jurisdiction profile, reporting calendar, operational timezone, language, enabled modules, accounting scheme, branch hierarchy, and bank-owned keys. Groups/holding companies may aggregate only through separately authorized and auditable cross-entity reporting; no implicit shared balances.
- Default deployment recommendation: separate production data plane and cryptographic boundaries per regulated institution, with shared vendor-managed control plane only for explicitly consented metadata and software lifecycle; no central shared customer ledger. Dedicated per-bank deployment is supported. Multi-bank shared infrastructure, if offered, requires provable isolation and regulatory/data-residency approval.
- Each financial ledger, posting sequence, idempotency namespace, event topic, audit chain, backup, reconciliation, chart of accounts, cut-off calendar and external integration credential is institution-scoped. No cross-bank funds movement through internal database updates; use independently authorized interbank payment/settlement workflows.
- Per-bank configurable product factory, maker-checker matrix, fees, interest conventions, limits, risk appetite, holidays, branch cash controls, KYC policy, customer segments, AML monitoring, regulatory reports and retention. Version changes are effective-dated and never retroactively rewrite posted journals.
- Country/jurisdiction overlays define currency rules, legal holidays, language, regulatory mappings, data residency, bank secrecy/privacy, payment rails, identity documents, tax treatment and reporting; shared engine contains only jurisdiction-neutral invariants. CEMAC XAF is a supported currency; later multi-currency must preserve per-currency balanced posting and FX valuation evidence.

## Requirements precedence and evidence classification
1. Applicable mandatory primary law/regulation for the institution, activity and effective date.
2. Binding regulator instructions and authorized supervisory interpretations, including official CEMAC/BEAC/COBAC texts and jurisdiction-specific laws.
3. Contractual rail/network/scheme requirements, only where the bank is a duly authorized participant.
4. Bank-approved internal policy consistent with above.
5. International engineering standards and reference practices used to fill technical-design gaps, not to override local law.
6. OPESWARE product defaults, explicitly configurable and independently reviewable.

Every requirement records issuer, title, publication URL, section/article, applicability, effective date, version, verification date, reviewer and classification: BINDING_CEMAC, BINDING_LOCAL, RAIL_CONTRACT, BANK_POLICY, INTERNATIONAL_REFERENCE, or PRODUCT_DEFAULT. Missing authoritative source -> record UNKNOWN and use a conservative nonbinding technical design where safe. Never assert EU/UK/US banking regulations automatically apply in CEMAC.

## International design references (nonbinding unless separately applicable)
- Basel Committee operational resilience principles: governance, critical operations, dependencies, business continuity and incident management; https://www.bis.org/committees/bcbs/basel-consolidated-guidelines/module/orr/20
- NIST SP 800-53 Rev. 5 security/privacy controls: access control, audit, contingency, identity, incident response, supply chain; https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final
- ISO 20022 financial messaging (scheme/profile-specific); ISO 27001 information security management; ISO 22301 business continuity; ISO 31000 risk management; ISO 4217 currency codes; PCI DSS where cardholder data scope applies; OWASP ASVS for web/API security. Verify current editions, licences and exact normative clauses before marking conformity.
- UK/EU/US reference designs (e.g., strong customer authentication, operational resilience, third-party risk, fair treatment, model risk governance) are comparative engineering inputs, not automatically enforceable obligations or substitutes for CEMAC authority.

## Implementation-neutral requirements to draft without a named customer bank
- Institution onboarding wizard and policy validation; mandatory maker-checker for tenant configuration activation.
- Versioned institution configuration API and append-only configuration audit; secrets held in per-bank KMS/HSM boundary.
- Per-bank chart-of-accounts import/validation and posting rule mapping, with hard fail-closed for unresolved COBAC/PCEC 312/322 authority (WP-ACC-005).
- Institution-specific financial close, reconciliation, reporting and end-of-day; per-bank calendar and approved currency precision.
- Explicit adapter contracts for GIMAC and other networks; disabled until bank-specific legal and technical onboarding evidence is accepted.
- Bank-specific privacy retention, lawful access, regulatory reporting and disaster recovery; never use a global default to claim compliance.

## Acceptance tests to implement (not executed)
1. Bank A user and API token cannot read Bank B CIF, journal, files, audit, metrics or backups.
2. Duplicate command IDs across Bank A and Bank B remain isolated; replay within a bank never duplicates posting.
3. Bank A configuration revision cannot alter Bank B product rules or historical Bank A posted journals.
4. Group-level analytics never exposes underlying bank records without explicit scoped authorization.
5. Per-bank restore never merges or replays another bank's journal or outbox.
6. Unverified rail entitlement disables payment submission despite UI configuration.
7. Unresolved PCEC mapping rejects affected posting activation without inventing account codes.
8. Future jurisdiction overlay can be added without rewriting immutable journal semantics.

## Verified public source index (retrieved 2026-11-04)
- BEAC COBAC regulations index: https://www.beac.int/supervision-bancaire/reglements-de-cobac/ (lists bank governance, internal control, prudential, payment and accounting instruments; exact clause applicability must be checked against source PDFs).
- BEAC payment instruments index: https://www.beac.int/systemes-paiement/instructions-circulaires-reglements/ (lists CEMAC payment-services regulation and interoperability instructions; listing does not establish bank participation).
- BIS operational resilience principles: https://www.bis.org/committees/bcbs/basel-consolidated-guidelines/module/orr/20
- NIST SP 800-53: https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final

## Quality gate
This is a commercial-product architectural baseline, not a claim of full regulatory research, production-ready detailed specs or independent signoff. Regulatory and financial P0 remain fail-closed. All 15 DoR gates apply separately to every bounded implementation slice.
