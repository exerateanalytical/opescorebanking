# CHN-012 — Agency banking terminal and field-operator safeguards

OPES Core Banking | Checkpoint batch 112 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Specify delegated agent operations with verifiable customer authority, cash custody and restricted offline behavior.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `agent_id` | `uuid` | licensed/contracted delegate |
| `institution_id` | `uuid` | principal bank |
| `terminal_id` | `string` | registered device |
| `branch_or_network_id` | `uuid` | supervisor scope |
| `cash_session_ref` | `uuid` | custody record |
| `allowed_operations` | `list` | bank-approved abilities |
| `customer_auth_ref` | `uuid` | consent/identity evidence |
| `command_id` | `string` | stable transaction ID |
| `network_state` | `enum` | online/degraded/offline |
| `approval_policy_version` | `string` | effective rules |

## Workflow and recovery design
1. Verify agent contract, device, cash limits and institution permission.
2. Authenticate customer and validate action and allowed channel.
3. Collect proposed deposit/withdrawal instruction with unique command ID.
4. Record actual cash custody handover under approved dual controls.
5. Commit only through authorized online financial domain and show true outcome.
6. Reconcile teller cash, receipt and ledger before closing agent session.

## Invariants and enforcement requirements
1. **CHN-012-R01** Offline terminal cannot fabricate completed financial posting.
2. **CHN-012-R02** Agent cannot operate beyond contractual product and liquidity limits.
3. **CHN-012-R03** Agent cash balance is a custody record distinct from customer deposit liability.
4. **CHN-012-R04** Do not declare settlement from unconfirmed network response.
5. **CHN-012-R05** Per-agent privilege expiry and suspension must be effective immediately.
6. **CHN-012-R06** Receipts must identify customer operation status accurately.
7. **CHN-012-R07** Duplicate retry cannot create duplicate customer balances.

## Acceptance and negative scenarios — planned, not run
- [ ] **CHN-012-T01** Offline deposit presented as pending not completed.
- [ ] **CHN-012-T02** Expired agent entitlement blocks transaction.
- [ ] **CHN-012-T03** Repeat terminal request uses one ledger command.
- [ ] **CHN-012-T04** Cash/ledger discrepancy blocks session closure.
- [ ] **CHN-012-T05** Cross-agent customer ID leakage denied.

## Dependency and reviewer gate
Bank agency licensing and contract requirements, approved cash custody policy and executed agent reconciliation tests.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
