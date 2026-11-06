\set ON_ERROR_STOP on
DO $test$ DECLARE v record;
BEGIN
 SELECT * INTO v FROM opes_rpt_review_lab.review_record
 WHERE institution_id='BANK-A' AND report_id='RPT-LED-001';
 IF v.version<>2 OR v.state<>'REVIEWED_NOT_PUBLISHED' OR v.maker_actor_id=v.checker_actor_id
 THEN RAISE EXCEPTION 'BAD_FINAL_STATE';END IF;
 IF (SELECT count(*) FROM opes_rpt_review_lab.review_audit
 WHERE institution_id='BANK-A' AND report_id='RPT-LED-001')<>2
 THEN RAISE EXCEPTION 'MISSING_OR_DUPLICATE_DURABLE_AUDIT';END IF;
 IF (SELECT count(*) FROM opes_rpt_review_lab.review_record
 WHERE institution_id='BANK-A' AND report_id='RPT-LED-002' AND version=0 AND state='DRAFT')<>1
 THEN RAISE EXCEPTION 'AUDIT_ROLLBACK_FAILED';END IF;
 IF (SELECT count(*) FROM opes_rpt_review_lab.review_record
 WHERE institution_id='BANK-B' AND report_id='RPT-LED-001' AND version=0 AND state='DRAFT')<>1
 THEN RAISE EXCEPTION 'CROSS_BANK_LEAK_OR_TRANSITION';END IF;
 IF (SELECT count(*) FROM opes_rpt_review_lab.review_audit
 WHERE institution_id='BANK-A' AND report_id='RPT-LED-002' AND resulting_version=1)<>1
 THEN RAISE EXCEPTION 'DUPLICATE_AUDIT_ON_CONFLICT';END IF;
 BEGIN
  DELETE FROM opes_rpt_review_lab.review_audit WHERE institution_id='BANK-A';
  RAISE EXCEPTION 'AUDIT_WAS_MUTABLE';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM<>'IMMUTABLE_AUDIT_RECORD' THEN RAISE;END IF;
 END;
END $test$;
SELECT 'PG16_DURABLE_REVIEW_EVIDENCE_PASS';
