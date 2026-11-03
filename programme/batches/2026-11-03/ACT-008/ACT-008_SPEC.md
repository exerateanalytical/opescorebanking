# ACT-008 — Account mandates, ownership and signing controls

**OPES Core Banking | Batch 68/90 | Date 2026-11-03 | DRAFT DELIVERED — REVIEW OPEN**

## Objective and boundary
Model legal account ownership, joint ownership and authorized signatory rules with effective-dated authority.

## Candidate record and API fields
| Field | Type | Meaning |
|---|---|---|
| `mandate_id` | `uuid` | authority agreement |
| `account_id` | `uuid` | affected account |
| `institution_id` | `uuid` | legal scope |
| `party_id` | `uuid` | owner/signatory |
| `role` | `enum` | owner/joint_owner/guardian/authorized_signatory |
| `action_scope` | `list` | allowed operations |
| `approval_rule` | `string` | one/two/multiple signers |
| `effective_from` | `datetime` | validity |
| `expires_at` | `datetime|null` | expiry |
| `evidence_ref` | `uuid` | document authority |

## Lifecycle workflow
1. Determine account ownership structure at onboarding.
2. Collect source-backed signatory identity and mandate scope.
3. Check guardianship or company representation as relevant.
4. Approve and version authorized signing arrangement.
5. Evaluate each financial command against current mandate and thresholds.
6. Revoke/change mandate with immutable audit and notifications.

## Requirements, financial and authorization invariants
1. **ACT-008-REQ-01** Beneficial owner and authorized signer are not interchangeable roles.
2. **ACT-008-REQ-02** Expired/revoked mandate cannot authorize subsequent instructions.
3. **ACT-008-REQ-03** Signing rules must be checked server-side per action.
4. **ACT-008-REQ-04** Joint approvals must reference distinct authorized subjects.
5. **ACT-008-REQ-05** Mandate changes cannot retroactively authorize past transactions.
6. **ACT-008-REQ-06** Cross-account signing right does not imply cross-institution permission.

## Acceptance tests — NOT EXECUTED
- [ ] **ACT-008-T01** Revoked signer cannot initiate transfer.
- [ ] **ACT-008-T02** Two-signature command requires distinct approvals.
- [ ] **ACT-008-T03** Beneficial owner without mandate denied.
- [ ] **ACT-008-T04** Old mandate still reconstructs historical approval.
- [ ] **ACT-008-T05** Unauthorized account object reference rejected.

## Acceptance and independent review gate
Local legal and institutional mandate policy, customer signed agreements and identity authorization tests.

Status: This is a candidate design document, not operational bank software. No production code, executed tests, independent signoff or regulatory certification is asserted. The PCEC 312/322 mapping conflict and unverified external payment/settlement participation remain P0 and prohibit dependent activation.
