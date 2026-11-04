# DAT: Data and Migration workflow, events and failure contract
Status: SPECIFICATION DRAFT; no executed evidence.
Market: independent regulated banks, CEMAC-first; education edition simulated and isolated.
## Commands and preconditions
1. **create-mapping**: Validate institution, principal, policy version, aggregate state, replay key and expected version. Enforce distinct approver where financial, privileged or high-risk. Persist state and outbox in same transaction; return operation ID, not unsupported finality.
2. **dry-run-migration**: Validate institution, principal, policy version, aggregate state, replay key and expected version. Enforce distinct approver where financial, privileged or high-risk. Persist state and outbox in same transaction; return operation ID, not unsupported finality.
3. **approve-cutover**: Validate institution, principal, policy version, aggregate state, replay key and expected version. Enforce distinct approver where financial, privileged or high-risk. Persist state and outbox in same transaction; return operation ID, not unsupported finality.
## States
REQUESTED -> VALIDATING -> PENDING_APPROVAL -> AUTHORIZED -> PROCESSING -> COMPLETED.
Alternative: VALIDATING -> REJECTED; PENDING_APPROVAL -> REJECTED; PROCESSING -> UNKNOWN_PENDING_RECONCILIATION -> COMPLETED|FAILED_RECONCILED; COMPLETED -> REVERSAL_REQUESTED -> REVERSED (new compensating record only).
External systems may require different finality states; do not map internal COMPLETED to settlement.
## Invariant
opening balances reconcile exactly.
## Ownership and events
- data_asset: institution-scoped UUID, aggregate version, effective dates, audit provenance; sensitive data retention and redaction configured per legal profile.
- migration_batch: institution-scoped UUID, aggregate version, effective dates, audit provenance; sensitive data retention and redaction configured per legal profile.
- mapping: institution-scoped UUID, aggregate version, effective dates, audit provenance; sensitive data retention and redaction configured per legal profile.
- reconciliation_proof: institution-scoped UUID, aggregate version, effective dates, audit provenance; sensitive data retention and redaction configured per legal profile.
- Event DAT.create_mapping.v1: event_id, institution_id, aggregate_id, version, causation_id, correlation_id, occurred_at, schema_version, operation_state.
- Event DAT.dry_run_migration.v1: event_id, institution_id, aggregate_id, version, causation_id, correlation_id, occurred_at, schema_version, operation_state.
- Event DAT.approve_cutover.v1: event_id, institution_id, aggregate_id, version, causation_id, correlation_id, occurred_at, schema_version, operation_state.
## Concurrency and recovery
Idempotency uniqueness (institution_id, command_type, idempotency_key); reject same key with different payload hash. Optimistic version lock. Outbox at-least-once, inbox dedupe, ordered per aggregate. Timeout after external submission -> UNKNOWN, query authoritative counterpart before resubmit. Backoff with bounded retries and DLQ review. Corrections are compensating commands, never destructive history edits.
## Accounting
Financial impact must be journaled only by LED using approved versioned posting rules, exact currency amounts and balanced immutable lines. Nonfinancial contexts cannot write balances. WP-ACC-005 remains fail-closed where account 312/322 mapping is affected. Settlement and GIMAC entitlements are bank-specific.
## Test cases (specified, not executed)
- DAT-WF-T01: authorized success; required fixture, expected state, audit correlation and independent evidence.
- DAT-WF-T02: duplicate idempotency replay; required fixture, expected state, audit correlation and independent evidence.
- DAT-WF-T03: same key changed payload conflict; required fixture, expected state, audit correlation and independent evidence.
- DAT-WF-T04: stale aggregate version; required fixture, expected state, audit correlation and independent evidence.
- DAT-WF-T05: cross-bank IDOR; required fixture, expected state, audit correlation and independent evidence.
- DAT-WF-T06: maker-checker self approval denied; required fixture, expected state, audit correlation and independent evidence.
- DAT-WF-T07: external timeout UNKNOWN and reconciled; required fixture, expected state, audit correlation and independent evidence.
- DAT-WF-T08: outbox duplicate delivery; required fixture, expected state, audit correlation and independent evidence.
- DAT-WF-T09: reversal audit chain; required fixture, expected state, audit correlation and independent evidence.
- DAT-WF-T10: disaster restore continuity; required fixture, expected state, audit correlation and independent evidence.
- DAT-WF-T11: retention/legal hold; required fixture, expected state, audit correlation and independent evidence.
- DAT-WF-T12: accessibility and mobile workflow; required fixture, expected state, audit correlation and independent evidence.
