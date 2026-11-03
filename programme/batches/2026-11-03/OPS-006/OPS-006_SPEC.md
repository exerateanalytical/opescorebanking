# OPS-006 — Data protection, encryption and controlled retention

**OPES Core Banking | Batch 86/90 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Objective and boundary
Define encryption, tokenization, data locality, redaction and recoverable retention without asserting unsupported legal periods.

## Candidate record and policy fields
| Field | Type | Meaning |
|---|---|---|
| `dataset_id` | `string` | classified collection |
| `institution_id` | `uuid` | controller |
| `data_class` | `enum` | public/internal/confidential/restricted |
| `legal_basis_ref` | `uuid` | lawful processing authority |
| `encryption_policy_version` | `string` | key rule |
| `key_alias` | `string` | approved KMS reference |
| `residency_scope` | `list` | allowed jurisdictions |
| `retention_policy_ref` | `string` | effective policy |
| `legal_hold_ref` | `uuid|null` | retention exception |
| `access_audit_ref` | `uuid` | access evidence |

## Operations workflow
1. Inventory customer, ledger, credentials and audit datasets.
2. Assign sensitivity, lawful purpose and residency obligations.
3. Apply encryption at rest/in transit and bounded key scopes.
4. Define minimized API/log/event payloads and pseudonymization.
5. Enforce justified retention, archival and lawful deletion workflows.
6. Audit data access and test backup/restore under confidentiality.

## Requirements and security controls
1. **OPS-006-REQ-01** Statutory retention must be verified by legal source, not guessed.
2. **OPS-006-REQ-02** Posted financial evidence is not deleted to satisfy a generic user request.
3. **OPS-006-REQ-03** Public object URLs cannot expose identity documents.
4. **OPS-006-REQ-04** Cross-jurisdiction replication requires approval.
5. **OPS-006-REQ-05** Sensitive backups require identical encryption and access controls.
6. **OPS-006-REQ-06** Secrets and raw customer identifiers excluded from general telemetry.

## Acceptance tests — NOT EXECUTED
- [ ] **OPS-006-T01** Unauthorized backup access rejected.
- [ ] **OPS-006-T02** Sensitive fields redacted in logs.
- [ ] **OPS-006-T03** Retention job respects active legal hold.
- [ ] **OPS-006-T04** Cross-region replication policy denies unknown location.
- [ ] **OPS-006-T05** Data export includes actor and approved purpose.

## Acceptance and independent review gate
Institution privacy/residency policy, qualified legal retention review, key policy and recovery-security tests.

Status: design specification, not deployed infrastructure or banking software. Production code: 0. Executed tests: 0. Independent approvals: NONE. Existing 312/322 PCEC contradiction and payment institution entitlement remain P0 and separate from this independent operations design.
