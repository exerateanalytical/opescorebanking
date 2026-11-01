# AY design controls — non-executable, pending ADR/approval

**Control boundary:** no current banking accounting rule can be activated from a historical document alone. The Accounting Core retains exclusive balanced immutable posting authority. Regulatory evidence, Credit Risk, Reporting, Branch Liaison and External Settlement have separate bounded contexts and signed contracts.

## Proposed requirements
- **AY-R01 — Bitemporal chart identity.** AccountKey = institution_profile + chart_release + numeric_code + valid_from/to + recorded_at; a numeric code cannot be reused without version context.
- **AY-R02 — Clause-level amendment.** Store I-2002/01 art.5/6 account definitions and I-2015/01 art.8(a) explicit deletions as signed, traceable supersession edges. No implicit full-chart replacement.
- **AY-R03 — Journal immutability.** Historical postings retain original chart release, event ID, monetary scale and source evidence. Later reinterpretation requires a new approved correction journal and report version, not row mutation.
- **AY-R04 — Branch liaison separation.** Legacy 459 `avis de sort` may record internal disposition only; `EXTERNAL_SETTLED` requires independent settlement evidence and reconciliation. Duplicate notices are idempotent.
- **AY-R05 — Unmatched allocation control.** Historical 999 is not an operational balance store or settlement proof. Unallocated imports enter `QUARANTINED`, with owner, age, source, immutable audit, resolution and SLA; financial entries only via Accounting Core.
- **AY-R06 — Institution applicability.** Merchandise accounts 473/640/740 require institution-specific licensed activity and approved inventory accounting policy.
- **AY-R07 — Counterparty rating provenance.** Rating scheme, agency/COBAC source, vintage, effective interval, equivalence and approval required; no automatic conversion of historical 1–4 to current risk weights.
- **AY-R08 — Source custody.** Retain original binary, issuer URL, retrieval time, SHA-256, document pagination, signature/issuer authenticity review, legal interpretation and independent accounting sign-off before activation.
- **AY-R09 — Ambiguity quarantine.** I-2015/01 art.8(d) 312/322 and I-2003/01 2651/2652 remain blocked. No guessed errata, silent OCR normalization or 'most likely' production mapping.
- **AY-R10 — Reconciliation proof.** Migration bridge must reconcile all prior and new code aggregates to immutable source journals with zero unexplained differences; independent reviewer signs the report.
- **AY-R11 — Unknown external outcome.** Payment/branch state transitions cannot create/destroy money; `UNKNOWN` requires independent inquiry and safe retry semantics.
- **AY-R12 — Controls as code only after DoR.** Authorization, SoD, maker-checker, traceability, monitoring, DR and tests remain design-only until bounded-context gates and canonical environment are approved.

## Proposed state machines
- Source custody: DISCOVERED -> ISSUER_HOSTED_REVIEWED -> BINARY_RETAINED -> HASHED -> AUTHENTICITY_REVIEWED -> LEGALLY_INTERPRETED -> INSTITUTION_APPROVED -> ELIGIBLE_FOR_RELEASE; any contradiction -> QUARANTINED.
- Chart release: DRAFT -> CLAUSE_RECONCILED -> LEGAL_REVIEWED -> ACCOUNTING_REVIEWED -> DUAL_APPROVED -> SCHEDULED -> ACTIVE -> RETIRED; P0 -> QUARANTINED.
- Legacy import: RECEIVED -> PARSED -> VALIDATED -> MATCHED -> POSTING_INTENT_APPROVED -> POSTED -> RECONCILED; uncertain -> QUARANTINED or INVESTIGATION_REQUIRED. No status alone posts money.
- External settlement: CREATED -> SENT -> ACKNOWLEDGED -> CLEARING_PENDING -> SETTLEMENT_EVIDENCED -> RECONCILED -> FINAL; timeout -> UNKNOWN/INQUIRY_REQUIRED, not success or failure by assumption.

## Proposed API/event boundaries
- `ChartReleaseResolved` includes institution, code, release ID, business date, provenance IDs, approval version and immutable trace; no money amount.
- `BranchNoticeReceived` includes notice ID, source branch, correlation ID, idempotency key and observed internal status; never implies external finality.
- `SettlementEvidenceAccepted` requires trusted external evidence reference, signature/authority validation, amount/currency matching and reconciliation ID.
- `PostingIntent` must include balanced debit/credit lines, exact minor units, immutable source event, rule version, idempotency key and maker-checker approval. Only Accounting Core may commit it.

**No schemas, contracts, workflows or controls above are production-approved or executed.**
