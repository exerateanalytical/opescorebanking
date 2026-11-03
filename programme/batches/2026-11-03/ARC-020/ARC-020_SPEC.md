# ARC-020 — Architecture review and transition-to-implementation decision dossier

**Programme:** OPES Core Banking | **Batch:** 40/60 | **Date:** 2026-11-03 | **Status:** DRAFT DELIVERED / WP ACCEPTANCE OPEN

## Objective
Publish a reviewable architecture exit gate that distinguishes completed drafting from independently accepted architecture and domain-specific implementation readiness.

## Candidate schema / interface metadata
| Field | Type | Meaning |
|---|---|---|
| `decision_id` | `uuid` | review decision identity |
| `architecture_version` | `string` | proposal baseline version |
| `bounded_context` | `string` | affected domain |
| `institution_profile_id` | `uuid|null` | applicability |
| `adr_refs` | `list` | referenced decisions |
| `requirement_coverage` | `string` | reconciled source coverage |
| `open_p0` | `list` | blocking unresolved issues |
| `reviewer_role` | `string` | qualified approval position |
| `evidence_refs` | `list` | executed review artifacts |
| `decision_status` | `enum` | draft/accepted/rejected/blocked |

## Workflow and state changes
1. Reconcile ARC-001 through ARC-019 draft deliverables with original historical artifacts.
2. Review each ADR, domain boundary, API/event contract, architecture security and test plan.
3. Map unresolved regulatory and financial conflicts to dependent production slices.
4. Collect legal, CFO, CISO, Operations and Architecture reviewer decisions separately.
5. Accept only bounded portions with complete applicable Definition of Ready evidence.
6. Version approved baseline and preserve rejected alternatives and open findings.

## Proposed requirements and invariants
1. **ARC-020-REQ-01** A pushed batch ZIP proves custody, not architectural acceptance.
2. **ARC-020-REQ-02** Do not advance disputed accounting, credit classification or settlement behavior to implementation.
3. **ARC-020-REQ-03** No single reviewer can override critical legal/financial/security rejection.
4. **ARC-020-REQ-04** Historical work package numbers cannot be silently mapped to new ARC identifiers.
5. **ARC-020-REQ-05** Implementation release must reference current effective institution profile and approved source instruments.
6. **ARC-020-REQ-06** Maintain immutable review evidence and a new review whenever material assumptions change.

## Acceptance and negative tests (UNEXECUTED)
- [ ] **ARC-020-TEST-01** Audit 19 preceding architecture drafts for acceptance evidence.
- [ ] **ARC-020-TEST-02** Try to approve without reviewer and expect rejection.
- [ ] **ARC-020-TEST-03** Reject an implementation slice with P0 dependency.
- [ ] **ARC-020-TEST-04** Verify independent unrelated context can pass only its own 15 DoR checks.
- [ ] **ARC-020-TEST-05** Confirm approval decision preserves exact Git commit and evidence digests.

## Approval dependencies and quality status
**Requires:** Named independent reviewers, completed historical reconciliation and signed per-slice DoR review.

These specifications derive from project governance/checkpoint evidence and propose new design decisions; no legal opinion, independent approval or execution evidence is implied. Tests executed: 0. Production banking code written: 0. WP accepted complete: NO. P0 COBAC account mapping and institution-level payment entitlements remain blocked where implicated.
