# CIF-007 — Individual identity evidence verification and document custody

**OPES Core Banking | Batch 47/60 | 2026-11-03 | DRAFT DELIVERED; ACCEPTANCE OPEN**

## Purpose
Separate identity-document capture, validation, permitted automated checks and reviewer confirmation with provenance, expiry and privacy controls.

## Candidate records and legal scope
| Attribute | Type | Meaning |
|---|---|---|
| `evidence_id` | `uuid` | immutable evidence identifier |
| `party_id` | `uuid` | individual subject |
| `document_type_code` | `string` | jurisdiction/profile-controlled category |
| `issuing_country` | `string` | declared competent jurisdiction |
| `issuer_name` | `string|null` | claimed issuer |
| `issued_on` | `date|null` | issue date |
| `expires_on` | `date|null` | expiry |
| `encrypted_object_ref` | `string` | restricted original if lawfully retained |
| `verification_method` | `enum` | manual/issuer/authorized-provider |
| `verification_status` | `enum` | captured/pending/mismatch/accepted/rejected |

## Case progression
1. Capture applicant evidence through secure channel with explicit lawful basis.
2. Validate allowed document type, quality, expiration and consistency.
3. Record separate machine observation and authoritative issuer validation where available.
4. Escalate authenticity mismatch, expired documents and identity collision.
5. Store approved result and reviewer identity separately from protected source bytes.
6. Reassess expired or revoked identity claims according to institution policy.

## Verification and authorization invariants
1. **CIF-007-REQ-01** OCR extraction is only an observation, not governmental authenticity proof.
2. **CIF-007-REQ-02** No third-party provider availability may be fabricated; verified method must be recorded.
3. **CIF-007-REQ-03** Never publish raw document bytes, biometric vectors or account IDs to general events.
4. **CIF-007-REQ-04** Reference document images through access-controlled encrypted storage and retention class.
5. **CIF-007-REQ-05** Verification of one document does not imply proof of residence, source of funds or sanction clearance.
6. **CIF-007-REQ-06** Expire/revoke evidence without deleting legally required historical verification decisions.

## Test cases to implement — NOT EXECUTED
- [ ] **CIF-007-TEST-01** Reject expired document under policy.
- [ ] **CIF-007-TEST-02** Unverified OCR result cannot set official verification status.
- [ ] **CIF-007-TEST-03** Unauthorized operator cannot download protected document.
- [ ] **CIF-007-TEST-04** Different person's document detected as mismatch.
- [ ] **CIF-007-TEST-05** Revoked evidence blocks new proof-dependent case approval.

## Closure prerequisites
Approved document list, permitted verifier/legal basis, issuer integration evidence and privacy/security review.

No approval may be inferred from creating or pushing this draft. Context ownership, effective law, user roles, identity security, audit and privacy need qualified approval. Production code generated: 0. Tests executed: 0. Work package independently accepted: NO. Existing regulatory/accounting/payment holds continue.
