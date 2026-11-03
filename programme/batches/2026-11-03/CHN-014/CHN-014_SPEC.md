# CHN-014 — Partner developer portal, service credentials and API products

OPES Core Banking | Checkpoint batch 114 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Expose controlled partner APIs with distinct bank product authority, data access permission and technical conformance evidence.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `partner_id` | `uuid` | approved organization |
| `institution_id` | `uuid` | bank sponsor |
| `api_product_id` | `string` | versioned service |
| `client_id` | `string` | OAuth client identity |
| `approved_scopes` | `list` | least privilege |
| `contract_ref` | `uuid` | legal integration agreement |
| `environment` | `enum` | sandbox/qualification/production |
| `credential_ref` | `string` | secret-store alias |
| `quota_policy_id` | `string` | request controls |
| `conformance_ref` | `uuid|null` | test result |

## Workflow and recovery design
1. Perform partner legal/KYB, security and commercial due diligence.
2. Register appropriate API product and versioned OpenAPI contract.
3. Issue environment-separated credentials via approved IAM.
4. Enforce per-entity, scope, object, consent and purpose validation.
5. Monitor rate limits, credential usage and failure/replay anomalies.
6. Promote to production only after authorized contract and executed conformance.

## Invariants and enforcement requirements
1. **CHN-014-R01** OAuth scopes do not override customer consent or legal bank entitlement.
2. **CHN-014-R02** Sandbox credentials must not access production rail or real customer data.
3. **CHN-014-R03** No embedded partner secret in client/mobile SDK.
4. **CHN-014-R04** APIs must reject IDOR and tenant-confused requests at backend.
5. **CHN-014-R05** Deprecation preserves published compatibility commitments.
6. **CHN-014-R06** Production access requires evidence of independent bank approval.
7. **CHN-014-R07** Partner API cannot bypass core ledger commands.

## Acceptance and negative scenarios — planned, not run
- [ ] **CHN-014-T01** Sandbox secret rejected in production.
- [ ] **CHN-014-T02** Uncontracted API scope denied.
- [ ] **CHN-014-T03** Partner cannot retrieve another bank's data.
- [ ] **CHN-014-T04** Rate limit blocks excessive calls without losing accepted commands.
- [ ] **CHN-014-T05** Revoked partner credential immediately invalid.

## Dependency and reviewer gate
Bank's partner programme and lawful API data sharing rules, signed agreement, security tests and institution production approval.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
