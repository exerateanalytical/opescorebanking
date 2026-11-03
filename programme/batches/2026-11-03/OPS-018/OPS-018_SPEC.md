# OPS-018 — Vulnerability management and adversarial testing gates

OPES Core Banking | Checkpoint batch 98 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Establish continuous defensive testing, remediation prioritization and release blocking for banking infrastructure without claiming scans that have not run.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `finding_id` | `string` | unique detection |
| `institution_id` | `uuid` | affected deployment |
| `component_ref` | `string` | source/container/dependency |
| `severity` | `enum` | critical/high/medium/low |
| `finding_source` | `string` | scanner or validated tester |
| `first_observed_at` | `datetime` | actual observation |
| `affected_version` | `string` | digest/revision |
| `remediation_owner` | `string` | assigned team |
| `exception_approval_ref` | `uuid|null` | qualified waiver |
| `verification_run_ref` | `uuid|null` | confirmed retest |

## Workflow and recovery design
1. Inventory exposed services, dependencies, APIs and infrastructure.
2. Schedule authorized secure code review, SAST/DAST and penetration testing.
3. Validate finding reproducibility and rate actual business impact.
4. Apply remediation or qualified time-bound risk exception.
5. Rerun relevant tests and capture real tool outputs.
6. Block release when critical unresolved risks violate risk threshold.

## Invariants and enforcement requirements
1. **OPS-018-R01** Do not publish false zero-vulnerability claims from an unexecuted scan.
2. **OPS-018-R02** Penetration testing must be authorized and isolated from real customer funds.
3. **OPS-018-R03** Prioritize cross-tenant IDOR, privilege bypass, session replay and money-flow manipulation.
4. **OPS-018-R04** A waived P0 financial regulatory block cannot be treated as security exception.
5. **OPS-018-R05** Supply-chain versions and fixes must be traceable.
6. **OPS-018-R06** Sensitive report access is scoped and logged.
7. **OPS-018-R07** Findings stay open until independently verified closure.

## Acceptance and negative scenarios — planned, not run
- [ ] **OPS-018-T01** Wrong-tenant object ID denied.
- [ ] **OPS-018-T02** Sensitive API rejects privilege elevation.
- [ ] **OPS-018-T03** Replay token fails after revocation.
- [ ] **OPS-018-T04** Mock financial command cannot be forged by channel client.
- [ ] **OPS-018-T05** Fixed vulnerable dependency shows verified new version.

## Dependency and reviewer gate
CISO authorization, actual scanner/testing infrastructure, recorded findings and qualified retest evidence.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
