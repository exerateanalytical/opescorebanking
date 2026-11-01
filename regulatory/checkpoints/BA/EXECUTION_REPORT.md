# BA execution report — 2026-11-01

**Phase:** 4 — Accounting Core / Financial Integrity. **Work package:** WP-ACC-005, still OPEN/P0-blocked. **Verified predecessor:** AZ `b61bc35ffcc93ca200ea2b97208917e8f5ba3c9b`. BA is a research checkpoint, **not** WP completion or banking/regulatory certification.

| Measurement | Actual result |
|---|---:|
| Work packages attempted | 1 |
| Completed | 0 |
| Kept open | 1 |
| Blocked from closure | 1 |
| Dependent packages attempted | 0 |
| Additional issuer-hosted regulatory instruments inspected | 2 (R-2003/03, R-2010/03) |
| Issuer-hosted PDF direct-acquisition attempts | 5 |
| Original PDF binaries retained | 0 |
| Source SHA-256 computed | 0 |
| New acceptance scenarios specified | 12 |
| Banking tests executed | 0 |
| Production code written | 0 |
| Regulatory requests transmitted | 0 |
| P0 gaps closed | 0 |
| Definition of Ready | FAIL |

**Evidence delta:** R-2003/03 Art.22 distinguishes legal title from trade timing; R-2010/03 Art.1 replaces R-2003/03 Art.24 and includes a historical time-limited prudential treatment; R-2010/03 Art.2 references signature-date commencement but scan date is not reliably legible. I-2015/01 Art.15 shows 6 July 2015 signature-date commencement; Art.2 historical provision figures and Art.14 superseded cross-reference require legal reconciliation. These observations are not authorized 2026 executable rules.

**Source custody:** Five direct requests from the container failed with DNS NameResolutionError for www.beac.int. Browser-based visual evidence is not an original binary or cryptographic verification. All sources and locations are recorded in PRIMARY_EVIDENCE_AND_CUSTODY.md.

**GitHub delivery:** Files are committed via authenticated connector; independent remote file read-back and comparison to prior commit are required before claiming remote verification. No source binaries were pushed.

**NEXT EXACT TASK:** `WP-ACC-005 — Checkpoint BB`: acquire/hash issuer source PDFs; establish current securities prudential amendment/supersession and legal title/settlement applicability; obtain formal PCEC conflict interpretations and institution-approved mappings; continue 01/25–02/25 and R-2018/01 legal evidence acquisition. Preserve all P0 implementation holds.
