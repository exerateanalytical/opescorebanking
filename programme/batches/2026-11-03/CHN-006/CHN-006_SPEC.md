# CHN-006 — Account home, balances and transaction feed freshness

OPES Core Banking | Checkpoint batch 106 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Provide readable account summaries from source-linked projections while accurately communicating pending activity and data freshness.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `dashboard_request_id` | `uuid` | view trace |
| `institution_id` | `uuid` | bank |
| `account_scope` | `list` | authorized account refs |
| `source_ledger_cursor` | `string` | source snapshot |
| `projection_updated_at` | `datetime` | last refresh |
| `posted_balance` | `string` | source-backed amount |
| `available_balance` | `string` | policy-derived amount |
| `pending_activity_count` | `integer` | unfinalized items |
| `currency` | `string` | account denomination |
| `data_state` | `enum` | current/stale/unavailable |

## Workflow and recovery design
1. Resolve authorized customer and selected account scopes.
2. Fetch source-linked ledger balances and account restrictions.
3. Separate posted movements, pending card/payment/deposit items and reservations.
4. Show last-updated timestamp and explicit stale/unavailable errors.
5. Offer filtered accessible history without merging currencies.
6. Escalate source/reconciliation inconsistencies rather than displaying fabricated zero.

## Invariants and enforcement requirements
1. **CHN-006-R01** Projection data is never a secondary system-of-record ledger.
2. **CHN-006-R02** No account belonging to another institution appears in results.
3. **CHN-006-R03** A pending incoming transfer cannot inflate posted balance without evidence.
4. **CHN-006-R04** Account currency and decimal formatting are consistent and localized.
5. **CHN-006-R05** Read caching declares freshness and obeys privacy/expiry policy.
6. **CHN-006-R06** A reversed journal displays correction rather than vanishing.
7. **CHN-006-R07** High-contrast, accessible text must remain readable at mobile sizes.

## Acceptance and negative scenarios — planned, not run
- [ ] **CHN-006-T01** Stale snapshot visibly marked.
- [ ] **CHN-006-T02** Cross-account filter does not leak private transactions.
- [ ] **CHN-006-T03** Pending credit not counted as posted.
- [ ] **CHN-006-T04** Original and reversal both visible.
- [ ] **CHN-006-T05** Unavailable source avoids false zero balance.

## Dependency and reviewer gate
Approved account/ledger read API, privacy review and actual usability/integration testing.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
