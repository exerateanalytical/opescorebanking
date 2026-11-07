-- Production-target typed review records, 25 owner-approved domain groups.
-- REVIEW_ONLY: no money movement, account activation, official filing or external effects.
-- DB grants and service membership are externally provisioned, not auto-seeded.
CREATE TABLE opes_core.review_definition (
 domain_id text PRIMARY KEY, create_action text NOT NULL,submit_action text NOT NULL,
 review_action text NOT NULL, field_names text[] NOT NULL, submit_field text NOT NULL,
 review_field text NOT NULL, release_state text NOT NULL DEFAULT 'REVIEW_ONLY'
 CHECK(release_state='REVIEW_ONLY')
);
INSERT INTO opes_core.review_definition(domain_id,create_action,submit_action,
 review_action,field_names,submit_field,review_field) VALUES
('GOV','draft-policy','submit-policy-review','review-policy',ARRAY['policyCode','policyRevision','effectiveFrom','ownerActorId','institutionClass','legalEvidenceId']::text[],'policyValidationEvidenceId','policyDecisionEvidenceId'),
('ARC','register-contract','submit-compatibility-review','review-contract',ARRAY['boundedContext','contractVersion','ownerDomain','compatibilityMode','schemaDigest','architectureDecisionId']::text[],'compatibilityEvidenceId','contractApprovalEvidenceId'),
('CIF','register-party','submit-kyc-review','review-kyc',ARRAY['partyType','residenceCountry','identityEvidenceId','consentEvidenceId','riskTier','duplicateCheckEvidenceId']::text[],'kycEvidenceBundleId','kycDecisionEvidenceId'),
('PRD','draft-product','submit-product-validation','review-product',ARRAY['productCode','productType','currency','minOpeningMinor','effectiveFrom','pricingPolicyId','interestRateBasisPoints']::text[],'productTermsEvidenceId','productApprovalEvidenceId'),
('ACT','draft-account-request','submit-account-checks','review-account-request',ARRAY['partyId','productRevisionId','currency','kycApprovalEvidenceId','accountPurpose','mandateEvidenceId']::text[],'accountEligibilityEvidenceId','accountDecisionEvidenceId'),
('LED','draft-journal','submit-journal-validation','review-journal-proposal',ARRAY['journalReference','businessDate','postingRuleRevisionId','accountingPeriodId','journalLines','sourceEventId']::text[],'doubleEntryValidationEvidenceId','journalReviewEvidenceId'),
('BRN','draft-drawer-session','submit-custody-review','review-cash-drawer',ARRAY['branchId','drawerId','cashierActorId','currency','openingFloatMinor','custodyEvidenceId','cashCountEvidenceId']::text[],'denominationCountEvidenceId','dualCustodyReviewEvidenceId'),
('PAY','draft-payment-instruction','submit-payment-controls','review-payment-instruction',ARRAY['debtorAccountId','creditorReference','amountMinor','currency','railCandidate','beneficiaryVerificationId','purposeCode']::text[],'sanctionsCheckEvidenceId','paymentReviewEvidenceId'),
('CRD','draft-credit-proposal','submit-underwriting','review-credit-proposal',ARRAY['borrowerPartyId','principalMinor','currency','tenorMonths','productRevisionId','affordabilityEvidenceId','collateralEvaluationId']::text[],'creditRiskAssessmentId','creditCommitteeDecisionId'),
('TRE','draft-liquidity-position','submit-liquidity-review','review-liquidity-position',ARRAY['positionReference','asOfDate','currency','availableLiquidityMinor','limitPolicyId','independentPositionProofId']::text[],'limitCheckEvidenceId','treasuryApprovalEvidenceId'),
('AML','draft-screening-case','submit-analyst-review','review-screening-case',ARRAY['subjectPartyId','screeningListVersion','matchScoreBasisPoints','caseType','screeningEvidenceId','riskReasonCode']::text[],'analystEvidenceId','complianceDecisionEvidenceId'),
('REP','draft-report-request','submit-report-reconciliation','review-report-request',ARRAY['reportDefinitionId','period','sourceRevisionId','calculationVersion','mappingVersion','dataLineageEvidenceId']::text[],'reconciliationEvidenceId','reportApprovalEvidenceId'),
('CHN','draft-channel-enrollment','submit-device-verification','review-channel-enrollment',ARRAY['customerPartyId','deviceBindingId','channelType','mfaPolicyId','consentEvidenceId','deviceRiskEvidenceId']::text[],'deviceAttestationId','channelAuthorizationEvidenceId'),
('CARD','draft-card-request','submit-card-controls','review-card-request',ARRAY['linkedAccountId','cardProductRevisionId','tokenRequestId','cardNetwork','holderVerificationEvidenceId','processorAgreementRef']::text[],'cardRiskReviewEvidenceId','cardApprovalEvidenceId'),
('CRM','draft-service-case','submit-service-review','review-service-case',ARRAY['partyId','serviceCategory','caseDescription','consentEvidenceId','priority','channelReferenceId']::text[],'customerContactEvidenceId','serviceResolutionEvidenceId'),
('FEE','draft-fee-schedule','submit-fee-validation','review-fee-schedule',ARRAY['productRevisionId','feeCode','feeAmountMinor','currency','effectiveFrom','taxPolicyId','waiverPolicyId']::text[],'feeSimulationEvidenceId','feeApprovalEvidenceId'),
('REC','draft-reconciliation','submit-break-analysis','review-reconciliation',ARRAY['statementId','sourceRevisionId','ledgerRevisionId','currency','expectedMinor','observedMinor','breakEvidenceId']::text[],'independentMatchEvidenceId','reconciliationDecisionEvidenceId'),
('SEC','draft-membership-change','submit-access-review','review-access-change',ARRAY['subjectId','requestedBankRole','branchScopeIds','expiryDate','requestReason','segregationPolicyId']::text[],'accessRiskAssessmentId','securityApprovalEvidenceId'),
('DAT','draft-retention-policy','submit-privacy-review','review-retention-policy',ARRAY['classification','retentionUntil','legalBasisRef','legalHold','disposalPolicyRef','dataOwnerActorId']::text[],'legalBasisEvidenceId','privacyApprovalEvidenceId'),
('API','draft-api-client','submit-client-security-review','review-api-client',ARRAY['clientApplicationId','requestedScopes','redirectUri','ownerPartyId','credentialPolicyId','dataProcessingAgreementId']::text[],'apiSecurityAssessmentId','clientApprovalEvidenceId'),
('INF','draft-service-health-case','submit-infrastructure-review','review-infrastructure-case',ARRAY['serviceId','environment','healthStatus','observedAt','telemetryEvidenceId','runbookVersion']::text[],'operationsAssessmentId','infrastructureDecisionEvidenceId'),
('DR','draft-recovery-exercise','submit-restore-evidence','review-recovery-exercise',ARRAY['recoveryPlanId','targetRpoMinutes','targetRtoMinutes','restoreChecksum','exerciseDate','testEnvironmentId','restoreEvidenceId']::text[],'recoveryTimingEvidenceId','drIndependentReviewEvidenceId'),
('ADM','draft-privileged-request','submit-privileged-review','review-privileged-request',ARRAY['requesterActorId','privilegedAction','resourceReference','justification','segregationPolicyId','securityIncidentEvidenceId']::text[],'privilegeRiskEvidenceId','privilegedApprovalEvidenceId'),
('TST','draft-test-run','submit-test-evidence','review-test-run',ARRAY['testSuiteId','buildCommitDigest','testType','expectedAssertionCount','environmentId','testPlanRevision']::text[],'testExecutionEvidenceId','independentTestReviewEvidenceId'),
('REL','draft-release-candidate','submit-release-gates','review-release-candidate',ARRAY['releaseId','artifactDigest','deploymentDate','rollbackPlanId','testEvidenceId','changeTicketId','targetEnvironment']::text[],'deploymentReadinessEvidenceId','releaseDecisionEvidenceId');

