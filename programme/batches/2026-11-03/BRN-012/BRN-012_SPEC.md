# BRN-012 — Cash shortage, overage and financial exception investigation

Batch 132 | OPES Core Banking | 2026-11-03 | DRAFT, REVIEW OPEN

## Purpose
Classify branch cash discrepancies and create controlled remediation without forging counts or editing posted journals.

## Candidate data model
| Name | Type | Intent |
|---|---|---|
| `variance_case_id` | uuid | Investigation |
| `institution_id` | uuid | Bank owner |
| `branch_id` | uuid | Site |
| `cash_session_ref` | uuid | Shift or vault |
| `expected_cash` | string | Exact custody total |
| `observed_cash` | string | Physical count |
| `variance_amount` | string | Signed difference |
| `root_cause` | string | Evidence-based cause |
| `resolution_ref` | uuid | Approved treatment |
| `status` | string | Open investigated resolved closed |

## State transitions and guards
1. DETECTED>OPEN:count discrepancy
2. OPEN>INVESTIGATING:owner assigned
3. INVESTIGATING>REMEDIATION_REVIEW:documented evidence
4. REMEDIATION_REVIEW>RESOLVED:independent acceptance
5. ANY>ESCALATED:fraud or major loss

## Workflow and recovery
1. Preserve signed cash count and transaction cutoff
2. Compute discrepancy from source custody movements
3. Inspect receipts, reversals, pending items and security evidence
4. Escalate suspected theft under separate incident procedure
5. Authorize any correction in a balanced new journal and sign closure

## Required controls
1. BRN-012-REQ-01: Variance cannot be cleared by replacing original physical count
2. BRN-012-REQ-02: No teller self-signoff for shortages
3. BRN-012-REQ-03: Financial correction uses new approved posting, not mutation
4. BRN-012-REQ-04: Unknown cash location remains on exception register
5. BRN-012-REQ-05: Evidence and actor attribution must survive closeout
6. BRN-012-REQ-06: Material fraud suspicions are restricted to authorized investigators

## Acceptance cases — NOT RUN
- [ ] BRN-012-T01: Count mismatch creates open case
- [ ] BRN-012-T02: Without checker resolution remains pending
- [ ] BRN-012-T03: Direct journal mutation refused
- [ ] BRN-012-T04: Duplicate variance notification not duplicated
- [ ] BRN-012-T05: Audit history remains after case closes

## Evidence gate
CFO-approved shortage/overage treatment, actual cash count, security procedure and independent reviewer.

Code: none. Tests executed: zero. Independent review: pending. No regulatory certification. Historical accounting 312/322 and bank-specific rail participation P0s remain blocked.
