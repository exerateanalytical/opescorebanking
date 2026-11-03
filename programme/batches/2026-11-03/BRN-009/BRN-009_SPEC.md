# BRN-009 — Inter-branch cash transit and receipt evidence

Batch 129 | OPES Core Banking | 2026-11-03 | DRAFT, REVIEW OPEN

## Purpose
Track sealed cash in transit between approved branches with independent source, carrier and destination custody.

## Candidate data model
| Name | Type | Intent |
|---|---|---|
| `shipment_id` | uuid | Unique trip |
| `institution_id` | uuid | Owner bank |
| `source_branch_id` | uuid | Origin |
| `destination_branch_id` | uuid | Destination |
| `carrier_ref` | string | Contracted service |
| `manifest_ref` | uuid | Sealed denomination count |
| `released_at` | datetime | Custody handoff |
| `received_at` | datetime | Destination proof |
| `variance_ref` | uuid | Discrepancy case |

## State transitions and guards
1. PREPARED>APPROVED:security and treasury approve
2. APPROVED>DISPATCHED:source count signed
3. DISPATCHED>IN_TRANSIT:carrier receives
4. IN_TRANSIT>RECEIVED:independent receipt
5. IN_TRANSIT>DISPUTED:missing or mismatched cargo

## Workflow and recovery
1. Verify shipment authorization and legal entity
2. Document sealed denomination manifest and source count
3. Obtain carrier custody evidence before dispatch
4. Track source and destination as separate states
5. Reconcile destination count and retain discrepancies

## Required controls
1. BRN-009-REQ-01: Departure is never equivalent to destination receipt
2. BRN-009-REQ-02: In-transit cash is separately visible until evidenced
3. BRN-009-REQ-03: Shipment does not directly alter customer deposits
4. BRN-009-REQ-04: Approved carriers and insurance limits are institution-specific
5. BRN-009-REQ-05: Repeated receipt must not increase vault holdings twice
6. BRN-009-REQ-06: Missing seal proof blocks clean reconciliation

## Acceptance cases — NOT RUN
- [ ] BRN-009-T01: Duplicate receipt remains single movement
- [ ] BRN-009-T02: Wrong bank destination rejected
- [ ] BRN-009-T03: Missing carrier proof blocks dispatch
- [ ] BRN-009-T04: Tampered manifest forces dispute
- [ ] BRN-009-T05: Transit balance reconciles exact amount

## Evidence gate
Security/carrier authority, insured transit policy and dual-count source/destination evidence.

Code: none. Tests executed: zero. Independent review: pending. No regulatory certification. Historical accounting 312/322 and bank-specific rail participation P0s remain blocked.
