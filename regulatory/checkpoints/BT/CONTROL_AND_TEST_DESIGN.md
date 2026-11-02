# BT — Legal authority gates, workflow and acceptance design (NOT IMPLEMENTED)

## Architecture and authority decisions
**ADR-BT-01 (proposed, not accepted):** Split PSP legal category from payment institution exclusive-service constraint. Regulation 04/18 Article 5 + BEAC 2024 Financial Stability Review support broad PSP categories; the latter is explanatory and cannot supersede a binding circular. The circular's particular bank/product applicability stays `LEGAL_SCOPE_UNRESOLVED`.

**ADR-BT-02 (proposed):** Introduce source authority levels: authenticated binding operative text > applicable issuer correction/official interpretation > signed institution-specific legal/product/participant documents; issuer explanatory publications are supporting context, not a substitute for binding instruments. When legal texts conflict, stop and seek authorized legal resolution rather than silently picking a hierarchy outcome.

**ADR-BT-03 (proposed):** Legal scope and payment restitution case management are non-ledger bounded contexts. A scope change, case status, notification, timer, participant mode or settlement ACK cannot create money. Accounting Core alone posts balanced immutable journals from an independently authorized idempotent financial command.

## Negative scope-decision matrix — no auto-authorizations
| Institution | Service | Channel/rail | Evidence status | Default |
|---|---|---|---|---|
| Licensed bank | Conventional transfer | SYSTAC2 | No signed legal interpretation/terms | SCOPE_UNRESOLVED |
| Licensed bank | Instant merchant payment | Mobile or non-mobile | Circular Section IV potentially relevant, not adjudicated | SCOPE_UNRESOLVED |
| Licensed payment institution | Erroneous mobile transfer | Mobile | Potential Section I relevance; current terms/amendments missing | SCOPE_UNRESOLVED |
| Licensed EMF | Instant P2P transfer | Mobile | Broad PSP category not enough to prove this product covered | SCOPE_UNRESOLVED |
| Any | Treasury/BEAC settlement leg | SYGMA | Actor exclusion and underlying customer flow require separation | SCOPE_UNRESOLVED |

## Workflow and controls
1. Intake immutable claim evidence: original payment ID, claimed error, actor, recipient, transaction timestamp, signed contract version, institution license and service authorization.
2. Resolve current operative instruments and specific clause applicability, **not** from a BEAC sector report alone; record as-of-effective and as-of-known time. If missing, park case `LEGAL_SCOPE_UNRESOLVED` without auto-hold or auto-return.
3. Require independent legal maker-checker decision with evidence digest; no self-approval, tenant crossing, or policy activation by a single privileged operator.
4. Only then evaluate authorized hold eligibility, available funds, recipient notice, consent/objection, judicial/AML/fraud precedence and applicable time windows. Timers derive from trusted delivery evidence and approved policy; no generic 5-minute/24-hour/48-hour rules.
5. On approved return, submit a **new** idempotent payment command. Treat external outcome UNKNOWN distinctly from REJECTED and SETTLED. Query/reconcile before retrying; never post duplicates.
6. Confirm settlement using scheme-authoritative evidence; reconcile return, original and suspense balances independently; immutable audit and exceptions retained.

## Candidate APIs/events (internal proposals, NOT BEAC interfaces)
- `POST /v1/restitution-cases/{case_id}/legal-scope-assessments` with immutable `idempotency_key`, `instrument_version`, `evidence_digest`.
- `POST /v1/restitution-cases/{case_id}/legal-scope-approvals` with independent checker, signed authority reference.
- `RestitutionLegalScopeUnresolved`, `RestitutionScopeApproved`, `RestitutionCaseContested`, `ReturnOutcomeUnknown`, `ReturnExternallyConfirmed`, `ReturnIndependentlyReconciled`.
- All events include `tenant_id`, `aggregate_id`, `version`, `occurred_at`, `known_at`, `correlation_id`, `causation_id`; delivery is at-least-once with inbox deduplication.

## Ten NEW negative acceptance scenarios — specified, zero executed
| ID | Fixture | Expected behavior |
|---|---|---|
| BT-T01 | Bank incorrectly excluded because 2023 circular uses 'exclusively' | Reject category inference; require actual operative scope |
| BT-T02 | Payment institution granted bank deposit-taking privileges because both are PSPs | Reject EP/bank category conflation |
| BT-T03 | BEAC stability report treated as binding amendment of 2023 circular | Reject authority promotion |
| BT-T04 | BEAC report's aggregate prior approvals treated as license for named bank/product | Deny entitlement |
| BT-T05 | Bank conventional transfer automatically receives Section IV instant-merchant restitution timer | Keep scope unresolved |
| BT-T06 | Non-mobile instant merchant payment rejected solely as 'not mobile' | Require Section IV legal analysis; no auto-rejection |
| BT-T07 | Product-specific legal opinion exists but is expired or predates later instrument | Deny activation, request reapproval |
| BT-T08 | Legal approver and maker are same actor or different tenant | Reject, audit privileged attempt |
| BT-T09 | Legal-scope approval event triggers GL journal or changes customer available balance | Reject: scope decision has no posting capability |
| BT-T10 | Return externally UNKNOWN and DR replay attempts new transfer with changed idempotency key | Quarantine and reconcile; no duplicate posting |

## DoR evidence needed
Current authenticated 04/18 + R-2019/01–02 + Circular 004/2023 texts/amendments; issuer/legal interpretation; institution license/product and merchant/customer agreements; signed BEAC participant conventions and ISO 20022 profiles; approved PCEC ledger mappings; court/AML priority and data retention legal basis; executable fixtures and signed review. None obtained in BT. No code, migration, test, scan or certification performed.
