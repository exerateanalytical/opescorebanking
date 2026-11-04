# OPES Core Banking — Canonical Master Recovery State v0.3 (2026-11-04)
**Status:** machine-reconciled repository sources; regulatory/legal/financial acceptance OPEN. Supersedes v0.2 for current inventory facts only; v0.2 remains historical.
## Product
OPESWARE TECHNOLOGIES sells a multi-bank CEMAC-first core banking platform, configurable for licensed institutions and later other African jurisdictions. Banking Education Edition grants software access for training only; it cannot issue banking licences or transact real money.
## Repository-wide audit facts
- Git-tracked baseline: 1,294 files; 1,073 UTF-8 text files read; 221 ZIPs tested by Python ZIP CRC checker.
- Original ZIPs passing checks: 75; original ZIPs failing: **146** (124 malformed extra-field errors and 22 not recognized as ZIP).
- For all 146 invalid historical ZIPs, usable **newly reconstructed** archive representations were generated from source documents beside each invalid ZIP. Original bytes/paths preserved; reconstructions NEVER called originals.
- 150 original engineering WP directories identified, but only 120 have original CONTRACT.json files; 30 GOV/ARC contracts were absent and not invented.
- 59 regulatory checkpoint directories have README bodies inspected. Under full_specification/ there are 143 files; previous manifest number 141 was corrected.
- Four exact duplicate byte groups in historical regulatory/recovery material. Original copies retained because provenance is different.
- 25 domains each have a draft API, proposed SQL, workflow, UI and test matrix. 500 cases in these 25 test CSVs plus 12 education test cases; none executed.
## Important negative findings
- 25 domain SQL drafts do not implement row-level security and must not be deployed as-is.
- 25 domain API draft payload types are generic; precise field-level contracts and semantic validation remain unapproved.
- Historical ACT-001 contract describes product-factory ownership, which overlaps the newer PRD bounded context. Historical ID remains; crosswalk proposes PRD as candidate content owner, subject to architecture approval.
- Bank ledger, payments, security and regulatory designs require primary legal sources and independent review, not just document existence.
## Blockers and acceptance
**WP-ACC-005 P0:** PCEC 312/322 classification requires issuer-authenticated regulatory resolution and CFO/legal approval. No disputed posting mapping activated.
**Payment networks:** bank-specific GIMAC/rail entitlement and settlement finality not assumed.
**Historical original archive custody:** reconstructed evidence is not original evidence.
**Programme WBS and independent acceptance:** accepted WP denominator UNKNOWN, 15 DoR gates NOT VERIFIED, banking tests executed in this audit 0.
## Canonical artifacts
- `programme/consolidated/ONE_BATCH_ENGINEERING_DELIVERY_2026-11-04/reconciliation_2026-11-04/verified_run/` — full text/file checksums, contract register, checkpoint index, original archive integrity results, clearly labelled reconstructed archive package, full cumulative source ZIP, SHA256SUMS.
- `governance/CANONICAL_PROGRAMME_STATE.json` — machine-readable active pointer.
The full-source archive and reconstructed archive package are distinct. Neither archive implies financial correctness, production readiness or independent signoff.
