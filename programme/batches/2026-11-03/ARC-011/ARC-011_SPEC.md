# ARC-011 — Financial transaction and consistency boundaries

**Programme:** OPES Core Banking | **Batch:** 31/60 | **Document status:** DRAFT DELIVERED / REVIEW OPEN | **Date:** 2026-11-03

## Purpose and accountability
Define consistency boundaries between core accounting commands and nonfinancial domain workflows without allowing partial money movements.
The proposed authority belongs to the domain named by this package; actual owner, responsible engineer, legal reviewer and institution profile must be assigned in the authoritative WBS. This document is a proposed design, not an approved rule or banking certification.

## Candidate data / interface contract
| Field | Type | Intent |
|---|---|---|
| `transaction_id` | `uuid` | globally unique transaction reference |
| `institution_id` | `uuid` | licensed entity scope |
| `command_id` | `string` | idempotency reference |
| `journal_id` | `uuid` | authoritative journal link |
| `business_date` | `date` | approved business-day attribution |
| `currency` | `string` | ISO currency code |
| `amount_minor` | `string` | exact unit representation |
| `posting_status` | `enum` | proposed/validated/posted/rejected |
| `reversal_of` | `uuid|null` | explicit correction pointer |

## End-to-end workflow
1. Caller submits authorized command with stable idempotency key.
2. Owning domain validates entity, permissions, lifecycle and effective rules.
3. Accounting command checks balancing, account mapping and unique command identity.
4. Atomic commit persists approved journal and outbox record.
5. External consumers update read models with inbox deduplication.
6. Independent reconciliation compares journal totals and source obligation.

## Domain invariants and implementation constraints
1. **ARC-011-REQ-01** No two services may independently mutate the authoritative financial state.
2. **ARC-011-REQ-02** A posted journal is immutable; correction uses a new balanced journal and original reference.
3. **ARC-011-REQ-03** Each posting is exactly balanced per currency and legal entity in exact arithmetic.
4. **ARC-011-REQ-04** Unknown external results require investigation, never a blind repost or artificial success.
5. **ARC-011-REQ-05** Reporting projections have explicit freshness and source checkpoint markers.
6. **ARC-011-REQ-06** Regulatory PCEC 312/322 mapping remains disabled until competent authority resolves ambiguity.

## Acceptance scenarios — specified, not executed
- [ ] **ARC-011-T-01** Reject journal with unequal debit and credit totals.
- [ ] **ARC-011-T-02** Repeat identical command and verify one authoritative posting.
- [ ] **ARC-011-T-03** Simulate commit-before-outbox-publication and verify eventual delivery.
- [ ] **ARC-011-T-04** Reject cross-institution posting lines.
- [ ] **ARC-011-T-05** Replay a reversal and ensure no duplicate correction.

## Critical dependencies and assurance status
- **To approve:** Approved institution-specific chart mapping, CFO controls, reproducible financial tests and independently signed ledger invariants.
- **Global controls:** enforce institutional authorization, immutable financial postings, exact monetary arithmetic, independent reconciliation, regulatory evidence and maker-checker as applicable.
- **Known hold:** COBAC I-2015/01 account 312/322 conflict and bank-specific payment authorization remain unresolved in inherited checkpoint CT. Do not activate disputed financial functions.
- **Evidence:** GitHub delivery evidences custody only. Peer review: NOT DONE; banking tests: NOT RUN; production code: NOT ADDED; regulatory certification: NOT CLAIMED.

## Next reviewer action
Confirm institution profile, accountable approvers, test fixtures and referenced authority before advancing this work package toward verified acceptance.
