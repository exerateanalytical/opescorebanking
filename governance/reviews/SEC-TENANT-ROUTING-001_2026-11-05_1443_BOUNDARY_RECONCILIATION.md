# SEC-TENANT-ROUTING-001 — 2026-11-05 boundary reconciliation

Status: IN_PROGRESS; engineering review only; not a completed work package, accepted DoR, or production certification.

## Observed canonical baseline
- At start of review GitHub main HEAD: `8ddfea6fa724d5d6f5d69535b31db0a81dd3f93f` (2026-11-05 11:44:02 UTC). This supersedes historical 2026-11-03 batch 150 as a current repository checkpoint.
- Read `governance/CANONICAL_PROGRAMME_STATE.json`, `governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.5_2026-11-04.md`, and `governance/reviews/SEC-TENANT-ROUTING-001_POSTCOMMIT_UNKNOWN_ACCEPTANCE_PLAN_2026-11-05.md` directly from main.
- Historical recovery includes batch 210; 150 is not the current next batch. 25 domain planning groups are sponsor approved, but exhaustive accepted leaf-WBS denominator remains UNKNOWN.
- The canonical state records laboratory CI successes but production DoR not verified; do not interpret green lab CI as production financial acceptance.

## Concrete P0 acceptance fence
1. Cryptographically verified OIDC issuer/audience/signature/expiry and bank-local membership must resolve to a specific authenticated PostgreSQL principal, with no trust in client-provided bank IDs or mutable tenant GUC alone.
2. The bank-local authorization/revocation fence must serialize against journal posting under real concurrent DB sessions; test credential rotation and privileged-principal bypass denial.
3. One durable transaction must commit immutable journal, bank-scoped idempotency key plus canonical request fingerprint, and outbox record. A successful database commit with lost HTTP acknowledgement is UNKNOWN to the client until authoritative lookup; never repost.
4. Same-key/same-payload replay must return original immutable journal identity; same-key/different-payload must reject and audit; cross-bank guessed keys must disclose nothing.
5. Outbox delivery is at least once: consumer inbox deduplicates effects, and reconciliation independently detects missing/ambiguous acknowledgements. No status update may imply settlement or create money.
6. Fault-injection tests must include post-COMMIT pre-response termination, concurrent workers, DB unavailability, failover, outbox publish/mark crash, revocation races, and credential rotation. Record actual test commands, CI run IDs, SQL constraints, journal/outbox traces and assertions; none are claimed executed in this review.

## Isolation and regulatory quarantine
WP-ACC-005 COBAC PCEC 312/322 classification remains unresolved and must not be encoded as authoritative statutory mapping. Software development does not require a participating bank; live external rail connectivity requires operator entitlement at deployment. Preserve effective-dated external mapping, exact arithmetic and append-only correction.

## Evidence gap and disposition
The postcommit acceptance plan is an unexecuted plan, not proof. This review found no newly executed postcommit crash/replay tests, no verified OIDC-to-real-gateway-to-DB-principal integration, and no independent production acceptance evidence. DoR remains FAIL-CLOSED. Historical source custody and WBS leaf reconciliation remain open independently.

## Next exact task
Implement a minimal reproducible PostgreSQL-backed post-COMMIT/pre-HTTP-ack fault-injection harness within SEC-TENANT-ROUTING-001; bind it to real bank-scoped identity and immutable idempotency/journal/outbox transaction; run and archive executable evidence. Do not promote to production without all 15 DoR gates and independent review.
