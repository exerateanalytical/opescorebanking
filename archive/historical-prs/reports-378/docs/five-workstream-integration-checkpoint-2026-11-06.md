# OPES Core Banking — five reporting production workstreams (engineering batch)

## Scope delivered

1. **Identity and institution authorization:** pinned OIDC access-token signature and claim validation; separate bank-owned membership/role/branch entitlement. No client-selected bank or demo/training profile can assert live access.
2. **Read-only domain adapters:** six explicit adapter routes — ledger, deposits, payments, credit, treasury and cash — account for all **25 named reporting groups**, with institution/branch/currency/period/revision exact-scope validation. These are server connection contracts; no live banking services are connected or migrations run.
3. **Reconciliation:** immutable posted two-leg journal and separately provided per-account trial-balance evidence, exact BigInt minor-unit arithmetic, mandatory per-journal balance and source revision. No production ledger writes or settlement instructions.
4. **Calculation and regulatory mapping:** 14 candidate metric operators with integer minor-unit inputs and exposure-weighted PAR. Versioned and period-effective mapping guard demands independent approval evidence, maker/checker separation and legal reference. No claimed COBAC table, law approval, prudential rule, or certified bank calculation.
5. **Maker-checker, retention and acceptance:** durable compare-and-swap + audit storage contracts, independent maker/checker approval, no publish operation, mandatory legal-hold and disposal review, and acceptance registers for **378 reports × 10 mandatory gates = 3,780 blocked evidence gates**.

## Execution

`node --test tests/*.test.mjs`

`node scripts/export-all.mjs`

`node scripts/export-integration-readiness.mjs`

The CI bundles the generated 378 report-level acceptance JSONs, release-gate CSV, summary and SHA-256 manifest alongside the previously existing prototype deliverables. Pass/fail statistics are sourced only from GitHub Actions evidence; no unit test is represented as regulatory certification.

## Deployment blockers — still open

- Configure a real bank-operated OIDC issuer, signing-key rotation and independent durable membership/role store.
- Implement the six approved bank data-plane read-only adapters using signed immutable snapshots. Lab PostgreSQL role demonstrations are not a verified production data connector.
- Obtain independently sourced trial-balance/settlement proofs, reconciled per bank and currency with immutable cutoff.
- Approve report-specific PCEC and other legal mappings, effective dates, financial policies, algorithms and independent golden-data tests. Generic candidate sums/PAR must **not** be treated as officially accepted financial results.
- Provide transactional audit/retention/archive services, review identity proof, official print/PDF signing, EN/FR translations, WCAG 2.2 AA manual testing, penetration/replay evidence and formal sign-off.
- Close existing P0 ledger idempotency replay and tenant isolation concerns in the independent engineering track.

**Hard stop:** 0 production reports, 0 live banking connectors, 0 official regulatory filings, 0 validated institution deployment. These modules never expose an activation switch for reporting/issuance or merge into production. Keep draft PRs stacked and `main` unchanged. Do not process real customer PII via the synthetic UI.

## GitHub sequence

Draft PR #2 screens → PR #5 forms → PR #6 reporting → PR #7 preflight/cryptographic provenance → this independent follow-on integration branch. Printable document PR #3 remains separate. No participating-bank agreement is a dependency to author software; official operational and regulator-facing uses still need the legally applicable certification and institution controls.
