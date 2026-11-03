# GOV-008 — Jurisdiction, licensing and capability matrix

OPES Core Banking | 2026-11-03 | Batch 8/30 | Status: DRAFT DELIVERED; WP ACCEPTANCE PENDING
Source context: governance/PROGRAMME_RECOVERY_BASELINE_2026-11-03.md; regulatory/checkpoints/CP/README.md; regulatory/checkpoints/CT/README.md. No fresh regulatory certification claimed.

## Scope and control requirements
1. **GOV-008-R01:** Model jurisdiction, branch territory, licensed entity, institution class and product authorization independently.
2. **GOV-008-R02:** Attach feature permission to a named legal entity and approved interval, not merely country or regional brand.
3. **GOV-008-R03:** Represent privacy, data hosting, reporting, payments participation and complaints requirements independently per deployment.
4. **GOV-008-R04:** Express bank, MFI and payment institution capabilities as candidate configurations requiring legal review before activation.
5. **GOV-008-R05:** Prevent one institution's regulatory report from consuming another's balances, metadata or entitlement tokens.
6. **GOV-008-R06:** Track cross-border payments and customer transfers as separate legal and rail permissions rather than generic enabled APIs.
7. **GOV-008-R07:** Require explicit go-live decisions for entity × jurisdiction × product × channel × rail combinations.

## Artifacts required for full WP acceptance
- Applicability matrix
- Deployment approval key design
- Institution isolation scenarios

## Acceptance criteria — open until review
- [ ] AC-1: Unapproved entity cannot transact
- [ ] AC-2: Cross-jurisdiction permissions deny by default
- [ ] AC-3: Capabilities are effective dated

## Evidence and approval blockers
- Initial deployer's licensed entity and entitlement unavailable

## Assurance constraints
Preserve immutable posted journals, exact monetary arithmetic, double entry, evidence-based settlement, least privilege, maker-checker and independent reconciliation where implicated. No production code, execution tests, approval or certification is claimed. Next: assign reviewers and validate acceptance evidence.
