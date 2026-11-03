# OPS-014 — Enterprise data governance and lineage controls

OPES Core Banking | Checkpoint batch 94 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Assign data ownership, quality, legal basis and full derivation lineage to regulated information without exposing cross-bank data.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `data_asset_id` | `string` | registered dataset |
| `institution_id` | `uuid` | owner/controller |
| `data_domain` | `string` | bounded context |
| `data_steward_role` | `string` | accountability |
| `classification` | `enum` | public/internal/restricted |
| `legal_basis_ref` | `uuid` | lawful basis |
| `schema_version` | `string` | published model |
| `lineage_sources` | `list` | upstream refs |
| `retention_policy_ref` | `string` | approved lifecycle |
| `quality_rule_refs` | `list` | enforced checks |

## Workflow and recovery design
1. Inventory canonical customer, account, ledger, payments and audit data.
2. Assign legal entity, domain owner, steward and access policy.
3. Trace transformations between source, event and report projections.
4. Define precision, completeness, uniqueness and timeliness controls.
5. Approve retention/residency and permitted downstream uses.
6. Audit all exceptional access and produce reproducible lineage exports.

## Invariants and enforcement requirements
1. **OPS-014-R01** Reports must disclose source snapshot and rule version.
2. **OPS-014-R02** A projection cannot become an alternate financial book.
3. **OPS-014-R03** Cross-institution joins deny unauthorized data.
4. **OPS-014-R04** Personal data usage limited to approved purpose.
5. **OPS-014-R05** Lineage must survive source version and schema evolution.
6. **OPS-014-R06** Data correction preserves financial and audit history.
7. **OPS-014-R07** Unknown regulatory retention rules remain awaiting review.

## Acceptance and negative scenarios — planned, not run
- [ ] **OPS-014-T01** Report line traces to source journal and version.
- [ ] **OPS-014-T02** Cross-tenant lineage access denied.
- [ ] **OPS-014-T03** Unattributed derived KPI fails quality gate.
- [ ] **OPS-014-T04** Expired purpose suppresses optional analytics.
- [ ] **OPS-014-T05** Schema change invalidates incompatible projection until migration.

## Dependency and reviewer gate
Approved data ownership, local privacy/regulatory interpretation and executable lineage/access tests.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
