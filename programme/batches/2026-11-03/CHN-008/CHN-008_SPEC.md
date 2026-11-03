# CHN-008 — Beneficiary enrolment, trust and validation controls

OPES Core Banking | Checkpoint batch 108 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Define trusted beneficiary creation, verification, maintenance and revocation independently of a payment request.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `beneficiary_id` | `uuid` | registered recipient |
| `institution_id` | `uuid` | bank context |
| `customer_id` | `uuid` | owner |
| `destination_rail` | `string` | approved destination system |
| `account_reference` | `string` | protected account token |
| `display_label` | `string` | customer nickname |
| `validated_name_ref` | `string|null` | source-evidenced name |
| `verification_state` | `enum` | unverified/pending/verified/blocked |
| `activated_at` | `datetime|null` | approved start |
| `version` | `integer` | revision control |

## Workflow and recovery design
1. Capture recipient details and permitted account identifiers.
2. Normalize and validate syntax against target rail/profile.
3. Perform authorized ownership/name verification where supported.
4. Apply risk screening and step-up before high-risk activation.
5. Store versioned beneficiary status with edit, pause and revoke actions.
6. Revalidate status immediately before each payment.

## Invariants and enforcement requirements
1. **CHN-008-R01** Successful syntax validation is not evidence of beneficiary ownership.
2. **CHN-008-R02** No unverified recipient auto-activation where institution policy requires checks.
3. **CHN-008-R03** Editing account reference revokes prior approval and confirmation.
4. **CHN-008-R04** Do not expose full recipient account data in unrelated logs.
5. **CHN-008-R05** Cross-customer beneficiary IDs cannot be reused without authorization.
6. **CHN-008-R06** A blocked recipient cannot receive a new authorized instruction.
7. **CHN-008-R07** Proof of identity and payment finality remain separate controls.

## Acceptance and negative scenarios — planned, not run
- [ ] **CHN-008-T01** Update recipient reference invalidates saved challenge.
- [ ] **CHN-008-T02** Cross-tenant beneficiary lookup denied.
- [ ] **CHN-008-T03** Expired verification forces review.
- [ ] **CHN-008-T04** Fraud-blocked beneficiary cannot be selected.
- [ ] **CHN-008-T05** Unverified name check cannot be shown as verified.

## Dependency and reviewer gate
Institution payments scheme rules, authorized validation sources, risk approval and secure API tests.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
