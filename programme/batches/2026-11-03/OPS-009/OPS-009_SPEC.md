# OPS-009 — Security incident response and operational escalation

**OPES Core Banking | Batch 89/90 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Objective and boundary
Establish evidence-preserving triage, containment, communication and recovery processes for attacks or control failures affecting regulated banking infrastructure.

## Candidate record and policy fields
| Field | Type | Meaning |
|---|---|---|
| `incident_id` | `uuid` | security case |
| `institution_id` | `uuid` | affected entity |
| `severity` | `enum` | critical/high/medium/low |
| `incident_type` | `enum` | fraud/credential/data/integrity/outage |
| `detected_at` | `datetime` | initial observation |
| `affected_services` | `list` | systems |
| `evidence_inventory` | `list` | immutable refs |
| `containment_action_refs` | `list` | approved controls |
| `decision_owner` | `string` | incident commander |
| `closure_status` | `enum` | open/contained/recovered/reviewed |

## Operations workflow
1. Detect event and create immutable time-stamped incident case.
2. Assess financial-integrity, confidentiality and operational impact.
3. Preserve logs, relevant service snapshots and chain of custody.
4. Approve bounded containment actions under incident commander.
5. Reconcile accounts, authorizations, credentials and external outcomes.
6. Restore service only after independent security/finance operations review.

## Requirements and security controls
1. **OPS-009-REQ-01** Never edit bank journals to hide a compromise.
2. **OPS-009-REQ-02** Security containment cannot fabricate financial settlement or reconciliation.
3. **OPS-009-REQ-03** Evidence access must be restricted to authorized incident responders.
4. **OPS-009-REQ-04** Regulatory notification dates require applicable verified legal policy.
5. **OPS-009-REQ-05** Emergency privileges expire with independent after-action audit.
6. **OPS-009-REQ-06** Affected customers and legal entity must be scoped precisely.

## Acceptance tests — NOT EXECUTED
- [ ] **OPS-009-T01** Unauthorized incident evidence export denied.
- [ ] **OPS-009-T02** Compromised key triggers managed revocation.
- [ ] **OPS-009-T03** Incident recovery verifies ledger invariants.
- [ ] **OPS-009-T04** Operator cannot erase initial incident event.
- [ ] **OPS-009-T05** No unreviewed reopening of affected payment route.

## Acceptance and independent review gate
CISO/operations incident playbook, institution notification/legal policies, tabletop and actual exercise evidence.

Status: design specification, not deployed infrastructure or banking software. Production code: 0. Executed tests: 0. Independent approvals: NONE. Existing 312/322 PCEC contradiction and payment institution entitlement remain P0 and separate from this independent operations design.
