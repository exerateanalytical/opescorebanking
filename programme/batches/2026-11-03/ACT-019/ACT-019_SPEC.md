# ACT-019 — Account exceptions, correction and end-of-day dependencies

**OPES Core Banking | Batch 79/90 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Objective and boundary
Specify error recovery and end-of-day interaction without altering posted journals or accepting unknown external outcomes.

## Candidate record and API fields
| Field | Type | Meaning |
|---|---|---|
| `exception_case_id` | `uuid` | operational case |
| `account_id` | `uuid` | affected contract |
| `institution_id` | `uuid` | owner |
| `exception_type` | `enum` | pending/mismatch/hold/conflict/reversal |
| `source_command_ref` | `uuid` | origin |
| `ledger_journal_ref` | `uuid|null` | posted evidence |
| `external_state` | `string|null` | payment status |
| `assigned_owner` | `string` | operations role |
| `recovery_state` | `enum` | investigating/reconciled/escalated/closed |
| `resolution_ref` | `uuid|null` | independent proof |

## Lifecycle workflow
1. Classify account/ledger/rail mismatch or failed workflow.
2. Preserve source command, journal and external evidence.
3. Quarantine uncertain debits or credits under safe restrictions.
4. Reconcile independently with cash/ledger/rail records.
5. Create authorized correction journal only where financial effect required.
6. Close case with reviewer and immutable root-cause evidence.

## Requirements and financial invariants
1. **ACT-019-REQ-01** Never silently retry unknown external settlement outcome.
2. **ACT-019-REQ-02** Exception closure requires independent financial evidence.
3. **ACT-019-REQ-03** Technical timeout does not imply payment or deposit failed.
4. **ACT-019-REQ-04** Do not remove account hold solely to clear EOD backlog.
5. **ACT-019-REQ-05** Corrections are new balanced financial operations.
6. **ACT-019-REQ-06** End-of-day completion cannot conceal suspense or mismatch.

## Acceptance tests — NOT EXECUTED
- [ ] **ACT-019-T01** Unknown outcome remains unresolved after restart.
- [ ] **ACT-019-T02** Correction cannot mutate original journal.
- [ ] **ACT-019-T03** Duplicate exception intake merges by source reference.
- [ ] **ACT-019-T04** EOD report includes unreconciled exceptions.
- [ ] **ACT-019-T05** Cross-institution exception read denied.

## Acceptance and independent review gate
Operations/CFO reconciliations, approved exception SOP and fault-test evidence.

Status: design specification, not operational banking software. Production code: 0. Executed tests: 0. Independent approvals: NONE. Original posted journals, externally evidenced settlement and current regulatory rules are not overridden. Current inherited WP-ACC-005 P0 COBAC 312/322 remains unresolved.
