# OPES Core Banking — Reporting Studio v0.1

378 individually named report contracts in 25 functional groups, including financial statements, ledger, deposit, branch cash, payment, loan portfolio-at-risk (PAR30, PAR60, PAR90), Treasury, AML, fraud, risk, regulatory source mappings, HR and management information.

## Implementation
- Every report has a unique ID, owner domain, grain, source contract, metrics and formula IDs, dimensions, filter rules, privacy classification, permission roles and outstanding acceptance gates.
- 14 deterministic preview operators cover counts, sums and averages of integer minor units, debit/credit differences, expected/actual differences, exception and pending counts, completion/failure/evidence rates, overdue counts, and exposure-weighted portfolio-at-risk calculations.
- Separate synthetic fixtures, deterministic and in-memory. A real tenant, imported bank CSV or ledger event cannot execute in this client engine.
- Fail-closed multi-currency totals (XAF/EUR/USD never added without explicit currency grouping), safe integer validation and cross-bank isolation checks.
- Groups with fewer than 5 observations suppress both dimensions and values, including totals that might disclose them.
- Report studio: directory, search, domain/type filters, sample run, grouped table, chart, CSV/JSON download and printable HTML specimen.
- Export all 378 report JSON specs and 378 synthetic CSV plus 378 print HTML samples, plus access/metrics/filters/acceptance matrices and SHA-256.

## Run
Use a static server in repository root and navigate to /apps/opes-core-banking-reports/.
Generate artifacts: node apps/opes-core-banking-reports/scripts/export-all.mjs
Run tests: node --test apps/opes-core-banking-reports/tests/reports.test.mjs

## NOT PRODUCTION OR LEGAL/REGULATORY REPORTING
- 0 connected authoritative data sources, 0 official issuers, 0 regulator approvals.
- All financial results are fictional and marked SYNTHETIC / NOT VALID.
- No TEG, risk-weighted asset/capital adequacy calculation, tax computation or officially mapped prudential return is implemented.
- No report can be submitted to COBAC, BEAC or any payment rail, and no trusted report verification link or audit signature exists.
- Bank-specific, branch-scoped, role-permission, maker-checker, data lineage and field retention controls require backend integration.
- Banking sector-specific accounting applies, subject to institution class; do not presume SYSCOHADA financial report equivalence.
- French translation, full visual/accessibility audit, 200% zoom and real-data reconciliation remain pending.

The reports branch is intentionally based on forms PR #5, which is based on screens PR #2. Printable documents PR #3 remains independent. This changes neither canonical main nor any production ledger.
