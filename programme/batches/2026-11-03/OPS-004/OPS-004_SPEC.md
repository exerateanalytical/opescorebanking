# OPS-004 — Secrets, certificates, encryption and key custody design

**OPES Core Banking | Batch 84/90 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Objective and boundary
Separate service credentials, bank signing identities and sensitive-data encryption keys under policy-controlled custody.

## Candidate record and policy fields
| Field | Type | Meaning |
|---|---|---|
| `secret_ref` | `string` | nonplaintext alias |
| `institution_id` | `uuid` | entity scope |
| `environment_id` | `string` | authorized environment |
| `secret_class` | `enum` | db/tls/api/hsm/pepper |
| `custodian_role` | `string` | approved owner |
| `access_policy_version` | `string` | entitlement edition |
| `rotation_due` | `datetime|null` | policy schedule |
| `key_version` | `string` | cryptographic revision |
| `revocation_state` | `enum` | active/rotating/revoked |
| `audit_ref` | `uuid` | access evidence |

## Operations workflow
1. Inventory credential and key usage by service and environment.
2. Classify risks and regulatory/participant cryptographic constraints.
3. Select managed vault or HSM boundary under qualified review.
4. Authorize least-privilege retrieval and nonexportable keys as required.
5. Rotate, revoke and recover through witnessed procedures.
6. Log access anomalies without exposing raw secret material.

## Requirements and security controls
1. **OPS-004-REQ-01** No secrets in Git, ZIP documentation, client JS or general logs.
2. **OPS-004-REQ-02** Bank signing algorithms cannot be guessed from public ISO message names.
3. **OPS-004-REQ-03** Production and test key hierarchies must not share material.
4. **OPS-004-REQ-04** Emergency key access is time-limited and independently reviewed.
5. **OPS-004-REQ-05** Compromised credentials require revocation and incident response.
6. **OPS-004-REQ-06** Do not claim HSM conformance without vendor/participant evidence.

## Acceptance tests — NOT EXECUTED
- [ ] **OPS-004-T01** Unprivileged service cannot retrieve secret.
- [ ] **OPS-004-T02** Revoked certificate fails protected integration.
- [ ] **OPS-004-T03** Secret rotated without exposing plaintext in logs.
- [ ] **OPS-004-T04** Cross-environment key retrieval rejected.
- [ ] **OPS-004-T05** Break-glass access produces independent audit.

## Acceptance and independent review gate
Institution cryptographic policy, approved HSM/rail security specs, qualified CISO and executed key rotation tests.

Status: design specification, not deployed infrastructure or banking software. Production code: 0. Executed tests: 0. Independent approvals: NONE. Existing 312/322 PCEC contradiction and payment institution entitlement remain P0 and separate from this independent operations design.
