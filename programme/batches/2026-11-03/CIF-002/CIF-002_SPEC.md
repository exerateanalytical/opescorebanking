# CIF-002 — Natural person identity data and verification boundaries

**Programme:** OPES Core Banking | **Batch:** 42/60 | **Date:** 2026-11-03 | **Status:** DRAFT DELIVERED / WP ACCEPTANCE OPEN

## Objective
Define minimally necessary individual identity attributes and independent evidence status across jurisdictions, without treating self-declared information as government verified.

## Candidate schema / interface metadata
| Field | Type | Meaning |
|---|---|---|
| `person_id` | `uuid` | party reference |
| `given_names` | `list` | typed name fields |
| `family_name` | `string` | declared family name |
| `date_of_birth` | `date|null` | verified or declared date |
| `nationality_codes` | `list` | source-verified nationality |
| `residency_country` | `string|null` | effective residency |
| `document_refs` | `list` | restricted evidence metadata |
| `contact_methods` | `list` | verified phone/email claims |
| `identity_evidence_state` | `enum` | unverified/pending/verified/rejected |
| `guardian_ref` | `uuid|null` | if policy permits |

## Workflow and state changes
1. Create individual profile with consent/legal basis and data minimization.
2. Validate local name/script/date conventions without invented mandatory IDs.
3. Obtain evidence from permitted customer channel or official verifier.
4. Check document validity, expiration and duplicate identity candidates.
5. Escalate mismatch, vulnerability or minor/guardian cases to authorized review.
6. Issue an evidence-backed identity state while preserving source attribution.

## Proposed requirements and invariants
1. **CIF-002-REQ-01** Declared identity and officially verified identity are distinct claim types.
2. **CIF-002-REQ-02** Do not store biometric templates, document scans or government IDs without explicit lawful policy.
3. **CIF-002-REQ-03** Store sensitive documents under separate encryption/access and retention controls.
4. **CIF-002-REQ-04** Verification success for one document cannot automatically verify all identity claims.
5. **CIF-002-REQ-05** Permit corrections through immutable reviewed events instead of overwriting the evidence trail.
6. **CIF-002-REQ-06** Do not infer nationality, legal residency or sanctions status from a phone number or name.

## Acceptance and negative tests (UNEXECUTED)
- [ ] **CIF-002-TEST-01** Expired proof cannot satisfy current policy.
- [ ] **CIF-002-TEST-02** Missing required consent/legal basis blocks optional sensitive processing.
- [ ] **CIF-002-TEST-03** Mismatch between declared and evidenced birth date triggers review.
- [ ] **CIF-002-TEST-04** Cross-tenant access to document metadata rejected.
- [ ] **CIF-002-TEST-05** Correction creates immutable before/after audit record.

## Approval dependencies and quality status
**Requires:** Institution KYC policy, local privacy advice, permitted identity verification source and accessible review workflow.

These specifications derive from project governance/checkpoint evidence and propose new design decisions; no legal opinion, independent approval or execution evidence is implied. Tests executed: 0. Production banking code written: 0. WP accepted complete: NO. P0 COBAC account mapping and institution-level payment entitlements remain blocked where implicated.
