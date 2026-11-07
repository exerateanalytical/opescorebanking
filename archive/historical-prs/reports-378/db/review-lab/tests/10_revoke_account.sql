\set ON_ERROR_STOP on
UPDATE opes_rpt_review_lab.bound_login
SET active=false WHERE login_role='opes_rpt_a_maker_lab';
DO $test$ BEGIN
 IF (SELECT active FROM opes_rpt_review_lab.bound_login
 WHERE login_role='opes_rpt_a_maker_lab') IS DISTINCT FROM false
 THEN RAISE EXCEPTION 'REVOCATION_NOT_PERSISTED';END IF;
END $test$;
SELECT 'PG16_LAB_PRINCIPAL_REVOKED';
