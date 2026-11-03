# Checkpoint CG — WP-ACC-005: issuer-source recheck and settlement evidence boundary
Date: 2026-11-03. Predecessor: CF (verified main commit 7fdf8032171b35768abbee65996bb775ac5a9998). Phase 4 — Accounting Core and Financial Integrity.
Status: SAFE DOCUMENTATION CHECKPOINT; WP-ACC-005 OPEN / P0 BLOCKED. No code, bank authorization, certification, or executed tests.

## Primary-source evidence checked this run
1. BEAC official payment-instruments index, https://www.beac.int/systemes-paiement/instructions-circulaires-reglements/ (accessed 2026-11-03). The visible index lists Instruction 001/GR/2025 (ISO 20022) and Circular 013/GR/2025 (MyStandards access), as well as payment-system regulations from 2016 and 2018. The index alone does NOT supply an issuer-authenticated corrected SYGMA V10 production timetable, individual participant entitlement, approved message schema or successful conformance.
2. BEAC official SYGMA description, https://www.beac.int/systemes-paiement/systemes-de-reglement-brut/ (accessed 2026-11-03). It describes SYGMA operation since 19 November 2007, central-bank-money gross settlement when sufficient settlement-account funds exist, and connectivity/RMA prerequisites for direct participation. This description is NOT a V10 go-live announcement or a bank-specific authorization.
3. Prior CF issuer-source review: https://www.beac.int/wp-content/uploads/2016/10/Instruction-N%C2%B0001-GR-2025_norme-ISO-20022.pdf and https://www.beac.int/wp-content/uploads/2025/11/Lettre-Circulaire-N%C2%B013-GR-2025_portail-dacc%C3%A8s-MyStandard.pdf . CF documented inconsistent annex dates and gated private participant profiles. Those documents were not independently re-parsed in CG; do not treat their detailed provisions as freshly verified.

## CG finding — two distinct authorities, not interchangeable
- SYSTEM authority: BEAC rail/version/environment activation, settlement finality rules and service operating conditions.
- PARTICIPANT authority: institution-specific participation agreement, authorized BIC/account, RMA/connectivity, message profiles, signing/HSM keys, conformance and internal approval.
Neither a public legacy service description nor an ISO 20022 adoption notice grants either authority for V10 production transmission.

## Design-only control and evidence contract (not an approved external API)
Required fields for a future RailActivationEvidence record: evidence_id; institution_id; rail_id; version; environment; issuer; issuer_document_reference; issuer_document_digest_if_measured; issuer_authenticity_verification; verified_by; verified_at; effective_from; effective_until; revoked_at; participant_entitlement_reference; settlement_account_authority_reference; approved_message_profile_version; conformance_reference; signing_key_authorization_reference; network_RMA_reference; internal_approval_reference; status. All referenced approvals must be separately scoped and independently revocable. Missing, expired, conflicting or unverifiable authority => DENY NEW SUBMISSIONS. Retain read/reconcile/recovery capabilities for pre-existing outcomes.

Financial state contract remains: initiated != transmitted != acknowledged != accepted != cleared != settled != legally_final. Never credit spendable funds based solely on ACK. Settlement ledger recognition must be derived from independently authenticated evidence and institution-approved PCEC mapping; statuses themselves must never create or destroy money. Unknown outcomes are held for reconciliation and never blindly retried.

## Gap register and negative acceptance scenarios
P0-CG-01 corrected issuer-authenticated SYGMA V10 chronology: OPEN.
P0-CG-02 issuer V10 production activation and participant entitlement: OPEN.
P0-CG-03 approved institution-specific CEMAC-BANK schema/conformance: OPEN.
P0-CG-04 signing/HSM/CMA-I PTD 001/PTD 002/MFR 003 contracts: OPEN.
P0-CG-05 operative PCEC/COBAC/CRSP primary requirements and CFO-approved mapping: OPEN.
P0-CG-06 institution identity and regulatory profile for implementation: OPEN.
Design-only tests (NOT EXECUTED): reject legacy-SYGMA-as-V10 authority; reject cross-institution approval; reject revoked RMA/key; reject schema-version mismatch; reject ACK-as-finality; hold outcome-unknown; reject missing liquidity evidence; prevent duplicate financial journal on retries; allow reconciliation under rail suspension without new transmissions.

## Multidisciplinary review and DoR decision
Regulatory: issuer evidence insufficient; legal applicability and amendment chain unresolved. Accounting: chart mapping and recognition unresolved. Payments: finality and institution-scoped activation not authorized. Security: key/RMA trust boundary not authenticated. AML/fraud/privacy: institution-specific policy and retention unresolved. Architecture: separated activation and financial state models, conceptual only. Operations/DR: unknown-outcome reconciliation designed, not exercised. Test/audit: scenarios drafted, no tests run. DoR: FAIL. Do not code or certify this context.

## Execution report
Work packages attempted: 1 (WP-ACC-005 continuation); completed: 0; kept open: 1; blocked from closure: 1. Dependent packages attempted: 0. P0 closures: 0. Production code: 0. Executed tests: 0. Safe checkpoint documentation: CG. No claimed implementation readiness.

## NEXT EXACT TASK
WP-ACC-005 — Checkpoint CH: obtain and authenticate operative BEAC/COBAC PCEC and CRSP accounting/reporting primary texts and institution-specific CFO-approved account mapping; retain SYGMA V10 activation, participant profile and signing P0 gates; if evidence remains unavailable, document precise document-request provenance and accounting recognition decision table without implementing posting.
