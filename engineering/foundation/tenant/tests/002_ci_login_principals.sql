-- ONLY FOR GITHUB CI. Synthetic credentials and institutions, never production.
DO $$ BEGIN
  IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='opes_bank_a_test') THEN
    CREATE ROLE opes_bank_a_test LOGIN INHERIT NOBYPASSRLS PASSWORD 'only_testing_bank_a';
  END IF;
  IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='opes_bank_b_test') THEN
    CREATE ROLE opes_bank_b_test LOGIN INHERIT NOBYPASSRLS PASSWORD 'only_testing_bank_b';
  END IF;
  IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='opes_unbound_test') THEN
    CREATE ROLE opes_unbound_test LOGIN INHERIT NOBYPASSRLS PASSWORD 'only_testing_unbound';
  END IF;
END $$;
GRANT opes_foundation_runtime TO opes_bank_a_test;
GRANT opes_foundation_runtime TO opes_bank_b_test;
GRANT opes_foundation_runtime TO opes_unbound_test;
INSERT INTO opes_tenant.database_login_binding(login_name,institution_id)
VALUES
('opes_bank_a_test','11111111-1111-4111-8111-111111111111'),
('opes_bank_b_test','22222222-2222-4222-8222-222222222222');
