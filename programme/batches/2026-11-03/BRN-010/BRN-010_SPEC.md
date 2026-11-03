# BRN-010 — Vault replenishment and cash forecasting

Batch 130 | OPES Core Banking | 2026-11-03 | DRAFT, REVIEW OPEN

## Purpose
Separate forecast cash demand, supply authorization, cash arrival and ledger treatment.

## Candidate data model
| Name | Type | Intent |
|---|---|---|
| `replenishment_id` | uuid | Request identity |
| `institution_id` | uuid | Bank |
| `branch_id` | uuid | Stock location |
| `currency` | string | Cash unit |
| `forecast_horizon` | string | Period |
| `minimum_stock` | string | Approved floor |
| `maximum_stock` | string | Approved ceiling |
| `requested_amount` | string | Exact request |
| `approved_order_ref` | uuid | Independent authority |
| `received_manifest_ref` | uuid | Actual arrival |

## State transitions and guards
1. FORECAST>REVIEW:source evidence validated
2. REVIEW>AUTHORIZED:treasury security approval
3. AUTHORIZED>ORDERED:provider request
4. ORDERED>RECEIVED:physical count
5. ANY>EXCEPTION:delay or mismatch

## Workflow and recovery
1. Analyze counted cash demand and calendar pattern
2. Compare forecast range to physical safety constraints
3. Route replenishment for Treasury and Security approval
4. Track supplier shipment without assuming receipt
5. Record denominations only after independent arrival count

## Required controls
1. BRN-010-REQ-01: Forecast projection does not create physical funds
2. BRN-010-REQ-02: Supplier acknowledgment cannot count as cash received
3. BRN-010-REQ-03: Procurement caps must be approved by legal bank entity
4. BRN-010-REQ-04: Do not convert currency without approved FX source
5. BRN-010-REQ-05: Duplicate order response does not duplicate stock
6. BRN-010-REQ-06: Data quality gaps lead to an explicit uncertain forecast

## Acceptance cases — NOT RUN
- [ ] BRN-010-T01: Unapproved order blocked
- [ ] BRN-010-T02: Over-capacity request escalated
- [ ] BRN-010-T03: Provider ACK not recognized as receipt
- [ ] BRN-010-T04: Wrong-currency count rejected
- [ ] BRN-010-T05: Missing underlying demand data flagged

## Evidence gate
Institutional cash liquidity plan, procurement controls, verified supply contract and physical receipt tests.

Code: none. Tests executed: zero. Independent review: pending. No regulatory certification. Historical accounting 312/322 and bank-specific rail participation P0s remain blocked.
