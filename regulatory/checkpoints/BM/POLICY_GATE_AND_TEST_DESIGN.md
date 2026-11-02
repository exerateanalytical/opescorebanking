# BM — Annual eligibility isolation, reporting-basis gate and negative tests
**Status:** proposed architecture, NOT signed ADR, NOT implemented.

## Proposed requirements (incremental to BL)
- BM-REQ-01: identify `DecisionVersion` by issuer ID, decision number, exercise year, original source and authenticated revision; 2025 and 2026 rosters have disjoint validity and cannot inherit one another.
- BM-REQ-02: require separately evidenced `published_at`, `notified_at`, `effective_from`, `effective_to`, `known_at` and `decision_signed_at`; unknown effective dates block entitlement.
- BM-REQ-03: require `ExposureAssessmentBasis = SOCIAL | COMBINED | CONSOLIDATED` and bank-approved basis policy. A tenant, bank group or report must not silently switch basis.
- BM-REQ-04: require `ObligorGroupVersion` and legal-person IDs with issuer roster match; cross-affiliate inheritance and fuzzy-name matching prohibited.
- BM-REQ-05: `RiskQuotityMethodology` must bind exact legal formula, eligible components, denominator, rounding, limits, effective-dated own funds, regulatory amendments and approval evidence. Formula **UNRESOLVED** at BM.
- BM-REQ-06: distinguish bank-specific `InstitutionEligibilityAssessment` from counterparty eligibility. Neither is evidence of paid-up capital or settlement.
- BM-REQ-07: regulatory-policy read models and prudential returns are separate from Accounting Core; only independent authorized accounting commands can post immutable balanced journals.
- BM-REQ-08: for corrected/revoked annual lists, preserve original known-at history and initiate a controlled prudential restatement workflow; no retroactive mutation of GL or hidden silent rewrite.

## Proposed state model
`OBSERVED -> AUTHENTICATED -> LEGALLY_RECONCILED -> METHOD_APPROVED -> BANK_ELIGIBILITY_VERIFIED -> OBLIGOR_ID_VERIFIED -> AS_OF_VALIDATED -> APPROVED_FOR_ASSESSMENT`.
Any missing evidence enters `AWAITING_ISSUER`, `CONFLICTED` or `SUSPENDED`. `REVOKED` is terminal for that approval version. An external response of unknown outcome remains `UNKNOWN` pending reconciliation; it cannot be treated as approved. If standard-treatment rules are themselves unverified, return `NO_COMPLIANCE_DETERMINATION`, not a fabricated safe numerical answer.

## Proposed data and contracts
`RegulatoryAuthority`: `DecisionVersion`, `ClauseVariant`, `IssuerCorrection`, `EvidenceArtifact`, `LegalInterpretationApproval`.
`CounterpartyRegistry`: `RosterEntry(exercise_year, printed_name, country, legal_entity_id?, status)`, `ObligorGroupVersion`.
`PrudentialRisk`: `ExposureAssessment(as_of, known_at, reporting_basis, formula_version?, institution_eligibility_id?, result_status)`.
`AccountingCore`: no commands/events added for eligibility status. No event listener may mutate balances.
Proposed read-only `GET /v1/prudential/exposure-assessments/{id}/evidence` returns as-of/known-at sources and unresolved conflicts. Proposed `POST /v1/prudential/eligibility-reviews` requires tenant RBAC, maker-checker, idempotency key and append-only audit; returns `PENDING_REVIEW`, never financial settlement. Proposed `PrudentialEligibilityEvidenceChanged` event is informational only, outbox/inbox protected, never a posting trigger.

## Ten additional negative acceptance scenarios — SPECIFIED, NOT EXECUTED
1. A 2025 roster entry is automatically treated as 2026 eligible: deny.
2. 2026 effective date copied from 2025 Article 2 without 2026 authority: deny.
3. Government catalogue timestamp is substituted for signed/effective/notification date: deny.
4. Social-basis numerator paired with consolidated-basis own-funds denominator: deny.
5. Group exposure aggregation excludes an affiliate because of spelling variation: block and flag.
6. A valid borrower roster match overrides a missing bank-specific supervisory eligibility decision: deny relief.
7. Formula is selected from secondary commentary without current issuer-approved methodology: deny activation.
8. A new issuer correction changes an already submitted return without controlled restatement and audit: deny.
9. Replayed eligibility-change event posts or reverses any journal entry: reject; no money mutation.
10. Unavailable issuer response is treated as a positive approval rather than UNKNOWN: deny.

**Execution:** 10 scenarios specified; 0 executed. No code, migrations, integrations, performance tests or certification. These specifications do not satisfy DoR.
