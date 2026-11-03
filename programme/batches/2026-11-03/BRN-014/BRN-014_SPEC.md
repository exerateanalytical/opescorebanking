# BRN-014 — Cash receipts, counter customer proof and reconciliation

Batch 134 | OPES Core Banking | 2026-11-03 | DRAFT, REVIEW OPEN

## Purpose
Give customers accurately labelled transaction receipts linked to source cash custody and posted financial evidence.

## Candidate data model
| Name | Type | Intent |
|---|---|---|
| `receipt_id` | uuid | Logical receipt identity |
| `institution_id` | uuid | Bank owner |
| `branch_id` | uuid | Counter location |
| `operation_id` | uuid | Original teller operation |
| `customer_ref` | uuid | Authorized recipient |
| `cash_handover_ref` | uuid | Physical custody |
| `journal_ref` | uuid | Ledger evidence if posted |
| `receipt_status` | string | Pending confirmed corrected |
| `issued_at` | datetime | Rendering timestamp |
| `template_version` | string | Controlled format |

## State transitions and guards
1. PREPARED>PENDING:cash recorded but posting pending
2. PENDING>CONFIRMED:ledger and cash reconciled
3. PENDING>EXCEPTION:posting uncertain
4. CONFIRMED>CORRECTED:new adjustment referenced
5. ANY>VOIDED:unissued draft only

## Workflow and recovery
1. Capture teller operation, cash movement and institution scope
2. Obtain authoritative journal/posting result where financial service completed
3. Render amount, currency, account masked reference and transaction status
4. Present print/QR/digital receipt with protected access and watermark/provenance
5. Reconcile receipt archive against transaction and correction history

## Required controls
1. BRN-014-REQ-01: A receipt from a printer is not proof of settled external funds
2. BRN-014-REQ-02: Pending deposit must never print as fully credited
3. BRN-014-REQ-03: Printing twice does not create a second payment or cash movement
4. BRN-014-REQ-04: Receipts must not expose full secret identity/account values
5. BRN-014-REQ-05: Original receipt is preserved when a correction occurs
6. BRN-014-REQ-06: Branch document template and numbering are controlled

## Acceptance cases — NOT RUN
- [ ] BRN-014-T01: Duplicate print uses same receipt number
- [ ] BRN-014-T02: Unposted transaction displays pending
- [ ] BRN-014-T03: Correction receipt references original
- [ ] BRN-014-T04: Wrong customer cannot retrieve receipt
- [ ] BRN-014-T05: Exact money amount matches source

## Evidence gate
Bank receipt legal fields and localization, approved journal/custody link and print/security tests.

Code: none. Tests executed: zero. Independent review: pending. No regulatory certification. Historical accounting 312/322 and bank-specific rail participation P0s remain blocked.
