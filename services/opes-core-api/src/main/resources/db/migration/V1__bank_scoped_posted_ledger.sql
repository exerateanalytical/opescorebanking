-- OPES Core Banking production-target schema, PostgreSQL 16+.
-- Deploy ONLY with an independently controlled migration identity.
-- No test database guard, sample accounts, default DB roles, fake credentials or auto-seeding.
-- Runtime bank roles must have NOINHERIT, NOBYPASSRLS, no table grants.
CREATE SCHEMA IF NOT EXISTS opes_core;
REVOKE ALL ON SCHEMA opes_core FROM PUBLIC;

CREATE TABLE opes_core.institution (
 bank_id uuid PRIMARY KEY,
 legal_name text NOT NULL CHECK (length(legal_name) BETWEEN 3 AND 240),
 status text NOT NULL CHECK (status IN ('ACTIVE','SUSPENDED')),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE opes_core.bank_principal (
 login_role name PRIMARY KEY, bank_id uuid NOT NULL REFERENCES opes_core.institution(bank_id),
 enabled boolean NOT NULL DEFAULT false,
 activated_at timestamptz,
 disabled_at timestamptz,
 CHECK (NOT enabled OR activated_at IS NOT NULL)
);
REVOKE ALL ON opes_core.bank_principal FROM PUBLIC;
CREATE FUNCTION opes_core.current_bank_id() RETURNS uuid
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp
 AS $$
  SELECT bp.bank_id FROM opes_core.bank_principal bp
  WHERE bp.login_role=session_user AND bp.enabled=true
  LIMIT 1;
 $$;
REVOKE ALL ON FUNCTION opes_core.current_bank_id() FROM PUBLIC;

CREATE TABLE opes_core.actor_membership (
 bank_id uuid NOT NULL REFERENCES opes_core.institution(bank_id),
 issuer text NOT NULL CHECK (issuer LIKE 'https://%'),
 subject_id text NOT NULL CHECK (length(subject_id) BETWEEN 3 AND 240),
 active boolean NOT NULL DEFAULT false,
 can_post boolean NOT NULL DEFAULT false,
 can_recover boolean NOT NULL DEFAULT false,
 expires_at timestamptz NOT NULL,
 revision bigint NOT NULL DEFAULT 1 CHECK (revision > 0),
 PRIMARY KEY (bank_id,issuer,subject_id)
);
CREATE TABLE opes_core.account (
 bank_id uuid NOT NULL REFERENCES opes_core.institution(bank_id),
 account_id uuid NOT NULL,
 account_currency char(3) NOT NULL CHECK (account_currency ~ '^[A-Z]{3}$'),
 state text NOT NULL CHECK (state IN ('ACTIVE','FROZEN','CLOSED')),
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(bank_id,account_id),
 UNIQUE(bank_id,account_id,account_currency)
);
CREATE TABLE opes_core.accounting_period (
 bank_id uuid NOT NULL REFERENCES opes_core.institution(bank_id),
 period_id uuid NOT NULL,
 opening_date date NOT NULL, closing_date date NOT NULL,
 state text NOT NULL CHECK(state IN ('OPEN','CLOSED')),
 PRIMARY KEY(bank_id,period_id),
 CHECK (closing_date>=opening_date)
);
CREATE TABLE opes_core.posting_authorization (
 bank_id uuid NOT NULL REFERENCES opes_core.institution(bank_id),
 authorization_id uuid NOT NULL,
 command_digest char(64) NOT NULL CHECK(command_digest ~ '^[a-f0-9]{64}$'),
 prepared_by_subject text NOT NULL,
 approved_by_subject text NOT NULL,
 approval_evidence_digest char(64) NOT NULL CHECK(approval_evidence_digest ~ '^[a-f0-9]{64}$'),
 status text NOT NULL CHECK(status IN ('APPROVED','REVOKED')),
 expires_at timestamptz NOT NULL,
 consumed_by_journal uuid,
 PRIMARY KEY(bank_id,authorization_id),
 CHECK(prepared_by_subject<>approved_by_subject)
);
CREATE TABLE opes_core.journal (
 bank_id uuid NOT NULL REFERENCES opes_core.institution(bank_id),
 journal_id uuid NOT NULL,
 command_id uuid NOT NULL,
 posting_authorization_id uuid NOT NULL,
 accounting_period_id uuid NOT NULL,
 source_reference text NOT NULL CHECK(length(source_reference) BETWEEN 3 AND 160),
 posted_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 state text NOT NULL DEFAULT 'POSTED' CHECK(state='POSTED'),
 PRIMARY KEY(bank_id,journal_id),
 UNIQUE(bank_id,command_id),
 FOREIGN KEY(bank_id,posting_authorization_id)
   REFERENCES opes_core.posting_authorization(bank_id,authorization_id),
 FOREIGN KEY(bank_id,accounting_period_id)
   REFERENCES opes_core.accounting_period(bank_id,period_id)
);
ALTER TABLE opes_core.posting_authorization
 ADD CONSTRAINT posting_authorization_consumed_fk
 FOREIGN KEY(bank_id,consumed_by_journal)
 REFERENCES opes_core.journal(bank_id,journal_id);
CREATE TABLE opes_core.journal_line (
 bank_id uuid NOT NULL,
 journal_id uuid NOT NULL,
 line_number integer NOT NULL CHECK(line_number BETWEEN 1 AND 500),
 account_id uuid NOT NULL,
 side text NOT NULL CHECK(side IN ('DEBIT','CREDIT')),
 amount_minor bigint NOT NULL CHECK(amount_minor BETWEEN 1 AND 9000000000000000),
 currency char(3) NOT NULL CHECK(currency ~ '^[A-Z]{3}$'),
 PRIMARY KEY(bank_id,journal_id,line_number),
 FOREIGN KEY(bank_id,journal_id) REFERENCES opes_core.journal(bank_id,journal_id),
 FOREIGN KEY(bank_id,account_id,currency)
   REFERENCES opes_core.account(bank_id,account_id,account_currency)
);
CREATE INDEX journal_line_account_lookup ON opes_core.journal_line(bank_id,account_id,journal_id);
CREATE TABLE opes_core.posting_command (
 bank_id uuid NOT NULL,
 command_id uuid NOT NULL,
 request_digest char(64) NOT NULL CHECK(request_digest ~ '^[a-f0-9]{64}$'),
 journal_id uuid NOT NULL,
 posted_by_issuer text NOT NULL,
 posted_by_subject text NOT NULL,
 result_receipt jsonb NOT NULL,
 committed_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 PRIMARY KEY(bank_id,command_id),
 FOREIGN KEY(bank_id,journal_id) REFERENCES opes_core.journal(bank_id,journal_id)
);
CREATE TABLE opes_core.audit_event (
 bank_id uuid NOT NULL,
 event_id uuid NOT NULL,
 journal_id uuid NOT NULL,
 actor_issuer text NOT NULL,
 actor_subject text NOT NULL,
 action text NOT NULL CHECK(action='LEDGER_POSTED'),
 occurred_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 PRIMARY KEY(bank_id,event_id),
 FOREIGN KEY(bank_id,journal_id) REFERENCES opes_core.journal(bank_id,journal_id)
);
CREATE TABLE opes_core.outbox (
 bank_id uuid NOT NULL,
 event_id uuid NOT NULL,
 journal_id uuid NOT NULL,
 event_type text NOT NULL CHECK(event_type='LEDGER_JOURNAL_POSTED_V1'),
 payload jsonb NOT NULL,
 state text NOT NULL DEFAULT 'PENDING' CHECK(state IN ('PENDING','DELIVERED')),
 created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 delivered_at timestamptz,
 PRIMARY KEY(bank_id,event_id),
 FOREIGN KEY(bank_id,journal_id) REFERENCES opes_core.journal(bank_id,journal_id)
);
CREATE INDEX outbox_pending_lookup ON opes_core.outbox(bank_id,created_at) WHERE state='PENDING';

-- Read scopes are bank-bound to immutable PostgreSQL login principal, NEVER client SET app.bank_id.
DO $policies$
DECLARE target text;
BEGIN
 FOREACH target IN ARRAY ARRAY[
 'institution','actor_membership','account','accounting_period',
 'posting_authorization','journal','journal_line','posting_command',
 'audit_event','outbox'
 ] LOOP
  EXECUTE format('ALTER TABLE opes_core.%I ENABLE ROW LEVEL SECURITY',target);
  EXECUTE format('ALTER TABLE opes_core.%I FORCE ROW LEVEL SECURITY',target);
  EXECUTE format(
   'CREATE POLICY %I ON opes_core.%I USING(bank_id=opes_core.current_bank_id()) WITH CHECK(bank_id=opes_core.current_bank_id())',
   'bank_principal_scope_'||target,target);
 END LOOP;
END $policies$;
-- Immutable ledger, audit and command facts: no update/delete, corrections require additive entries.
CREATE FUNCTION opes_core.reject_immutable_change() RETURNS trigger LANGUAGE plpgsql
 SET search_path=pg_catalog,pg_temp AS $$
BEGIN
 RAISE EXCEPTION 'IMMUTABLE_LEDGER_FACT' USING ERRCODE='23514';
END $$;
DO $guard$
DECLARE target text;
BEGIN
 FOREACH target IN ARRAY ARRAY['journal','journal_line','posting_command','audit_event'] LOOP
  EXECUTE format(
    'CREATE TRIGGER %I BEFORE UPDATE OR DELETE ON opes_core.%I FOR EACH ROW EXECUTE FUNCTION opes_core.reject_immutable_change()',
    'immutable_'||target,target);
 END LOOP;
END $guard$;

-- Commit-time invariant: a POSTED journal must contain >=2 distinct accounts,
-- and exactly balanced debits and credits PER currency. Use numeric sums, never float.
CREATE FUNCTION opes_core.assert_posted_journal_balanced() RETURNS trigger
 LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $$
DECLARE count_lines int;distinct_accounts int;
BEGIN
 SELECT count(*),count(DISTINCT account_id) INTO count_lines,distinct_accounts
 FROM opes_core.journal_line
 WHERE bank_id=NEW.bank_id AND journal_id=NEW.journal_id;
 IF count_lines<2 OR distinct_accounts<2 THEN
  RAISE EXCEPTION 'JOURNAL_HAS_INSUFFICIENT_ACCOUNTS' USING ERRCODE='23514';
 END IF;
 IF EXISTS (
  SELECT 1 FROM opes_core.journal_line
  WHERE bank_id=NEW.bank_id AND journal_id=NEW.journal_id
  GROUP BY currency
  HAVING sum(CASE WHEN side='DEBIT' THEN amount_minor::numeric
                  ELSE -amount_minor::numeric END)<>0
 ) THEN
  RAISE EXCEPTION 'UNBALANCED_POSTED_JOURNAL' USING ERRCODE='23514';
 END IF;
 RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER posted_journal_balance_commit
 AFTER INSERT ON opes_core.journal DEFERRABLE INITIALLY DEFERRED
 FOR EACH ROW EXECUTE FUNCTION opes_core.assert_posted_journal_balanced();
REVOKE ALL ON ALL TABLES IN SCHEMA opes_core FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA opes_core FROM PUBLIC;
