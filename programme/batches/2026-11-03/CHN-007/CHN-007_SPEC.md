# CHN-007 — Retail payment initiation and confirmation journey

OPES Core Banking | Checkpoint batch 107 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Specify a transaction journey that preserves consent, value accuracy, authorized signatories, idempotency and externally evidenced completion.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `payment_draft_id` | `uuid` | prepared instruction |
| `institution_id` | `uuid` | customer bank |
| `source_account_id` | `uuid` | authorized debit account |
| `beneficiary_ref` | `uuid` | reviewed recipient |
| `amount_minor` | `string` | exact currency amount |
| `purpose_code` | `string` | approved transfer purpose |
| `confirmation_digest` | `string` | immutable authorization payload |
| `challenge_ref` | `uuid|null` | step-up evidence |
| `command_id` | `string` | idempotent send key |
| `status` | `enum` | draft/pending/unknown/settled/rejected |

## Workflow and recovery design
1. Select authorized source, recipient and amount with transparent fee quote.
2. Validate account state, limits, mandate and beneficiary requirements server-side.
3. Show complete recipient, currency, amount, estimated charges and transfer type.
4. Collect authorized confirmation and step-up tied to the immutable request digest.
5. Submit a single idempotent payment command through approved payments domain.
6. Show distinct ACK, processing, outcome-unknown, settled and reconciled states.

## Invariants and enforcement requirements
1. **CHN-007-R01** Client may not label transport ACK as settled funds.
2. **CHN-007-R02** Repeated confirmation uses original command identity, never duplicates debit.
3. **CHN-007-R03** Quoted fees and applied fees must reference approved schedule.
4. **CHN-007-R04** Unknown external outcome cannot be blindly resubmitted.
5. **CHN-007-R05** Disputed rail/participation evidence means capability disabled.
6. **CHN-007-R06** Beneficiary modification invalidates prior confirmation.
7. **CHN-007-R07** Original posted journal remains immutable even when returned/reversed.

## Acceptance and negative scenarios — planned, not run
- [ ] **CHN-007-T01** Two taps on confirmation cause one command.
- [ ] **CHN-007-T02** Changing recipient after challenge invalidates approval.
- [ ] **CHN-007-T03** Pending transfer not displayed as final settlement.
- [ ] **CHN-007-T04** Wrong tenant beneficiary ref denied.
- [ ] **CHN-007-T05** External timeout enters unknown outcome with trace.

## Dependency and reviewer gate
Institution-approved rail participation, payment APIs, CFO ledger mapping, customer mandate and actual transaction tests.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
