# CHN-003 — Customer mobile banking and device-safe transaction workflows

OPES Core Banking | Checkpoint batch 103 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Specify native-feeling mobile banking navigation, offline/error states and protected commands without relying on locally cached money balances.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `device_binding_id` | `uuid` | customer device reference |
| `institution_id` | `uuid` | bank scope |
| `app_installation_id` | `string` | mobile install |
| `subject_id` | `string` | authenticated user |
| `device_attestation_state` | `enum` | unknown/reviewed/approved |
| `app_version` | `string` | supported release |
| `local_cache_policy` | `string` | data minimization mode |
| `session_ref` | `uuid` | active context |
| `push_channel_ref` | `string|null` | notification handle |

## Workflow and recovery design
1. Onboard a device under institutional risk policy and customer identity checks.
2. Authenticate session and fetch scoped customer accounts and abilities.
3. Render single-task mobile flows with readable controls and assistive labels.
4. Collect high-risk instructions with confirmation and risk-based step-up.
5. Submit with idempotency and present pending/unknown/completed statuses distinctly.
6. On lockout or offline state, protect private data and avoid duplicate money operations.

## Invariants and enforcement requirements
1. **CHN-003-R01** Untrusted device cannot silently self-bind to customer payments.
2. **CHN-003-R02** Offline cache never authorizes a monetary transfer or invents fresh balances.
3. **CHN-003-R03** Sensitive fields and tokens are encrypted/minimized under reviewed policy.
4. **CHN-003-R04** Display status comes from server evidence, not a push notification.
5. **CHN-003-R05** Mobile design respects two-column maximum and responsive accessible screens.
6. **CHN-003-R06** Repeated tap cannot create duplicate payment commands.
7. **CHN-003-R07** Device unbinding revokes future device-bound tokens.

## Acceptance and negative scenarios — planned, not run
- [ ] **CHN-003-T01** Double tap sends one transaction identity.
- [ ] **CHN-003-T02** Offline initiation cannot claim completion.
- [ ] **CHN-003-T03** Revoked device loses privileged access.
- [ ] **CHN-003-T04** Accessibility labels and dynamic text do not overlap.
- [ ] **CHN-003-T05** Wrong institution device binding denied.

## Dependency and reviewer gate
Bank-approved device posture policy, mobile threat model and real device/API accessibility testing.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
