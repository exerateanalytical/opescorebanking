# OPES Core Banking — Checkpoint AP (2026-11-01)

**Phase:** 4 — Accounting Core / Financial Integrity. **Active:** WP-ACC-005, OPEN/P0 BLOCKED. **Previous verified remote checkpoint:** AO. **Canonical lineage:** archive AN contains AE and AD predecessors; AO was remotely committed, AP is its successor. Last completed work package WP-ACC-004 is inherited, not independently recertified.

This checkpoint extends source verification, legal-case provenance, and evidence-acquisition controls. It does not complete WP-ACC-005 or authorize implementation. GIMACPAY remains an independent, unattempted workstream.

## Findings
1. Rechecked primary COBAC consultation communiqué, dated **24 June 2026**, p.3: existing transfer obligations are mentioned, while implementing modalities were still proposed and destined for future approval. This does **not** prove adoption, suspension, or the detailed transfer method.
2. A **18 June 2026** secondary legal/business report describes *separate* challenges to Regulations 01/25 and 02/25, alleging registry filing on **8 September 2025** and stay requests on **1 October 2025**. These dates and court status are **UNVERIFIED LEADS**, not certified filings or orders.
3. A July 2026 secondary report says CDEC continued contesting supervision under 01/25. This is **not** evidence of the outcome for either instrument.
4. No issuer-authenticated complete Regulation 02/25 including printed page 10 / Article 23 continuation / Articles 24–26, original COBAC–MINFI correspondence, certified separate judicial dispositions, final implementing text or bank-specific PCEC accounting approvals obtained.

**Fail-closed decision:** Do not generate postings, change customer liability, create transfer instructions, activate legal thresholds, or infer settlement from account classification. Continue dependency-safe evidence acquisition only.

See EVIDENCE_REGISTER.json, CASE_PROVENANCE.md, CONTROL_DESIGN.md, ACCEPTANCE_TESTS.json, QUALITY_REVIEW.md, CONTINUATION_STATE.json and EXECUTION_REPORT.md.
