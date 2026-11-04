\set ON_ERROR_STOP on
DO $$ DECLARE n integer;
BEGIN
 IF session_user::text <> 'opes_unbound_test' THEN
   RAISE EXCEPTION 'Not authenticated as unbound principal';
 END IF;
 SELECT count(*) INTO n FROM opes_tenant.institution;
 IF n<>0 THEN RAISE EXCEPTION 'Unbound login should see no institution'; END IF;
 SELECT count(*) INTO n FROM opes_tenant.regulatory_mapping;
 IF n<>0 THEN RAISE EXCEPTION 'Unbound login should see no mapping'; END IF;
END $$;
SELECT 'UNBOUND_PRINCIPAL_DENIED_PASSED' AS result;
