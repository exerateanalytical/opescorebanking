# CHN-004 — Corporate banking portal, organization roles and approval chains

OPES Core Banking | Checkpoint batch 104 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Define delegated company treasury operations with verified corporate mandates, segregation of duties and batch transaction limits.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `organization_id` | `uuid` | KYB-approved customer |
| `institution_id` | `uuid` | bank provider |
| `corporate_user_id` | `string` | authorized employee |
| `entitlement_id` | `uuid` | role policy |
| `approval_group_id` | `uuid` | maker-checker group |
| `payment_batch_id` | `uuid|null` | proposed payment set |
| `limit_policy_id` | `string` | daily/per-event limits |
| `mandate_version` | `string` | legal signing authority |
| `case_status` | `enum` | draft/pending/approved/rejected |

## Workflow and recovery design
1. Verify company KYB and authorized signatories.
2. Configure roles, limits and scoped accounts with independent approval.
3. Prepare a payment or file batch and validate beneficiaries and totals.
4. Require configured multi-person authorization before submission.
5. Submit unique payment instruction IDs and track each external outcome.
6. Reconcile approved batch totals with executed ledger and statements.

## Invariants and enforcement requirements
1. **CHN-004-R01** Organization beneficial ownership does not automatically confer account signing authority.
2. **CHN-004-R02** Self-approval disallowed for restricted corporate payments.
3. **CHN-004-R03** User roles cannot expand beyond signed organizational mandates.
4. **CHN-004-R04** Batch approvals are bound to an immutable file digest and amount totals.
5. **CHN-004-R05** Individual unknown external outcomes remain unresolved independently.
6. **CHN-004-R06** Corporate admin cannot cross into another legal entity without verified grant.
7. **CHN-004-R07** No corporate interface writes authoritative balances.

## Acceptance and negative scenarios — planned, not run
- [ ] **CHN-004-T01** Maker cannot approve own batch.
- [ ] **CHN-004-T02** Modified file after approval invalidates signatures.
- [ ] **CHN-004-T03** One failed payment does not falsely mark whole batch settled.
- [ ] **CHN-004-T04** Expired corporate mandate blocks submission.
- [ ] **CHN-004-T05** Cross-company account ID denied.

## Dependency and reviewer gate
Verified KYB/mandate evidence, institutional corporate product limits and executed maker-checker/financial tests.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
