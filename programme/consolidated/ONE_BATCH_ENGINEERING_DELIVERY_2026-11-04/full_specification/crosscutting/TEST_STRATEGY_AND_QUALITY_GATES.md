# Comprehensive verification strategy
Levels: unit/domain invariant, property-based double-entry, API schema/contract, consumer-driven event compatibility, integration with mock rails, migration rehearsal, load/soak, chaos, restore, security penetration, accessibility WCAG 2.2 AA, regulatory report reconciliation and UAT.
Financial properties: sum DR=CR per currency; no duplicate posting; posted journal immutable; correction is new journal; no cross-bank reference; unknown rail outcome cannot be finalized; replay is stable; bank-specific chart mappings versioned; period close prohibits backdating except approved adjustment.
Evidence per test: test ID, source requirement, code commit, environment, fixture hash, executed timestamp, expected/actual, logs/traces, screenshot where UI, reviewer and result. No test is PASS without actual execution.
15 DoR gates remain required for each production slice; no arbitrary readiness percentage.
