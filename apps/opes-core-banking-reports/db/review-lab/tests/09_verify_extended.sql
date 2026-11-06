\set ON_ERROR_STOP on
DO $test$ DECLARE r record;
BEGIN
 SELECT * INTO r FROM opes_rpt_review_lab.review_record
 WHERE institution_id='BANK-A' AND report_id='RPT-LED-003';
 IF r.state<>'PENDING_REVIEW' OR r.version<>1
 THEN RAISE EXCEPTION 'CONCURRENT_CAS_RECORD_INVALID';END IF;
 IF (SELECT count(*) FROM opes_rpt_review_lab.review_audit
  WHERE institution_id='BANK-A' AND report_id='RPT-LED-003'
  AND resulting_version=1)<>1
 THEN RAISE EXCEPTION 'CONCURRENT_CAS_DUPLICATE_AUDIT';END IF;
 SELECT * INTO r FROM opes_rpt_review_lab.review_record
 WHERE institution_id='BANK-A' AND report_id='RPT-LED-004';
 IF r.state<>'DRAFT' OR r.version<>0
 THEN RAISE EXCEPTION 'ROLLBACK_NOT_ATOMIC';END IF;
 IF (SELECT count(*) FROM opes_rpt_review_lab.review_audit
  WHERE institution_id='BANK-A' AND report_id='RPT-LED-004')<>0
 THEN RAISE EXCEPTION 'ABORTED_OPERATION_HAS_AUDIT_SIDE_EFFECT';END IF;
END $test$;
SELECT 'PG16_CONCURRENCY_AND_ROLLBACK_DB_ASSERTIONS_PASS';
