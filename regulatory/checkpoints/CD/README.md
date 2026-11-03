# Checkpoint CD — WP-ACC-005 (OPEN; P0 BLOCKED)
Date: 2026-11-03. Predecessor: CC, verified main 1fdda8ad6efe5719107cad2d883dae3cef952a53.
Phase 4 Accounting Core / Financial Integrity. Last reported completed WP-ACC-004 (inherited; not independently reaudited).

## Evidence acquisition and provenance
Issuer primary source: BEAC Instruction 001/GR/2025, https://www.beac.int/wp-content/uploads/2016/10/Instruction-N%C2%B0001-GR-2025_norme-ISO-20022.pdf
Its November 2025 migration annex contains a *specific* sequence conflict: item 3 schedules participant technical meeting JANV-2026, while item 5 says participant SIB updates NOV–FEV 2025, and item 6 says awareness training FEV-2025. These are source dates, not validated production dates. No assumption that 2025 means 2026 is permitted.
Issuer's signed corrected timetable, SYGMA V10 activation bulletin, institution-specific participant evidence, profile versions and CMA-I 3005-21 PTD 001 / PTD 002 / MFR 003 have not been obtained. Public source discovery is not proof of their absence.

## Regulatory interpretation gate CD-R1
A document's issuance, an annex milestone, MyStandards access, a conformance result, and a production authorization are five different assertions. Maintain separate evidence records with issuer, instrument number, clause, edition, source URL, retrieval date, hash when actually computed, verification method, effective interval, participant, environment and reviewer. Contradictory milestone dates must remain CONFLICTED and cannot activate a production rail.

## Proposed contract and workflow refinements (NOT IMPLEMENTED)
PaymentRailActivationEvidence: rail_id, institution_id, participant_id, environment, approved_profile_id, profile_version, artifact_digest, authorization_id, settlement_entitlement_id, activation_notice_id, effective_from/to, verification_status, approver_id, audit_ref.
Preconditions to production: authenticated issuer activation, signed participant entitlement, verified current schema, signature/HSM specification, institution-specific conformance receipt, authorized settlement account, operational and DR approval. Unknown evidence fails closed.
ExternalPaymentInstruction lifecycle: PREPARED -> AUTHORIZED -> SUBMITTED -> ACKNOWLEDGED/REJECTED/OUTCOME_UNKNOWN -> SETTLEMENT_EVIDENCED -> RECONCILED. ACKNOWLEDGED is not finality. OUTCOME_UNKNOWN blocks automatic repost/retry and requires independently evidenced reconciliation. Separate authorized return/reversal journals preserve immutable original postings.

## New negative acceptance specifications — NOT EXECUTED
CD-N01 contradictory 2025/2026 annex cannot authorize production.
CD-N02 issuer publication without activation bulletin cannot enable V10.
CD-N03 conformance receipt for another institution rejected.
CD-N04 missing CMA electronic-signature guide cannot be replaced by guessed crypto.
CD-N05 schema edition missing hash/version blocks activation.
CD-N06 settlement-account entitlement missing blocks activation.
CD-N07 ACK alone cannot transition to SETTLEMENT_EVIDENCED.
CD-N08 unknown outcome replay after DR cannot create second journal.
CD-N09 suspended participant cannot initiate new settlement instructions.
CD-N10 expired participation authorization blocks production.
CD-N11 return event cannot mutate original posted journal.
CD-N12 cross-tenant evidence reference is rejected.

## Multidisciplinary quality review
Legal: annex chronology unresolved, signed correction required (P0).
Accounting: approved PCEC mappings and verified settlement/reconciliation evidence absent (P0).
Security: participant signing algorithm, HSM trust boundary and keys not authenticated (P0).
Payments: CMA specs, profile editions, conformance and institution entitlements absent (P0).
Operations: failover and external-outcome recovery not exercised (P0).
Privacy/AML/audit: institution-level authorizations and retention/evidence policy unresolved; do not infer completion.
Inherited COBAC amendments, CRSP circulars, 2014 instrument-date dispute, D-2025/328 and Regulations 01/25–02/25 remain open.
No implementation, tests, scans or regulator requests performed. This is a design/evidence checkpoint only, not a closed WP.

## Execution accounting
Work packages attempted 1; completed 0; open 1; blocked from closure 1; dependent packages attempted 0. New negative scenarios specified 12; executed 0. DoR FAIL; P0 closed 0.

## NEXT EXACT TASK
WP-ACC-005 — Checkpoint CE: obtain issuer-authenticated corrected ISO 20022 migration annex and current SYGMA V10 activation notice, plus institution-approved CEMAC-BANK editions and CMA-I 3005-21 PTD 001/PTD 002/MFR 003; then validate participant authorization, cryptographic boundary and settlement evidence. Preserve all inherited P0 holds.
