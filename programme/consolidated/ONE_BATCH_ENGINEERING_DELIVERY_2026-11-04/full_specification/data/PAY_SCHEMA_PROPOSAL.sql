-- Payments and Settlement: physical model proposal, NOT approved migration.
-- Requires institution foreign key, approved row-level security policies,
-- data classification, residency and retention review before use.
CREATE TABLE pay_payment_intent (
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
CREATE INDEX pay_payment_intent_state_idx ON pay_payment_intent(institution_id,state);


CREATE TABLE pay_payment_attempt (
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
CREATE INDEX pay_payment_attempt_state_idx ON pay_payment_attempt(institution_id,state);
ALTER TABLE pay_payment_attempt ADD CONSTRAINT pay_payment_attempt_root_fk FOREIGN KEY(institution_id,aggregate_id) REFERENCES pay_payment_intent(institution_id,id);

CREATE TABLE pay_rail_receipt (
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
CREATE INDEX pay_rail_receipt_state_idx ON pay_rail_receipt(institution_id,state);
ALTER TABLE pay_rail_receipt ADD CONSTRAINT pay_rail_receipt_root_fk FOREIGN KEY(institution_id,aggregate_id) REFERENCES pay_payment_intent(institution_id,id);

CREATE TABLE pay_settlement_record (
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
CREATE INDEX pay_settlement_record_state_idx ON pay_settlement_record(institution_id,state);
ALTER TABLE pay_settlement_record ADD CONSTRAINT pay_settlement_record_root_fk FOREIGN KEY(institution_id,aggregate_id) REFERENCES pay_payment_intent(institution_id,id);

-- Do not deploy as-is: ledger invariants, data-specific columns, access controls,
-- uniqueness semantics and foreign-key lifecycles require module design review.
