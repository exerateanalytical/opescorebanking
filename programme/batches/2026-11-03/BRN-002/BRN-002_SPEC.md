# BRN-002 — Teller identities, shift assignment and entitlement lifecycle

**OPES Core Banking — Execution batch 122/150**

**State:** DRAFT DELIVERED / INDEPENDENT ACCEPTANCE OPEN. Date: 2026-11-03. This is a provisional work-package slot, not verified historical completion.

## Bounded-context objective
Specify controlled teller identity, branch/shift membership and command-scoped permissions.

## Proposed resource contract
| Field | Type | Purpose |
|---|---|---|
| `teller_id` | `uuid` | User-to-teller stable identifier |
| `institution_id` | `uuid` | Tenant ownership |
| `branch_id` | `uuid` | Assigned branch |
| `shift_id` | `uuid` | Active authorized shift |
| `role_policy_version` | `string` | Effective teller role |
| `cash_drawer_id` | `uuid` | Assigned physical custody |
| `session_status` | `string` | Scheduled active suspended closed |
| `start_at` | `datetime` | Shift activation |
| `checker_id` | `string` | Independent supervisor |

## Guarded states
1. `SCHEDULED>AUTHORIZED` — manager approval
2. `AUTHORIZED>ACTIVE` — login and drawer handover
3. `ACTIVE>SUSPENDED` — security or cash exception
4. `ACTIVE>CLOSING` — cash count starts
5. `CLOSING>CLOSED` — verified settlement

## Lifecycle / happy-path and recovery controls
1. Verify staff identity and specific branch employment authority.
2. Approve teller shift and segregate conflicting supervisory rights.
3. Record physical drawer assignment and opening custody.
4. Grant only transaction operations approved for shift.
5. Monitor concurrent sessions and privilege changes.
6. Close shift after cash balance and independent verification.

## Domain invariants
1. **BRN-002-R01** No teller self-approval for restricted cash operations.
2. **BRN-002-R02** Shift token cannot authenticate a different branch.
3. **BRN-002-R03** One physical drawer has one accountable custodian per interval.
4. **BRN-002-R04** Expired shift cannot initiate further transactions.
5. **BRN-002-R05** Staff role revocation prevents further actions despite prior login.

## Acceptance cases — NONE EXECUTED
- [ ] **BRN-002-TEST-01** Cross-branch login action denied.
- [ ] **BRN-002-TEST-02** Concurrent conflicting custodians rejected.
- [ ] **BRN-002-TEST-03** Closed shift command denied.
- [ ] **BRN-002-TEST-04** Supervisor cannot approve their own disputed cash count.
- [ ] **BRN-002-TEST-05** Role revocation blocks next command.

## Evidence and release gate
Bank HR/IAM roster, teller delegation matrix, operations controls and executable access tests.

**Safety:** no source-control ZIP can certify regulatory, financial, security or production readiness. Inherited WP-ACC-005 COBAC I-2015/01 312/322 P0 remains blocked, as do institution-specific settlement entitlement checks. This package documents proposed controls only; code: NOT IMPLEMENTED, tests: NOT RUN, independent sign-offs: ABSENT.
