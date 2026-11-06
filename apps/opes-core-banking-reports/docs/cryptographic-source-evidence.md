# Cryptographic source evidence verification

Signed source manifests are now supported for server-side preflight, using Node.js Ed25519 detached signatures.

- Signatures cover snapshot ID, reporting contract revision, institution, exact branch scope, period, currency, source system/revision, mapping version, reconciliation reference, immutable/reconciled flags and SHA-256 source digest.
- Keys must come from a trusted server-side public-key store scoped to a bank and source; no private keys or test key fixtures are committed.
- Mapping approvals must come from an independent bank-controlled registry. Positive signatures alone cannot confer mapping approval.
- Actual source digest and ledger/event lineage must be checked independently through mandatory trusted callbacks. Neither is inferred from a signed manifest or a snapshot's own asserted flags.
- Source metadata can be cryptographically verified while the report still returns BLOCKED/503. No live numbers, PDF statements or regulator filings are exposed.

## API wiring
The server can supply the returned function of `createSnapshotEvidenceVerifier(...)` as the `verifyProvenance` dependency to `createReportSourcePreflight(...)`. The actual authenticated request adapter, source data reader and auditor remain external/unconfigured.

## Non-certification
Even an accepted source manifest does not establish financial correctness, regulator approval, ledger completeness or production readiness. Await P0 tenant RLS, committed replay recovery, mapping acceptance, granular report-specific calculations and independent sign-off.
