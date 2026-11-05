-- SEC-TENANT-ROUTING-001; PostgreSQL 16 disposable test, NOT EXECUTED.
\set ON_ERROR_STOP on
BEGIN;
DO $$
DECLARE
 member_id uuid:='00000000-0000-4000-8000-000000000001';
 lines jsonb:='[{"account_id":"00000000-0000-4000-8000-000000000011","debit_minor":500,"credit_minor":0},{"account_id":"00000000-0000-4000-8000-000000000012","debit_minor":0,"credit_minor":500}]'::jsonb;
 original uuid; replay uuid; opcount bigint; outcount bigint;
BEGIN
 IF SESSION_USER <> 'lab006_runner' THEN RAISE EXCEPTION 'wrong SESSION_USER'; END IF;
 original:=sec_idemp_006.post(member_id,1,'LAB007-REPLAY-001',
  '00000000-0000-4000-8000-000000000021',
  '00000000-0000-4000-8000-000000000022',
  '00000000-0000-4000-8000-000000000023','XAF',lines);
 replay:=sec_idemp_006.post(member_id,1,'LAB007-REPLAY-001',
  '00000000-0000-4000-8000-000000000031',
  '00000000-0000-4000-8000-000000000032',
  '00000000-0000-4000-8000-000000000033','XAF',lines);
 IF replay IS DISTINCT FROM original THEN RAISE EXCEPTION 'P0 duplicate journal'; END IF;
 SELECT count(*) INTO opcount FROM sec_idemp_006.operation WHERE idempotency_key='LAB007-REPLAY-001';
 SELECT count(*) INTO outcount FROM sec_idemp_006.outbox WHERE journal_id=original;
 IF opcount<>1 OR outcount<>1 THEN RAISE EXCEPTION 'P0 duplicate operation/outbox'; END IF;
 BEGIN
  PERFORM sec_idemp_006.post(member_id,1,'LAB007-REPLAY-001',
  '00000000-0000-4000-8000-000000000041',
  '00000000-0000-4000-8000-000000000042',
  '00000000-0000-4000-8000-000000000043','XAF',
  '[{"account_id":"00000000-0000-4000-8000-000000000011","debit_minor":501,"credit_minor":0},{"account_id":"00000000-0000-4000-8000-000000000012","debit_minor":0,"credit_minor":501}]'::jsonb);
  RAISE EXCEPTION 'P0 changed economic command accepted';
 EXCEPTION WHEN OTHERS THEN
  IF SQLERRM='P0 changed economic command accepted' THEN RAISE; END IF;
  IF SQLERRM NOT LIKE '%idempotency conflict%' THEN RAISE; END IF;
 END;
 IF (SELECT sum(debit_minor-credit_minor) FROM sec_idemp_006.line WHERE journal_id=original)<>0 THEN
  RAISE EXCEPTION 'P0 unbalanced journal';
 END IF;
 RAISE NOTICE 'LAB007 A01/A02 PASS inside rollback-only transaction';
END $$;
ROLLBACK;
-- This intentionally tests only in-transaction semantics. A COMMIT-durable
-- recovery test must use two separate connections and committed transactions.
-- Not evidence for C4 postcommit worker crash, C6 outbox dedupe, OIDC, or concurrency.
