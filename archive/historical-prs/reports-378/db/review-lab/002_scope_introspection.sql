-- Lab-only identity introspection. SESSION_USER determines trusted bank scope.
\set ON_ERROR_STOP on
BEGIN;
DO $guard$ BEGIN
 IF current_database()<>'opes_test' OR session_user<>'postgres'
 THEN RAISE EXCEPTION 'DISPOSABLE_LAB_ONLY';END IF;
END $guard$;
CREATE FUNCTION opes_rpt_review_lab.session_scope()
RETURNS TABLE(institution_id text,actor_id text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $f$
BEGIN
 RETURN QUERY SELECT p.institution_id,p.actor_id
 FROM opes_rpt_review_lab.bound_login p
 WHERE p.login_role=session_user AND p.active=true;
END $f$;
REVOKE ALL ON FUNCTION opes_rpt_review_lab.session_scope() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION opes_rpt_review_lab.session_scope() TO
 opes_rpt_a_maker_lab,opes_rpt_a_checker_lab,
 opes_rpt_b_maker_lab,opes_rpt_unbound_lab;
COMMIT;
