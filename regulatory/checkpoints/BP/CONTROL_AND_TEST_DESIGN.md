# BP — Payment-rail evidence controls and acceptance design
**Design proposals, not approved contracts, code, certification or executed tests.** Extends BO's sovereign cashflow/settlement separation without changing its domain ownership.

## Proposed bounded-context ownership
- **PaymentInstruction:** business authorization, sanctions/AML decision, maker-checker, immutable idempotency scope, customer consent and instruction history. Cannot assert central-bank finality.
- **RailAdapter:** versioned BEAC profile, message serialization and validation, cryptographic origin/transport checks, durable outbox/inbox, authenticated receipts, replay quarantine. Cannot post journals.
- **ExternalSettlementEvidence:** stores original authenticated source, participant/rail/reference, amount/currency/value date, provenance and explicit UNKNOWN state; settlement determination must be approved against binding participant scheme rules.
- **AccountingCore:** only authoritative balanced journals, reversals/corrections and approved PCEC mappings; never direct balance writes or implicit status-based posting.
- **IndependentReconciliation:** matches external settlement account statements, rail messages and internal books; retains unmatched, disputed, delayed and duplicate items. Cannot invent settlement.
- **PrudentialAssessment:** sovereign eligibility, secured repayment and risk weights remain independent; never infer from payment success.

## Workflow and state discipline
`AUTHORIZED → SUBMITTED → RAIL_ACKNOWLEDGED → SETTLEMENT_EVIDENCE_PENDING → EXTERNALLY_CONFIRMED → RECONCILED` is a **candidate happy path only**. Alternate states: `REJECTED`, `EXTERNAL_OUTCOME_UNKNOWN`, `CANCELLATION_REQUESTED`, `RETURN_PENDING`, `RECONCILIATION_EXCEPTION`. Every transition requires a traceable authenticated event and explicit authorization where needed. A status change never posts money by itself. Missing or conflicting external evidence enters investigation, not blind retry.

## Message taxonomy (names evidenced; semantics require private profile)
| BEAC circular message | Candidate purpose | Must **not** infer |
|---|---|---|
| pacs.002 | payment status | settled central-bank funds |
| pacs.028 | status inquiry | execution or settlement |
| pacs.004 | return | erasure of original finality/journal |
| camt.056 | cancellation request | cancellation succeeded |
| camt.029 | cancellation response | successful cancellation without approved code mapping |
| camt.053 / camt.054 | statement / debit-credit notification | authenticity or reconciliation without verified source |

## Control gates
**G1 Legal:** current scheme/participant agreements, instruction/circular amendments and finality semantics authenticated. **G2 Identity:** institution participation class, approved BIC/account, maker-checker, bank-specific rights. **G3 Message:** approved CEMAC-BANK schemas and exact version, signature/security profile, no arbitrary generic ISO 20022 substitutes. **G4 Outcome:** external status vs finality vs reconciliation explicitly distinct, with unknown outcome hold. **G5 Accounting:** signed PCEC policy, immutable double-entry journal, return/correction and idempotency contract. **G6 Operations:** support escalation, DR replay, cutoffs/holidays, time zones, reconciliation SLA and audit retention bank-approved. **G7 Audit:** original evidence digest, signer, effective date, custody, dual-control and filing/restatement lineage.

## 16 NEW negative acceptance scenarios — SPECIFIED, NOT EXECUTED
- **BP-T01:** Given pacs.002 accepted/status message arrives without authenticated settlement-account evidence; expect Keep EXTERNAL_OUTCOME_UNCONFIRMED; no settlement assertion or posting solely from status.
- **BP-T02:** Given camt.056 cancellation request sent but no authoritative outcome received; expect Remain CANCELLATION_REQUESTED / OUTCOME_UNKNOWN; no reversal or finality assertion.
- **BP-T03:** Given camt.029 reply has ambiguous/unsupported reason code; expect Do not infer successful cancellation; preserve investigation.
- **BP-T04:** Given pacs.004 return received for previously finalized payment; expect Treat as independently evidenced return flow with new idempotency scope; never mutate original posted journal.
- **BP-T05:** Given pacs.028 inquiry or replayed pacs.002 arrives twice; expect No duplicate posting or repeated outward payment; record duplicate evidence.
- **BP-T06:** Given camt.053 statement missing or does not reconcile to internal settlement ledger; expect Open reconciliation exception; no manufactured external cash.
- **BP-T07:** Given camt.054 credit/debit notification is unauthenticated or wrong participant; expect Quarantine; no authoritative settlement.
- **BP-T08:** Given valid ISO 20022 base XML does not satisfy BEAC community profile/version; expect Reject integration readiness; no live rail submission.
- **BP-T09:** Given unknown outcome during timeout, reconnect or DR replay; expect No blind resend; durable investigation with external reference and authorized resolution.
- **BP-T10:** Given bank has no BEAC-approved direct/indirect participation agreement; expect Reject claim of direct SYGMA connectivity and settlement.
- **BP-T11:** Given annex dates for ISO 20022 migration conflict with chronology; expect Do not infer actual go-live date or compliance from annex; seek BEAC clarification.
- **BP-T12:** Given SYSTAC nominal 13:00–13:30 window missed or net position not settled; expect Remain PENDING/UNKNOWN; never mark all net items final from calendar.
- **BP-T13:** Given prudential 0% sovereign weight selected based on payment rail or coupon notice; expect Reject; prudential instrument eligibility remains separately P0 gated.
- **BP-T14:** Given same operator uploads rail evidence, approves accounting and closes reconciliation; expect Reject segregation-of-duties violation.
- **BP-T15:** Given schema update changes interpretation of historic message; expect Preserve schema/profile version and raw signed evidence; explicit replay under controlled review.
- **BP-T16:** Given participant-specific ISO20022 formats or access are unavailable; expect Do not claim successful interface certification; retain blocked integration state.

## Testability and quality
Acceptance harness must include fake-rail delayed/reordered/duplicated outcomes, forged signatures, profile-version drift, liquidity shortage, failed clearing, DR replay, late returns, journal reconciliation and maker-checker denial. No such harness or integration is available or executed in this checkpoint. No external connectivity, compliance approval, payment execution or settlement confirmation is claimed.
