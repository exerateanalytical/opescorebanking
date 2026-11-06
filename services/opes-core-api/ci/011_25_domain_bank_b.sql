\set ON_ERROR_STOP on
DO $deny$
BEGIN
 IF opes_core.current_bank_id()::text<>'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb' THEN RAISE EXCEPTION 'BANK_B_SCOPE_MISSING';END IF;
 BEGIN
  PERFORM opes_core.read_review('GOV','10000000-0000-4000-8000-000000000001','https://auth.opes.example/realm/ci','ops-poster-b',gen_random_uuid());
  RAISE EXCEPTION 'CROSS_BANK_CASE_READ_ACCEPTED';
 EXCEPTION WHEN insufficient_privilege THEN NULL;END;
END $deny$;
SELECT 'PRODUCTION_25_DOMAIN_BANK_B_ISOLATION_PASS';
