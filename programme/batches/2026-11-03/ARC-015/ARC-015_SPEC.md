# ARC-015 — Observability, audit and operational evidence architecture

**OPES Core Banking | Batch 35/60 | 2026-11-03 | DRAFT DELIVERED; REVIEW OPEN**

## Objective
Design accountable tracing of banking operations and independent audit trails without leaking secrets or treating telemetry as legal proof of settlement.

## Candidate domain contract
| Attribute | Type | Meaning |
|---|---|---|
| `trace_id` | `string` | end-to-end trace link |
| `correlation_id` | `string` | business operation chain |
| `institution_id` | `uuid` | tenant/legal entity |
| `actor_ref` | `string` | pseudonymized actor reference |
| `event_type` | `string` | auditable action category |
| `source_event_id` | `uuid` | authoritative domain event reference |
| `occurred_at` | `timestamp` | trusted event time |
| `recorded_at` | `timestamp` | audit ingestion time |
| `evidence_digest` | `string` | content provenance |
| `retention_class` | `string` | effective policy identifier |

## Process
1. Generate trace and correlation context at authenticated entry.
2. Propagate scoped context through API and asynchronous event links.
3. Record domain and security audit decisions in append-only controlled storage.
4. Emit redacted service logs, metrics and latency/queue gauges.
5. Alert on reconciliation exception, unauthorized attempt and stale external outcome.
6. Support authorized, reproducible event export with chain-of-custody record.

## Design invariants
1. **ARC-015-R01** Audit evidence must identify actor, institution, action, object, outcome and time.
2. **ARC-015-R02** Logs cannot contain passwords, HSM keys, unmasked tokens or unnecessary identity documents.
3. **ARC-015-R03** Operational health indicators cannot substitute for financial reconciliation.
4. **ARC-015-R04** Financial-journal source records, application events and telemetry retain separate provenance.
5. **ARC-015-R05** Protect audit evidence from ordinary application update/delete paths.
6. **ARC-015-R06** Define per-institution, lawful retention and secure export entitlements.

## Tests to execute (NONE RUN)
- [ ] **ARC-015-T01** Sensitive token values never appear in captured logs.
- [ ] **ARC-015-T02** Audit export cannot cross institution boundary.
- [ ] **ARC-015-T03** Outbox publish delay creates distinct alert.
- [ ] **ARC-015-T04** Audit reconstruction links command, journal, external evidence and approval.
- [ ] **ARC-015-T05** Unauthorized audit deletion request is denied and recorded.

## Definition of Ready / acceptance
Institution retention approval, security logging architecture and independent audit reviewer acceptance.

**Safety and provenance:** draft based on the verified repository programme baseline and inherited CT checkpoint. Historical WP-ACC-005 P0 COBAC 312/322 issue and unverified institution payments entitlements remain blocked. No executable code, independently accepted WP, real tests or institutional/regulatory certification asserted. Require named reviewers and source evidence.
