# BW — Security-incident and legal-effective-date architecture (DESIGN ONLY)

## Bounded contexts and invariants
**LegalRegulatoryRegistry** owns instrument identity, clause provenance, effective dates, amendment and issuer-correction relationships; **InstitutionProfile** owns institution type, license and verified EMF annual deposit facts; **SecurityIncidentManagement** owns incident lifecycle, potential-significance assessment and case evidence; **RegulatoryNotification** owns signed/traceable transmission receipts and follow-up calendar; **AccountingCore** owns immutable financial postings and is never mutated by incident classification or legal policy changes. **Resilience/DR** owns tested restore/replay. No compliance state implies actual certification.

## Proposed state machines
**Legal policy:** DISCOVERED → ISSUER_REPRODUCTION_REVIEWED → ORIGINAL_AUTHENTICATED → AMENDMENTS_CHECKED → CLAUSE_INTERPRETED → INSTITUTION_SCOPE_VERIFIED → DUAL_APPROVED → ACTIVE. Conflict, absent source, unverified amendment or missing institution profile → QUARANTINED; revoked policy → INACTIVE. Legal commencement and transition deadline are independent attributes. BV's generic legal workflow is retained, with explicit Article 41 conflict and institution-active-at-commencement gate.

**Incident:** DETECTED → PRESERVED → TRIAGED → CRITERIA_EVALUATION (YES / NO / UNKNOWN) → POTENTIALLY_SIGNIFICANT → COMPLIANCE_ESCALATION → NOTICE_PREPARED → APPROVED → SUBMITTED → RECEIPT_VERIFIED → FOLLOW_UP_DUE → FOLLOW_UP_RECEIPT_VERIFIED → SUMMARY_DUE → SUMMARY_RECEIPT_VERIFIED → CLOSED. UNKNOWN is not NO. Notification submission failure → RETRY_WITH_SAME_CASE_KEY/UNKNOWN_DELIVERY_OUTCOME, manual external reconciliation before resubmission. Evidence custody survives recovery.

**Institution classification:** PROFILE_INCOMPLETE → CATEGORY_VERIFIED → APPLICABLE_TITLES_REVIEWED → TWO_YEAR_EVIDENCE_VERIFIED (if applicable) → APPROVED_SCOPE. Missing or conflicting deposit figures → HOLD, not presumed exemption. No cross-tenant license inheritance.

## Proposed contracts (not implemented)
`POST /institutions/{institutionId}/incident-cases`: tenant ID, incident ID, discovery/occurrence timestamps, affected service, criticality, sensitive-data status, initial evidence manifest hash, idempotency key; must not accept an asserted regulatory classification as truth.

`POST /incident-cases/{caseId}/assessments`: incident evidence version, each criterion as TRUE/FALSE/UNKNOWN, denominator source and as-of, gross gain/loss basis, approved rule version, actor and maker-checker approval. Output is `POTENTIALLY_SIGNIFICANT|NOT_ESTABLISHED|UNKNOWN_ESCALATE`, never a financial journal.

`POST /incident-cases/{caseId}/notifications`: destination, approved payload hash, signed transport reference, idempotency key, expected version. Submission alone yields `SUBMITTED_UNCONFIRMED`; only independently verified acknowledgment yields `RECEIPT_VERIFIED`. Unknown external result cannot be re-sent blindly.

`GET /institutions/{institutionId}/regulatory-scope?asOf=`: approved institution class, Article 2 applicable-title determination, active/transition windows and provenance; never returns an executable result when legal chain is unverified.

Events: `IncidentDetected`, `PotentiallySignificantIncidentFlagged`, `IncidentAssessmentQuarantined`, `RegulatoryNoticeSubmitted`, `RegulatoryNoticeReceiptVerified`, `LegalPolicyConflictRaised`. Use transactional outbox/inbox, tenant-specific replay and separate dedupe for external notices. **No event creates money.**

