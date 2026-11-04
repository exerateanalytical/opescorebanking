# Education tenant architecture, licensing and isolation
Education mode is a distinct product environment, not a boolean enabling training on a live bank.
- Independent IdP realm, DB cluster/namespace, network segment, secrets and KMS key hierarchy.
- Outbound egress deny by default; only approved mock services; all production rail endpoints blocked by network policy and signed deployment admission.
- Seed synthetic persons, phone numbers and IBAN-like training identifiers reserved from real routing; prohibit real PANs and personal data.
- Simulated cash, balances, deposits and loans have no legal financial value. Every screen, API response, CSV/PDF and receipt displays TRAINING / SIMULATED.
- Licence claims: institution_id, course seats, feature set, term dates, offline grace window, signature, revocation and renewal. Offline grace must not bypass user access controls.
- Admin actions: course reset, fixture load, clock advance, fault injection and rubric publication require role-specific audit.
- Evidence exports hash individual attempts, include assignment version, instructor approvals, student pseudonym, case IDs and event lineage.
- Optional on-prem campus deployment with local simulation server and periodic licence sync; fail safely without deleting student work.
- Promotion from education to production prohibited; only reviewed software code artifacts can be shared, never databases, keys, identities, fixtures or event streams.
- Verify with negative egress tests, bank/education token cross-realm tests, synthetic-data scans, no-production-credential scans and simulated-only receipts.
