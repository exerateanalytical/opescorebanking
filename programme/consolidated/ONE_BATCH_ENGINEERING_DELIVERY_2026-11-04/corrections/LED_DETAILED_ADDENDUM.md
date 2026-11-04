# LED — Journal posting: detailed corrective design addendum
Status: PROPOSED / NOT INDEPENDENTLY ACCEPTED. Market: CEMAC-first multi-bank commercial product, future Africa country overlays. Complements domains/LED_SPEC.md; no earlier file overwritten.

## Business contract
Initiator submits institution-scoped command with idempotency key, expected aggregate version, legal purpose and signed session context. API authenticates principal and resolves approved policy version. Domain service validates entity lifecycle and dependencies. High-risk command enters PENDING_APPROVAL with separate approver identity. On approval, service commits aggregate state and outbox atomically; accounting commands are handled exclusively by LED. On timeout, return stable operation reference; do not infer success. Exception queue records reason, owner, escalation deadline and authoritative recovery evidence.

## Owned entities and proposed constraints
- journal: primary key UUID; institution_id UUID NOT NULL; version BIGINT NOT NULL; status TEXT NOT NULL; created_at TIMESTAMPTZ NOT NULL; updated_at TIMESTAMPTZ NOT NULL; created_by UUID NOT NULL; external_reference TEXT nullable; root owns transition authorization and consistency. UNIQUE(institution_id,id), INDEX(institution_id,status).
- journal_line: primary key UUID; institution_id UUID NOT NULL; version BIGINT NOT NULL; status TEXT NOT NULL; created_at TIMESTAMPTZ NOT NULL; updated_at TIMESTAMPTZ NOT NULL; created_by UUID NOT NULL; external_reference TEXT nullable; foreign key to root, no cross-tenant reference. UNIQUE(institution_id,id), INDEX(institution_id,status).
- posting_rule: primary key UUID; institution_id UUID NOT NULL; version BIGINT NOT NULL; status TEXT NOT NULL; created_at TIMESTAMPTZ NOT NULL; updated_at TIMESTAMPTZ NOT NULL; created_by UUID NOT NULL; external_reference TEXT nullable; foreign key to root, no cross-tenant reference. UNIQUE(institution_id,id), INDEX(institution_id,status).
- accounting_period: primary key UUID; institution_id UUID NOT NULL; version BIGINT NOT NULL; status TEXT NOT NULL; created_at TIMESTAMPTZ NOT NULL; updated_at TIMESTAMPTZ NOT NULL; created_by UUID NOT NULL; external_reference TEXT nullable; foreign key to root, no cross-tenant reference. UNIQUE(institution_id,id), INDEX(institution_id,status).
No physical SQL migration is approved without bounded-context data ownership review. Monetary fields must use NUMERIC(38, 9) or explicit integer minor units with currency and approved rounding; NUMERIC precision is a candidate and requires product/currency validation.

## Invariant and accounting boundary
sum debits equals credits in each currency and ledger entity; posted immutable. Accounting consequence: debit/credit postings require approved mapping; PCEC 312/322 blocked. No ledger account classification is asserted for unresolved PCEC 312/322. Distinguish authorized, pending, externally unknown, reversed, settled and rejected outcomes where applicable; never equate internal completion with external finality.

## API contract proposal
POST /v1/institutions/{institutionId}/led/operations: headers Authorization, Idempotency-Key, X-Correlation-ID; JSON body {operation_type,aggregate_id,expected_version,policy_version,reason,payload}. Success 202 {operation_id,state,version,links}; duplicate returns prior outcome; 403 cross-tenant/SoD; 409 stale version or idempotency payload conflict; 422 invalid transition; 503 safe unavailable. GET /v1/institutions/{institutionId}/led/operations/{operationId} returns authoritative state, not fabricated finality. Domain event LED.OperationStateChanged.v1 includes event_id, institution_id, aggregate_id, aggregate_version, occurred_at, correlation_id, causation_id, state and schema_version. Transactional outbox; inbox dedupe by (consumer,event_id); bounded retry, DLQ review and replay authorization.

## Authorization and control
Initiator: scoped create/read. Approver: separate principal with delegated amount/product/branch authority; self-approval forbidden. Operator: execute only approved command. Auditor: read evidence without mutation. Tenant and record-level checks enforced on every API, background job, query and event handler. Security audit captures policy version, actor, decision, prior/new state, correlation, reason and immutable reference.

## Failure/reversal/recovery
Validation failure: reject with no state or financial effect. Duplicate request: return original operation. Concurrency conflict: reject stale version. Outbox publish failure: retain committed outbox for retry. Downstream timeout: mark UNKNOWN_PENDING_RECONCILIATION where external effects possible; poll/query authoritative counterparty and compare external IDs before any retry. Error correction: append compensating command/journal; never delete posted evidence. Disaster restore: verify journal continuity, event sequence and external reconciliation before resuming outbound operations.

## Traceable acceptance cases (NOT executed)
- LED-AC-01 authorized operation commits once and emits one logical event.
- LED-AC-02 replay with same key/payload is stable; same key/different payload returns conflict.
- LED-AC-03 cross-bank aggregate reference is denied and logged.
- LED-AC-04 maker-checker self-approval denied; privilege escalation denied.
- LED-AC-05 stale expected_version yields 409 without side effects.
- LED-AC-06 lost network acknowledgement does not create duplicate monetary/external effect.
- LED-AC-07 reversal preserves original immutable history and evidence.
- LED-AC-08 data export/restore preserves institution isolation and retention constraints.
- LED-AC-09 reconciliation break is visible, owned and cannot silently close.
- LED-AC-10 regulator/auditor reconstructs rule, actor, state and external reference from evidence.

## Dependency and approval gates
Depends on REG,SEC,REC. Applicable regulatory source must be versioned per institution and jurisdiction. Draft design may use Basel/ISO/NIST/OWASP patterns where no binding local implementation prescription exists; such references are not automatically CEMAC law. Independent CFO, regulatory, CISO, architect, operations and QA review required as applicable. 15/15 DoR evidence not yet established. Do not start production implementation from this draft alone.
