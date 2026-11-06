-- Stage3 candidate SQL command store. Disposable PG16 opes_test only.
-- Reads bank and actor ONLY from authenticated SESSION_USER binding.
-- NO live journal postings, regulated issuance, payment settlements or releases.
\set ON_ERROR_STOP on
BEGIN;
DO $guard$ BEGIN
 IF current_database()<>'opes_test' OR session_user<>'postgres'
 OR current_setting('server_version_num')::int NOT BETWEEN 160000 AND 169999
 THEN RAISE EXCEPTION 'DISPOSABLE_PG16_ONLY'; END IF;
END $guard$;
CREATE ROLE opes_s3_bank_a_checker_lab LOGIN NOINHERIT NOSUPERUSER
 NOCREATEDB NOCREATEROLE NOREPLICATION PASSWORD 'only_disposable_stage3_bank_a_checker';
GRANT CONNECT ON DATABASE opes_test TO opes_s3_bank_a_checker_lab;
GRANT USAGE ON SCHEMA opes_stage3 TO opes_s3_bank_a_checker_lab;
ALTER TABLE opes_stage3.database_binding
 ADD COLUMN actor_id uuid,
 ADD COLUMN may_create boolean NOT NULL DEFAULT false,
 ADD COLUMN may_submit boolean NOT NULL DEFAULT false,
 ADD COLUMN may_review boolean NOT NULL DEFAULT false;
UPDATE opes_stage3.database_binding SET actor_id='11111111-1111-4111-8111-111111111111',
 may_create=true,may_submit=true WHERE login_role='opes_s3_bank_a_lab';
UPDATE opes_stage3.database_binding SET actor_id='66666666-6666-4666-8666-666666666666',
 may_create=true,may_submit=true WHERE login_role='opes_s3_bank_b_lab';
ALTER TABLE opes_stage3.database_binding ALTER COLUMN actor_id SET NOT NULL;
INSERT INTO opes_stage3.database_binding(
 login_role,bank_id,actor_id,may_create,may_submit,may_review
) VALUES('opes_s3_bank_a_checker_lab',
 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
 '22222222-2222-4222-8222-222222222222',
 false,false,true);
