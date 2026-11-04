-- OPES Core Banking proposed PostgreSQL core contract. NOT production migration.
-- Each institution requires approved isolation and regulator-reviewed tenancy model.
CREATE TABLE institution (
  institution_id uuid PRIMARY KEY,
  legal_name text NOT NULL,
  jurisdiction_code char(2) NOT NULL,
  licence_profile text NOT NULL,
  lifecycle_state text NOT NULL CHECK (lifecycle_state IN ('DRAFT','APPROVED','ACTIVE','SUSPENDED')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE financial_journal (
  institution_id uuid NOT NULL REFERENCES institution(institution_id),
  journal_id uuid NOT NULL,
  command_id uuid NOT NULL,
  currency_code char(3) NOT NULL,
  state text NOT NULL CHECK (state IN ('PROPOSED','POSTED','REVERSED')),
  posting_rule_version text NOT NULL,
  effective_at timestamptz NOT NULL,
  posted_at timestamptz,
  reversal_of uuid,
  PRIMARY KEY(institution_id,journal_id),
  UNIQUE(institution_id,command_id),
  FOREIGN KEY(institution_id,reversal_of) REFERENCES financial_journal(institution_id,journal_id)
);
CREATE TABLE financial_journal_line (
  institution_id uuid NOT NULL,
  journal_id uuid NOT NULL,
  line_no integer NOT NULL CHECK (line_no > 0),
  chart_account_id uuid NOT NULL,
  side text NOT NULL CHECK (side IN ('DEBIT','CREDIT')),
  amount numeric(38,9) NOT NULL CHECK (amount > 0),
  currency_code char(3) NOT NULL,
  PRIMARY KEY(institution_id,journal_id,line_no),
  FOREIGN KEY(institution_id,journal_id) REFERENCES financial_journal(institution_id,journal_id)
);
CREATE TABLE operation_dedup (
  institution_id uuid NOT NULL REFERENCES institution(institution_id),
  idempotency_key text NOT NULL,
  request_sha256 char(64) NOT NULL,
  operation_id uuid NOT NULL,
  state text NOT NULL,
  response_snapshot jsonb,
  PRIMARY KEY(institution_id,idempotency_key)
);
CREATE TABLE domain_outbox (
  institution_id uuid NOT NULL REFERENCES institution(institution_id),
  event_id uuid NOT NULL,
  aggregate_id uuid NOT NULL,
  aggregate_version bigint NOT NULL,
  schema_name text NOT NULL,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  PRIMARY KEY(institution_id,event_id)
);
CREATE TABLE domain_inbox (
  institution_id uuid NOT NULL REFERENCES institution(institution_id),
  consumer_name text NOT NULL,
  event_id uuid NOT NULL,
  processed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(institution_id,consumer_name,event_id)
);
-- CRITICAL: SQL CHECK constraints above do NOT enforce balanced journals.
-- Posting must be in one serializable transaction with a deferred database-side
-- balance guard, lock-protected period status, per-currency totals and immutable
-- posted-line protection; those functions/triggers require review and are NOT provided here.
-- RLS is NOT enabled here: deploying this DDL as-is is unsafe. Design-only.
