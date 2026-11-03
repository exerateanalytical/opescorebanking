# GOV-005 — Delegation, conflict escalation and maker-checker policy

OPES Core Banking | 2026-11-03 | Batch 5/30 | Status: DRAFT DELIVERED; WP ACCEPTANCE PENDING
Source context: governance/PROGRAMME_RECOVERY_BASELINE_2026-11-03.md; regulatory/checkpoints/CP/README.md; regulatory/checkpoints/CT/README.md. No fresh regulatory certification claimed.

## Scope and control requirements
1. **GOV-005-R01:** Separate requestor, preparer, checker, approver and executor for controls affecting money, identity, regulatory reports and settlement.
2. **GOV-005-R02:** Prevent self-approval in any posting rule, account mapping, product-interest, migration cutover or privileged-access decision.
3. **GOV-005-R03:** Escalate contradictory regulations with literal page citations, issuer identity, effective dates, affected flows and independent legal/CFO signoff.
4. **GOV-005-R04:** Retain COBAC I-2015/01 Article 8(d) 312/322 P0 hold pending competent-authority clarification; never normalize guessed text.
5. **GOV-005-R05:** Treat break-glass privileges as temporary, monitored, independently reviewed and incapable of silently authorizing money movement.
6. **GOV-005-R06:** Preserve immutable decision logs, comments, dissent, approval identities and revocation events.
7. **GOV-005-R07:** Require explicit waiver expiry and compensating controls for non-P0 exceptions; prohibit waivers of core-ledger or entitlement invariants.

## Artifacts required for full WP acceptance
- Delegation-of-authority matrix
- P0 conflict-escalation dossier
- Maker-checker authorization conditions

## Acceptance criteria — open until review
- [ ] AC-1: No requestor can approve same sensitive change
- [ ] AC-2: Every exception has reviewer and expiry
- [ ] AC-3: P0 accounting uncertainty cannot be bypassed

## Evidence and approval blockers
- Actual delegations and authority letter unavailable

## Assurance constraints
Preserve immutable posted journals, exact monetary arithmetic, double entry, evidence-based settlement, least privilege, maker-checker and independent reconciliation where implicated. No production code, execution tests, approval or certification is claimed. Next: assign reviewers and validate acceptance evidence.