CREATE TABLE opes_core.review_grant (
 bank_id uuid NOT NULL, issuer text NOT NULL,subject_id text NOT NULL,
 domain_id text NOT NULL REFERENCES opes_core.review_definition(domain_id),
 operation text NOT NULL CHECK(operation IN('CREATE','SUBMIT','REVIEW','READ')),
 active boolean NOT NULL DEFAULT false, expires_at timestamptz NOT NULL,
 PRIMARY KEY(bank_id,issuer,subject_id,domain_id,operation),
 FOREIGN KEY(bank_id,issuer,subject_id) REFERENCES opes_core.actor_membership(bank_id,issuer,subject_id)
);
CREATE TABLE opes_core.review_case (
 bank_id uuid NOT NULL REFERENCES opes_core.institution(bank_id),
 domain_id text NOT NULL REFERENCES opes_core.review_definition(domain_id),
 aggregate_id uuid NOT NULL,
 version bigint NOT NULL CHECK(version BETWEEN 1 AND 2147483647),
 state text NOT NULL CHECK(state IN('DRAFT','PENDING_REVIEW','REVIEWED_NOT_EFFECTIVE','REJECTED')),
 maker_issuer text NOT NULL,maker_subject text NOT NULL,
 checker_issuer text,checker_subject text,submit_evidence uuid,review_evidence uuid,
 created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 PRIMARY KEY(bank_id,domain_id,aggregate_id),
 CHECK((checker_issuer IS NULL)=(checker_subject IS NULL)),
 CHECK(state NOT IN('REVIEWED_NOT_EFFECTIVE','REJECTED') OR checker_subject IS NOT NULL),
 FOREIGN KEY(bank_id,maker_issuer,maker_subject)
 REFERENCES opes_core.actor_membership(bank_id,issuer,subject_id)
);
CREATE TABLE opes_core.review_command (
 bank_id uuid NOT NULL,domain_id text NOT NULL,aggregate_id uuid NOT NULL,
 idempotency_key text NOT NULL,request_digest text NOT NULL
 CHECK(request_digest ~ '^[0-9a-f]{64}$'),
 actor_issuer text NOT NULL,actor_subject text NOT NULL,
 stage integer NOT NULL CHECK(stage BETWEEN 0 AND 2),
 resulting_version bigint NOT NULL,receipt jsonb NOT NULL,
 committed_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 PRIMARY KEY(bank_id,domain_id,idempotency_key),
 FOREIGN KEY(bank_id,domain_id,aggregate_id)
 REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);
CREATE TABLE opes_core.review_audit (
 bank_id uuid NOT NULL,event_id uuid NOT NULL DEFAULT gen_random_uuid(),
 domain_id text NOT NULL,aggregate_id uuid NOT NULL,version bigint NOT NULL,
 actor_issuer text NOT NULL,actor_subject text NOT NULL,event_type text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 PRIMARY KEY(bank_id,event_id),UNIQUE(bank_id,domain_id,aggregate_id,version),
 FOREIGN KEY(bank_id,domain_id,aggregate_id)
 REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);
CREATE TABLE opes_core.review_outbox (
 bank_id uuid NOT NULL,event_id uuid NOT NULL DEFAULT gen_random_uuid(),
 domain_id text NOT NULL,aggregate_id uuid NOT NULL,version bigint NOT NULL,
 event_type text NOT NULL,published boolean NOT NULL DEFAULT false CHECK(published=false),
 created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 PRIMARY KEY(bank_id,event_id),UNIQUE(bank_id,domain_id,aggregate_id,version),
 FOREIGN KEY(bank_id,domain_id,aggregate_id)
 REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);
