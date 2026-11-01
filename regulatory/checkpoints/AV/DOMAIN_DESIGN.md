# AV — Accounting/Credit classification interface design (PROPOSED ONLY)
## Context boundaries
- **Credit Risk Classification** owns counterparty risk state, evidence, arrears clock, connected-party graph, legal rule version, collateral eligibility evidence and historical classification decisions. It does NOT own balances.
- **Loan Servicing** owns contractual schedule, payment events and restructuring proposal lifecycle; it cannot approve its own restructuring or force a regulatory risk class.
- **Accounting Core** owns immutable journal/posting, effective-dated PCEC chart mapping, provisions and income-recognition entries; no direct balance mutation. Risk-state updates alone never create/destroy money.
- **Regulatory Policy Authority** owns issuer text, effective-dated applicability, supersession, bank approval and policy activation. No 2015/2018/2025 source becomes executable from a scan or communiqué.
- **Reconciliation/Regulatory Reporting** owns independent proof of GL-to-subledger equality, regulatory reports and variance investigations; not an authorization substitute.

## Proposed lifecycle (NOT IMPLEMENTABLE YET)
Source-derived classification candidate: HEALTHY -> SENSITIVE -> NON_PERFORMING{IMMOBILIZED|UNPAID|DOUBTFUL} -> IRRECOVERABLE; correction/reclassification and probation are separately authorized transitions, not unconditional arrows. Every proposed transition has evidence_id, effective_at, observed_at, policy_version, counterparty_group_snapshot, prior_decision_id, actor and reason. Regulatory override is explicit, attributable and reviewable. Do not equate product type with risk category.

## Example contract candidates, not API approvals
Command: AssessExposureClassification(exposure_id, counterparty_id, assessment_as_of, evidence_refs[], policy_version, idempotency_key, requested_by).
Result: PROPOSED | REQUIRES_REVIEW | REJECTED_INCOMPLETE_EVIDENCE; never automatically POSTED.
Event: ExposureClassificationApproved{decision_id, exposure_id, previous_class, approved_class, effective_at, policy_version, evidence_digest, approver_id}.
Command: ProposeProvisionJournal{decision_id, journal_template_version, accounting_date, source_exposure_snapshot, idempotency_key}; accounting validates balanced debit/credit, authorized account codes, exact arithmetic and duplicate prevention.
No posting from UI state changes. Outbox/inbox for delivery; replay must not create duplicate journal entries. Unknown outcomes remain UNKNOWN until reconciliation.

## Segregation and external approvals
Analyst proposes; independent risk officer approves risk class; legal/compliance reviews regulatory interpretation; CFO/controller approves PCEC mapping and journal templates; authorized operations executes permitted entries; independent reconciler validates. Related-party write-offs require regulator approval where applicable, in addition to internal authorization. System administrators cannot bypass business authorization.

## Reconciliation, failures and recovery
Classification failure: keep prior approved state; record exception; no new journal. Provision computation conflict: block posting and preserve both candidate calculations. Accounting posting unknown: query durable posting ID and journal ledger, never retry blind. Event bus failure: transactional outbox, replay-safe consumer, trace correlation. End-of-period close: reconcile risk classifications, provisions, reversals, GL/subledger, reporting and control totals. No retroactive rewrite of posted journals.

## Unresolved before DoR
Bank licence/institution profile, complete PCEC version chain, exact debit/credit mappings, collateral valuation and guarantee validity, time-zone/business-day semantics, approved state transition matrix, AML/fraud controls, regulatory overrides, security retention, tests, DR objectives, integration contracts and complete source custody. The dormant-assets P0 remains independent and open.
