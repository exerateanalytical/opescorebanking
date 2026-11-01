# WP-ACC-005 non-executable design controls — AP

These are proposed design requirements, **not implementation or regulatory interpretation**.

## Regulatory authority registry
Each instrument must have: canonical identifier, issuer, jurisdiction, legal subject, document hash, signature/provenance evidence, full-page/annex completeness, version/amendment chain, published/effective/expiry dates when verified, applicability by licensed institution, legal opinion, approving reviewers, court status *per instrument*, and explicit status `UNVERIFIED | DRAFT | AUTHENTICATED | APPLICABILITY_REVIEW | APPROVED_FOR_POLICY | SUPERSEDED | BLOCKED`.

Prohibited transitions: `DRAFT → APPROVED_FOR_POLICY` without adopted text; `UNVERIFIED → APPROVED_FOR_POLICY` without issuer verification; `COURT_CASE_FILED → REGULATION_SUSPENDED` without certified dispositive order and counsel interpretation. The court-status axis must not be conflated with source authenticity.

## Segregated business workflow
`CLASSIFIED_INACTIVE` is an observational classification and must not change the ledger. `SEARCH/NOTICE` requires privacy controls and traceable delivery. `ELIGIBILITY_REVIEW` is a legal/compliance workflow with hard holds for freezes, claims, pending litigation interpretation and uncertain recipient authority. `TRANSFER_AUTHORIZED` requires maker-checker and beneficiary validation. `TRANSFER_SUBMITTED`, `EXTERNAL_OUTCOME_UNKNOWN`, `SETTLEMENT_CONFIRMED`, `RECONCILED`, `CLOSED`, `DISPUTED`, `RESTITUTION_PENDING` and `CORRECTED` are distinct states; transitions are evidence- and authorization-driven.

## Financial invariants
- Immutable double-entry journal with exact arithmetic; no direct balance mutation or UI-triggered posting.
- Financial command idempotency keyed by institution, account, business operation and unique instruction; retry does not duplicate journal or settlement.
- Classification, report, legal status update and notice never create/destroy funds.
- External submission is not settlement. Unknown outcome stays unresolved; no assumed success/failure, no automated blind resubmission.
- Accounting recognition/derecognition and transfer journal templates remain **UNDEFINED** until approved PCEC mapping and legal evidence.
- Independent reconciliation, exception handling, audit trail, reversal/correction rather than posted-journal edits.

## Security and operational controls
Four-eyes legal-policy activation; dual authorization for transfers; least-privilege and segregation of duties; trusted document-signature verification; tamper-evident evidence custody; AML/PEP and beneficiary validation where applicable; no PII in regulator source requests; secrets and cryptographic keys outside business configuration; out-of-band verification of changed payee instructions; event observability with redacted data; disaster recovery and replay tests before readiness.

## Proposed interfaces (non-executable)
`RegulatoryInstrumentRecorded`, `CourtDispositionVerified`, `ApplicabilityApproved`, `InactiveAccountClassified`, `DormancyNoticeRecorded`, `TransferEligibilityReviewed`, `TransferAuthorizationGranted`, `ExternalOutcomeUnknown`, `SettlementEvidenceVerified`, `ReconciliationExceptionRaised`.
No executable API/event schema approved; avoid publishing externally until domain ownership, idempotency, versioning, authorization and data minimization are reviewed.
