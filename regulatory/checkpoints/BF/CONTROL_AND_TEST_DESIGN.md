# BF — proposed capital-policy authority controls and negative acceptance cases
**Design only.** This is not a regulatory approval, banking implementation or executed test suite.
## Bounded contexts
- **Regulatory Authority Registry:** versioned instrument/Article; issuer; legal jurisdiction; publication chain; amendments; court effect; source custody; recorded_at vs effective_at; reviewer decision; fail-closed.
- **Institution Regulatory Profile:** bank vs financial establishment, license date, CEMAC headquarters, regulator, plan submission and **separately verified approval**, category-specific transitional eligibility.
- **Corporate Capital / Finance:** issued and paid-up capital evidence and shareholder transactions; no synthetic postings or balance mutations by compliance assessment.
- **Prudential Risk:** net own funds, exposure risk weighting and concentration remain separate from nominal social capital; no zero-weight rule imported from incomplete R-2021 amendments.
- **Regulatory Compliance:** evaluate at an effective date using approved source, institution profile and signed exception; show UNKNOWN rather than a fabricated pass/fail when inputs absent.
- **Customer Complaints (R-2020/01):** separate evidence/response/appeal process, never a direct financial posting path.
## Proposed states
SOURCE_DISCOVERED → TEXT_REVIEWED → PUBLICATION_PROVEN → AMENDMENTS_RECONCILED → LEGAL_APPROVED → INSTITUTION_APPROVED → POLICY_APPROVED → ACTIVE; any conflict or missing evidence → HOLD/REVIEW_REQUIRED. Capital plan: DRAFT → SUBMITTED → ACKNOWLEDGED → APPROVED or REJECTED or UNKNOWN; submission alone never means approval. Evaluation: NOT_APPLICABLE / INDETERMINATE / COMPLIANT / BREACH / UNDER_APPROVED_TRANSITION.
## Twelve unexecuted negative acceptance scenarios
1. New bank licensed after 2026-01-01 with no capital evidence must be INDETERMINATE, not compliant.
2. Financial establishment must not inherit bank's 25bn threshold.
3. Existing bank must not automatically receive staged transition when no approved plan is evidenced.
4. Plan submitted by deadline but approval UNKNOWN must not become APPROVED.
5. Plan approved for one institution must not be applied to another tenant.
6. Rule dated 2026-01-01 must not overwrite previously posted journals.
7. R-2009/01 grandfathering must not be applied to post-commencement institutions.
8. Unknown official Bulletin publication must prevent automatic executable activation.
9. Missing amendment history must prevent unconditional legal compliance certification.
10. Capital shortfall status must not create, reverse or change any ledger amount.
11. An external capital injection claimed but unsettled must not count as proven paid-up capital.
12. An R-2020/01 complaint about an unauthorized debit must not directly reverse funds without the accounting authorization workflow.
## Observability / audit requirements
Retain instrument hash once acquired, legal approvers, institution approvers, evaluation inputs, rule version, effective date, decision rationale, exception expiry, maker-checker, audit trace and change replay. No UI-only authorization. All accounting changes flow through independently authorized immutable journal posting and reconciliation.
