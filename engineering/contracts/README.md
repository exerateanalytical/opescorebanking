# OPES Core Banking strict domain contracts — high-priority first slice

Four domain-specific OpenAPI 3.1 JSON documents are authored for CIF, PRD, ACT and LED (3 commands + 1 read operation each). JSON is fully valid OpenAPI 3.1. This is not a blanket claim that all 25 older generic API drafts have been replaced.

They preserve existing canonical workflow command names. They use strict, closed field-level request bodies, correlation and idempotency headers, an issuer-authenticated and scoped institution path, explicit state and error definitions, and reject client-provided posting balances. Financial amounts use integer minor units; ledger effects are not implemented in these contracts. Data-security and regulatory mapping restrictions remain unchanged.

The `tests/test_contracts.py` suite validates exact schema shape and negative payload examples. It is a contract laboratory, not evidence that a production API, KYC engine, ledger or payment rail executes the operations.

Next: harden individual domain SQL and implement production-bound command handlers only after gate-specific controls; no generic universal payload fields.
