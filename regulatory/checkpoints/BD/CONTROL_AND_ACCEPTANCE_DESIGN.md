# BD — Proposed controls and unexecuted negative acceptance scenarios

All following controls are **design proposals**, not deployed banking functionality or regulator-approved implementation. They apply to a future bank/regulated-institution configuration, not indiscriminately to OPESWARE as software vendor.

## Cross-domain contracts (proposed)
**RegulatoryAuthorityRecord**: issuer, instrument_id, article_path, source_locator, verified_by, verification_method, published_at, effective_from, transitional_until, applicability_profile, supersession_edges, unresolved_interpretations, signed_approval_refs, source_hash_nullable, status. A clause cannot enter `APPROVED_FOR_EXECUTION` with missing issuer text, unresolved legal conflict or unsigned bank applicability decision.

**InstitutionDataAvailabilityAssessment**: institution_id, headquarters_state, data_class, physical_or_digital, storage_site, accessible_in_state, usable_in_state, recovery_proof, custodian, outsourced_provider, last_verified_at, assessor, legal_review_ref. This is evidence metadata, not proof that any deployment complies.

**SignificantIncidentCase**: incident_id, institution_id, first_detected_at, classified_at, policy_version, significance_factors[], decision_actor, notice_due_policy, written_notice_evidence, interim_report_evidence, synthesis_report_evidence, corrections, audit_chain. Incident workflow must not permit a financial journal entry or claim to settle funds.

**AmendmentGraphEdge**: source_instrument/article, target_instrument/article, relation (REPEALS_PART|AMENDS|REFERENCES|UNKNOWN), source_evidence, effective_window, confidence, qualified_legal_signoff. An article-level repeal must not become whole-instrument repeal.

## Proposed state transitions
- Regulatory clause: DISCOVERED → SOURCE_INSPECTED → AUTHENTICATED → LEGALLY_INTERPRETED → BANK_APPROVED → EFFECTIVE; REJECTED/REVOKED/SUSPENDED explicit; no automatic promotion.
- Incident: DETECTED → TRIAGED → CLASSIFIED → NOTIFICATION_PENDING → NOTIFIED_WITH_PROOF → INTERIM_REPORTED → FINAL_REPORTED → CLOSED; UNKNOWN/FAILED_SEND and ESCALATED preserved. Classification or notification does not alter ledger balances.
- Data availability: UNASSESSED → INVENTORIED → EVIDENCE_COLLECTED → TESTED → LEGAL_REVIEWED → ACCEPTED; FAILED and RECHECK_REQUIRED block acceptance.

## 12 negative acceptance scenarios — specified only, not executed
BD-T01: Incomplete Article 16 page-break evidence must not authorize data residency certification.
BD-T02: Foreign disaster recovery replica alone cannot satisfy documented in-country availability without accessible and usable local evidence.
BD-T03: In-country metadata without retrievable bank records must not satisfy availability control.
BD-T04: A bank's physical archives stored abroad without locally accessible and usable copies/evidence must fail proposed assessment.
BD-T05: Article 41 partial repeal must not mark R-2016/04 or R-2008/01 wholly repealed.
BD-T06: R-2024/01 Art 35 reference to R-2016/04 65(ii) must remain resolvable after 65(iii) repeal.
BD-T07: Institution class transition dates must not overwrite formal 2025-01-01 effective date.
BD-T08: Incident meeting an Art 30 significance trigger must enter notice-required flow; never silently auto-close.
BD-T09: Failed/unknown outbound notice must remain unresolved; retry cannot fabricate successful delivery.
BD-T10: Later issuer instruction changing significance triggers must require new authenticated effective-dated policy version; do not overwrite past incident assessment.
BD-T11: R-2020/01 secondary amendment lead must not be executable or change risk concentration limits.
BD-T12: Unverified sovereign repayment guarantee must not produce 0% prudential weighting or any GL entry.

## Required evidence and future verification
Document legally approved bank profile, custodian and evidence provenance; test real access/retrieval from the headquarters State; perform failover/restore with loss/recovery evidence; exercise significant incident notifications in approved non-production test environment with simulated endpoints only; verify rule version at transaction time; reconcile prudential reporting to immutable accounting and approved mappings. No simulated test may be reported as a COBAC filing.

## Security and accounting boundaries
Least privilege, maker-checker, tamper-resistant audit, cryptographic custody, per-bank tenant isolation, HSM key governance and privacy are preconditions. Incident and data-availability workflow has **no** authority to mutate balances or recognize settlement. Prudential risk calculations remain separate from custody, PCEC ledger, liquidity and settlement.
