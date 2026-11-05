-- SEC/LED-LAB-004 PostgreSQL integration checks (synthetic, disposable bank database).
\set ON_ERROR_STOP on
CREATE ROLE opes_bank_a_lab LOGIN;
CREATE ROLE opes_bank_b_lab LOGIN;
GRANT USAGE ON SCHEMA ledger_lab TO opes_bank_a_lab,opes_bank_b_lab;
GRANT EXECUTE ON FUNCTION ledger_lab.post_synthetic_bank_journal(uuid,bigint,uuid,text,uuid,uuid,text,jsonb)
 TO opes_bank_a_lab,opes_bank_b_lab;
INSERT INTO ledger_lab.member_authority
 (membership_id,subject_digest,db_principal,revision,state,can_post)
 VALUES
 ('50000000-0000-4000-8000-000000000001',decode(repeat('ab',32),'hex'),'opes_bank_a_lab',1,'ACTIVE',true),
 ('50000000-0000-4000-8000-000000000002',decode(repeat('cd',32),'hex'),'opes_bank_b_lab',1,'ACTIVE',false);
INSERT INTO ledger_lab.ledger_account(account_id,currency,state)
 VALUES('30000000-0000-4000-8000-000000000001','XAF','ACTIVE'),
       ('30000000-0000-4000-8000-000000000002','XAF','ACTIVE');

-- The helper executes dynamic SQL with INVOKER privileges; never used in production.
CREATE FUNCTION pg_temp.expect_rejected(p_sql text,p_pattern text)
RETURNS void LANGUAGE plpgsql SECURITY INVOKER AS $fn$
BEGIN
 BEGIN
  EXECUTE p_sql;
  RAISE EXCEPTION 'TEST FAILURE: expected rejection not observed';
 EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT LIKE p_pattern THEN RAISE; END IF;
 END;
END $fn$;

SET SESSION AUTHORIZATION opes_bank_a_lab;
-- A complete, balanced posting becomes durable in the same statement transaction.
SELECT ledger_lab.post_synthetic_bank_journal(
 '50000000-0000-4000-8000-000000000001',1,
 '60000000-0000-4000-8000-000000000001','command-key-0001',
 '70000000-0000-4000-8000-000000000001',
 '80000000-0000-4000-8000-000000000001','XAF',
 '[{"account_id":"30000000-0000-4000-8000-000000000001","debit_minor":1000,"credit_minor":0},
   {"account_id":"30000000-0000-4000-8000-000000000002","debit_minor":0,"credit_minor":1000}]'::jsonb);

-- Exact replay of command and digest returns the same journal, not extra money.
SELECT ledger_lab.post_synthetic_bank_journal(
 '50000000-0000-4000-8000-000000000001',1,
 '60000000-0000-4000-8000-000000000001','command-key-0001',
 '70000000-0000-4000-8000-000000000001',
 '80000000-0000-4000-8000-000000000001','XAF',
 '[{"account_id":"30000000-0000-4000-8000-000000000001","debit_minor":1000,"credit_minor":0},
   {"account_id":"30000000-0000-4000-8000-000000000002","debit_minor":0,"credit_minor":1000}]'::jsonb);

-- A bank login cannot mutate tables directly.
SELECT pg_temp.expect_rejected(
 'INSERT INTO ledger_lab.ledger_account(account_id,currency,state)
 VALUES(''30000000-0000-4000-8000-000000000099'',''XAF'',''ACTIVE'')',
 'permission denied%');

-- Repeating command ID with changed financial payload is rejected.
SELECT pg_temp.expect_rejected(
 $$SELECT ledger_lab.post_synthetic_bank_journal(
 '50000000-0000-4000-8000-000000000001',1,
 '60000000-0000-4000-8000-000000000001','command-key-0001',
 '70000000-0000-4000-8000-000000000001',
 '80000000-0000-4000-8000-000000000002','XAF',
 '[{"account_id":"30000000-0000-4000-8000-000000000001","debit_minor":2000,"credit_minor":0},
   {"account_id":"30000000-0000-4000-8000-000000000002","debit_minor":0,"credit_minor":2000}]'::jsonb)$$,
 'financial command idempotency conflict%');

-- Incorrect revision, unbalanced amount and wrong-currency account are denied.
SELECT pg_temp.expect_rejected(
 $$SELECT ledger_lab.post_synthetic_bank_journal(
 '50000000-0000-4000-8000-000000000001',2,
 '60000000-0000-4000-8000-000000000002','command-key-0002',
 '70000000-0000-4000-8000-000000000002',
 '80000000-0000-4000-8000-000000000002','XAF',
 '[{"account_id":"30000000-0000-4000-8000-000000000001","debit_minor":1000,"credit_minor":0},
   {"account_id":"30000000-0000-4000-8000-000000000002","debit_minor":0,"credit_minor":1000}]'::jsonb)$$,
 'bank-local member authorization denied%');

