# Current delivery and gap disposition — 2026-11-04

- **GOVERNANCE CORRECTED:** OPESWARE owner approved module scope and internal ownership. Do not request a participating bank or an external CFO signature for ordinary software design, coding or commercial licensing.
- **EXTERNAL RAIL BOUNDARY:** Live SYGMA/SYSTAC/GIMACPAY credentials/rights belong to the deploying authorized operator; simulator development and product source code proceed independently. See ADR-OPES-001.
- **REGULATION:** COBAC official 312/322 printed inconsistency isolated at effective-dated classification mapping. Standards may fill technical design gaps but not silently amend binding text. See ADR-OPES-002.
- **ENGINEERING IMPLEMENTED/TESTED:** engineering/foundation/tenant/ has PostgreSQL 16 tenant lab, RLS, composite foreign keys, immutable active policies, regulator mapping constraint, concrete OpenAPI 3.1. GitHub Actions run 41857001213 PASS: 8 Python contract tests plus PostgreSQL SQL security assertions.
- **STILL OPEN:** trusted gateway/JWT and DB principal binding, production-grade per-institution keys, fully typed 25-domain endpoints, 25 domain-specific hardened SQL models, implemented ledger posting and accounting invariants, release tests and 15 DoR.
- **DOCUMENTARY:** historical original archives and acceptance provenance are distinct from vendor permission to develop code.
- **BLOCKED ONLY IN DEPENDENT CONTEXT:** affected 312/322 external mapping, actual live scheme activation without appropriate operator credentials, and promotion to production when DoR fails.
- **NEXT:** FOUNDATION-TENANT-CONTRACTS-001 implement and test authorized tenant identity binding.
