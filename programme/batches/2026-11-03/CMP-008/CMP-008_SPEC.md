# CMP-008 — Fraud protective actions and governed customer interventions

Batch 148 | OPES Core Banking | 2026-11-03 | DRAFT, REVIEW OPEN

## Purpose
Separate behavioral risk alerts, mandatory account restrictions and reversible protective interventions according to institution and lawful source authority.

## Candidate data model
| Name | Type | Intent |
|---|---|---|
| `intervention_id` | uuid | Action case |
| `institution_id` | uuid | Regulated bank |
| `subject_ref` | uuid | Customer/account |
| `trigger_ref` | uuid | Alert or legal order |
| `legal_authority_ref` | uuid | Authenticated basis |
| `intervention_type` | string | Review challenge hold freeze |
| `scope` | string | Covered assets/operations |
| `maker_id` | string | Requestor |
| `checker_id` | string | Independent approver |
| `state` | string | Proposed authorized active released |

## State transitions and guards
1. PROPOSED>REVIEW:source checked
2. REVIEW>AUTHORIZED:lawful authority and checker
3. AUTHORIZED>ACTIVE:scoped intervention
4. ACTIVE>RELEASE_REVIEW:resolution evidence
5. RELEASE_REVIEW>RELEASED:independent authority

## Workflow and recovery
1. Review validated signals and current risk policy without assuming guilt
2. Determine whether additional verification, transaction rejection or lawful hold is justified
3. Obtain qualified fraud/legal/financial approval for affected scope
4. Apply minimum necessary restriction through authoritative account policy
5. Review appeal/evidence and release safely without rewriting posted history

## Required controls
1. CMP-008-REQ-01: Fraud alert alone does not grant indefinite legal asset freeze
2. CMP-008-REQ-02: Account restrictions cannot rewrite posted journals
3. CMP-008-REQ-03: Protective action is time/evidence scoped and auditable
4. CMP-008-REQ-04: No unauthorized officer can remove an external lawful hold
5. CMP-008-REQ-05: Do not reveal restricted intelligence case details to general users
6. CMP-008-REQ-06: Money movement after an unknown external outcome is not blindly retried

## Acceptance cases — NOT RUN
- [ ] CMP-008-T01: Freeze without legal authority denied
- [ ] CMP-008-T02: Changed intervention scope requires reapproval
- [ ] CMP-008-T03: Cross-bank restriction denied
- [ ] CMP-008-T04: Released hold preserves history
- [ ] CMP-008-T05: Risk alert leaves journal unchanged

## Evidence gate
Qualified institutional fraud/legal and account policy approval, exact legal authority, authorization and replay tests.

Code: none. Tests executed: zero. Independent review: pending. No regulatory certification. Historical accounting 312/322 and bank-specific rail participation P0s remain blocked.
