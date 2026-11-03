# ARC-006 — API contract conventions and service ownership

OPES Core Banking | 2026-11-03 | Batch 26/30 | Status: DESIGN DRAFT DELIVERED; APPROVAL OPEN
Provenance: governance/PROGRAMME_RECOVERY_BASELINE_2026-11-03.md; governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.1_2026-11-03.md; regulatory/checkpoints/CT/README.md. This proposes technical governance, not executable code or a certified regulatory conclusion.

## Proposed requirements / policy
1. **ARC-006-R01:** Document endpoints with OpenAPI versions, owner, institution scope, caller entitlement, request schema, response schema and typed error cases.
2. **ARC-006-R02:** Use explicit idempotency key on financial command operations with clear retry and stored-result semantics; reject ambiguous replays.
3. **ARC-006-R03:** Use request correlation IDs, causation IDs, actor ID and institution ID in auditable request metadata without exposing private data in logs.
4. **ARC-006-R04:** Separate command interfaces from read endpoints where financial consistency or query latency warrants it; do not imply all reads are immediately consistent.
5. **ARC-006-R05:** Return stable machine-readable error categories for denied access, invalid state, stale version, conflict, unavailable authority and unknown external outcome.
6. **ARC-006-R06:** Support pagination, filtering and total/continuation semantics for read lists while enforcing institution and branch access at server side.
7. **ARC-006-R07:** Define backward compatibility policy and deprecation windows; disallow silent mutation of active contract fields that clients rely upon.
8. **ARC-006-R08:** Specify authentication, fine-grained authorization, rate controls and operational monitoring as interface requirements without assuming a vendor implementation.

## Design deliverables
- OpenAPI style guide draft
- Command and query error taxonomy
- Idempotency header and response contract

## Acceptance scenarios (unexecuted)
- [ ] AC-1: Every command declares actor and institution scope
- [ ] AC-2: Client retries are unambiguous
- [ ] AC-3: Cross-entity record references denied

## Pending decisions and constraints
- Initial API consumers and authenticated permissions model require approval

## Evidence status
Delivered only a documented technical draft. Work-package completion is not asserted. Tests executed: 0. Production code: 0. Institute-specific and disputed regulatory controls remain blocked until signed authority and review are established.
