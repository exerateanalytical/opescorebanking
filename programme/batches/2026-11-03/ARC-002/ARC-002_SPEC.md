# ARC-002 — Domain boundaries and invariants

OPES Core Banking | 2026-11-03 | Batch 22/30 | Status: ARCHITECTURE DRAFT DELIVERED; ACCEPTANCE OPEN
Based on prior governance and CT/CP checkpoint documents already verified in exerateanalytical/opescorebanking. This is a candidate technical specification, not code or a claim of regulatory approval.

## Domain requirements and control design
1. **ARC-002-R01:** Classify customer identity, account agreement, product version, accounting journal, payment instruction, branch cash session and loan agreement as separate candidate aggregates.
2. **ARC-002-R02:** Define unique identifiers, command authorization, lifecycle states, optimistic concurrency and audit trace on each candidate aggregate.
3. **ARC-002-R03:** Accounting journal posting must preserve currency-specific balancing and immutable posted history; adjustments use explicit controlled correction records.
4. **ARC-002-R04:** Money values require deterministic exact representation and explicit currency/rounding configuration approved for the institution.
5. **ARC-002-R05:** Payment lifecycle distinguishes initiated, approved, externally submitted, status-unknown, evidenced completion and reconciliation milestones.
6. **ARC-002-R06:** Retries of the same customer operation must return or reconcile the original outcome instead of duplicating a transaction.
7. **ARC-002-R07:** Cross-domain state propagation is asynchronous where appropriate, with explicit source ownership and reconciliation checks.
8. **ARC-002-R08:** Reject implementation of account mapping or settlement transitions while their regulatory evidence remains disputed.

## Deliverables for acceptance
- Aggregate candidate catalogue
- Invariant catalogue
- Lifecycle acceptance scenarios

## Acceptance tests to prepare (NOT RUN)
- [ ] AC-1: No money movement without authorized financial record
- [ ] AC-2: Repeated request cannot double apply
- [ ] AC-3: Unresolved external outcome is not treated as success

## Evidence and approval gaps
- Exact institution-specific ledger/rail approvals outstanding

## Completion boundary
Delivered design draft only. No tests executed, no production code, no certified financial configuration. Implement only after domain DoR, source authority and institution review.
