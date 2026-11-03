# CHN-011 — Customer support, complaints and payment dispute case management

OPES Core Banking | Checkpoint batch 111 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Separate banking complaints, unrecognized activity and transaction disputes from independent financial corrections and rail return procedures.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `case_id` | `uuid` | stable complaint |
| `institution_id` | `uuid` | bank owner |
| `customer_id` | `uuid` | complainant |
| `account_ref` | `uuid|null` | scoped record |
| `transaction_ref` | `uuid|null` | claimed operation |
| `category` | `enum` | service/payment/fraud/fees |
| `submitted_at` | `datetime` | case creation |
| `case_state` | `enum` | open/investigating/escalated/resolved |
| `evidence_refs` | `list` | protected attachments |
| `resolution_approval_ref` | `uuid|null` | checker decision |

## Workflow and recovery design
1. Authenticate claimant or establish authorized assistance channel.
2. Capture complaint without exposing private counterparty evidence.
3. Classify severity, legal response window and bank-approved triage owner.
4. Acquire authoritative journal, settlement and channel-authentication evidence.
5. Escalate refund, reversal or dispute under independent finance/rail policy.
6. Communicate resolution with traceable decision and appeal pathway.

## Invariants and enforcement requirements
1. **CHN-011-R01** Customer support staff cannot directly edit posted journal.
2. **CHN-011-R02** Dispute initiation does not itself prove unauthorized activity.
3. **CHN-011-R03** Refund/return is a new authorized financial operation with reconciliation.
4. **CHN-011-R04** Customer communication avoids disclosing AML investigation details.
5. **CHN-011-R05** SLA deadlines require verified local legal/customer policy, not guesswork.
6. **CHN-011-R06** Cross-tenant case access must be denied.
7. **CHN-011-R07** Complaint evidence retained under lawful privacy and audit policies.

## Acceptance and negative scenarios — planned, not run
- [ ] **CHN-011-T01** Support actor cannot issue direct ledger debit.
- [ ] **CHN-011-T02** Refund without authorized finance approval denied.
- [ ] **CHN-011-T03** Claimant sees only their own case.
- [ ] **CHN-011-T04** Unknown external transfer remains under investigation.
- [ ] **CHN-011-T05** Duplicate complaint links prior case without losing evidence.

## Dependency and reviewer gate
Institution complaints policy, applicable dispute rules, payment rail agreements and independent operational/finance tests.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
