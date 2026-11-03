# BRN-011 — Branch dual control, delegation and high-value approvals

Batch 131 | OPES Core Banking | 2026-11-03 | DRAFT, REVIEW OPEN

## Purpose
Require distinct actors and time-bound delegated authority for high-risk teller and vault operations.

## Candidate data model
| Name | Type | Intent |
|---|---|---|
| `approval_id` | uuid | Decision identity |
| `institution_id` | uuid | Licensed owner |
| `branch_id` | uuid | Scope |
| `operation_ref` | uuid | Requested action |
| `maker_id` | string | Initiator |
| `checker_id` | string | Separate approver |
| `policy_version` | string | Approved delegation |
| `approval_digest` | string | Immutable request fingerprint |
| `expires_at` | datetime | Approval lifetime |
| `status` | string | Pending approved denied expired |

## State transitions and guards
1. PROPOSED>PENDING:maker requests
2. PENDING>APPROVED:qualified checker signs
3. PENDING>DENIED:checker declines
4. PENDING>EXPIRED:time window lapses
5. APPROVED>CONSUMED:single action executed

## Workflow and recovery
1. Authenticate maker and determine sensitive action class
2. Freeze request payload and derive approval fingerprint
3. Find a qualified independent checker under current branch policy
4. Verify mandate, expiry and segregation constraints
5. Consume approved token once and audit outcome

## Required controls
1. BRN-011-REQ-01: Self-approval always denied for dual-controlled operation
2. BRN-011-REQ-02: Supervisor role is scoped by branch and legal entity
3. BRN-011-REQ-03: Approval of one amount cannot authorize a changed amount
4. BRN-011-REQ-04: Expired mandate or approval cannot be reused
5. BRN-011-REQ-05: Break-glass grants need independent after-action review
6. BRN-011-REQ-06: Approvals are not a substitute for financial ledger controls

## Acceptance cases — NOT RUN
- [ ] BRN-011-T01: Same maker/checker rejected
- [ ] BRN-011-T02: Modified transaction digest rejected
- [ ] BRN-011-T03: Expired approval denied
- [ ] BRN-011-T04: Cross-branch supervisor denied
- [ ] BRN-011-T05: Repeated approval consumption rejected

## Evidence gate
Institution delegation schedule, RBAC/ABAC policy, signed reviewer roles and SoD access tests.

Code: none. Tests executed: zero. Independent review: pending. No regulatory certification. Historical accounting 312/322 and bank-specific rail participation P0s remain blocked.
