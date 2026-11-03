# CHN-020 — Digital channels acceptance dossier and implementation readiness gate

OPES Core Banking | Checkpoint batch 120 of 120 | 2026-11-03 | Status: DRAFT_DELIVERED, independently unaccepted

## Bounded scope
Reconcile CHN-001 through CHN-019 documentation against testable acceptance evidence without confusing channel mockups and ZIP delivery with production banking capabilities.

## Proposed data or interface model
| Field | Type | Definition |
|---|---|---|
| `channel_acceptance_id` | `uuid` | dossier |
| `institution_id` | `uuid` | target licensed bank |
| `document_package_refs` | `list` | CHN-001..CHN-019 |
| `channel_scope` | `list` | web/mobile/corporate/agency/partner |
| `api_contract_refs` | `list` | versioned backend |
| `identity_evidence_refs` | `list` | IAM and mandate policy |
| `actual_test_run_refs` | `list` | executed test logs |
| `open_p0` | `list` | financial/regulatory blockers |
| `reviewer_refs` | `list` | finance/security/QA/legal/ops |
| `decision_state` | `enum` | draft/blocked/review/approved |

## Workflow and recovery design
1. Index each of 19 draft channel specifications and unresolved dependencies.
2. Verify institutional authorization for enabled product/channel combinations.
3. Review API contracts, roles, privacy, mobile UX and fraud/error states.
4. Build and execute security, accessibility, replay and payment-state tests in proper environments.
5. Collect independent finance/legal/operations/QA approvals with actual logs.
6. Accept only qualified safe components and publish remaining gaps without fabricated readiness.

## Invariants and enforcement requirements
1. **CHN-020-R01** 20 created CHN archive checkpoints do not equal 20 accepted work packages.
2. **CHN-020-R02** A mock transfer confirmation is not settlement evidence or banking code.
3. **CHN-020-R03** Account/payment P0 holds remain operative despite channel presentation completion.
4. **CHN-020-R04** No customer data is released to partners solely from OAuth app registration.
5. **CHN-020-R05** Missing test or reviewer evidence must remain NOT_RUN or BLOCKED.
6. **CHN-020-R06** Production go-live requires independent institution and regulator-specific approvals where applicable.
7. **CHN-020-R07** Every approval is bound to exact revision, environment, legal entity and source evidence.

## Acceptance and negative scenarios — planned, not run
- [ ] **CHN-020-T01** Trace each planned screen flow to approved backend permissions.
- [ ] **CHN-020-T02** Cross-tenant IDOR, stale session and duplicate payment command tests.
- [ ] **CHN-020-T03** Unknown payment outcome never displayed as settled.
- [ ] **CHN-020-T04** Mobile accessibility keyboard/screen-reader audit.
- [ ] **CHN-020-T05** Acceptance pack rejects fabricated test pass or unapproved regulator interpretation.

## Dependency and reviewer gate
Approved institution channel scope, full 15-point implementation DoR, executed acceptance cases and independently signed security/finance/operations release criteria.

**Auditable state:** documentation draft only; executed banking tests = 0, production code = 0, regulator certification = none, independent WP completion = not established. Historical WP-ACC-005 P0 (COBAC I-2015/01 312/322) and institution-specific payment entitlements remain unresolved. GitHub custody does not supply source/legal approval.
