# CHN-001 — Omnichannel banking architecture and experience boundaries

OPES Core Banking | Checkpoint batch 101 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Define web, mobile, corporate, agency and partner channel architecture as authenticated clients of authoritative banking APIs, not duplicate ledgers.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `channel_id` | `string` | channel type |
| `institution_id` | `uuid` | licensed provider |
| `client_application_id` | `string` | registered public/confidential app |
| `channel_policy_version` | `string` | entitlement edition |
| `customer_subject` | `string` | identity reference |
| `account_scope` | `list` | authorized accounts |
| `api_contract_version` | `string` | backend dependency |
| `session_context_ref` | `string` | authenticated session |
| `feature_flags` | `list` | effective capabilities |

## Workflow and recovery design
1. Define channel personas, device types and institution-specific offerings.
2. Authenticate via approved identity provider and scoped token audience.
3. Resolve per-account capabilities, mandates and KYC state at backend.
4. Fetch read-only balances with snapshot freshness from authoritative APIs.
5. Route state-changing requests through validated banking commands.
6. Handle failure, retry, pending and unknown outcomes transparently.

## Invariants and enforcement requirements
1. **CHN-001-R01** No banking channel stores or mutates authoritative ledger balances.
2. **CHN-001-R02** Client-side role visibility is not server-side authorization.
3. **CHN-001-R03** API may not promote read projection to final settlement authority.
4. **CHN-001-R04** Institution feature availability is effective dated and reviewed.
5. **CHN-001-R05** Channel supports localized currency, language and accessible errors.
6. **CHN-001-R06** Cross-channel idempotency prevents repeated financial consequences.
7. **CHN-001-R07** Session and personal-data handling comply with approved institution policy.

## Acceptance and negative scenarios — planned, not run
- [ ] **CHN-001-T01** Unauthorized UI route cannot reach protected API.
- [ ] **CHN-001-T02** Mobile and web retry same command without duplication.
- [ ] **CHN-001-T03** Read projection shows stale status explicitly.
- [ ] **CHN-001-T04** Unsupported bank capability remains disabled.
- [ ] **CHN-001-T05** Cross-institution account reference denied.

## Dependency and reviewer gate
Approved institution/channel profile, identity policy, backend API contracts and usability/security review.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
