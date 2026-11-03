# CIF-017 — Identity audit, retention and lawful evidence access

**OPES Core Banking | Batch 57/60 | 2026-11-03 | DRAFT DELIVERED / REVIEW OPEN**

## Scope
Make customer onboarding and identity decisions reconstructable without exposing sensitive documents or preventing lawful access/deletion rights.

## Proposed domain model
| Attribute | Type | Reason |
|---|---|---|
| `audit_record_id` | `uuid` | append-only evidence event |
| `institution_id` | `uuid` | legal controller |
| `party_ref` | `uuid` | subject of record |
| `event_class` | `enum` | created/verified/rejected/amended/restricted/accessed |
| `actor_id` | `string` | authorized origin |
| `source_evidence_ref` | `uuid|null` | restricted proof |
| `decision_version` | `string` | review status snapshot |
| `retention_class` | `string` | lawful policy |
| `occurred_at` | `datetime` | source observation |
| `recorded_at` | `datetime` | repository ingestion |

## Status transition and recovery workflow
1. Capture onboarding and identity change with actor, purpose and source identifier.
2. Write immutable metadata audit under controlled access separate from raw evidence storage.
3. Determine lawful retention period from institution/jurisdiction policy.
4. Provide purpose-scoped retrieval to qualified auditors or authorized customers.
5. Apply redaction, pseudonymization or lawful deletion when retention conditions permit.
6. Document export, access request and destruction decisions with audit proof.

## Proposed requirements / invariants
1. **CIF-017-R01** Legal statutory retention and customer deletion requests require case-by-case qualified resolution.
2. **CIF-017-R02** Do not store unredacted IDs or document images in general application logs.
3. **CIF-017-R03** Metadata audit cannot be edited by routine CIF users.
4. **CIF-017-R04** Regulated customer records cannot be exported across institutions without legal authorization.
5. **CIF-017-R05** Archived evidence must be encrypted, access logged and cryptographically verifiable where policy requires.
6. **CIF-017-R06** Period expiry alone does not authorize deletion under active legal hold or litigation preservation.

## Planned acceptance cases — NOT RUN
- [ ] **CIF-017-T01** Authorized audit reconstructs every identity approval version.
- [ ] **CIF-017-T02** Ordinary user cannot read protected evidence bytes.
- [ ] **CIF-017-T03** Deletion while legal hold active denied with reason.
- [ ] **CIF-017-T04** Audit export stays within subject/institution scope.
- [ ] **CIF-017-T05** Tampered audit event fails integrity verification.

## Dependency and reviewer gate
Legal retention schedule, privacy/records authority, key custody rules and audit-retrieval tests.

**Status controls:** This draft is not approved law, implementation, test pass or certification. No live data was used; tests executed: 0; production code added: 0; accepted WP: 0. Qualified legal/identity/risk/security/operations reviewers must approve relevant portions before implementation.
