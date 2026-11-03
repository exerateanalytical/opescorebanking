# CIF-009 — Duplicate party detection and supervised resolution

OPES Core Banking | Batch 49/60 | 2026-11-03 | **DRAFT DELIVERED — REVIEW OPEN**

## Design objective
Prevent duplicate CIF records and account impersonation while avoiding unsafe automatic merging based on incomplete personal data.

## Candidate schema / evidence record
| Field | Type | Meaning |
|---|---|---|
| `dedupe_case_id` | `uuid` | review case |
| `institution_id` | `uuid` | search boundary |
| `source_party_id` | `uuid` | incoming party |
| `candidate_party_ids` | `list` | potential matches |
| `match_feature_summary` | `list` | minimized comparison evidence |
| `confidence_band` | `enum` | low/medium/high/undetermined |
| `review_state` | `enum` | open/not_same/possible_same/approved_merge |
| `decision_reason` | `string` | human justification |
| `approved_by` | `string|null` | independent checker |
| `merge_version` | `string|null` | authorized revision |

## Workflow
1. Normalize permissible names and identifiers under local data policy.
2. Run exact checks and privacy-safe similarity candidate discovery.
3. Present evidence features and uncertainty to authorized reviewer.
4. Confirm shared or different identity without disclosing unrelated institution data.
5. If approved, consolidate references under versioned merge with complete audit and reversibility plan.
6. Notify impacted relationship/account owners and verify reference integrity.

## Mandatory proposed controls
1. **CIF-009-REQ-01** A matching phone number or name is insufficient for automatic merge.
2. **CIF-009-REQ-02** Never merge two legal entities solely because their trade names are identical.
3. **CIF-009-REQ-03** Duplicate flags cannot trigger unilateral account closure or balance movement.
4. **CIF-009-REQ-04** Do not perform cross-institution biometric or PII matching without explicitly authorized legal basis.
5. **CIF-009-REQ-05** Preserve historical identifiers and original source provenance after approved resolution.
6. **CIF-009-REQ-06** Merges require maker-checker and planned reconciliation for affected external references.

## Acceptance/negative tests (NOT RUN)
- [ ] **CIF-009-T01** Two customers with shared phone remain separate pending review.
- [ ] **CIF-009-T02** Different legal registries with equal local IDs are not auto-merged.
- [ ] **CIF-009-T03** Merge without independent approval is blocked.
- [ ] **CIF-009-T04** All prior audit references remain resolvable after merge.
- [ ] **CIF-009-T05** Cross-institution duplicate search does not leak candidate identities.

## Gating and source status
**Before acceptance:** Approved deduplication policy, privacy impact review, reference migration safeguards and supervised reviewer identities.

This is a candidate design document only. Qualified legal/compliance review and effective-dated local rules must precede implementation. No banking code, executed tests, regulator approval or customer screening was performed. Unresolved accounting/payment P0 evidence does not become approved through this checkpoint.
