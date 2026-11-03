# CIF-015 — Customer identity lifecycle, refresh and suspension

**OPES Core Banking | Batch 55/60 | 2026-11-03 | DRAFT DELIVERED / REVIEW OPEN**

## Scope
Model customer identity verification status through renewal, correction, restriction and closure independently of account balance or account-product states.

## Proposed domain model
| Attribute | Type | Reason |
|---|---|---|
| `identity_lifecycle_id` | `uuid` | versioned lifecycle record |
| `party_id` | `uuid` | canonical person or organization |
| `institution_id` | `uuid` | regulated scope |
| `current_status` | `enum` | draft/under_review/verified/restricted/suspended/closed |
| `reason_code` | `string` | approved lifecycle trigger |
| `verification_revision` | `string` | evidence snapshot version |
| `review_required_by` | `datetime|null` | effective refresh date |
| `linked_customer_state` | `string` | customer relationship indicator |
| `decision_actor` | `string` | authorized reviewer |
| `prior_state_ref` | `uuid|null` | immutable transition link |

## Status transition and recovery workflow
1. Receive evidence-change, document-expiry, official notice or customer-submitted correction.
2. Evaluate effective institution policy and associated product/mandate impact.
3. Transition to review/suspension state with explicit reason and authorized actor.
4. Request new identity proof or supporting source and run dependent risk checks.
5. Approve new verified version only after applicable due diligence passes.
6. Preserve historical identity and restriction decision used for old transactions.

## Proposed requirements / invariants
1. **CIF-015-R01** Identity suspension cannot retroactively mutate financial journals or void settled transfers.
2. **CIF-015-R02** A new identity document supersedes the evidence claim, not the stable party ID.
3. **CIF-015-R03** Changing a legal name requires historical alias and source retention.
4. **CIF-015-R04** Closed customer identity must not erase records subject to statutory banking retention.
5. **CIF-015-R05** Restriction changes must notify relevant account/payment domains through versioned events.
6. **CIF-015-R06** Customer reactivation cannot bypass sanctions, risk, signatory or identity reviewer gates.

## Planned acceptance cases — NOT RUN
- [ ] **CIF-015-T01** Expired ID triggers state review without deleting party.
- [ ] **CIF-015-T02** Unverified correction cannot silently clear suspension.
- [ ] **CIF-015-T03** Replay status transition does not duplicate notifications.
- [ ] **CIF-015-T04** Closing CIF does not change posted journal balances.
- [ ] **CIF-015-T05** Old transaction still resolves historical identity revision.

## Dependency and reviewer gate
Institution status transitions, retention rules, cross-domain restrictions and independent compliance/operations approval.

**Status controls:** This draft is not approved law, implementation, test pass or certification. No live data was used; tests executed: 0; production code added: 0; accepted WP: 0. Qualified legal/identity/risk/security/operations reviewers must approve relevant portions before implementation.
