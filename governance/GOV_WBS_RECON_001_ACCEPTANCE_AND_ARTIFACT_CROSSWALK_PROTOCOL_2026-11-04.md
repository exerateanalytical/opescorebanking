# GOV-WBS-RECON-001 — Canonical Work-Package Acceptance and Artifact Crosswalk Protocol
Date: 2026-11-04
Status: IN_PROGRESS — protocol drafted; full repository-wide inventory and independent approvals NOT completed.
Baseline main commit inspected: 375374a7e73a649205ff9aa6fa3452768f7b3960.
Related draft: programme/consolidated/OPES_CORE_BANKING_ALL_REMAINING_PHASES_CONSOLIDATED_DRAFT_2026-11-04.md (20 programme-area scopes; not an approved exhaustive WBS).

## Problem statement and control objective
Checkpoint numbers, GitHub commits, ZIPs, Markdown specifications and JSON schemas cannot independently establish engineering acceptance. Earlier 001–209 documentation/recovery checkpoint artifacts are evidence candidates; no verified programme-wide denominator or accepted leaf-level WP count is established. The newly committed consolidated draft supplies broad coverage but is not a substitute for an approved, exhaustive, dependency-ordered register.

## Required canonical records (proposal; not yet populated exhaustively)
Every registered leaf work package shall have the following immutable identifier and auditable fields:
- wp_id, parent_phase_id, title, bounded_context, scope_in, scope_out, institution_profile, owner, reviewer, source_regulations[] with issuer/document/page/article/effective date/verified_at, evidence_artifact_paths[] with Git commit and blob SHA, dependencies[], risks[], blocker_ids[], requirements[], ledger_invariants[], authorization_controls[], state_machine_refs[], api_event_refs[], data_model_refs[], acceptance_case_refs[], operational_controls[], dor_gate_01..15, dod_evidence[], approval_actor, approval_timestamp, status, next_action.
- Allowed statuses: NOT_STARTED, IN_PROGRESS, BLOCKED, VERIFIED_COMPLETE. DRAFT_DELIVERED is an artifact status, never a WP acceptance state.
- Reviewers must be independent of preparers for high-risk accounting, payments, security, AML, regulatory reporting and DR packages.
- Unknown values must be recorded as UNKNOWN; do not infer them from document titles.

## Evidence crosswalk acceptance algorithm
1. Pin GitHub branch and HEAD; collect complete recursive tree, commit history and relevant releases, including ZIP blob SHA and byte count.
2. Enumerate each historical checkpoint source path and archived manifest; calculate binary SHA-256 and CRC32 where transport allows; do not treat a reconstruction digest as proof of original custody.
3. Match each artifact to one or more proposed leaf WPs by actual content, requirements and evidence—not merely directory name or sequential checkpoint number.
4. Classify artifacts as SOURCE_RECOVERED, DRAFT_DELIVERED, TEST_EVIDENCE_EXECUTED, REGULATORY_SOURCE_VERIFIED, INDEPENDENTLY_REVIEWED, or ACCEPTED; retain multiple classifications where supported.
5. Identify duplicate and superseded artifacts by blob SHA/content lineage; preserve all historical paths and identify authoritative successor only with review evidence.
6. Require acceptance signatures, reproducible tests where applicable, and all 15 DoR gates before claiming production implementation readiness.
7. Reconcile every source blob and every registered WP, record unmapped files, missing evidence and contradictory claims.
8. Publish the approved denominator only after exhaustive inventory, explicit scope freeze/change control and independent review. Until then: UNKNOWN.

## Initial anchored crosswalk entries (non-exhaustive)
| Artifact | Evidence classification | Linked WP | Acceptance verdict |
| --- | --- | --- | --- |
| programme/consolidated/OPES_CORE_BANKING_ALL_REMAINING_PHASES_CONSOLIDATED_DRAFT_2026-11-04.md | DRAFT_DELIVERED; 20 high-level areas | GOV-WBS-RECON-001 and proposed domain scopes | NOT_ACCEPTED |
| governance/GOV_REC_001_SUBBATCH_PLAN_181_210_2026-11-04.md | Registered historical-recovery subbatch plan | GOV-REC-001 | OPEN |
| programme/batches/2026-11-04/GOV-REC-001/B209_CT/AUDIT.md | Historical source-audit draft | GOV-REC-001 | OPEN |
| governance/GOV_REC_001_AN_OUTER_CHECKSUM_REGISTER_COVERAGE_2026-11-04.md | Archive checksum coverage finding | GOV-REC-001 | OPEN |
| governance/GOV_REC_001_AN_INDEPENDENT_SHA256_VERIFICATION_2026-11-04.md | AN archive digest comparison record | GOV-REC-001 | OPEN |

## Dependency and P0 fail-closed assessment
- WP-ACC-005: P0 BLOCKED — disputed COBAC/PCEC 312/322 interpretation. No posting map, migrated account or production ledger activation may rely on the disputed classification.
- Payment-rail entitlement: institutional participation and settlement contracts UNVERIFIED. No external finality or liquidity may be represented as established.
- GOV-REC-001: OPEN — source custody, original/reconstructed provenance, nested archive integrity and full source reconciliation incomplete.
- GOV-WBS-RECON-001: IN_PROGRESS — exhaustive inventory/denominator and approval missing.
- No bank implementation slice has demonstrated all 15 DoR gates.

## Multi-disciplinary quality review of this protocol
Regulatory: source-level citations and effective dating mandated, not claimed obtained.
Finance: immutable double-entry, no direct balance mutation, independent reconciliation, idempotency and unknown-outcome hold are preserved.
Architecture: artifact-to-bounded-context mapping requires explicit owner and dependency validation.
Security/AML: approval and SoD evidence required, no UI-only authorization accepted.
Data: provenance and retention review required; archive custody gaps explicitly open.
Payments: no fabricated rail entitlement, settlement finality or payment test results.
Resilience: DR tests and recovery evidence mandatory before operational acceptance.
Audit/testability: reproducible executed tests, immutable commits, reviewer identity and timestamps required.
Performance/accessibility: measurable acceptance cases required where applicable.
Verdict: **DRAFT PROTOCOL; NOT A VERIFIED COMPLETE WP**.

## Execution report
Registered WP attempted: 1 (GOV-WBS-RECON-001).
Registered WP independently completed: 0.
Registered WP kept open: 1.
Newly blocked WP: 0.
Inherited P0 blocked: WP-ACC-005 (1).
Production banking code: 0; banking tests executed: 0.
Programme-wide accepted WP denominator and remaining count: UNKNOWN.
No new numbered batch ZIP was created because the package remains open. This document is an independently reviewable interim checkpoint, not a completed batch.

## NEXT EXACT TASK
GOV-WBS-RECON-001 — obtain and pin the complete recursive GitHub tree at the current main HEAD, generate a machine-readable path/blob/checkpoint-to-WP crosswalk for all historical artifacts, flag unmapped files and duplicates, and seek independent owner/reviewer approval before declaring an exhaustive denominator.
