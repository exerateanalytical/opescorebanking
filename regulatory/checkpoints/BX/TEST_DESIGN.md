# BX — Proposed negative acceptance tests (NOT EXECUTED)

These scenarios are **new design specifications**, not executed tests, not compliance certification, and not a denominator for overall readiness. Each requires an approved test fixture, traceable expected ledger state, evidence collection and independent review before execution.

- **BX-T01:** DR exercise switches to standby but does not execute production failback; mark exercise incomplete.
- **BX-T02:** Actual recovery exceeds approved critical-service maximum interruption or maximum data loss; fail evidence gate and escalate.
- **BX-T03:** A restored journal snapshot is older than durable transaction acknowledgements; reconcile against authoritative append-only events before any restart.
- **BX-T04:** A recovery replay retries a committed payment with the same idempotency key; exactly one authoritative financial posting is permitted.
- **BX-T05:** Standby exercise runs for a trivial non-representative interval; reject evidence of a complete critical-service continuity test.
- **BX-T06:** Cyberattack recovery scenario is omitted from the annual continuity exercise; do not report full Article 34/36 coverage.
- **BX-T07:** Annual penetration test excludes every essential or sensitive service; do not accept a generic perimeter-only report as complete.
- **BX-T08:** Penetration test findings lack remediation evidence, board-level summary or internal-control reporting trace; mark assurance evidence incomplete.
- **BX-T09:** A production release has no pre-deployment functional/security testing or safe rollback and data restoration plan; block deployment.
- **BX-T10:** A dictionary schema change silently changes account-status semantics or monetary field precision; reject until independently reviewed and versioned.
- **BX-T11:** Data transformation rounds, truncates or duplicates journal amounts; reject migration and require exact arithmetic and balancing evidence.
- **BX-T12:** Restored read-model balance differs from the ledger projection; quarantine the read model, preserve authoritative ledger and reconcile.
- **BX-T13:** An outsourced critical service lacks signed recovery and service-level obligations or actual test evidence; reject vendor readiness claim.
- **BX-T14:** A policy engine activates payment authentication or archival requirements based only on the BEAC report's description of Instruction 001/GR/2024; keep policy unapproved pending signed operative text.

## Proposed executable evidence protocol

For each scenario: record requirements and article provenance; institution and product scope; test environment; initial posted journal and external settlement states; input/operation; failure/retry/rollback/recovery paths; expected immutable journal count and exact amounts; independent reconciliation output; access-control decision; logs/trace correlation; and actual result. **No tests were run in BX.**

Release and recovery controls must fail closed on missing data dictionary versions, unverified settlement outcomes, incomplete failback or unknown journal replay status. The incident policy in BW remains quarantined and is not redefined here.
