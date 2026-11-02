# CA — Control and executable-test design (NOT executed)
**Work package:** WP-ACC-005. **Status:** design specification only. **Count:** 16 new negative scenarios; none executed. No production interface, fixture, issuer test data or authorized environment is available.

## Domain ownership and proposed contract boundaries
- **Regulatory Authority Registry** owns instrument provenance, effective dates, amendment chains, interpretation disputes and legal approvals. No ledger writes.
- **Rail Entitlement** owns bank license, direct/indirect/subparticipant arrangement, participation agreement, environment, scheme permissions and expiry. No ledger writes.
- **ISO 20022 Profile Registry** owns BEAC profile/version/hash, collection, rules, issuer evidence, XML schemas, code lists, message signatures and compatibility matrix. No bank funds.
- **Payments Orchestration** owns command idempotency, correlation, network retries, UNKNOWN_EXTERNAL_OUTCOME, message lifecycle and reconciliation references; never asserts finality from status alone.
- **Accounting Core** owns balanced immutable postings and controlled reversal/return journals; no rail or status service may mutate balances.
- **External Settlement Reconciliation** owns signed settlement statement ingestion, matched/unmatched cases and independent close approval.
- **Supervisory Incident Reporting** owns BEAC/CRSP and COBAC independent obligations, proof of delivery and receipt, not inferred from sending a message.

## Proposed command/event envelopes (not approved APIs)
`SubmitRailPayment{institutionId,rail,schemeProfileId,profileVersion,profileHash,commandId,idempotencyKey,amount,currency,debtor,creditor,authorisationEvidenceId}`.
`RailMessageObserved{institutionId,rail,externalMessageId,correlationId,kind,transportStatus,payloadHash,receivedAt,issuerEvidenceRef}`.
`SettlementEvidenceRecorded{institutionId,settlementAccountId,statementId,entryId,externalReference,amount,currency,valueDate,proofHash,verifierId}`.
`ReturnPaymentRequested{originalPaymentId,returnCaseId,reason,amount,makerId,legalAuthorityId,idempotencyKey}`.
`RailProfileActivationRequested{institutionId,rail,profileHash,issuerApprovalId,bankApprovalId,checkerId,environment}`.
All IDs institution-scoped; exact money representation; deterministic idempotency keys; outbox/inbox and dedupe; tamper-evident audit. No production schema or contract approved.

## Proposed payment/return state machines
Payment: DRAFT -> AUTHORIZED -> TRANSMISSION_PENDING -> SENT -> {ACCEPTED_FOR_PROCESSING,REJECTED,UNKNOWN_EXTERNAL_OUTCOME} -> {CLEARED,SETTLEMENT_PENDING,SETTLED_EXTERNALLY,EXCEPTION} -> RECONCILED. Actual transitions are rail-specific and must be validated against approved BEAC specifications. A network status change does not post or reverse journals.
Return: CASE_OPEN -> EVIDENCE_COLLECTING -> LEGAL_SCOPE_VERIFIED -> MAKER_APPROVED -> CHECKER_APPROVED -> RETURN_TRANSMISSION_PENDING -> {RETURN_ACCEPTED,RETURN_REJECTED,UNKNOWN_EXTERNAL_OUTCOME} -> EXTERNALLY_SETTLED -> INDEPENDENTLY_RECONCILED. Dispute/judicial holds are separate branches; no editing original posted transaction.

## Negative acceptance cases (to become executable when DoR passes)
- **CA-T01:** Missing issuer-corrected 2025 annex blocks production go-live inference.
- **CA-T02:** Bank has generic ISO 20022 XSD but no BEAC-specific profile: block outbound payment.
- **CA-T03:** CEMAC-BANK access request pending: block conformance certification claim.
- **CA-T04:** Approved profile hash A but runtime uses hash B: reject release.
- **CA-T05:** SYSTAC2 message submitted with SYGMA profile: reject cross-rail payload.
- **CA-T06:** pacs.002 accepted status received, no settlement evidence: do not mark final.
- **CA-T07:** camt.054 credit/debit notification without verified statement/contract: do not invent liquidity.
- **CA-T08:** pacs.004 replayed after network timeout: exactly one approved financial return, no duplicate journals.
- **CA-T09:** DR replay of unknown external outcome: quarantine until independent inquiry.
- **CA-T10:** Unapproved participant agreement or expired authorization: block transmission.
- **CA-T11:** Cross-tenant conformance receipt supplied: reject and audit.
- **CA-T12:** Maker and checker identical for return or profile activation: reject.
- **CA-T13:** Ambiguous 2025 annex date interpreted automatically as 2026: fail provenance gate.
- **CA-T14:** Message MT–MX equivalence used to bypass field-level BEAC validation: reject.
- **CA-T15:** Regulatory incident notification to BEAC incorrectly used as proof of COBAC reporting: reject compliance closure.
- **CA-T16:** Unapproved PCEC mapping or no central-bank statement: prevent GL/settlement finality implementation.

## Required test evidence before closure
Per scenario: requirement/control ID, exact versioned source clause, bank/rail profile, setup fixture, authorized actor, request and response, expected and actual journal deltas (zero unless independently authorized), reconciliation proof, immutable audit, failure injection, assertion output and reviewer signature. Add property tests for double-entry zero-sum per currency, idempotency, replay, maker-checker and tenant isolation. **No tests were run in this checkpoint.**
