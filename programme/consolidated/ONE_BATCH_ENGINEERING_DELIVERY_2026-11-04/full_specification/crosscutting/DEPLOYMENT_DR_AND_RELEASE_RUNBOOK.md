# Deployment, rollback and disaster recovery runbook (draft)
1. Approve institution licence/profile and legal data residency.
2. Provision isolated bank data plane, KMS boundary, network controls, backup policy and monitoring.
3. Verify signed build, SBOM, container/image digests, migration dry-run, feature flag and secret delivery.
4. Execute zero-downtime schema migration only if backwards-compatible; reject destructive journal migration.
5. Canary nonfinancial endpoints; run financial invariant and reconciliation smoke tests in staging.
6. Enable institution-specific integrations only with verified entitlement, contracts and fail-closed adapter policy.
7. Record CFO/CISO/operations release approval, 15 DoR and separate production Go/No-Go evidence.
8. Backup and restore drills: demonstrate RPO/RTO agreed per bank; restore in isolated environment, verify journals, outbox/inbox, settlement references and audit chain.
9. Rollback: disable new writes if integrity uncertain; never restore a snapshot that silently discards externally settled effects; perform forward recovery and reconciliation.
10. Incident: isolate compromised credentials, preserve evidence, determine payment outcome from external authoritative records, coordinate customer/regulatory notifications under applicable law.
No RPO/RTO numerical target is asserted without institution SLA and architecture tests.
