# Checkpoint CF — WP-ACC-005 continued (OPEN / P0 BLOCKED)
Date: 2026-11-03. Predecessor: CE. Phase 4 Accounting Core and Financial Integrity.
Classification: public primary-source recheck and control refinement; NOT WP closure, implementation, conformance, or executed testing.

## Official issuer evidence rechecked
- BEAC Instruction 001/GR/2025, ISO 20022 adoption and SYGMA migration annex: https://www.beac.int/wp-content/uploads/2016/10/Instruction-N%C2%B0001-GR-2025_norme-ISO-20022.pdf
  - The annex still shows a January 2026 technical meeting alongside participant upgrades marked NOV–FEV 2025 and training FEV 2025. The chronology is internally ambiguous; no corrected issuer-authenticated migration timetable was established by this run.
- BEAC Circular 013/GR/2025, CEMAC-BANK closed MyStandards community: https://www.beac.int/wp-content/uploads/2025/11/Lettre-Circulaire-N%C2%B013-GR-2025_portail-dacc%C3%A8s-MyStandard.pdf
  - The circular describes SYGMA V10 as under deployment at issuance, and requires approved access to participant message specifications. This is not proof of current production activation, institution access, schema approval, or conformance.
- BEAC payment regulatory publication index: https://www.beac.int/systemes-paiement/instructions-circulaires-reglements/
  - Public index shows the 2025 instruments, but no authenticated corrected activation notice was established by the limited review.
- BEAC SYGMA service description: https://www.beac.int/systemes-paiement/systemes-de-reglement-brut/
  - Describes legacy SYGMA operation since 2007 and settlement with sufficient funds. Does not establish V10 activation or participant entitlement.
- BEAC homepage: https://www.beac.int/
  - Lists the August 2026 SYSTAC 2 production announcement. SYSTAC 2 is not SYGMA V10; no inference across rails.

## CF control decision: independent rail-activation evidence
A payment rail must remain disabled for production transmission unless an institution-scoped activation evidence record separately authenticates:
1. issuer-signed production activation and exact rail/version/environment;
2. institution participation/entitlement and settlement-account authority;
3. institution-approved message profiles and versioned conformance evidence;
4. permitted signing/HSM credentials, RMA/network prerequisites and operational controls;
5. effective dates, supersession/revocation, and accountable internal approval.
All evidence references must be immutable/auditable with issuer, verification actor, timestamp, source, digest when computed, effective interval, institution and review status. No assumed default, optimistic activation, or reuse of another participant's approval.

## Accounting and failure semantics (design constraints, not code)
- ACK, accepted, cleared, settled, and legally final are distinct states. No ACK-only customer-funds availability.
- Unknown network outcome must enter reconciliation hold; retries must be idempotent and cannot create duplicate journals.
- Immutable balanced posted journals; reversal/correction only via compensating controlled entries; no direct balance mutation.
- The institution-approved PCEC account mapping, finality recognition and CRSP/COBAC operative reporting obligations remain P0 prerequisites for posting integration.

## Evidence gap and test register
P0-CF-01: corrected issuer-authenticated SYGMA V10 migration chronology — NOT OBTAINED.
P0-CF-02: issuer production activation and participant-specific entitlement — NOT OBTAINED.
P0-CF-03: approved CEMAC-BANK profile and conformance — NOT OBTAINED.
P0-CF-04: CMA-I 3005-21 PTD 001/PTD 002/MFR 003 and signing/HSM contract — NOT OBTAINED.
P0-CF-05: current PCEC/COBAC/CRSP primary texts and CFO-approved accounting mapping — NOT OBTAINED.
Design-only negative scenarios: reject foreign-institution activation; expired/revoked credentials; mismatched profile versions; ACK-as-finality; unknown-outcome replay; insufficient settlement liquidity; calendar-only activation. Executed tests: ZERO.

## Multidisciplinary quality review
Regulatory: source chronology conflict and current operative amendment chain open.
Accounting: mapping, settlement recognition and reconciliation open.
Architecture: fail-closed activation boundary articulated, not implemented.
Security: issuer authenticity, signing/HSM and participant entitlements open.
AML/fraud/privacy: institution-specific controls and retention open.
Operations/DR: unknown-outcome recovery and evidence procedures untested.
Test/audit: scenarios drafted; no executable tests or bank approval.
DoR: FAIL. No production implementation authorized.

## Execution report
Work packages attempted: 1 (WP-ACC-005 continuation); completed: 0; kept open: 1; blocked from closure: 1. Dependent packages attempted: 0. Production code: 0. Tests executed: 0. No phase completion percentage or approved WBS denominator. Historical archive recovery is a separate unresolved governance workstream.

## NEXT EXACT TASK
WP-ACC-005 — Checkpoint CG: seek authenticated BEAC SYGMA V10 activation/corrected chronology and institution-approved CEMAC-BANK/CMA technical materials; if unavailable, refine source-provenance, institution-scoped entitlement, PCEC and COBAC/CRSP mapping gates without authorizing production code.
