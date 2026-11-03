# Checkpoint CC — WP-ACC-005 (OPEN / P0 BLOCKED)
Date: 2026-11-03. Predecessor: CB, remote main db450b35b43c390523327c9ee995b8eebd9d623e. Phase 4 Accounting Core / Financial Integrity. Last completed WP-ACC-004 inherited, not reaudited.

## Fresh issuer evidence and limits
1. BEAC official SYGMA page (https://www.beac.int/systemes-paiement/systemes-de-reglement-brut/) describes SYGMA as operational since 19 November 2007, with final and irrevocable settlement in central-bank money conditional on sufficient settlement-account funds. **This is not evidence that SYGMA V10 is live**. The public page contains legacy SWIFT/RMA connectivity information and an historical 100m FCFA routing description; these cannot be hardcoded as current V10 specifications.
2. BEAC official payments regulatory catalogue (https://www.beac.int/systemes-paiement/instructions-circulaires-reglements/) lists Instruction 001/GR/2025 and Circular 013/GR/2025. Catalogue presence is not proof of corrected migration dates, institution authorization, or production activation.
3. BEAC Circular 013/GR/2025 (https://www.beac.int/wp-content/uploads/2025/11/Lettre-Circulaire-N%C2%B013-GR-2025_portail-dacc%C3%A8s-MyStandard.pdf) states SYGMA V10 was **in deployment** on 19 November 2025 and CEMAC-BANK is restricted to approved users. This dated statement cannot establish status in November 2026.
4. Instruction 001/GR/2025 (https://www.beac.int/wp-content/uploads/2016/10/Instruction-N%C2%B0001-GR-2025_norme-ISO-20022.pdf) has an annex with internally inconsistent 2025/2026 migration dates. No issuer-corrected annex was authenticated this run.

## Proposed non-executable architecture decision CC-01
PaymentRailConfiguration keyed by rail, participant, legal entity, institution authorization, profile identity/version/hash, environment and effective date. Activation requires independent evidence objects: issuer rollout notice; signed participant agreement; settlement-account entitlement; approved message specifications; crypto/signature specification; successful institution-specific conformance receipt; operational readiness approval. Each object must carry issuer, signed/verified status, provenance, validity interval, approver and immutable audit trail. Unknown evidence => fail closed, not a fabricated default.

A rail state machine must distinguish DISCOVERED, DOCUMENTED, SPEC_APPROVED, CONFORMANCE_VERIFIED, PARTICIPATION_AUTHORIZED, PRODUCTION_ENABLED, SUSPENDED and RETIRED. No transition to PRODUCTION_ENABLED without all prerequisites. A network acceptance/status message is not proof of final settlement. An unknown external result enters RECONCILIATION_REQUIRED and must not be blindly resent or posted twice. Reversals/returns are distinct authorized journal operations, not edits to original journals.

## Negative acceptance specifications (NOT EXECUTED)
CC-N01: legacy SYGMA page cannot authorize V10. CC-N02: instruction annex inconsistent dates cannot enable rollout. CC-N03: generic ISO XSD without BEAC profile hash rejected. CC-N04: unauthorized MyStandards membership cannot count as certification. CC-N05: conformance for another participant rejected. CC-N06: expired agreement blocks production. CC-N07: camt notification cannot increase liquidity without authoritative settlement evidence. CC-N08: replay after DR cannot duplicate posting. CC-N09: unknown external outcome cannot auto-retry financial instruction. CC-N10: cross-tenant settlement account reference rejected. CC-N11: unsigned MX signature guide cannot be silently replaced by guessed algorithm. CC-N12: historical 100m routing rule cannot activate absent current verified authority.

## Review / blocker register
Regulatory/legal: operative current issuer-corrected rollout and amendments unavailable (P0). Payments: CMA-I 3005-21 PTD 001, PTD 002, MFR 003 unavailable (P0); participant contracts, conformance and settlement evidence unavailable (P0). Financial: approved PCEC mappings and reconciliation evidence unavailable (P0). Security: crypto requirements and HSM/key boundary unverified (P0). Operations: current DR and incident reporting requirements unresolved (P0). Other inherited COBAC, CRSP, 2014 instrument discrepancy, D-2025/328, Regulations 01/25–02/25 remain open. No production code or tests executed. No new regulator request transmitted.

## Quality checkpoint
Attempted 1 WP; completed 0; kept open 1; blocked from closure 1; dependent WPs attempted 0; new negative scenarios specified 12; executed tests 0; P0 closed 0. DoR FAIL. This is a safe evidence/design checkpoint, not WP closure or regulatory certification.

## NEXT EXACT TASK
WP-ACC-005 — Checkpoint CD: authenticate issuer-corrected SYGMA V10 activation/timetable, obtain institution-approved CEMAC-BANK profile versions and CMA-I 3005-21 PTD 001/PTD 002/MFR 003, verify cryptographic and participant settlement rights; reconcile outstanding COBAC/PCEC/CRSP and other inherited P0 evidence. Maintain implementation hold.
