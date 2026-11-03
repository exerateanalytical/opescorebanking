# ACT-003 — Customer and institution product eligibility policy

**OPES Core Banking | Batch 63 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Goal and bounded-context rationale
Separate eligibility, KYC/KYB and channel availability from product advertising.

## Candidate data model
| Field | Type | Purpose |
|---|---|---|
| `eligibility_rule_id` | `uuid` | policy ID |
| `institution_id` | `uuid` | issuer |
| `product_version` | `string` | policy target |
| `party_kind` | `enum` | individual/organization |
| `risk_policy_version` | `string` | KYC/AML input |
| `resident_scope` | `list` | jurisdiction conditions |
| `age_guard` | `string|null` | legal age policy |
| `channel_scope` | `list` | eligible channels |
| `decision_state` | `enum` | eligible/review/denied |
| `reason_codes` | `list` | auditable reasons |

## Proposed workflow
1. Resolve licensed institution and approved product edition.
2. Retrieve versioned customer/KYC and account eligibility evidence.
3. Evaluate approved residency, risk and legal conditions.
4. Defer ambiguous or missing evidence to human review.
5. Return minimal reasoned decision without leaking restricted screening.
6. Store decision provenance and permit controlled reevaluation.

## Invariants and domain requirements
1. **ACT-003-REQ-01** Eligibility is not a substitute for customer identity verification.
2. **ACT-003-REQ-02** Missing mandatory evidence cannot default to eligible.
3. **ACT-003-REQ-03** Product permission must be scoped to licensed institution.
4. **ACT-003-REQ-04** Never hardcode universal legal-age or residency rules.
5. **ACT-003-REQ-05** Customer-facing explanations must not reveal confidential AML suspicion.
6. **ACT-003-REQ-06** Eligibility decisions are versioned and reproducible.
7. **ACT-003-REQ-07** Denied eligibility cannot be bypassed by another channel.

## Negative / acceptance test cases — NOT EXECUTED
- [ ] **ACT-003-T01** Unknown KYC state cannot qualify.
- [ ] **ACT-003-T02** Channel mismatch rejected.
- [ ] **ACT-003-T03** Cross-entity risk decision not reused.
- [ ] **ACT-003-T04** Expired policy edition denied.
- [ ] **ACT-003-T05** Sensitive AML reason hidden from external applicant.

## Definition-of-Ready and closure evidence
Approved product/institution KYC rules, legal age and residency policy, compliance review.

**Status:** Design evidence drafted, not reviewed, implemented, executed or certified. Tests: 0 run. Production code: 0. History: proposed ACT package distinct from historic accounting WP-ACC-005; that package's COBAC 312/322 issue and institution-specific approved PCEC mapping remain P0 blocked. Finance-bearing workflow activation is forbidden until resolved.
