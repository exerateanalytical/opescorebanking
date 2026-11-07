-- Log in AS bank A, with no table privileges and NO trusted client bank GUC.
\set ON_ERROR_STOP on
SET opes.bank_id='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
DO $test$
DECLARE r jsonb;again jsonb;
BEGIN
 IF opes_core.current_bank_id()::text
    <>'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' THEN
   RAISE EXCEPTION 'CLIENT_TENANT_GUC_CHANGED_DATABASE_BANK';
 END IF;
 r=opes_core.post_journal(
 '11111111-1111-4111-8111-111111111111',
 '22222222-2222-4222-8222-222222222222',
 'OPES-TEST-LEDGER-001',
 '33333333-3333-4333-8333-333333333333',
 '9c9f7aaed2b93311f13476f30fed628677d40f0da9f6e63bc6fc750c6fb448bc',
 '[{"accountId":"44444444-4444-4444-8444-444444444444","side":"DEBIT","amountMinor":1000,"currency":"XAF"},
   {"accountId":"55555555-5555-4555-8555-555555555555","side":"CREDIT","amountMinor":1000,"currency":"XAF"}]'::jsonb,
 'https://auth.opes.example/realm/ci','ops-poster-001');
 IF r->>'state'<>'POSTED' OR
    r->>'bankId'<>'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
 THEN RAISE EXCEPTION 'POSTED_JOURNAL_RESPONSE_INVALID';END IF;
 again=opes_core.post_journal(
 '11111111-1111-4111-8111-111111111111',
 '22222222-2222-4222-8222-222222222222',
 'OPES-TEST-LEDGER-001',
 '33333333-3333-4333-8333-333333333333',
 '9c9f7aaed2b93311f13476f30fed628677d40f0da9f6e63bc6fc750c6fb448bc',
 '[{"accountId":"44444444-4444-4444-8444-444444444444","side":"DEBIT","amountMinor":1000,"currency":"XAF"},
   {"accountId":"55555555-5555-4555-8555-555555555555","side":"CREDIT","amountMinor":1000,"currency":"XAF"}]'::jsonb,
 'https://auth.opes.example/realm/ci','ops-poster-001');
 IF again->>'journalId'<>r->>'journalId' THEN
  RAISE EXCEPTION 'REPLAY_CREATED_ANOTHER_POSTING';END IF;
 IF (opes_core.resolve_command(
  '11111111-1111-4111-8111-111111111111',
  'https://auth.opes.example/realm/ci','ops-poster-001')->>'journalId')
   <>r->>'journalId'
 THEN RAISE EXCEPTION 'UNKNOWN_RECOVERY_DID_NOT_FIND_COMMIT';END IF;
 BEGIN
  PERFORM opes_core.post_journal(
   '11111111-1111-4111-8111-111111111111',
   '22222222-2222-4222-8222-222222222222',
   'OPES-TEST-LEDGER-001',
   '33333333-3333-4333-8333-333333333333',
   repeat('b',64),
   '[{"accountId":"44444444-4444-4444-8444-444444444444","side":"DEBIT","amountMinor":1000,"currency":"XAF"},
     {"accountId":"55555555-5555-4555-8555-555555555555","side":"CREDIT","amountMinor":1000,"currency":"XAF"}]'::jsonb,
   'https://auth.opes.example/realm/ci','ops-poster-001');
  RAISE EXCEPTION 'IDEMPOTENCY_CONFLICT_ACCEPTED';
 EXCEPTION WHEN unique_violation THEN NULL;
 END;
 BEGIN
  EXECUTE 'INSERT INTO opes_core.audit_event(bank_id,event_id,journal_id,actor_issuer,actor_subject,action) VALUES (gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),''x'',''x'',''LEDGER_POSTED'')';
  RAISE EXCEPTION 'DIRECT_AUDIT_WRITE_PERMITTED';
 EXCEPTION WHEN insufficient_privilege THEN NULL;
 END;
END $test$;
SELECT 'PRODUCTION_LEDGER_BANK_A_EXACT_ONCE_AND_RECOVERY_PASS';