CREATE TRIGGER immutable_review_command BEFORE UPDATE OR DELETE ON opes_core.review_command
 FOR EACH ROW EXECUTE FUNCTION opes_core.reject_immutable_change();
CREATE TRIGGER immutable_review_audit BEFORE UPDATE OR DELETE ON opes_core.review_audit
 FOR EACH ROW EXECUTE FUNCTION opes_core.reject_immutable_change();
CREATE TRIGGER immutable_review_outbox BEFORE UPDATE OR DELETE ON opes_core.review_outbox
 FOR EACH ROW EXECUTE FUNCTION opes_core.reject_immutable_change();

CREATE TABLE opes_core.review_gov (
  bank_id uuid NOT NULL,
  domain_id text NOT NULL DEFAULT 'GOV' CHECK(domain_id='GOV'),
  aggregate_id uuid NOT NULL,
  policy_code text CHECK(length(policy_code) BETWEEN 1 AND 4000) NOT NULL,
  policy_revision text CHECK(length(policy_revision) BETWEEN 1 AND 4000) NOT NULL,
  effective_from date NOT NULL,
  owner_actor_id uuid NOT NULL,
  institution_class text CHECK(institution_class IN ('BANK','MFI','FINTECH')) NOT NULL,
  legal_evidence_id uuid NOT NULL,
  PRIMARY KEY(bank_id,aggregate_id),
  FOREIGN KEY(bank_id,domain_id,aggregate_id) REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);

CREATE TABLE opes_core.review_arc (
  bank_id uuid NOT NULL,
  domain_id text NOT NULL DEFAULT 'ARC' CHECK(domain_id='ARC'),
  aggregate_id uuid NOT NULL,
  bounded_context text CHECK(length(bounded_context) BETWEEN 1 AND 4000) NOT NULL,
  contract_version text CHECK(length(contract_version) BETWEEN 1 AND 4000) NOT NULL,
  owner_domain text CHECK(owner_domain IN ('GOV','SEC','CIF','PRD','ACT','LED','BRN','PAY','CRD','TRE','AML','REP','CHN','CARD','CRM','FEE','REC','DAT','API','INF','DR','ADM','TST','REL','ARC')) NOT NULL,
  compatibility_mode text CHECK(compatibility_mode IN ('BACKWARD','FULL','NONE')) NOT NULL,
  schema_digest text CHECK(schema_digest ~ '^[a-f0-9]{64}$') NOT NULL,
  architecture_decision_id uuid NOT NULL,
  PRIMARY KEY(bank_id,aggregate_id),
  FOREIGN KEY(bank_id,domain_id,aggregate_id) REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);

CREATE TABLE opes_core.review_cif (
  bank_id uuid NOT NULL,
  domain_id text NOT NULL DEFAULT 'CIF' CHECK(domain_id='CIF'),
  aggregate_id uuid NOT NULL,
  party_type text CHECK(party_type IN ('INDIVIDUAL','LEGAL_ENTITY')) NOT NULL,
  residence_country text CHECK(residence_country ~ '^[A-Z]{2}$') NOT NULL,
  identity_evidence_id uuid NOT NULL,
  consent_evidence_id uuid NOT NULL,
  risk_tier text CHECK(risk_tier IN ('LOW','STANDARD','HIGH')) NOT NULL,
  duplicate_check_evidence_id uuid NOT NULL,
  PRIMARY KEY(bank_id,aggregate_id),
  FOREIGN KEY(bank_id,domain_id,aggregate_id) REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);

CREATE TABLE opes_core.review_prd (
  bank_id uuid NOT NULL,
  domain_id text NOT NULL DEFAULT 'PRD' CHECK(domain_id='PRD'),
  aggregate_id uuid NOT NULL,
  product_code text CHECK(length(product_code) BETWEEN 1 AND 4000) NOT NULL,
  product_type text CHECK(product_type IN ('CURRENT','SAVINGS','TERM_DEPOSIT','LOAN')) NOT NULL,
  currency text CHECK(currency ~ '^[A-Z]{3}$') NOT NULL,
  min_opening_minor numeric(16,0) CHECK(min_opening_minor BETWEEN 0 AND 9000000000000000) NOT NULL,
  effective_from date NOT NULL,
  pricing_policy_id uuid NOT NULL,
  interest_rate_basis_points integer CHECK(interest_rate_basis_points BETWEEN 0 AND 1000000) NOT NULL,
  PRIMARY KEY(bank_id,aggregate_id),
  FOREIGN KEY(bank_id,domain_id,aggregate_id) REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);

CREATE TABLE opes_core.review_act (
  bank_id uuid NOT NULL,
  domain_id text NOT NULL DEFAULT 'ACT' CHECK(domain_id='ACT'),
  aggregate_id uuid NOT NULL,
  party_id uuid NOT NULL,
  product_revision_id uuid NOT NULL,
  currency text CHECK(currency ~ '^[A-Z]{3}$') NOT NULL,
  kyc_approval_evidence_id uuid NOT NULL,
  account_purpose text CHECK(account_purpose IN ('PERSONAL','BUSINESS','TREASURY_INTERNAL')) NOT NULL,
  mandate_evidence_id uuid NOT NULL,
  PRIMARY KEY(bank_id,aggregate_id),
  FOREIGN KEY(bank_id,domain_id,aggregate_id) REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);

