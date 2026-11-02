# BO — Sovereign-security eligibility, redemption and accounting boundary
**Design proposals only — not signed ADRs, available APIs, implemented workflows or executed banking tests.**

## Incremental requirements (beyond BN)
- BO-REQ-01: Maintain distinct `PrudentialInstrumentAssessment`, `CustodyPosition`, `ContractualCashflow`, `ExternalPaymentOutcome`, `AccountingRecognition`, and `ReconciliationCase` bounded contexts. No domain may assert another's authoritative outcome.
- BO-REQ-02: Zero weighting is an *exceptional, effective-dated prudential decision*, not an asset valuation, impairment waiver, cash receipt, or accounting journal. Require issuer-authenticated operative rules and secured-repayment mechanism evidence at the exact instrument level.
- BO-REQ-03: Model security mechanisms as independently verified documents, not a free-text checkbox. Record issuer, security arrangement, beneficiaries, enforceability, funding/collateral confirmation, covered amount, maturity, expiry, governing law and verification time. These are **proposed evidentiary fields**, not assertions that law requires each field.
- BO-REQ-04: Verify account-holding mandates and securities-transfer instructions separately from asset ownership, custody reconciliation, beneficial-owner linkage and bank liquidity. Reject instructions without authority and record signed evidence.
- BO-REQ-05: Contractual coupon/redemption schedule, CRCT pre-maturity notice, due date, payment order, external acknowledgement, finality and bank ledger recognition are distinct events. A schedule, notice or priority flag must never be represented as settled funds.
- BO-REQ-06: A CRCT default notification or insufficient Treasury provision opens a `DEFAULT_NOTIFIED` / investigation path; preserve unresolved external outcomes. Do not invent recovery, penalties, settlement, cash balance or a credit-loss figure.
- BO-REQ-07: A regulatory zero-weight eligibility result does not disable credit monitoring, concentration oversight, accounting impairment assessment, sanctions screening, liquidity management or independent reconciliation.
- BO-REQ-08: For each external settlement message use tenant+rail+external-reference scoped deduplication, cryptographic source verification when available, durable inbox/outbox and a manual exception path. No blind financial retry when outcome is unknown.
- BO-REQ-09: Maintain `effective_at` and `known_at` versions of policy, security arrangements, position statements, settlement evidence and assessments; amendments trigger controlled restatement, never overwrite filed returns.
- BO-REQ-10: Require maker-checker with independent regulatory/legal approval, custody confirmation, treasury operations, accounting authority and reconciliation. No single role can authorize eligibility, fake payment evidence and close a reconciliation case.
- BO-REQ-11: Produce audit lineage from instrument/ISIN through legal source, institution applicability, collateral security, reporting basis, accounting mapping, settlement reference and filing version. Mask confidential evidence under tenant-scoped access.
- BO-REQ-12: Preserve disaster recovery replay, evidence custody, event ordering and reconciliation backlog without manufacturing settled outcomes. SLO, RTO/RPO and retention periods require bank approval.

## Proposed API/event contracts (not implemented)
- `POST /v1/prudential/sovereign-instrument-reviews`: create draft only; `Idempotency-Key`, `institution_id`, `instrument_id`, `as_of`, `known_at`, evidence IDs; returns `PENDING_EVIDENCE` or `NO_COMPLIANCE_DETERMINATION` until policy approved.
- `POST /v1/treasury/sovereign-cashflow-investigations`: record due/default/unknown external outcome with evidence and maker-checker; never posts cash.
- `GET /v1/treasury/sovereign-cashflows/{id}/lineage`: restricted read model joining independent sources without changing their ownership.
- `POST /v1/reconciliation/external-settlement-cases`: create exception case; independent settlement confirmation and accounting recognition remain separate.
- `SovereignInstrumentEvidenceChanged`, `SovereignPaymentOutcomeUnknown`, `PrudentialAssessmentSuspended`: informational outbox events, versioned schemas, tenant scope, deduplicated consumers; no Accounting Core side effects.

## Fourteen NEW negative acceptance specifications — NOT EXECUTED
1. A government security is assigned 0% solely because BEAC's 2021 review mentions possible zero weighting: reject.
2. A secured mechanism applies to ISIN A but a position in ISIN B inherits it: reject.
3. An instrument's security expires before the assessment date: no eligibility.
4. Security document is present but enforceability/covered amount is unknown: no compliance determination.
5. An issuer is recognized but bank-specific applicable prudential basis is missing: reject calculation.
6. A custody position is inferred from an unsigned client instruction: reject position.
7. A valid securities transfer instruction is mistaken for an external settlement receipt: reject.
8. A CRCT reminder is received 15 days before maturity and cash is posted immediately: reject.
9. An order marked high priority in SYGMA is treated as final settled funds without confirmation: reject.
10. Insufficient Treasury provision is notified and an automatic retry posts principal twice: reject; preserve UNKNOWN/default case.
11. A reported default is automatically marked recovered after a payment order is generated: reject.
12. An approved 0% prudential treatment suppresses impairment or credit-risk review: reject coupling.
13. A later regulation or security amendment silently rewrites a previously filed prudential return: reject; explicit restatement.
14. One privileged operator changes eligibility, supplies settlement confirmation and closes reconciliation: reject segregation-of-duties violation.

## Quality gate
All tests above are **specifications only**. No implementation begins until the exact regulation, contractual settlement rules, institution approvals, data retention, accounting mappings, APIs, operations, test harness and reviewable repository are Definition-of-Ready complete. Preserve all existing P0 holds.
