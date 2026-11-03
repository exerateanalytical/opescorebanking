# CHN-009 — Customer authentication, risk-based step-up and recovery

OPES Core Banking | Checkpoint batch 109 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Specify secure channel authentication and high-value action confirmation with verified device/session context and controlled account recovery.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `auth_context_id` | `uuid` | session proof |
| `institution_id` | `uuid` | licensed bank |
| `subject_id` | `string` | customer identity |
| `session_id` | `uuid` | current session |
| `auth_method` | `string` | institution-approved factor |
| `assurance_level` | `string` | verified strength |
| `challenge_digest` | `string` | bound transaction values |
| `challenge_state` | `enum` | pending/success/failed/expired |
| `recovery_case_ref` | `uuid|null` | account recovery |
| `policy_version` | `string` | approved risk policy |

## Workflow and recovery design
1. Authenticate customer under approved OIDC and device posture rules.
2. Evaluate action risk, session age and product-specific controls.
3. Issue short-lived challenge bound to account, recipient, amount and command identity.
4. Verify challenge on trusted server against immutable transaction digest.
5. Grant narrowly scoped one-use authorization and execute original request.
6. On recovery, verify ownership and revoke compromised sessions/devices.

## Invariants and enforcement requirements
1. **CHN-009-R01** One-time challenge cannot authorize changed transfer parameters.
2. **CHN-009-R02** No SMS/biometric factor is universally mandated without risk and policy review.
3. **CHN-009-R03** Credential reset does not silently remove financial restrictions.
4. **CHN-009-R04** Account recovery cannot bypass independent high-risk approval.
5. **CHN-009-R05** Browser/mobile clients cannot self-assert authentication strength.
6. **CHN-009-R06** All challenge attempts and failures are rate limited and audited.
7. **CHN-009-R07** Expired token or revoked device cannot approve a new payment.

## Acceptance and negative scenarios — planned, not run
- [ ] **CHN-009-T01** Changed amount invalidates challenge.
- [ ] **CHN-009-T02** Replayed challenge rejected.
- [ ] **CHN-009-T03** Recovered account revokes previous sessions.
- [ ] **CHN-009-T04** Insufficient factor leads to explicit challenge.
- [ ] **CHN-009-T05** Cross-bank session cannot authorize target account.

## Dependency and reviewer gate
Bank IAM and identity proofing policy, real strong-auth controls and approved security/UX testing.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
