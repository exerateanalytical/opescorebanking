# OPS-017 — Regulatory audit export and supervisory evidence delivery

OPES Core Banking | Checkpoint batch 97 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Design controlled auditor-grade evidence retrieval and reporting custody with legal institution segregation and tamper detection.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `export_request_id` | `uuid` | auditor request |
| `institution_id` | `uuid` | regulated source |
| `requesting_authority` | `string` | validated requester |
| `legal_basis_ref` | `uuid` | authorized power |
| `scope_filter` | `string` | approved records |
| `period_from` | `date` | start |
| `period_to` | `date` | end |
| `source_cursor` | `string` | journal/report snapshot |
| `export_digest` | `string` | actual byte hash |
| `approval_chain` | `list` | maker-checker and legal review |

## Workflow and recovery design
1. Authenticate audit or supervisory evidence request and legal authority.
2. Review proportional subject, date, jurisdiction and document scope.
3. Freeze reproducible source snapshots and effective reporting policy.
4. Generate secure evidence package with observed original data and provenance.
5. Measure hash, export time, access expiry and chain of custody.
6. Record delivery receipt and follow-up corrections without overwriting prior export.

## Invariants and enforcement requirements
1. **OPS-017-R01** A generated supervisory report does not prove regulatory compliance.
2. **OPS-017-R02** Audit export must not include unrelated institution customer data.
3. **OPS-017-R03** Only qualified authorized reviewers can approve sensitive disclosures.
4. **OPS-017-R04** Exported amounts must reconcile to authoritative journal and reporting policy.
5. **OPS-017-R05** Document provenance must distinguish observed source from legal interpretation.
6. **OPS-017-R06** No fabricated regulator receipt, audit pass or cryptographic signature.
7. **OPS-017-R07** Correction requires distinct version and prior export reference.

## Acceptance and negative scenarios — planned, not run
- [ ] **OPS-017-T01** Unverified requester cannot export.
- [ ] **OPS-017-T02** Cross-institution records excluded.
- [ ] **OPS-017-T03** Changing exported bytes fails integrity check.
- [ ] **OPS-017-T04** Source cursor permits reproduction of report.
- [ ] **OPS-017-T05** Expired export access revoked.

## Dependency and reviewer gate
Competent authority verification, privacy/legal approval, signed evidence policy and actual export integrity tests.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
