\set ON_ERROR_STOP on
-- Authenticated as bank-specific SQL LOGIN, not the migration owner.
DO $six$
DECLARE x jsonb;y jsonb;
BEGIN
 IF opes_core.current_bank_id()::text<>'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' THEN RAISE EXCEPTION 'INVALID_BANK_SCOPE';END IF;
 x=opes_ci.ci_command('GOV','f0000000-0000-4000-8000-000000000001'::uuid,'CREATE',0,'CONTROL-GOV-CREATE-ONE-0001','{"policyCode":"OPES-POLICY-OPS","policyRevision":1,"title":"Operational control procedures","category":"OPERATIONS","effectiveDate":"2026-11-07","reviewDate":"2027-11-07","evidenceSha":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","ownerRef":"bank-policy-owner"}',NULL,NULL,'https://auth.opes.example/realm/ci','ops-poster-001');
 IF x->>'state'<>'DRAFT' THEN RAISE EXCEPTION 'GOV_DRAFT_FAILED';END IF;
 y=opes_ci.ci_command('GOV','f0000000-0000-4000-8000-000000000001'::uuid,'CREATE',0,'CONTROL-GOV-CREATE-ONE-0001','{"policyCode":"OPES-POLICY-OPS","policyRevision":1,"title":"Operational control procedures","category":"OPERATIONS","effectiveDate":"2026-11-07","reviewDate":"2027-11-07","evidenceSha":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","ownerRef":"bank-policy-owner"}',NULL,NULL,'https://auth.opes.example/realm/ci','ops-poster-001');
 IF x->>'itemId'<>y->>'itemId' THEN RAISE EXCEPTION 'GOV_REPLAY_CREATED_DUPLICATE';END IF;
 x=opes_ci.ci_command('GOV','f0000000-0000-4000-8000-000000000001'::uuid,'SUBMIT',1,'CONTROL-GOV-SUBMIT-ONE-0001',NULL,'22222222-2222-4222-8222-222222222222'::uuid,NULL,'https://auth.opes.example/realm/ci','ops-poster-001');
 IF x->>'state'<>'PENDING_APPROVAL' THEN RAISE EXCEPTION 'GOV_SUBMISSION_FAILED';END IF;
 BEGIN PERFORM opes_ci.ci_command('GOV','f0000000-0000-4000-8000-000000000001'::uuid,'DECIDE',2,'CONTROL-GOV-DECIDE-ONE-0001',NULL,'33333333-3333-4333-8333-333333333333'::uuid,'APPROVE','https://auth.opes.example/realm/ci','ops-poster-001');
 RAISE EXCEPTION 'MAKER_CHECKER_BYPASS';EXCEPTION WHEN insufficient_privilege THEN NULL;END;
 x=opes_ci.ci_command('GOV','f0000000-0000-4000-8000-000000000001'::uuid,'DECIDE',2,'CONTROL-GOV-DECIDE-ONE-0001',NULL,'33333333-3333-4333-8333-333333333333'::uuid,'APPROVE','https://auth.opes.example/realm/ci','ops-checker-002');
 IF x->>'state'<>'APPROVED_RECORD' OR x->>'actualReleaseDeployed'<>'false' THEN RAISE EXCEPTION 'GOV_DECISION_FAILED';END IF;
 y=opes_ci.ci_read('GOV','f0000000-0000-4000-8000-000000000001'::uuid,'READ',NULL,50,0,'https://auth.opes.example/realm/ci','ops-checker-002');
 IF y->>'state'<>'APPROVED_RECORD' THEN RAISE EXCEPTION 'GOV_PERSISTENT_READ_FAILED';END IF;
 y=opes_ci.ci_read('GOV',NULL,'LIST',NULL,50,0,'https://auth.opes.example/realm/ci','ops-checker-002');
 IF jsonb_array_length(y)<1 THEN RAISE EXCEPTION 'GOV_LIST_FAILED';END IF;
 y=opes_ci.ci_read('GOV','f0000000-0000-4000-8000-000000000001'::uuid,'HISTORY',NULL,50,0,'https://auth.opes.example/realm/ci','ops-checker-002');
 IF jsonb_array_length(y)<>3 THEN RAISE EXCEPTION 'GOV_AUDIT_HISTORY_FAILED';END IF;
 x=opes_ci.ci_command('ARC','f0000000-0000-4000-8000-000000000002'::uuid,'CREATE',0,'CONTROL-ARC-CREATE-ONE-0001','{"contractName":"opes-core-api-contract","contractRevision":1,"boundedContext":"OperationsControl","semanticVersion":"1.0.0","compatibility":"BACKWARD","specificationSha":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","ownerRef":"bank-architecture-team","approvedAdrRef":"ADR-004"}',NULL,NULL,'https://auth.opes.example/realm/ci','ops-poster-001');
 IF x->>'state'<>'DRAFT' THEN RAISE EXCEPTION 'ARC_DRAFT_FAILED';END IF;
 y=opes_ci.ci_command('ARC','f0000000-0000-4000-8000-000000000002'::uuid,'CREATE',0,'CONTROL-ARC-CREATE-ONE-0001','{"contractName":"opes-core-api-contract","contractRevision":1,"boundedContext":"OperationsControl","semanticVersion":"1.0.0","compatibility":"BACKWARD","specificationSha":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","ownerRef":"bank-architecture-team","approvedAdrRef":"ADR-004"}',NULL,NULL,'https://auth.opes.example/realm/ci','ops-poster-001');
 IF x->>'itemId'<>y->>'itemId' THEN RAISE EXCEPTION 'ARC_REPLAY_CREATED_DUPLICATE';END IF;
 x=opes_ci.ci_command('ARC','f0000000-0000-4000-8000-000000000002'::uuid,'SUBMIT',1,'CONTROL-ARC-SUBMIT-ONE-0001',NULL,'22222222-2222-4222-8222-222222222222'::uuid,NULL,'https://auth.opes.example/realm/ci','ops-poster-001');
 IF x->>'state'<>'PENDING_APPROVAL' THEN RAISE EXCEPTION 'ARC_SUBMISSION_FAILED';END IF;
 x=opes_ci.ci_command('ARC','f0000000-0000-4000-8000-000000000002'::uuid,'DECIDE',2,'CONTROL-ARC-DECIDE-ONE-0001',NULL,'33333333-3333-4333-8333-333333333333'::uuid,'APPROVE','https://auth.opes.example/realm/ci','ops-checker-002');
 IF x->>'state'<>'APPROVED_RECORD' OR x->>'actualReleaseDeployed'<>'false' THEN RAISE EXCEPTION 'ARC_DECISION_FAILED';END IF;
 y=opes_ci.ci_read('ARC','f0000000-0000-4000-8000-000000000002'::uuid,'READ',NULL,50,0,'https://auth.opes.example/realm/ci','ops-checker-002');
 IF y->>'state'<>'APPROVED_RECORD' THEN RAISE EXCEPTION 'ARC_PERSISTENT_READ_FAILED';END IF;
 y=opes_ci.ci_read('ARC',NULL,'LIST',NULL,50,0,'https://auth.opes.example/realm/ci','ops-checker-002');
 IF jsonb_array_length(y)<1 THEN RAISE EXCEPTION 'ARC_LIST_FAILED';END IF;
 y=opes_ci.ci_read('ARC','f0000000-0000-4000-8000-000000000002'::uuid,'HISTORY',NULL,50,0,'https://auth.opes.example/realm/ci','ops-checker-002');
 IF jsonb_array_length(y)<>3 THEN RAISE EXCEPTION 'ARC_AUDIT_HISTORY_FAILED';END IF;
 x=opes_ci.ci_command('TST','f0000000-0000-4000-8000-000000000003'::uuid,'CREATE',0,'CONTROL-TST-CREATE-ONE-0001','{"suiteRef":"BANK-CORE-INTEGRATION","executionSeq":1,"buildSha":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","environment":"STAGING","passedCount":35,"failedCount":0,"executedAt":"2026-11-07T01:00:00Z","evidenceSha":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"}',NULL,NULL,'https://auth.opes.example/realm/ci','ops-poster-001');
 IF x->>'state'<>'DRAFT' THEN RAISE EXCEPTION 'TST_DRAFT_FAILED';END IF;
 y=opes_ci.ci_command('TST','f0000000-0000-4000-8000-000000000003'::uuid,'CREATE',0,'CONTROL-TST-CREATE-ONE-0001','{"suiteRef":"BANK-CORE-INTEGRATION","executionSeq":1,"buildSha":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","environment":"STAGING","passedCount":35,"failedCount":0,"executedAt":"2026-11-07T01:00:00Z","evidenceSha":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"}',NULL,NULL,'https://auth.opes.example/realm/ci','ops-poster-001');
 IF x->>'itemId'<>y->>'itemId' THEN RAISE EXCEPTION 'TST_REPLAY_CREATED_DUPLICATE';END IF;
 x=opes_ci.ci_command('TST','f0000000-0000-4000-8000-000000000003'::uuid,'SUBMIT',1,'CONTROL-TST-SUBMIT-ONE-0001',NULL,'22222222-2222-4222-8222-222222222222'::uuid,NULL,'https://auth.opes.example/realm/ci','ops-poster-001');
 IF x->>'state'<>'PENDING_APPROVAL' THEN RAISE EXCEPTION 'TST_SUBMISSION_FAILED';END IF;
 x=opes_ci.ci_command('TST','f0000000-0000-4000-8000-000000000003'::uuid,'DECIDE',2,'CONTROL-TST-DECIDE-ONE-0001',NULL,'33333333-3333-4333-8333-333333333333'::uuid,'APPROVE','https://auth.opes.example/realm/ci','ops-checker-002');
 IF x->>'state'<>'APPROVED_RECORD' OR x->>'actualReleaseDeployed'<>'false' THEN RAISE EXCEPTION 'TST_DECISION_FAILED';END IF;
 y=opes_ci.ci_read('TST','f0000000-0000-4000-8000-000000000003'::uuid,'READ',NULL,50,0,'https://auth.opes.example/realm/ci','ops-checker-002');
 IF y->>'state'<>'APPROVED_RECORD' THEN RAISE EXCEPTION 'TST_PERSISTENT_READ_FAILED';END IF;
 y=opes_ci.ci_read('TST',NULL,'LIST',NULL,50,0,'https://auth.opes.example/realm/ci','ops-checker-002');
 IF jsonb_array_length(y)<1 THEN RAISE EXCEPTION 'TST_LIST_FAILED';END IF;
 y=opes_ci.ci_read('TST','f0000000-0000-4000-8000-000000000003'::uuid,'HISTORY',NULL,50,0,'https://auth.opes.example/realm/ci','ops-checker-002');
 IF jsonb_array_length(y)<>3 THEN RAISE EXCEPTION 'TST_AUDIT_HISTORY_FAILED';END IF;
 x=opes_ci.ci_command('INF','f0000000-0000-4000-8000-000000000004'::uuid,'CREATE',0,'CONTROL-INF-CREATE-ONE-0001','{"serviceCode":"BANK-CORE-API","observationSeq":1,"environment":"PRODUCTION","observedStatus":"HEALTHY","observedAt":"2026-11-07T01:01:00Z","telemetrySha":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","runbookRef":"RUNBOOK-CORE-1","incidentRef":"NONE"}',NULL,NULL,'https://auth.opes.example/realm/ci','ops-poster-001');
 IF x->>'state'<>'DRAFT' THEN RAISE EXCEPTION 'INF_DRAFT_FAILED';END IF;
 y=opes_ci.ci_command('INF','f0000000-0000-4000-8000-000000000004'::uuid,'CREATE',0,'CONTROL-INF-CREATE-ONE-0001','{"serviceCode":"BANK-CORE-API","observationSeq":1,"environment":"PRODUCTION","observedStatus":"HEALTHY","observedAt":"2026-11-07T01:01:00Z","telemetrySha":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","runbookRef":"RUNBOOK-CORE-1","incidentRef":"NONE"}',NULL,NULL,'https://auth.opes.example/realm/ci','ops-poster-001');
 IF x->>'itemId'<>y->>'itemId' THEN RAISE EXCEPTION 'INF_REPLAY_CREATED_DUPLICATE';END IF;
 x=opes_ci.ci_command('INF','f0000000-0000-4000-8000-000000000004'::uuid,'SUBMIT',1,'CONTROL-INF-SUBMIT-ONE-0001',NULL,'22222222-2222-4222-8222-222222222222'::uuid,NULL,'https://auth.opes.example/realm/ci','ops-poster-001');
 IF x->>'state'<>'PENDING_APPROVAL' THEN RAISE EXCEPTION 'INF_SUBMISSION_FAILED';END IF;
 x=opes_ci.ci_command('INF','f0000000-0000-4000-8000-000000000004'::uuid,'DECIDE',2,'CONTROL-INF-DECIDE-ONE-0001',NULL,'33333333-3333-4333-8333-333333333333'::uuid,'APPROVE','https://auth.opes.example/realm/ci','ops-checker-002');
 IF x->>'state'<>'APPROVED_RECORD' OR x->>'actualReleaseDeployed'<>'false' THEN RAISE EXCEPTION 'INF_DECISION_FAILED';END IF;
 y=opes_ci.ci_read('INF','f0000000-0000-4000-8000-000000000004'::uuid,'READ',NULL,50,0,'https://auth.opes.example/realm/ci','ops-checker-002');
 IF y->>'state'<>'APPROVED_RECORD' THEN RAISE EXCEPTION 'INF_PERSISTENT_READ_FAILED';END IF;
 y=opes_ci.ci_read('INF',NULL,'LIST',NULL,50,0,'https://auth.opes.example/realm/ci','ops-checker-002');
 IF jsonb_array_length(y)<1 THEN RAISE EXCEPTION 'INF_LIST_FAILED';END IF;
 y=opes_ci.ci_read('INF','f0000000-0000-4000-8000-000000000004'::uuid,'HISTORY',NULL,50,0,'https://auth.opes.example/realm/ci','ops-checker-002');
 IF jsonb_array_length(y)<>3 THEN RAISE EXCEPTION 'INF_AUDIT_HISTORY_FAILED';END IF;
 x=opes_ci.ci_command('DR','f0000000-0000-4000-8000-000000000005'::uuid,'CREATE',0,'CONTROL-DR-CREATE-ONE-0001','{"planRef":"BANK-RECOVERY-PLAN","exerciseSeq":1,"targetRpoMinutes":30,"measuredRpoMinutes":12,"targetRtoMinutes":120,"measuredRtoMinutes":65,"restoreSha":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","exercisedAt":"2026-11-07T01:10:00Z","evidenceSha":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"}',NULL,NULL,'https://auth.opes.example/realm/ci','ops-poster-001');
 IF x->>'state'<>'DRAFT' THEN RAISE EXCEPTION 'DR_DRAFT_FAILED';END IF;
 y=opes_ci.ci_command('DR','f0000000-0000-4000-8000-000000000005'::uuid,'CREATE',0,'CONTROL-DR-CREATE-ONE-0001','{"planRef":"BANK-RECOVERY-PLAN","exerciseSeq":1,"targetRpoMinutes":30,"measuredRpoMinutes":12,"targetRtoMinutes":120,"measuredRtoMinutes":65,"restoreSha":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","exercisedAt":"2026-11-07T01:10:00Z","evidenceSha":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"}',NULL,NULL,'https://auth.opes.example/realm/ci','ops-poster-001');
 IF x->>'itemId'<>y->>'itemId' THEN RAISE EXCEPTION 'DR_REPLAY_CREATED_DUPLICATE';END IF;
 x=opes_ci.ci_command('DR','f0000000-0000-4000-8000-000000000005'::uuid,'SUBMIT',1,'CONTROL-DR-SUBMIT-ONE-0001',NULL,'22222222-2222-4222-8222-222222222222'::uuid,NULL,'https://auth.opes.example/realm/ci','ops-poster-001');
 IF x->>'state'<>'PENDING_APPROVAL' THEN RAISE EXCEPTION 'DR_SUBMISSION_FAILED';END IF;
 x=opes_ci.ci_command('DR','f0000000-0000-4000-8000-000000000005'::uuid,'DECIDE',2,'CONTROL-DR-DECIDE-ONE-0001',NULL,'33333333-3333-4333-8333-333333333333'::uuid,'APPROVE','https://auth.opes.example/realm/ci','ops-checker-002');
 IF x->>'state'<>'APPROVED_RECORD' OR x->>'actualReleaseDeployed'<>'false' THEN RAISE EXCEPTION 'DR_DECISION_FAILED';END IF;
 y=opes_ci.ci_read('DR','f0000000-0000-4000-8000-000000000005'::uuid,'READ',NULL,50,0,'https://auth.opes.example/realm/ci','ops-checker-002');
 IF y->>'state'<>'APPROVED_RECORD' THEN RAISE EXCEPTION 'DR_PERSISTENT_READ_FAILED';END IF;
 y=opes_ci.ci_read('DR',NULL,'LIST',NULL,50,0,'https://auth.opes.example/realm/ci','ops-checker-002');
 IF jsonb_array_length(y)<1 THEN RAISE EXCEPTION 'DR_LIST_FAILED';END IF;
 y=opes_ci.ci_read('DR','f0000000-0000-4000-8000-000000000005'::uuid,'HISTORY',NULL,50,0,'https://auth.opes.example/realm/ci','ops-checker-002');
 IF jsonb_array_length(y)<>3 THEN RAISE EXCEPTION 'DR_AUDIT_HISTORY_FAILED';END IF;
 x=opes_ci.ci_command('REL','f0000000-0000-4000-8000-000000000006'::uuid,'CREATE',0,'CONTROL-REL-CREATE-ONE-0001','{"releaseVersion":"1.0.0","releaseSeq":1,"artifactSha":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","targetEnvironment":"PRODUCTION","changeTicket":"OPS-CHANGE-0001","rollbackPlanRef":"RB-PLAN-0001","testCaseId":"f0000000-0000-4000-8000-000000000003","infrastructureCaseId":"f0000000-0000-4000-8000-000000000004","recoveryCaseId":"f0000000-0000-4000-8000-000000000005","scheduledAt":"2026-11-07T05:00:00Z"}',NULL,NULL,'https://auth.opes.example/realm/ci','ops-poster-001');
 IF x->>'state'<>'DRAFT' THEN RAISE EXCEPTION 'REL_DRAFT_FAILED';END IF;
 y=opes_ci.ci_command('REL','f0000000-0000-4000-8000-000000000006'::uuid,'CREATE',0,'CONTROL-REL-CREATE-ONE-0001','{"releaseVersion":"1.0.0","releaseSeq":1,"artifactSha":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","targetEnvironment":"PRODUCTION","changeTicket":"OPS-CHANGE-0001","rollbackPlanRef":"RB-PLAN-0001","testCaseId":"f0000000-0000-4000-8000-000000000003","infrastructureCaseId":"f0000000-0000-4000-8000-000000000004","recoveryCaseId":"f0000000-0000-4000-8000-000000000005","scheduledAt":"2026-11-07T05:00:00Z"}',NULL,NULL,'https://auth.opes.example/realm/ci','ops-poster-001');
 IF x->>'itemId'<>y->>'itemId' THEN RAISE EXCEPTION 'REL_REPLAY_CREATED_DUPLICATE';END IF;
 x=opes_ci.ci_command('REL','f0000000-0000-4000-8000-000000000006'::uuid,'SUBMIT',1,'CONTROL-REL-SUBMIT-ONE-0001',NULL,'22222222-2222-4222-8222-222222222222'::uuid,NULL,'https://auth.opes.example/realm/ci','ops-poster-001');
 IF x->>'state'<>'PENDING_APPROVAL' THEN RAISE EXCEPTION 'REL_SUBMISSION_FAILED';END IF;
 x=opes_ci.ci_command('REL','f0000000-0000-4000-8000-000000000006'::uuid,'DECIDE',2,'CONTROL-REL-DECIDE-ONE-0001',NULL,'33333333-3333-4333-8333-333333333333'::uuid,'APPROVE','https://auth.opes.example/realm/ci','ops-checker-002');
 IF x->>'state'<>'APPROVED_RECORD' OR x->>'actualReleaseDeployed'<>'false' THEN RAISE EXCEPTION 'REL_DECISION_FAILED';END IF;
 y=opes_ci.ci_read('REL','f0000000-0000-4000-8000-000000000006'::uuid,'READ',NULL,50,0,'https://auth.opes.example/realm/ci','ops-checker-002');
 IF y->>'state'<>'APPROVED_RECORD' THEN RAISE EXCEPTION 'REL_PERSISTENT_READ_FAILED';END IF;
 y=opes_ci.ci_read('REL',NULL,'LIST',NULL,50,0,'https://auth.opes.example/realm/ci','ops-checker-002');
 IF jsonb_array_length(y)<1 THEN RAISE EXCEPTION 'REL_LIST_FAILED';END IF;
 y=opes_ci.ci_read('REL','f0000000-0000-4000-8000-000000000006'::uuid,'HISTORY',NULL,50,0,'https://auth.opes.example/realm/ci','ops-checker-002');
 IF jsonb_array_length(y)<>3 THEN RAISE EXCEPTION 'REL_AUDIT_HISTORY_FAILED';END IF;
 x=opes_ci.ci_command('GOV','f0000000-0000-4000-8000-000000000001'::uuid,'RETIRE',3,'CONTROL-GOV-RETIRE-ONE-0001',NULL,
'44444444-4444-4444-8444-444444444444'::uuid,NULL,'https://auth.opes.example/realm/ci','ops-checker-002');
 IF x->>'state'<>'RETIRED' THEN RAISE EXCEPTION 'GOV_RETIRE_FAILED';END IF;
 x=opes_ci.ci_command('ARC','f0000000-0000-4000-8000-000000000002'::uuid,'RETIRE',3,'CONTROL-ARC-RETIRE-ONE-0001',NULL,
'44444444-4444-4444-8444-444444444444'::uuid,NULL,'https://auth.opes.example/realm/ci','ops-checker-002');
 IF x->>'state'<>'RETIRED' THEN RAISE EXCEPTION 'ARC_RETIRE_FAILED';END IF;
 x=opes_ci.ci_command('TST','f0000000-0000-4000-8000-000000000003'::uuid,'RETIRE',3,'CONTROL-TST-RETIRE-ONE-0001',NULL,
'44444444-4444-4444-8444-444444444444'::uuid,NULL,'https://auth.opes.example/realm/ci','ops-checker-002');
 IF x->>'state'<>'RETIRED' THEN RAISE EXCEPTION 'TST_RETIRE_FAILED';END IF;
 x=opes_ci.ci_command('INF','f0000000-0000-4000-8000-000000000004'::uuid,'RETIRE',3,'CONTROL-INF-RETIRE-ONE-0001',NULL,
'44444444-4444-4444-8444-444444444444'::uuid,NULL,'https://auth.opes.example/realm/ci','ops-checker-002');
 IF x->>'state'<>'RETIRED' THEN RAISE EXCEPTION 'INF_RETIRE_FAILED';END IF;
 x=opes_ci.ci_command('DR','f0000000-0000-4000-8000-000000000005'::uuid,'RETIRE',3,'CONTROL-DR-RETIRE-ONE-0001',NULL,
'44444444-4444-4444-8444-444444444444'::uuid,NULL,'https://auth.opes.example/realm/ci','ops-checker-002');
 IF x->>'state'<>'RETIRED' THEN RAISE EXCEPTION 'DR_RETIRE_FAILED';END IF;
 x=opes_ci.ci_command('REL','f0000000-0000-4000-8000-000000000006'::uuid,'RETIRE',3,'CONTROL-REL-RETIRE-ONE-0001',NULL,
'44444444-4444-4444-8444-444444444444'::uuid,NULL,'https://auth.opes.example/realm/ci','ops-checker-002');
 IF x->>'state'<>'RETIRED' THEN RAISE EXCEPTION 'REL_RETIRE_FAILED';END IF;

 BEGIN
  PERFORM opes_core.ops_execute('GOV','f0000000-0000-4000-8000-000000000001'::uuid,'CREATE',0,
   'FORGED-SIGNATURE-ATTEMPT-0001','{}',NULL,NULL,
   'https://auth.opes.example/realm/ci','ops-poster-001',gen_random_uuid(),
   extract(epoch from clock_timestamp())::bigint+20,repeat('0',64));
  RAISE EXCEPTION 'BAD_HMAC_ACCEPTED';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
  EXECUTE 'SELECT * FROM opes_core.ops_signing_key';
  RAISE EXCEPTION 'BANK_SQL_LOGIN_CAN_READ_HMAC_SECRET';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN
  EXECUTE 'DELETE FROM opes_core.ops_audit';
  RAISE EXCEPTION 'BANK_SQL_LOGIN_CAN_DELETE_AUDIT';
 EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $six$;
SELECT 'SIX_OPERATIONAL_MODULES_FULL_LIFECYCLE_BANK_A_PASS';
