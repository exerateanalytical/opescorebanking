# CIF-001 — Canonical party and customer identity model

**Programme:** OPES Core Banking | **Batch:** 41/60 | **Date:** 2026-11-03 | **Status:** DRAFT DELIVERED / WP ACCEPTANCE OPEN

## Objective
Define a unique party authority for individuals, legal organizations and relationships without conflating a bank's customer relationship with a person's civil identity.

## Candidate schema / interface metadata
| Field | Type | Meaning |
|---|---|---|
| `party_id` | `uuid` | stable internal party identity |
| `party_kind` | `enum` | person/organization |
| `institution_id` | `uuid` | authorized party tenancy scope |
| `external_ids` | `list` | source-specific identifiers |
| `customer_number` | `string|null` | institution-issued CIF number |
| `legal_name` | `string` | reviewed name representation |
| `aliases` | `list` | prior/alternate names with provenance |
| `identity_state` | `enum` | draft/under_review/verified/suspended/closed |
| `source_evidence_ids` | `list` | verified records |
| `version` | `integer` | optimistic concurrency version |

## Workflow and state changes
1. Create party shell with explicit institution and source provenance.
2. Collect party-kind-specific identifying facts and evidence references.
3. Check duplicates via controlled exact and fuzzy candidate search.
4. Submit identity evidence to independent validation workflow.
5. Approve customer relationship separately from identity observation.
6. Publish versioned change notice while retaining immutable history.

## Proposed requirements and invariants
1. **CIF-001-REQ-01** Party_id never changes when a name, document or customer relationship changes.
2. **CIF-001-REQ-02** External identity-document values cannot be assumed unique or authoritative without source policy.
3. **CIF-001-REQ-03** Do not merge two parties automatically because names or phone numbers match.
4. **CIF-001-REQ-04** Keep person and organization lifecycle requirements distinct.
5. **CIF-001-REQ-05** Every party retrieval or mutation is scoped by licensed institution and actor permission.
6. **CIF-001-REQ-06** An account may refer to approved customer relationships but cannot create an unreviewed civil-identity assertion.

## Acceptance and negative tests (UNEXECUTED)
- [ ] **CIF-001-TEST-01** Prevent cross-institution party read.
- [ ] **CIF-001-TEST-02** Reject duplicate customer_number within the same institution where required.
- [ ] **CIF-001-TEST-03** Concurrent changes produce version conflict rather than last-write-wins.
- [ ] **CIF-001-TEST-04** Party merge request preserves aliases and original audit references.
- [ ] **CIF-001-TEST-05** Identity not verified cannot be represented as verified.

## Approval dependencies and quality status
**Requires:** CIF scope, applicable local identity rules, privacy/legal review and signed institution customer-number policy.

These specifications derive from project governance/checkpoint evidence and propose new design decisions; no legal opinion, independent approval or execution evidence is implied. Tests executed: 0. Production banking code written: 0. WP accepted complete: NO. P0 COBAC account mapping and institution-level payment entitlements remain blocked where implicated.
