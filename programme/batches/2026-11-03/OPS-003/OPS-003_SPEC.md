# OPS-003 — Build artifact provenance, SBOM and dependency integrity

**OPES Core Banking | Batch 83/90 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Objective and boundary
Ensure released binaries and container images have a verifiable source, complete dependency inventory and controlled promotion history.

## Candidate record and policy fields
| Field | Type | Meaning |
|---|---|---|
| `build_id` | `string` | unique pipeline |
| `commit_sha` | `string` | source revision |
| `build_runner_id` | `string` | trusted builder |
| `artifact_digest` | `string` | cryptographic output hash |
| `dependency_lock_ref` | `string` | locked versions |
| `sbom_ref` | `string` | component inventory |
| `signature_ref` | `string|null` | provenance attestation |
| `scan_status` | `enum` | not_run/passed/failed |
| `promotion_stage` | `string` | environment gate |
| `approver_id` | `string` | release reviewer |

## Operations workflow
1. Resolve trusted source revision and immutable dependencies.
2. Build reproducibly in isolated runner with limited secrets.
3. Generate SBOM and artifact digest from actual build bytes.
4. Run supported vulnerability, license and integrity checks.
5. Quarantine issues requiring review and record exceptions.
6. Sign and promote exact artifact digest after approval.

## Requirements and security controls
1. **OPS-003-REQ-01** Do not invent vulnerability scan passes or attestation signatures.
2. **OPS-003-REQ-02** Dependence on a package registry is subject to reproducibility and availability plan.
3. **OPS-003-REQ-03** Only digest-pinned candidate artifacts may enter controlled stages.
4. **OPS-003-REQ-04** Secrets must not be embedded in container layers or build logs.
5. **OPS-003-REQ-05** Critical financial service images require additional integrity acceptance.
6. **OPS-003-REQ-06** Past release artifacts remain retrievable for incident reconstruction.

## Acceptance tests — NOT EXECUTED
- [ ] **OPS-003-T01** Modified binary fails digest verification.
- [ ] **OPS-003-T02** Unpinned dependency blocks protected build.
- [ ] **OPS-003-T03** Missing SBOM prevents release promotion.
- [ ] **OPS-003-T04** Scanner failure status remains NOT_RUN/FAILED rather than PASS.
- [ ] **OPS-003-T05** Signed release maps to exact Git SHA.

## Acceptance and independent review gate
Approved dependency policy, trusted build environment and actual reproducibility/security test outputs.

Status: design specification, not deployed infrastructure or banking software. Production code: 0. Executed tests: 0. Independent approvals: NONE. Existing 312/322 PCEC contradiction and payment institution entitlement remain P0 and separate from this independent operations design.