SELECT pg_temp.expect_rejected(
 $$SELECT ledger_lab.post_synthetic_bank_journal(
 '50000000-0000-4000-8000-000000000001',1,
 '60000000-0000-4000-8000-000000000003','command-key-0003',
 '70000000-0000-4000-8000-000000000003',
 '80000000-0000-4000-8000-000000000003','XAF',
 '[{"account_id":"30000000-0000-4000-8000-000000000001","debit_minor":1000,"credit_minor":0},
   {"account_id":"30000000-0000-4000-8000-000000000002","debit_minor":0,"credit_minor":999}]'::jsonb)$$,
 'unbalanced or zero journal%');

SELECT pg_temp.expect_rejected(
 $$SELECT ledger_lab.post_synthetic_bank_journal(
 '50000000-0000-4000-8000-000000000001',1,
 '60000000-0000-4000-8000-000000000004','command-key-0004',
 '70000000-0000-4000-8000-000000000004',
 '80000000-0000-4000-8000-000000000004','USD',
 '[{"account_id":"30000000-0000-4000-8000-000000000001","debit_minor":1000,"credit_minor":0},
   {"account_id":"30000000-0000-4000-8000-000000000002","debit_minor":0,"credit_minor":1000}]'::jsonb)$$,
 'inactive, missing or wrong-currency ledger account%');
RESET SESSION AUTHORIZATION;

SET SESSION AUTHORIZATION opes_bank_b_lab;
SELECT pg_temp.expect_rejected(
 $$SELECT ledger_lab.post_synthetic_bank_journal(
 '50000000-0000-4000-8000-000000000001',1,
 '60000000-0000-4000-8000-000000000005','command-key-0005',
 '70000000-0000-4000-8000-000000000005',
 '80000000-0000-4000-8000-000000000005','XAF',
 '[{"account_id":"30000000-0000-4000-8000-000000000001","debit_minor":1000,"credit_minor":0},
   {"account_id":"30000000-0000-4000-8000-000000000002","debit_minor":0,"credit_minor":1000}]'::jsonb)$$,
 'bank-local member authorization denied%');
RESET SESSION AUTHORIZATION;

-- Synthetic authority revocation uses same membership row updated under a lock.
-- Production maker/checker, issuer propagation, and failover remain UNIMPLEMENTED.
UPDATE ledger_lab.member_authority SET state='REVOKED', revision=revision+1,revoked_at=now()
WHERE membership_id='50000000-0000-4000-8000-000000000001';
SET SESSION AUTHORIZATION opes_bank_a_lab;
SELECT pg_temp.expect_rejected(
 $$SELECT ledger_lab.post_synthetic_bank_journal(
 '50000000-0000-4000-8000-000000000001',1,
 '60000000-0000-4000-8000-000000000006','command-key-0006',
 '70000000-0000-4000-8000-000000000006',
 '80000000-0000-4000-8000-000000000006','XAF',
 '[{"account_id":"30000000-0000-4000-8000-000000000001","debit_minor":1000,"credit_minor":0},
   {"account_id":"30000000-0000-4000-8000-000000000002","debit_minor":0,"credit_minor":1000}]'::jsonb)$$,
 'bank-local member authorization denied%');
RESET SESSION AUTHORIZATION;

DO $assert$
DECLARE c bigint; j bigint; l bigint; o bigint; tot_d numeric; tot_c numeric;
BEGIN
 SELECT count(*) INTO c FROM ledger_lab.posting_command;
 SELECT count(*) INTO j FROM ledger_lab.journal;
 SELECT count(*) INTO l FROM ledger_lab.journal_line;
 SELECT count(*) INTO o FROM ledger_lab.outbox;
 SELECT sum(debit_minor),sum(credit_minor) INTO tot_d,tot_c FROM ledger_lab.journal_line;
 IF c<>1 OR j<>1 OR l<>2 OR o<>1 OR tot_d<>1000 OR tot_c<>1000 THEN
   RAISE EXCEPTION 'LAB FAILED: unexpected rows or totals c% j% l% o% d% cr%',c,j,l,o,tot_d,tot_c;
 END IF;
END $assert$;
SELECT 'SEC-LED-LAB-004 PostgreSQL integration suite PASS' AS assertion;
