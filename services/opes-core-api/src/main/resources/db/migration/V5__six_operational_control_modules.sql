-- OPES CORE BANKING V5: six bounded-context operational CONTROL RECORD modules.
-- Real bank-scoped durable business records, never scheme payments or deployments.
-- Production key provisioning MUST use independently approved D/B secrets, never CI key.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE opes_core.ops_definition(
 domain text PRIMARY KEY CHECK(domain IN('GOV','ARC','TST','INF','DR','REL')),
 label text NOT NULL, ref_field text NOT NULL, revision_field text NOT NULL, fields text[] NOT NULL
);
INSERT INTO opes_core.ops_definition VALUES
('GOV','Governance policies','policyCode','policyRevision',ARRAY['policyCode','policyRevision','title','category','effectiveDate','reviewDate','evidenceSha','ownerRef']::text[]),
('ARC','Architecture contract registry','contractName','contractRevision',ARRAY['contractName','contractRevision','boundedContext','semanticVersion','compatibility','specificationSha','ownerRef','approvedAdrRef']::text[]),
('TST','Test execution evidence','suiteRef','executionSeq',ARRAY['suiteRef','executionSeq','buildSha','environment','passedCount','failedCount','executedAt','evidenceSha']::text[]),
('INF','Infrastructure service evidence','serviceCode','observationSeq',ARRAY['serviceCode','observationSeq','environment','observedStatus','observedAt','telemetrySha','runbookRef','incidentRef']::text[]),
('DR','Disaster recovery exercise evidence','planRef','exerciseSeq',ARRAY['planRef','exerciseSeq','targetRpoMinutes','measuredRpoMinutes','targetRtoMinutes','measuredRtoMinutes','restoreSha','exercisedAt','evidenceSha']::text[]),
('REL','Release approval register','releaseVersion','releaseSeq',ARRAY['releaseVersion','releaseSeq','artifactSha','targetEnvironment','changeTicket','rollbackPlanRef','testCaseId','infrastructureCaseId','recoveryCaseId','scheduledAt']::text[]);
CREATE TABLE opes_core.ops_signing_key(
 bank_id uuid PRIMARY KEY REFERENCES opes_core.institution(bank_id),
 secret bytea NOT NULL CHECK(octet_length(secret)>=32),
 active boolean NOT NULL DEFAULT false,
 version integer NOT NULL CHECK(version>=1),
 rotated_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
REVOKE ALL ON opes_core.ops_signing_key FROM PUBLIC;
CREATE TABLE opes_core.ops_nonce(
 bank_id uuid NOT NULL,
 nonce uuid NOT NULL,
 consumed_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 PRIMARY KEY(bank_id,nonce)
);
CREATE TABLE opes_core.ops_grant(
 bank_id uuid NOT NULL,
 issuer text NOT NULL,subject_id text NOT NULL,
 domain text NOT NULL REFERENCES opes_core.ops_definition(domain),
 operation text NOT NULL CHECK(operation IN('CREATE','SUBMIT','DECIDE','RETIRE','READ')),
 active boolean NOT NULL DEFAULT false,
 expires_at timestamptz NOT NULL,
 PRIMARY KEY(bank_id,issuer,subject_id,domain,operation),
 FOREIGN KEY(bank_id,issuer,subject_id)
 REFERENCES opes_core.actor_membership(bank_id,issuer,subject_id)
);
CREATE TABLE opes_core.ops_item(
 bank_id uuid NOT NULL REFERENCES opes_core.institution(bank_id),
 domain text NOT NULL REFERENCES opes_core.ops_definition(domain),
 item_id uuid NOT NULL,
 business_ref text NOT NULL CHECK(length(business_ref) BETWEEN 3 AND 120),
 business_revision integer NOT NULL CHECK(business_revision BETWEEN 1 AND 100000),
 version integer NOT NULL CHECK(version BETWEEN 1 AND 100000),
 state text NOT NULL CHECK(state IN
 ('DRAFT','PENDING_APPROVAL','APPROVED_RECORD','REJECTED','RETIRED')),
 payload jsonb NOT NULL CHECK(jsonb_typeof(payload)='object'),
 maker_issuer text NOT NULL,maker_subject text NOT NULL,
 checker_issuer text,checker_subject text,
 submission_evidence uuid,decision_evidence uuid,retirement_evidence uuid,
 decision_at timestamptz,created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 PRIMARY KEY(bank_id,domain,item_id),
 UNIQUE(bank_id,domain,business_ref,business_revision),
 FOREIGN KEY(bank_id,maker_issuer,maker_subject)
 REFERENCES opes_core.actor_membership(bank_id,issuer,subject_id),
 CHECK((checker_issuer IS NULL)=(checker_subject IS NULL)),
 CHECK(state NOT IN('APPROVED_RECORD','REJECTED','RETIRED') OR checker_subject IS NOT NULL)
);
CREATE INDEX ops_item_list_index ON opes_core.ops_item(bank_id,domain,state,created_at DESC,item_id);
CREATE TABLE opes_core.ops_command(
 bank_id uuid NOT NULL,domain text NOT NULL,item_id uuid NOT NULL,
 idempotency_key text NOT NULL CHECK(length(idempotency_key) BETWEEN 16 AND 128),
 digest text NOT NULL CHECK(digest ~ '^[a-f0-9]{64}$'),
 actor_issuer text NOT NULL,actor_subject text NOT NULL,
 operation text NOT NULL,version integer NOT NULL,
 receipt jsonb NOT NULL,committed_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 PRIMARY KEY(bank_id,domain,idempotency_key),
 FOREIGN KEY(bank_id,domain,item_id) REFERENCES opes_core.ops_item(bank_id,domain,item_id)
);
CREATE TABLE opes_core.ops_audit(
 bank_id uuid NOT NULL,event_id uuid NOT NULL DEFAULT gen_random_uuid(),
 domain text NOT NULL,item_id uuid NOT NULL,version integer NOT NULL,
 event_type text NOT NULL,actor_issuer text NOT NULL,actor_subject text NOT NULL,
 evidence uuid,occurred_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 PRIMARY KEY(bank_id,event_id),UNIQUE(bank_id,domain,item_id,version),
 FOREIGN KEY(bank_id,domain,item_id) REFERENCES opes_core.ops_item(bank_id,domain,item_id)
);
CREATE TABLE opes_core.ops_outbox(
 bank_id uuid NOT NULL,event_id uuid NOT NULL DEFAULT gen_random_uuid(),
 domain text NOT NULL,item_id uuid NOT NULL,version integer NOT NULL,
 event_type text NOT NULL,
 payload jsonb NOT NULL,
 external_dispatch_allowed boolean NOT NULL DEFAULT false
 CHECK(external_dispatch_allowed=false),
 created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 PRIMARY KEY(bank_id,event_id),UNIQUE(bank_id,domain,item_id,version),
 FOREIGN KEY(bank_id,domain,item_id) REFERENCES opes_core.ops_item(bank_id,domain,item_id)
);
CREATE TRIGGER immutable_ops_command BEFORE UPDATE OR DELETE ON opes_core.ops_command
 FOR EACH ROW EXECUTE FUNCTION opes_core.reject_immutable_change();
CREATE TRIGGER immutable_ops_audit BEFORE UPDATE OR DELETE ON opes_core.ops_audit
 FOR EACH ROW EXECUTE FUNCTION opes_core.reject_immutable_change();
CREATE TRIGGER immutable_ops_outbox BEFORE UPDATE OR DELETE ON opes_core.ops_outbox
 FOR EACH ROW EXECUTE FUNCTION opes_core.reject_immutable_change();
CREATE TABLE opes_core.ops_gov(
 bank_id uuid NOT NULL, domain text NOT NULL DEFAULT 'GOV' CHECK(domain='GOV'),
 item_id uuid NOT NULL,
 "policyCode" text NOT NULL CHECK(length("policyCode") BETWEEN 3 AND 80),
 "policyRevision" integer NOT NULL CHECK("policyRevision" BETWEEN 1 AND 100000),
 "title" text NOT NULL CHECK(length("title") BETWEEN 5 AND 220),
 "category" text NOT NULL CHECK("category" IN ('OPERATIONS','RISK','COMPLIANCE','SECURITY','FINANCE')),
 "effectiveDate" date NOT NULL CHECK(TRUE),
 "reviewDate" date NOT NULL CHECK("reviewDate">="effectiveDate"),
 "evidenceSha" text NOT NULL CHECK("evidenceSha" ~ '^[0-9a-f]{64}$'),
 "ownerRef" text NOT NULL CHECK(length("ownerRef") BETWEEN 3 AND 100),
 PRIMARY KEY(bank_id,item_id),
 FOREIGN KEY(bank_id,domain,item_id) REFERENCES opes_core.ops_item(bank_id,domain,item_id)
);

CREATE TABLE opes_core.ops_arc(
 bank_id uuid NOT NULL, domain text NOT NULL DEFAULT 'ARC' CHECK(domain='ARC'),
 item_id uuid NOT NULL,
 "contractName" text NOT NULL CHECK(length("contractName") BETWEEN 3 AND 120),
 "contractRevision" integer NOT NULL CHECK("contractRevision" BETWEEN 1 AND 100000),
 "boundedContext" text NOT NULL CHECK(length("boundedContext") BETWEEN 3 AND 100),
 "semanticVersion" text NOT NULL CHECK("semanticVersion" ~ '^[0-9]{1,5}\.[0-9]{1,5}\.[0-9]{1,5}$'),
 "compatibility" text NOT NULL CHECK("compatibility" IN ('BACKWARD','FULL','NONE')),
 "specificationSha" text NOT NULL CHECK("specificationSha" ~ '^[0-9a-f]{64}$'),
 "ownerRef" text NOT NULL CHECK(length("ownerRef") BETWEEN 3 AND 100),
 "approvedAdrRef" text NOT NULL CHECK(length("approvedAdrRef") BETWEEN 3 AND 120),
 PRIMARY KEY(bank_id,item_id),
 FOREIGN KEY(bank_id,domain,item_id) REFERENCES opes_core.ops_item(bank_id,domain,item_id)
);

CREATE TABLE opes_core.ops_tst(
 bank_id uuid NOT NULL, domain text NOT NULL DEFAULT 'TST' CHECK(domain='TST'),
 item_id uuid NOT NULL,
 "suiteRef" text NOT NULL CHECK(length("suiteRef") BETWEEN 3 AND 120),
 "executionSeq" integer NOT NULL CHECK("executionSeq" BETWEEN 1 AND 100000),
 "buildSha" text NOT NULL CHECK("buildSha" ~ '^[0-9a-f]{64}$'),
 "environment" text NOT NULL CHECK("environment" IN ('STAGING','PREPROD','PRODUCTION')),
 "passedCount" integer NOT NULL CHECK("passedCount" BETWEEN 0 AND 10000000),
 "failedCount" integer NOT NULL CHECK("failedCount" BETWEEN 0 AND 10000000),
 "executedAt" timestamptz NOT NULL CHECK(TRUE),
 "evidenceSha" text NOT NULL CHECK("evidenceSha" ~ '^[0-9a-f]{64}$'),
 PRIMARY KEY(bank_id,item_id),
 FOREIGN KEY(bank_id,domain,item_id) REFERENCES opes_core.ops_item(bank_id,domain,item_id)
);

CREATE TABLE opes_core.ops_inf(
 bank_id uuid NOT NULL, domain text NOT NULL DEFAULT 'INF' CHECK(domain='INF'),
 item_id uuid NOT NULL,
 "serviceCode" text NOT NULL CHECK(length("serviceCode") BETWEEN 3 AND 120),
 "observationSeq" integer NOT NULL CHECK("observationSeq" BETWEEN 1 AND 100000),
 "environment" text NOT NULL CHECK("environment" IN ('STAGING','PREPROD','PRODUCTION')),
 "observedStatus" text NOT NULL CHECK("observedStatus" IN ('HEALTHY','DEGRADED','DOWN')),
 "observedAt" timestamptz NOT NULL CHECK(TRUE),
 "telemetrySha" text NOT NULL CHECK("telemetrySha" ~ '^[0-9a-f]{64}$'),
 "runbookRef" text NOT NULL CHECK(length("runbookRef") BETWEEN 3 AND 140),
 "incidentRef" text NOT NULL CHECK(length("incidentRef") BETWEEN 3 AND 140),
 PRIMARY KEY(bank_id,item_id),
 FOREIGN KEY(bank_id,domain,item_id) REFERENCES opes_core.ops_item(bank_id,domain,item_id)
);

CREATE TABLE opes_core.ops_dr(
 bank_id uuid NOT NULL, domain text NOT NULL DEFAULT 'DR' CHECK(domain='DR'),
 item_id uuid NOT NULL,
 "planRef" text NOT NULL CHECK(length("planRef") BETWEEN 3 AND 120),
 "exerciseSeq" integer NOT NULL CHECK("exerciseSeq" BETWEEN 1 AND 100000),
 "targetRpoMinutes" integer NOT NULL CHECK("targetRpoMinutes" BETWEEN 0 AND 100000),
 "measuredRpoMinutes" integer NOT NULL CHECK("measuredRpoMinutes" BETWEEN 0 AND 100000),
 "targetRtoMinutes" integer NOT NULL CHECK("targetRtoMinutes" BETWEEN 0 AND 100000),
 "measuredRtoMinutes" integer NOT NULL CHECK("measuredRtoMinutes" BETWEEN 0 AND 100000),
 "restoreSha" text NOT NULL CHECK("restoreSha" ~ '^[0-9a-f]{64}$'),
 "exercisedAt" timestamptz NOT NULL CHECK(TRUE),
 "evidenceSha" text NOT NULL CHECK("evidenceSha" ~ '^[0-9a-f]{64}$'),
 PRIMARY KEY(bank_id,item_id),
 FOREIGN KEY(bank_id,domain,item_id) REFERENCES opes_core.ops_item(bank_id,domain,item_id)
);

CREATE TABLE opes_core.ops_rel(
 bank_id uuid NOT NULL, domain text NOT NULL DEFAULT 'REL' CHECK(domain='REL'),
 item_id uuid NOT NULL,
 "releaseVersion" text NOT NULL CHECK("releaseVersion" ~ '^[0-9]{1,5}\.[0-9]{1,5}\.[0-9]{1,5}$'),
 "releaseSeq" integer NOT NULL CHECK("releaseSeq" BETWEEN 1 AND 100000),
 "artifactSha" text NOT NULL CHECK("artifactSha" ~ '^[0-9a-f]{64}$'),
 "targetEnvironment" text NOT NULL CHECK("targetEnvironment" IN ('STAGING','PREPROD','PRODUCTION')),
 "changeTicket" text NOT NULL CHECK(length("changeTicket") BETWEEN 4 AND 120),
 "rollbackPlanRef" text NOT NULL CHECK(length("rollbackPlanRef") BETWEEN 4 AND 160),
 "testCaseId" uuid NOT NULL CHECK(TRUE),
 "infrastructureCaseId" uuid NOT NULL CHECK(TRUE),
 "recoveryCaseId" uuid NOT NULL CHECK(TRUE),
 "scheduledAt" timestamptz NOT NULL CHECK(TRUE),
 PRIMARY KEY(bank_id,item_id),
 FOREIGN KEY(bank_id,domain,item_id) REFERENCES opes_core.ops_item(bank_id,domain,item_id)
);

DO $rls$
DECLARE target text;
BEGIN
 FOREACH target IN ARRAY ARRAY['ops_grant','ops_item','ops_command','ops_audit','ops_outbox','ops_nonce','ops_gov','ops_arc','ops_tst','ops_inf','ops_dr','ops_rel'] LOOP
  EXECUTE format('ALTER TABLE opes_core.%I ENABLE ROW LEVEL SECURITY',target);
  EXECUTE format('ALTER TABLE opes_core.%I FORCE ROW LEVEL SECURITY',target);
  EXECUTE format('CREATE POLICY %I ON opes_core.%I USING(bank_id=opes_core.current_bank_id()) WITH CHECK(bank_id=opes_core.current_bank_id())',
    'bank_scope_'||target,target);
 END LOOP;
END $rls$;
REVOKE ALL ON ALL TABLES IN SCHEMA opes_core FROM PUBLIC;

-- Independently provisioned HMAC key must be separate from the DB login secret.
-- The SQL runtime principal cannot SELECT ops_signing_key.
CREATE FUNCTION opes_core.ops_verify_attestation(
 p_bank uuid,p_operation text,p_domain text,p_item uuid,p_version integer,
 p_key text,p_payload text,p_evidence uuid,p_decision text,
 p_issuer text,p_subject text,p_nonce uuid,p_expiry bigint,p_mac text
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $$
DECLARE stored bytea; input text='OPES-OPS-v1'||chr(10); val text; now_epoch bigint;
BEGIN
 IF p_bank IS NULL OR p_nonce IS NULL OR p_expiry IS NULL OR
    p_mac IS NULL OR p_mac !~ '^[a-f0-9]{64}$' THEN
  RAISE EXCEPTION 'SIGNED_OPERATOR_REQUEST_REQUIRED' USING ERRCODE='42501';
 END IF;
 IF opes_core.current_bank_id() IS DISTINCT FROM p_bank THEN
  RAISE EXCEPTION 'AUTHENTICATED_BANK_PRINCIPAL_MISMATCH' USING ERRCODE='42501';
 END IF;
 now_epoch=extract(epoch FROM clock_timestamp())::bigint;
 IF p_expiry<now_epoch OR p_expiry>now_epoch+60 THEN
  RAISE EXCEPTION 'EXPIRED_OPERATOR_ATTESTATION' USING ERRCODE='42501';
 END IF;
 SELECT secret INTO stored FROM opes_core.ops_signing_key
 WHERE bank_id=p_bank AND active=true;
 IF NOT FOUND THEN
  RAISE EXCEPTION 'NO_BANK_OPERATOR_ATTESTATION_KEY' USING ERRCODE='42501';
 END IF;
 FOREACH val IN ARRAY ARRAY[
  p_bank::text,p_operation,p_domain,p_item::text,p_version::text,
  p_key,p_payload,p_evidence::text,p_decision,p_issuer,p_subject,
  p_nonce::text,p_expiry::text
 ] LOOP
  val=coalesce(val,'');
  input=input||octet_length(val)::text||':'||val||chr(10);
 END LOOP;
 IF encode(public.hmac(convert_to(input,'UTF8'),stored,'sha256'),'hex')<>p_mac THEN
  RAISE EXCEPTION 'OPERATOR_ATTESTATION_INVALID' USING ERRCODE='42501';
 END IF;
 INSERT INTO opes_core.ops_nonce(bank_id,nonce) VALUES(p_bank,p_nonce);
 EXCEPTION WHEN unique_violation THEN
  RAISE EXCEPTION 'OPERATOR_ATTESTATION_REPLAYED' USING ERRCODE='42501';
END $$;
REVOKE ALL ON FUNCTION opes_core.ops_verify_attestation(
 uuid,text,text,uuid,integer,text,text,uuid,text,text,text,uuid,bigint,text) FROM PUBLIC;
CREATE FUNCTION opes_core.ops_assert_permission(
 p_bank uuid,p_domain text,p_operation text,p_issuer text,p_subject text
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $$
BEGIN
 PERFORM 1 FROM opes_core.actor_membership WHERE bank_id=p_bank AND
  issuer=p_issuer AND subject_id=p_subject AND active=true AND
  expires_at>clock_timestamp() FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'INACTIVE_OPERATOR_MEMBERSHIP' USING ERRCODE='42501';END IF;
 PERFORM 1 FROM opes_core.ops_grant
 WHERE bank_id=p_bank AND domain=p_domain AND operation=p_operation AND
 issuer=p_issuer AND subject_id=p_subject AND active=true AND
 expires_at>clock_timestamp() FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'OPERATION_PERMISSION_DENIED' USING ERRCODE='42501';END IF;
END $$;
REVOKE ALL ON FUNCTION opes_core.ops_assert_permission(uuid,text,text,text,text) FROM PUBLIC;

-- p_operation: CREATE, SUBMIT, DECIDE or RETIRE; all in one transaction.
CREATE FUNCTION opes_core.ops_execute(
 p_domain text,p_item uuid,p_operation text,p_expected integer,p_key text,
 p_payload text,p_evidence uuid,p_decision text,p_issuer text,p_subject text,
 p_nonce uuid,p_expiry bigint,p_mac text
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $$
DECLARE b uuid;cfg record; old record; duplicate record; body jsonb; digest text;
 record_ref text; revision integer; next_state text; next_version integer;
 table_name text;typed_data jsonb; col text; result jsonb; changed integer;
BEGIN
 b=opes_core.current_bank_id();
 IF b IS NULL THEN RAISE EXCEPTION 'UNBOUND_OPERATIONS_BANK' USING ERRCODE='42501';END IF;
 IF p_domain NOT IN('GOV','ARC','TST','INF','DR','REL') OR
 p_operation NOT IN('CREATE','SUBMIT','DECIDE','RETIRE') OR p_item IS NULL OR
 p_expected IS NULL OR p_expected<0 OR p_expected>=100000 OR
 p_key IS NULL OR p_key !~ '^[A-Za-z0-9._:-]{16,128}$' OR
 p_issuer IS NULL OR p_subject IS NULL OR p_issuer !~ '^https://' OR
 length(p_subject)<3 THEN
 RAISE EXCEPTION 'INVALID_CONTROL_COMMAND' USING ERRCODE='22023';END IF;
 PERFORM opes_core.ops_verify_attestation(b,p_operation,p_domain,p_item,p_expected,
  p_key,p_payload,p_evidence,p_decision,p_issuer,p_subject,p_nonce,p_expiry,p_mac);
 PERFORM opes_core.ops_assert_permission(b,p_domain,p_operation,p_issuer,p_subject);
 SELECT * INTO cfg FROM opes_core.ops_definition WHERE domain=p_domain;
 IF NOT FOUND THEN RAISE EXCEPTION 'INVALID_CONTROL_DOMAIN' USING ERRCODE='22023';END IF;
 IF p_operation='CREATE' THEN
  IF p_expected<>0 OR p_payload IS NULL OR p_evidence IS NOT NULL OR p_decision IS NOT NULL
   THEN RAISE EXCEPTION 'CONTROL_CREATE_SHAPE' USING ERRCODE='22023';END IF;
  body=p_payload::jsonb;
  IF jsonb_typeof(body)<>'object' OR
   (SELECT count(*) FROM jsonb_object_keys(body))<>cardinality(cfg.fields) THEN
   RAISE EXCEPTION 'CONTROL_TYPED_FIELDS_REQUIRED' USING ERRCODE='22023';END IF;
  FOREACH col IN ARRAY cfg.fields LOOP
   IF NOT body?col OR body->col='null'::jsonb THEN
    RAISE EXCEPTION 'CONTROL_REQUIRED_FIELD' USING ERRCODE='22023';END IF;
  END LOOP;
  record_ref=body->>cfg.ref_field;
  revision=(body->>cfg.revision_field)::integer;
  IF record_ref IS NULL OR length(record_ref)<3 OR revision IS NULL
    OR revision<1 OR revision>100000 THEN
    RAISE EXCEPTION 'CONTROL_BUSINESS_REFERENCE_INVALID' USING ERRCODE='22023';
  END IF;
 ELSE
  IF p_payload IS NOT NULL OR p_evidence IS NULL OR p_expected<1 OR
   (p_operation IN ('SUBMIT','RETIRE') AND p_decision IS NOT NULL) OR
   (p_operation='DECIDE' AND p_decision NOT IN('APPROVE','REJECT')) THEN
   RAISE EXCEPTION 'INVALID_CONTROL_TRANSITION' USING ERRCODE='22023'; END IF;
 END IF;
 digest=encode(sha256(convert_to(jsonb_build_object(
 'domain',p_domain,'itemId',p_item::text,'operation',p_operation,
 'expectedVersion',p_expected,'payload',p_payload,
 'evidence',p_evidence,'decision',p_decision)::text,'UTF8')),'hex');
 PERFORM pg_advisory_xact_lock(hashtextextended(b::text||':'||p_domain||':'||p_key,0));
 SELECT * INTO duplicate FROM opes_core.ops_command
 WHERE bank_id=b AND domain=p_domain AND idempotency_key=p_key;
 IF FOUND THEN
  IF duplicate.digest=digest AND duplicate.actor_issuer=p_issuer
     AND duplicate.actor_subject=p_subject AND duplicate.item_id=p_item
     AND duplicate.operation=p_operation THEN RETURN duplicate.receipt;END IF;
  RAISE EXCEPTION 'CONTROL_IDEMPOTENCY_CONFLICT' USING ERRCODE='23505';
 END IF;
 SELECT * INTO old FROM opes_core.ops_item
 WHERE bank_id=b AND domain=p_domain AND item_id=p_item FOR UPDATE;
 IF p_operation='CREATE' THEN
  IF FOUND THEN RAISE EXCEPTION 'CONTROL_RECORD_EXISTS' USING ERRCODE='23505';END IF;
  next_state='DRAFT';next_version=1;
  INSERT INTO opes_core.ops_item(
   bank_id,domain,item_id,business_ref,business_revision,version,state,
   payload,maker_issuer,maker_subject)
  VALUES(b,p_domain,p_item,record_ref,revision,next_version,next_state,
   body,p_issuer,p_subject);
  typed_data=body||jsonb_build_object('bank_id',b::text,'domain',p_domain,'item_id',p_item::text);
  table_name='ops_'||lower(p_domain);
  EXECUTE format(
   'INSERT INTO opes_core.%I SELECT (jsonb_populate_record(NULL::opes_core.%I,$1)).*',
   table_name,table_name) USING typed_data;
 ELSE
  IF NOT FOUND OR old.version<>p_expected THEN
   RAISE EXCEPTION 'CONTROL_VERSION_CONFLICT' USING ERRCODE='23505';END IF;
  IF p_operation='SUBMIT' THEN
   IF old.state<>'DRAFT' OR old.maker_issuer<>p_issuer
      OR old.maker_subject<>p_subject THEN
    RAISE EXCEPTION 'MAKER_ONLY_SUBMIT' USING ERRCODE='42501';END IF;
   next_state='PENDING_APPROVAL';
  ELSIF p_operation='DECIDE' THEN
   IF old.state<>'PENDING_APPROVAL' OR
    (old.maker_issuer=p_issuer AND old.maker_subject=p_subject) THEN
    RAISE EXCEPTION 'INDEPENDENT_CHECKER_REQUIRED' USING ERRCODE='42501';END IF;
   next_state=CASE WHEN p_decision='APPROVE' THEN 'APPROVED_RECORD' ELSE 'REJECTED' END;
   IF p_decision='APPROVE' THEN
    IF p_domain='TST' AND (old.payload->>'failedCount')::integer<>0 THEN
      RAISE EXCEPTION 'TEST_FAILURES_PREVENT_ACCEPTANCE' USING ERRCODE='23514';END IF;
    IF p_domain='DR' AND (
      (old.payload->>'measuredRpoMinutes')::integer>
       (old.payload->>'targetRpoMinutes')::integer OR
      (old.payload->>'measuredRtoMinutes')::integer>
       (old.payload->>'targetRtoMinutes')::integer) THEN
      RAISE EXCEPTION 'RECOVERY_OBJECTIVES_NOT_MET' USING ERRCODE='23514';END IF;
    IF p_domain='INF' AND old.payload->>'observedStatus'='DOWN' AND
      old.payload->>'incidentRef'='NONE' THEN
      RAISE EXCEPTION 'INCIDENT_EVIDENCE_REQUIRED' USING ERRCODE='23514';END IF;
    IF p_domain='REL' AND old.payload->>'targetEnvironment'='PRODUCTION' THEN
      -- Never authorize a production RELEASE RECORD without actual accepted
      -- test evidence, healthy observations, and DR evidence in the same bank.
      PERFORM 1 FROM opes_core.ops_item tst
       WHERE tst.bank_id=b AND tst.domain='TST' AND
       tst.item_id=(old.payload->>'testCaseId')::uuid
       AND tst.state='APPROVED_RECORD' AND
       (tst.payload->>'failedCount')::integer=0;
      IF NOT FOUND THEN RAISE EXCEPTION 'VERIFIED_TEST_EVIDENCE_REQUIRED' USING ERRCODE='23514';END IF;
      PERFORM 1 FROM opes_core.ops_item inf
       WHERE inf.bank_id=b AND inf.domain='INF' AND
       inf.item_id=(old.payload->>'infrastructureCaseId')::uuid
       AND inf.state='APPROVED_RECORD' AND
       inf.payload->>'observedStatus'='HEALTHY';
      IF NOT FOUND THEN RAISE EXCEPTION 'VERIFIED_HEALTH_EVIDENCE_REQUIRED' USING ERRCODE='23514';END IF;
      PERFORM 1 FROM opes_core.ops_item dr
       WHERE dr.bank_id=b AND dr.domain='DR' AND
       dr.item_id=(old.payload->>'recoveryCaseId')::uuid
       AND dr.state='APPROVED_RECORD' AND
       (dr.payload->>'measuredRpoMinutes')::integer<=(dr.payload->>'targetRpoMinutes')::integer
       AND (dr.payload->>'measuredRtoMinutes')::integer<=(dr.payload->>'targetRtoMinutes')::integer;
      IF NOT FOUND THEN RAISE EXCEPTION 'VERIFIED_DR_EVIDENCE_REQUIRED' USING ERRCODE='23514';END IF;
    END IF;
   END IF;
  ELSE
   IF old.state<>'APPROVED_RECORD' OR
    (old.maker_issuer=p_issuer AND old.maker_subject=p_subject) THEN
    RAISE EXCEPTION 'INDEPENDENT_RETIREMENT_REVIEW_REQUIRED' USING ERRCODE='42501';END IF;
   next_state='RETIRED';
  END IF;
  next_version=old.version+1;
  UPDATE opes_core.ops_item SET state=next_state,version=next_version,
    submission_evidence=CASE WHEN p_operation='SUBMIT' THEN p_evidence ELSE submission_evidence END,
    decision_evidence=CASE WHEN p_operation='DECIDE' THEN p_evidence ELSE decision_evidence END,
    retirement_evidence=CASE WHEN p_operation='RETIRE' THEN p_evidence ELSE retirement_evidence END,
    checker_issuer=CASE WHEN p_operation='DECIDE' THEN p_issuer ELSE checker_issuer END,
    checker_subject=CASE WHEN p_operation='DECIDE' THEN p_subject ELSE checker_subject END,
    decision_at=CASE WHEN p_operation='DECIDE' THEN clock_timestamp() ELSE decision_at END,
    updated_at=clock_timestamp()
   WHERE bank_id=b AND domain=p_domain AND item_id=p_item;
 END IF;
 result=jsonb_build_object(
  'bankId',b::text,'domain',p_domain,'itemId',p_item::text,
  'state',next_state,'version',next_version,'operation',p_operation,
  'actualReleaseDeployed',false,'externalOperationsTriggered',false);
 INSERT INTO opes_core.ops_command(bank_id,domain,item_id,idempotency_key,
   digest,actor_issuer,actor_subject,operation,version,receipt)
 VALUES(b,p_domain,p_item,p_key,digest,p_issuer,p_subject,p_operation,next_version,result);
 INSERT INTO opes_core.ops_audit(bank_id,domain,item_id,version,event_type,
  actor_issuer,actor_subject,evidence)
 VALUES(b,p_domain,p_item,next_version,p_operation,p_issuer,p_subject,p_evidence);
 INSERT INTO opes_core.ops_outbox(bank_id,domain,item_id,version,event_type,payload)
 VALUES(b,p_domain,p_item,next_version,'OPES_CONTROL_'||p_domain||'_'||p_operation,
  result);
 RETURN result;
END $$;
REVOKE ALL ON FUNCTION opes_core.ops_execute(
 text,uuid,text,integer,text,text,uuid,text,text,text,uuid,bigint,text) FROM PUBLIC;

-- A read also needs a per-request HMAC and records its nonce; GET is not public.
CREATE FUNCTION opes_core.ops_read(
 p_domain text,p_item uuid,p_operation text,p_state text,p_limit integer,p_offset integer,
 p_issuer text,p_subject text,p_nonce uuid,p_expiry bigint,p_mac text
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $$
DECLARE b uuid;found jsonb; auth_payload text;
BEGIN
 b=opes_core.current_bank_id();
 IF b IS NULL THEN RAISE EXCEPTION 'UNBOUND_OPERATIONS_BANK' USING ERRCODE='42501';END IF;
 IF p_domain NOT IN('GOV','ARC','TST','INF','DR','REL') OR
   p_operation NOT IN('READ','LIST','HISTORY') OR
   p_limit IS NULL OR p_limit<1 OR p_limit>100 OR p_offset IS NULL OR
   p_offset<0 OR p_offset>10000 OR p_issuer IS NULL OR p_subject IS NULL
 THEN RAISE EXCEPTION 'CONTROL_READ_SHAPE' USING ERRCODE='22023';END IF;
 IF p_operation='READ' OR p_operation='HISTORY' THEN
   IF p_item IS NULL THEN RAISE EXCEPTION 'CONTROL_ID_REQUIRED' USING ERRCODE='22023';END IF;
 ELSE
   IF p_item IS NOT NULL THEN RAISE EXCEPTION 'LIST_DISALLOWS_ITEM' USING ERRCODE='22023';END IF;
 END IF;
 IF p_state IS NOT NULL AND p_state NOT IN('DRAFT','PENDING_APPROVAL','APPROVED_RECORD','REJECTED','RETIRED') THEN
   RAISE EXCEPTION 'INVALID_CONTROL_FILTER' USING ERRCODE='22023';END IF;
 auth_payload=jsonb_build_object(
  'state',p_state,'limit',p_limit,'offset',p_offset)::text;
 PERFORM opes_core.ops_verify_attestation(b,p_operation,p_domain,p_item,0,
  '',auth_payload,NULL,NULL,p_issuer,p_subject,p_nonce,p_expiry,p_mac);
 PERFORM opes_core.ops_assert_permission(b,p_domain,'READ',p_issuer,p_subject);
 IF p_operation='READ' THEN
  SELECT to_jsonb(r) INTO found FROM (
   SELECT item_id,domain,business_ref,business_revision,version,state,
    payload,maker_subject,checker_subject,submission_evidence,decision_evidence,
    retirement_evidence,created_at,updated_at
   FROM opes_core.ops_item WHERE bank_id=b AND domain=p_domain AND item_id=p_item
  ) r;
 ELSIF p_operation='HISTORY' THEN
  SELECT coalesce(jsonb_agg(to_jsonb(r) ORDER BY r.version), '[]'::jsonb) INTO found
   FROM (
    SELECT version,event_type,actor_subject,evidence,occurred_at
    FROM opes_core.ops_audit
    WHERE bank_id=b AND domain=p_domain AND item_id=p_item
    ORDER BY version LIMIT p_limit OFFSET p_offset
   ) r;
 ELSE
  SELECT coalesce(jsonb_agg(to_jsonb(r) ORDER BY r.created_at DESC,r.item_id),'[]'::jsonb)
  INTO found FROM (
    SELECT item_id,domain,business_ref,business_revision,version,state,created_at,updated_at
    FROM opes_core.ops_item WHERE bank_id=b AND domain=p_domain
       AND (p_state IS NULL OR state=p_state)
    ORDER BY created_at DESC,item_id LIMIT p_limit OFFSET p_offset
  ) r;
 END IF;
 RETURN found;
END $$;
REVOKE ALL ON FUNCTION opes_core.ops_read(
 text,uuid,text,text,integer,integer,text,text,uuid,bigint,text) FROM PUBLIC;
