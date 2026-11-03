# GOV-002 — Institution and regulatory deployment profiles

Date: 2026-11-03 | Programme: OPES Core Banking | Execution batch: 2 of 30
Status: DRAFT DELIVERABLE; REVIEW / SIGN-OFF OUTSTANDING. No production implementation, tests, audit certification or regulatory approval is claimed.
Source baseline: governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.1_2026-11-03.md; regulatory/checkpoints/CT/README.md (inspected at f1e095e4bdf5a6fb15ad469f2441e3661ce0b5a0).

## Objective
Prevent a generic application configuration from implicitly claiming entitlement to operate as a bank, microfinance institution, payment institution or rail participant.

## Proposed requirements and enforceable controls
1. **GOV-002-R01:** Model institution_profile_id, licensed_entity_id, regulator_set, legal_jurisdiction, permissioned_products and active_effective_interval as separate dimensions.
2. **GOV-002-R02:** Set a DENY default for products, settlement rails, FX, credit and prudential reports without institution-authorized profile evidence.
3. **GOV-002-R03:** Use immutable profile-version identifiers; require approvals and compatibility review before migrating profiles or effective dates.
4. **GOV-002-R04:** Distinguish institution license, product authorization, BEAC/COBAC participation or reporting requirements, rail contract and technical conformance; none implies the others.
5. **GOV-002-R05:** Maintain per-profile currency, calendar, branch, product, fee, rate, tax, chart-of-accounts and retention configuration with cited authority.
6. **GOV-002-R06:** Require maker-checker and dual control for any profile change affecting monetary treatment, legal reporting or access to a rail.
7. **GOV-002-R07:** Never permit global default fallback to a different institution's credentials, ledger mappings, customer data or payments entitlement.
8. **GOV-002-R08:** Represent regulator-specific modules as configurable capabilities behind feature gates; avoid unsupported uniform 'CEMAC-compliant' claims.

## Required deliverables
- InstitutionProfile schema proposal
- Evidence checklist for license, product entitlements, rail participation and settlements
- Profile activation state machine DRAFT→REVIEW→APPROVED→ACTIVE→SUSPENDED→RETIRED

## Acceptance criteria (NOT YET PASSED)
- [ ] AC-01: No regulator-dependent capability becomes active with missing institutional evidence
- [ ] AC-02: Cross-institution profile or entitlement references fail authorization checks in future executable tests
- [ ] AC-03: All effective-dated changes retain prior versions and reviewer identity

## Open dependencies and named blockers
- Initial licensed customer profile unknown
- Current regulatory applicability requires qualified review and primary-source tracing

## Quality and test declaration
- Regulatory and legal validity: requires independently authenticated authority and qualified review.
- Finance and ledger controls: any release must preserve immutable journals, double entry, exact decimal arithmetic, controlled reversal and independent reconciliation.
- Security: cross-tenant access, maker-checker and least privilege must be tested where applicable.
- Evidence: all acceptance results require file paths, reviewer, date, environment and actual execution result.
- This batch writes a design/control document only. Executed tests: 0. Verified WP closures: 0.

## Next dependency-correct task
Obtain independent reviewer assignments and evidence for listed acceptance criteria; do not activate financial or payment functions using unverified assumptions.
