# BZ — Proposed controls, workflows, accounting and negative acceptance tests
**Design only; no banking test executed, no issuer API verified.**

## Legal-authority and reporting workflow
1. Register issuer-hosted instruction, charter and report with independent source records, exact full identifier and conflicting date claims. Status `CONFLICTED` blocks policy activation.
2. Legal reviewer must obtain signed original, official gazette or issuer correction, current amendment chain and institution-specific applicability before approval. Separate maker/checker; immutable approval log.
3. For each bank and rail, verify participation mode, signed agreement, issuer authorization, effective scheme version and operational contacts. A missing agreement means no assumed entitlement.
4. Configure supervisory reporting only from current CRSP circulars: schema, metrics, cadence, cut-off, transmission channel, identity, security, retention and receipt semantics. Do not infer a monthly deadline from Article 20.
5. Assemble report from immutable, institution-scoped evidence and independently reconciled data; validate, approve, transmit idempotently and record issuer acknowledgement. On timeout retain UNKNOWN_OUTCOME and reconcile before retry.
6. Receive inspection finding; capture bank observations and corrective plan; follow up with issuer evidence. Suspension/exclusion requires separate authenticated decision and legal effective date, never mere finding.
7. Incident case evaluates BEAC payment-system and COBAC ICT reporting independently. Do not claim SANGHA/GIMAC connectivity from a public report.

## Accounting and settlement boundary
Supervisory reports, legal-date corrections, warnings, sanctions, restitution requests and external notices are **not** accounting entries. Only independently verified settlement-account movements, approved PCEC mapping and double-entry authorization can create a new immutable posting. Original settlement journals cannot be edited. Unknown external outcomes stay unresolved; reconciliation must be independent.

## Negative acceptance scenarios — 12 specified, 0 executed
| ID | Stimulus | Expected fail-closed result |
|---|---|---|
| BZ-T01 | 2014 instruction marked effective 17 March using charter alone | Quarantine conflict; no legal-policy activation |
| BZ-T02 | 2014 instruction marked effective 17 May using scan alone | Quarantine conflict pending official publication/issuer correction |
| BZ-T03 | Charter 01/GR/2013 citation used as binding identity | Reject ambiguous instrument reference |
| BZ-T04 | 2014 Article 3 exclusion used to exempt 2026 payment institution | Require current licensing and scheme-specific law |
| BZ-T05 | Bank without signed agreement granted SYSTAC2 participation | Deny rail entitlement and log missing issuer proof |
| BZ-T06 | Article 20 reporting deadline guessed as monthly | Reject unsourced cadence; remain unconfigured |
| BZ-T07 | Unconfirmed BEAC submission marked acknowledged | Retain SENT_UNCONFIRMED/UNKNOWN_OUTCOME |
| BZ-T08 | COBAC ICT incident receipt substitutes for BEAC surveillance receipt | Reject supervisor-channel substitution |
| BZ-T09 | Supervisory finding auto-suspends bank without issuer decision | Reject sanction transition |
| BZ-T10 | External suspension notification triggers GL balance write | No ledger mutation; separate operational entitlement |
| BZ-T11 | Duplicate report replay after failover | Idempotent submission intent; reconcile external outcome |
| BZ-T12 | Cross-institution supervisor evidence reused to activate entitlement | Deny tenant crossover; preserve audit |

## API/event and data review
Proposed operations, idempotency keys, states and events are enumerated in SURVEILLANCE_CONTROL_GATES.json. Schema versions, cryptographic receipt validation, exact external contract, retention schedules and issuer notification channels remain unresolved. No executable API implementation authorized.

## Operational observability
Audit evidence must correlate institution, instrument version, reporting period, rail, maker/checker, payload hash, delivery attempt and issuer receipt. Monitor unknown outcomes, overdue reports only after approved deadline policy, missing settlement statements, reconciliation exceptions and unauthorized entitlement changes. DR replay must not duplicate journals or submissions.
