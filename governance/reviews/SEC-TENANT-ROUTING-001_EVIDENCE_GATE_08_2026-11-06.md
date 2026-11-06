# SEC-TENANT-ROUTING-001 — Evidence gate 08 (2026-11-06)

Status: IN_PROGRESS / P0-SEC-01 and P0-SEC-02 OPEN / production DoR NOT MET.

## Provenance and anti-regression
Read from canonical main before this review: governance/CANONICAL_PROGRAMME_STATE.json; governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.5_2026-11-04.md; governance/reviews/SEC-TENANT-ROUTING-001_FORMAL_ORDERING_MODEL_06_2026-11-04.md; governance/reviews/SEC-TENANT-ROUTING-001_INTEGRATION_ACCEPTANCE_PLAN_07_2026-11-06.md. Observed latest commit ea94dc51f3faaabc9785b5e97d3daa43feb57be4. The state JSON's latest_review still names review 06, while review 07 is committed; this is a pointer-drift defect, not evidence that review 07 was accepted. No historical batch 001–210 is reissued. The sponsor-approved 25 domain groups are not an exhaustive accepted leaf-WP denominator. No production WP is established as accepted.

## Traceability to executable evidence — acceptance gate
Review 07 proposes T01–T15 but **none are evidenced as executed in the real gateway/broker/PostgreSQL boundary**. Existing synthetic JWT and bank-local PostgreSQL laboratory tests are bounded evidence only. For each test, require a repository test path, exact immutable commit, workflow run URL and conclusion, executable command, test environment digest, failure injection point, assertion results and durable journal/command/outbox row evidence. A test case document or CI workflow definition is not a passed test.

| Evidence slice | Existing bounded evidence | Required next proof | Gate |
|---|---|---|---|
| T01/T02 trusted identity and bank routing | Synthetic signed-token routing tests; PostgreSQL authenticated-principal isolation lab | Real gateway signature verification, workload-authenticated broker, bank-local DB checkout and cross-bank negative test | OPEN P0-SEC-02 |
| T06 crash after commit before HTTP reply | Bank-local journal/fence concurrency lab only | Kill actual gateway/broker after durable COMMIT; replay original command, prove exactly one balanced journal and outbox event | OPEN P0-SEC-01 |
| T04/T05/T10 revocation | Local PostgreSQL ordering laboratory | Global request fanout to every bank-local authority; ENFORCED only after durable acknowledgements and in-flight drain | OPEN P0-SEC-01 |
| T08/T09 external unknown | No live rail entitlement claimed or needed for simulator | Simulated rail timeout with UNKNOWN, correlation and no fresh-command duplicate; do not assert real settlement | OPEN |
| T11 credentials/pool | No real broker credential rotation proof | Rotate/revoke DB principal; force pool reconnect and failover; prove revoked credentials never authorize | OPEN P0-SEC-02 |
| T14 DR | No proven recovery point guarantee | Restore backup; reconcile replay registry, journal, outbox, revocation acknowledgements before write admission | OPEN |

## Financial and security invariants (non-negotiable)
All committed financial operations must be exactly once by bank-scoped immutable command digest, balanced by currency in exact minor units, with immutable posted journals, atomic local journal/outbox persistence and explicit reversal. A missing reply after COMMIT must be resolved by original command lookup, never by generating a new command. External timeout remains UNKNOWN until independently reconciled. A forged tenant header or PostgreSQL custom GUC cannot choose a bank principal. A revoked global membership cannot be declared ENFORCED while any relevant bank-local authority has not durably acknowledged. Missing authority means PENDING, denied new commands and an operational incident.

## Regulatory boundary
WP-ACC-005 312/322 classification remains quarantined pending authoritative interpretation; neutral internal ledger tests may proceed. No production legal mapping, banking certification, live GIMAC access or real settlement is implied. External rail participation is a deployment integration prerequisite, not a vendor software-development prerequisite.

## Quality review and disposition
Regulatory: statutory mapping quarantined. Accounting: crash/replay/outbox invariant unproven at real boundary. Security: workload identity, JWKS/key custody and credential rotation unproven. Architecture: global-to-local revocation propagation unproven. Operations: UNKNOWN, incident and DR behavior unproven. Testability: T01/T02/T06 selected as minimal first executable vertical laboratory; do not call tests passed until actual run artifacts exist. Privacy/audit: redact credentials and tokens; retain immutable trace IDs and transaction evidence with reviewed retention. **Disposition: no production promotion, no accepted WP, no ZIP checkpoint because this is an open review subtask.**

## NEXT EXACT TASK
SEC-TENANT-ROUTING-001 — enumerate and inspect the existing gateway, OIDC fixture, broker, PostgreSQL principal binding and CI workflow source paths at the current main HEAD; implement and execute the minimal real-boundary T01/T02/T06 harness against actual PostgreSQL 16, capturing CI logs and crash/replay durable row evidence. Preserve P0-SEC-01/P0-SEC-02 until proven.