CREATE TABLE opes_stage3.domain_descriptor(
 domain_id text PRIMARY KEY CHECK(domain_id ~ '^[A-Z]{2,4}$'),
 allowed_fields text[] NOT NULL CHECK(cardinality(allowed_fields)>=5)
);
INSERT INTO opes_stage3.domain_descriptor(domain_id,allowed_fields) VALUES
('GOV',ARRAY['policyCode','policyRevision','effectiveFrom','ownerActorId','institutionClass','legalEvidenceId']),
('ARC',ARRAY['boundedContext','contractVersion','ownerDomain','compatibilityMode','schemaDigest','architectureDecisionId']),
('CIF',ARRAY['partyType','residenceCountry','identityEvidenceId','consentEvidenceId','riskTier','duplicateCheckEvidenceId']),
('PRD',ARRAY['productCode','productType','currency','minOpeningMinor','effectiveFrom','pricingPolicyId','interestRateBasisPoints']),
('ACT',ARRAY['partyId','productRevisionId','currency','kycApprovalEvidenceId','accountPurpose','mandateEvidenceId']),
('LED',ARRAY['journalReference','businessDate','postingRuleRevisionId','accountingPeriodId','journalLines','sourceEventId']),
('BRN',ARRAY['branchId','drawerId','cashierActorId','currency','openingFloatMinor','custodyEvidenceId','cashCountEvidenceId']),
('PAY',ARRAY['debtorAccountId','creditorReference','amountMinor','currency','railCandidate','beneficiaryVerificationId','purposeCode']),
('CRD',ARRAY['borrowerPartyId','principalMinor','currency','tenorMonths','productRevisionId','affordabilityEvidenceId','collateralEvaluationId']),
('TRE',ARRAY['positionReference','asOfDate','currency','availableLiquidityMinor','limitPolicyId','independentPositionProofId']),
('AML',ARRAY['subjectPartyId','screeningListVersion','matchScoreBasisPoints','caseType','screeningEvidenceId','riskReasonCode']),
('REP',ARRAY['reportDefinitionId','period','sourceRevisionId','calculationVersion','mappingVersion','dataLineageEvidenceId']),
('CHN',ARRAY['customerPartyId','deviceBindingId','channelType','mfaPolicyId','consentEvidenceId','deviceRiskEvidenceId']),
('CARD',ARRAY['linkedAccountId','cardProductRevisionId','tokenRequestId','cardNetwork','holderVerificationEvidenceId','processorAgreementRef']),
('CRM',ARRAY['partyId','serviceCategory','caseDescription','consentEvidenceId','priority','channelReferenceId']),
('FEE',ARRAY['productRevisionId','feeCode','feeAmountMinor','currency','effectiveFrom','taxPolicyId','waiverPolicyId']),
('REC',ARRAY['statementId','sourceRevisionId','ledgerRevisionId','currency','expectedMinor','observedMinor','breakEvidenceId']),
('SEC',ARRAY['subjectId','requestedBankRole','branchScopeIds','expiryDate','requestReason','segregationPolicyId']),
('DAT',ARRAY['classification','retentionUntil','legalBasisRef','legalHold','disposalPolicyRef','dataOwnerActorId']),
('API',ARRAY['clientApplicationId','requestedScopes','redirectUri','ownerPartyId','credentialPolicyId','dataProcessingAgreementId']),
('INF',ARRAY['serviceId','environment','healthStatus','observedAt','telemetryEvidenceId','runbookVersion']),
('DR',ARRAY['recoveryPlanId','targetRpoMinutes','targetRtoMinutes','restoreChecksum','exerciseDate','testEnvironmentId','restoreEvidenceId']),
('ADM',ARRAY['requesterActorId','privilegedAction','resourceReference','justification','segregationPolicyId','securityIncidentEvidenceId']),
('TST',ARRAY['testSuiteId','buildCommitDigest','testType','expectedAssertionCount','environmentId','testPlanRevision']),
('REL',ARRAY['releaseId','artifactDigest','deploymentDate','rollbackPlanId','testEvidenceId','changeTicketId','targetEnvironment']);
CREATE TABLE opes_stage3.candidate_registry(
 bank_id uuid NOT NULL REFERENCES opes_stage3.institution(bank_id),
 domain_id text NOT NULL REFERENCES opes_stage3.domain_descriptor(domain_id),
 aggregate_id uuid NOT NULL,
 maker_actor uuid NOT NULL,checker_actor uuid,
 version bigint NOT NULL CHECK(version BETWEEN 1 AND 2147483647),
 state text NOT NULL CHECK(state IN
  ('DRAFT','PENDING_REVIEW','REVIEWED_NOT_EFFECTIVE','REJECTED')),
 created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 PRIMARY KEY(bank_id,domain_id,aggregate_id),
 CHECK(checker_actor IS NULL OR maker_actor<>checker_actor)
);
CREATE TABLE opes_stage3.command_registry(
 bank_id uuid NOT NULL,domain_id text NOT NULL,
 aggregate_id uuid NOT NULL,idempotency_key text NOT NULL,
 command_digest text NOT NULL CHECK(command_digest ~ '^[a-f0-9]{64}$'),
 actor_id uuid NOT NULL,command_stage smallint NOT NULL CHECK(command_stage IN (0,1,2)),
 resulting_version bigint NOT NULL,
 result_receipt jsonb NOT NULL,
 received_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 PRIMARY KEY(bank_id,domain_id,idempotency_key),
 FOREIGN KEY(bank_id,domain_id,aggregate_id)
 REFERENCES opes_stage3.candidate_registry(bank_id,domain_id,aggregate_id)
);
CREATE TABLE opes_stage3.audit_event(
 event_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 bank_id uuid NOT NULL,domain_id text NOT NULL,aggregate_id uuid NOT NULL,
 actor_id uuid NOT NULL,resulting_version bigint NOT NULL,
 event_type text NOT NULL,
 occurred_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 UNIQUE(bank_id,domain_id,aggregate_id,resulting_version),
 FOREIGN KEY(bank_id,domain_id,aggregate_id)
 REFERENCES opes_stage3.candidate_registry(bank_id,domain_id,aggregate_id)
);
CREATE TABLE opes_stage3.outbox_candidate(
 event_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 bank_id uuid NOT NULL,domain_id text NOT NULL,aggregate_id uuid NOT NULL,
 resulting_version bigint NOT NULL,event_type text NOT NULL,
 externally_published boolean NOT NULL DEFAULT false
 CHECK(externally_published=false),
 created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 UNIQUE(bank_id,domain_id,aggregate_id,resulting_version),
 FOREIGN KEY(bank_id,domain_id,aggregate_id)
 REFERENCES opes_stage3.candidate_registry(bank_id,domain_id,aggregate_id)
);
CREATE FUNCTION opes_stage3.reject_immutable_update()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path=pg_catalog AS $f$
BEGIN RAISE EXCEPTION 'APPEND_ONLY_AUDIT_OUTBOX'; END $f$;
CREATE TRIGGER audit_append_only BEFORE UPDATE OR DELETE OR TRUNCATE
ON opes_stage3.audit_event
FOR EACH STATEMENT EXECUTE FUNCTION opes_stage3.reject_immutable_update();
CREATE TRIGGER outbox_append_only BEFORE UPDATE OR DELETE OR TRUNCATE
ON opes_stage3.outbox_candidate
FOR EACH STATEMENT EXECUTE FUNCTION opes_stage3.reject_immutable_update();
-- Single database-local atomic candidate state transition.
-- External financial effects are impossible from this function.
CREATE FUNCTION opes_stage3.apply_candidate(
 p_domain text,p_aggregate uuid,p_stage integer,p_expected_version bigint,
 p_key text,p_digest text,p_fields jsonb,p_evidence uuid,p_decision text,
 p_correlation uuid
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path=pg_catalog,pg_temp AS $body$
DECLARE b record;d record;previous record;candidate record;v_state text;
 v_checker uuid;v_version bigint;v_table text;v_sql text;v_payload jsonb;
 v_receipt jsonb;v_fields_count integer;v_key text;v_event text;
 v_changed integer;v_field text;
BEGIN
 SELECT * INTO b FROM opes_stage3.database_binding
 WHERE login_role=session_user AND enabled=true FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'BANK_SESSION_UNBOUND';END IF;
 SELECT * INTO d FROM opes_stage3.domain_descriptor WHERE domain_id=p_domain;
 IF NOT FOUND OR p_stage NOT IN (0,1,2) OR p_aggregate IS NULL OR
   p_correlation IS NULL OR p_expected_version IS NULL OR
   p_expected_version<0 OR p_expected_version>2147483647 OR
   p_key IS NULL OR p_key !~ '^[A-Za-z0-9._:-]{16,128}$' OR
   p_digest IS NULL OR p_digest !~ '^[a-f0-9]{64}$' THEN
  RAISE EXCEPTION 'INVALID_CANDIDATE_REQUEST';
 END IF;
 IF p_stage=0 THEN
  IF NOT b.may_create OR p_expected_version<>0 OR
     p_evidence IS NOT NULL OR p_decision IS NOT NULL OR
     p_fields IS NULL OR jsonb_typeof(p_fields)<>'object'
  THEN RAISE EXCEPTION 'CANDIDATE_CREATE_DENIED';END IF;
  SELECT count(*) INTO v_fields_count FROM jsonb_object_keys(p_fields);
  IF v_fields_count<>cardinality(d.allowed_fields) THEN
   RAISE EXCEPTION 'CANDIDATE_FIELD_SET_INCOMPLETE';END IF;
  FOR v_field IN SELECT jsonb_object_keys(p_fields) LOOP
   IF NOT v_field=ANY(d.allowed_fields) THEN
    RAISE EXCEPTION 'UNEXPECTED_DOMAIN_FIELD'; END IF;
  END LOOP;
 ELSE
  IF p_fields IS NOT NULL OR p_evidence IS NULL THEN
   RAISE EXCEPTION 'CANDIDATE_EVIDENCE_REQUIRED';END IF;
  IF p_stage=1 AND (NOT b.may_submit OR
     p_decision IS NOT NULL OR p_expected_version<1) THEN
   RAISE EXCEPTION 'MAKER_SUBMISSION_DENIED';END IF;
  IF p_stage=2 AND (NOT b.may_review OR
     p_decision NOT IN ('ACCEPT','REJECT') OR p_expected_version<2) THEN
   RAISE EXCEPTION 'CHECKER_DECISION_DENIED';END IF;
 END IF;
 -- Serialize idempotency key before optimistic locking the candidate.
 PERFORM pg_advisory_xact_lock(hashtextextended(
  b.bank_id::text||'/'||p_domain||'/'||p_key,0));
 SELECT * INTO previous FROM opes_stage3.command_registry
 WHERE bank_id=b.bank_id AND domain_id=p_domain AND idempotency_key=p_key;
 IF FOUND THEN
  IF previous.command_digest=p_digest AND previous.actor_id=b.actor_id AND
     previous.aggregate_id=p_aggregate AND previous.command_stage=p_stage THEN
   RETURN previous.result_receipt;
  END IF;
  RAISE EXCEPTION 'IDEMPOTENCY_DIGEST_OR_OWNER_CONFLICT';
 END IF;
 SELECT * INTO candidate FROM opes_stage3.candidate_registry
 WHERE bank_id=b.bank_id AND domain_id=p_domain AND aggregate_id=p_aggregate FOR UPDATE;
 v_table=lower(p_domain)||'_candidate';
 IF p_stage=0 THEN
  IF FOUND THEN RAISE EXCEPTION 'AGGREGATE_ALREADY_EXISTS';END IF;
  v_state='DRAFT';v_version=1;v_checker=NULL;
  -- Draft record first. Typed table NOT NULL + checks validate each field.
  INSERT INTO opes_stage3.candidate_registry(
   bank_id,domain_id,aggregate_id,maker_actor,version,state)
  VALUES(b.bank_id,p_domain,p_aggregate,b.actor_id,1,v_state);
  -- Domain API contracts use camelCase, but typed SQL columns use
  -- snake_case. Convert each validated domain field before populating the
  -- record; do not let JSONB silently ignore unmatched field names.
  v_payload='{}'::jsonb;
  FOR v_field IN SELECT jsonb_object_keys(p_fields) LOOP
   v_key=lower(regexp_replace(v_field,'([A-Z])','_\1','g'));
   v_payload=v_payload||jsonb_build_object(v_key,p_fields->v_field);
  END LOOP;
  v_payload=v_payload||jsonb_build_object(
   'bank_id',b.bank_id::text,'aggregate_id',p_aggregate::text,
   'maker_actor',b.actor_id::text,'version',1,'state',v_state,
   'created_at',clock_timestamp(),'updated_at',clock_timestamp());
  v_sql=format(
   'INSERT INTO opes_stage3.%I SELECT (jsonb_populate_record(NULL::opes_stage3.%I,$1)).*',
   v_table,v_table);
  EXECUTE v_sql USING v_payload;
 ELSE
  IF NOT FOUND OR candidate.version<>p_expected_version THEN
   RAISE EXCEPTION 'EXPECTED_VERSION_CONFLICT';END IF;
  IF p_stage=1 THEN
   IF candidate.state<>'DRAFT' OR candidate.maker_actor<>b.actor_id
   THEN RAISE EXCEPTION 'MAKER_CANNOT_SUBMIT';END IF;
   v_state='PENDING_REVIEW';v_checker=NULL;
  ELSE
   IF candidate.state<>'PENDING_REVIEW' OR candidate.maker_actor=b.actor_id
   THEN RAISE EXCEPTION 'SEGREGATION_OF_DUTIES';END IF;
   v_state=CASE WHEN p_decision='ACCEPT' THEN 'REVIEWED_NOT_EFFECTIVE'
    ELSE 'REJECTED' END;
   v_checker=b.actor_id;
  END IF;
  v_version=candidate.version+1;
  UPDATE opes_stage3.candidate_registry SET
   state=v_state,version=v_version,checker_actor=v_checker,updated_at=clock_timestamp()
  WHERE bank_id=b.bank_id AND domain_id=p_domain AND aggregate_id=p_aggregate;
  v_sql=format(
   'UPDATE opes_stage3.%I SET state=$1,version=$2,checker_actor=$3,'||
   'submission_evidence_id=COALESCE($4,submission_evidence_id),'||
   'review_evidence_id=COALESCE($5,review_evidence_id),'||
   'updated_at=clock_timestamp() WHERE bank_id=$6 AND aggregate_id=$7',
   v_table);
  EXECUTE v_sql USING v_state,v_version,v_checker,
   CASE WHEN p_stage=1 THEN p_evidence ELSE NULL END,
   CASE WHEN p_stage=2 THEN p_evidence ELSE NULL END,b.bank_id,p_aggregate;
  GET DIAGNOSTICS v_changed=ROW_COUNT;
  IF v_changed<>1 THEN RAISE EXCEPTION 'TYPED_DOMAIN_RECORD_MISSING';END IF;
 END IF;
 v_event=p_domain||CASE p_stage WHEN 0 THEN '_CANDIDATE_DRAFTED'
  WHEN 1 THEN '_CANDIDATE_SUBMITTED' ELSE '_CANDIDATE_REVIEWED' END;
 v_receipt=jsonb_build_object(
  'bankId',b.bank_id::text,'aggregateId',p_aggregate::text,
  'version',v_version,'state',v_state,
  'financialEffective',false,'regulatorySubmissionEnabled',false);
 INSERT INTO opes_stage3.command_registry(
  bank_id,domain_id,aggregate_id,idempotency_key,command_digest,
  actor_id,command_stage,resulting_version,result_receipt
 ) VALUES(b.bank_id,p_domain,p_aggregate,p_key,p_digest,
   b.actor_id,p_stage,v_version,v_receipt);
 INSERT INTO opes_stage3.audit_event(
  bank_id,domain_id,aggregate_id,actor_id,resulting_version,event_type
 ) VALUES(b.bank_id,p_domain,p_aggregate,b.actor_id,v_version,v_event);
 INSERT INTO opes_stage3.outbox_candidate(
  bank_id,domain_id,aggregate_id,resulting_version,event_type
 ) VALUES(b.bank_id,p_domain,p_aggregate,v_version,v_event);
 RETURN v_receipt;
END $body$;
CREATE FUNCTION opes_stage3.read_candidate(
 p_domain text,p_aggregate uuid
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER
SET search_path=pg_catalog,pg_temp AS $body$
DECLARE b record;r record;
BEGIN
 SELECT * INTO b FROM opes_stage3.database_binding
 WHERE login_role=session_user AND enabled=true;
 IF NOT FOUND THEN RETURN NULL;END IF;
 SELECT * INTO r FROM opes_stage3.candidate_registry
 WHERE bank_id=b.bank_id AND domain_id=p_domain AND aggregate_id=p_aggregate;
 IF NOT FOUND THEN RETURN NULL;END IF;
 RETURN jsonb_build_object(
  'bankId',r.bank_id::text,'aggregateId',r.aggregate_id::text,
  'version',r.version,'state',r.state,
  'financialEffective',false,'regulatorySubmissionEnabled',false);
END $body$;
REVOKE ALL ON ALL TABLES IN SCHEMA opes_stage3 FROM PUBLIC;
REVOKE ALL ON FUNCTION opes_stage3.apply_candidate(
 text,uuid,integer,bigint,text,text,jsonb,uuid,text,uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION opes_stage3.read_candidate(text,uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION opes_stage3.apply_candidate(
 text,uuid,integer,bigint,text,text,jsonb,uuid,text,uuid)
 TO opes_s3_bank_a_lab,opes_s3_bank_a_checker_lab,opes_s3_bank_b_lab,opes_s3_unbound_lab;
GRANT EXECUTE ON FUNCTION opes_stage3.read_candidate(text,uuid)
 TO opes_s3_bank_a_lab,opes_s3_bank_a_checker_lab,opes_s3_bank_b_lab,opes_s3_unbound_lab;
-- No direct DML on any tables is granted; audit/outbox are append-only.
COMMIT;
