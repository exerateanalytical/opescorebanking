\set ON_ERROR_STOP on
DO $$ DECLARE n integer; id uuid; denied boolean:=false;
BEGIN
 IF session_user::text <> 'opes_bank_b_test' THEN
   RAISE EXCEPTION 'Not authenticated as bank B test login';
 END IF;
 SELECT count(*) INTO n FROM opes_tenant.institution;
 IF n<>1 THEN RAISE EXCEPTION 'Bank B should see exactly one institution'; END IF;
END $$;
-- Attempt bank A impersonation by setting the mutable GUC.
SET opes.institution_id='11111111-1111-4111-8111-111111111111';
DO $$ DECLARE id uuid; n integer; denied boolean:=false;
BEGIN
 SELECT institution_id INTO id FROM opes_tenant.institution;
 IF id <> '22222222-2222-4222-8222-222222222222'::uuid THEN
   RAISE EXCEPTION 'Bank B spoofed bank A by changing GUC';
 END IF;
 SELECT count(*) INTO n FROM opes_tenant.policy_revision;
 IF n<>0 THEN RAISE EXCEPTION 'Bank A policy exposed to bank B'; END IF;
 BEGIN
  INSERT INTO opes_tenant.actor_membership(
     institution_id,actor_id,principal_subject,role_code)
  VALUES (
     '11111111-1111-4111-8111-111111111111',
     'ddddeeee-dddd-4ddd-8ddd-dddddddddddd','intruder','ADMIN');
 EXCEPTION WHEN insufficient_privilege THEN denied:=true;
 END;
 IF NOT denied THEN RAISE EXCEPTION 'Bank B inserted actor into bank A'; END IF;
END $$;
SELECT 'AUTHENTICATED_BANK_B_CONTEXT_PASSED' AS result;
