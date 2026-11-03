# CIF-019 — Onboarding failure, exception and recovery controls

**OPES Core Banking | Batch 59/60 | 2026-11-03 | DRAFT DELIVERED; REVIEW OPEN**

## Objective and bounded scope
Make failures in identity verification, registry access, case review, document upload and screening recoverable without silent approval or evidence loss.

## Candidate domain model
| Field | Type | Meaning |
|---|---|---|
| `exception_id` | `uuid` | failure case |
| `onboarding_case_id` | `uuid` | affected application |
| `institution_id` | `uuid` | authorized scope |
| `failure_class` | `enum` | source_unavailable/mismatch/duplicate/expired/permission/error |
| `detected_at` | `datetime` | failure observation |
| `attempted_step` | `string` | workflow stage |
| `safe_resume_cursor` | `string|null` | durable checkpoint |
| `case_status` | `enum` | pending/investigating/rejected/resolved |
| `operator_owner` | `string` | assigned reviewer |
| `resolution_evidence_ref` | `uuid|null` | closure basis |

## Process, error and acceptance workflow
1. Capture typed failure with redacted context and immutable correlation ID.
2. Determine transient technical issue versus document or legal disqualification.
3. Suspend only affected step and retain case in safe pending/review state.
4. Retry eligible technical operations with idempotency and bounded backoff.
5. Escalate unknown results, contradictory evidence or suspected fraud to qualified owner.
6. Resume after verified resolution using the original case and source provenance.

## Proposed requirements / prohibitions
1. **CIF-019-REQ-01** Provider timeout never implies identity was verified.
2. **CIF-019-REQ-02** Do not automatically delete incomplete cases because a device disconnected.
3. **CIF-019-REQ-03** Retries must not create duplicate CIF/customer numbers.
4. **CIF-019-REQ-04** Regulated investigation and suspicious-case details must remain access restricted.
5. **CIF-019-REQ-05** Unknown source result cannot be normalized into negative or positive certainty.
6. **CIF-019-REQ-06** Error screens and API responses reveal no private information about another customer's candidate matches.

## Planned acceptance tests — NONE EXECUTED
- [ ] **CIF-019-TEST-01** Simulated registry downtime leaves case pending rather than approved.
- [ ] **CIF-019-TEST-02** Duplicated upload callback does not duplicate evidence record.
- [ ] **CIF-019-TEST-03** Retry after crash resumes with same case ID.
- [ ] **CIF-019-TEST-04** Unauthorized support agent cannot force-approve exception.
- [ ] **CIF-019-TEST-05** Failed screening query retains unresolved review obligation.

## Dependencies and reviewer gate
Institution case-handling SOP, exception reason taxonomy, secure operator roles and executed outage/replay tests.

**Evidence declaration:** Draft customer information system documentation only. No banking production code, testing, sanction screening or regulator certification performed. Work package VERIFIED_COMPLETE: NO. Historical COBAC account mapping and BEAC settlement activation remain separate P0 blockers. Follow institution-specific source verification before implementation.
