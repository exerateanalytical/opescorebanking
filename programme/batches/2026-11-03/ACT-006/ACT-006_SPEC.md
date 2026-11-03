# ACT-006 — Account opening workflow and customer binding

**OPES Core Banking | Batch 66/90 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Objective and boundary
Specify customer account opening with explicit approved product terms, KYC status, mandate and institution limits.

## Candidate record and API fields
| Field | Type | Meaning |
|---|---|---|
| `account_application_id` | `uuid` | opening request |
| `institution_id` | `uuid` | legal scope |
| `customer_party_id` | `uuid` | verified customer |
| `product_version` | `string` | agreed terms |
| `requested_currency` | `string` | approved currency |
| `branch_id` | `uuid` | responsible branch |
| `kyc_decision_ref` | `uuid` | identity/risk clearance |
| `mandate_refs` | `list` | authorized signatories |
| `status` | `enum` | draft/review/approved/opened/rejected |
| `opened_account_ref` | `uuid|null` | created account |

## Lifecycle workflow
1. Create an idempotent account application with selected product.
2. Validate CIF/KYB, required evidence and risk restrictions.
3. Check license, country, customer and product eligibility.
4. Obtain agreement and mandate approvals including dual control as needed.
5. Allocate unique account ID only after approval.
6. Publish AccountOpened event without posting initial monetary balance.

## Requirements, financial and authorization invariants
1. **ACT-006-REQ-01** Opening account does not create money or imply a deposit transaction.
2. **ACT-006-REQ-02** No KYC clearance or unapproved product means no opening.
3. **ACT-006-REQ-03** Customer controls cannot be bypassed through branch/API channel.
4. **ACT-006-REQ-04** Account numbers are unique per bank and format policy.
5. **ACT-006-REQ-05** Document approval and customer agreement version immutably.
6. **ACT-006-REQ-06** Cross-institution customer IDs cannot bind to foreign accounts.

## Acceptance tests — NOT EXECUTED
- [ ] **ACT-006-T01** Repeated opening request yields one account.
- [ ] **ACT-006-T02** Rejected application cannot open account.
- [ ] **ACT-006-T03** Missing KYC keeps application pending.
- [ ] **ACT-006-T04** No ledger journal from opening alone.
- [ ] **ACT-006-T05** Unauthorized signatory rejected.

## Acceptance and independent review gate
Approved CIF profile, product eligibility, account agreement and bank-specific account-number policy.

Status: This is a candidate design document, not operational bank software. No production code, executed tests, independent signoff or regulatory certification is asserted. The PCEC 312/322 mapping conflict and unverified external payment/settlement participation remain P0 and prohibit dependent activation.
