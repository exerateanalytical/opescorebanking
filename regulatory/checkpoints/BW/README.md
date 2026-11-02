# Checkpoint BW — OPES Core Banking (2026-11-02)

**Phase:** 4 — Accounting Core and Financial Integrity. **Work package:** WP-ACC-005 (OPEN / P0-BLOCKED). **Predecessor:** BV, verified main `0081e58142f8a29b787b1d1a44810c9676733858`. **Definition of Ready:** FAIL.

## Incremental contribution
Re-examined the **issuer-hosted reproduction** of COBAC R-2024/01 in the BEAC-hosted COBAC 2024 Annual Report, with specific clause traceability for Article 2 (differentiated institution scope), Article 16 (territorial data availability), Articles 26–30 (incident management and reporting), and Article 41 (legal commencement versus transition). The same report's narrative dates are distinguished from its reproduced operative clause. This does **not** authenticate a standalone original, later amendments or a binding clarification.

New design-only deliverables: source/provenance and conflict record; temporal and incident policy gate; incident/evidence state machines and contracts; 18 unexecuted negative acceptance scenarios; multidisciplinary review; continuation state; execution report. The package refines BV, not duplicates it.

## Non-negotiable safety
No historical numeric threshold, notification clock, payment authorization, prudential calculation, PCEC mapping, settlement assertion or compliance status is activated as executable policy. Preserve immutable journals, exact money, idempotency, maker-checker, tenant isolation, independent reconciliation and unknown external outcomes. No production code or banking test was executed.

## Single continuation
`WP-ACC-005 — Checkpoint BX`: obtain signed standalone current R-2024/01 and authenticated amendment/instruction chain; resolve Article 41 commencement/transition semantics and Article 30 current reporting procedure; obtain signed R-2019/01–02, institution-specific authorization, PCEC and external settlement evidence; preserve P0 hold.
