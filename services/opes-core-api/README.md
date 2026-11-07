# OPES Core Banking — Production application source (Java 25 LTS / Spring Boot 4.1.2)

This directory contains the **production-targeted application source**. Unlike the historical `engineering/**` laboratory code, its SQL migrations have no `opes_test` guard and its application has no synthetic bank, fabricated approvals, local JWT issuer, embedded test users or automatic bank seeding.

**Developed for production deployment** does not mean **approved for real-money production operation**. The following controls must pass executable acceptance, security and operational review before enabling actual banking postings.

- Spring Boot 4.1.2, Java 25 LTS, PostgreSQL 16+, bank-specific authenticated PostgreSQL principals, stateless OIDC access JWT validation with strict issuer/audience and pinned allowed algorithms, bank-local SQL membership/privilege recheck.
- Core operation: independently approved, exactly balanced immutable double-entry general-ledger journal, bank-specific account references, exact integer minor-unit money, terminal idempotency record, atomic ledger/audit/outbox transaction, read-only outcome resolution.
- App role has EXECUTE-only functions; no direct table writes, releases, settlement, external scheme state or regulatory classification.
- All credentials, bank role provisioning, OIDC and secrets must be provided by deployment/infrastructure outside source control.
- Initial SQL migrations are an actual deployable *proposal* but remain subject to migration upgrades/rollback, independent review, principal provisioning, multi-bank concurrency, threat model and DR tests.

See `docs/ADR-PROD-004.md` and `docs/RUNBOOK.md`. No runtime API is enabled by this development until configured. Synthetic financial examples exist only in `src/test` and CI fixtures.
