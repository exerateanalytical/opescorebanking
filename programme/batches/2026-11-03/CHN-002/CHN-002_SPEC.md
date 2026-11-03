# CHN-002 — Retail web banking session and account navigation

OPES Core Banking | Checkpoint batch 102 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Define secure browser sessions, account selection and user workflows with predictable desktop/mobile responsiveness and accessibility.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `session_id` | `uuid` | browser session |
| `institution_id` | `uuid` | bank context |
| `subject_id` | `string` | authenticated customer |
| `device_trust_state` | `enum` | untrusted/trusted/review |
| `session_age` | `integer` | elapsed seconds |
| `step_up_state` | `enum` | not_required/pending/verified |
| `authorized_account_refs` | `list` | scope |
| `last_server_activity_at` | `datetime` | idle control |
| `session_policy_version` | `string` | approved rules |

## Workflow and recovery design
1. Authenticate with approved browser OIDC flow and validated redirect origin.
2. Create protected session with institutional and customer scope.
3. Load permitted accounts, balances and authorized actions from server.
4. Show responsive navigation and transaction states without screen cramping.
5. Require step-up for sensitive operations and revoke stale sessions.
6. Terminate session safely and clear sensitive local caches.

## Invariants and enforcement requirements
1. **CHN-002-R01** Never store reusable long-lived banking secrets in unprotected local storage.
2. **CHN-002-R02** Session inactivity and lifetime limits are bank-policy defined.
3. **CHN-002-R03** No browser-only transaction authorization.
4. **CHN-002-R04** Account switch must revalidate mandate and institution boundary.
5. **CHN-002-R05** Do not display cached balance as live when source unavailable.
6. **CHN-002-R06** Responsive controls meet keyboard and screen reader requirements.
7. **CHN-002-R07** Logout and token revocation prevent further privileged actions.

## Acceptance and negative scenarios — planned, not run
- [ ] **CHN-002-T01** Stolen stale session cannot initiate transaction.
- [ ] **CHN-002-T02** Cross-account selection without mandate denied.
- [ ] **CHN-002-T03** Session expiry clears sensitive screen state.
- [ ] **CHN-002-T04** Screen-reader order matches visual task flow.
- [ ] **CHN-002-T05** Replayed callback cannot forge authorization.

## Dependency and reviewer gate
Approved authentication policy, accessibility standard selection and real browser/security test evidence.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