CREATE TABLE opes_core.review_led (
  bank_id uuid NOT NULL,
  domain_id text NOT NULL DEFAULT 'LED' CHECK(domain_id='LED'),
  aggregate_id uuid NOT NULL,
  journal_reference text CHECK(length(journal_reference) BETWEEN 1 AND 4000) NOT NULL,
  business_date date NOT NULL,
  posting_rule_revision_id uuid NOT NULL,
  accounting_period_id uuid NOT NULL,
  journal_lines jsonb CHECK(jsonb_typeof(journal_lines)='array' AND jsonb_array_length(journal_lines) BETWEEN 2 AND 200) NOT NULL,
  source_event_id uuid NOT NULL,
  PRIMARY KEY(bank_id,aggregate_id),
  FOREIGN KEY(bank_id,domain_id,aggregate_id) REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);

CREATE TABLE opes_core.review_brn (
  bank_id uuid NOT NULL,
  domain_id text NOT NULL DEFAULT 'BRN' CHECK(domain_id='BRN'),
  aggregate_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  drawer_id uuid NOT NULL,
  cashier_actor_id uuid NOT NULL,
  currency text CHECK(currency ~ '^[A-Z]{3}$') NOT NULL,
  opening_float_minor numeric(16,0) CHECK(opening_float_minor BETWEEN 0 AND 9000000000000000) NOT NULL,
  custody_evidence_id uuid NOT NULL,
  cash_count_evidence_id uuid NOT NULL,
  PRIMARY KEY(bank_id,aggregate_id),
  FOREIGN KEY(bank_id,domain_id,aggregate_id) REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);

CREATE TABLE opes_core.review_pay (
  bank_id uuid NOT NULL,
  domain_id text NOT NULL DEFAULT 'PAY' CHECK(domain_id='PAY'),
  aggregate_id uuid NOT NULL,
  debtor_account_id uuid NOT NULL,
  creditor_reference text CHECK(length(creditor_reference) BETWEEN 1 AND 4000) NOT NULL,
  amount_minor numeric(16,0) CHECK(amount_minor BETWEEN 0 AND 9000000000000000) NOT NULL,
  currency text CHECK(currency ~ '^[A-Z]{3}$') NOT NULL,
  rail_candidate text CHECK(rail_candidate IN ('INTERNAL','SIMULATED_GIMAC','SIMULATED_SYGMA')) NOT NULL,
  beneficiary_verification_id uuid NOT NULL,
  purpose_code text CHECK(length(purpose_code) BETWEEN 1 AND 4000) NOT NULL,
  PRIMARY KEY(bank_id,aggregate_id),
  FOREIGN KEY(bank_id,domain_id,aggregate_id) REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);

CREATE TABLE opes_core.review_crd (
  bank_id uuid NOT NULL,
  domain_id text NOT NULL DEFAULT 'CRD' CHECK(domain_id='CRD'),
  aggregate_id uuid NOT NULL,
  borrower_party_id uuid NOT NULL,
  principal_minor numeric(16,0) CHECK(principal_minor BETWEEN 0 AND 9000000000000000) NOT NULL,
  currency text CHECK(currency ~ '^[A-Z]{3}$') NOT NULL,
  tenor_months integer CHECK(tenor_months BETWEEN 0 AND 1000000) NOT NULL,
  product_revision_id uuid NOT NULL,
  affordability_evidence_id uuid NOT NULL,
  collateral_evaluation_id uuid NOT NULL,
  PRIMARY KEY(bank_id,aggregate_id),
  FOREIGN KEY(bank_id,domain_id,aggregate_id) REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);

CREATE TABLE opes_core.review_tre (
  bank_id uuid NOT NULL,
  domain_id text NOT NULL DEFAULT 'TRE' CHECK(domain_id='TRE'),
  aggregate_id uuid NOT NULL,
  position_reference text CHECK(length(position_reference) BETWEEN 1 AND 4000) NOT NULL,
  as_of_date date NOT NULL,
  currency text CHECK(currency ~ '^[A-Z]{3}$') NOT NULL,
  available_liquidity_minor numeric(16,0) CHECK(available_liquidity_minor BETWEEN 0 AND 9000000000000000) NOT NULL,
  limit_policy_id uuid NOT NULL,
  independent_position_proof_id uuid NOT NULL,
  PRIMARY KEY(bank_id,aggregate_id),
  FOREIGN KEY(bank_id,domain_id,aggregate_id) REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);

CREATE TABLE opes_core.review_aml (
  bank_id uuid NOT NULL,
  domain_id text NOT NULL DEFAULT 'AML' CHECK(domain_id='AML'),
  aggregate_id uuid NOT NULL,
  subject_party_id uuid NOT NULL,
  screening_list_version text CHECK(length(screening_list_version) BETWEEN 1 AND 4000) NOT NULL,
  match_score_basis_points integer CHECK(match_score_basis_points BETWEEN 0 AND 1000000) NOT NULL,
  case_type text CHECK(case_type IN ('SANCTIONS','PEP','TRANSACTION_MONITORING')) NOT NULL,
  screening_evidence_id uuid NOT NULL,
  risk_reason_code text CHECK(length(risk_reason_code) BETWEEN 1 AND 4000) NOT NULL,
  PRIMARY KEY(bank_id,aggregate_id),
  FOREIGN KEY(bank_id,domain_id,aggregate_id) REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);

CREATE TABLE opes_core.review_rep (
  bank_id uuid NOT NULL,
  domain_id text NOT NULL DEFAULT 'REP' CHECK(domain_id='REP'),
  aggregate_id uuid NOT NULL,
  report_definition_id uuid NOT NULL,
  period text CHECK(period ~ '^[0-9]{4}-(0[1-9]|1[0-2])$') NOT NULL,
  source_revision_id uuid NOT NULL,
  calculation_version text CHECK(length(calculation_version) BETWEEN 1 AND 4000) NOT NULL,
  mapping_version text CHECK(length(mapping_version) BETWEEN 1 AND 4000) NOT NULL,
  data_lineage_evidence_id uuid NOT NULL,
  PRIMARY KEY(bank_id,aggregate_id),
  FOREIGN KEY(bank_id,domain_id,aggregate_id) REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);

