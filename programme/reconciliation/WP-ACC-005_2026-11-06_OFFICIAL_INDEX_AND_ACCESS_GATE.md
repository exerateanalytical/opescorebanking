# WP-ACC-005 — official-index corroboration and source-access gate (2026-11-06)

Status: OPEN / P0 BLOCKED. Evidence supplement to WP-ACC-005_2026-11-06_PRIMARY_TEXT_DISCREPANCY.md; not a new accepted work package, not batch 151, and not authority to encode any 312/322 mapping.

## Evidence acquired
- Official BEAC COBAC instruction index: https://www.beac.int/supervision-bancaire/instructions-de-cobac/ lists **Instruction COBAC I-2015/01 PCEC** as a 2015 COBAC instruction. The index is a provenance anchor, not an erratum or a statement of current consolidated validity.
- Official BEAC COBAC regulations index: https://www.beac.int/supervision-bancaire/reglements-de-cobac/ lists **COBAC R-2018/01** on classification, accounting and provisioning of receivables. Its precise relationship to the 312/322 PCEC entries has not been article-by-article reconciled.
- Official primary PDF previously identified: https://www.beac.int/wp-content/uploads/2016/10/instruction_cobac_i_2015_01_pcec.pdf . The earlier evidence note records a conflicting Article 8(d) heading versus 322-prefixed subdivisions.

## Verification limits (this execution)
- Official PDF web retrieval returned HTTP 502 in the document viewer; direct container download failed DNS resolution. Therefore **no page-image inspection, byte-level source hash, signature validation, or complete article comparison was performed in this execution**.
- Searches of the official BEAC instruction and regulation indexes did not establish an official erratum or consolidated amendment resolving the discrepancy. **Absence from these search results does not establish absence of an erratum**.
- Neither the applicability date of the full accounting mapping nor independent regulatory-accounting approval was verified.

## Fail-closed decision
Do not merge account 312/322 rules into executable posting templates, migration rules, reporting maps, or production configuration. Keep WP-ACC-005 BLOCKED; maintain 15/15 DoR gates. No production code or banking tests authorized by this note.

## Review checklist
1. Obtain and hash original BEAC-hosted signed PDF; visually inspect printed pages 4, 5 and 7 against extracted text.
2. Locate official subsequent amendments/corrigenda and verify effective dates.
3. Review COBAC R-2018/01 against the relevant PCEC account mapping and the applicable institutional profile.
4. Record independent accounting/regulatory reviewer decision and versioned mapping evidence.
5. Prepare and execute mapping/regression tests only after formal DoR approval.

NEXT EXACT TASK: Recover a verifiable original BEAC PDF binary, hash it, and inspect the Article 7/8 page images before seeking accounting mapping approval.
