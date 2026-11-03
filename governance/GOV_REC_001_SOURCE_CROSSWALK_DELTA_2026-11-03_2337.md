# GOV-REC-001 — Source-backed historical crosswalk delta
Date: 2026-11-03. Status: PARTIAL RECONCILIATION, NOT ACCEPTED WP.
Remote baseline: ca48c595a74b8e5cf6f24b34fdaf3cb822cdc53b (main).

## Directly retrieved source records
| Source path | Historical claim | Evidence classification | Consequence |
| --- | --- | --- | --- |
| governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.1_2026-11-03.md | Eight known/provisional WPs, exhaustive denominator unknown; GOV-REC-001 in progress | Current provisional register, not approved scope | Do not publish progress percentage |
| regulatory/checkpoints/AN/CONTINUATION_STATE.json | AN predecessor AM; Phase 4 Accounting Core; WP-ACC-004 inherited complete; WP-ACC-005 open blocked; WP-PAY-GIMAC-001 open not attempted | Inherited checkpoint assertion; no independent acceptance evidence | Do not upgrade WP-ACC-004 or payment readiness |
| regulatory/checkpoints/CP/README.md | CP predecessor CO; BEAC issuer page image previously inspected; Article 8(d) prints 312 above 322-prefixed descendants | Prior recorded primary-source visual inspection; this run retrieved report, not original image | P0 account-mapping hold remains |
| regulatory/checkpoints/CT/README.md | CT predecessor CS; Phase 4; WP-ACC-005 P0; unsigned clarification and amendment lineage unresolved | Historical checkpoint statement; no authenticated correction supplied | No posting, migration or CERBER mapping |
| governance/GOV_REC_001_TREE_AUDIT_2026-11-03_2241.md | Earlier baseline 883 tree entries, 687 blobs, 317 regulatory checkpoint blobs | Prior tree metadata, not archive inspection | Inventory not acceptance |
| regulatory/HISTORICAL_ARCHIVE_INVENTORY.md | AN cumulative nested archive with 39 layers and 490 non-ZIP entries; binary transfer incomplete | Prior local inventory report, not independently reproduced here | Archive completeness unverified |

## Fresh repository observation
At main ca48c595a74b8e5cf6f24b34fdaf3cb822cdc53b the Git tree API returned 1,036 entries, truncated=false. This is a current tree-entry count, not a completed-work-package denominator. Tree metadata includes governance recovery register and historical regulatory checkpoint paths. The previous 883-entry observation belongs to an earlier commit and must not replace the current count.

## Crosswalk and contradiction handling
AN -> AM, CP -> CO and CT -> CS are source-asserted predecessor links only; no complete ancestry proof. Historic 'WP-ACC-004 completed' is inherited, not independently accepted. Current production DoR is FAIL for WP-ACC-005. The 312/322 issue is unresolved despite a plausible typographical explanation; preserve literal printed 312 and inferred 322 separately and fail closed.

## Quality gate
No production code, regulatory configuration, accounting posting or customer balances modified. No tests or independent approvals performed. The 317 checkpoint blobs have NOT all been parsed. No archive contents independently extracted in this run. No accepted WP closure. This text-only delta is NOT a manifest-bearing ZIP checkpoint, so it must not be counted as a completed numbered batch.

## NEXT EXACT TASK
GOV-REC-001: extract machine-readable source-path, predecessor, WP identifier, phase, assertion type and evidence grade for ALL 317 regulatory checkpoint blobs; reconcile the original AN cumulative archive and commit ancestry; produce a verified crosswalk before GOV-REC-002.
