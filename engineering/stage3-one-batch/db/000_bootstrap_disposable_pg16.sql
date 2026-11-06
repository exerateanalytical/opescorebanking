-- Disposable PG16 Stage3 candidate tenancy. Run only against opes_test.
\set ON_ERROR_STOP on
BEGIN;
DO $guard$ BEGIN
 IF current_database()<>'opes_test' OR session_user<>'postgres'
 OR current_setting('server_version_num')::int NOT BETWEEN 160000 AND 169999
 THEN RAISE EXCEPTION 'STAGE3_LAB_ONLY'; END IF;
END $guard$;
CREATE ROLE opes_s3_bank_a_lab LOGIN NOINHERIT NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION PASSWORD 'only_disposable_stage3_bank_a';
CREATE ROLE opes_s3_bank_b_lab LOGIN NOINHERIT NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION PASSWORD 'only_disposable_stage3_bank_b';
CREATE ROLE opes_s3_unbound_lab LOGIN NOINHERIT NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION PASSWORD 'only_disposable_stage3_unbound';
CREATE SCHEMA opes_stage3 AUTHORIZATION postgres;
REVOKE ALL ON SCHEMA opes_stage3 FROM PUBLIC;
CREATE TABLE opes_stage3.institution(
 bank_id uuid PRIMARY KEY, institution_status text NOT NULL
 CHECK(institution_status='LAB_ACTIVE'));
CREATE TABLE opes_stage3.database_binding(
 login_role name PRIMARY KEY, bank_id uuid NOT NULL REFERENCES opes_stage3.institution(bank_id),
 enabled boolean NOT NULL DEFAULT true
);
CREATE FUNCTION opes_stage3.current_bank_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER
SET search_path=pg_catalog,pg_temp AS $func$
 SELECT b.bank_id FROM opes_stage3.database_binding b
 WHERE b.login_role=session_user AND b.enabled=true
 LIMIT 1
$func$;
REVOKE ALL ON FUNCTION opes_stage3.current_bank_id() FROM PUBLIC;
GRANT USAGE ON SCHEMA opes_stage3 TO opes_s3_bank_a_lab,opes_s3_bank_b_lab,opes_s3_unbound_lab;
GRANT EXECUTE ON FUNCTION opes_stage3.current_bank_id() TO opes_s3_bank_a_lab,opes_s3_bank_b_lab,opes_s3_unbound_lab;
REVOKE ALL ON ALL TABLES IN SCHEMA opes_stage3 FROM PUBLIC;
GRANT CONNECT ON DATABASE opes_test TO opes_s3_bank_a_lab,opes_s3_bank_b_lab,opes_s3_unbound_lab;
INSERT INTO opes_stage3.institution VALUES
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','LAB_ACTIVE'),
('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','LAB_ACTIVE');
INSERT INTO opes_stage3.database_binding VALUES
('opes_s3_bank_a_lab','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',true),
('opes_s3_bank_b_lab','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',true);
COMMIT;
