# CHN-010 — Customer notifications, receipts and communication provenance

OPES Core Banking | Checkpoint batch 110 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Deliver useful account notifications without treating channels as authoritative sources of payment status or exposing private data.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `notification_id` | `uuid` | message event |
| `institution_id` | `uuid` | bank controller |
| `customer_id` | `uuid` | recipient |
| `template_version` | `string` | approved communication |
| `event_ref` | `uuid` | source business event |
| `channel` | `enum` | app/email/sms/inbox |
| `delivery_state` | `enum` | queued/sent/failed/unknown |
| `delivery_attempt_id` | `uuid` | retry identity |
| `sensitivity_class` | `string` | PII exposure control |
| `receipt_ref` | `uuid|null` | authoritative source proof |

## Workflow and recovery design
1. Consume authorized domain event with stable event ID.
2. Resolve recipient preference, lawful purpose and approved localized template.
3. Sanitize payload to minimum needed content for chosen channel.
4. Dispatch through controlled provider without asserting delivery from request submission.
5. Track provider acceptance, actual delivery evidence and failure separately.
6. Link customer receipt to authoritative bank transaction and correction history.

## Invariants and enforcement requirements
1. **CHN-010-R01** Push or SMS delivery does not prove funds have settled.
2. **CHN-010-R02** Do not include passwords, full account numbers or identity scans in notifications.
3. **CHN-010-R03** Notification retries cannot trigger financial transactions.
4. **CHN-010-R04** Marketing messages require separate lawful preference controls.
5. **CHN-010-R05** Sensitive events must not leak across users or institutions.
6. **CHN-010-R06** Template and language versions remain audit reconstructable.
7. **CHN-010-R07** Provider failure leaves financial source event unchanged.

## Acceptance and negative scenarios — planned, not run
- [ ] **CHN-010-T01** Duplicate event yields one logical notification.
- [ ] **CHN-010-T02** Provider ACK not treated as delivered.
- [ ] **CHN-010-T03** Cross-tenant recipient mapping denied.
- [ ] **CHN-010-T04** Revoked marketing preference suppresses optional message.
- [ ] **CHN-010-T05** Receipt reflects journal adjustment without altering original.

## Dependency and reviewer gate
Institution communication/privacy policy, event contracts, provider security and delivery/replay tests.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
