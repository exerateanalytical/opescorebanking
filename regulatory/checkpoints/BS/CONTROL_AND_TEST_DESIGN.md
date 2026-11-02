# BS — Proposed scope resolution, entitlement and acceptance design (NOT IMPLEMENTED)

## Scope and authority algorithm (proposal, requires legal approval)
1. Identify **licensed institution category** independently of the service: credit institution, microfinance or payment institution. Link to R-04/18 Article 5 and the institution's actual authorization; do not substitute 2023 circular shorthand for category law.
2. Identify **authorized service/product** (mobile money, account-to-account transfer, instant merchant payment, conventional SYSTAC clearing, SYGMA gross settlement, etc.) and **channel** (mobile or non-mobile) separately. No generic inference that every instant, bank or mobile transfer is covered.
3. Resolve issuer-effective, known-at, supersession, contractual and judicial precedence. Flag conflict between 2023 Section I mobile transfer cases and Section IV broader 'mobile or not' instant/merchant terms for legal sign-off.
4. Resolve participant mode (direct/indirect/sub), signed convention, versioned BEAC message profile, technical security and settlement-account responsibility. No bank certification inferred from platform-wide launch.
5. Only after legal and operational authorization may a restitution claim transition from SCOPE_UNRESOLVED to LEGAL_SCOPE_APPROVED; no automatic freeze, debit, release or timer otherwise.
6. Apply separate maker-checker, recipient notice/consent or valid nonresponse, fraud/AML/court precedence, trusted timestamps and recipient funds availability; return is a **new** authorized transaction, not an edit of original final settlement.
7. Preserve exact money, immutable balanced journals, unique financial idempotency, external UNKNOWN outcomes, independent statement reconciliation, tenant isolation and durable DR recovery.

## Proposed contracts and data model
`InstitutionServiceEntitlement`: tenant_id, institution_id, institution_category, license_evidence_id, authorized_service_id, product_id, payment_channel, rail_id, participant_mode, signed_convention_evidence_id, signed_customer_terms_version, issuer_policy_id, legal_approval_id, risk_approval_id, effective_from/to, known_at, status, audit_chain.

`RestitutionPolicyDecision`: case_id, original_payment_id, legal_instrument_version, exact_clause_refs, transaction_type, service_category, channel, source_evidence_digest, legal_scope_status, notified_at, claimed_at, timer_policy_version, hold_eligibility, consent_or_objection_evidence, decision_actor, independent_approver, decision_time, immutable_audit_id.

Proposed API: `POST /v1/restitution-cases/{id}/scope-assessments` (idempotent, legal-policy evidence required); `POST /v1/institution-entitlements/{id}/approvals` (separate approver, no self-approval). Events: `RestitutionScopeAssessmentRequested`, `RestitutionScopeApproved`, `RestitutionScopeRejected`, `InstitutionEntitlementApproved`, `ExternalOutcomeUnknown`. **Not BEAC-sanctioned message contracts.**

## Twelve NEW negative scenarios (specified only; 0 executed)
| ID | Negative case | Required behavior |
|---|---|---|
| BS-T01 | Bank wrongly excluded because 2023 circular says PSP 'exclusively' | Flag legal category conflict; no automatic exemption |
| BS-T02 | All bank transfers deemed eligible merely because R-04/18 Article 5 includes credit institutions | Deny blanket applicability; require specific product/service authorization |
| BS-T03 | Non-mobile instant merchant payment omitted solely because 2023 Section I describes mobile errors | Route to legal interpretation of Section IV, not automatic exclusion |
| BS-T04 | Every non-mobile conventional SYSTAC payment covered because Section IV says 'ou non' | Deny; require instant/merchant product and scope evidence |
| BS-T05 | Payment-institution Article 8 deposit prohibition mechanically imposed on licensed credit institution | Reject institution-category conflation |
| BS-T06 | Central-bank settlement leg treated as an excluded treasury/BEAC payment for the customer's underlying PSP claim | Require actor/role-specific Article 1 legal interpretation |
| BS-T07 | 2023 circular indexed on BEAC site treated as proof of no later amendments | Keep issuer-currentness unresolved and activation disabled |
| BS-T08 | Direct participant entitlement inferred for bank with only indirect participation | Deny technical access and require signed direct agreement |
| BS-T09 | Subparticipant assigned fabricated BEAC settlement account and finality | Reject; require correspondent and settlement evidence |
| BS-T10 | Public BEAC participation information treated as bank-specific conformance or signed convention | Reject unsupported certification |
| BS-T11 | Customer/merchant contractual terms not verified but automated five-minute hold/release scheduled | Keep case SCOPE_UNRESOLVED; no automatic action |
| BS-T12 | SYSTAC2 go-live treated as SYGMA V10 and instant-module production confirmation | Keep both UNKNOWN; separate issuer and institution evidence |

## Required executable fixtures before DoR
Authenticated current legal texts and amendments; issuer/legal opinion; institution license, product approvals and signed terms; BEAC participation agreement, CEMAC-BANK schemas and signature/security profiles; sandbox statements, hold/restitution and finality messages; approved PCEC entries; fault injection for clock skew, delayed notifications, replay and court precedence. **No executable banking tests were run.**
