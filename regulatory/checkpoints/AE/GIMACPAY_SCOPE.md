# WP-PAY-GIMAC-001 — Research-only integration boundary

## Scope
Card, bank-to-wallet, wallet-to-bank, bank-to-bank, merchant QR, POS/ATM, exception/dispute handling, clearing, settlement, reconciliation, treasury and operational support. Individual services are not assumed available to any given institution.

## Architecture
Channel → Payment orchestration → risk/authorization → durable payment instruction and outbox → GIMAC adapter → GIMAC network. Independent network inbox, deduplication, query/status, settlement evidence intake and reconciliation. Accounting Core is the sole posting authority. Separate legal entity, institution, tenant and currency boundaries. No direct balance edits.

## Proposed lifecycle
CREATED → VALIDATED → AUTHORIZED → SUBMISSION_PENDING → SUBMITTED → {ACCEPTED, REJECTED, UNKNOWN} → {CLEARING_PENDING, CLEARED} → {SETTLEMENT_PENDING, SETTLED}; exceptional DISPUTED, REVERSAL_PENDING, REVERSED, FAILED. This is an internal conceptual model, **not** a representation of GIMAC's actual protocol. A later message must not regress finality without an approved compensating accounting process.

## Operational boundaries
No fabricated network acknowledgement; an HTTP timeout does not establish failure. Reconcile unknowns by verified provider query and authoritative files. Maker-checker for sensitive manual exception resolution. Distinct controls for onboarding, cryptographic trust, AML/fraud, transaction limits, DR and incident response. No customer-facing success claim from mere queue acceptance.

## Mandatory external evidence
Institution membership/participation status; executed agreements; scheme and version-specific technical specs; secure transport and cryptography requirements; sandbox; GIMAC test plan; certification decision; settlement/clearing calendars and files; fees; chargeback/dispute manuals; QR payload specs; support/incident SLAs; effective-dated BEAC/COBAC rules. All presently UNVERIFIED.

## Accounting dependency
Do not assert debit/credit PCEC accounts, fee allocation, settlement assets, netting or liquidity outcomes until institution and scheme-specific agreements and Accounting Core policy are approved.
