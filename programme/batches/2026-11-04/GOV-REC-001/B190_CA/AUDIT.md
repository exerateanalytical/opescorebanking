# GOV-REC-001 — Historical Source Audit, Batch 190 / Checkpoint CA

Date: 2026-11-04. Source: GitHub exerateanalytical/opescorebanking@ee13700c466053bdc3a5e4fb468e65fad939aee1. Registered plan: governance/GOV_REC_001_SUBBATCH_PLAN_151_180_2026-11-04.md.

## Source completeness (not engineering acceptance)
Read every 7 tracked source blob in `regulatory/checkpoints/CA/`; each blob SHA was independently compared with the pinned source tree. Verbatim text source copies are in the ZIP SOURCE/ directory. This covers only this checkpoint directory, not the original missing cumulative archives or the complete programme.

## Inherited assertions, not accepted facts
- Previous historical checkpoint: NOT STATED.
- Reported phase: Phase 4 — Accounting Core / Financial Integrity.
- Reported active package: NOT STATED.
- Reported package state: OPEN_P0_BLOCKED.
- Reported DoR: FAIL.
- WP IDs mentioned in source text: WP-ACC-004, WP-ACC-005.
- Exact historical next task (claim): WP-ACC-005 — Checkpoint CB: obtain issuer-corrected Instruction 001/GR/2025 migration annex and current SYGMA V10 activation/participant qualification evidence; acquire BEAC-approved CEMAC-BANK profile versions, CMA REST MT-MX and MX signature guides, signed participation and settlement statements; continue 2014 date/number corrections, operative 001/GR/2024, CRSP circulars and all inherited COBAC/PCEC/D-2025/328/01-25–02-25 P0 holds..
- JSON parse failures: none.

## Source ledger
| Name | Git blob SHA | SHA-256 of retrieved text | Bytes | WP mentions |
|---|---|---|---:|---|
| `CONTINUATION_STATE.json` | `10d25ccb63adc324e2e6d1b4b3a62745f87f6ec3` | `f2cee1322d564c4f92d9969f9d822bd6a9d350d332f2584b24a06e0ee581228c` | 2124 | WP-ACC-004, WP-ACC-005 |
| `CONTROL_AND_TEST_DESIGN.md` | `3788b4cb3a86e153378e8a4818f9c81a8343228d` | `ea21719481151cd6e8e0e0cad6446ec7750798dc51462c294df6b16cad61bbac` | 5262 | WP-ACC-005 |
| `EVIDENCE_DELTA.md` | `81821ea385b8437fdfeccd56f22b4aa4846bc9f3` | `980020cc81e536234edb8101a8520a24f5007d8639863c9c204117a0db508b4c` | 5435 | — |
| `EXECUTION_REPORT.md` | `3171e1538d0aa0de3ea536879af495d911e2dee3` | `9d0baf09c760cd9254ead83f78778041e089c098d70fbacf8c8eb1c3a0f97511` | 1915 | WP-ACC-004, WP-ACC-005 |
| `ISO20022_AUTHORITY_GATES.json` | `9993454b43cab8bb9b1e1440a47e4621842f42d3` | `6f109098422504b8c1a32b27b2feedbcf348e8319242717355a07b7071a54af9` | 5371 | WP-ACC-005 |
| `QUALITY_REVIEW.md` | `79ba6c141f7ebbaf4556edd92517733b5373fa0b` | `077e2e2a4c52b7b1ec1b5ecc79bde787fcd6c2f426b8c49fde0e678e8f5fc0cf` | 2277 | WP-ACC-005 |
| `README.md` | `9672c4af6487a1e02c6068b49ad896612eb83a3b` | `839e0819d619a5ecbf3eeb11a9eb2dcbf409b4ed1194063a1a7d720b8f8d5177` | 3173 | WP-ACC-004, WP-ACC-005 |

