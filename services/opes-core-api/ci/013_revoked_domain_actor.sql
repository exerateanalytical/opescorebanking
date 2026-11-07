\set ON_ERROR_STOP on
DO $deny$
BEGIN
  BEGIN
    PERFORM opes_core.read_review(
     'GOV','10000000-0000-4000-8000-000000000001',
     'https://auth.opes.example/realm/ci','ops-poster-001',gen_random_uuid());
    RAISE EXCEPTION 'REVOKED_DOMAIN_READ_ALLOWED';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  BEGIN
    PERFORM opes_core.apply_review(
      'GOV',0,'10000000-0000-4000-8000-000000000001',
      0,'OPES-REVIEW-CI-GOV-STAGE-0','{}'::jsonb,NULL,NULL,
      'https://auth.opes.example/realm/ci','ops-poster-001',gen_random_uuid());
    RAISE EXCEPTION 'REVOKED_DOMAIN_REPLAY_ALLOWED';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END $deny$;
SELECT 'PRODUCTION_25_DOMAIN_REVOKED_ACTOR_DENIED';
