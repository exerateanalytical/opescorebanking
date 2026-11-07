\set ON_ERROR_STOP on
DO $deny$
BEGIN
 IF opes_core.current_bank_id()::text<>'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb' THEN RAISE EXCEPTION 'WRONG_BANK_B_SQL_IDENTITY';END IF;
 BEGIN
 PERFORM opes_ci.ci_read('GOV','f0000000-0000-4000-8000-000000000001'::uuid,'READ',NULL,50,0,'https://auth.opes.example/realm/ci','ops-poster-b');
 RAISE EXCEPTION 'CROSS_BANK_OPERATIONS_READ_ALLOWED';
 EXCEPTION WHEN insufficient_privilege THEN NULL;END;
END $deny$;
SELECT 'SIX_MODULE_CROSS_BANK_DENIAL_PASS';
