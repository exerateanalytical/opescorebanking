# BRN-001 — Branch hierarchy, licensing scope and service catalogue

**OPES Core Banking — Execution batch 121/150**

**State:** DRAFT DELIVERED / INDEPENDENT ACCEPTANCE OPEN. Date: 2026-11-03. This is a provisional work-package slot, not verified historical completion.

## Bounded-context objective
Define branch/office relationships and prevent service capability from exceeding the deploying bank's verified institutional authorization.

## Proposed resource contract
| Field | Type | Purpose |
|---|---|---|
| `branch_id` | `uuid` | Stable internal branch |
| `institution_id` | `uuid` | Licensed operating entity |
| `branch_code` | `string` | Unique within institution |
| `parent_branch_id` | `uuid` | Optional supervisory branch |
| `territory_code` | `string` | Jurisdiction region |
| `service_capabilities` | `array` | Approved operations |
| `operating_calendar_ref` | `string` | Effective business calendar |
| `approval_evidence_ref` | `uuid` | Competent institution review |
| `status` | `string` | Draft active suspended retired |

## Guarded states
1. `DRAFT>REVIEW` — complete entity scope
2. `REVIEW>ACTIVE` — independent institution approval
3. `ACTIVE>SUSPENDED` — license or operations hold
4. `SUSPENDED>ACTIVE` — renewed approval
5. `ACTIVE>RETIRED` — no open obligations

## Lifecycle / happy-path and recovery controls
1. Register a branch with canonical entity and geographic identifiers.
2. Attach verified institution licensing and branch service authority evidence.
3. Define cashier, manager, vault and customer service capabilities.
4. Review operating calendar, branch and security ownership.
5. Activate only approved services with effective interval.
6. Monitor authorization changes without rewriting past transactions.

## Domain invariants
1. **BRN-001-R01** A branch cannot use another institution's accounts or settlement identity.
2. **BRN-001-R02** Opening a branch record does not establish a government license.
3. **BRN-001-R03** Branch closure requires custody, customer, cash and transaction reconciliation.
4. **BRN-001-R04** Service catalog has explicit effective-dated authorization.
5. **BRN-001-R05** A disabled branch rejects new money-moving commands.

## Acceptance cases — NONE EXECUTED
- [ ] **BRN-001-TEST-01** Cross-bank branch scope rejected.
- [ ] **BRN-001-TEST-02** Branch without approval remains inactive.
- [ ] **BRN-001-TEST-03** Retirement with open cash session refused.
- [ ] **BRN-001-TEST-04** Suspended branch teller request denied.
- [ ] **BRN-001-TEST-05** Historic operations retain original branch identifier.

## Evidence and release gate
Institution-specific branch permissions, legal confirmation, operations approval.

**Safety:** no source-control ZIP can certify regulatory, financial, security or production readiness. Inherited WP-ACC-005 COBAC I-2015/01 312/322 P0 remains blocked, as do institution-specific settlement entitlement checks. This package documents proposed controls only; code: NOT IMPLEMENTED, tests: NOT RUN, independent sign-offs: ABSENT.
