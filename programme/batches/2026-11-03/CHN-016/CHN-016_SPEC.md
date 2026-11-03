# CHN-016 — Digital-channel fraud, transaction risk and protective friction

OPES Core Banking | Checkpoint batch 116 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Set transparent channel risk signals and escalation without enabling opaque automated money movement or exposing investigation details.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `risk_session_id` | `uuid` | risk decision context |
| `institution_id` | `uuid` | licensed entity |
| `subject_id` | `string` | actor |
| `device_binding_ref` | `uuid|null` | trusted device |
| `payment_draft_ref` | `uuid|null` | proposed action |
| `signal_codes` | `list` | policy-allowed observations |
| `risk_policy_version` | `string` | approved model |
| `risk_disposition` | `enum` | allow/challenge/review/deny |
| `review_ref` | `uuid|null` | human case |
| `audit_ref` | `uuid` | traceable decision |

## Workflow and recovery design
1. Collect lawful security and behavioral signals with purpose restrictions.
2. Evaluate approved transaction, account, device and customer controls.
3. Present step-up, denial or review without leaking confidential fraud rules.
4. Bind any approval to unchanged financial command digest.
5. Escalate suspicious, uncertain or conflicting signals for human review.
6. Preserve decision evidence and subsequent account/incident correlations.

## Invariants and enforcement requirements
1. **CHN-016-R01** Fraud signal is not an independent declaration of legal guilt.
2. **CHN-016-R02** Unapproved model or data inputs cannot decide regulated access.
3. **CHN-016-R03** Risk denial must not silently mutate financial journals.
4. **CHN-016-R04** Unknown risk result cannot be normalized to safe by default.
5. **CHN-016-R05** Protected characteristics and proxies require fairness/privacy scrutiny.
6. **CHN-016-R06** Cross-institution risk events never leak customer information.
7. **CHN-016-R07** Fraud exception override requires accountable independent checker.

## Acceptance and negative scenarios — planned, not run
- [ ] **CHN-016-T01** Unverified high-risk signal triggers review state.
- [ ] **CHN-016-T02** Challenge on modified payment digest invalidated.
- [ ] **CHN-016-T03** Cross-tenant device evidence rejected.
- [ ] **CHN-016-T04** Repeated fraud event deduplicated.
- [ ] **CHN-016-T05** Privileged risk override logged and independently authorized.

## Dependency and reviewer gate
Bank fraud/AML policy, privacy fairness review, risk governance and actually executed adversarial tests.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
