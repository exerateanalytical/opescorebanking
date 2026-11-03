# OPS-012 — Production change, release authorization and rollback

OPES Core Banking | Checkpoint batch 92 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Constrain deployments and configuration changes through risk-rated approval and financial rollback semantics.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `change_id` | `uuid` | controlled request |
| `institution_id` | `uuid` | target entity |
| `release_digest` | `string` | immutable build identifier |
| `change_class` | `enum` | standard/major/emergency |
| `risk_impact_ref` | `uuid` | assessment |
| `affected_domains` | `list` | bounded contexts |
| `deployment_window` | `string` | approved schedule |
| `maker_id` | `string` | change proposer |
| `checker_ids` | `list` | independent approvals |
| `rollback_plan_ref` | `uuid` | recovery plan |

## Workflow and recovery design
1. Link scope change to approved requirement and ADR.
2. Assess banking, privacy, security, reporting and integration impacts.
3. Verify actual tests, migration compatibility and deployment artifact hash.
4. Obtain independent risk-based approvals and production window.
5. Deploy canary or staged rollout with reconciliation/health monitoring.
6. Suspend or compensate safely and publish post-change evidence.

## Invariants and enforcement requirements
1. **OPS-012-R01** No approval is inferred from merge or ZIP upload.
2. **OPS-012-R02** Changing finance policy requires independent CFO acceptance.
3. **OPS-012-R03** Rollback cannot erase a posted journal or settled external operation.
4. **OPS-012-R04** Emergency changes have bounded privileges and retrospective review.
5. **OPS-012-R05** Configuration and source changes carry exact effective date/version.
6. **OPS-012-R06** Release cannot use untested binary or wrong institution credentials.
7. **OPS-012-R07** Every material change has immutable before/after audit.

## Acceptance and negative scenarios — planned, not run
- [ ] **OPS-012-T01** Reject production change without signed role approvals.
- [ ] **OPS-012-T02** Wrong release digest blocked.
- [ ] **OPS-012-T03** Failed reconciliation prevents further promotion.
- [ ] **OPS-012-T04** Emergency role expires automatically.
- [ ] **OPS-012-T05** Post-deploy rollback does not mutate financial history.

## Dependency and reviewer gate
Approved change board, trusted build chain and executed release/recovery rehearsals.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
