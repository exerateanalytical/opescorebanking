# OPS-002 — Source control, branch protection and secure SDLC

**OPES Core Banking | Batch 82/90 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Objective and boundary
Define guarded source changes, reviewer separation and reproducible releases from approved commits.

## Candidate record and policy fields
| Field | Type | Meaning |
|---|---|---|
| `repository_id` | `string` | canonical source project |
| `protected_branch` | `string` | controlled branch |
| `change_id` | `uuid` | tracked request |
| `author_id` | `string` | code author |
| `reviewer_ids` | `list` | independent peers |
| `commit_sha` | `string` | exact revision |
| `test_report_ref` | `uuid|null` | executed CI evidence |
| `security_scan_ref` | `uuid|null` | real scan output |
| `release_candidate_id` | `string` | immutable build |
| `approval_status` | `enum` | pending/accepted/rejected |

## Operations workflow
1. Link engineering issue to approved scope and requirements.
2. Develop in isolated branch with controlled dependency versions.
3. Run code tests, static checking and secret scans.
4. Require independent review and protected-branch gates.
5. Create signed/provenance-attested release artifact where supported.
6. Promote only with accountable release authorization.

## Requirements and security controls
1. **OPS-002-REQ-01** A generated design ZIP is not a tested software release.
2. **OPS-002-REQ-02** No direct unreviewed production patch under routine permissions.
3. **OPS-002-REQ-03** Secrets, private credentials and customer data cannot enter Git history.
4. **OPS-002-REQ-04** Financial changes require extra CFO/test gate where applicable.
5. **OPS-002-REQ-05** All release artifacts identify exact source commit and build environment.
6. **OPS-002-REQ-06** Failed CI checks must block merge rather than be suppressed.

## Acceptance tests — NOT EXECUTED
- [ ] **OPS-002-T01** Unreviewed PR cannot merge.
- [ ] **OPS-002-T02** Secret pattern detected and rejected.
- [ ] **OPS-002-T03** Failed tests block protected ref.
- [ ] **OPS-002-T04** Release digest links to source commit.
- [ ] **OPS-002-T05** Unapproved user cannot bypass reviewer requirement.

## Acceptance and independent review gate
Organization repository policy, actual CI runtime, independent maintainers and executed check evidence.

Status: design specification, not deployed infrastructure or banking software. Production code: 0. Executed tests: 0. Independent approvals: NONE. Existing 312/322 PCEC contradiction and payment institution entitlement remain P0 and separate from this independent operations design.
