# OPES Core Banking — Software implementation sizing and client architecture (proposed v0.1)
Date: 2026-11-05. Planning model, NOT an approved exhaustive implementation WBS or completed software.
Evidence baseline: governance/CANONICAL_PROGRAMME_STATE.json and governance/OWNER_APPROVED_DOMAIN_OWNERSHIP_REGISTER_2026-11-04.json; GitHub main inspected through e86a609119ad8e71a2f08c533447916889153afd.
## Distinguish inventory from estimates
25 sponsor-approved domain groups; four typed API draft groups; seven lab PostgreSQL RLS tables in four groups; no verified production postable journal or settlement engine; production 15-gate DoR unverified. Historical 210 batches are not accepted production packages. Current actual exhaustive coding WP count and UI screen count: UNKNOWN.
## Planning sizing — 100 domain-level workstream slots, NOT 100 production-ready modules
For each domain, four distinct code workstreams: API = precision-typed contract and endpoint implementation; DATA = validated migration/constraints/RLS/retention; SERVICE = actual domain rules/workflows and observability; TEST = executable negative/concurrency/recovery/security/integration acceptance. These are high-level planning slots, not homogeneous effort estimates or leaf work packages. Some groups (GOV/ARC/TST/REL) may not need an external API, so slots are provisional and must be justified or removed during reconciliation.
| # | Domain | Provisional workstream IDs | Slots | Acceptance |
|---|---|---|---:|---|
| 01 | GOV | GOV-API, GOV-DATA, GOV-SERVICE, GOV-TEST | 4 | Not accepted |
| 02 | ARC | ARC-API, ARC-DATA, ARC-SERVICE, ARC-TEST | 4 | Not accepted |
| 03 | CIF | CIF-API, CIF-DATA, CIF-SERVICE, CIF-TEST | 4 | Not accepted |
| 04 | PRD | PRD-API, PRD-DATA, PRD-SERVICE, PRD-TEST | 4 | Not accepted |
| 05 | ACT | ACT-API, ACT-DATA, ACT-SERVICE, ACT-TEST | 4 | Not accepted |
| 06 | LED | LED-API, LED-DATA, LED-SERVICE, LED-TEST | 4 | Not accepted |
| 07 | BRN | BRN-API, BRN-DATA, BRN-SERVICE, BRN-TEST | 4 | Not accepted |
| 08 | PAY | PAY-API, PAY-DATA, PAY-SERVICE, PAY-TEST | 4 | Not accepted |
| 09 | CRD | CRD-API, CRD-DATA, CRD-SERVICE, CRD-TEST | 4 | Not accepted |
| 10 | TRE | TRE-API, TRE-DATA, TRE-SERVICE, TRE-TEST | 4 | Not accepted |
| 11 | AML | AML-API, AML-DATA, AML-SERVICE, AML-TEST | 4 | Not accepted |
| 12 | REP | REP-API, REP-DATA, REP-SERVICE, REP-TEST | 4 | Not accepted |
| 13 | CHN | CHN-API, CHN-DATA, CHN-SERVICE, CHN-TEST | 4 | Not accepted |
| 14 | CARD | CARD-API, CARD-DATA, CARD-SERVICE, CARD-TEST | 4 | Not accepted |
| 15 | CRM | CRM-API, CRM-DATA, CRM-SERVICE, CRM-TEST | 4 | Not accepted |
| 16 | FEE | FEE-API, FEE-DATA, FEE-SERVICE, FEE-TEST | 4 | Not accepted |
| 17 | REC | REC-API, REC-DATA, REC-SERVICE, REC-TEST | 4 | Not accepted |
| 18 | SEC | SEC-API, SEC-DATA, SEC-SERVICE, SEC-TEST | 4 | Not accepted |
| 19 | DAT | DAT-API, DAT-DATA, DAT-SERVICE, DAT-TEST | 4 | Not accepted |
| 20 | API | API-API, API-DATA, API-SERVICE, API-TEST | 4 | Not accepted |
| 21 | INF | INF-API, INF-DATA, INF-SERVICE, INF-TEST | 4 | Not accepted |
| 22 | DR | DR-API, DR-DATA, DR-SERVICE, DR-TEST | 4 | Not accepted |
| 23 | ADM | ADM-API, ADM-DATA, ADM-SERVICE, ADM-TEST | 4 | Not accepted |
| 24 | TST | TST-API, TST-DATA, TST-SERVICE, TST-TEST | 4 | Not accepted |
| 25 | REL | REL-API, REL-DATA, REL-SERVICE, REL-TEST | 4 | Not accepted |
Subtotal: 25 × 4 = 100 planning slots; zero accepted as production from this table.
## Cross-cutting implementation workstreams (proposed, 12)
PLAT-01 trusted OIDC to bank principal routing; PLAT-02 key/HSM custody; PLAT-03 bank-local membership/revocation fence; PLAT-04 immutable journal transaction and outbox; PLAT-05 balance projection/rebuild; PLAT-06 reversal/reconciliation and crash recovery; PLAT-07 external-rail UNKNOWN/settlement adapter simulator; PLAT-08 audit evidence pipeline; PLAT-09 telemetry/incident operations; PLAT-10 DR/restore verification; PLAT-11 migration and release rollback; PLAT-12 performance/soak/fault-injection harness. Some overlap domain slots: deduplicate before approving WBS.
## Client application workstreams (proposed, 3)
CLIENT-01 responsive browser-based staff workspace (branch, teller, back office); CLIENT-02 customer mobile app (Android/iOS); CLIENT-03 desktop packaging decision and offline branch continuity adapter. These are workstreams, NOT three screens. Exact screen/module inventory requires role/workflow mapping.
Provisional total = 100 + 12 + 3 = **115 high-level workstream slots**. This is a transparent sizing model, NOT a verified exhaustive leaf-WP denominator; overlap and uneven effort prevent treating 115/30 as a schedule.
## Client architecture decision status
Recommendation only, pending ADR and non-functional evidence: browser-first enterprise web application, responsive/PWA where appropriate; optional desktop shell or dedicated branch agent for hardware and offline continuity, not a second independently maintained business-logic implementation; native or cross-platform customer mobile application. No evidence that a native Windows desktop app or a particular frontend/backend framework has been sponsor-approved and implemented. Existing engineering evidence establishes PostgreSQL and OpenAPI laboratories, not an accepted full application stack.
Candidate framework assessment, NOT implementation claim: TypeScript React/Next.js staff web UI; Java 21 Spring Boot or .NET backend services (selection pending comparative ADR); PostgreSQL for bank-local transactional storage; React Native/Expo for customer mobile; .NET/WPF or Tauri only if a native desktop/branch peripheral requirement is proven. Architecture and security DoR must decide runtime and service boundaries. Do not claim software is already built in these frameworks.
## Priority, risks, and acceptance
Critical path: SEC-TENANT-ROUTING-001 → LED atomic bank-local posting/outbox and crash/revocation tests → ACT/REC → BRN/PAY. P0 SEC principal/membership consistency, key custody, and financial atomicity remain open. COBAC 312/322 taxonomy mapping quarantined; does not prohibit neutral ledger engine development. No bank agreement or external CFO approval required for vendor software development.
Acceptance for sizing: map each of the 115 provisional slots to real repository assets, domain requirements, DoR/DoD, owner, reviewer, dependencies, test cases, implementation status and unique source evidence; remove overlaps, split oversized workstreams, add missing UI workflows and derive verified denominator. Until then report exhaustive total UNKNOWN.
NEXT EXACT TASK: GOV-WBS-RECON-001 — reconcile this 115-slot sizing model with actual GitHub files and owner-approved 25-domain requirements; establish non-overlapping leaf-level coding WBS, including UI screen inventory and client-stack ADR, without displacing SEC-TENANT-ROUTING-001 on the engineering critical path.
