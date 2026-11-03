# CMP-009 — Compliance audit trail, confidentiality and lawful retention

Batch 149 | OPES Core Banking | 2026-11-03 | DRAFT, REVIEW OPEN

## Purpose
Keep compliance decisions independently reconstructable with source custody, justified access and legally reviewed retention without exposing confidential financial intelligence.

## Candidate data model
| Name | Type | Intent |
|---|---|---|
| `audit_record_id` | uuid | Immutable entry |
| `institution_id` | uuid | Bank controller |
| `case_ref` | uuid | Related case |
| `event_class` | string | Review decision disclosure |
| `actor_id` | string | Accountable user |
| `source_evidence_ref` | uuid | Restricted original |
| `occurred_at` | datetime | Business event |
| `retention_policy_ref` | string | Approved period |
| `legal_hold_ref` | uuid | Preservation exception |
| `access_scope` | string | Least-privilege grant |

## State transitions and guards
1. CAPTURED>INDEXED:integrity verified
2. INDEXED>RETAINED:lawful classification
3. RETAINED>LEGAL_HOLD:competent preservation order
4. RETAINED>ELIGIBLE_DISPOSAL:approved retention expiry
5. ELIGIBLE_DISPOSAL>DISPOSED:controlled legal and audit approval

## Workflow and recovery
1. Capture source, actor, decision and timing with immutable correlation
2. Classify AML and legal-disclosure information with fine-grained confidentiality
3. Derive retention schedule from verified institution and jurisdiction sources
4. Apply encryption, dual-controlled export and legal-hold controls
5. Verify integrity and preserve disposal decisions as independent audit proof

## Required controls
1. CMP-009-REQ-01: Statutory banking or AML evidence is not deleted on generic request
2. CMP-009-REQ-02: Compliance audit cannot be edited by ordinary application operator
3. CMP-009-REQ-03: Potentially restricted disclosure material is never exposed in customer channels
4. CMP-009-REQ-04: Unverified legal retention period cannot be assumed
5. CMP-009-REQ-05: All exports include source cursor, approval, evidence digest and recipient identity
6. CMP-009-REQ-06: Cross-institution case evidence access is denied and logged

## Acceptance cases — NOT RUN
- [ ] CMP-009-T01: Teller cannot retrieve restricted disclosure
- [ ] CMP-009-T02: Legal hold prevents scheduled deletion
- [ ] CMP-009-T03: Evidence manipulation fails integrity review
- [ ] CMP-009-T04: Wrong-bank export denied
- [ ] CMP-009-T05: Disposal requires qualified approval

## Evidence gate
Qualified privacy counsel, applicable regulatory recordkeeping obligations, restricted audit access and actual integrity tests.

Code: none. Tests executed: zero. Independent review: pending. No regulatory certification. Historical accounting 312/322 and bank-specific rail participation P0s remain blocked.