CREATE TABLE opes_core.review_chn (
  bank_id uuid NOT NULL,
  domain_id text NOT NULL DEFAULT 'CHN' CHECK(domain_id='CHN'),
  aggregate_id uuid NOT NULL,
  customer_party_id uuid NOT NULL,
  device_binding_id uuid NOT NULL,
  channel_type text CHECK(channel_type IN ('MOBILE','WEB','CORPORATE','AGENCY')) NOT NULL,
  mfa_policy_id uuid NOT NULL,
  consent_evidence_id uuid NOT NULL,
  device_risk_evidence_id uuid NOT NULL,
  PRIMARY KEY(bank_id,aggregate_id),
  FOREIGN KEY(bank_id,domain_id,aggregate_id) REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);

CREATE TABLE opes_core.review_card (
  bank_id uuid NOT NULL,
  domain_id text NOT NULL DEFAULT 'CARD' CHECK(domain_id='CARD'),
  aggregate_id uuid NOT NULL,
  linked_account_id uuid NOT NULL,
  card_product_revision_id uuid NOT NULL,
  token_request_id uuid NOT NULL,
  card_network text CHECK(card_network IN ('VISA','MASTERCARD','GIMAC_CANDIDATE')) NOT NULL,
  holder_verification_evidence_id uuid NOT NULL,
  processor_agreement_ref uuid NOT NULL,
  PRIMARY KEY(bank_id,aggregate_id),
  FOREIGN KEY(bank_id,domain_id,aggregate_id) REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);

CREATE TABLE opes_core.review_crm (
  bank_id uuid NOT NULL,
  domain_id text NOT NULL DEFAULT 'CRM' CHECK(domain_id='CRM'),
  aggregate_id uuid NOT NULL,
  party_id uuid NOT NULL,
  service_category text CHECK(service_category IN ('COMPLAINT','INQUIRY','DISPUTE','REQUEST')) NOT NULL,
  case_description text CHECK(length(case_description) BETWEEN 1 AND 4000) NOT NULL,
  consent_evidence_id uuid NOT NULL,
  priority text CHECK(priority IN ('LOW','NORMAL','HIGH','URGENT')) NOT NULL,
  channel_reference_id uuid NOT NULL,
  PRIMARY KEY(bank_id,aggregate_id),
  FOREIGN KEY(bank_id,domain_id,aggregate_id) REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);

CREATE TABLE opes_core.review_fee (
  bank_id uuid NOT NULL,
  domain_id text NOT NULL DEFAULT 'FEE' CHECK(domain_id='FEE'),
  aggregate_id uuid NOT NULL,
  product_revision_id uuid NOT NULL,
  fee_code text CHECK(length(fee_code) BETWEEN 1 AND 4000) NOT NULL,
  fee_amount_minor numeric(16,0) CHECK(fee_amount_minor BETWEEN 0 AND 9000000000000000) NOT NULL,
  currency text CHECK(currency ~ '^[A-Z]{3}$') NOT NULL,
  effective_from date NOT NULL,
  tax_policy_id uuid NOT NULL,
  waiver_policy_id uuid NOT NULL,
  PRIMARY KEY(bank_id,aggregate_id),
  FOREIGN KEY(bank_id,domain_id,aggregate_id) REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);

CREATE TABLE opes_core.review_rec (
  bank_id uuid NOT NULL,
  domain_id text NOT NULL DEFAULT 'REC' CHECK(domain_id='REC'),
  aggregate_id uuid NOT NULL,
  statement_id uuid NOT NULL,
  source_revision_id uuid NOT NULL,
  ledger_revision_id uuid NOT NULL,
  currency text CHECK(currency ~ '^[A-Z]{3}$') NOT NULL,
  expected_minor numeric(16,0) CHECK(expected_minor BETWEEN 0 AND 9000000000000000) NOT NULL,
  observed_minor numeric(16,0) CHECK(observed_minor BETWEEN 0 AND 9000000000000000) NOT NULL,
  break_evidence_id uuid NOT NULL,
  PRIMARY KEY(bank_id,aggregate_id),
  FOREIGN KEY(bank_id,domain_id,aggregate_id) REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);

CREATE TABLE opes_core.review_sec (
  bank_id uuid NOT NULL,
  domain_id text NOT NULL DEFAULT 'SEC' CHECK(domain_id='SEC'),
  aggregate_id uuid NOT NULL,
  subject_id uuid NOT NULL,
  requested_bank_role text CHECK(requested_bank_role IN ('bank_teller','bank_credit_officer','bank_auditor','bank_admin')) NOT NULL,
  branch_scope_ids uuid[] CHECK(cardinality(branch_scope_ids) BETWEEN 1 AND 50) NOT NULL,
  expiry_date date NOT NULL,
  request_reason text CHECK(length(request_reason) BETWEEN 1 AND 4000) NOT NULL,
  segregation_policy_id uuid NOT NULL,
  PRIMARY KEY(bank_id,aggregate_id),
  FOREIGN KEY(bank_id,domain_id,aggregate_id) REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);

CREATE TABLE opes_core.review_dat (
  bank_id uuid NOT NULL,
  domain_id text NOT NULL DEFAULT 'DAT' CHECK(domain_id='DAT'),
  aggregate_id uuid NOT NULL,
  classification text CHECK(classification IN ('BANK_CONFIDENTIAL','PERSONAL','SPECIAL_CATEGORY','OPERATIONAL')) NOT NULL,
  retention_until date NOT NULL,
  legal_basis_ref text CHECK(length(legal_basis_ref) BETWEEN 1 AND 4000) NOT NULL,
  legal_hold boolean NOT NULL,
  disposal_policy_ref uuid NOT NULL,
  data_owner_actor_id uuid NOT NULL,
  PRIMARY KEY(bank_id,aggregate_id),
  FOREIGN KEY(bank_id,domain_id,aggregate_id) REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);

