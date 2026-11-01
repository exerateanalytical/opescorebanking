# OPES Core Banking — Checkpoint AZ (research-only)

**Date:** 2026-11-01. **Phase:** 4, Accounting Core / Financial Integrity. **Active WP:** WP-ACC-005 (OPEN, P0-blocked). **Predecessor:** AY, verified main commit `f085981c65378e110486ed22fe70fbec931e4106`. **Last completed WP:** WP-ACC-004 (inherited, not independently reaudited).

## New material evidence in AZ
The official COBAC Bulletin No. 6, printed pages 190–191, contains **I-2003/01 Article 7**, which **expressly amends I-2002/01 Article 14 (908 becomes 918)** and **Article 16 (928 becomes 938)**. The 2002 original and 2003 correction therefore cannot be treated as concurrent valid current account definitions. This is a newly reconciled amendment edge not captured in AY's ten observations. The 2003 instruction states 1 January 2004 as its effective date (Article 9); this is a historical candidate, not current-release approval.

2003 Article 2 also has a **within-document** conflict: enumeration assigns 2651 private/2652 public, but commentary calls 2651 public. I-2015/01 Article 3 explicitly lists 2651 public/2652 private; that later enumeration does **not** resolve the 2003 historical ambiguity. I-2015/01 Article 4 labels 29651 private and 29652 public, so automatic numeric-suffix mapping from 2651/2652 to 29651/29652 would be unsafe without institution-approved accounting interpretation.

The 2015 Article 8(d) 312/322 inconsistency remains P0. This checkpoint does not resolve it by inference.

## Evidence and custody
- Official issuer-hosted 2002 scan: https://www.beac.int/wp-content/uploads/2016/10/cbI-2002_01.pdf
- Official COBAC Bulletin 6 (2003 Article 7, printed pp.190–191): https://www.beac.int/wp-content/uploads/2016/10/Bulletin-COBAC-n%C2%B06.pdf
- Official 2015 instruction: https://www.beac.int/wp-content/uploads/2016/10/instruction_cobac_i_2015_01_pcec.pdf
- Original 2002 PDF download to the working container failed due network/DNS restrictions. **No issuer PDF binary was retained or SHA-256 computed.** Browser review of primary-hosted text/images is not cryptographic authentication.

## Delivery contents
`CLAUSE_CROSSWALK.json` records observed amendments, provenance and unresolved issues. `CONTROL_DESIGN.md` sets proposed chart/custody boundaries. `ACCEPTANCE_SCENARIOS.json` specifies unexecuted cases. `QUALITY_REVIEW.md`, `CONTINUATION_STATE.json`, and `EXECUTION_REPORT.md` preserve review and continuation.

**Gate:** NO production code, no financial rule activation, no ledger/settlement posting, no regulatory certification. WP-ACC-005 remains OPEN/P0 and DoR FAIL.
