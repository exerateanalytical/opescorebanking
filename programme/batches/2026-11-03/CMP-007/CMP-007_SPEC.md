# CMP-007 — Regulatory reporting lineage, prudential calculation and approval

Batch 147 | OPES Core Banking | 2026-11-03 | DRAFT, REVIEW OPEN

## Purpose
Produce reproducible regulator-directed reporting from authoritative banking sources with complete transformation evidence and institution-specific signed rule mappings.

## Candidate data model
| Name | Type | Intent |
|---|---|---|
| `report_run_id` | uuid | Unique calculation |
| `institution_id` | uuid | Licensed reporting entity |
| `report_type` | string | Authorized template |
| `reporting_period` | string | Financial cutoff |
| `source_cursor` | string | Ledger/event watermark |
| `mapping_version` | string | Approved chart taxonomy |
| `calculation_version` | string | Rules and methods |
| `control_totals_ref` | uuid | Reconciliation proof |
| `reviewer_id` | string | CFO/compliance approval |
| `status` | string | Prepared reconciled reviewed submitted |

## State transitions and guards
1. PREPARED>CALCULATED:inputs validated
2. CALCULATED>RECONCILED:control totals match
3. RECONCILED>REVIEWED:independent CFO approval
4. REVIEWED>SUBMITTED:authorized filing
5. ANY>BLOCKED:rule or data conflict

## Workflow and recovery
1. Resolve legal entity, reporting period and verified applicable authority edition
2. Gather immutable ledger and customer/risk source snapshots
3. Calculate using approved effective-dated mappings and exact money arithmetic
4. Reconcile totals and exceptions to financial control ledger
5. Release report only after independent legal/finance review and actual submission protocol

## Required controls
1. CMP-007-REQ-01: PCEC 312/322 conflict blocks affected prudential report classifications
2. CMP-007-REQ-02: An unapproved mapping cannot produce regulator-compliant figures
3. CMP-007-REQ-03: Reporting projections never become independent authoritative books
4. CMP-007-REQ-04: Every report metric traces to input, transformation and reviewer
5. CMP-007-REQ-05: Submission proof distinct from local file generation
6. CMP-007-REQ-06: Cross-institution financial figures cannot be included by implicit join

## Acceptance cases — NOT RUN
- [ ] CMP-007-T01: Unmapped account code blocks report acceptance
- [ ] CMP-007-T02: Trial balance disagreement creates exception
- [ ] CMP-007-T03: Same cutoff and rule version reproduce totals
- [ ] CMP-007-T04: CFO self-approval barred where SoD applies
- [ ] CMP-007-T05: Unverified submission not marked accepted

## Evidence gate
Official reporting forms, authenticated mapping/corrigenda, qualified CFO/regulatory reviewers and actual reconciliation tests.

Code: none. Tests executed: zero. Independent review: pending. No regulatory certification. Historical accounting 312/322 and bank-specific rail participation P0s remain blocked.
