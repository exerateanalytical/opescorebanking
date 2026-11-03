# CHN-018 — Offline, intermittent network and retry-safe channel behavior

OPES Core Banking | Checkpoint batch 118 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Allow limited offline viewing and draft preparation without permitting unsupported local banking commitments or duplicate money effects.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `offline_session_id` | `uuid` | device context |
| `institution_id` | `uuid` | bank scope |
| `device_binding_ref` | `uuid` | authorized installation |
| `cached_snapshot_ref` | `string|null` | last source cursor |
| `snapshot_age_seconds` | `integer` | freshness |
| `draft_command_id` | `string` | client provisional ID |
| `sync_state` | `enum` | offline/queued/validating/submitted/rejected |
| `server_receipt_ref` | `uuid|null` | authoritative ack |
| `network_state` | `enum` | available/degraded/unavailable |

## Workflow and recovery design
1. Detect connection loss and display source freshness explicitly.
2. Protect or purge restricted cached data per risk and legal policy.
3. Permit only approved local draft/nonfinancial operations.
4. On reconnect, reauthenticate, reauthorize, reprice and revalidate drafts.
5. Assign stable idempotency identity before server submission.
6. Display confirmed server outcome separately from local queue or transport response.

## Invariants and enforcement requirements
1. **CHN-018-R01** Offline draft never changes authoritative account balance.
2. **CHN-018-R02** Cached transfer confirmation cannot bypass step-up after reconnect.
3. **CHN-018-R03** A queued request is not an accepted bank payment.
4. **CHN-018-R04** No automatic replay on unknown external settlement outcome.
5. **CHN-018-R05** Sensitive storage and credentials remain under institution device controls.
6. **CHN-018-R06** Resubmission must use one stable financial command ID.
7. **CHN-018-R07** Stale exchange rates/fees require fresh approved quote before authorization.

## Acceptance and negative scenarios — planned, not run
- [ ] **CHN-018-T01** Offline draft not shown as completed transfer.
- [ ] **CHN-018-T02** Reconnect double-submit remains one request.
- [ ] **CHN-018-T03** Expired session forces renewed authentication.
- [ ] **CHN-018-T04** Stale fee quote cannot silently execute.
- [ ] **CHN-018-T05** Unresolved external response is not retried blindly.

## Dependency and reviewer gate
Bank offline/device policy, payment domain idempotency and executed network-fault tests.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
