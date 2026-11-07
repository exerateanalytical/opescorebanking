\set ON_ERROR_STOP on
DO $test$
BEGIN
 BEGIN
  PERFORM opes_core.resolve_command(
   '11111111-1111-4111-8111-111111111111',
   'https://auth.opes.example/realm/ci','ops-poster-001');
  RAISE EXCEPTION 'REVOKED_AUTHORITY_CAN_STILL_RESOLVE';
 EXCEPTION WHEN insufficient_privilege THEN NULL;
 END;
 BEGIN
  PERFORM opes_core.post_journal(
   '11111111-1111-4111-8111-111111111111',
   '22222222-2222-4222-8222-222222222222',
   'OPES-TEST-LEDGER-001',
   '33333333-3333-4333-8333-333333333333',
   '9c9f7aaed2b93311f13476f30fed628677d40f0da9f6e63bc6fc750c6fb448bc',
   '[{"accountId":"44444444-4444-4444-8444-444444444444","side":"DEBIT","amountMinor":1000,"currency":"XAF"},
   {"accountId":"55555555-5555-4555-8555-555555555555","side":"CREDIT","amountMinor":1000,"currency":"XAF"}]'::jsonb,
   'https://auth.opes.example/realm/ci','ops-poster-001');
  RAISE EXCEPTION 'REVOKED_AUTHORITY_CAN_REPLAY';
 EXCEPTION WHEN insufficient_privilege THEN NULL;
 END;
END $test$;
SELECT 'PRODUCTION_LEDGER_MEMBERSHIP_REVOCATION_DENIAL_PASS';
