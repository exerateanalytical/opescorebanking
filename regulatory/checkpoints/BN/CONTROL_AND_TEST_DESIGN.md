# BN — Linked-obligor/exposure authority design and negative tests
**Proposed only. No signed ADR, schema migration, executable banking test, or compliance approval.**

## Proposed requirements, incremental to BM
- BN-REQ-01: Model a **versioned connected-beneficiary graph**, separate from annual grand-standing eligibility. Preserve both legal-person and consolidated beneficiary-group identifiers with effective and known-at dates. Group relationships require documented provenance; names alone are insufficient.
- BN-REQ-02: Historical R-2010/02 Article 3 supports candidate relationship predicates (control, common parent, de-facto management, financially dependent public entities, specified equity/guarantee/business links). The *current* applicable definition requires R-2020/01/R-2021/02 and later amendments before executable thresholds are enabled.
- BN-REQ-03: Any regulator-authorized separation of otherwise connected beneficiaries requires an attributable COBAC decision with exact bank, persons, effective period and revocation; never derive separation from an analyst toggle.
- BN-REQ-04: Exposure inventory covers on-balance credit, leasing, securities, correspondent claims, off-balance client and correspondent commitments, subject to the **current** approved regulatory scope and effective-dated treatment.
- BN-REQ-05: Guarantee/security deductions require instrument eligibility, valid coverage period, enforceability, guarantor, amount, concentration/substitution logic, approved prudential basis and dual review. Unknown collateral status must not reduce exposure.
- BN-REQ-06: Current numerator/denominator, own funds, consolidation basis, FX conversion, rounding, single-name and aggregate limits are unapproved until signed current regulations and bank methodology are available.
- BN-REQ-07: Sovereign-security zero-weighting mentioned in BEAC's 2021 review is conditional; no 0% default. Retrieve actual R-2021/02 and associated instructions before any executable exception.
- BN-REQ-08: Annual roster entry, bank-specific supervisory eligibility and formula version are independent gates. Missing or conflicting legal evidence returns `NO_COMPLIANCE_DETERMINATION`.
- BN-REQ-09: Prudential calculations are projections only; they never post, reverse, revalue, or alter GL, settlements, customer balances or treasury liquidity.
- BN-REQ-10: Regulator reporting corrections require bitemporal reconstruction and maker-checker with immutable original return; cannot silently replace previously filed submissions.
- BN-REQ-11: Any historical document numbering anomaly must retain page image anchor and literal original numbering; legal counsel must resolve references before approved rule activation.
- BN-REQ-12: All evidence must be tenant-scoped, least-privilege, encrypted at rest/in transit, append-only audited, retention/hold governed and recoverable after DR.

## Proposed command/read boundary
`POST /v1/prudential/obligor-group-reviews`: draft evidence review, idempotency key, tenant authorization, maker-checker; no financial side effect.
`POST /v1/prudential/guarantee-eligibility-reviews`: validate documentary evidence; does not apply deduction until current policy is approved.
`GET /v1/prudential/exposure-assessments/{id}/lineage`: bitemporal source, legal-entity/group, rule version, method and bank approvals; redacted to authorized roles.
`POST /v1/prudential/assessment-restatements`: controlled restatement request only; preserves original submitted return.
`BeneficiaryGroupEvidenceChanged` / `PrudentialAssessmentSuspended`: outbox/inbox deduplicated informational events; subscribers cannot mutate Accounting Core.
These are *design proposals*, not available APIs.

## 14 new negative acceptance specifications — not executed
1. A group affiliate is omitted because it uses a trading name: flag incomplete aggregation; no compliance determination.
2. Two unrelated entities share a similar name: prevent automatic group merge.
3. An analyst separates a linked group without a COBAC decision: reject.
4. A valid separation decision for Bank A is reused by Bank B: reject cross-tenant authority.
5. A separation decision expired before the assessment as-of date: reject.
6. An off-balance guarantee is omitted from the inventory solely because it is not a posted GL debit: block incomplete assessment.
7. An unenforceable or expired collateral instrument reduces exposure: reject.
8. A partial guarantee is treated as full cover: reject.
9. Guarantor substitution ignores residual exposure or guarantor concentration: reject.
10. A 2010 half-reduction rule is applied to a 2026 annual-roster case: reject historical-rule fallback.
11. A 2021 summary is interpreted as universal 0% weight for all sovereign securities: reject.
12. Numerator from consolidated basis is divided by social-basis own funds: reject mixed basis.
13. A conflicting legal citation is silently auto-corrected in the audit trail: reject and retain both literal sources.
14. An eligibility/obligor event replay creates a second posting or edits an existing journal: reject; accounting unchanged.

## Operational acceptance gates
Fail-closed and alert on incomplete sources, amendment ambiguity, identity conflict, source integrity failure, stale guarantees, missing bank approvals, duplicate events, inaccessible legal holds or irreconcilable bitemporal versions. Preserve recovery/replay logs. Operational metrics and alert thresholds remain to be institution-approved.

**No executable tests run.** No P0 resolved; no DoR satisfied.
