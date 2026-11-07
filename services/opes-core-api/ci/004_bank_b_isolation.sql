\set ON_ERROR_STOP on
DO $test$
DECLARE r jsonb;
BEGIN
 IF opes_core.current_bank_id()::text
   <>'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb' THEN
  RAISE EXCEPTION 'BANK_B_SQL_PRINCIPAL_MISMATCH';END IF;
 r=opes_core.resolve_command(
  '11111111-1111-4111-8111-111111111111',
  'https://auth.opes.example/realm/ci','ops-poster-b');
 IF r IS NOT NULL THEN RAISE EXCEPTION 'BANK_B_READ_FOREIGN_COMMIT';END IF;
 BEGIN
  PERFORM opes_core.post_journal(
   '11111111-1111-4111-8111-111111111111',
   '22222222-2222-4222-8222-222222222222',
   'OPES-TEST-LEDGER-001',
   '33333333-3333-4333-8333-333333333333',
   '9c9f7aaed2b93311f13476f30fed628677d40f0da9f6e63bc6fc750c6fb448bc',
   '[]'::jsonb,
   'https://auth.opes.example/realm/ci','ops-poster-b');
  RAISE EXCEPTION 'BANK_B_FORGED_FOREIGN_POST';
 EXCEPTION WHEN invalid_parameter_value THEN NULL;
 END;
END $test$;
SELECT 'PRODUCTION_LEDGER_BANK_B_ISOLATION_PASS';
