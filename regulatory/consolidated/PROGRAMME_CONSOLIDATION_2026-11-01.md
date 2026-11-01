# OPES Core Banking — Consolidated programme record
**Owner:** OPESWARE TECHNOLOGIES  
**As-of:** 2026-11-01  
**Status:** Research/design consolidation; not implementation or certification  
**Canonical latest remotely inspected checkpoint:** BB (verified continuation through AS–BA; predecessors AO–AR and AN cumulative archive).  
**Current phase:** Phase 4 — Accounting Core / Financial Integrity  
**Last reported completed work package:** WP-ACC-004 (inherited; not independently reaudited)  
**Active:** WP-ACC-005 — PCEC Regulatory Accounting Extraction, OPEN / P0 BLOCKED.  
**Independent payments workstream:** WP-PAY-GIMAC-001, OPEN / NOT IMPLEMENTED.

## Scope and assurance mandate
Enterprise banking programme covering CIF/KYC/KYB, products/accounts, ledger, deposits/teller/vault, payments/clearing/settlement, lending, treasury, AML/CFT, fraud/risk, regulatory reporting, digital/agency banking, operations, security, infrastructure and DR. Cameroon/CEMAC first; expansion only with jurisdiction-specific applicability. Quality-over-speed is permanent; up to four sequential dependency-correct packages per run is a ceiling, not a quota. No calendar-triggered code start.

## Sources consolidated and limitations
1. Local cumulative archive `OPES_Core_Banking_Checkpoint_AN_2026-10-09.zip`: 39 nested ZIP layers, historic checkpoints through AN, earlier local integrity verification reported 484 manifest checks and 238 JSON parses. These figures are **prior-run reports**, not freshly re-executed here.
2. Local 31-page integrated research synthesis `OPES_Core_Banking_Consolidated_Research_2026-11-01.pdf` and editable DOCX; includes an inventory of 490 non-ZIP entries across archive layers. This is a synthesis/index, **not** full text of all original entries.
3. Local research delta R01: eight files including source authority matrix, archive verification, regulatory reconciliation, proposed control/test delta, quality review, execution report, continuation state and checksums. R01 was a supplemental artifact, **not** a canonical checkpoint.
4. Remotely fetched canonical continuation states: `regulatory/checkpoints/AO/CONTINUATION_STATE.json`, `AP/CONTINUATION_STATE.json`, `AQ/CONTINUATION_STATE.json`, `AR/CONTINUATION_STATE.json`; plus AR README and execution report. The remote files confirm lineage through AR, superseding R01's earlier uncertainty about remote availability.
5. Existing repository checkpoint files remain the authoritative detailed record. This document indexes/synthesizes them without replacing or duplicating them. **Binary historical ZIPs, DOCX and PDF have not been uploaded by this text-only GitHub delivery.** Do not infer all local artifacts are present remotely.

## Regulatory evidence and open issues
- Historical COBAC R-98/01 and 1998 PCEC are starting references, **not** proof of a current consolidated institution-approved chart. Need subsequent amendments, circulars/letters, reporting specifications and bank CFO/legal sign-off.
- CERBER/SPECTRA historical references are not proof of a current regulatory-reporting schema or connected interface.
- CEMAC Regulations 01/25 (deposit/consignment institutions) and 02/25 (inactive accounts/unclaimed assets) must remain separate legal instruments, with distinct case and court records.
- Independently hosted reproductions of 02/25 omit **printed page 10**, including Article 23 continuation and Articles 24–26. Obtain issuer-complete authenticated text before encoding requirements.
- Secondary reports of legal challenges, alleged court filings and COBAC–MINFI correspondence are **leads, not certified judicial dispositions or signed primary correspondence**. Litigation filing does not automatically suspend a regulation.
- June 24, 2026 COBAC communiqué differentiates existing obligations from proposed implementing rules. It does not certify that drafts were later adopted or grant a bank-specific execution mandate.
- CEMAC revised Treaty Articles 40–44, especially Article 43, introduce an explicit authenticated Official Bulletin publication/effective-date gate. Actual issue/page/effective-date evidence for 01/25 and 02/25 remains unresolved.
- Reported secondary-source conflict on inactivity period (five years vs 36 months) must not be silently resolved or hard-coded.
- Cameroon Decree 2023/08500/PM Article 5(2) vs purported 02/25 Article 15 transfer/closure sequence needs legal reconciliation.
- Bank-specific PCEC GL mapping, liability classification, approved counterparty, liquidity, actual settlement/finality, independent reconciliation and restitution obligations remain unavailable.
- GIMACPAY must not be conflated with SYSTAC/SYGMA. Scheme specifications, participant agreements, certification, fees, disputes, liquidity and reconciliation require authoritative evidence.

