# OPES Core Banking — remaining work after consolidation (2026-11-07)

## Status categories
- **Source-preserved**: Original specifications and/or prototype code retained; not a production function.
- **Implemented/tested scope**: Real Java 25 + PostgreSQL code passes CI for a limited operation.
- **Operationally ready**: Requires bank-owned evidence, authoritative integrations, accepted security and deployment. **No module is designated fully accepted.**

| Capability | Recovered / implemented | Remaining production work |
| --- | --- | --- |
| Bank ledger | Java 25 posting slice, balanced immutable journal, replay and scope tests | End-to-end account and GL servicing, finance close, settlement, reversals, distributed failure, recons, signoff |
| 25 banking domain APIs | 25 typed OpenAPI candidates, 100 candidate operations, 25 typed PG review tables | Domain-specific actual services, bank products, CIF, accounts, AML, payments, loans, cards, treasury and reporting |
| GOV/ARC/TST/INF/DR/REL | Persistent signed maker/checker record workflows, proof files, scoped history | Real approved evidence and identity providers, observation ingestion, restore execution, release deploy automation, production acceptance |
| Screens | 726 IDs and screen blueprints in TypeScript build | 726 individually completed responsive, accessible, server-connected and QA-accepted screens |
| Forms | 726 full candidate form specifications and validation/conditional rule data | Field-level server authorization/validation, saved submissions, domain actions, evidence and approval flows |
| Documents | 407 source specimen contracts | Approved letterheads/templates, bank/customer data, PDFs, digital signatures, QR verification, retention, legal validation |
| Reports | 378 source report definition contracts and archived report prototype/review labs | Authoritative source mapping, data lineage, performance, reconciliation, financial/regulatory returns and maker/checker |
| Security | Bank-bound DB logins, JWT checks and signature-gated six-module controls, main's latest token-router reviews | Real OIDC configuration, cryptographic principal binding for ALL paths, secrets and rotation, MFA, SOD, external pen test and threat model |
| Infrastructure / Recovery | Operations evidence records, runbooks and archived test labs | DR real restore and latency testing, deployment automation, monitoring, SIEM and incident operations |
| Regulatory | Regulation and COBAC/BEAC source notes | Current source-text confirmations, 312/322 classification ambiguities, mandatory return mappings, legal signoff |

## Deduplication rules
1. **Only** `services/opes-core-api` serves authoritative banking operations. Do not deploy historical Node.js/PG candidate labs.
2. **Only** `apps/opes-core-banking-web` is the browser app. Historical JS demo apps under `archive/` are reference-only.
3. One active domain catalog and one typed OpenAPI contract set. Version intentional new endpoints, do not fork the same contract under new active paths.
4. Legacy 589-form inventory is superseded by 726 screen-aligned forms, held in archive, not an additive count.
5. Do not equate 726 screen definitions with 726 fully usable production workflows, or 407 specimens with valid issued documents.
6. Reconcile latest `main` security/governance updates before every branch update; do not force-push over concurrent hourly work.
7. Advance each capability only with a reproducible test and its own bank/regulator acceptance record.
