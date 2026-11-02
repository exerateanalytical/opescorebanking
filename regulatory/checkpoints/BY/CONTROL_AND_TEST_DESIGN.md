# BY — Control, workflow, accounting and negative test design
**All controls are proposed; none implemented or executed.** Institution-specific legal and PCEC mappings remain unapproved.

## Proposed external-debit workflow
1. Receive and retain authenticated issuer statement / notice; verify institution, settlement account, rail, effective date, unique reference, signature/channel, and custody chain.
2. Separate a restitution **request**, an advance **notice**, and a **confirmed debit**. A request or notice alone cannot create settlement or a journal.
3. Reconcile confirmed external movement with clearing/settlement and customer obligations; open discrepancy case if amount, value date or account mismatches.
4. Segregated maker-checker approval determines applicable accounting treatment under an approved bank PCEC mapping. Post a **new immutable balanced journal**; never edit original settlement.
5. Preserve unresolved legal disputes, unknown external outcomes and independent reconciliation evidence. No customer debit or credit until contractual/legal authorization is established.

## Proposed supervisor incident routing
An incident can have BEAC rail-operation, COBAC ICT, both or neither applicability. Evaluate separately with authenticated operative instructions. Each report has its own approval, submission channel, timestamp, external receipt and error/unknown state. The 2024 BEAC report's SANGHA description is not an API contract. Avoid leaking bank/customer personal data into unapproved report channels.

## Negative acceptance scenarios — 14 unexecuted
| ID | Stimulus | Expected fail-closed behavior |
|---|---|---|
| BY-T01 | Unsigned charter enables rail | Reject participation entitlement; log missing signature |
| BY-T02 | BEAC Art 56 request received without debit | Do not post settlement debit or alter original journal |
| BY-T03 | Verified BEAC debit arrives twice | One immutable balanced posting maximum; second event idempotent |
| BY-T04 | External statement amount differs from requested restitution | Quarantine discrepancy; independent reconciliation |
| BY-T05 | COBAC ICT incident notification used as proof of BEAC rail incident reporting | Reject receipt substitution; preserve two cases |
| BY-T06 | BEAC reporting enqueued without issuer acknowledgment | Retain SENT_UNCONFIRMED/UNKNOWN_OUTCOME; do not claim notified |
| BY-T07 | SANGHA adapter activated from public report alone | Fail closed; no credentials or issuer schema |
| BY-T08 | 2014 sub-100m routing threshold applied to current SYSTAC2 | Reject until current scheme version approved |
| BY-T09 | 2014 ten-year BEAC archival promise applied to bank personal records | Reject bank retention policy derivation |
| BY-T10 | Unverified 001/GR/2024 PIN requirement hardcoded | Reject normative policy activation |
| BY-T11 | One admin both approves and deploys critical rail change | Reject; enforce segregation and audit |
| BY-T12 | Recovery replay posts settled transaction twice | Enforce idempotency and reconciliation exception |
| BY-T13 | GIMAC DISPUTES launch taken as bank conformance | Reject integration entitlement claim |
| BY-T14 | Charter surveillance instruction cited as 2013 without authenticated text | Quarantine citation; no rule activation |

## Accounting invariants
No status transition creates or destroys money. No direct balance writes. Exact currency arithmetic. Immutable posted journal with controlled correcting entries. External central-bank debit recognized only on verified evidence and authorized mapping. Unknown outcomes are not successes. Idempotency keys survive failover. Reconciliation is independent of the posting actor.

## Data and operations
Version external statement evidence and legal instruments; encrypt evidence, enforce institution scope, time-bound access, maker-checker, immutable audit and retention-by-law. Maintain daily rail reconciliation with exceptions and ageing. Keep external incident-reporting receipts independently retrievable by audit teams. Test operational failover/failback and preserve transaction identity across recovery.

## DoR review
Items 2,3,7,8,9,10,11,12,13,14 remain materially incomplete for production because bank type, operative law, approved PCEC, issuer interfaces, actual external evidence, executable tests and legal authorizations are absent. No production code authorized.
