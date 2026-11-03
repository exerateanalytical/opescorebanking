# CMP-006 — Protected suspicious activity reporting and disclosure controls

Batch 146 | OPES Core Banking | 2026-11-03 | DRAFT, REVIEW OPEN

## Purpose
Define legally authorized preparation and confidential handling of financial intelligence disclosures, separating internal suspicion from report submission and official receipt.

## Candidate data model
| Name | Type | Intent |
|---|---|---|
| `disclosure_case_id` | uuid | Restricted case |
| `institution_id` | uuid | Reporting entity |
| `case_ref` | uuid | Internal investigation |
| `reporting_authority_ref` | string | Competent destination |
| `legal_basis_ref` | uuid | Applicable obligation |
| `report_content_ref` | uuid | Restricted evidence |
| `maker_id` | string | Compliance preparer |
| `checker_id` | string | Authorized reporting officer |
| `submission_receipt_ref` | uuid | Actual external proof |
| `status` | string | Draft approved submitted acknowledged |

## State transitions and guards
1. DRAFT>REVIEW:required evidence assembled
2. REVIEW>APPROVED:independent authorized signoff
3. APPROVED>SUBMITTED:secure transfer attempted
4. SUBMITTED>ACKNOWLEDGED:verifiable authority receipt
5. ANY>EXCEPTION:transmission uncertainty

## Workflow and recovery
1. Confirm current reporting obligation, legal scope and competent recipient
2. Assemble case narrative and source-backed transaction evidence under restricted access
3. Review confidentiality, proportionality and institutional signatory authority
4. Submit only by authorized secure procedure and retain real transmission evidence
5. Record acknowledgement separately from submission attempt and monitor corrections

## Required controls
1. CMP-006-REQ-01: Internal risk alert does not automatically create statutory report
2. CMP-006-REQ-02: No fabricated submission, authority acknowledgement or filing timeliness
3. CMP-006-REQ-03: Tipping-off restrictions require source-backed legal policy
4. CMP-006-REQ-04: Only named authorized reporting officers can submit restricted disclosures
5. CMP-006-REQ-05: Customer account posting is not modified to prepare a report
6. CMP-006-REQ-06: Retention and disclosure controls are effective-dated and legal reviewed

## Acceptance cases — NOT RUN
- [ ] CMP-006-T01: Unapproved signer blocked
- [ ] CMP-006-T02: No authority endpoint configured prevents submission
- [ ] CMP-006-T03: Transport timeout remains unknown receipt
- [ ] CMP-006-T04: Case detail not visible to teller channel
- [ ] CMP-006-T05: Corrected filing links to original submission

## Evidence gate
Authenticated GABAC/national competent framework and current reporting instructions, compliance officer approval and secure delivery proof.

Code: none. Tests executed: zero. Independent review: pending. No regulatory certification. Historical accounting 312/322 and bank-specific rail participation P0s remain blocked.
