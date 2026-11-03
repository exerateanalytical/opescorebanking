# CIF-014 — Consent, privacy notices and legal processing basis

**OPES Core Banking | Batch 54/60 | Date 2026-11-03 | DRAFT / REVIEW OPEN**

## Objective
Record an auditable purpose and legal basis for processing customer information without incorrectly relying on consent where another legal basis governs mandatory banking obligations.

## Candidate structured data model
| Attribute | Type | Definition |
|---|---|---|
| `processing_basis_id` | `uuid` | legal processing decision |
| `institution_id` | `uuid` | legal controller |
| `party_id` | `uuid` | affected customer |
| `purpose_code` | `string` | defined processing purpose |
| `lawful_basis_code` | `string` | jurisdiction-qualified basis |
| `notice_version` | `string` | presented disclosure |
| `consent_state` | `enum` | not_required/explicit_granted/withdrawn/unknown |
| `evidence_timestamp` | `datetime` | observed action |
| `channel` | `string` | where notice was delivered |
| `retention_policy_id` | `string` | effective lifecycle |

## Workflow sequence
1. Select customer-processing purpose and applicable institution privacy policy.
2. Determine qualified legal basis, and whether consent is actually necessary.
3. Show a language-accessible versioned notice to the customer where required.
4. Record signed or authenticated opt-in only for consent-based purposes.
5. Enforce channel/marketing preferences separately from mandatory compliance processing.
6. Handle withdrawal, correction and access requests with lawful retention exceptions.

## Proposed policy controls
1. **CIF-014-REQ-01** Consent withdrawal cannot automatically delete mandatory AML and financial records.
2. **CIF-014-REQ-02** Marketing consent must not be bundled with required identity verification as one forced switch.
3. **CIF-014-REQ-03** Do not silently repurpose biometric or ID evidence for unrelated analytics.
4. **CIF-014-REQ-04** Track notices, languages, versions and accessible delivery channels.
5. **CIF-014-REQ-05** Keep purpose scope and downstream recipients bounded and auditable.
6. **CIF-014-REQ-06** Regulatory retention overrides must be source-backed, not guessed or globally hardcoded.

## Acceptance scenarios — NOT EXECUTED
- [ ] **CIF-014-T01** Withdraw marketing permission while preserving mandatory retention.
- [ ] **CIF-014-T02** Unconsented optional purpose denied.
- [ ] **CIF-014-T03** Wrong notice version cannot be counted as accepted.
- [ ] **CIF-014-T04** Unauthorized bulk-export of customer personal data blocked.
- [ ] **CIF-014-T05** Right-to-access response applies institution and privacy permissions.

## Approval dependency
Qualified local data-protection review, current effective privacy rules, institution retention schedule and accessible notices.

**Assurance status:** This is an evidence-labeled draft requiring jurisdiction and institution-specific compliance review. No live screening, customer data processing, production code, tests or statutory acceptance occurred in the batch. Financial accounting/payment blockers from CT remain outside this work and are not bypassed.
