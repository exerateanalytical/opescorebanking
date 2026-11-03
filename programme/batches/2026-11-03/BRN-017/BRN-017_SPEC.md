# BRN-017 — Noncash branch service cases, queues and controlled fulfillment

Batch 137 | OPES Core Banking | 2026-11-03 | DRAFT, REVIEW OPEN

## Purpose
Structure customer requests for account maintenance, documents, disputes and service support without bypassing backend mandate and privacy checks.

## Candidate data model
| Name | Type | Intent |
|---|---|---|
| `service_case_id` | uuid | Service request |
| `institution_id` | uuid | Bank owner |
| `branch_id` | uuid | Office |
| `customer_id` | uuid | Authorized customer |
| `service_code` | string | Approved request type |
| `queue_ticket_id` | string | Branch queue |
| `assigned_staff_id` | string | Responsible actor |
| `evidence_refs` | array | Restricted attachments |
| `status` | string | Queued in_progress review fulfilled |

## State transitions and guards
1. QUEUED>IN_PROGRESS:staff assigned
2. IN_PROGRESS>REVIEW:restricted action requires approval
3. REVIEW>FULFILLED:authorized change recorded
4. IN_PROGRESS>EXCEPTION:missing evidence
5. ANY>CANCELLED:customer or policy withdrawal

## Workflow and recovery
1. Authenticate requestor and validate customer relationship
2. Classify service and determine required authorization
3. Assign queue and preserve document confidentiality
4. Execute backend commands only after allowed mandate and review
5. Deliver document/status result with auditable case closure

## Required controls
1. BRN-017-REQ-01: Queue ticket does not authorize account or identity changes
2. BRN-017-REQ-02: Sensitive customer data is not visible to other queued users
3. BRN-017-REQ-03: No teller can modify KYC evidence without controlled event
4. BRN-017-REQ-04: Branch staff scope is limited to allowed entity and service
5. BRN-017-REQ-05: Customer service fulfillment cannot post financial journal directly
6. BRN-017-REQ-06: SLA values are institution-approved and never guessed

## Acceptance cases — NOT RUN
- [ ] BRN-017-T01: Cross-tenant service case denied
- [ ] BRN-017-T02: Unauthorized identity change blocked
- [ ] BRN-017-T03: Queue replay is idempotent
- [ ] BRN-017-T04: Missing document creates review
- [ ] BRN-017-T05: Closed case retains audit history

## Evidence gate
Institution branch services policy, CIF authorization and actual document/privacy testing.

Code: none. Tests executed: zero. Independent review: pending. No regulatory certification. Historical accounting 312/322 and bank-specific rail participation P0s remain blocked.
