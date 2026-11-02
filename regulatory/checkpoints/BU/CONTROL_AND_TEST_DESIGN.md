# BU — Regulatory authority-resolution controls and acceptance design (NOT IMPLEMENTED)

## ADR-BU-01 — Full legal identity, not short-number matching (PROPOSED)
A rule must reference an immutable `InstrumentVersion` keyed by issuer, instrument type, full number, jurisdiction, signature date, subject, publication evidence and version. The display alias `R-2019/03` or `04/18` is never a primary key. Explicit `supersedes`, `amends`, `clarifies`, `cites` edges must carry clause-level provenance, effective time and observed time; conflicting edges remain unresolved rather than overwritten.

## ADR-BU-02 — Source authority and disputed-citation quarantine (PROPOSED)
Maintain `SOURCE_RETRIEVED` → `PROVENANCE_CHECKED` → `CLAUSE_EXTRACTED` → `LEGAL_REVIEW_PENDING` → `LEGAL_APPROVED` → `POLICY_ELIGIBLE` with failure states `SOURCE_UNAVAILABLE`, `CITATION_CONFLICT`, `AUTHORITY_UNRESOLVED`, `SUPERSEDED`. Explanatory reports and research are supporting evidence only; never activate a rule from them. Require issuer-authenticated current operative text and qualified legal signoff, independent maker/checker, and an evidence digest before activation.

## ADR-BU-03 — Non-financial authority service boundary (PROPOSED)
`RegulatoryAuthorityRegistry` owns legal citations and provenance. `InstitutionEntitlement` owns licensed institution/product permissions. `RestitutionCase` owns customer claim/consent/contest. `PaymentRail` owns external message and settlement state. `AccountingCore` exclusively owns balanced immutable postings. Authority or entitlement events cannot post GL, alter balances, or certify external settlement. Tenant scope, segregation of duties, cryptographic evidence custody, durable outbox/inbox and idempotency remain mandatory.

## Candidate internal contracts (not BEAC APIs)
- `POST /internal/regulatory/instruments/{id}/citation-reconciliations`: `source_ref`, `quoted_clause`, `claimed_target`, `resolved_target?`, `evidence_digest`, `idempotency_key`, `maker_id`.
- `POST /internal/regulatory/citation-reconciliations/{id}/approvals`: `checker_id`, `legal_authority_reference`, `effective_from`, `known_from`, `decision`.
- Events `RegulatoryCitationConflictDetected`, `RegulatoryAuthorityQuarantined`, `RegulatoryCitationReviewed`, `RegulatoryRuleActivationDenied`; at-least-once delivery with inbox deduplication and immutable audit.
- Tables (proposed): `regulatory_instrument_version`, `regulatory_source_artifact`, `regulatory_clause`, `regulatory_citation_edge`, `regulatory_conflict_case`, `regulatory_approval`; all tenant-scoped where institution-specific, and bitemporal for effective/known chronology. Hashes require real source bytes, never placeholders treated as verified.

## 12 NEW negative acceptance scenarios (SPECIFIED; 0 EXECUTED)
| ID | Fixture | Expected result |
|---|---|---|
| BU-T01 | 2020 BEAC explanatory footnote R-2019/03 misclassified as payment-prudential authority | Reject binding mapping; flag citation collision and quarantine |
| BU-T02 | R-2019/02 mistakenly loaded as monetary-sanctions rule | Reject wrong subject; require operative title and source |
| BU-T03 | Regulation 04/18 payment-services and another 04/18 sanctions instrument share shorthand | Reject shorthand-only legal reference; full identity mandatory |
| BU-T04 | BEAC research article treated as operative COBAC instrument | Reject explanatory-to-binding promotion |
| BU-T05 | R-2019/01 approval inferred to authorize a named bank product | Deny until institution-specific evidence |
| BU-T06 | R-2019/02 payment-institution prudential rule applied to bank deposits | Reject institution-profile mismatch |
| BU-T07 | Legal-source corrigendum received without issuer signature or provenance | Quarantine; no automatic activation |
| BU-T08 | Amendment effective 2025 but known 2026; historical case adjudicated using current knowledge silently | Require bitemporal replay and restatement authorization |
| BU-T09 | Legal alias resolves to two instruments across jurisdictions/subjects | Return AMBIGUOUS_AUTHORITY; no rule execution |
| BU-T10 | Maker approves own citation reconciliation or cross-tenant authority | Reject and append security audit event |
| BU-T11 | Legal-policy correction triggers GL balance mutation or settlement flag | Reject; policy context cannot post money |
| BU-T12 | Previously unknown return outcome retried after legal-policy remap | Preserve original idempotency; query/reconcile, never duplicate |

## Reconciliation and operations
Monitor unresolved legal-citation conflicts and blocked activation attempts with immutable audit IDs. Daily control compares approved rule versions against source hashes and legal-effective intervals; missing originals or contradictory instrument titles generate an exception, not an auto-fix. DR restores original idempotency and source-version history. Operator screens must visibly show `CITATION_CONFLICT` and `LEGAL_SCOPE_UNRESOLVED`; no auto-hold, return, posting or certification.

## DoR and assurance
Current signed 04/18, R-2019/01–02, Circular 004/2023 with all amendments, bank-specific licenses/contracts, PCEC mappings, rail participation and settlement finality remain unavailable. Requirements and scenarios are **design-only**. No implementation, test environment, performance benchmark or security validation was executed. Review must cover regulator/legal, CFO/ledger, CISO, AML/fraud, payments, privacy/retention, DR, accessibility, audit and operations before approval.
