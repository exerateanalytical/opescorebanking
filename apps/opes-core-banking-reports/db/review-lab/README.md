# Reporting PG16 durable maker-checker isolation lab

This lab must run only on synthetic disposable PostgreSQL 16 database opes_test. The bootstrap explicitly rejects other database names or other versions; credentials are CI-only and must never be used operationally.

Tests: four distinct authenticated SQL login roles; SESSION_USER-derived bank/actor isolation; forged tenant GUC ignored; bank A maker and independent checker transitions; duplicate/replay denial; direct DML denial; unbound role denial; bank B separation; SQL row-lock/compare-and-swap; atomic review update and durable audit insert; audit-conflict rollback; append-only audit trigger. There is no function that publishes, prints, files a regulatory return, or issues a financial record.

This lab does not establish deployed OIDC database role routing, production database RLS, ledger correctness, multi-node concurrency, external payment rail finality, trustworthy customer data, WORM storage, or legal/regulatory acceptance. A verified bank identity-to-DB-login gateway, independent security tests and regulator-specific mappings remain mandatory.

Additional PG16 tests exercise two simultaneous authenticated maker sessions competing for the same draft version. Exactly one transition/audit pair must commit. A separate explicit client ROLLBACK must revert both state and audit. Another test revokes the database principal at the trusted authority and confirms that subsequent read/update calls fail closed. These tests prove only their isolated PostgreSQL 16 conditions; distributed identity refresh and crash/recovery remain unverified.
