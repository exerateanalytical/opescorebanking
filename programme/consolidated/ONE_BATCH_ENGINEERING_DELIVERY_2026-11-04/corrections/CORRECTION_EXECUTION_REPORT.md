# Corrective specification delivery — 2026-11-04
Status: DRAFTS DELIVERED; NOT INDEPENDENTLY ACCEPTED.
Starting HEAD: cb330df7bc034bb4e534cdf853167eb29ae53eec.

## Files in this corrective package
- 25 distinct domain corrective addenda, each with owned entities, constraints, API operations, authorization, failure/recovery, accounting boundary and 10 specified (unexecuted) acceptance cases.
- 1 OpenAPI 3.1 draft with operation submission/status and security/error semantics.
- 1 PostgreSQL illustrative schema with institution-scoped journal, lines, idempotency, outbox and inbox.
- 1 permission/invariant matrix.
- This report.

## Safety and remaining gaps
- The SQL schema is intentionally NOT deployable: it lacks DB-enforced journal balancing, immutability, RLS and independently reviewed posting rule authority. These gaps are explicit, not hidden.
- The OpenAPI is an architectural generic contract, not 25 complete module-specific APIs.
- Regulatory page/article citations, verified effective dates and CEMAC source applicability per product profile remain open.
- The complete historical repository-to-work-package crosswalk, independent reviewer signoff and approved WBS denominator remain UNKNOWN.
- Full UX screen-by-screen specifications, detailed institution product rule catalogs, executable banking tests and full release evidence are still open.
- WP-ACC-005 PCEC 312/322 P0 remains BLOCKED; bank-specific payment rail entitlement remains UNVERIFIED.
- No production code, test pass, bank licence, certification or financial readiness is asserted.

NEXT EXACT TASK: Complete source-to-WP crosswalk and close remaining detailed per-module API, physical data, UX and test specification gaps, subject to verified regulator evidence.
