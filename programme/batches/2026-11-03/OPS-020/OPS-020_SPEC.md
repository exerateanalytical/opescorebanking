# OPS-020 — Operations and security release readiness dossier

OPES Core Banking | Checkpoint batch 100 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Create a cross-functional acceptance register for OPS-001 through OPS-019 with evidence-based status and explicit production gates.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `readiness_pack_id` | `uuid` | review dossier |
| `institution_id` | `uuid` | target bank |
| `package_refs` | `list` | OPS-001..OPS-019 |
| `deployment_profile_ref` | `string` | infrastructure scope |
| `security_review_refs` | `list` | CISO evidence |
| `test_execution_refs` | `list` | actual test logs |
| `restore_evidence_ref` | `uuid|null` | DR proof |
| `finance_recon_ref` | `uuid|null` | CFO signoff |
| `open_p0` | `list` | unresolved blockers |
| `decision_state` | `enum` | draft/blocked/review/accepted |

## Workflow and recovery design
1. Cross-index all operations draft packages and historical platform decisions.
2. Request exact executed controls for CI/CD, secrets, network and backup.
3. Review security threats, roles, tenancy and regulator/data residency applicability.
4. Perform independent restore, outage, performance and reconciliation exercises.
5. Attach signed reviewer decisions and unresolved exception register.
6. Approve only safe bounded capabilities with complete DoR evidence.

## Invariants and enforcement requirements
1. **OPS-020-R01** 20 documented OPS checkpoints are not 20 accepted infrastructure work packages.
2. **OPS-020-R02** Unexecuted test case cannot be marked passed.
3. **OPS-020-R03** No invented HSM or penetration-test certification.
4. **OPS-020-R04** Failure to reconcile financial balances blocks dependent go-live.
5. **OPS-020-R05** Bank-specific external settlement keys and permissions require actual authority.
6. **OPS-020-R06** Every acceptance refers to exact Git commit and real proof.
7. **OPS-020-R07** P0 status must be retained until signed evidence resolves.

## Acceptance and negative scenarios — planned, not run
- [ ] **OPS-020-T01** Run index reconciles all OPS archive paths.
- [ ] **OPS-020-T02** Reject dossier missing reviewer identities.
- [ ] **OPS-020-T03** Reject test pass absent execution log.
- [ ] **OPS-020-T04** DR recovery must preserve journal and dedupe.
- [ ] **OPS-020-T05** Security exception cannot waive failed financial integrity.

## Dependency and reviewer gate
Independent legal/CFO/CISO/Operations/QA approval, current institution profile and genuine executed acceptance evidence.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