CREATE TABLE opes_core.review_api (
  bank_id uuid NOT NULL,
  domain_id text NOT NULL DEFAULT 'API' CHECK(domain_id='API'),
  aggregate_id uuid NOT NULL,
  client_application_id uuid NOT NULL,
  requested_scopes text[] CHECK(cardinality(requested_scopes) BETWEEN 1 AND 30) NOT NULL,
  redirect_uri text CHECK(redirect_uri ~ '^https://[^[:space:]]+$') NOT NULL,
  owner_party_id uuid NOT NULL,
  credential_policy_id uuid NOT NULL,
  data_processing_agreement_id uuid NOT NULL,
  PRIMARY KEY(bank_id,aggregate_id),
  FOREIGN KEY(bank_id,domain_id,aggregate_id) REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);

CREATE TABLE opes_core.review_inf (
  bank_id uuid NOT NULL,
  domain_id text NOT NULL DEFAULT 'INF' CHECK(domain_id='INF'),
  aggregate_id uuid NOT NULL,
  service_id uuid NOT NULL,
  environment text CHECK(environment IN ('LAB','STAGING','PRODUCTION')) NOT NULL,
  health_status text CHECK(health_status IN ('HEALTHY','DEGRADED','DOWN')) NOT NULL,
  observed_at timestamptz NOT NULL,
  telemetry_evidence_id uuid NOT NULL,
  runbook_version text CHECK(length(runbook_version) BETWEEN 1 AND 4000) NOT NULL,
  PRIMARY KEY(bank_id,aggregate_id),
  FOREIGN KEY(bank_id,domain_id,aggregate_id) REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);

CREATE TABLE opes_core.review_dr (
  bank_id uuid NOT NULL,
  domain_id text NOT NULL DEFAULT 'DR' CHECK(domain_id='DR'),
  aggregate_id uuid NOT NULL,
  recovery_plan_id uuid NOT NULL,
  target_rpo_minutes integer CHECK(target_rpo_minutes BETWEEN 0 AND 1000000) NOT NULL,
  target_rto_minutes integer CHECK(target_rto_minutes BETWEEN 0 AND 1000000) NOT NULL,
  restore_checksum text CHECK(restore_checksum ~ '^[a-f0-9]{64}$') NOT NULL,
  exercise_date date NOT NULL,
  test_environment_id uuid NOT NULL,
  restore_evidence_id uuid NOT NULL,
  PRIMARY KEY(bank_id,aggregate_id),
  FOREIGN KEY(bank_id,domain_id,aggregate_id) REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);

CREATE TABLE opes_core.review_adm (
  bank_id uuid NOT NULL,
  domain_id text NOT NULL DEFAULT 'ADM' CHECK(domain_id='ADM'),
  aggregate_id uuid NOT NULL,
  requester_actor_id uuid NOT NULL,
  privileged_action text CHECK(privileged_action IN ('ROLE_CHANGE','POLICY_CHANGE','EMERGENCY_ACCESS','CONFIG_CHANGE')) NOT NULL,
  resource_reference text CHECK(length(resource_reference) BETWEEN 1 AND 4000) NOT NULL,
  justification text CHECK(length(justification) BETWEEN 1 AND 4000) NOT NULL,
  segregation_policy_id uuid NOT NULL,
  security_incident_evidence_id uuid NOT NULL,
  PRIMARY KEY(bank_id,aggregate_id),
  FOREIGN KEY(bank_id,domain_id,aggregate_id) REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);

CREATE TABLE opes_core.review_tst (
  bank_id uuid NOT NULL,
  domain_id text NOT NULL DEFAULT 'TST' CHECK(domain_id='TST'),
  aggregate_id uuid NOT NULL,
  test_suite_id uuid NOT NULL,
  build_commit_digest text CHECK(build_commit_digest ~ '^[a-f0-9]{64}$') NOT NULL,
  test_type text CHECK(test_type IN ('UNIT','INTEGRATION','SECURITY','RECOVERY','ACCESSIBILITY')) NOT NULL,
  expected_assertion_count integer CHECK(expected_assertion_count BETWEEN 0 AND 1000000) NOT NULL,
  environment_id uuid NOT NULL,
  test_plan_revision text CHECK(length(test_plan_revision) BETWEEN 1 AND 4000) NOT NULL,
  PRIMARY KEY(bank_id,aggregate_id),
  FOREIGN KEY(bank_id,domain_id,aggregate_id) REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);

CREATE TABLE opes_core.review_rel (
  bank_id uuid NOT NULL,
  domain_id text NOT NULL DEFAULT 'REL' CHECK(domain_id='REL'),
  aggregate_id uuid NOT NULL,
  release_id uuid NOT NULL,
  artifact_digest text CHECK(artifact_digest ~ '^[a-f0-9]{64}$') NOT NULL,
  deployment_date date NOT NULL,
  rollback_plan_id uuid NOT NULL,
  test_evidence_id uuid NOT NULL,
  change_ticket_id uuid NOT NULL,
  target_environment text CHECK(target_environment IN ('LAB','STAGING','PRODUCTION')) NOT NULL,
  PRIMARY KEY(bank_id,aggregate_id),
  FOREIGN KEY(bank_id,domain_id,aggregate_id) REFERENCES opes_core.review_case(bank_id,domain_id,aggregate_id)
);
DO $block$
DECLARE target text;
BEGIN
 FOREACH target IN ARRAY ARRAY['review_grant','review_case','review_command','review_audit','review_outbox','review_gov','review_arc','review_cif','review_prd','review_act','review_led','review_brn','review_pay','review_crd','review_tre','review_aml','review_rep','review_chn','review_card','review_crm','review_fee','review_rec','review_sec','review_dat','review_api','review_inf','review_dr','review_adm','review_tst','review_rel'] LOOP
  EXECUTE format('ALTER TABLE opes_core.%I ENABLE ROW LEVEL SECURITY',target);
  EXECUTE format('ALTER TABLE opes_core.%I FORCE ROW LEVEL SECURITY',target);
  EXECUTE format('CREATE POLICY %I ON opes_core.%I USING(bank_id=opes_core.current_bank_id()) WITH CHECK(bank_id=opes_core.current_bank_id())','scope_'||target,target);
 END LOOP;
