\set ON_ERROR_STOP on
-- Connection MUST authenticate as opes_bank_a_test, not postgres + SET ROLE.
DO $$ DECLARE n integer;
BEGIN
 IF session_user::text <> 'opes_bank_a_test' THEN
   RAISE EXCEPTION 'Not authenticated as bank A test login';
 END IF;
 SELECT count(*) INTO n FROM opes_tenant.institution;
 IF n<>1 THEN RAISE EXCEPTION 'Bank A should see exactly its own institution'; END IF;
END $$;
-- Attempted mutable GUC spoofing does not change the authenticated SESSION_USER.
SET opes.institution_id='22222222-2222-4222-8222-222222222222';
DO $$ DECLARE n integer; id uuid; denied boolean:=false;
BEGIN
 SELECT institution_id INTO id FROM opes_tenant.institution;
 IF id <> '11111111-1111-4111-8111-111111111111'::uuid THEN
   RAISE EXCEPTION 'GUC spoofed another bank''s institution';
 END IF;
 SELECT count(*) INTO n FROM opes_tenant.regulatory_mapping;
 IF n<>1 THEN RAISE EXCEPTION 'Bank A should see its own draft mapping only: %',n; END IF;
 BEGIN
   EXECUTE 'SET ROLE opes_bank_b_test';
 EXCEPTION WHEN insufficient_privilege THEN denied:=true;
 END;
 IF NOT denied THEN RAISE EXCEPTION 'Bank A login assumed bank B role'; END IF;
END $$;
SELECT 'AUTHENTICATED_BANK_A_CONTEXT_PASSED' AS result;
