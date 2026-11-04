# OPES Core Banking — Synthetic Ledger Invariant Laboratory

**NOT PRODUCTION BANKING CODE.** The engine is deliberately in-memory and uses no real accounts, regulations, payment networks or customer balances. The goal is executable evidence for financial invariants before implementing immutable, durable and recoverable production posting.

Executable safeguards:
- Strict integer minor-unit amounts, rejecting floats and bools.
- Balanced debits/credits **within each currency**; no artificial netting across currencies or unsupported FX settlement.
- Immutable frozen journal line and journal data; controlled reversal creates a new compensating journal, never modifies the original.
- Synthetic accounts explicitly owned by a bank; no cross-bank journal or reversal.
- Lock-serialized idempotency keys and source-reference uniqueness; conflicting payloads rejected; concurrency stress cases.
- Derived debit-credit GL projections from posted journal lines, not mutable stored customer balances.

**Still required for real financial production:** durable PostgreSQL transaction+outbox, write-once journal lifecycle and permission boundaries, maker-checker, no-overdraft/availability semantics, deposit liability accounting, reconciliation under crash/DR, currencies/exponents and rounding policies, persisted idempotency/reversal uniqueness, protected audit logs, HSM/key controls, full 15 DoR and bank-specific COBAC mapping evidence. The disputed COBAC 312/322 classification is intentionally not encoded here.

Run: `cd engineering/ledger-lab && python3 -m unittest discover -s tests -v`. CI workflow records actual result. No simulated run is represented as completed before CI succeeds.
