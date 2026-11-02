# BR — Restitution and finality: proposed controls and negative acceptance cases
**Design only.** This is not a claim of production readiness, legal applicability, certification or executable test coverage.

## Legal/operational boundaries
- BEAC circular 004/DGE/DSMP/2023 governs the described PSP erroneous-transfer process. Verify product, institution, licence, contract, effective-dated amendments and court-order interactions before encoding any deadline or automatic release.
- Distinguish payment **execution/finality** from **recipient fund availability** and from **request for restitution**. A final settlement is not edited or cancelled by a complaint. Returns, where legally permitted, are separate authorized transfers.
- BQ SYSTAC2 platform go-live and BR vendor migration counts do not establish any bank's own signed participation, profile conformance, security keys, dispute entitlements or settlement-account proof.
- BEAC's historical SYGMA RMA/private-line description is not a V10 interface contract. A rail ACK, pending batch, cheque image or unverified statement does not prove finality.

## Proposed bitemporal case contract (not approved API)
`RestitutionCase`: tenant_id, institution_id, case_id, original_payment_id, rail_id, product_id, legal_rule_version, rule_source_evidence_id, applicable_from/to, observed_at, payer_notification_at, recipient_notification_at, claim_received_at, requested_amount_minor, currency, reason_code, recipient_consent_evidence, recipient_objection_evidence, freeze_request_id, freeze_authorization_id, held_amount_minor, balance_snapshot_id, external_payment_reference, court_order_reference, status, status_version, event_digest, created_by, approved_by, audit_chain_reference.
Every change must be authenticated, scoped, versioned and auditable. Monetary amounts are exact integers in currency minor units where appropriate; never binary float. Legal clocks and expiry must be derived from independently recorded, trustworthy timestamps. Proposed events: `RestitutionClaimRecorded`, `LegalScopeVerified`, `FundsHoldRequested`, `FundsHoldConfirmed`, `RecipientConsentRecorded`, `RecipientObjectionRecorded`, `RestitutionAuthorized`, `ReturnSubmitted`, `ReturnOutcomeUnknown`, `ReturnExternallyConfirmed`, `RestitutionReconciled`. Event names are proposals, not approved BEAC contracts.

## Control architecture
1. **Legal policy gate:** verified current issuer instrument + product-specific institution counsel sign-off + signed customer/merchant terms + retention and data protection rules + per-institution activation. If absent, keep `SCOPE_VERIFICATION_PENDING`, no automatic freeze/return.
2. **Funds hold gate:** authorized recipient-side hold, exact spendable balance check, maker-checker for overrides, AML/fraud/legal hold precedence, no direct posted balance modification.
3. **Return gate:** authenticated consent or legally applicable nonresponse/judicial order, separate authorization, idempotent instruction, no direct reversal of irrevocable original transfer.
4. **External evidence gate:** trusted scheme outcome and account/statement confirmation, duplicate/replay detection, durable unknown outcomes, no inferred success from message acceptance.
5. **Accounting gate:** separate immutable balanced postings under institution-approved PCEC, independent reconciliation, preserved original payment chain.
6. **Operational gate:** SLA/age metrics for claims, holds, disputes, stale unknown outcomes and recon exceptions; failover/resume must not reset timers or replay postings.

## 16 NEW negative acceptance scenarios — specifications, NOT executed
| ID | Scenario | Required rejection / behavior |
|---|---|---|
| BR-T01 | Apply PSP circular to every SYSTAC2 transfer | Fail legal scope gate; no generic five-minute rule |
| BR-T02 | Interpret five-minute beneficiary availability as settlement-finality delay | Reject; keep finality and spendability independent |
| BR-T03 | Claim timestamp fabricated or clock drift crosses deadline | Quarantine clock evidence; no automated expiry |
| BR-T04 | Late restitution request and beneficiary available funds below disputed amount | Do not invent funds or force negative spendable balance; record insufficient funds |
| BR-T05 | Recipient contests and operator attempts automatic refund | Hold/route to authorized judicial workflow; no forced return |
| BR-T06 | 24h merchant silence rule applied to unrelated payment category | Reject rule misclassification |
| BR-T07 | 48h other-payment silence applied before verified notification | Do not start timer or infer consent |
| BR-T08 | Same return request retried after network timeout | Preserve original idempotency and unknown external outcome; no second transfer |
| BR-T09 | Original settled journal overwritten when restitution approved | Reject; separate new balanced journal |
| BR-T10 | Vendor 71-participant statement treated as bank X certification | Reject institution-specific entitlement inference |
| BR-T11 | Historical SWIFT/RMA onboarding text treated as SYGMA V10 certification | Reject version-incompatible claim |
| BR-T12 | SYSTAC2 clearing ACK treated as SYGMA finality | Remain unsettled; demand authenticated settlement proof |
| BR-T13 | Different tenant's restitution evidence/hold used | Deny; tenant scope and immutable audit |
| BR-T14 | Court order or fraud hold conflicts with nonresponse auto-return | Suspend automation; escalate under legal precedence |
| BR-T15 | DR recovery replays hold/return and resets 24/48h clock | Keep durable event clock, idempotent hold and return |
| BR-T16 | SYSTAC2 instant feature enabled based on vendor's future-product description | Reject; separate issuer activation and bank conformance required |

## Meaningful executable tests still missing
Approved current circular interpretation, scheme contract, exact BEAC profiles and signed message examples, institution policy, PCEC chart, test sandbox/simulator, expected journals, statement/return fixture, judicial scenarios, time-skew and DR/replay fixtures. **Banking tests executed: 0.**