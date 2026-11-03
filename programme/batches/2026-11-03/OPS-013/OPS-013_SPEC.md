# OPS-013 — Core banking legacy migration and reconciliation protocol

OPES Core Banking | Checkpoint batch 93 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Migrate authorized accounts, customers and historical transactions through quarantined stages with zero unaccounted money movement.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `migration_run_id` | `uuid` | run identity |
| `source_system_id` | `string` | legacy origin |
| `institution_id` | `uuid` | target entity |
| `source_snapshot_digest` | `string` | measured data proof |
| `mapping_version` | `string` | approved transformation rules |
| `record_count` | `integer` | reconcilable total |
| `debit_total` | `string` | exact source debit sum |
| `credit_total` | `string` | exact source credit sum |
| `exception_register_ref` | `uuid` | unresolved cases |
| `approver_ref` | `uuid` | cutover authority |

## Workflow and recovery design
1. Acquire lawfully permitted source snapshot and lineage inventory.
2. Define deterministic IDs, encoding, date, product and accounting crosswalks.
3. Validate schema, identity links and effective rule versions in dry run.
4. Compare source-to-target record counts and exact monetary control totals.
5. Quarantine unmatched/ambiguous accounts and obtain independent remediation.
6. Cut over only after authorized trial balance and operational sign-off.

## Invariants and enforcement requirements
1. **OPS-013-R01** No guessed 312/322 PCEC mapping in conversion.
2. **OPS-013-R02** Never overwrite historical posting to make totals balance.
3. **OPS-013-R03** Record original source bytes/hashes when actually obtained.
4. **OPS-013-R04** A duplicate migration attempt must not double-credit accounts.
5. **OPS-013-R05** Source/target disagreement fails the affected cutover.
6. **OPS-013-R06** Customer identity and legal mandates retain provenance.
7. **OPS-013-R07** Cutover time and reversible technical operations are separately recorded.

## Acceptance and negative scenarios — planned, not run
- [ ] **OPS-013-T01** Duplicate source row cannot create duplicate funds.
- [ ] **OPS-013-T02** Unmapped account classification blocks cutover.
- [ ] **OPS-013-T03** Debit/credit totals exact within approved currency model.
- [ ] **OPS-013-T04** Orphan mandate triggers exception.
- [ ] **OPS-013-T05** Restored rehearsal preserves source-to-target audit references.

## Dependency and reviewer gate
Authentic source data access, reviewed PCEC mapping, CFO/accounting acceptance and executed dry-run reconciliation.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
