# CIF-020 — CIF onboarding acceptance framework and handoff readiness

**OPES Core Banking | Batch 60/60 | 2026-11-03 | DRAFT DELIVERED; REVIEW OPEN**

## Objective and bounded scope
Build a formal evidence checklist for identity/onboarding delivery, making clear that 20 draft CIF documents alone do not constitute production functionality or regulatory certification.

## Candidate domain model
| Field | Type | Meaning |
|---|---|---|
| `acceptance_pack_id` | `uuid` | review dossier |
| `institution_profile_id` | `uuid` | deployment applicability |
| `work_package_refs` | `list` | CIF-001..CIF-019 |
| `requirement_count` | `integer` | traceable documented controls |
| `test_case_refs` | `list` | actual executable cases |
| `executed_result_refs` | `list` | only genuine run artifacts |
| `regulatory_source_refs` | `list` | verified instrument evidence |
| `open_findings` | `list` | blocking and advisory items |
| `reviewer_roles` | `list` | legal/compliance/security/ops/QA |
| `approval_state` | `enum` | draft/review/blocked/accepted |

## Process, error and acceptance workflow
1. Map CIF-001..019 candidate controls and schemas to source requirements.
2. Review country/institution identity policies, privacy, KYC/KYB and risk sources.
3. Agree state machines, access roles, APIs, event contracts and retention policies.
4. Build and execute positive, negative, concurrency and cross-institution tests in controlled environment.
5. Require qualified compliance, security, operations, legal and QA evidence-based reviews.
6. Approve only bounded functions that satisfy their full 15-point Definition of Ready and specific acceptance evidence.

## Proposed requirements / prohibitions
1. **CIF-020-REQ-01** Do not mark 20 CIF design checkpoints as 20 completed reviewed work packages.
2. **CIF-020-REQ-02** Onboarding API must enforce identity/risk/approval restrictions before customer activation.
3. **CIF-020-REQ-03** Account and payments contexts remain separate and retain their independent legal/accounting gates.
4. **CIF-020-REQ-04** Any missing binding local KYC rule or unauthorized source leaves dependent capability blocked.
5. **CIF-020-REQ-05** Final approval must cite exact Git revision, test logs, reviewer identity and institution profile.
6. **CIF-020-REQ-06** Document-only acceptance is different from tested implementation and go-live certification.

## Planned acceptance tests — NONE EXECUTED
- [ ] **CIF-020-TEST-01** Audit every CIF package for assigned reviewer and accepted criteria.
- [ ] **CIF-020-TEST-02** Demonstrate prohibited case approval fails all supported UI/API paths.
- [ ] **CIF-020-TEST-03** Test cross-tenant access, stale mandates and disputed identity.
- [ ] **CIF-020-TEST-04** Prove case replay does not create duplicate customer relationship.
- [ ] **CIF-020-TEST-05** Produce final run evidence bundle with no synthetic pass claims.

## Dependencies and reviewer gate
Full historic WBS crosswalk, approved local KYC/legal profile, executable evidence, assigned reviewers and separate release approval.

**Evidence declaration:** Draft customer information system documentation only. No banking production code, testing, sanction screening or regulator certification performed. Work package VERIFIED_COMPLETE: NO. Historical COBAC account mapping and BEAC settlement activation remain separate P0 blockers. Follow institution-specific source verification before implementation.
