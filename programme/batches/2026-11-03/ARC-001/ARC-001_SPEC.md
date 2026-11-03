# ARC-001 — Enterprise context map

OPES Core Banking | 2026-11-03 | Batch 21/30 | Status: ARCHITECTURE DRAFT DELIVERED; ACCEPTANCE OPEN
Based on prior governance and CT/CP checkpoint documents already verified in exerateanalytical/opescorebanking. This is a candidate technical specification, not code or a claim of regulatory approval.

## Domain requirements and control design
1. **ARC-001-R01:** Define contexts Customer Information, Product Catalogue, Accounts, Accounting, Branch Cash, Payment Orchestration, Credit, Treasury, Compliance, Reporting and Digital Channels.
2. **ARC-001-R02:** Customer Information is authoritative for identity and customer relationships; Accounts owns account lifecycle, mandates and restrictions.
3. **ARC-001-R03:** Product Catalogue owns product definitions and effective-dated approved terms; Accounting owns financial journals and reporting reconciliation.
4. **ARC-001-R04:** Payment Orchestration owns external instruction status and evidence links, while bank accounting remains an independent responsibility.
5. **ARC-001-R05:** Credit owns contracts, schedules and collections; Treasury owns positions, forecasts and policies; neither overwrites Accounting source records.
6. **ARC-001-R06:** Define supported interactions as documented APIs, events or approved read-only projections instead of undocumented shared database access.
7. **ARC-001-R07:** Require every cross-context flow to identify authority, responsible team, audit correlation, error outcome and reconciliation dependency.
8. **ARC-001-R08:** Maintain a context ownership register and unresolved interface decisions for legal, operations and finance review.

## Deliverables for acceptance
- Context ownership register
- Interaction diagram specification
- Authority/responsibility mapping

## Acceptance tests to prepare (NOT RUN)
- [ ] AC-1: Every key entity has one authoritative owner
- [ ] AC-2: No two contexts independently own same journal
- [ ] AC-3: Each flow has an error and recovery owner

## Evidence and approval gaps
- Domain owner approvals and institution scope pending

## Completion boundary
Delivered design draft only. No tests executed, no production code, no certified financial configuration. Implement only after domain DoR, source authority and institution review.
