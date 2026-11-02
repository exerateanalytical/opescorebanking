# BE — proposed non-executable regulatory capital authority model
**Design status: PROPOSED / NOT APPROVED / NOT IMPLEMENTED.**

## Separate aggregates
1. `InstitutionProfile`: entity id, legal category, headquarters jurisdiction, authorization date, status, grandfathering evidence, branch/group applicability, approving regulator, effective periods.
2. `RegulatoryInstrument`: issuer, number, type, official bulletin, complete signed binary digest, clause identity, effective/repeal dates, amendments, authority quality.
3. `RegulatoryCapitalPolicy`: category and effective-dated minimum **social capital**; transition eligibility and approved bank-specific remediation plan. Never confuse paid-up capital with **net regulatory own funds** or capital adequacy ratios.
4. `PrudentialOwnFundsPolicy`: COBAC R-2016/03 net own funds and amendment graph, independent from social-capital floor.
5. `RiskCoveragePolicy`: R-2010/01 and R-2021/01 amended risk-weighting/coverage rules; `ConcentrationPolicy`: R-2010/02 and R-2020/01/R-2021/02; never conflate risk weighting, concentration, securities ownership or liquidity.
6. `AccountingCore`: immutable GL journal, exact amounts and reconciliations; policy evaluation does not create capital or post money.

## Proposed authority and activation state machine
`DISCOVERED_SECONDARY → PRIMARY_OBTAINED → AUTHENTICATED → CLAUSE_MAPPED → LEGAL_REVIEWED → CFO_RISK_REVIEWED → APPROVED → EFFECTIVE`; `CONFLICTED`, `SUSPENDED_BY_CERTIFIED_ORDER`, `REPEALED`, `EXPIRED` are separately supported states. Any missing complete issuer text, publication, later amendment, institution profile or approval leaves rule NON_EXECUTABLE. Court proceedings alone do not set SUSPENDED. Approval must be effective-dated, maker-checker controlled and tamper-evident.

## Transition semantics and ambiguity
The *secondary* R-2025/02 reproduction suggests adoption 2025-12-10, entry 2026-01-01, one-year period for incumbents, capital-increase plan submission by 2026-06-30 for those not meeting the new requirement, staged 2026–2029 floors, and repeal of R-2009/01 in 2027. These are **leads** pending issuer authentication. The relationship between general one-year transition, an approved bank-specific plan, scheduled floors, and delayed repeal must be legally resolved, not inferred by code.

At minimum, every future evaluation requires institution class, authorization date, assessment date, verified applicable clause, approved transitional plan (if any), publication/effective date, and amendment/suspension state. Return `UNKNOWN_AUTHORITY` when evidence is incomplete. No auto-posting or false compliance flag.

## Control failures / required handling
- An unauthenticated PDF or third-party article cannot authorize a threshold.
- A change in regulatory effective date cannot mutate historical journals; corrections require new authorized events/journals.
- A transition plan cannot be assumed approved merely because submitted.
- A capital social increase cannot be equated with net own funds or cash receipt; exact accounting depends on authorized corporate actions and settlement evidence.
- Multiple applicable rules with unresolved priority yield `CONFLICT` and block automated compliance decisions.
- Distinct R-2025/02 (COBAC minimum capital) vs CEMAC 02/25 (dormant assets) namespaces enforced.
- No scheme payment/settlement or GIMACPAY readiness inferred.

## ADR proposal
`ADR-BE-CAPITAL-TEMPORAL-AUTHORITY` — **PROPOSED, NOT ACCEPTED**: use clause-level bitemporal authority and institution-specific transitional-plan gating. Must be approved by qualified CEMAC counsel, bank CFO and risk/compliance owners, with verified signed source, then validated by independent tests before executable use.