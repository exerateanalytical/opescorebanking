# AR — Non-executable regulatory policy authority gate (proposed design)
**Scope:** evidence and approval boundary for dormant-account classifications, restitution, transfer eligibility and accounting rules. This is a design proposal, not implemented software or legal advice.
## Ownership
Regulatory Evidence Registry owns immutable received artefact hashes, issuer, provenance, publication record and versions. Legal Applicability owns separately signed jurisdiction/institution-specific opinions and certified court effects. Policy Governance owns proposed rules and approval workflow. Dormancy owns **classification only**. Accounting Core owns **journals only**. Payments/Settlement owns outbound transfer execution and independently evidenced outcomes. Reconciliation owns external matching and exceptions.
## Candidate policy lifecycle
`DISCOVERED -> EVIDENCE_INTAKE -> SOURCE_AUTHENTICATED -> PUBLICATION_VERIFIED -> LEGAL_EFFECT_REVIEWED -> ACCOUNTING_IMPACT_APPROVED -> FOUR_EYES_APPROVED -> ELIGIBLE_FOR_ACTIVATION -> ACTIVE`.
Any unresolved contradiction, missing page, unverified legal effect or expired institution-specific sign-off routes to `ON_HOLD`; a newly authenticated stay/amendment triggers `REASSESSMENT_REQUIRED` without rewriting historical policies or posted journals. `RETIRED` and `SUPERSEDED` are terminal for new instructions but retain audit history.
This sequence is **not** a determination that every publication step is legally necessary in every circumstance; it is a conservative engineering evidence gate pending counsel review.
## Proposed immutable records (not database migrations)
- `LegalInstrument`: stable instrument ID, issuing organ, kind, full title, adoption date claimed/verified, full-text hash, printed-page sequence, annex set, source URI, acquisition timestamp, original custody proof.
- `PublicationProof`: instrument ID, bulletin/journal issuer, issue number, date, page range, certified evidence hash, reviewer; no guessed dates.
- `LegalDisposition`: independent instrument ID and case ID, court, order type, signed order hash, scope, operative date, service/appeal status, counsel assessment; never infer effects across 01/25 and 02/25.
- `ApplicabilityDecision`: institution ID, licence/profile, jurisdiction, instrument version, counsel sign-off, decision timestamp, conditions, expiry/review triggers.
- `PolicyCandidate`: source versions, effective-from/to **only if authenticated**, condition DSL proposal, scope, reason codes, hold status.
- `AccountingMappingApproval`: bank CFO, finance control, PCEC chart version, journal event/recognition/derecognition/reversal design, proof hash; legal approval does not imply this approval.
- `PolicyActivationDecision`: maker, independent checker, legal approver, compliance, CFO (when accounting affected), timestamps, hashes, change ticket, deployment identifier and rollback plan.
## No financial side effects from source approval
An `ACTIVE` legal-policy record cannot itself debit/credit, release liability, initiate transfer, mark settlement final or bypass AML screening. Separate customer-level authorization, beneficiary validation, maker-checker, double-entry posting authority, settlement proof and reconciliation remain mandatory.
## Financial exception and retry controls
External payment `UNKNOWN` stays `UNKNOWN` until independent query/reconciliation resolves it. One immutable business-operation ID and unique settlement instruction ID across retries; retries must never create a second transfer or journal. Posted journals are immutable; corrections use linked reversing and new journals with reason and approvers. Exact monetary representation required.
## Security, privacy and audit
Immutable append-only evidence audit, tamper-evident hashes and signature checks, access separation between source uploader/reviewer/policy activator/accounting approver, no PII in external evidence requests, retention/legal hold and emergency deactivation with independent approval. Hashes are integrity identifiers, not by themselves proof of issuing authority.
## Operational checks before DoR
Institution and licence profile; source chain; certified court effects; state machine failure/recovery; RBAC/maker-checker; AML/fraud and claimant proof; ledger templates; API/event contracts; retention; DR/reconciliation; executable negative tests; audit reconstruction. All currently incomplete for WP-ACC-005.