## Security, data, finance, operations
- Evidence schema: immutable `IncidentEvidence` (hash, issuer/producer, timestamps, data classification, legal hold), `CriterionEvaluation` (rule version, source, denominator), `NotificationAttempt` (delivery status, transport proof), `ExternalReceipt` (authority, signature/check), `TransitionApplicabilityDecision` (institution class, verified dates), `PolicyApproval` (maker/checker).
- Least privilege, no generic shared administrator, segregated SOC/compliance/legal/finance roles, dual approval for report release, privileged action audit, encryption in transit/at rest and restricted evidence export.
- Source Article 16 is territorial **availability**: proposed local accessible copy and tested recovery are not a legal determination that all overseas processing is permitted or prohibited. Require jurisdiction-specific counsel and signed outsourcing terms.
- Incident timelines, thresholds, gross loss/gain methodology, own-funds denominator and reporting transport are **not production-configured** until authenticated amendments and approved institution policy.
- Observability: case age, unclassified potential-significance, failed notice deliveries, unverified receipts, missed follow-up/summary, cross-tenant access denial, evidence integrity and DR replay divergence. Independent control owner reviews discrepancies.
- Financial invariants: no direct balance mutation, no edits to posted journals, no fabricated liquidity or settlement, no duplicate posting on replay. Incident remediation requiring money movement goes through separate maker-checker Accounting Core commands and reconciliation.

## Negative acceptance scenarios — all SPECIFIED, NOT EXECUTED
- **BW-T01:** An incident threatens a critical function but monetary loss is zero; classifier must not suppress legal review.
- **BW-T02:** Affected-customer fraction reaches the historical Article 30 criterion but transaction fraction is below it; disjunctive criterion must be preserved.
- **BW-T03:** Affected-transaction fraction reaches the criterion but customer fraction is below it; no AND-gate is permitted.
- **BW-T04:** Customer or transaction denominator is missing, zero, stale or from another institution; classification is UNKNOWN/ESCALATED, never NOT_SIGNIFICANT.
- **BW-T05:** Service outage duration is unknown and may exceed the Article 30 criterion; preserve potential significance and escalate.
- **BW-T06:** Sensitive/classified data is leaked with no measurable financial loss; monetary-only screening must fail.
- **BW-T07:** An incident may produce reputationally damaging public disclosure without proven monetary loss; preserve separate trigger.
- **BW-T08:** A gross financial gain is offset by a gross loss and netted to zero; criterion evaluation must use legally approved gross basis, not netting.
- **BW-T09:** An unapproved capital denominator or floor calculation is used to activate a monetary incident trigger; quarantine threshold policy.
- **BW-T10:** The 2026 transition deadline is stored as 2025 legal commencement or vice versa; reject temporal conflation.
- **BW-T11:** A new entrant after 2025-01-01 claims the transitional period intended for institutions active at commencement; require institution-specific legal review.
- **BW-T12:** An EMF 2/3 institution crosses a deposit threshold in only one year or has missing annual figures; do not silently activate or exempt full-scope rules.
- **BW-T13:** An EMF affiliate is treated identically to the apex entity without assessing differentiated Article 2 obligations; reject scope conflation.
- **BW-T14:** A regulator notification is recorded as sent without an actual traceable receipt; reject completion and preserve escalation.
- **BW-T15:** A one-week follow-up or one-month summary is measured from incident discovery instead of declaration without approved legal interpretation; flag due-date ambiguity.
- **BW-T16:** A legal rule activation or incident-status change attempts to mutate a posted journal, balance, settlement or liquidity; reject side effect.
- **BW-T17:** A cross-tenant analyst reads another institution's sensitive incident evidence; deny, audit and alert.
- **BW-T18:** Recovery replay generates duplicate regulator notifications or financial postings; enforce separate idempotency and independent reconciliation.

## Quality/DoR decision
The contract shapes are proposals, not production OpenAPI, schema migrations or running endpoints. No original signed current R-2024/01, issuer interpretation, institution approvals, reporting integration, PCEC mapping or runnable test fixtures. **DoR FAIL / P0 OPEN**.
