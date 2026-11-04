\set ON_ERROR_STOP on
-- All identities and events below are synthetic test fixtures.
INSERT INTO opes_tenant.institution
  (institution_id,institution_code,legal_name,country_code,environment_class,created_by_principal)
VALUES
('11111111-1111-4111-8111-111111111111','BANK_A','Synthetic Bank A','CM','BANK_NONPRODUCTION','fixture'),
('22222222-2222-4222-8222-222222222222','BANK_B','Synthetic Bank B','GA','BANK_NONPRODUCTION','fixture');
INSERT INTO opes_tenant.actor_membership
  (institution_id,actor_id,principal_subject,role_code)
VALUES
('11111111-1111-4111-8111-111111111111','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','synthetic:a','TENANT_ADMIN'),
('11111111-1111-4111-8111-111111111111','aaaabbbb-aaaa-4aaa-8aaa-aaaaaaaaaaaa','synthetic:reviewer-a','REVIEWER'),
('22222222-2222-4222-8222-222222222222','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','synthetic:b','TENANT_ADMIN');

-- A bank cannot be a training tenant in the production schema:
DO $$ DECLARE rejected boolean:=false;
BEGIN
 BEGIN
  INSERT INTO opes_tenant.institution
    (institution_id,institution_code,legal_name,country_code,environment_class,created_by_principal)
  VALUES ('33333333-3333-4333-8333-333333333333','EDU_SIM','Synthetic Training','CM','EDUCATION_SIMULATION','fixture');
 EXCEPTION WHEN check_violation THEN rejected:=true;
 END;
 IF NOT rejected THEN RAISE EXCEPTION 'Education mode entered banking schema'; END IF;
END $$;

SET ROLE opes_foundation_runtime;
-- Context absent => zero visible rows (fail-closed RLS).
DO $$ DECLARE n integer; BEGIN
 SELECT count(*) INTO n FROM opes_tenant.institution;
 IF n<>0 THEN RAISE EXCEPTION 'Missing tenant context leaked rows: %',n; END IF;
END $$;

BEGIN;
SET LOCAL opes.institution_id='11111111-1111-4111-8111-111111111111';
DO $$ DECLARE n integer; blocked boolean:=false;
BEGIN
 SELECT count(*) INTO n FROM opes_tenant.institution;
 IF n<>1 THEN RAISE EXCEPTION 'Expected only bank A, received %',n; END IF;
 SELECT count(*) INTO n FROM opes_tenant.actor_membership;
 IF n<>2 THEN RAISE EXCEPTION 'Unexpected actor visibility %',n; END IF;
 BEGIN
  INSERT INTO opes_tenant.actor_membership(institution_id,actor_id,principal_subject,role_code)
  VALUES('22222222-2222-4222-8222-222222222222',
         'cccccccc-cccc-4ccc-8ccc-cccccccccccc','intruder','ADMIN');
 EXCEPTION WHEN insufficient_privilege THEN blocked:=true;
 END;
 IF NOT blocked THEN RAISE EXCEPTION 'Cross-tenant insertion was allowed'; END IF;
END $$;
-- Cross-institution FK means bank-A policy cannot refer to bank-B actor even
-- when the actor UUID is known by the request payload.
DO $$ DECLARE blocked boolean:=false;
BEGIN
 BEGIN
  INSERT INTO opes_tenant.policy_revision
    (institution_id,policy_id,revision_no,policy_key,policy_document,proposed_by_actor)
  VALUES('11111111-1111-4111-8111-111111111111',
         'dddddddd-dddd-4ddd-8ddd-dddddddddddd',1,
         'account.opening','{}'::jsonb,'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb');
 EXCEPTION WHEN foreign_key_violation THEN blocked:=true;
 END;
 IF NOT blocked THEN RAISE EXCEPTION 'Cross-institution FK was not enforced'; END IF;
END $$;
INSERT INTO opes_tenant.policy_revision
  (institution_id,policy_id,revision_no,policy_key,policy_document,proposed_by_actor)
VALUES ('11111111-1111-4111-8111-111111111111',
        'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',1,
        'account.opening','{"requires_kyc":true}'::jsonb,'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');

-- COBAC ambiguity does not block creating a draft semantic mapping.
INSERT INTO opes_tenant.regulatory_mapping
  (institution_id,mapping_id,semantic_key,external_account_code,proposed_by_actor)
VALUES ('11111111-1111-4111-8111-111111111111',
        'ffffffff-ffff-4fff-8fff-ffffffffffff',
        'CREDIT_SENSITIVE_SHORT_TERM','312','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
-- Attempt to make ambiguous 312 live is rejected even with a "reviewer".
DO $$ DECLARE blocked boolean:=false;
BEGIN
 BEGIN
  INSERT INTO opes_tenant.regulatory_mapping
  (institution_id,mapping_id,semantic_key,external_account_code,
   proposed_by_actor,reviewed_by_actor,lifecycle_state,
   interpretation_status,effective_from,source_sha256)
  VALUES
  ('11111111-1111-4111-8111-111111111111',
   'eeeeffff-ffff-4fff-8fff-ffffffffffff',
   'CREDIT_SENSITIVE_SHORT_TERM','312',
   'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
   'aaaabbbb-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
   'ACTIVE','DOCUMENTED_INTERPRETATION',now(),
   repeat('a',64));
 EXCEPTION WHEN check_violation THEN blocked:=true;
 END;
 IF NOT blocked THEN RAISE EXCEPTION 'Ambiguous 312 mapping became active'; END IF;
END $$;
COMMIT;

BEGIN;
SET LOCAL opes.institution_id='22222222-2222-4222-8222-222222222222';
DO $$ DECLARE n integer; BEGIN
 SELECT count(*) INTO n FROM opes_tenant.institution;
 IF n<>1 THEN RAISE EXCEPTION 'Expected only bank B: %',n; END IF;
 SELECT count(*) INTO n FROM opes_tenant.policy_revision;
 IF n<>0 THEN RAISE EXCEPTION 'Bank A policy leaked into B: %',n; END IF;
 SELECT count(*) INTO n FROM opes_tenant.regulatory_mapping;
 IF n<>0 THEN RAISE EXCEPTION 'Bank A mapping leaked into B: %',n; END IF;
END $$;
COMMIT;
RESET ROLE;
SELECT 'FOUNDATION_TENANT_TESTS_PASSED' AS result;
