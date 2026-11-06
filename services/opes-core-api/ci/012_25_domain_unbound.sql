\set ON_ERROR_STOP on
DO $deny$
BEGIN
 IF opes_core.current_bank_id() IS NOT NULL THEN RAISE EXCEPTION 'UNBOUND_ROLE_HAS_BANK';END IF;
 BEGIN
  PERFORM opes_core.read_review('GOV','10000000-0000-4000-8000-000000000001','https://auth.opes.example/realm/ci','ops-poster-001',gen_random_uuid());
  RAISE EXCEPTION 'UNBOUND_ROLE_CAN_READ';
 EXCEPTION WHEN insufficient_privilege THEN NULL;END;
END $deny$;
SELECT 'PRODUCTION_25_DOMAIN_UNBOUND_DENIAL_PASS';
