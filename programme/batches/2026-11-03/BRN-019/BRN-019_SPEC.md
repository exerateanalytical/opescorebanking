# BRN-019 — Branch connectivity outage, offline restrictions and safe restart

Batch 139 | OPES Core Banking | 2026-11-03 | DRAFT, REVIEW OPEN

## Purpose
Define fail-closed teller behavior under intermittent network power or core service outages without invented bank postings.

## Candidate data model
| Name | Type | Intent |
|---|---|---|
| `outage_case_id` | uuid | Incident |
| `institution_id` | uuid | Bank owner |
| `branch_id` | uuid | Site |
| `terminal_id` | string | Registered terminal |
| `last_sync_cursor` | string | Source checkpoint |
| `offline_draft_id` | string | Provisional request |
| `network_state` | string | Connected degraded offline |
| `authorization_state` | string | Unknown verified expired |
| `reconnect_at` | datetime | Restoration |
| `recovery_ref` | uuid | Reconciliation evidence |

## State transitions and guards
1. ONLINE>DEGRADED:intermittent service
2. DEGRADED>OFFLINE:no trusted connection
3. OFFLINE>RECONNECTING:service returns
4. RECONNECTING>ONLINE:session and source validated
5. ANY>QUARANTINED:unknown money outcome

## Workflow and recovery
1. Detect loss and freeze bank operations requiring authoritative real-time checks
2. Keep encrypted local nonfinancial drafts only under approved policy
3. Display explicit pending/unknown state for unconfirmed money requests
4. Reauthenticate and validate teller role and cash session on reconnection
5. Reconcile posted commands and outstanding cash exceptions before resuming

## Required controls
1. BRN-019-REQ-01: Offline cash request cannot claim completed ledger posting
2. BRN-019-REQ-02: No blind replay of uncertain financial commands
3. BRN-019-REQ-03: Cached balance is not an authorization to pay cash
4. BRN-019-REQ-04: Teller credentials and customer PII must remain protected at terminal
5. BRN-019-REQ-05: Shift cutoff and cash custody exceptions survive restart
6. BRN-019-REQ-06: Offline operation type requires explicit bank risk approval

## Acceptance cases — NOT RUN
- [ ] BRN-019-T01: Disconnect during posting yields unknown not success
- [ ] BRN-019-T02: Reconnect retries use original command ID
- [ ] BRN-019-T03: Offline cash withdrawal prevented by default
- [ ] BRN-019-T04: Expired session requires new authentication
- [ ] BRN-019-T05: Cash variance survives restart

## Evidence gate
Bank-approved offline scope, security risk assessment, fault injection and funds reconciliation.

Code: none. Tests executed: zero. Independent review: pending. No regulatory certification. Historical accounting 312/322 and bank-specific rail participation P0s remain blocked.
