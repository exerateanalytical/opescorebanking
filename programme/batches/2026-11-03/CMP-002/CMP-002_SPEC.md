# CMP-002 — Customer AML risk assessment and ongoing due diligence linkage

Batch 142 | OPES Core Banking | 2026-11-03 | DRAFT, REVIEW OPEN

## Purpose
Integrate approved customer risk decisions with KYC, KYB, beneficial ownership and changes of circumstance while preserving source evidence.

## Candidate data model
| Name | Type | Intent |
|---|---|---|
| `assessment_id` | uuid | Risk review |
| `institution_id` | uuid | Bank controller |
| `party_id` | uuid | Customer identity |
| `risk_policy_version` | string | Approved logic |
| `risk_factor_refs` | array | Observed evidence |
| `risk_category` | string | Policy-defined tier |
| `confidence_state` | string | Sufficient or pending |
| `review_due_at` | datetime | Reassessment due |
| `approved_by` | string | Compliance reviewer |
| `decision_state` | string | Draft review approved blocked |

## State transitions and guards
1. DRAFT>ASSESSING:evidence collected
2. ASSESSING>REVIEW:policy result obtained
3. REVIEW>APPROVED:qualified reviewer
4. REVIEW>INSUFFICIENT:missing mandatory source
5. APPROVED>REASSESSMENT:material changed circumstances

## Workflow and recovery
1. Resolve effective institution AML and customer policy
2. Read legally permitted verified KYC/KYB evidence
3. Evaluate risk factors as documented policy candidates with explainability
4. Escalate unresolved, inconsistent and high-risk cases to qualified staff
5. Persist approved risk status, effective interval and refresh triggers

## Required controls
1. CMP-002-REQ-01: Missing important evidence cannot default to low risk
2. CMP-002-REQ-02: No legally unverified AML threshold is hardcoded
3. CMP-002-REQ-03: Customer risk status and sanctions list disposition remain separate
4. CMP-002-REQ-04: High-risk factors do not by themselves prove wrongdoing
5. CMP-002-REQ-05: Only authorized staff can override, with recorded justification
6. CMP-002-REQ-06: Personal/protected data use must respect purpose limits

## Acceptance cases — NOT RUN
- [ ] CMP-002-T01: No KYC cannot auto-approve
- [ ] CMP-002-T02: New control owner triggers reassessment
- [ ] CMP-002-T03: Risk decision version preserved
- [ ] CMP-002-T04: Unauthorized staff cannot override
- [ ] CMP-002-T05: Cross-institution customer risk lookup blocked

## Evidence gate
Approved bank AML policy, legal KYC obligations, independent Risk/Compliance reviewer and fairness/security tests.

Code: none. Tests executed: zero. Independent review: pending. No regulatory certification. Historical accounting 312/322 and bank-specific rail participation P0s remain blocked.
