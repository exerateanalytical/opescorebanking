# CIF-010 — Onboarding customer risk classification and review policy

OPES Core Banking | Batch 50/60 | 2026-11-03 | **DRAFT DELIVERED — REVIEW OPEN**

## Design objective
Design evidence-based customer onboarding risk decisions separate from identity proof, sanctions results and eventual transaction monitoring.

## Candidate schema / evidence record
| Field | Type | Meaning |
|---|---|---|
| `risk_case_id` | `uuid` | risk review |
| `party_id` | `uuid` | subject |
| `institution_id` | `uuid` | policy scope |
| `policy_version` | `string` | effective rules |
| `risk_factors` | `list` | reason-coded observed inputs |
| `risk_band` | `enum` | low/standard/high/undetermined |
| `confidence_state` | `enum` | insufficient/assessed/reviewed |
| `review_required` | `boolean` | enhanced diligence gate |
| `decision_actor` | `string` | authorized compliance reviewer |
| `next_review_due` | `date|null` | approved review date |

## Workflow
1. Select institution/jurisdiction risk policy and customer/product context.
2. Gather only legally justified risk factors and source evidence.
3. Identify missing and contradictory data without silently substituting defaults.
4. Compute explainable preliminary risk recommendation from approved versioned rules.
5. Route high/uncertain assessments to qualified compliance and possibly enhanced due diligence.
6. Record signed decision, policy edition and reevaluation triggers.

## Mandatory proposed controls
1. **CIF-010-REQ-01** Do not invent threshold values or treat model output as binding regulator policy.
2. **CIF-010-REQ-02** Identity verification, screening, eligibility and customer risk assessment remain distinct decisions.
3. **CIF-010-REQ-03** Missing high-impact input generates INSUFFICIENT rather than an arbitrary low-risk result.
4. **CIF-010-REQ-04** Document protected-trait/fairness considerations and prevent unnecessary sensitive proxies.
5. **CIF-010-REQ-05** Only approved personnel may override risk recommendation, with rationale and expiry.
6. **CIF-010-REQ-06** Reassessment on material relationship, geographic, control or product change preserves prior history.

## Acceptance/negative tests (NOT RUN)
- [ ] **CIF-010-T01** Missing required high-risk factor blocks automatic low-risk assignment.
- [ ] **CIF-010-T02** Changed policy version produces separate reproducible decision.
- [ ] **CIF-010-T03** Customer from another institution cannot reuse approval.
- [ ] **CIF-010-T04** Reviewer cannot remove prior decision history.
- [ ] **CIF-010-T05** Explainability output shows source and rule version.

## Gating and source status
**Before acceptance:** Qualified AML/risk owner, effective-dated local policy, assessed fairness/privacy controls and signed test fixtures.

This is a candidate design document only. Qualified legal/compliance review and effective-dated local rules must precede implementation. No banking code, executed tests, regulator approval or customer screening was performed. Unresolved accounting/payment P0 evidence does not become approved through this checkpoint.