## Existing critical gaps and proposals
Preserve prior P0 identifiers including GAP-ACC-057, 063, 064, 065 and 068 as documented in historical checkpoints; their detailed scopes are in their original registers. AR proposes GAP-ACC-069 (P0 candidate: publication chain) and GAP-ACC-070 (P1 candidate: policy authenticity/approval/recovery). **Candidate labels are not approved gap closure or governance decisions.** ADR-1080–1096 and other proposals remain unapproved unless separate signed decision evidence exists.

## Financial integrity invariants (non-negotiable)
Immutable posted journals; balanced double-entry; exact monetary arithmetic; controlled compensating reversal; idempotent posting and retries; separate pending, clearing, settlement and finality; independent reconciliation; no direct balance mutation; no status-created/destroyed funds; no invented settlement or liquidity; explicit UNKNOWN external outcome; no automatic duplicate retry. Regulatory authority, customer-level eligibility, notice, maker-checker, transfer instruction, settlement proof, accounting recognition, reconciliation and restitution must be separately evidenced and stateful.

## Proposed control architecture — NOT IMPLEMENTED
- Effective-dated, provenance-linked regulatory policy registry; separate `known_at` and `effective_from`; no automatic retroactive journal rewrite.
- Legal instrument and publication proof; case classification; notification; approval; payment instruction; external outcome; settlement; immutable accounting; reconciliation; restitution tracked as separate entities/states.
- Fail-closed policy activation requiring issuer-authenticated complete text, effective date, amendments, certified court effect, applicability, bank legal/CFO approvals, mapping, counterparty and reconciliation plan.
- Segregation of duties, least privilege, maker-checker, privileged access, strong auth, HSM/key boundaries, signed evidence, immutable audit, secrets, supply-chain security, AML/fraud controls, privacy/retention and DR from design.
- Proposed negative acceptance scenarios in AO–AR and R01 are specifications only; none are reported as executed banking tests.

## Definition of Ready / implementation decision
All 15 programme DoR conditions apply separately to each bounded context. WP-ACC-005 **FAILS** on current legal source completeness, institution-specific accounting/settlement decisions and unresolved P0 risks. **Production banking code: not started. Banking acceptance tests executed: zero. Regulatory certification: none.** Do not infer readiness from documentation volume or GitHub commits.

## Canonical repository map
- `regulatory/checkpoints/AO/`: primary 2026 COBAC communiqué evidence continuation.
- `regulatory/checkpoints/AP/`: separate legal-case provenance and control scenarios.
- `regulatory/checkpoints/AQ/`: second incomplete 02/25 reproduction, Article 26 secondary quote, inactivity-period discrepancy.
- `regulatory/checkpoints/AR/`: Treaty publication/effective-date gate, publication chain, draft evidence requests and negative scenarios.
- `regulatory/consolidated/`: synthesis only; original checkpoints and unrelated history preserved.

## Quality review and delivery constraints
Legal/regulatory: BLOCKED; accounting/CFO: BLOCKED; settlement/reconciliation: BLOCKED; cybersecurity, AML, privacy, operations and audit controls: design proposals OPEN; test execution and certification: NOT DONE. No completion percentage asserted. This consolidation itself is a documentation artifact, not closure of WP-ACC-005.

