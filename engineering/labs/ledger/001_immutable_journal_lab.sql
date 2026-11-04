-- OPES Core Banking — isolated PostgreSQL ledger laboratory, not production approved
-- Bank-dedicated database only. Migration privileges must not be granted to API principals.
BEGIN;
CREATE SCHEMA IF NOT EXISTS ledger_lab;
CREATE TABLE ledger_lab.posting_command (
 command_id uuid PRIMARY KEY,
 request_digest bytea NOT NULL CHECK (octet_length(request_digest)=32),
 state text NOT NULL CHECK (state='COMMITTED'),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE ledger_lab.journal (
 journal_id uuid PRIMARY KEY,
 command_id uuid NOT NULL UNIQUE REFERENCES ledger_lab.posting_command(command_id),
 currency char(3) NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
 reversal_of uuid REFERENCES ledger_lab.journal(journal_id),
 posted_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE ledger_lab.journal_line (
 journal_id uuid NOT NULL REFERENCES ledger_lab.journal(journal_id),
 line_no integer NOT NULL CHECK (line_no>0),
 account_id uuid NOT NULL,
 debit_minor bigint NOT NULL DEFAULT 0 CHECK (debit_minor>=0),
 credit_minor bigint NOT NULL DEFAULT 0 CHECK (credit_minor>=0),
 PRIMARY KEY(journal_id,line_no),
 CHECK ((debit_minor>0 AND credit_minor=0) OR (credit_minor>0 AND debit_minor=0))
);
CREATE TABLE ledger_lab.outbox (
 event_id uuid PRIMARY KEY,
 journal_id uuid NOT NULL UNIQUE REFERENCES ledger_lab.journal(journal_id),
 event_type text NOT NULL CHECK(event_type='JournalPosted'),
 payload jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 published_at timestamptz
);
CREATE FUNCTION ledger_lab.assert_balanced() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE target uuid; n bigint; deb numeric; cred numeric;
BEGIN
 target := COALESCE(NEW.journal_id,OLD.journal_id);
 SELECT count(*),COALESCE(sum(debit_minor),0),COALESCE(sum(credit_minor),0)
 INTO n,deb,cred FROM ledger_lab.journal_line WHERE journal_id=target;
 IF n<2 OR deb<>cred THEN RAISE EXCEPTION 'unbalanced journal %',target; END IF;
 RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER enforce_balance
 AFTER INSERT OR UPDATE OR DELETE ON ledger_lab.journal_line
 DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION ledger_lab.assert_balanced();
CREATE FUNCTION ledger_lab.reject_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'posted ledger is immutable'; END $$;
CREATE TRIGGER immutable_journal BEFORE UPDATE OR DELETE ON ledger_lab.journal
 FOR EACH ROW EXECUTE FUNCTION ledger_lab.reject_mutation();
CREATE TRIGGER immutable_lines BEFORE UPDATE OR DELETE ON ledger_lab.journal_line
 FOR EACH ROW EXECUTE FUNCTION ledger_lab.reject_mutation();
CREATE TRIGGER immutable_commands BEFORE UPDATE OR DELETE ON ledger_lab.posting_command
 FOR EACH ROW EXECUTE FUNCTION ledger_lab.reject_mutation();
-- LAB LIMITATIONS: no posting API, membership fence, transaction coordinator,
-- privilege hardening, reconciliation, crash tests, or external settlement.
-- No application role grants are created. Never run against production.
COMMIT;
