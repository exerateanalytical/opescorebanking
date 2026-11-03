# CHN-015 — Consent-managed data sharing and open-banking permissions

OPES Core Banking | Checkpoint batch 115 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Specify revocable customer-authorized sharing without presuming an open-banking mandate or unauthorized third-party data access.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `consent_id` | `uuid` | controlled grant |
| `institution_id` | `uuid` | bank controller |
| `customer_id` | `uuid` | authenticated owner |
| `partner_id` | `uuid` | validated recipient |
| `scope_refs` | `list` | per-account read/service permissions |
| `purpose_code` | `string` | stated use |
| `granted_at` | `datetime` | verified action |
| `expires_at` | `datetime` | bounded validity |
| `consent_state` | `enum` | pending/active/revoked/expired |
| `policy_version` | `string` | approved legal basis |

## Workflow and recovery design
1. Validate that data-sharing activity is legally and institutionally permitted.
2. Authenticate customer and verify bank-account resource ownership.
3. Display specific recipient, purpose, scope and expiry without dark patterns.
4. Record versioned affirmative authorization with scoped token issuance.
5. Enforce resource/action and consent validity on every data access.
6. Revoke promptly and retain lawful evidence without allowing continued use.

## Invariants and enforcement requirements
1. **CHN-015-R01** Possession of API client credentials is not customer authorization.
2. **CHN-015-R02** Consent is optional where legally applicable and distinct from mandatory KYC processing.
3. **CHN-015-R03** Partner access cannot exceed approved account and purpose scope.
4. **CHN-015-R04** Revocation blocks future requests and downstream token usage.
5. **CHN-015-R05** Data minimization and retention rules apply to recipients.
6. **CHN-015-R06** Consent to view balances does not authorize initiating payment.
7. **CHN-015-R07** Unconfirmed regulatory framework leaves production capability disabled.

## Acceptance and negative scenarios — planned, not run
- [ ] **CHN-015-T01** Revoked consent rejects next API call.
- [ ] **CHN-015-T02** Consent for one account cannot retrieve another.
- [ ] **CHN-015-T03** Expired scope rejected.
- [ ] **CHN-015-T04** Partner receives no excess personal data.
- [ ] **CHN-015-T05** Changed purpose requires new authorization.

## Dependency and reviewer gate
Verified current institution/jurisdiction data-sharing rules, partner agreements, privacy and security acceptance.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