## Source pointers
- CEMAC revised Treaty: https://cemac.int/wp-content/uploads/2024/12/traite-revise-de-la-CEMAC.pdf
- CEMAC catalogue: https://cemac.int/reglements-et-directives-2/
- COBAC communiqué 2026-06-24: https://www.beac.int/wp-content/uploads/2016/10/Communiqu%C3%A9-final-consultation-de-la-profession_260624_183742.pdf
- BEAC communiqué 2025-02-12: https://www.beac.int/wp-content/uploads/2025/02/communiqu%C3%A9-de-presse_001.pdf
- Incomplete secondary 02/25 reproduction: https://legecam.cm/wp-content/uploads/2025/08/Reglement-N%C2%B002_traitement-comptes-inactifs-des-avoirs-en-desherence.pdf
These are research pointers, not fresh validation of every URL in this consolidation run.

## NEXT EXACT TASK
**WP-ACC-005 — Checkpoint AS:** Obtain authenticated CEMAC Official Bulletin issue/page/publication/effective-date evidence for 01/25 and 02/25; issuer-complete signed 02/25 including missing printed page 10/Articles 23–26; separate certified court dispositions; original COBAC–MINFI letter; adoption status of June 2026 implementing drafts; bank-approved PCEC mapping, counterparty, settlement and reconciliation policies. Preserve P0 hold and do not activate executable financial policy.

## Consolidation execution report
Work packages attempted: 1 (documentation reconciliation/consolidation); completed: 1 documentation consolidation **only**; kept open: WP-ACC-005 (1); blocked: WP-ACC-005 (1); dependent engineering packages attempted: 0; banking tests: 0; production code: 0. Remote delivery status and SHA must be recorded from actual GitHub response, not assumed.


## Addendum — Checkpoints AS through BB (2026-11-01)
The repository's canonical continuation states were independently read for **AS, AT, AU, AV, AW, AX, AY, AZ, BA and BB**. All continue `WP-ACC-005` as OPEN/P0 BLOCKED, with zero banking implementation and no executed banking tests. Earlier local R01 uncertainty about remote checkpoint availability is superseded by these remote reads.

- AS: official UMAC 2025-07-12 ministerial adoption event by subject; does not establish numbered complete instruments or publication.
- AT: candidate effective-date text in incomplete third-party scans; issuer-certified dates and complete 02/25 missing.
- AU: BEAC 2025-04-15 working-group communiqué; no P0 closure.
- AV–AZ: PCEC 1998 baseline and I-2002/01, I-2003/01, I-2015/01 amendment crosswalk; material 2651/2652, 312/322, 265/2965x conflicts; I-2003/01 Article 7 correction to I-2002/01; no approved bank-specific crosswalk.
- BA: issuer-hosted R-2003/03 and R-2010/03 securities-accounting and prudential amendment; trade, ownership, custody, settlement remain separate; source binaries not retained.
- **BB**: BEAC-hosted R-2016/03 Arts 36–37 expressly supersede earlier own-funds rules effective 2017-01-01 (historical); R-2010/01 Art2 references superseded own-funds definition; R-2010/01 preamble cites R-2009/01 as a securities amendment although issuer-hosted R-2009/01 concerns minimum share capital; R-2003/03 Art16 names its own number for asset-disposal rules while the BEAC index lists R-2003/04; R-2013/04 modifies historical R-93/06 liquidity. These are source-level legal ambiguities, not corrected or activated regulations. See `regulatory/checkpoints/BB/` for the detailed evidence, proposed amendment graph, twelve unexecuted acceptance scenarios, quality review and execution report.

**Current consolidated decision:** `WP-ACC-005` remains OPEN/P0; DoR FAIL; no production code, tests, certifications, current prudential weights or accounting policy activated. Original issuer PDF binary custody and current consolidated regulation chain remain unresolved. All earlier dormant-asset and settlement P0 holds continue.

**Updated single NEXT EXACT TASK:** `WP-ACC-005 — Checkpoint BC`: secure COBAC/legal resolution of historical net-own-funds cross-reference and 2009/2003 numbering conflicts; establish later amendment chain of R-2010/01/02/03 and R-2016/03; retain/hash authenticated source binaries; obtain institution-approved PCEC mapping; continue 01/25–02/25 full publication, Court, implementing and settlement evidence. Do not implement financial postings.
