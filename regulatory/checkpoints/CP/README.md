# Checkpoint CP — WP-ACC-005: issuer-page Article 8 discrepancy verified

Date: 2026-11-03. Predecessor: CO. Phase 4 — Accounting Core and Financial Integrity. **SAFE PARTIAL EVIDENCE CHECKPOINT. WP-ACC-005 OPEN / P0 BLOCKED. NO IMPLEMENTATION AUTHORIZATION.**

## New primary evidence verified during this execution

The BEAC-hosted 14-page scanned PDF of COBAC Instruction I-2015/01 became accessible via the web PDF viewer:
https://www.beac.int/wp-content/uploads/2016/10/instruction_cobac_i_2015_01_pcec.pdf

Visual inspection of zero-indexed PDF pages 5 and 6 (printed pages **6 and 7**) shows:

1. Printed page 6, Article 8(b), **creates division 321** ("Crédits à court terme sains") and **division 322** ("Crédits à court terme sensibles").
2. Printed page 6, Article 8(c), subdivides **321** with accounts 3210, 3211 (32111, 32112, 32113), 3212, 3213, 3214 (32141, 32142), 3215 (32151–32155 continuing onto printed page 7), 3216 and 3217 (32171–32173).
3. Printed page 7, Article 8(d), **literally prints** `312- Crédits à court terme sensibles`, but the account list immediately below is **3220, 3221 (32211–32213), 3222, 3223, 3224 (32241–32242), 3225 (32251–32255), 3226, 3227 (32271–32273)**.
4. Thus the previously reported discrepancy is now **directly verified against the issuer-hosted page image**, rather than inherited from an earlier checkpoint. The apparent `312` typo is a strong textual inference, **not an authenticated corrigendum**. No automated normalization to `322` is authorized.

Source-page reference: PDF page index 5 / printed p.6, Article 8(b–c); PDF page index 6 / printed p.7, Article 8(d). Web visual inspection on 2026-11-03. Source images were displayed and read; original PDF bytes, SHA-256, and cryptographic authenticity were not obtained or verified in this run.

## Evidence-backed Article 8 draft account hierarchy (NOT approved mappings)

| Article | Printed page | Account or range | Source wording / classification | Status |
|---|---:|---|---|---|
| 8(b) | 6 | 321 | Crédits à court terme sains | PRINT VERIFIED, mapping not approved |
| 8(b) | 6 | 322 | Crédits à court terme sensibles | PRINT VERIFIED, mapping not approved |
| 8(c) | 6–7 | 3210–3217 | Subdivisions of 321, detailed below | PRINT VERIFIED, mapping not approved |
| 8(d) | 7 | **312** | Printed parent label "Crédits à court terme sensibles" | **P0 DISCREPANCY; BLOCKED** |
| 8(d) | 7 | 3220–3227 | Subdivisions printed under disputed parent label | PRINT VERIFIED, mapping not approved |

**Verbatim-number transcription of 8(c), 8(d) (labels not independently transcribed for all leaf codes):**

- 8(c): 3210; 3211; 32111, 32112, 32113; 3212; 3213; 3214; 32141, 32142; 3215; 32151, 32152, 32153, 32154, 32155; 3216; 3217; 32171, 32172, 32173.
- 8(d): 3220; 3221; 32211, 32212, 32213; 3222; 3223; 3224; 32241, 32242; 3225; 32251, 32252, 32253, 32254, 32255; 3226; 3227; 32271, 32272, 32273.

**Do not treat the lists as approved operational leaf accounts.** Account taxonomy may have later amendments, effective-date restrictions and institution-specific applicability; no complete amendment-chain comparison was done in this run.

## Regulatory and engineering interpretation

- The simultaneous Article 8(b) creation of division 322 and Article 8(d) listing of 322-prefixed children makes 322 the plausible intended parent. This is **an engineering inference only**, not authority to alter the printed 312.
- Maintain distinct fields `printed_parent_code=312`, `inferred_parent_code=322`, `source_article=8(d)`, `source_printed_page=7`, `discrepancy_status=UNRESOLVED`; prevent any ledger, reporting or migration use of inferred mapping.
- Source provenance must distinguish direct page-image reading from an authenticated signed corrigendum. Need official PCEC clarification letter or later signed correction, legal review and institution CFO sign-off before activation.
- Design-time negative tests (NOT EXECUTED): refuse 312→322 auto-correction; reject missing provenance; reject backdated account-rule activation; reject mixing PCEC with PCEMF; reject any posting to unapproved mappings; reject trial-balance-changing migration without balanced, approved entries; reject non-idempotent replay; reject bypass of maker-checker.
- Existing immutable posted journals, exact monetary arithmetic, reversal-only correction, double-entry, reconciliation, independent audit and closed-period safeguards remain mandatory.
- R-2018/01 historical effective-date accounting implications remain open. No new retrospective treatment was authorized.
- CERBER reporting mapping and separate PCEMF institution profile remain gated.

## Quality review and blockers

Regulatory: primary printed inconsistency confirmed; authoritative correction still missing (P0). Accounting: full chart version/supersession and CFO sign-off missing (P0). Architecture: versioned semantic account mapping remains proposed only. Security: maker-checker and audit design requirements not implemented. Risk/AML: no new activated controls. Data: provenance schema draft only. Operations: reconciliation and rollback not tested. Testing: negative scenarios specified, not executed. Auditor evidence: original PDF bytes/hash and signed correction still absent. No production code or certifications.

## Execution accounting

Attempted 1 work package (WP-ACC-005 continuation); completed 0; kept open 1; blocked from closure 1. One safe partial evidence checkpoint CP documented; P0 resolved 0; production code 0; executable tests 0. No dependent work package attempted. Definition of Ready: FAILED.

## NEXT EXACT TASK — CQ

**WP-ACC-005 / Checkpoint CQ:** Search issuer PCEC clarification letters and subsequent signed amendments specifically for the Article 8(d) 312/322 discrepancy; obtain and archive the authoritative correction if one exists. Independently compare the printed p.6–7 hierarchy with the base PCEC and later amendments, with versioned source/page/leaf labels. Keep all inferred mappings blocked and do not begin production implementation.
