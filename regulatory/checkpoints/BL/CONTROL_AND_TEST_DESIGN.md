# BL — Clause-semantic and counterparty-identity safety design (proposed; non-executable)

**Authority:** predecessor BK; evidence register `CLAUSE_SEMANTICS_AND_IDENTITY_GATES.json`. No approved ADR, compliance claim, implementation or banking test.

## New decision-critical distinction
- R-2020/01 (third-party scanned reproduction), amended Article 7: **“du quart (25%)”**. Government-hosted D-2025/328 recital: **“au quart (25%)”**; operative Article 2: **“réduction du quart”**. These expressions may be read as reducing an amount **by** 25% versus reducing **to** 25%. They are not interchangeable for financial calculations. Neither arithmetic interpretation may be deployed without authenticated applicable law and issuer/legal clarification. The decision also cites R-2020/02 in its operative clause, conflicting with its R-2020/01 recital.
- The 2020 scanned Article 1 has a **historical** 25% single-beneficiary limit effective 2023-01-01 and an 800% aggregate large-risk limit, with its own large-risk definition; do not confuse this 25% concentration limit with the 25% exceptional **quotity** adjustment, and do not assume the 2020 limits remain current without the subsequent amendment chain.
- D-2025/328 recital **SCLOG** versus Article 1 **SLOG** for the Congo entity. Both printed strings must remain in provenance; do not merge by fuzzy name alone. Likewise, a roster name is not a verified borrower legal identity or a COBAC evaluation of the beneficiary bank.

## Proposed requirements (NOT signed off)
- BL-REQ-01: store verbatim article-level French excerpts with page/line anchors, source custody, effective and knowledge timestamps, amendment links and contradictory text preserved; never normalize legal text in-place.
- BL-REQ-02: `ReliefFormulaVersion` must declare explicit base amount, operation (multiply by 0.75, multiply by 0.25, or other issuer-authorized rule), eligible perimeter, exclusions, rounding, currency, legal source, approvals, effective interval and retrospective correction behavior. **No candidate operation approved**.
- BL-REQ-03: maintain separate `LargeExposureLimitVersion`, `ExceptionalQuotityReliefVersion`, `NetOwnFundsDefinitionVersion`; a percentage match never implies shared meaning.
- BL-REQ-04: store both `PrintedRosterName` and `VerifiedLegalEntityId` with `UNMATCHED/AMBIGUOUS/VERIFIED` and review evidence; no fuzzy auto-entitlement, no inferred 37th entry.
- BL-REQ-05: require institution-specific satisfactory-financial-condition evidence (exact documentary form unresolved), independent group exposure aggregation and legal/risk/CFO maker-checker before any preferential assessment.
- BL-REQ-06: record `decided_at`, `published_at`, `notified_at`, `effective_from`, `effective_to`, `known_at` separately; one-year 2026 period cannot be silently inferred from a government catalogue timestamp.
- BL-REQ-07: any rule or identity conflict routes to `STANDARD_NO_RELIEF` / `LEGAL_HOLD`; no direct GL, customer balance, settlement, provisions or regulatory capital mutation. Standard treatment still requires its own verified policy.
- BL-REQ-08: do not propagate compliance from institution A to institution B, or from legal entity to an affiliate; re-evaluate when issuer correction, corporate restructuring, amendment, revocation or new period occurs.

## Proposed bounded contexts and contract deltas
`RegulatoryAuthority`: `ClauseTextVariant(instrument_id, article, literal_text, provenance, authenticated, legal_interpretation_id?)`; `RegulatoryConflict(id, affected_rules, severity, issuer_resolution_id?, status)`.
`CounterpartyRegistry`: `RosterAlias(decision_id, printed_name, country, article_position, candidate_entity_id?, verification_state)`.
`CreditRiskPolicy`: `ExposureRuleCandidate(source_ids, arithmetic_semantics=UNRESOLVED, baseline_limit_version?, institution_eligibility_evidence?, effective_window?)`.
`AccountingCore`: no new posting commands, no event subscriber that changes money from prudential status.

Proposed read-only endpoint `GET /v1/regulatory/exposure-policy/conflicts?as_of=` returns conflict IDs, source versions and **non-executable** status; proposed `POST /v1/regulatory/identity-reconciliations` requires dual approval and creates an append-only record, not a roster edit. Proposed event `RegulatoryClauseAmbiguityRaised` is informational, never a posting trigger. All mutating contracts require tenant scoping, RBAC, idempotency, immutable audit and transactional outbox/inbox when eventually implemented.

## State/failure/recovery
`SOURCE_OBSERVED -> SOURCE_AUTHENTICATED -> CLAUSES_RECONCILED -> INSTITUTION_ELIGIBLE -> LEGAL_AND_RISK_APPROVED -> ACTIVE`. Any conflict enters `CONFLICTED` or `AWAITING_ISSUER`. External lookup unknown remains `UNKNOWN`; recovery appends new version and re-evaluates historical assessments, never silently edits posted journals or previously approved regulatory reports.

## Twelve new negative acceptance scenarios — SPECIFIED, NOT EXECUTED
1. Formula treats 'du quart' as 'au quart' without signed authority: reject activation.
2. Formula treats 25% exceptional relief as the ordinary 25% single-obligor concentration ceiling: reject.
3. Formula applies historic 800% aggregate threshold as current without later-amendment verification: reject.
4. Formula changes principal, customer balance, GL journal or liquidity from a prudential status change: reject.
5. Congo SCLOG and SLOG auto-merge by fuzzy string match: reject pending identity and issuer evidence.
6. 37th entity invented from a proposal list: reject; 36 operative rows remain an unresolved discrepancy.
7. Roster member is matched to an affiliate rather than registered legal obligor: reject.
8. A counterparty qualifies but the beneficiary bank lacks satisfactory-financial-condition evidence: no relief.
9. Publication catalogue 2 Dec is used as effective date despite decision dated 12 Dec: reject.
10. One-year duration interpreted as any 365-day interval without legal effective-date evidence: reject.
11. Subsequent rule amendment arrives while an assessment is in flight: pin version and re-evaluate, never mix versions.
12. Duplicate/late issuer-correction event rewrites historical audit evidence or creates duplicate financial posting: reject and audit.

**Execution status:** 12 specified, 0 executed. This design does not satisfy DoR.