## Material source-asserted gaps and control holds
- `regulatory/checkpoints/CA/CONTINUATION_STATE.json:9` — "status": "OPEN_P0_BLOCKED",
- `regulatory/checkpoints/CA/CONTINUATION_STATE.json:14` — "work_packages_blocked_from_closure": 1,
- `regulatory/checkpoints/CA/CONTINUATION_STATE.json:28` — "2014 March/May and 2013/2014 conflicts remain unresolved; signed 001/GR/2024, CRSP reporting circulars and participant agreements unavailable"
- `regulatory/checkpoints/CA/CONTROL_AND_TEST_DESIGN.md:26` — - **CA-T01:** Missing issuer-corrected 2025 annex blocks production go-live inference.
- `regulatory/checkpoints/CA/EVIDENCE_DELTA.md:1` — # CA — Primary-source evidence and unresolved interpretation
- `regulatory/checkpoints/CA/EVIDENCE_DELTA.md:11` — - Annex (pages 4–5): schedule headed November 2025, but rows 5–6 and 9–12 display dates in 2025 that are chronologically incompatible with post-signature future activities (e.g. pilot March 2025 and go-live April–May 2025). Some dates/ranges ambiguous; task 12 repeated. **P0 provenance discrepancy: obtain issuer-corrected timeline and independent go-live con
- `regulatory/checkpoints/CA/EVIDENCE_DELTA.md:12` — - Annex lists participant materials: `BEAC_SYGMA_ISO20022_BEAC_IAP_TIA` MyStandards collection, vendor REST MT–MX API specification `CMA-I 3005-21 PTD 002`, MX signature guide `CMA-I 3005-21 PTD 001`, message formats `CMA-I 3005-21 MFR 003`. These materials were **not obtained**, and are not assumed publicly accessible.
- `regulatory/checkpoints/CA/EVIDENCE_DELTA.md:13` — - Preamble shows a truncated year `15 mars 202` for an underlying regulation. Keep unresolved; not an operative-date inference.
- `regulatory/checkpoints/CA/EXECUTION_REPORT.md:9` — ¦ Blocked from closure ¦ 1 ¦
- `regulatory/checkpoints/CA/ISO20022_AUTHORITY_GATES.json:5` — "status": "OPEN_P0_BLOCKED",
- `regulatory/checkpoints/CA/ISO20022_AUTHORITY_GATES.json:42` — "unresolved_conflicts": [
- `regulatory/checkpoints/CA/QUALITY_REVIEW.md:2` — ¦ Review perspective ¦ Decision / unresolved defect ¦
- `regulatory/checkpoints/CA/QUALITY_REVIEW.md:4` — ¦ Regulatory/legal ¦ Issuer-hosted 2025 signed texts now visually authenticated for clause content; annex 2025 chronology contradictory; original hashes, amendment chain, 2014 conflict and signed 001/GR/2024 missing. P0. ¦
- `regulatory/checkpoints/CA/QUALITY_REVIEW.md:10` — ¦ Data/privacy/retention ¦ Institution scoping, data minimization, immutable evidence references; current lawful retention not verified. ¦
- `regulatory/checkpoints/CA/QUALITY_REVIEW.md:18` — **Conclusion:** WP-ACC-005 OPEN / P0 BLOCKED; Definition of Ready FAIL. Work package remains open; dependent packages not attempted. No regulatory readiness, certification, deployment, production code, security scan or test pass claimed.
- `regulatory/checkpoints/CA/README.md:2` — **Date:** 2026-11-03 (Africa/Douala). **Phase:** 4 Accounting Core / Financial Integrity. **Active:** WP-ACC-005, OPEN/P0-BLOCKED. **Predecessor:** BZ at `c582312568669071cb7ca60e852cdeb6ab900368`. **Last completed:** WP-ACC-004 (inherited, not reaudited).
- `regulatory/checkpoints/CA/README.md:8` — - **New P0 schedule discrepancy:** 001/GR/2025 annex is headed November 2025 yet multiple later activities have dates in Jan–May **2025**, earlier than signing. It is unsafe to infer the intended 2026 dates or to declare migration completed from the annex. Other rows show ambiguous ranges and repeated task number 12.
- `regulatory/checkpoints/CA/README.md:9` — - **Preamble transcription anomaly:** the instruction prints the year of a referenced 15 March instrument as `202`; do not guess the missing digit.

## Multidisciplinary QA and DoR status
Regulatory/legal: historical citations and effective dates require direct primary issuer validation; source claims alone do not establish adoption or legal status. CFO/ledger: no monetary journal, accounting account mapping or migration updated. PCEC 312/322 textual inconsistency remains P0. Architecture: document lineage is not proof of Git ancestry or independent WP completion. Identity/security/AML: no privilege, customer KYC, sanctions or payment-rail entitlement assumed. Workflow/payments: external outcomes and reversals remain fail-closed. Data/privacy: preserved source-path, line-level excerpt, Git blob and SHA-256 evidence; legal retention authority not independently adjudicated. Resilience/ops: no deployment or recovery test. Testing: zero banking tests executed in this audit. No reviewer signatures or 15-gate DoR pass; all historical success statements remain unverified.

## Batch conclusion
Evidence archive may be marked DRAFT REMOTELY DELIVERED only after GitHub main branch, per-file extracted content, ZIP Git blob and downloaded ZIP SHA-256 independently match. This does NOT complete GOV-REC-001 nor WP-ACC-005; historical WBS denominator UNKNOWN. Next audit: batch 191 (or reconciliation after batch 180).
