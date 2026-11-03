# CHN-019 — Channel device lifecycle, compatibility and end-to-end testing

OPES Core Banking | Checkpoint batch 119 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Define customer device binding, update, revocation, security compatibility and realistic channel journey testing across mobile, browser and delegated devices.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `device_id` | `uuid` | registered installation |
| `institution_id` | `uuid` | bank owner |
| `customer_id` | `uuid` | authenticated subject |
| `device_type` | `enum` | mobile/browser/agent_terminal |
| `registration_evidence_ref` | `uuid` | proof of binding |
| `app_version` | `string` | supported version |
| `integrity_state` | `enum` | unknown/approved/blocked |
| `last_seen_at` | `datetime` | session event |
| `revocation_state` | `enum` | active/suspended/revoked |
| `e2e_test_run_ref` | `uuid|null` | real evidence |

## Workflow and recovery design
1. Register a supported device only after risk-appropriate customer authentication.
2. Record device permissions, platform compatibility and version support.
3. Authorize key banking journeys with institution and account object checks.
4. Apply revoked-device and expired-session policies to subsequent commands.
5. Test interrupted, duplicated and delayed channel callbacks in controlled environments.
6. Review actual end-to-end results for money, privacy, accessibility and error recovery.

## Invariants and enforcement requirements
1. **CHN-019-R01** A trusted device is not permanent authentication or payment authorization.
2. **CHN-019-R02** Invalid app version may be restricted without changing customer account state.
3. **CHN-019-R03** Device deregistration must revoke device-bound sessions.
4. **CHN-019-R04** No production transaction is labeled passed from mocked test fixtures alone.
5. **CHN-019-R05** End-to-end tests include backend permission and bank financial invariants.
6. **CHN-019-R06** Client telemetry may not collect raw banking secrets or personal documents.
7. **CHN-019-R07** A failed compatibility check must never silently bypass security controls.

## Acceptance and negative scenarios — planned, not run
- [ ] **CHN-019-T01** Revoked mobile session cannot initiate debit.
- [ ] **CHN-019-T02** Unsupported client receives safe upgrade response.
- [ ] **CHN-019-T03** Device switch triggers required step-up.
- [ ] **CHN-019-T04** Web/mobile retry same command does not duplicate posting.
- [ ] **CHN-019-T05** Accessibility and error-recovery flows verified on actual supported devices.

## Dependency and reviewer gate
Approved device and versioning policy, qualified security/QA test environment and real end-to-end evidence.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
