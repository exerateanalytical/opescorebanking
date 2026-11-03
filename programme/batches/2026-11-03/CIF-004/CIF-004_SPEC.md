# CIF-004 — Ultimate beneficial ownership and control graph

OPES Core Banking — Batch 44 of 60 | 2026-11-03 | **DRAFT ONLY; INDEPENDENT ACCEPTANCE OPEN**

## Purpose
Define auditable ownership, voting and effective control relationships without inventing statutory thresholds or assuming simple shareholder structures.

## Candidate schema
| Attribute | Type | Intended meaning |
|---|---|---|
| `ownership_edge_id` | `uuid` | relationship evidence ID |
| `subject_party_id` | `uuid` | owner or controller |
| `target_organization_id` | `uuid` | entity controlled |
| `relationship_kind` | `enum` | equity/voting/control/nominee |
| `direct_percentage` | `decimal|null` | source-declared share |
| `effective_from` | `date` | relationship start |
| `effective_to` | `date|null` | end of validity |
| `evidence_ref` | `uuid` | corporate source |
| `verification_state` | `enum` | unverified/reviewed/confirmed/disputed |
| `reviewer_ref` | `uuid|null` | qualified KYB reviewer |

## Controlled workflow
1. Start with legally registered target entity and its owners.
2. Collect source-backed direct ownership, voting and special control claims.
3. Follow intermediate organizations while tracking cycles and uncertainty.
4. Calculate candidate indirect control only under approved policy.
5. Escalate nominees, inconsistencies, politically exposed owners and opaque chains.
6. Approve reviewed graph version with legal/KYB audit references.

## Requirements / invariants
1. **CIF-004-REQ-01** No universal ownership threshold may be hardcoded without verified applicable jurisdiction policy.
2. **CIF-004-REQ-02** Graph traversal must detect loops and terminate deterministically.
3. **CIF-004-REQ-03** Indirect percentage is a derived candidate, not source-verified fact by default.
4. **CIF-004-REQ-04** Ownership, voting rights, and control via agreements must remain distinct dimensions.
5. **CIF-004-REQ-05** Unknown owner is an explicit state, not zero ownership.
6. **CIF-004-REQ-06** All graph and identity evidence access must be constrained to legitimate institution purpose.

## Negative and acceptance test specifications — NOT EXECUTED
- [ ] **CIF-004-T01** Detect cyclic corporate ownership without infinite recursion.
- [ ] **CIF-004-T02** Mixed voting and equity relationships do not get collapsed.
- [ ] **CIF-004-T03** Graph update preserves prior effective history.
- [ ] **CIF-004-T04** Missing evidence leaves beneficial owner unresolved.
- [ ] **CIF-004-T05** Cross-tenant relationship cannot expose another institution's customer.

## Gate and audit notes
Applicable beneficial-ownership obligations, verified policy thresholds, registries and independent AML/legal approval.

No bank onboarding system was implemented or deployed by this batch. Tests executed: 0. Approval/signoff: none. Maintain the existing COBAC chart mapping and BEAC payment entitlement holds in their dependent workstreams. Technical completeness requires per-institution legal/KYC review, evidence-backed decisions and a bounded-context Definition of Ready.
