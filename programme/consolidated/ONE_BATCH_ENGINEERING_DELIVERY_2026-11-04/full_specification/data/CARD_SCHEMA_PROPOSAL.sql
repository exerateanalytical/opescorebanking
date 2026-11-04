-- Cards: physical model proposal, NOT approved migration.
-- Requires institution foreign key, approved row-level security policies,
-- data classification, residency and retention review before use.
CREATE TABLE card_card_token (
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
CREATE INDEX card_card_token_state_idx ON card_card_token(institution_id,state);


CREATE TABLE card_authorization (
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
CREATE INDEX card_authorization_state_idx ON card_authorization(institution_id,state);
ALTER TABLE card_authorization ADD CONSTRAINT card_authorization_root_fk FOREIGN KEY(institution_id,aggregate_id) REFERENCES card_card_token(institution_id,id);

CREATE TABLE card_presentment (
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
CREATE INDEX card_presentment_state_idx ON card_presentment(institution_id,state);
ALTER TABLE card_presentment ADD CONSTRAINT card_presentment_root_fk FOREIGN KEY(institution_id,aggregate_id) REFERENCES card_card_token(institution_id,id);

CREATE TABLE card_dispute (
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
CREATE INDEX card_dispute_state_idx ON card_dispute(institution_id,state);
ALTER TABLE card_dispute ADD CONSTRAINT card_dispute_root_fk FOREIGN KEY(institution_id,aggregate_id) REFERENCES card_card_token(institution_id,id);

-- Do not deploy as-is: ledger invariants, data-specific columns, access controls,
-- uniqueness semantics and foreign-key lifecycles require module design review.
