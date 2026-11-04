# ADR-OPES-002 — Apply industry standards without misrepresenting binding COBAC rules
**Date:** 2026-11-04
**Decision:** Industry practices are the default for matters not prescribed by binding law. A conflict in a published statutory account classification is isolated and recorded, not silently rewritten.

## Verified primary-source text
In COBAC Instruction I-2015/01 (official BEAC scan), printed page 5 Article 7(d) identifies `312` as sensitive medium-term credit. Page 6 Article 8(b) identifies `322` as sensitive short-term credit. Printed page 7 Article 8(d) labels the parent `312` for sensitive short-term credit while listing `3220–3227` child codes. These statements can be reproduced from the original scan.
Source: https://www.beac.int/wp-content/uploads/2016/10/instruction_cobac_i_2015_01_pcec.pdf (PDF pages 5–7 in the file's numbering; source date/validity subject to applicable amendment review).

## Decision that permits engineering to proceed
1. Build the **jurisdiction-neutral** ledger engine using immutable internal account IDs, per-currency balanced double-entry, integer minor-unit amounts or rigorously constrained decimal precision, idempotency, versioned posting policies, explicit correction journals, and independently reconciled balance projections.
2. Build a separate **effective-dated regulatory classification adapter**. Its semantic key is not the printed chart code. Preserve the source document, article, page, observed value, validity interval and reviewed interpretation. No live output is based on a disputed candidate without documented authority appropriate to the actual customer and jurisdiction.
3. Retain the unresolved Article 8(d) line verbatim with ambiguity status `CONFLICT_IN_OFFICIAL_TEXT`. A plausible typographical error is not a legally authenticated correction.
4. Affected mapping activation, regulator reporting and production migrations have an explicit fail-closed guard; other ledger capabilities and synthetic tests proceed without it.
5. International/industry sources guide technical details where local instruments do not specify them: Basel operational resilience and internal controls, ISO 20022 messaging, OWASP API Security Top 10 2023, NIST security controls and PostgreSQL defensive data modelling. These cannot override COBAC text.

## Operational test cases
- Attempt to activate ambiguous 312 short-term classification without recorded resolution: REJECT.
- Create internal credit semantic classification with no PCEC code: ALLOW as DRAFT but not active regulatory mapping.
- Post balanced synthetic journal with no regulatory classification dependency in lab: ALLOW subject to ledger invariants.
- Retry same financial command: NO duplicate journal; conflicting payload under same idempotency key: CONFLICT.
- Change effective mapping: new version; historic postings and reports remain traceable to the old version.

**Status:** Engineering policy established; implementation and audit evidence remain separate. No claim of COBAC approval.
