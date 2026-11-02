# BK — Proposed non-executable regulatory entitlement and assurance design

**Design only; no production implementation, no signed ADR, no regulatory policy activation.**

## Bounded contexts and ownership
- `RegulatoryAuthority`: immutable source custody, article-level provenance, publication, effective intervals, amendments, issuer corrections, evidence status, legal interpretations.
- `CounterpartyRegistry`: independently verified legal entity identity, aliases, country, beneficial ownership, linked group, sanctions/AML screening; name-only matches never authorize treatment.
- `InstitutionEligibility`: regulated institution profile, COBAC-specific financial-situation approval, approval scope/period, revocation, bank-specific risk/compliance sign-off; borrower eligibility does not imply bank eligibility.
- `CreditRiskPolicy`: versioned large-exposure quotity treatment only after all authority gates; raw exposures and ordinary risk results remain authoritative.
- `AccountingCore`: immutable journal and independent PCEC mapping; **no event from the entitlement workflow posts money**.
- `RegulatoryReporting`: derived auditable projection, never an authoritative posting system.

## Proposed entities / contracts
`LegalInstrument(id, issuer, instrument_no, issued_at, published_at?, effective_from?, effective_to?, source_hash?, custody_state)`;
`ClauseReference(instrument_id, article, amendment_chain, interpretation_status)`;
`AnnualRoster(decision_id, year, expected_count?, enumerated_count, correction_id?, roster_status)`;
`RosterMember(roster_id, jurisdiction, legal_entity_id?, printed_name, row_provenance)`;
`InstitutionEligibility(institution_id, regulator_decision_id?, approved_from?, approved_to?, approval_scope, status)`;
`ExposurePolicyAssessment(assessment_id, institution_id, counterparty_id, exposure_id, as_of, source_version, formula_version, status, rationale, reviewer)`.
All IDs are tenant-scoped where applicable. Raw exposure balances are not changed by assessments.

**Proposed API boundaries:** `POST /v1/regulatory/evidence` accepts source reference only into QUARANTINED pending hash and review; `POST /v1/regulatory/rosters/{id}/reconcile` produces an immutable discrepancy report, never silently edits a count; `POST /v1/risk/exposure-assessments` defaults to STANDARD_NO_RELIEF if any gate is absent; `POST /v1/regulatory/approvals` requires separate legal, risk and CFO maker-checker authority. All endpoints require tenant authorization, purpose-scoped roles, audit, idempotency keys for mutating operations, expected version/ETag and immutable provenance.

**Events (proposed):** `RegulatorySourceVerified`, `RegulatoryConflictRaised`, `IssuerCorrectionRecorded`, `AnnualRosterApproved`, `InstitutionEligibilityGranted`, `InstitutionEligibilityRevoked`, `ExposureAssessmentProduced`. No event implies settlement or GL posting. Use transactional outbox/inbox and replay-safe projections only after implementation DoR.

## State model and failure/recovery
`DRAFT -> QUARANTINED -> VERIFIED_TEXT -> AUTHENTICATED_SOURCE -> LEGAL_REVIEW -> BANK_APPROVAL -> ACTIVE` only if every gate is independently satisfied. `CONFLICTED`, `SUSPENDED`, `REVOKED`, `EXPIRED` are terminal for automated relief until explicit new version/decision. Recovery never mutates prior assessments; a new effective-dated assessment is linked to its superseded predecessor. Unknown regulator status means no relief; network errors must not default to approved.

## Negative acceptance scenarios — specified, NOT executed
1. Operative Article 2 cites R-2020/02: deny preferential quotity even if recital cites R-2020/01.
2. 37 eligible in recital vs 36 listed: deny annual roster activation.
3. An unnamed alleged 37th company is inferred from a secondary article: reject addition.
4. Company name matches but corporate registration identity differs: deny.
5. Borrower on list but beneficiary bank has no COBAC satisfactory-financial-condition proof: deny.
6. Bank had prior approval but its approval has expired/revoked: deny.
7. Evidence is only a third-party reproduction without original custody: deny regulatory promotion.
8. Formula maps 25% quotity reduction to a 25% sovereign risk weight: reject.
9. Formula reduces principal, loan balance or customer debt: reject.
10. Formula automatically posts GL/provision/reversal: reject.
11. 2025 annual list used for 2026 or 2026 list used for 2027: reject.
12. Issuer correction is received but not signed/verified: remain CONFLICTED.
13. Legal approver also acts as maker and checker: reject.
14. Institution A approval applied to institution B/tenant B: reject.
15. Stale source version overwrites later approved source: reject and audit.
16. Replayed approval/event duplicates an assessment or journal: idempotently deduplicate; no journal.
17. Unknown network outcome after regulator check: remain PENDING/UNKNOWN, no automatic relief.
18. Counterparty linked-group aggregation is incomplete: deny risk treatment pending verified group scope.

## Multidisciplinary acceptance orientation
Legal: authoritative corrigendum and current amendments mandatory. CFO: no money or balance mutation. Risk: scope and formula explicitly approved. CISO: tenant isolation, maker-checker, signed evidence, privilege separation. AML: screening/ownership remain independent. Operations: unknown/replay/DR recoverable. Audit: each decision reconstructible as-of historical effective date and known-at time. Performance: no hidden synchronous regulator calls in ledger path. Testability: all 18 cases become executable only after DoR and code exist.
