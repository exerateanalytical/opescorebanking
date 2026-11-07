\set ON_ERROR_STOP on
-- Application-to-database test fixture; isolated in disposable opes_test.
DO $guard$ BEGIN
 IF current_database()<>'opes_test' OR session_user<>'postgres' THEN
  RAISE EXCEPTION 'DISPOSABLE_LAB_ONLY';
 END IF;
END $guard$;
INSERT INTO opes_rpt_review_lab.review_record(
 institution_id,report_id,maker_actor_id,content_digest
) VALUES('BANK-A','RPT-LED-005','A-MAKER','sha256-SYNTHETIC-APP-005');