END $block$;

CREATE FUNCTION opes_core.apply_review(
 p_domain text,p_stage integer,p_aggregate uuid,p_expected bigint,
 p_key text,p_fields jsonb,p_evidence uuid,p_decision text,
 p_issuer text,p_subject text,p_correlation uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $$
DECLARE b uuid;spec record;prior record;old record;
 op text;table_name text;field_name text;db_field text;
 data jsonb;receipt jsonb;digest text;new_state text;new_version bigint;
BEGIN
 b=opes_core.current_bank_id();
 IF b IS NULL THEN RAISE EXCEPTION 'UNBOUND_BANK_PRINCIPAL' USING ERRCODE='42501';END IF;
 IF p_domain IS NULL OR p_stage NOT IN(0,1,2) OR
  p_aggregate IS NULL OR p_expected IS NULL OR p_expected<0 OR p_expected>2147483647 OR
  p_key IS NULL OR p_key !~ '^[A-Za-z0-9._:-]{16,128}$' OR p_correlation IS NULL OR
  p_issuer IS NULL OR p_issuer !~ '^https://' OR p_subject IS NULL OR length(p_subject)<3
 THEN RAISE EXCEPTION 'INVALID_REVIEW_REQUEST' USING ERRCODE='22023';END IF;
 SELECT * INTO spec FROM opes_core.review_definition WHERE domain_id=p_domain;
 IF NOT FOUND THEN RAISE EXCEPTION 'UNKNOWN_REVIEW_DOMAIN' USING ERRCODE='22023';END IF;
 op=CASE p_stage WHEN 0 THEN 'CREATE' WHEN 1 THEN 'SUBMIT' ELSE 'REVIEW' END;
 -- Lock current membership and grant to serialize revocation against postings.
 PERFORM 1 FROM opes_core.actor_membership
 WHERE bank_id=b AND issuer=p_issuer AND subject_id=p_subject AND
  active=true AND expires_at>clock_timestamp() FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'ACTIVE_MEMBERSHIP_REQUIRED' USING ERRCODE='42501';END IF;
 PERFORM 1 FROM opes_core.review_grant
 WHERE bank_id=b AND issuer=p_issuer AND subject_id=p_subject AND
  domain_id=p_domain AND operation=op AND active=true AND expires_at>clock_timestamp()
 FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'REVIEW_PERMISSION_DENIED' USING ERRCODE='42501';END IF;
 IF p_stage=0 THEN
  IF p_expected<>0 OR p_fields IS NULL OR jsonb_typeof(p_fields)<>'object'
     OR (SELECT count(*) FROM jsonb_object_keys(p_fields))<>cardinality(spec.field_names)
     OR p_evidence IS NOT NULL OR p_decision IS NOT NULL THEN
    RAISE EXCEPTION 'INVALID_DRAFT_SHAPE' USING ERRCODE='22023';END IF;
  FOR field_name IN SELECT jsonb_object_keys(p_fields) LOOP
   IF NOT field_name=ANY(spec.field_names) OR p_fields->field_name='null'::jsonb
    THEN RAISE EXCEPTION 'INVALID_DRAFT_FIELD' USING ERRCODE='22023';END IF;
  END LOOP;
 ELSE
  IF p_fields IS NOT NULL OR p_evidence IS NULL OR p_expected<1 OR
   (p_stage=1 AND p_decision IS NOT NULL) OR
   (p_stage=2 AND (p_expected<2 OR p_decision NOT IN('ACCEPT','REJECT'))) THEN
     RAISE EXCEPTION 'INVALID_REVIEW_TRANSITION' USING ERRCODE='22023';END IF;
 END IF;
 digest=encode(sha256(convert_to(jsonb_build_object(
   'domain',p_domain,'stage',p_stage,'aggregate',p_aggregate::text,
   'expected',p_expected,'fields',p_fields,'evidence',p_evidence,
   'decision',p_decision)::text,'UTF8')),'hex');
 PERFORM pg_advisory_xact_lock(hashtextextended(b::text||':'||p_domain||':'||p_key,0));
 SELECT * INTO prior FROM opes_core.review_command
 WHERE bank_id=b AND domain_id=p_domain AND idempotency_key=p_key;
 IF FOUND THEN
  IF prior.request_digest=digest AND prior.actor_issuer=p_issuer AND
    prior.actor_subject=p_subject AND prior.aggregate_id=p_aggregate AND
    prior.stage=p_stage THEN RETURN prior.receipt;END IF;
  RAISE EXCEPTION 'REVIEW_IDEMPOTENCY_CONFLICT' USING ERRCODE='23505';
 END IF;
 SELECT * INTO old FROM opes_core.review_case
 WHERE bank_id=b AND domain_id=p_domain AND aggregate_id=p_aggregate FOR UPDATE;
 IF p_stage=0 THEN
  IF FOUND THEN RAISE EXCEPTION 'REVIEW_ALREADY_EXISTS' USING ERRCODE='23505';END IF;
  new_version=1;new_state='DRAFT';
  INSERT INTO opes_core.review_case(
   bank_id,domain_id,aggregate_id,version,state,maker_issuer,maker_subject)
  VALUES(b,p_domain,p_aggregate,new_version,new_state,p_issuer,p_subject);
  table_name='review_'||lower(p_domain);
  data=jsonb_build_object('bank_id',b::text,'domain_id',p_domain,'aggregate_id',p_aggregate::text);
  FOREACH field_name IN ARRAY spec.field_names LOOP
   db_field=lower(regexp_replace(field_name,'([A-Z])','_\1','g'));
   data=data||jsonb_build_object(db_field,p_fields->field_name);
  END LOOP;
  EXECUTE format(
   'INSERT INTO opes_core.%I SELECT (jsonb_populate_record(NULL::opes_core.%I,$1)).*',
   table_name,table_name) USING data;
 ELSE
  IF NOT FOUND OR old.version<>p_expected THEN
   RAISE EXCEPTION 'STALE_REVIEW_VERSION' USING ERRCODE='23505';END IF;
  IF p_stage=1 THEN
    IF old.state<>'DRAFT' OR old.maker_issuer<>p_issuer OR old.maker_subject<>p_subject
    THEN RAISE EXCEPTION 'MAKER_ONLY_SUBMISSION' USING ERRCODE='42501';END IF;
    new_state='PENDING_REVIEW';
  ELSE
    IF old.state<>'PENDING_REVIEW' OR
      (old.maker_issuer=p_issuer AND old.maker_subject=p_subject)
    THEN RAISE EXCEPTION 'INDEPENDENT_CHECKER_REQUIRED' USING ERRCODE='42501';END IF;
    new_state=CASE p_decision WHEN 'ACCEPT' THEN 'REVIEWED_NOT_EFFECTIVE'
             ELSE 'REJECTED' END;
  END IF;
  new_version=old.version+1;
  UPDATE opes_core.review_case SET version=new_version,state=new_state,
   submit_evidence=CASE WHEN p_stage=1 THEN p_evidence ELSE submit_evidence END,
   review_evidence=CASE WHEN p_stage=2 THEN p_evidence ELSE review_evidence END,
   checker_issuer=CASE WHEN p_stage=2 THEN p_issuer ELSE checker_issuer END,
   checker_subject=CASE WHEN p_stage=2 THEN p_subject ELSE checker_subject END,
   updated_at=clock_timestamp()
  WHERE bank_id=b AND domain_id=p_domain AND aggregate_id=p_aggregate;
 END IF;
 receipt=jsonb_build_object(
   'bankId',b::text,'domain',p_domain,'aggregateId',p_aggregate::text,
   'version',new_version,'state',new_state,'correlationId',p_correlation::text,
   'financialEffective',false,'regulatorySubmissionEnabled',false);
 INSERT INTO opes_core.review_command(
  bank_id,domain_id,aggregate_id,idempotency_key,request_digest,actor_issuer,
  actor_subject,stage,resulting_version,receipt)
 VALUES(b,p_domain,p_aggregate,p_key,digest,p_issuer,p_subject,p_stage,new_version,receipt);
 INSERT INTO opes_core.review_audit(
  bank_id,domain_id,aggregate_id,version,actor_issuer,actor_subject,event_type)
 VALUES(b,p_domain,p_aggregate,new_version,p_issuer,p_subject,
        p_domain||'_'||CASE p_stage WHEN 0 THEN 'DRAFT' WHEN 1 THEN 'SUBMIT' ELSE 'REVIEW' END);
 INSERT INTO opes_core.review_outbox(bank_id,domain_id,aggregate_id,version,event_type)
 VALUES(b,p_domain,p_aggregate,new_version,p_domain||'_REVIEW_ONLY');
 RETURN receipt;
END $$;
CREATE FUNCTION opes_core.read_review(
 p_domain text,p_aggregate uuid,p_issuer text,p_subject text,p_correlation uuid
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $$
DECLARE b uuid;rec record;
BEGIN
 b=opes_core.current_bank_id();
 IF b IS NULL OR p_domain IS NULL OR p_aggregate IS NULL OR
  p_issuer IS NULL OR p_subject IS NULL OR p_correlation IS NULL THEN
  RAISE EXCEPTION 'REVIEW_READ_DENIED' USING ERRCODE='42501';END IF;
 PERFORM 1 FROM opes_core.actor_membership
 WHERE bank_id=b AND issuer=p_issuer AND subject_id=p_subject AND
 active=true AND expires_at>clock_timestamp();
 IF NOT FOUND THEN RAISE EXCEPTION 'REVIEW_READ_DENIED' USING ERRCODE='42501';END IF;
 PERFORM 1 FROM opes_core.review_grant
 WHERE bank_id=b AND issuer=p_issuer AND subject_id=p_subject
 AND domain_id=p_domain AND operation='READ' AND active=true AND
 expires_at>clock_timestamp();
 IF NOT FOUND THEN RAISE EXCEPTION 'REVIEW_READ_DENIED' USING ERRCODE='42501';END IF;
 SELECT * INTO rec FROM opes_core.review_case
 WHERE bank_id=b AND domain_id=p_domain AND aggregate_id=p_aggregate;
 IF NOT FOUND THEN RETURN NULL;END IF;
 RETURN jsonb_build_object(
   'bankId',b::text,'domain',p_domain,'aggregateId',p_aggregate::text,
   'version',rec.version,'state',rec.state,'correlationId',p_correlation::text,
   'financialEffective',false,'regulatorySubmissionEnabled',false);
END $$;
REVOKE ALL ON FUNCTION opes_core.apply_review(
 text,integer,uuid,bigint,text,jsonb,uuid,text,text,text,uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION opes_core.read_review(text,uuid,text,text,uuid) FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA opes_core FROM PUBLIC;
