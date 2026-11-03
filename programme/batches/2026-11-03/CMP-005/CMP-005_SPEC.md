# CMP-005 — Sanctions and PEP watchlist edition governance

Batch 145 | OPES Core Banking | 2026-11-03 | DRAFT, REVIEW OPEN

## Purpose
Manage source list editions, effective screening, identity-match uncertainty and review ownership without treating fuzzy matching as conclusive legal sanction.

## Candidate data model
| Name | Type | Intent |
|---|---|---|
| `list_edition_id` | uuid | Retrieved source edition |
| `institution_id` | uuid | Applicable entity |
| `issuer_ref` | string | Qualified authority |
| `source_uri` | string | Official/procured source |
| `edition_digest` | string | Measured content fingerprint |
| `effective_at` | datetime | Authenticated start |
| `retrieved_at` | datetime | Actual retrieval |
| `candidate_match_ref` | uuid | Possible alert |
| `reviewer_id` | string | Qualified compliance |
| `status` | string | Discovered verified approved suspended |

## State transitions and guards
1. DISCOVERED>VALIDATING:provenance inspected
2. VALIDATING>APPROVED:authority and use rights reviewed
3. VALIDATING>REJECTED:source invalid
4. APPROVED>SUPERSEDED:new authenticated edition
5. ANY>SUSPENDED:integrity compromise

## Workflow and recovery
1. Identify legally applicable sanctions and PEP sources per institution
2. Retrieve official or contracted editions with actual custody metadata
3. Validate issuer, integrity, license, date and amendment chain
4. Route possible matches through controlled analyst disposition
5. Preserve source edition and decision provenance for each check

## Required controls
1. CMP-005-REQ-01: Name similarity is not final sanctions or PEP determination
2. CMP-005-REQ-02: Unavailable or invalid list source does not silently imply clearance
3. CMP-005-REQ-03: PEP status alone is not criminal conviction
4. CMP-005-REQ-04: List access is purpose restricted and institution scoped
5. CMP-005-REQ-05: No invented watchlist freshness guarantee
6. CMP-005-REQ-06: A new list edition must not erase prior screening evidence

## Acceptance cases — NOT RUN
- [ ] CMP-005-T01: Source digest mismatch blocks approval
- [ ] CMP-005-T02: Unavailable source yields review state
- [ ] CMP-005-T03: Wrong institution watchlist denied
- [ ] CMP-005-T04: False-positive match retains checker rationale
- [ ] CMP-005-T05: Supersession preserves historic edition

## Evidence gate
Authenticated applicable list subscriptions/legal sources, qualified AML reviewer and executed screening-quality tests.

Code: none. Tests executed: zero. Independent review: pending. No regulatory certification. Historical accounting 312/322 and bank-specific rail participation P0s remain blocked.
