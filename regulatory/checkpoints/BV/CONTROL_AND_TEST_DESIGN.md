# BV — Domain controls, contracts, state machines and negative acceptance design

## Dependency boundary
This is a design checkpoint within **WP-ACC-005**, not permission to build. R-2019/02 historical reproduction applies to payment institutions, not automatically banks or EMFs. R-2024/01 issuer-hosted operative text has wider scope. No institution-specific prudential or incident policy is executable without legal sign-off and verified amendments.

## Proposed workflow/state models (non-executable)
**Legal rule:** DISCOVERED -> SOURCE_VERIFIED -> CLAUSE_MAPPED -> AMENDMENTS_VERIFIED -> INSTITUTION_SCOPE_APPROVED -> DUAL_APPROVED -> ACTIVE; alternative CONFLICT/REVOKED/EXPIRED -> QUARANTINED. Historical effective date and transition-compliance deadline are independent attributes.
**Safeguarding:** FUNDS_RECEIVED -> PAYMENT_PENDING -> SEGREGATION_REQUIRED -> HOLDING_BANK_EVIDENCE_PENDING -> RECONCILED or DISCREPANCY_OPEN -> INVESTIGATION -> CONTROLLED_CORRECTION -> RECONCILED. External bank evidence, not status updates, establishes funding; posted journals are never edited.
**Security incident:** DETECTED -> TRIAGED -> CRITERIA_EVALUATED -> LEGAL_REVIEW -> NOTIFICATION_REQUIRED -> NOTIFIED_WITH_RECEIPT -> FOLLOW_UP_DUE -> FINAL_REPORT_FILED -> CLOSED; UNKNOWN_SCOPE/CRITERION -> ESCALATE, not silently close. Distinguish COBAC/BEAC recipients by current legal source.
**External settlement:** SUBMITTED -> ACCEPTED_FOR_CLEARING -> SETTLEMENT_PENDING -> CONFIRMED_FINAL / REJECTED / UNKNOWN -> independently RECONCILED. Safeguarding does not prove settlement.

## Proposed APIs/events (not implemented)
- `POST /legal-policies/{id}/approvals` requires role/legal and independent compliance maker-checker, immutable evidence hash and expected version. Approval never posts money.
- `GET /institutions/{id}/safeguarding-position?as_of=` returns categorized outstanding obligations and holding-bank evidence provenance; never fabricated balance.
- `POST /safeguarding-reconciliations` accepts signed bank statement reference, time window, exact integer minor units, tenant, idempotency key; generates a discrepancy case, not automatic balance repair.
- `POST /security-incidents/{id}/classification` records rule version, criteria, as-of date, evidence and dual review; UNKNOWN requires escalation.
- Events: `RegulatoryPolicyQuarantined`, `SafeguardingDiscrepancyDetected`, `IncidentNotificationEvidenceRecorded`. Outbox/inbox and replay keys mandatory; no event is itself a journal entry.

## Data and controls
Separate tables/entities: RegulatoryInstrument, ClauseVersion, LegalEffectiveWindow, TransitionWindow, InstitutionLicense, ProductAuthorization, SafeguardingAccount, DistributorReceipt, ExternalBankStatement, SafeguardingReconciliation, IncidentCriterion, IncidentNotificationReceipt and ApprovalDecision. Restrict sensitive evidence; immutable history, retention/legal hold, source checksum when available and institution/tenant ownership. Finance, legal, security and compliance have separate duties; privileged overrides require recorded approval and independent review.

## Proposed negative acceptance scenarios — NOT EXECUTED
- **BV-T01** — A credit institution is incorrectly subjected to the payment-institution-specific historical capital rule; institution-type gate must reject.
- **BV-T02** — A historical 2019 minimum-capital figure is activated without authenticated amendment lineage and legal sign-off; reject executable policy.
- **BV-T03** — Tiered prudential percentages are applied to entire volume instead of marginal tranches; detect using independently calculated boundary fixtures.
- **BV-T04** — Electronic-money float and payment-volume requirements are substituted for each other; reject mixed basis.
- **BV-T05** — Article 7 discretionary prudential uplift is applied without an institution-specific COBAC decision; reject.
- **BV-T06** — Customer safeguarding funds are recorded as the provider's unrestricted operating cash; reject accounting classification and alert.
- **BV-T07** — Daily outstanding-payment exposure omits distributor receipts; safeguarding completeness check fails.
- **BV-T08** — Safeguarding bank reconciliation is absent or stale; compliance evidence cannot be marked complete.
- **BV-T09** — A customer funds safeguarding discrepancy is auto-corrected by directly editing a posted journal; reject and require controlled correction.
- **BV-T10** — 2019 Article 13 monetary-loss criterion is treated as the only 2026 significant-incident trigger; reject scope-incomplete policy.
- **BV-T11** — An incident affecting a critical function but below monetary thresholds is suppressed; trigger legal-review queue under R-2024/01 Article 30.
- **BV-T12** — An explanatory report's 2026 transition date is stored as the regulation's 2025 legal effective date; reject conflation.
- **BV-T13** — R-2019/01 licensing dossier from a secondary OCR source authorizes a payment product without the institution's actual approval; reject.
- **BV-T14** — An outsourced distributor is given direct posting permissions without contract, scope, maker-checker or per-tenant controls; reject.
- **BV-T15** — Disaster-recovery replay repeats safeguarding movement or reporting submission; idempotency and reconciliation prevent duplicates.
- **BV-T16** — R-2019/03 monetary-sanctions citation is misbound as R-2019/02 prudential authority; citation-integrity gate rejects.

## Quality gate
No actual API contract, executable test fixture, signed institution approval, payment integration, bank statement or COBAC rule has been supplied. All numeric examples in historical reproduction remain quarantined. P0 not closed. Definition of Ready fails.
