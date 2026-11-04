# OPES Core Banking — One-batch consolidated engineering draft

Baseline main: `35e42c291fb2d1ecc32a88957509c6be6d070693`. This directory is a **single consolidated drafting delivery** for 25 domains, preserving historical checkpoints 001–209 and all other source material. It is not a claim of exhaustive accepted WBS, regulator approval, tested code, or implementation readiness.

## Coverage
- [GOV: Governance & institution profiles](domains/GOV_SPEC.md) — 3 proposed command contracts; 5 proposed entity types; 10 unexecuted acceptance scenarios
- [ARC: Architecture & domain contracts](domains/ARC_SPEC.md) — 3 proposed command contracts; 5 proposed entity types; 10 unexecuted acceptance scenarios
- [CIF: Customer/KYC/KYB](domains/CIF_SPEC.md) — 4 proposed command contracts; 6 proposed entity types; 10 unexecuted acceptance scenarios
- [PRD: Product factory](domains/PRD_SPEC.md) — 3 proposed command contracts; 6 proposed entity types; 10 unexecuted acceptance scenarios
- [ACT: Accounts/deposits](domains/ACT_SPEC.md) — 4 proposed command contracts; 7 proposed entity types; 10 unexecuted acceptance scenarios
- [LED: Accounting/ledger](domains/LED_SPEC.md) — 4 proposed command contracts; 6 proposed entity types; 10 unexecuted acceptance scenarios
- [BRN: Branch/teller/vault](domains/BRN_SPEC.md) — 4 proposed command contracts; 6 proposed entity types; 10 unexecuted acceptance scenarios
- [PAY: Payments/clearing/settlement](domains/PAY_SPEC.md) — 4 proposed command contracts; 6 proposed entity types; 10 unexecuted acceptance scenarios
- [CRD: Lending/collections](domains/CRD_SPEC.md) — 5 proposed command contracts; 6 proposed entity types; 10 unexecuted acceptance scenarios
- [TRE: Treasury/FX/ALM](domains/TRE_SPEC.md) — 4 proposed command contracts; 6 proposed entity types; 10 unexecuted acceptance scenarios
- [AML: AML/CFT/sanctions/fraud/risk](domains/AML_SPEC.md) — 4 proposed command contracts; 5 proposed entity types; 10 unexecuted acceptance scenarios
- [REP: Regulatory/statutory reporting](domains/REP_SPEC.md) — 4 proposed command contracts; 6 proposed entity types; 10 unexecuted acceptance scenarios
- [CHN: Digital/corporate/agency channels](domains/CHN_SPEC.md) — 3 proposed command contracts; 6 proposed entity types; 10 unexecuted acceptance scenarios
- [CARD: Card and card-network boundaries](domains/CARD_SPEC.md) — 4 proposed command contracts; 6 proposed entity types; 10 unexecuted acceptance scenarios
- [CRM: Customer service/complaints](domains/CRM_SPEC.md) — 4 proposed command contracts; 5 proposed entity types; 10 unexecuted acceptance scenarios
- [FEE: Fees/interest/tax](domains/FEE_SPEC.md) — 5 proposed command contracts; 6 proposed entity types; 10 unexecuted acceptance scenarios
- [REC: Reconciliation/suspense](domains/REC_SPEC.md) — 4 proposed command contracts; 5 proposed entity types; 10 unexecuted acceptance scenarios
- [SEC: Security/identity/cryptography](domains/SEC_SPEC.md) — 4 proposed command contracts; 6 proposed entity types; 10 unexecuted acceptance scenarios
- [DAT: Data/migration/privacy](domains/DAT_SPEC.md) — 5 proposed command contracts; 5 proposed entity types; 10 unexecuted acceptance scenarios
- [API: Interoperability/integrations](domains/API_SPEC.md) — 4 proposed command contracts; 5 proposed entity types; 10 unexecuted acceptance scenarios
- [INF: Infrastructure/DevSecOps](domains/INF_SPEC.md) — 4 proposed command contracts; 5 proposed entity types; 10 unexecuted acceptance scenarios
- [DR: Availability/BCP/disaster recovery](domains/DR_SPEC.md) — 4 proposed command contracts; 5 proposed entity types; 10 unexecuted acceptance scenarios
- [ADM: Administration/configuration](domains/ADM_SPEC.md) — 3 proposed command contracts; 4 proposed entity types; 10 unexecuted acceptance scenarios
- [TST: QA/certification evidence](domains/TST_SPEC.md) — 3 proposed command contracts; 5 proposed entity types; 10 unexecuted acceptance scenarios
- [REL: Implementation/migration/release](domains/REL_SPEC.md) — 4 proposed command contracts; 5 proposed entity types; 10 unexecuted acceptance scenarios

## Source reconciliation
Pinned GitHub recursive tree at baseline: 1,376 tree entries; 1,086 blobs; 221 ZIP blobs; tree not truncated. Historical 2026-11-03 and 2026-11-04 checkpoint directories retained. Existing canonical master recovery register v0.2 remains provisional; GOV-REC-001 and GOV-WBS-RECON-001 open. These specifications are additive and may overlap prior drafts; field-level reconciliation and approval are required before treating them as authoritative. The approved historical leaf-WP denominator is UNKNOWN.

## Cross-cutting decisions
Financial effects only via immutable balanced journal; idempotent command and inbox/outbox; no direct balance mutation; independent reconciliation; institution-scoped authorization; no self-approval; effective-dated policy; controlled correction; unknown external outcomes held for investigation. Never assert live GIMAC participation or resolve COBAC PCEC 312/322 without authoritative evidence.

## Outstanding completeness requirements
The 25 files provide explicit candidate entities, commands, states, controls, acceptance scenarios and operational contracts; they do **not** establish exhaustive screen-level designs, official primary-law page citations, approved accounting mappings, full executable OpenAPI, physical SQL DDL, executable tests, reviewer signoffs or accepted DoR. Missing items are BLOCKED/OPEN, not silently complete. Detailed historical artifact-by-artifact crosswalk remains open. Binary ZIP remote delivery is separately required and cannot be claimed based on text files.

**NEXT EXACT TASK:** GOV-WBS-RECON-001 — reconcile all 1,086 pinned baseline blobs with leaf WPs and prior specs, produce signed scope inventory, then close unresolved specification gaps without bypassing financial/regulatory blockers.
