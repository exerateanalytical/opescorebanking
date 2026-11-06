-- STAGE 3 TST candidate model. Strictly disposable opes_test/PostgreSQL 16.
-- DOMAIN: Independent test and assurance evidence. NO real bank data, monetary posting or release authorization.
\set ON_ERROR_STOP on
BEGIN;
DO $lab$ BEGIN
 IF current_database()<>'opes_test' OR session_user<>'postgres'
 OR current_setting('server_version_num')::int NOT BETWEEN 160000 AND 169999
 THEN RAISE EXCEPTION 'STAGE3_LAB_ONLY'; END IF;
END $lab$;
CREATE TABLE opes_stage3.tst_candidate (
  bank_id uuid NOT NULL REFERENCES opes_stage3.institution(bank_id),
  aggregate_id uuid NOT NULL,
  version bigint NOT NULL DEFAULT 1 CHECK(version BETWEEN 1 AND 2147483647),
  state text NOT NULL DEFAULT 'DRAFT'
    CHECK(state IN ('DRAFT','PENDING_REVIEW','REVIEWED_NOT_EFFECTIVE','REJECTED')),
  maker_actor uuid NOT NULL,
  checker_actor uuid,
  submission_evidence_id uuid,
  review_evidence_id uuid,
  test_suite_id uuid NOT NULL,
  build_commit_digest char(64) CHECK(build_commit_digest ~ '^[a-f0-9]{64}$') NOT NULL,
  test_type text CHECK(test_type IN ('UNIT','INTEGRATION','SECURITY','RECOVERY','ACCESSIBILITY')) NOT NULL,
  expected_assertion_count integer CHECK(expected_assertion_count BETWEEN 0 AND 1000000) NOT NULL,
  environment_id uuid NOT NULL,
  test_plan_revision text CHECK(length(test_plan_revision) BETWEEN 3 AND 240) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(bank_id,aggregate_id),
  CHECK(checker_actor IS NULL OR checker_actor<>maker_actor),
  CHECK(state NOT IN ('REVIEWED_NOT_EFFECTIVE','REJECTED') OR checker_actor IS NOT NULL)
);
CREATE INDEX tst_candidate_state_idx ON opes_stage3.tst_candidate(bank_id,state,created_at DESC);
ALTER TABLE opes_stage3.tst_candidate ENABLE ROW LEVEL SECURITY;
ALTER TABLE opes_stage3.tst_candidate FORCE ROW LEVEL SECURITY;
CREATE POLICY tst_candidate_bank_read ON opes_stage3.tst_candidate
 FOR SELECT TO opes_s3_bank_a_lab,opes_s3_bank_b_lab,opes_s3_unbound_lab
 USING(bank_id=opes_stage3.current_bank_id());
REVOKE ALL ON opes_stage3.tst_candidate FROM PUBLIC;
GRANT SELECT ON opes_stage3.tst_candidate
 TO opes_s3_bank_a_lab,opes_s3_bank_b_lab,opes_s3_unbound_lab;
COMMENT ON TABLE opes_stage3.tst_candidate IS
 'OPES STAGE3 DRAFT TST: no live funds, approved policy or official filing';
COMMIT;
