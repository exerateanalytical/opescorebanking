-- CI-only controlled initial bank provisioning. Production MUST use secure,
-- separately reviewed bank onboarding and independent approval workflow.
\set ON_ERROR_STOP on
BEGIN;
INSERT INTO opes_core.institution(bank_id,legal_name,status) VALUES
 ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','CI BANK A','ACTIVE'),
 ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','CI BANK B','ACTIVE');
INSERT INTO opes_core.bank_principal(login_role,bank_id,enabled,activated_at) VALUES
 ('opes_prodtest_a','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',true,clock_timestamp()),
 ('opes_prodtest_b','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',true,clock_timestamp());
INSERT INTO opes_core.actor_membership(
 bank_id,issuer,subject_id,active,can_post,can_recover,expires_at
) VALUES
 ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'https://auth.opes.example/realm/ci','ops-poster-001',true,true,true,clock_timestamp()+interval '2 hours'),
 ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  'https://auth.opes.example/realm/ci','ops-poster-b',true,true,true,clock_timestamp()+interval '2 hours');
INSERT INTO opes_core.account(bank_id,account_id,account_currency,state) VALUES
 ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '44444444-4444-4444-8444-444444444444','XAF','ACTIVE'),
 ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '55555555-5555-4555-8555-555555555555','XAF','ACTIVE'),
 ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  '66666666-6666-4666-8666-666666666666','XAF','ACTIVE'),
 ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  '77777777-7777-4777-8777-777777777777','XAF','ACTIVE');
INSERT INTO opes_core.accounting_period(
 bank_id,period_id,opening_date,closing_date,state
) VALUES
 ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '33333333-3333-4333-8333-333333333333','2026-01-01','2027-12-31','OPEN'),
 ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  '88888888-8888-4888-8888-888888888888','2026-01-01','2027-12-31','OPEN');
INSERT INTO opes_core.posting_authorization(
 bank_id,authorization_id,command_digest,prepared_by_subject,approved_by_subject,
 approval_evidence_digest,status,expires_at
) VALUES
 ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '22222222-2222-4222-8222-222222222222',
  '9c9f7aaed2b93311f13476f30fed628677d40f0da9f6e63bc6fc750c6fb448bc',
  'ops-maker-001','ops-checker-002',
  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  'APPROVED',clock_timestamp()+interval '2 hours');
COMMIT;
-- Runtime credentials only EXECUTE on three bank-sensitive functions.
GRANT USAGE ON SCHEMA opes_core TO opes_prodtest_a,opes_prodtest_b,opes_prodtest_unbound;
GRANT EXECUTE ON FUNCTION opes_core.current_bank_id()
 TO opes_prodtest_a,opes_prodtest_b,opes_prodtest_unbound;
GRANT EXECUTE ON FUNCTION opes_core.post_journal(uuid,uuid,text,uuid,text,jsonb,text,text)
 TO opes_prodtest_a,opes_prodtest_b,opes_prodtest_unbound;
GRANT EXECUTE ON FUNCTION opes_core.resolve_command(uuid,text,text)
 TO opes_prodtest_a,opes_prodtest_b,opes_prodtest_unbound;
SELECT 'POSTGRESQL_PRODUCTION_SCHEMA_CI_FIXTURE_PROVISIONED';
