# OPES Core Banking — unified production codebase

**Canonical engineering baseline:** Java 25, Spring Boot 4.1.2, PostgreSQL 16+ backend; React/TypeScript staff web application. This repository uses **one active runtime** for each tier. **Not yet accepted for real banking deployment.**

## Active application code
- `services/opes-core-api/`: real PostgreSQL-bank-bound application, limited posting slice, 25-domain typed review interfaces and 6 persistent operational-control RECORD modules.
- `apps/opes-core-banking-web/`: one React + TypeScript frontend; source registries for 726 screens, 726 forms, 407 document templates and 378 reports; six real control-record workflows and evidence screens.
- `services/opes-core-api/src/main/resources/db/migration/`: database migrations V1 onward. Apply only via reviewed release controls; never treat disposable CI fixtures as production data.
- `governance/consolidation/UNIFIED_SOURCE_INVENTORY.json`: source provenance, exact archived blobs, availability and release gates.
- `governance/consolidation/REMAINING_WORK.md`: priority roadmap and truth status per capability.

## Preserved historical work
`archive/historical-prs/` contains the original UI/form/report/document specimens, 589 superseded forms and Node.js Stage3 candidate code. These references **are not live service implementations and must never be included in production deployables**. The earlier engineering labs in `engineering/` are also evidence, not production runtimes. Historical workflows are archived outside `.github/workflows/` so they do not execute as competing production pipelines.

## Verified vs operational
The six control modules have genuine bank-bound records and review/evidence lifecycles; the documents/reports/forms/screens are primarily **source definitions or inert previews**. Neither the 25 domains nor the 726 banking workflows are complete. Financial, regulatory, security, identity and rollout gates are still open.

See `governance/consolidation/REMAINING_WORK.md` and the inventory for what remains.
