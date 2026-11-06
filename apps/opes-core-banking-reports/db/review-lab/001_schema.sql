-- Disposable PostgreSQL 16 tenant-bound review lab. NOT production.
\set ON_ERROR_STOP on
BEGIN;
DO $guard$ BEGIN
 IF current_database()<>'opes_test' OR current_setting('server_version_num')::int NOT BETWEEN 160000 AND 169999 OR session_user<>'postgres'
 THEN RAISE EXCEPTION 'DISPOSABLE_PG16_LAB_ONLY'; END IF;
END $guard$;
CREATE ROLE opes_rpt_a_maker_lab LOGIN NOINHERIT NOCREATEDB NOCREATEROLE NOSUPERUSER NOREPLICATION PASSWORD 'only_disposable_a_maker';
CREATE ROLE opes_rpt_a_checker_lab LOGIN NOINHERIT NOCREATEDB NOCREATEROLE NOSUPERUSER NOREPLICATION PASSWORD 'only_disposable_a_checker';
CREATE ROLE opes_rpt_b_maker_lab LOGIN NOINHERIT NOCREATEDB NOCREATEROLE NOSUPERUSER NOREPLICATION PASSWORD 'only_disposable_b_maker';
CREATE ROLE opes_rpt_unbound_lab LOGIN NOINHERIT NOCREATEDB NOCREATEROLE NOSUPERUSER NOREPLICATION PASSWORD 'only_disposable_unbound';
CREATE SCHEMA opes_rpt_review_lab AUTHORIZATION postgres;
REVOKE ALL ON SCHEMA opes_rpt_review_lab FROM PUBLIC;
REVOKE ALL ON DATABASE opes_test FROM PUBLIC;
GRANT CONNECT ON DATABASE opes_test TO opes_rpt_a_maker_lab,opes_rpt_a_checker_lab,opes_rpt_b_maker_lab,opes_rpt_unbound_lab;
CREATE TABLE opes_rpt_review_lab.bound_login (
 login_role name PRIMARY KEY, institution_id text NOT NULL, actor_id text NOT NULL,
 active boolean NOT NULL DEFAULT true, may_submit boolean NOT NULL DEFAULT false,
 may_review boolean NOT NULL DEFAULT false, UNIQUE(institution_id,actor_id)
);
CREATE TABLE opes_rpt_review_lab.review_record (
 institution_id text NOT NULL, report_id text NOT NULL CHECK(report_id ~ '^RPT-[A-Z]+-[0-9]{3}$'),
 maker_actor_id text NOT NULL, checker_actor_id text,
 content_digest text NOT NULL CHECK(length(content_digest)>=12),
 version bigint NOT NULL DEFAULT 0 CHECK(version>=0),
 state text NOT NULL DEFAULT 'DRAFT' CHECK(state IN ('DRAFT','PENDING_REVIEW','REVIEWED_NOT_PUBLISHED')),
 updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 PRIMARY KEY(institution_id,report_id),
 CHECK(checker_actor_id IS NULL OR checker_actor_id<>maker_actor_id)
);
CREATE TABLE opes_rpt_review_lab.review_audit (
 event_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 institution_id text NOT NULL, report_id text NOT NULL,
 resulting_version bigint NOT NULL CHECK(resulting_version>0),
 actor_id text NOT NULL,
 event_name text NOT NULL CHECK(event_name IN ('REPORT_REVIEW_SUBMITTED','REPORT_REVIEW_CHECKED')),
 content_digest text NOT NULL, happened_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 UNIQUE(institution_id,report_id,resulting_version)
);
CREATE FUNCTION opes_rpt_review_lab.deny_audit_change()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path=pg_catalog AS $f$
BEGIN RAISE EXCEPTION 'IMMUTABLE_AUDIT_RECORD'; END $f$;
CREATE TRIGGER audit_append_only BEFORE UPDATE OR DELETE OR TRUNCATE
ON opes_rpt_review_lab.review_audit
FOR EACH STATEMENT EXECUTE FUNCTION opes_rpt_review_lab.deny_audit_change();
-- SESSION_USER cannot be overridden by a tenant GUC or caller-supplied bank ID.
CREATE FUNCTION opes_rpt_review_lab.read_review(p_report_id text)
RETURNS TABLE(report_id text,institution_id text,maker_id text,checker_id text,
 content_digest text,version bigint,state text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $f$
DECLARE v_principal record;
BEGIN
 SELECT p.institution_id,p.actor_id INTO v_principal
 FROM opes_rpt_review_lab.bound_login p
 WHERE p.login_role=session_user AND p.active=true;
 IF NOT FOUND THEN RETURN; END IF;
 RETURN QUERY SELECT r.report_id,r.institution_id,r.maker_actor_id,r.checker_actor_id,
 r.content_digest,r.version,r.state
 FROM opes_rpt_review_lab.review_record r
 WHERE r.institution_id=v_principal.institution_id AND r.report_id=p_report_id;
END $f$;
-- CAS, row lock, segregated roles, update and audit happen atomically.
CREATE FUNCTION opes_rpt_review_lab.advance_review(
 p_report_id text,p_expected_version bigint,p_expected_state text,p_content_digest text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $f$
DECLARE v_actor record;v_draft record;v_next text;v_event text;
BEGIN
 SELECT p.institution_id,p.actor_id,p.may_submit,p.may_review INTO v_actor
 FROM opes_rpt_review_lab.bound_login p
 WHERE p.login_role=session_user AND p.active=true;
 IF NOT FOUND THEN RETURN false;END IF;
 SELECT r.* INTO v_draft FROM opes_rpt_review_lab.review_record r
 WHERE r.institution_id=v_actor.institution_id AND r.report_id=p_report_id FOR UPDATE;
 IF NOT FOUND THEN RETURN false;END IF;
 IF v_draft.version<>p_expected_version OR v_draft.state IS DISTINCT FROM p_expected_state
 OR v_draft.content_digest IS DISTINCT FROM p_content_digest THEN RETURN false;END IF;
 IF v_draft.state='DRAFT' AND v_actor.may_submit AND v_actor.actor_id=v_draft.maker_actor_id THEN
  v_next:='PENDING_REVIEW';v_event:='REPORT_REVIEW_SUBMITTED';
 ELSIF v_draft.state='PENDING_REVIEW' AND v_actor.may_review AND v_actor.actor_id<>v_draft.maker_actor_id THEN
  v_next:='REVIEWED_NOT_PUBLISHED';v_event:='REPORT_REVIEW_CHECKED';
 ELSE RETURN false;END IF;
 UPDATE opes_rpt_review_lab.review_record r SET state=v_next,version=r.version+1,
  updated_at=clock_timestamp(),checker_actor_id=CASE WHEN v_next='REVIEWED_NOT_PUBLISHED'
   THEN v_actor.actor_id ELSE r.checker_actor_id END
 WHERE r.institution_id=v_actor.institution_id AND r.report_id=p_report_id;
 INSERT INTO opes_rpt_review_lab.review_audit(
  institution_id,report_id,resulting_version,actor_id,event_name,content_digest)
 VALUES(v_actor.institution_id,p_report_id,v_draft.version+1,v_actor.actor_id,v_event,p_content_digest);
 RETURN true;
END $f$;
INSERT INTO opes_rpt_review_lab.bound_login(
 login_role,institution_id,actor_id,may_submit,may_review) VALUES
 ('opes_rpt_a_maker_lab','BANK-A','A-MAKER',true,false),
 ('opes_rpt_a_checker_lab','BANK-A','A-CHECKER',false,true),
 ('opes_rpt_b_maker_lab','BANK-B','B-MAKER',true,false);
INSERT INTO opes_rpt_review_lab.review_record(institution_id,report_id,maker_actor_id,content_digest)
VALUES('BANK-A','RPT-LED-001','A-MAKER','sha256-SYNTHETIC-A-001'),
 ('BANK-A','RPT-LED-002','A-MAKER','sha256-SYNTHETIC-A-002'),
 ('BANK-B','RPT-LED-001','B-MAKER','sha256-SYNTHETIC-B-001');
-- Preseed conflicting audit resulting version for rollback proof.
INSERT INTO opes_rpt_review_lab.review_audit(
 institution_id,report_id,resulting_version,actor_id,event_name,content_digest)
VALUES('BANK-A','RPT-LED-002',1,'A-MAKER','REPORT_REVIEW_SUBMITTED','sha256-SYNTHETIC-A-002');
REVOKE ALL ON ALL TABLES IN SCHEMA opes_rpt_review_lab FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA opes_rpt_review_lab FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA opes_rpt_review_lab FROM PUBLIC;
GRANT USAGE ON SCHEMA opes_rpt_review_lab TO
 opes_rpt_a_maker_lab,opes_rpt_a_checker_lab,opes_rpt_b_maker_lab,opes_rpt_unbound_lab;
GRANT EXECUTE ON FUNCTION opes_rpt_review_lab.read_review(text) TO
 opes_rpt_a_maker_lab,opes_rpt_a_checker_lab,opes_rpt_b_maker_lab,opes_rpt_unbound_lab;
GRANT EXECUTE ON FUNCTION opes_rpt_review_lab.advance_review(text,bigint,text,text) TO
 opes_rpt_a_maker_lab,opes_rpt_a_checker_lab,opes_rpt_b_maker_lab,opes_rpt_unbound_lab;
COMMIT;
