# SEC-TENANT-ROUTING-001 — LAB-008 privilege and evidence gate (2026-11-05)

Status: OPEN / P0 financial-integrity acceptance gate. Source review only; no PostgreSQL execution. This document is a continuation of LAB-006, LAB-007 and LAB-008, not an acceptance or production migration.

## Provenance
Reviewed on canonical main: engineering/labs/security-ledger/006_idempotency_recovery_experimental.sql (blob 505ef4a610a505f5d3d680afa891b9d7041a932d), 007_idempotency_recovery_acceptance.sql (blob 45917e6a3b664727aa5536102e380efa017ed451), and 008_committed_replay_runner.sh (blob d4d60d57fae0ccb4ecc26df57843f34e147b2fb9). Prior continuation: f1e8633dfc6327dda79dc213aa2cf7d4f7395364. Repository master plan acceptance denominator remains unverified; do not count this as WP closure.

## P0: privileged laboratory principal can bypass the posting function
LAB-007 grants SELECT, INSERT, UPDATE on ALL tables in sec_idemp_006 to lab006_runner. The function is SECURITY INVOKER. Therefore the same principal used for the LAB-008 replay assertion can directly INSERT into operation/line/outbox, UPDATE posted lines, alter membership and account state, and bypass the post() validation and authorization logic. The positive replay assertion may pass even though immutable journals, controlled authorization and no-direct-balance-mutation are unenforced. This grant was labelled disposable-only in source; nevertheless any positive result must be classified strictly as a narrow algorithm demonstration, not a tenant/ledger security proof.

### Required containment
1. Never promote LAB-007 grants or the LAB-006 SECURITY INVOKER design to production.
2. For the isolated lab, use separate privileged setup/fixture owner and restricted test principal. A production-candidate design requires a reviewed SECURITY DEFINER boundary (fixed search_path, schema-qualified objects, non-login owner, revoke PUBLIC EXECUTE, minimum privileges) OR an equally proven alternative. Do not implement SECURITY DEFINER by simply toggling a flag without threat modelling.
3. Add negative assertions that a posting principal cannot directly INSERT/UPDATE/DELETE operation, line, outbox, member or account rows; cannot change another member's state; cannot execute arbitrary privileged functions; and cannot bypass authorization via SET ROLE or search_path manipulation.
4. Test revocation after a committed first post and before replay; replay lookup must fail closed. Check concurrent replay and revocation races using separate database connections.

## Evidence and test ordering
A. Environment gate: isolated PostgreSQL 16 with psql, authenticated lab006_runner, database identity and version recorded; no real funds or institution data.
B. Execute LAB-006, LAB-007 setup and assertion runner. Record exact commands, exit codes, SQLSTATE, database version, test timestamps and source hashes. Correct SQL failures without erasing failed evidence.
C. Execute LAB-008 committed replay in two independent sessions. Verify one operation, one outbox event, exactly two balanced lines, and same original journal after fresh transport UUIDs. Record evidence as a *positive functional test only*.
D. Add and execute changed-command rejection, cross-member replay denial, unauthorized direct-write tests, and twenty concurrent connections with deterministic barriers. Validate bank-scoped uniqueness before any multi-tenant claim.
E. Add deterministic C4 post-COMMIT/pre-response worker termination. Confirm durable outcome by independent read, no second journal/outbox, no falsely asserted failure, and explicit UNKNOWN when readback is unavailable.
F. Review OIDC JWT verification and bank-local principal mapping, cryptographic key handling, immutable posted journal enforcement, reconciliation, operations/DR and audit trails independently. None are satisfied by LAB-008.

## Execution constraints and decision
Current runner environment inspection found no psql, postgres, pg_ctl or Docker executable; zero PostgreSQL tests executed. No claim of regulatory verification, DoR completion, bank isolation, crash recovery or production readiness. The accounting classification WP-ACC-005 and GOV-REC-001 remain separate unresolved workstreams. No new numbered batch or ZIP is justified for this still-open parent package; archive delivery remains outstanding.

## NEXT EXACT TASK
SEC-TENANT-ROUTING-001: obtain an isolated PostgreSQL 16 execution environment; run existing LAB-006/007/008 unmodified to establish baseline traces; then design a least-privilege lab role split and negative direct-write tests before interpreting any replay PASS as security evidence. Preserve failures and exact provenance.
