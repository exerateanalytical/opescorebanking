# BH — Legal, accounting and assurance control design (NOT IMPLEMENTED)
## Separation of responsibilities
**Regulatory authority service** owns immutable source evidence, amendments, legal opinions, publication references, effective-date validity and supersession; it cannot post journals. **Institution profile** owns licensed category, licence history, HQ jurisdiction and tenant. **Capital evidence service** owns source documents and independent settlement proof; it cannot mark compliance. **Capital policy evaluator** may only propose an assessment when an approved rule version and institution-specific evidence exist; it cannot post journals. **Accounting Core** owns immutable double-entry journals and approved PCEC mapping, not regulatory eligibility. **Compliance reviewer** authorizes interpretations and exception decisions under maker-checker, not money creation.

## Proposed states (design only)
Source: DISCOVERED -> HOST_TEXT_READ -> ORIGINAL_BYTES_CAPTURED -> HASH_VERIFIED -> PUBLICATION_VERIFIED -> AMENDMENTS_RECONCILED -> LEGAL_APPROVED -> ACTIVE. Failure/conflict -> EVIDENCE_HOLD. A source with only web-extracted text must never skip original-binary proof.
Capital plan: NOT_REQUIRED | NOT_SUBMITTED | SUBMITTED_UNACKNOWLEDGED | ACKNOWLEDGED_PENDING | APPROVED_CONDITIONAL | APPROVED | REJECTED | WITHDRAWN | REVOKED | EXPIRED | UNKNOWN. Transition eligibility is never inferred from a state name alone; signed regulator decision and valid conditions required.
Assessment: EVIDENCE_INCOMPLETE -> LEGAL_REVIEW -> FINANCE_REVIEW -> MAKER_CHECKER -> APPROVED_FOR_EVALUATION -> EVALUATED; adverse source change -> SUSPENDED_PENDING_REVIEW. No automatic GL postings or backdated rewrite.

## Data and API/event proposals (no deployed contracts)
- CapitalRuleEvidence {instrument_id, article, source_uri, source_sha256_nullable, publication_issue_nullable, effective_from, effective_to_nullable, amendment_ids[], verification_state, reviewer_ids[]}.
- InstitutionCapitalProfile {tenant_id, licence_id, category, operating_before_2026_01_01, jurisdiction, corporate_share_capital, paid_up_capital, currency, valuation_date, documentary_proof_ids[]}.
- CapitalPlan {tenant_id, regulator_reference, submitted_at, acknowledged_at, approval_document_id, approval_effective_from, approval_effective_to, conditions[], milestone_schedule[], current_state}.
- CapitalAssessment {tenant_id, as_of_date, rule_version, evidence_version, legal_opinion_id, outcome: HOLD|REVIEW|ASSESSABLE, reasons[], approval_chain[], created_at}.
- Proposed command `RequestCapitalAssessment` must enforce tenant scope, source version, replay-safe request key and explicit rejection on stale authority; proposed events `CapitalEvidenceRecorded`, `CapitalPlanDecisionVerified`, `CapitalAssessmentHeld` carry no posting instruction. These are sketches, not approved OpenAPI/event contracts.
- Retention: preserve legal originals and immutable audit under approved retention schedules; do not assert a specific statutory period without authenticated rule.

## Negative acceptance scenarios (specified, not executed)
| ID | Scenario | Required safe behavior |
|---|---|---|
| BH-T01 | PDF text available but original bytes/hash absent | HOLD source activation |
| BH-T02 | Official PDF accessible but publication issue/date absent | HOLD executable rule |
| BH-T03 | Article 6 transition evaluated without Article 7 applicability review | HOLD and escalate |
| BH-T04 | Plan submitted on time, COBAC approval missing | Do not grant approved-plan treatment |
| BH-T05 | Plan submitted after 2026-06-30 | HOLD for signed decision; no invented extension |
| BH-T06 | Signed plan for institution A used by institution B | Reject, audit tenant mismatch |
| BH-T07 | 2026 old threshold automatically treated as full new-rule compliance | Reject stale/unqualified conclusion |
| BH-T08 | 2027 assessment uses R-2009/01 as current standalone threshold | Reject absent explicit authoritative exception |
| BH-T09 | Unsettled shareholder receivable counted as paid-up capital | HOLD and reconcile, no invented cash |
| BH-T10 | Capital compliance state changes to APPROVED and triggers GL mutation | Reject; no status-driven posting |

## Security, risk and operations
Two-person independent approval for legal-rule promotion; privileged changes require audited, time-bounded access; source hashes bound to evidence IDs; tamper-evident audit; no cross-tenant plan reuse; no unilateral backdating; deterministic policy version pinning; outage of legal authority store -> fail closed; conflicting or unknown external regulator outcome -> manual reconciliation and no repeated approval attempt that creates duplicate action. Audit reconstruction must show who saw which exact source version, when and why. No compliance dashboard should imply regulator certification.

## Financial integrity
Capital social, paid-up capital, regulatory own funds, liquidity and settlement are distinct measures. Only approved corporate actions with independent proof and CFO-approved PCEC mapping may generate double-entry accounting via the ledger's own authorized workflow; compliance evaluation itself cannot post. Reversals must be compensating immutable journals, not editing posted entries. No bank-specific mapping is yet approved.
