# ARC-013 — Versioned configuration and capability activation

**Programme:** OPES Core Banking | **Batch:** 33/60 | **Document status:** DRAFT DELIVERED / REVIEW OPEN | **Date:** 2026-11-03

## Purpose and accountability
Design a fail-closed mechanism for product, jurisdiction, rate, reporting and payments capabilities with traceable approvals.
The proposed authority belongs to the domain named by this package; actual owner, responsible engineer, legal reviewer and institution profile must be assigned in the authoritative WBS. This document is a proposed design, not an approved rule or banking certification.

## Candidate data / interface contract
| Field | Type | Intent |
|---|---|---|
| `configuration_id` | `uuid` | policy identifier |
| `institution_id` | `uuid` | licensed tenant |
| `capability_code` | `string` | controlled capability name |
| `rule_version` | `string` | immutable policy version |
| `effective_from` | `datetime` | legal/operational start |
| `effective_to` | `datetime|null` | close of interval |
| `authority_evidence_id` | `uuid` | issuer/institution provenance |
| `maker_subject` | `string` | change author |
| `checker_subject` | `string` | independent approver |
| `activation_state` | `enum` | draft/review/approved/active/suspended |

## End-to-end workflow
1. Open a new versioned capability change proposal.
2. Attach applicable regulatory and institutional authority evidence.
3. Compute dependencies and effective-date overlap checks.
4. Perform independent legal/finance/security review when appropriate.
5. Activate only approved versions for the approved legal entity and interval.
6. Record rollback/suspension without changing historical applied rules.

## Domain invariants and implementation constraints
1. **ARC-013-REQ-01** A discovered publication does not itself activate a capability.
2. **ARC-013-REQ-02** Conflicting effective rules for the same institution/scope must stop activation.
3. **ARC-013-REQ-03** All bank-specific settlement and accounting capabilities default to disabled.
4. **ARC-013-REQ-04** Maintain immutable historical versions so reports reproduce prior calculations.
5. **ARC-013-REQ-05** Require maker-checker for all money-impacting configuration changes.
6. **ARC-013-REQ-06** Reject rate or reporting policy changes that would silently modify a posted journal.

## Acceptance scenarios — specified, not executed
- [ ] **ARC-013-T-01** Unreviewed capability remains inactive.
- [ ] **ARC-013-T-02** Reject overlapping active configuration intervals.
- [ ] **ARC-013-T-03** Reproduce old account calculation with original version after an amendment.
- [ ] **ARC-013-T-04** Deny capability with expired participation evidence.
- [ ] **ARC-013-T-05** Ensure suspended rail cannot accept new outbound messages.

## Critical dependencies and assurance status
- **To approve:** Signed source provenance, approver roles, accepted institution profile and configuration transition tests.
- **Global controls:** enforce institutional authorization, immutable financial postings, exact monetary arithmetic, independent reconciliation, regulatory evidence and maker-checker as applicable.
- **Known hold:** COBAC I-2015/01 account 312/322 conflict and bank-specific payment authorization remain unresolved in inherited checkpoint CT. Do not activate disputed financial functions.
- **Evidence:** GitHub delivery evidences custody only. Peer review: NOT DONE; banking tests: NOT RUN; production code: NOT ADDED; regulatory certification: NOT CLAIMED.

## Next reviewer action
Confirm institution profile, accountable approvers, test fixtures and referenced authority before advancing this work package toward verified acceptance.
