# BI — Requirements, controls, proposed contracts and negative scenarios (NOT IMPLEMENTED)

## Traceability / ownership
| ID | Requirement or invariant | Owner | Evidence | Status |
|---|---|---|---|---|
| BI-REQ-01 | Classify correspondence by recipient, period, legal status and normative vs case scope | Regulatory Authority | LC-COB/44 image; R-2025/02 | DESIGN |
| BI-REQ-02 | Distinguish corporate approval from COBAC submission, receipt and signed decision | Institution Governance + Regulatory Compliance | 2009 circular vs 2025 Article 6 | DESIGN; 2026 approval absent |
| BI-REQ-03 | Distinguish subscribed, paid-up, own funds, settlement and compliance status | Capital Evidence + Accounting Core | R-2025/02 Article 5, financial invariants | DESIGN; bank PCEC missing |
| BI-REQ-04 | Version-pin legal interpretation and instrument amendments by as-of date and institution | Regulatory Authority | Article 4/6/7 conflict | HOLD |
| BI-REQ-05 | Reject automated compliance conclusions where regulator/corporate evidence is missing | Compliance Review | P0 evidence gap | DESIGN |
| BI-REQ-06 | Preserve provenance and custody of scanned letters, PDFs and approvals | Evidence Vault | Source custody gap | DESIGN |
| BI-REQ-07 | Require independent finance reconciliation for any capital realization | Accounting Core + CFO | Bank-specific records absent | HOLD |
| BI-REQ-08 | No plan/approval/status event may trigger GL posting | Accounting Core | Financial invariants | DESIGN |

## Actors and segregation
Maker: legal/compliance evidence registrar. Checker: independent legal approver. Corporate secretary records board resolution but cannot create a COBAC decision. Regulator correspondence officer records submission/receipt but cannot mark approved without signed decision. CFO reconciles paid-up capital and PCEC entries; independent controller verifies evidence. Accounting Core alone can authorize ledger commands under approved workflows. Tenant scope on every resource, maker != checker, append-only audit, cryptographic provenance after byte custody.

## Proposed contract boundaries (not approved API)
`RecordCorporateCapitalPlanApproval(tenant, plan_id, resolution_id, authority_id, date, idempotency_key)` -> evidence-only.
`RecordRegulatorPlanSubmission(tenant, plan_id, regulator_ref, submitted_at, receipt_id_nullable, idempotency_key)` -> cannot set approved.
`RecordRegulatorPlanDecision(tenant, plan_id, signed_document_id, outcome, conditions, effective_window, idempotency_key)` -> two-person verification.
`RequestCapitalComplianceAssessment(tenant, as_of_date, legal_policy_version, capital_evidence_version, idempotency_key)` -> HOLD / REVIEW / ASSESSABLE; never GL posting.
Events: `CorporateCapitalPlanApproved`, `RegulatorSubmissionAcknowledged`, `RegulatorCapitalPlanDecisionVerified`, `CapitalEvidenceReconciled`, `CapitalAssessmentHeld`. Each carries tenant, event_id, occurred_at, recorded_at, source_version, actor, trace_id; inbox/outbox semantics proposed. **None is a financial posting event.**

## New negative acceptance scenarios (specified, not executed)
| ID | Condition | Expected result |
|---|---|---|
| BI-T01 | 2009 LC-COB/44 treated as current 2026 universal legal threshold | Reject source scope |
| BI-T02 | Historical addressee 6bn figure applied to every bank | Reject case-to-rule promotion |
| BI-T03 | Corporate board-approved plan marked COBAC approved | Reject authority substitution |
| BI-T04 | COBAC submission receipt mistaken for approval | HOLD regulator decision |
| BI-T05 | Signed COBAC approval but no bank reconciliation | HOLD financial compliance |
| BI-T06 | Plan approval references another tenant | Reject and audit IDOR |
| BI-T07 | Internal approval date backdated after regulator rejection | Reject unauthorized history mutation |
| BI-T08 | Article 6 and 7 overlap resolved by arbitrary maximum threshold | HOLD legal interpretation |
| BI-T09 | Report catalogue listing treated as proof of 2025 report content | Reject uninspected source |
| BI-T10 | Original PDF bytes absent, a SHA-256 copied from browser text | Reject hash/custody claim |
| BI-T11 | Compliance status change triggers paid-up capital journal | Reject status-driven money creation |
| BI-T12 | Regulator decision outcome unknown after timeout and retried as approved | Preserve UNKNOWN, reconcile; no duplicate |
| BI-T13 | New 2026 institution receives legacy existing-institution relief | Reject wrong institution class |
| BI-T14 | Legal policy amended after assessment, old assessment silently overwritten | Preserve prior immutable assessment, new version review |

## Operations and quality gates
Missing authority store -> fail closed for rule promotion; regulator communication outcome UNKNOWN -> investigate without inferred approval; audit must reconstruct each document/version/actor/approval and distinguish historical case correspondence from normative rule. No direct balance mutation, no retry-driven duplicate posting, no invented cash, liquidity or settlement. Retention remains policy-gated until current law and bank schedule approved. Metrics: evidence pending by source, stale interpretations, unsigned decisions, unverified receipts, capital reconciliation exceptions; no invented thresholds or compliance score.
