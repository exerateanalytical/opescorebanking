# BRN-013 — Customer identity and authorized representation at teller counter

Batch 133 | OPES Core Banking | 2026-11-03 | DRAFT, REVIEW OPEN

## Purpose
Require verified in-person customer or representative authority before providing restricted branch services.

## Candidate data model
| Name | Type | Intent |
|---|---|---|
| `counter_session_id` | uuid | Service interaction |
| `institution_id` | uuid | Bank owner |
| `branch_id` | uuid | Location |
| `teller_id` | uuid | Staff actor |
| `party_id` | uuid | Customer identity |
| `identity_evidence_ref` | uuid | Verification proof |
| `mandate_ref` | uuid | Signer or guardian authority |
| `requested_action` | string | Restricted operation |
| `decision_state` | string | Allowed challenge denied |

## State transitions and guards
1. REQUESTED>VERIFYING:identity check
2. VERIFYING>AUTHORIZED:role and identity match
3. VERIFYING>REVIEW:source mismatch
4. AUTHORIZED>CONSUMED:single service action
5. ANY>DENIED:legal or security restriction

## Workflow and recovery
1. Authenticate assigned teller and branch shift
2. Resolve customer CIF by authorized search and source references
3. Compare person/document claim to approved evidence without exposing scans unnecessarily
4. Evaluate company mandate or guardianship scope per requested action
5. Record least-privilege authorization decision and evidence

## Required controls
1. BRN-013-REQ-01: Customer's presence does not automatically establish account mandate
2. BRN-013-REQ-02: Original government ID validity and source must not be inferred from OCR alone
3. BRN-013-REQ-03: CIF data is scoped to customer and institution
4. BRN-013-REQ-04: Teller cannot access protected AML investigation through generic search
5. BRN-013-REQ-05: Expired, revoked or unrelated authority denies a financial operation
6. BRN-013-REQ-06: Cash instruction remains separate from identity review

## Acceptance cases — NOT RUN
- [ ] BRN-013-T01: Expired mandate denies withdrawal
- [ ] BRN-013-T02: Wrong-bank CIF lookup denied
- [ ] BRN-013-T03: Document mismatch triggers review
- [ ] BRN-013-T04: Beneficial owner without signature authority denied
- [ ] BRN-013-T05: Service decision has trace and version

## Evidence gate
Local identification/KYC rules, issuer evidence and bank teller consent/mandate policy.

Code: none. Tests executed: zero. Independent review: pending. No regulatory certification. Historical accounting 312/322 and bank-specific rail participation P0s remain blocked.
