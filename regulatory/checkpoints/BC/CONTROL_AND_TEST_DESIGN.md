# BC — Non-executable controls and proposed acceptance scenarios

## Prudential/security boundary
A sovereign-security risk-weight assessment is an **effective-dated derived regulatory calculation**, never a posted journal, cash receipt, settlement confirmation, liquidity classification or title transfer. A credit-risk analyst proposes classification; risk/compliance validates eligibility; finance reconciles capital impact; maker/checker are distinct. All evidence IDs and policy versions are immutable references. An amended rule triggers versioned recalculation and explanatory audit, **not** backdated alteration of posted journals.

### Proposed decision states
`UNASSESSED → EVIDENCE_INCOMPLETE | INELIGIBLE | ELIGIBILITY_REVIEW → RISK_APPROVED → FINANCE_RECONCILED → REPORTABLE`. A court/regulator change, expired guarantee or evidence invalidation moves assessment to `SUSPENDED_REVIEW`; it must not automatically mutate accounting balances. No transition to `REPORTABLE` without all required source and approval evidence. The exact state machine is **proposed**, not approved or implemented.

### Proposed contracts, not implementation
`RegulatoryInstrumentRef`: issuer, instrument, clause, authenticated-source ID, publication/effective dates, supersession edge, jurisdiction, institution type.
`RiskWeightAssessment`: asset ID, exposure date, instrument reference, issuer/counterparty, secured repayment mechanism ID, risk-weight proposal, eligibility rationale, risk approver, CFO reconciliation ID, version, immutable evidence digest, disposition.
`ITRiskControlEvidence`: institution class, Article ref, applicable date/transition, in-country data availability proof, access/DR/incident/penetration evidence, legal review.
All write requests require idempotency key, optimistic version, authenticated actor and auditable decision. No API is approved for implementation.

### Proposed negative acceptance scenarios — NOT EXECUTED
1. State-issued security with no secured-repayment evidence cannot receive zero weighting.
2. Valid repayment evidence without authenticated R-2021/01 operative clause cannot promote to reportable.
3. Amendment exists but effective date unverified → regulatory calculation publication blocked.
4. Credit-risk 0% treatment must not change GL balances or mark security as settled.
5. R-2021/02 concentration treatment must not inherit R-2021/01 assumptions without its own clause proof.
6. Revoked guarantee triggers review and effective-dated reassessment; no journal rewrite.
7. Duplicate classification request returns same decision/version, no duplicate financial posting.
8. Risk approver and finance approver cannot be same principal where segregation requires distinct roles.
9. Institution-type-specific transition dates cannot be silently conflated with formal commencement.
10. Disaster recovery failover with missing in-country availability evidence must be flagged for legal/operational review.
11. Unverified Art. 30 reporting threshold amendment cannot silently suppress an incident.
12. Unauthorized cross-border data replication or missing approved data residency design must block deployment.
13. Missing immutable audit trail blocks regulatory report publication.
14. Restored ledger/read model discrepancy after failover blocks reconciliation sign-off.
15. Regulatory report value must reconcile to source exposure and approved mapping, without direct balance mutation.

### Evidence requests (draft only; none transmitted)
- COBAC Secretariat: signed R-2021/01 and R-2021/02, all later amendments/instructions, effective-date and publication proofs, legal clarification of R-2010/01 old net-own-funds reference after R-2016/03 and R-2024/01 Article 41 transitional interpretation.
- Bank legal/compliance/CFO: approved institution type, PCEC account map, securities/sovereign exposure classification, guarantee evidence, prudential report mapping, reconciliation and sign-offs.
- Bank CISO/operations: data availability in head-office State, access and privilege evidence, DR failover/return test criteria, incident reporting workflow, source provenance.
- CEMAC/COBAC/BEAC: still outstanding full 01/25–02/25 publication/court/settlement chain, original COBAC–MINFI correspondence and signed page 10.

No tests run; no regulator contacted; no production policy or implementation authorized.
