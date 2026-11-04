-- Governance: physical model proposal, NOT approved migration.
-- Requires institution foreign key, approved row-level security policies,
-- data classification, residency and retention review before use.
CREATE TABLE gov_institution (
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
CREATE INDEX gov_institution_state_idx ON gov_institution(institution_id,state);


CREATE TABLE gov_licence_profile (
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
CREATE INDEX gov_licence_profile_state_idx ON gov_licence_profile(institution_id,state);
ALTER TABLE gov_licence_profile ADD CONSTRAINT gov_licence_profile_root_fk FOREIGN KEY(institution_id,aggregate_id) REFERENCES gov_institution(institution_id,id);

CREATE TABLE gov_policy_version (
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
CREATE INDEX gov_policy_version_state_idx ON gov_policy_version(institution_id,state);
ALTER TABLE gov_policy_version ADD CONSTRAINT gov_policy_version_root_fk FOREIGN KEY(institution_id,aggregate_id) REFERENCES gov_institution(institution_id,id);

CREATE TABLE gov_approval (
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
CREATE INDEX gov_approval_state_idx ON gov_approval(institution_id,state);
ALTER TABLE gov_approval ADD CONSTRAINT gov_approval_root_fk FOREIGN KEY(institution_id,aggregate_id) REFERENCES gov_institution(institution_id,id);

-- Do not deploy as-is: ledger invariants, data-specific columns, access controls,
-- uniqueness semantics and foreign-key lifecycles require module design review.
