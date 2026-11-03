# ARC-009 — Idempotency, replay and uncertain-outcome contract

OPES Core Banking | 2026-11-03 | Batch 29/30 | Status: DESIGN DRAFT DELIVERED; REVIEW AND TESTS OPEN
Source context: governance/PROGRAMME_RECOVERY_BASELINE_2026-11-03.md; governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.1_2026-11-03.md; regulatory/checkpoints/CT/README.md. These requirements are proposed engineering controls, not implemented functionality.

## Requirements, invariants and recovery behavior
1. **ARC-009-R01:** Introduce one business operation identifier for each authorized financial command, unique per tenant, context and operation type.
2. **ARC-009-R02:** Retain an idempotency record that records request fingerprint, authorization context, processing state, final recorded outcome and correlation identifiers.
3. **ARC-009-R03:** A repeated identical request returns the existing safe outcome or explicit unknown state; a conflicting payload with reused key is rejected.
4. **ARC-009-R04:** Distinguish local command completion from external submission, network acknowledgement, settlement evidence and independent reconciliation.
5. **ARC-009-R05:** Retry transport failures with bounded policy, but never repeat an uncertain money-moving side effect simply because a response timed out.
6. **ARC-009-R06:** Queue unresolved external outcomes for investigation and source reconciliation rather than marking success, failure or reversal without evidence.
7. **ARC-009-R07:** Preserve deterministic replay across service restart, message redelivery and disaster recovery with event identity and audit references.
8. **ARC-009-R08:** Design negative test cases for double-submit, concurrent requests, expired key, cross-tenant key collision, external timeout and late duplicate callback.
9. **ARC-009-R09:** Do not mark this specification implemented until actual fault injection and ledger conservation tests prove it under failure.

## Required acceptance artifacts
- Idempotency state machine
- Command key namespace policy
- Negative test specifications

## Acceptance scenarios — PLANNED, NOT RUN
- [ ] AC-1: Identical retry does not double apply
- [ ] AC-2: Unknown outcome remains investigable
- [ ] AC-3: Cross-tenant replay denied

## Open evidence and approval gaps
- Implementation API and journal reconciliation test evidence pending

## Delivery classification
Design document completed and uploaded; WP acceptance remains open. Production code: 0; tests executed: 0; regulatory approval claimed: 0. Accounting mapping 312/322 and external rail entitlements remain P0-gated.
