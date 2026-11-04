-- Release: physical model proposal, NOT approved migration.
-- Requires institution foreign key, approved row-level security policies,
-- data classification, residency and retention review before use.
CREATE TABLE rel_release_candidate (
  institution_id uuid NOT NULL,
  id uuid NOT NULL,
  aggregate_id uuid ,
  state text NOT NULL,
  version bigint NOT NULL DEFAULT 0 CHECK (version >= 0),
  external_reference text,
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  PRIMARY KEY (institution_id,id),
  CHECK (effective_to IS NULL OR effective_to > effective_from)
);
CREATE INDEX rel_release_candidate_state_idx ON rel_release_candidate(institution_id,state);


CREATE TABLE rel_dor_gate (
  institution_id uuid NOT NULL,
  id uuid NOT NULL,
  aggregate_id uuid NOT NULL,
  state text NOT NULL,
  version bigint NOT NULL DEFAULT 0 CHECK (version >= 0),
  external_reference text,
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  PRIMARY KEY (institution_id,id),
  CHECK (effective_to IS NULL OR effective_to > effective_from)
);
CREATE INDEX rel_dor_gate_state_idx ON rel_dor_gate(institution_id,state);
ALTER TABLE rel_dor_gate ADD CONSTRAINT rel_dor_gate_root_fk FOREIGN KEY(institution_id,aggregate_id) REFERENCES rel_release_candidate(institution_id,id);

CREATE TABLE rel_pilot (
  institution_id uuid NOT NULL,
  id uuid NOT NULL,
  aggregate_id uuid NOT NULL,
  state text NOT NULL,
  version bigint NOT NULL DEFAULT 0 CHECK (version >= 0),
  external_reference text,
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  PRIMARY KEY (institution_id,id),
  CHECK (effective_to IS NULL OR effective_to > effective_from)
);
CREATE INDEX rel_pilot_state_idx ON rel_pilot(institution_id,state);
ALTER TABLE rel_pilot ADD CONSTRAINT rel_pilot_root_fk FOREIGN KEY(institution_id,aggregate_id) REFERENCES rel_release_candidate(institution_id,id);

CREATE TABLE rel_rollback_plan (
  institution_id uuid NOT NULL,
  id uuid NOT NULL,
  aggregate_id uuid NOT NULL,
  state text NOT NULL,
  version bigint NOT NULL DEFAULT 0 CHECK (version >= 0),
  external_reference text,
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  PRIMARY KEY (institution_id,id),
  CHECK (effective_to IS NULL OR effective_to > effective_from)
);
CREATE INDEX rel_rollback_plan_state_idx ON rel_rollback_plan(institution_id,state);
ALTER TABLE rel_rollback_plan ADD CONSTRAINT rel_rollback_plan_root_fk FOREIGN KEY(institution_id,aggregate_id) REFERENCES rel_release_candidate(institution_id,id);

-- Do not deploy as-is: ledger invariants, data-specific columns, access controls,
-- uniqueness semantics and foreign-key lifecycles require module design review.
