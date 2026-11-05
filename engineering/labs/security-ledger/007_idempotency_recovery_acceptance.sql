-- SEC-TENANT-ROUTING-001 LAB-007: assertions for disposable LAB-006.
-- Run only after 006_idempotency_recovery_experimental.sql in a fresh PostgreSQL 16 database.
-- This script is NOT YET EXECUTED. It uses a dedicated LOGIN role.
-- Must be run by a database administrator in a disposable instance; no production grants.
\set ON_ERROR_STOP on
BEGIN;
DO $$
BEGIN
 IF to_regclass('sec_idemp_006.operation') IS NULL THEN
  RAISE EXCEPTION 'LAB-006 not installed';
 END IF;
END $$;
COMMIT;
-- Role creation is intentionally explicit: SESSION_USER is checked in LAB-006.
-- The runner must connect as lab006_runner (not SET ROLE) after setup.
DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='lab006_runner') THEN
  CREATE ROLE lab006_runner LOGIN;
 END IF;
END $$;
GRANT USAGE ON SCHEMA sec_idemp_006 TO lab006_runner;
-- LAB-006 uses SELECT ... FOR UPDATE / FOR SHARE, requiring UPDATE privilege.\n-- This broad lab grant is unsafe for production and is confined to disposable DB.\nGRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA sec_idemp_006 TO lab006_runner;
GRANT EXECUTE ON FUNCTION sec_idemp_006.post(uuid,bigint,text,uuid,uuid,uuid,text,jsonb) TO lab006_runner;
INSERT INTO sec_idemp_006.member(member_id,db_principal,revision,state,can_post)
VALUES ('00000000-0000-4000-8000-000000000001','lab006_runner',1,'ACTIVE',true)
ON CONFLICT (member_id) DO UPDATE SET db_principal=EXCLUDED.db_principal,revision=1,state='ACTIVE',can_post=true;
INSERT INTO sec_idemp_006.account(account_id,currency,state) VALUES
('00000000-0000-4000-8000-000000000011','XAF','ACTIVE'),
('00000000-0000-4000-8000-000000000012','XAF','ACTIVE')
ON CONFLICT (account_id) DO UPDATE SET currency='XAF',state='ACTIVE';
-- CONNECT AS lab006_runner and run the assertions below.
-- The following section must be extracted into a separate psql session:
-- psql -U lab006_runner -d <disposable_db> -f 007_idempotency_recovery_assertions_runner.sql
