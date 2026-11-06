# WP-ACC-005 — primary-text discrepancy evidence (2026-11-06)

Status: OPEN / P0 BLOCKED. This is an evidence note, not a completed work package or batch 151. No production posting mappings authorized.

## Primary source
BEAC-hosted COBAC Instruction I-2015/01 PDF: https://www.beac.int/wp-content/uploads/2016/10/instruction_cobac_i_2015_01_pcec.pdf
Source inspected 2026-11-06. Article 7(b),(d), PDF printed page 4: account 312 is *Crédits à moyen terme sensibles*, with subdivisions 3121–3127. Article 8(b), printed page 5: account 322 is *Crédits à court terme sensibles*. Article 8(d), printed page 7, unexpectedly labels its heading “312- Crédits à court terme sensibles” while immediately enumerating 3220–3227 subdivisions. This is a textual inconsistency in the hosted primary document, not proof that the intended chart is ambiguous in every authoritative edition.

## Interpretation control
Provisional reading: Article 8(d)'s “312” heading appears to be a typographical error for “322”, because Article 7 assigns 312 to medium-term sensitive credits, Article 8(b) assigns 322 to short-term sensitive credits, and Article 8(d) lists 322-prefixed subdivisions. This is an INFERENCE, not an official erratum or an approved accounting rule. Never encode the heading literally, silently amend it, or overwrite 312/322 mapping without regulatory-accounting review.

## Required acceptance evidence
1. Retrieve full original signed PDF and inspect its page images for extraction/OCR artifacts.
2. Search COBAC/BEAC official corrigenda and later effective-dated PCEC modifications; preserve source version, publication/effective date, and hash.
3. Compare the original PCEC, amendments and currently applicable institutional chart, including credit-classification treatment under COBAC R-2018/01.
4. Obtain independent regulatory-accounting reviewer signoff on 312/322 mapping and associated migration/ledger reconciliation cases.
5. Register positive, negative and regression tests ensuring 312 maps only to medium-term sensitive credit and 322 only to short-term sensitive credit when approved; do not run or claim tests before implementation.

## Dependency impact
WP-ACC-005 remains BLOCKED. Credit product posting templates, prudential reporting mapping and production ledger account configuration dependent on this distinction remain fail-closed. Unrelated research may proceed.

NEXT EXACT TASK: Inspect the source PDF page images and locate official corrigenda/later amendments before proposing a reviewed 312/322 mapping.
