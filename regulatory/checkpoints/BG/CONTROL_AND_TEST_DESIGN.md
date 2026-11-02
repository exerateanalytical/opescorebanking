# BG — Proposed controls, temporal model and **unexecuted** acceptance scenarios
**Scope:** non-executable engineering specifications, no production code or banking test execution.

## Model and workflow refinements (incremental to BF)
- Use two separate legal timelines: **instrument force/abrogation** and **institution-specific applicability/transition**. A third timeline captures **regulator plan decision effective period**. Do not collapse them into one global threshold.
- Retain both `effective_at` and `known_at`, source custody, publication reference, signed interpretation, institution ID, category and licence/operation evidence; ensure historical as-of reproducibility without rewriting posted journals.
- Separate `capital_plan_submission`, `regulator_receipt`, `regulator_approval`, `milestone_attestation` and `compliance_evaluation`. No approval by silence or by upload.
- Approved plan: DRAFT → SUBMITTED → RECEIVED → UNDER_REVIEW → APPROVED / REJECTED / WITHDRAWN / EXPIRED / UNKNOWN; any UNKNOWN external outcome must be reconciled with regulator, never retried into approval.
- Compliance evaluation: OUT_OF_SCOPE / INDETERMINATE / REVIEW_REQUIRED / COMPLIANT / NONCOMPLIANT / TRANSITION_CONFIRMED; never publish COMPLIANT from incomplete legal applicability evidence.
- Capital-raising accounting is a **separate, CFO-approved journal workflow** with actual shareholder/settlement evidence, no direct balance mutations. Share capital is not prudential own funds and is not cash in bank.
- Retain immutable signed evidence and role-based audit of source updates, rule promotions and retroactive corrections. Only explicit authorized recalculation changes a regulatory assessment, never journal history.

## Twelve additional BG negative/temporal scenarios (specified, NOT executed)
1. **Old threshold provenance:** reject any 1bn financial-establishment old baseline when issuer R-2009/01 Article 2 specifies 2bn.
2. **Article 7 overlap:** on 2026-12-31, old-threshold satisfaction alone must not yield unconditional COMPLIANT without Article 6 interpretation.
3. **Future repeal:** on 2027-01-01, a rule still keyed to R-2009/01 cannot be silently used as current unqualified minimum.
4. **Backdated plan:** an uploaded plan marked 2026-06-29 but received 2026-07-02 must retain both timestamps and require regulator decision.
5. **Late approval:** a plan submitted timely but approved after the first milestone cannot be treated as approved retroactively without effective-date evidence.
6. **Regulator refusal:** rejected plan cannot be promoted by an internal maker-checker pair.
7. **Changed category:** bank-to-financial-establishment conversion cannot reuse a stale bank transition profile without verified regulatory category decision.
8. **M&A:** merger successor cannot inherit predecessor approval without explicit legal successor mapping and regulator confirmation.
9. **Cross-border tenant:** an institution without CEMAC headquarters cannot be assumed subject to R-2025/02 Article 1 solely because it offers a CEMAC-facing product.
10. **Known-at replay:** a later discovered amendment cannot silently rewrite an earlier signed regulatory filing or ledger; preserve before/after and correction evidence.
11. **Inconsistent capital proof:** nominal share-capital record exceeding threshold while paid-up funding is unverified must not certify Article 5 compliance.
12. **Regulator unreachable:** UNKNOWN approval status must not trigger automatic retry, financial posting, or green compliance dashboard.

## Verification plan once implementation authorized
Property-based boundary tests around 2025-12-31/2026-01-01, 2026-06-30, 2026-12-31/2027-01-01, annual milestone dates; tenant isolation; source-version replay; role separation; idempotent decisions; immutable journals; reconciliation and exception recovery. **No executable tests currently exist or have been run for BG.**
