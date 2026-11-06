# OPES Core Banking — canonical-state correction (2026-11-06)

Status: EVIDENCE CHECKPOINT ONLY; no production work package accepted; no numbered batch allocated.

## Authenticated remote inspection
- At inspection, GitHub `main` HEAD was `5379bb7fa3a4833b76b2b5e9ea51da730492fac4` (2026-11-06T05:37:14Z). This supersedes the 2026-11-03 historical SHA `ca48c595a74b8e5cf6f24b34fdaf3cb822cdc53b` as a *point-in-time observation*, not as an immutable future HEAD.
- The existing 2026-11-06 RUN11 WBS gate note's claim that main HEAD and canonical plan had not been located is now stale. The actual canonical plan is `governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.5_2026-11-04.md`, referenced by `governance/CANONICAL_PROGRAMME_STATE.json`. The approved domain ownership map is `governance/OWNER_APPROVED_DOMAIN_OWNERSHIP_REGISTER_2026-11-04.json`.
- The current canonical state reports 25 sponsor-approved domain groups, 150 historical WP directories, 210 observed historical delivery batches, 115 provisional code-workstream slots with 22 repository-evidence slots, and **UNKNOWN exhaustive accepted leaf-WP denominator**. These counts describe different inventories; they must not be added or treated as accepted work-package completions.
- The canonical state reports tested synthetic PostgreSQL/OIDC/ledger laboratories, but explicitly NOT production approval. Do not repeat the historical assertion that the entire repository has zero code or zero tests; that was true only for the older 150 draft-batch baseline.

## Critical-path decision
- Current engineering NEXT EXACT TASK remains `SEC-TENANT-ROUTING-001`: cryptographically verified OIDC subject -> bank-local membership -> bank PostgreSQL principal, proven across real gateway/DB boundary with credential rotation, crash-after-COMMIT-before-response, UNKNOWN outcome/replay and outbox deduplication. Existing synthetic tests do not prove this integrated behavior.
- `WP-ACC-005` remains separately BLOCKED P0 for activation of COBAC PCEC 312/322 external mappings. Official source discrepancy and access limitations are recorded in the two 2026-11-06 WP-ACC-005 notes. No regulatory interpretation is promoted by this correction.
- `GOV-REC-001` archival custody/acceptance and `GOV-WBS-RECON-001` exhaustive leaf-WBS acceptance crosswalk remain OPEN.
- Live GIMAC/operator entitlement is a deployment-only requirement, not a vendor software development precondition.

## Quality gate and scope
This note reconciles provenance and corrects a stale inspection statement only. No source changes to the ledger, payment engine, statutory mapping or tenant router. No executable tests run; no ZIP batch generated; no production DoR signoff. Preserve all 15 DoR gates and financial fail-closed invariants.

NEXT EXACT TASK: SEC-TENANT-ROUTING-001 — inspect the current implementation and test harness, identify the first missing real OIDC/gateway/DB-principal integration boundary, and design its crash/replay/UNKNOWN and credential-rotation acceptance tests before production promotion.
