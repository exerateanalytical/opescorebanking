# ACT-013 — Dormancy, reactivation and unclaimed balance policy

**OPES Core Banking | Batch 73/90 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Objective and boundary
Specify evidence-backed dormant account classification and reactivation without guessing statutory inactivity thresholds.

## Candidate record and API fields
| Field | Type | Meaning |
|---|---|---|
| `dormancy_case_id` | `uuid` | review case |
| `account_id` | `uuid` | target account |
| `institution_id` | `uuid` | legal profile |
| `last_qualifying_activity_at` | `datetime` | policy-qualified event |
| `dormancy_rule_version` | `string` | effective rule |
| `classification_state` | `enum` | active/candidate/dormant/restricted |
| `customer_notice_ref` | `uuid|null` | notice proof |
| `reactivation_identity_ref` | `uuid|null` | reviewed identity |
| `decision_actor` | `string` | authorized reviewer |
| `effective_at` | `datetime` | status decision |

## Lifecycle workflow
1. Load institution-approved dormancy policy and exclusions.
2. Compute candidate inactivity from authoritative qualifying events.
3. Notify and review account for restrictions/legal holds.
4. Activate dormant state only after approved policy checks.
5. Require identity, mandate and risk reevaluation before reactivation.
6. Preserve financial obligations, balances and regulatory records.

## Requirements and financial invariants
1. **ACT-013-REQ-01** Dormancy does not confiscate funds.
2. **ACT-013-REQ-02** No universal inactivity duration is assumed.
3. **ACT-013-REQ-03** Reactivation requires effective mandate and risk checks.
4. **ACT-013-REQ-04** Dormancy state alone cannot produce balancing ledger entries.
5. **ACT-013-REQ-05** Legal unclaimed-property treatment is jurisdiction-qualified.
6. **ACT-013-REQ-06** Retain history of customer notices and decisions.

## Acceptance tests — NOT EXECUTED
- [ ] **ACT-013-T01** Excluded transaction does not reset clock.
- [ ] **ACT-013-T02** Unapproved threshold cannot classify account.
- [ ] **ACT-013-T03** Dormant account cannot bypass restrictions through API.
- [ ] **ACT-013-T04** Reactivation without identity check fails.
- [ ] **ACT-013-T05** Balance unchanged on status-only transition.

## Acceptance and independent review gate
Bank dormancy and unclaimed-property policy, signed jurisdictional sources, compliance review.

Status: design specification, not operational banking software. Production code: 0. Executed tests: 0. Independent approvals: NONE. Original posted journals, externally evidenced settlement and current regulatory rules are not overridden. Current inherited WP-ACC-005 P0 COBAC 312/322 remains unresolved.
