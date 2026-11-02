# BJ — Regulatory decision provenance, domain design and acceptance scenarios (NOT IMPLEMENTED)
## Boundary and invariants
A year-scoped **prudential risk concentration exception** is neither a customer-product discount nor a credit booking, nor a payment, nor a balance adjustment. It must be isolated in `PrudentialPolicyAuthority` and consumed only by `ExposureConcentrationAssessment` after signed, bank-applicable approval. It must not mutate the authoritative `Ledger`, `Loan`, `Settlement` or `CapitalContribution` domains.

## Proposed records
- `LegalInstrument`: jurisdiction, authority, type, number, date_signed, publication_ref, known_at, effective_from/to, issuer_document_hash, custody_status, signature_status, supersession_graph, status.
- `AnnualPrudentialDecision`: instrument_id, exercise_year, claimed_total, enumerated_total, roster_digest, contradiction_flags, reviewer_signatures, approval_state, applicability.
- `EligibleCounterparty`: decision_id, name_as_published, country, verified legal_entity_id, registry_identifiers, alias_resolution_evidence, membership_status, no assumed group-wide entitlement.
- `ExceptionRule`: exact legal clause, scope (risk division vs credit risk weighting), numerator/denominator treatment, factor semantics, effective interval, institution approval, bank legal/CFO maker-checker, policy version.
- `ExposureAssessment`: institution_id, customer_id, exposure_id, decision_id, legal_rule_version, calculation_snapshot, source GL references, result, evidence_hash, timestamp, exception/UNKNOWN reason.
- `ApprovalEvent`: typed authority, actor, segregation-of-duties, signed evidence, revoke/suspend, audit timestamp; no direct financial posting.

## Proposed state machine
`DISCOVERED -> TEXT_VERIFIED -> PROVENANCE_RECONCILED -> LEGAL_REVIEWED -> CFO_REVIEWED -> REGULATOR_APPROVED_IF_REQUIRED -> ACTIVATED`. Any unresolved P0 -> `ON_HOLD`; conflicting amendment -> `SUPERSEDED_REVIEW`; revocation -> `SUSPENDED`. `ON_HOLD` must not fall back to a favorable risk reduction. Unknown outcome -> `MANUAL_REVIEW`, not implicit approval.

## API/event contract proposals (no endpoints deployed)
- Query: `GET /prudential/decisions/{id}/evidence` (tenant scoped, read-only, redacted).
- Command: `POST /prudential/decisions/{id}/review` (idempotency key, ETag, maker-checker, evidence).
- Query: `POST /prudential/exposures/assessments:preview` (no ledger posting; only with explicit policy state).
- Events: `PrudentialDecisionEvidenceRecorded`, `PrudentialDecisionConflictRaised`, `PrudentialRuleActivated`, `PrudentialRuleSuspended`, `ExposureAssessmentProduced`. Outbox/inbox and versioned schema required before any implementation.
- Access: legal reviewer, CFO approver, risk reviewer, compliance/audit viewer; one actor cannot originate and approve same decision; HSM-backed signatures where required.

## Negative acceptance scenarios — specified, NOT executed
BJ-T01: 37 claimed vs 36 enumerated -> reject roster completeness.
BJ-T02: Missing 37th name -> never create guessed entity.
BJ-T03: Article 2 R-2020/02 vs recital R-2020/01 -> hold activation.
BJ-T04: Government metadata 2 Dec vs signed body 12 Dec -> retain both and flag.
BJ-T05: 2025 list membership -> not valid by default in 2026.
BJ-T06: 2026 membership -> not valid by default in 2027.
BJ-T07: Group affiliate name similar to listed company -> reject until legal entity match.
BJ-T08: Company proposed but absent from Article 1 list -> reject benefit.
BJ-T09: 25% reduction of risk quotity misinterpreted as exposure principal haircut -> reject.
BJ-T10: 25% risk quotity reduction misapplied as sovereign zero-risk weight -> reject.
BJ-T11: Unverified decision signature/hash -> no automatic activation.
BJ-T12: Institution-specific risk reviewer absent -> no automatic activation.
BJ-T13: Reviewer attempts to approve own decision -> reject and audit.
BJ-T14: Policy revocation during pending calculation -> fail closed, preserve audit snapshot.
BJ-T15: Complaint handling R-2020/01 miscitation imported into risk policy -> reject cross-domain provenance.
BJ-T16: Policy status change triggers ledger balance or cash settlement -> reject invariant violation.

## Operations/assurance
Require policy-version pinning, immutable decision history, source custody, traceable calculation input/output, monitoring of annual expiry, source correction, audit evidence export, reconciliation to read-only GL snapshot, DR replay with same policy version and no silent recalculation of posted accounting. No tests run, no code written, no regulator approval obtained.
