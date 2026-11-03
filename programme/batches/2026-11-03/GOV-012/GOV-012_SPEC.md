# GOV-012 — Dependency graph and critical-path gate model

OPES Core Banking | 2026-11-03 | Batch 12/30 | Status: DRAFT DELIVERED; INDEPENDENT REVIEW OPEN
Source context: governance/PROGRAMME_RECOVERY_BASELINE_2026-11-03.md; governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.1_2026-11-03.md; regulatory/checkpoints/CP/README.md; regulatory/checkpoints/CT/README.md. No renewed primary-law verification performed in this batch.

## Scope and proposed control requirements
1. **GOV-012-R01:** Encode directed dependency edges between work packages with hard gate, soft advisory and evidence-only semantics.
2. **GOV-012-R02:** Classify dependencies as regulatory authority, accounting mapping, institution entitlement, security design, API contract, data model, approval or acceptance evidence.
3. **GOV-012-R03:** Prevent cycles in mandatory hard-gate edges; validate graph upon baseline approval and every scope change.
4. **GOV-012-R04:** Keep accounting mapping WP-ACC-005 blocked P0; do not run downstream ledger, prudential posting or migration activation from speculative 312/322 interpretation.
5. **GOV-012-R05:** Permit independent security, governance and API design work with explicit no-production-activation boundary where separate evidence is mature.
6. **GOV-012-R06:** Keep external payments integration blocked behind signed participation, approved schema edition, keys, settlement-account entitlement, and finality/reconciliation policy.
7. **GOV-012-R07:** Track each blocker with affected downstream nodes and named remediation evidence, not a fabricated completion date.
8. **GOV-012-R08:** After each run choose a dependency-correct next package; report attempted, draft delivered, accepted, open and blocked separately.

## Deliverables for formal acceptance
- Dependency edge schema and gate types
- P0 impact cascade map
- Safe-work scheduling algorithm

## Acceptance criteria — NOT YET PASSED
- [ ] AC-1: No blocked hard edge is bypassed
- [ ] AC-2: Every critical-path task has explicit closure evidence
- [ ] AC-3: Safe independent work does not claim regulatory readiness

## Unresolved evidence and sign-offs
- Graph requires full 260-slot dependency decomposition

## Quality and test declaration
Design-stage document. Executable test cases specified by related registers but no tests run here (0). Production code added: 0. Audited WP completions: 0. Regulatory source contradictions remain fail-closed. A verified push establishes only artifact custody, not design approval or regulatory compliance.
