# CHN-005 — Channel user roles, account delegation and capability decisions

OPES Core Banking | Checkpoint batch 105 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Define per-action server-side channel authorization that incorporates institutional license, user role, product entitlement and live account restrictions.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `permission_decision_id` | `uuid` | authorization result |
| `institution_id` | `uuid` | licensed scope |
| `channel_id` | `string` | client surface |
| `principal_id` | `string` | authenticated actor |
| `account_id` | `uuid|null` | affected object |
| `action` | `string` | read/prepare/approve/submit |
| `mandate_ref` | `uuid|null` | legal authorization |
| `risk_state` | `string` | applicable condition |
| `policy_version` | `string` | approved edition |
| `result` | `enum` | allow/deny/challenge |

## Workflow and recovery design
1. Validate identity token origin and intended audience.
2. Resolve institution, channel and exact account/resource ownership.
3. Apply relevant customer, joint mandate and corporate approval scope.
4. Check account restrictions and allowed current product capabilities.
5. Require step-up or additional signer where risk policy demands.
6. Record decision ID without disclosing confidential screening results.

## Invariants and enforcement requirements
1. **CHN-005-R01** Hidden UI control does not count as a permission check.
2. **CHN-005-R02** Backend must reject cross-tenant object references and IDs.
3. **CHN-005-R03** User/account/mandate approval evaluated at request time, not just login.
4. **CHN-005-R04** An active role cannot override an expired corporate signing mandate.
5. **CHN-005-R05** Policy version is reproducible for forensic audit.
6. **CHN-005-R06** Read account scope does not automatically grant transfer authority.
7. **CHN-005-R07** Delegation must be revocable and effective-dated.

## Acceptance and negative scenarios — planned, not run
- [ ] **CHN-005-T01** Read-only user cannot submit payment.
- [ ] **CHN-005-T02** Revoked signer fails next command.
- [ ] **CHN-005-T03** Wrong-tenant account selection denied.
- [ ] **CHN-005-T04** Stale role token cannot elevate privileges.
- [ ] **CHN-005-T05** Risk step-up challenge persists until satisfied.

## Dependency and reviewer gate
Legal mandate rules, IAM role/permission contract and executable IDOR and privilege-abuse tests.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
