-- Interoperability: physical model proposal, NOT approved migration.
-- Requires institution foreign key, approved row-level security policies,
-- data classification, residency and retention review before use.
CREATE TABLE api_adapter (
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
CREATE INDEX api_adapter_state_idx ON api_adapter(institution_id,state);


CREATE TABLE api_integration_contract (
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
CREATE INDEX api_integration_contract_state_idx ON api_integration_contract(institution_id,state);
ALTER TABLE api_integration_contract ADD CONSTRAINT api_integration_contract_root_fk FOREIGN KEY(institution_id,aggregate_id) REFERENCES api_adapter(institution_id,id);

CREATE TABLE api_credential_reference (
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
CREATE INDEX api_credential_reference_state_idx ON api_credential_reference(institution_id,state);
ALTER TABLE api_credential_reference ADD CONSTRAINT api_credential_reference_root_fk FOREIGN KEY(institution_id,aggregate_id) REFERENCES api_adapter(institution_id,id);

CREATE TABLE api_delivery_attempt (
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
CREATE INDEX api_delivery_attempt_state_idx ON api_delivery_attempt(institution_id,state);
ALTER TABLE api_delivery_attempt ADD CONSTRAINT api_delivery_attempt_root_fk FOREIGN KEY(institution_id,aggregate_id) REFERENCES api_adapter(institution_id,id);

-- Do not deploy as-is: ledger invariants, data-specific columns, access controls,
-- uniqueness semantics and foreign-key lifecycles require module design review.
