-- Grant only trusted identity-scope introspection to the checker DB login.
\set ON_ERROR_STOP on
BEGIN;
DO $guard$ BEGIN
 IF current_database()<>'opes_test' OR session_user<>'postgres'
 THEN RAISE EXCEPTION 'DISPOSABLE_PG16_ONLY';END IF;
END $guard$;
GRANT EXECUTE ON FUNCTION opes_stage3.current_bank_id()
 TO opes_s3_bank_a_checker_lab;
COMMIT;
