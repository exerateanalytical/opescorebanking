# CHN-013 — Merchant banking portal and transaction reporting APIs

OPES Core Banking | Checkpoint batch 113 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Define merchant-facing settlement visibility, refund requests and account history while keeping card/acquiring rails distinct from bank ledger source.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `merchant_id` | `uuid` | KYB-verified seller |
| `institution_id` | `uuid` | bank entity |
| `merchant_account_id` | `uuid` | authorized account |
| `acquiring_profile_id` | `string|null` | contract edition |
| `settlement_report_ref` | `string` | external source |
| `sales_total` | `string` | source-stated amount |
| `fees_total` | `string` | approved tariff amount |
| `refund_request_id` | `uuid|null` | request identity |
| `settlement_state` | `enum` | pending/evidenced/reconciled |
| `report_cursor` | `string` | as-of source |

## Workflow and recovery design
1. Validate merchant KYB, contract and linked account mandate.
2. Fetch authorized transaction history with explicit rail/source provenance.
3. Separate authorization, capture, settlement and reconciliation in interface.
4. Present fees and net proceeds with exact source versions.
5. Submit refund/chargeback requests to independent approved workflow.
6. Record reconciliation discrepancies and escalation cases.

## Invariants and enforcement requirements
1. **CHN-013-R01** Merchant dashboard totals do not create bank deposits.
2. **CHN-013-R02** Authorization/capture is not equivalent to externally settled cash.
3. **CHN-013-R03** Refund request cannot mutate original posted financial record.
4. **CHN-013-R04** Report must show currency, cutoff and source reconciliation state.
5. **CHN-013-R05** Merchant may not query another seller's statement or customer data.
6. **CHN-013-R06** Acquiring/PSP partner connection requires actual participation credentials.
7. **CHN-013-R07** Use stable idempotency keys for merchant financial requests.

## Acceptance and negative scenarios — planned, not run
- [ ] **CHN-013-T01** Cross-merchant report access denied.
- [ ] **CHN-013-T02** Pending settlement not added to posted balance.
- [ ] **CHN-013-T03** Refund request duplicate does not duplicate refund.
- [ ] **CHN-013-T04** Fee total reconciles to approved tariff.
- [ ] **CHN-013-T05** Missing acquiring contract blocks production transaction.

## Dependency and reviewer gate
Acquiring/payment institution participation evidence, merchant KYB policy, settlement reconciliations and CFO/security review.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
