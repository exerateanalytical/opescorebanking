# BA — Proposed engineering decisions (NOT APPROVED / NOT EXECUTABLE)

## BA-ADR-CANDIDATE-01 — Separate securities economic events
**Decision candidate:** Model `TradeExecuted`, `OwnershipTransferEvidenceAccepted`, `CustodyPositionConfirmed`, `ClearingConfirmed`, `SettlementConfirmed`, and `FinalityConfirmed` as distinct facts. None may be inferred solely from another. R-2003/03 Art.22 is historical primary support for treating legal ownership separately from trade timing. The applicable current legal title and settlement rules must be verified before implementation.

**Accounting rule:** No securities balance-sheet asset may arise merely because a UI shows a trade or an instruction has been sent. Off-balance exposure and accrued-interest treatment require institution-approved chart releases and effective-dated rules. Any actual posting is via balanced immutable journal only. No direct balance mutation.

**Recovery:** On lost confirmation, remain `EXTERNAL_OUTCOME_UNKNOWN`; reconcile independently and query authenticated settlement/custodian evidence. Retrying the original idempotency key must never create another journal.

## BA-ADR-CANDIDATE-02 — Prudential classification is not the ledger
R-2010/03 Article 1 historically replaces R-2003/03 Article 24 and describes a six-month treatment for certain public trading securities. It is not a blanket exemption and is **not certified as current in 2026**. Design a separate effective-dated Prudential Rules context which reads source-classified, ownership-confirmed positions and emits reproducible calculation evidence. It must not edit posted journals, silently reclassify assets or apply historical ratios/waivers without a legal and institutional approval package. Date intervals, acquisition/booking provenance, issuer, instrument type and exclusions must be explicit.

## BA-ADR-CANDIDATE-03 — Regulatory-source validity is multidimensional
`SourceDocument` states: `DISCOVERED → BINARY_RETAINED → INTEGRITY_HASHED → CLAUSE_REVIEWED → LEGAL_EFFECT_VERIFIED → INSTITUTION_APPLICABILITY_APPROVED`; `CONFLICTED`/`QUARANTINED` may interrupt any step. Hashing is necessary for reproducible custody, **insufficient for legal validity**. Require separate legal review of signatures, official publication, supersession, judicial effect and current institution profile. Prevent release activation from a browser snippet, scanned stamp or hash alone.

## BA-ADR-CANDIDATE-04 — Credit provisioning rules cannot inherit historical constants
I-2015/01 Article 2 includes historical 0.5% annual and 2% stock provisioning figures and Article 14 references R-2014/01. The previously reviewed R-2018/01 supersession makes literal reuse unsafe without legal reconciliation. The provisioning calculation engine must resolve `(institution_profile, instrument, applicable_date, legal_release_id, credit_class, exposure, currency, source_version)` before any calculation. Reject missing or ambiguous policy. Do not rewrite historical journals or imply a restatement is approved.

## BA-ADR-CANDIDATE-05 — Evidence and approvals are separate from cash movement
Maker, legal approver, accounting approver and release operator must be distinct per institution-approved SoD matrix; break-glass access cannot bypass legal/financial holds. Every approval is audit-logged, tamper-evident and linked to an immutable source fingerprint. A chart or regulatory-policy activation event itself **must never post money**.

## Unresolved risks and owner roles (not assigned to real individuals)
- **P0, Legal/Regulatory:** current effect and supersession of securities/prudential provisions; original signed instrument and publication; 01/25–02/25 legal/judicial evidence.
- **P0, Accounting/CFO:** account 2651/2652 and 312/322 conflicts; 265x↔2965x provision mappings; institutional chart release.
- **P0, Payments/Operations:** independently evidenced ownership/settlement/finality; counterparty and BEAC/GIMAC interfaces remain unproven.
- **P1, Security/Compliance:** custody pipeline and digital signature/retention policy; no PDF binaries or hashes in this run.

## Acceptance and operating constraints
Trace every proposed rule to article, original binary hash (once available), amendment edge, legal reviewer, institution approver, effective period, unit tests and independent reconciliation. Preserve old source and report releases. A later legal change requires a new version, controlled corrections and disclosure, never silent alteration of posted history.

**Review outcome:** research-safe checkpoint only. WP-ACC-005 open; no bounded context passes all 15 DoR gates.
