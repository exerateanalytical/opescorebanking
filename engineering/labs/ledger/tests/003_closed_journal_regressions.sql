-- OPES LED-LAB-003 adversarial PostgreSQL 16+ integration tests.
-- Disposable synthetic DB only. Requires 001, 002, 003 migration success.
\set ON_ERROR_STOP on
BEGIN;
INSERT INTO ledger_lab.posting_command(command_id,request_digest,state)
 VALUES ('10000000-0000-4000-8000-000000000001',decode(repeat('aa',32),'hex'),'COMMITTED');
INSERT INTO ledger_lab.journal(journal_id,command_id,currency)
 VALUES ('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','XAF');
INSERT INTO ledger_lab.journal_line(journal_id,line_no,account_id,debit_minor,credit_minor)
 VALUES ('20000000-0000-4000-8000-000000000001',1,'30000000-0000-4000-8000-000000000001',1000,0),
        ('20000000-0000-4000-8000-000000000001',2,'30000000-0000-4000-8000-000000000002',0,1000);
INSERT INTO ledger_lab.outbox(event_id,journal_id,event_type,payload)
 VALUES ('40000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001',
         'JournalPosted','{"command_id":"10000000-0000-4000-8000-000000000001"}'::jsonb);
COMMIT;

-- Post-commit line insert cannot reopen posted journal.
DO $test$
BEGIN
 BEGIN
  INSERT INTO ledger_lab.journal_line(journal_id,line_no,account_id,debit_minor)
  VALUES('20000000-0000-4000-8000-000000000001',3,'30000000-0000-4000-8000-000000000001',1000);
  RAISE EXCEPTION 'TEST FAILED: post-commit line insert accepted';
 EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT LIKE 'journal lines may only be inserted in journal creation transaction%' THEN RAISE; END IF;
 END;
END $test$;

-- Post-commit outbox insertion is rejected even before unique journal constraint check.
DO $test$
BEGIN
 BEGIN
  INSERT INTO ledger_lab.outbox(event_id,journal_id,event_type,payload)
  VALUES('40000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000001','JournalPosted','{}'::jsonb);
  RAISE EXCEPTION 'TEST FAILED: late outbox insert accepted';
 EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT LIKE 'journal outbox may only be inserted in journal creation transaction%' THEN RAISE; END IF;
 END;
END $test$;

-- An outbox may be marked delivered once, without mutating its evidence.
UPDATE ledger_lab.outbox SET published_at=created_at+interval '1 second'
 WHERE journal_id='20000000-0000-4000-8000-000000000001';

DO $test$
BEGIN
 BEGIN
  UPDATE ledger_lab.outbox SET payload='{"tampered":true}'::jsonb
  WHERE journal_id='20000000-0000-4000-8000-000000000001';
  RAISE EXCEPTION 'TEST FAILED: outbox payload edit accepted';
 EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT LIKE 'only first outbox published_at transition is permitted%' THEN RAISE; END IF;
 END;
 BEGIN
  DELETE FROM ledger_lab.outbox WHERE journal_id='20000000-0000-4000-8000-000000000001';
  RAISE EXCEPTION 'TEST FAILED: outbox deletion accepted';
 EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT LIKE 'journal outbox deletion forbidden%' THEN RAISE; END IF;
 END;
END $test$;

-- A COMMITTED posting command without any journal cannot survive constraints.
DO $test$
BEGIN
 BEGIN
  INSERT INTO ledger_lab.posting_command(command_id,request_digest,state)
  VALUES('10000000-0000-4000-8000-000000000002',decode(repeat('bb',32),'hex'),'COMMITTED');
  EXECUTE 'SET CONSTRAINTS ALL IMMEDIATE';
  RAISE EXCEPTION 'TEST FAILED: orphan command accepted';
 EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT LIKE 'COMMITTED command % has no exactly-one journal' THEN RAISE; END IF;
 END;
END $test$;

-- A journal with no lines must fail the existing deferred header validation.
DO $test$
BEGIN
 BEGIN
  INSERT INTO ledger_lab.posting_command(command_id,request_digest,state)
  VALUES('10000000-0000-4000-8000-000000000003',decode(repeat('cc',32),'hex'),'COMMITTED');
  INSERT INTO ledger_lab.journal(journal_id,command_id,currency)
  VALUES('20000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000003','XAF');
  INSERT INTO ledger_lab.outbox(event_id,journal_id,event_type,payload)
  VALUES('40000000-0000-4000-8000-000000000003','20000000-0000-4000-8000-000000000003','JournalPosted','{}'::jsonb);
  EXECUTE 'SET CONSTRAINTS ALL IMMEDIATE';
  RAISE EXCEPTION 'TEST FAILED: empty journal accepted';
 EXCEPTION WHEN OTHERS THEN
  IF SQLERRM NOT LIKE 'journal % lacks positive balanced debit/credit lines' THEN RAISE; END IF;
 END;
END $test$;

-- Actual balanced committed journal survived all negative tests.
DO $test$
DECLARE j bigint; l bigint; o bigint;
BEGIN
 SELECT count(*) INTO j FROM ledger_lab.journal;
 SELECT count(*) INTO l FROM ledger_lab.journal_line;
 SELECT count(*) INTO o FROM ledger_lab.outbox;
 IF j<>1 OR l<>2 OR o<>1 THEN
   RAISE EXCEPTION 'TEST FAILED: unexpected journal/line/outbox counts %,%,%',j,l,o;
 END IF;
END $test$;
SELECT 'LED-LAB-003 PG16 integration suite PASS' AS assertion;
