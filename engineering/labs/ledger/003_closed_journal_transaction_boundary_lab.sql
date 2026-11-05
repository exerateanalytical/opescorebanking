-- OPES LED-LAB-003. Disposable PostgreSQL 16+ bank-local laboratory ONLY.
-- Follow 001_immutable_journal_lab.sql then 002_journal_header_commit_validation_lab.sql.
-- Enforces that line/outbox INSERTs occur only in the journal's creating transaction.
-- No production authorization, principal fencing, or real-money approval is implied.
BEGIN;
DO $block$
BEGIN
 IF EXISTS (SELECT 1 FROM ledger_lab.posting_command)
    OR EXISTS (SELECT 1 FROM ledger_lab.journal)
    OR EXISTS (SELECT 1 FROM ledger_lab.journal_line)
    OR EXISTS (SELECT 1 FROM ledger_lab.outbox) THEN
   RAISE EXCEPTION 'LED-LAB-003 requires a fresh disposable empty ledger_lab; no backfill allowed';
 END IF;
END
$block$;

-- xid8 is the top-level transaction identifier (not a security principal).
ALTER TABLE ledger_lab.journal
  ADD COLUMN creating_xid xid8 NOT NULL DEFAULT pg_current_xact_id();

CREATE FUNCTION ledger_lab.require_creation_xid_for_line()
RETURNS trigger LANGUAGE plpgsql SET search_path = pg_catalog, ledger_lab AS $fn$
DECLARE original_xid xid8;
BEGIN
 SELECT j.creating_xid INTO original_xid
 FROM ledger_lab.journal AS j
 -- The immutable header was created in THIS transaction; XID is the guard.
 WHERE j.journal_id = NEW.journal_id;
 IF NOT FOUND OR original_xid IS DISTINCT FROM pg_current_xact_id() THEN
   RAISE EXCEPTION 'journal lines may only be inserted in journal creation transaction';
 END IF;
 RETURN NEW;
END
$fn$;
CREATE TRIGGER guard_journal_line_insert
 BEFORE INSERT ON ledger_lab.journal_line
 FOR EACH ROW EXECUTE FUNCTION ledger_lab.require_creation_xid_for_line();

CREATE FUNCTION ledger_lab.require_creation_xid_for_outbox()
RETURNS trigger LANGUAGE plpgsql SET search_path = pg_catalog, ledger_lab AS $fn$
DECLARE original_xid xid8;
BEGIN
 SELECT j.creating_xid INTO original_xid
 FROM ledger_lab.journal AS j
 -- The immutable header was created in THIS transaction; XID is the guard.
 WHERE j.journal_id = NEW.journal_id;
 IF NOT FOUND OR original_xid IS DISTINCT FROM pg_current_xact_id() THEN
   RAISE EXCEPTION 'journal outbox may only be inserted in journal creation transaction';
 END IF;
 RETURN NEW;
END
$fn$;
CREATE TRIGGER guard_journal_outbox_insert
 BEFORE INSERT ON ledger_lab.outbox
 FOR EACH ROW EXECUTE FUNCTION ledger_lab.require_creation_xid_for_outbox();

CREATE FUNCTION ledger_lab.guard_outbox_mutation()
RETURNS trigger LANGUAGE plpgsql SET search_path = pg_catalog, ledger_lab AS $fn$
BEGIN
 IF TG_OP = 'DELETE' THEN
   RAISE EXCEPTION 'journal outbox deletion forbidden';
 END IF;
 IF ROW(NEW.event_id, NEW.journal_id, NEW.event_type, NEW.payload, NEW.created_at)
    IS DISTINCT FROM
    ROW(OLD.event_id, OLD.journal_id, OLD.event_type, OLD.payload, OLD.created_at)
    OR OLD.published_at IS NOT NULL
    OR NEW.published_at IS NULL
    OR NEW.published_at < OLD.created_at THEN
   RAISE EXCEPTION 'only first outbox published_at transition is permitted';
 END IF;
 RETURN NEW;
END
$fn$;
CREATE TRIGGER guard_outbox_updates
 BEFORE UPDATE OR DELETE ON ledger_lab.outbox
 FOR EACH ROW EXECUTE FUNCTION ledger_lab.guard_outbox_mutation();

CREATE FUNCTION ledger_lab.assert_command_has_journal()
RETURNS trigger LANGUAGE plpgsql SET search_path = pg_catalog, ledger_lab AS $fn$
DECLARE journal_count bigint;
BEGIN
 SELECT count(*) INTO journal_count
 FROM ledger_lab.journal AS j WHERE j.command_id = NEW.command_id;
 IF journal_count <> 1 THEN
   RAISE EXCEPTION 'COMMITTED command % has no exactly-one journal', NEW.command_id;
 END IF;
 RETURN NULL;
END
$fn$;
CREATE CONSTRAINT TRIGGER enforce_command_has_journal
 AFTER INSERT ON ledger_lab.posting_command
 DEFERRABLE INITIALLY DEFERRED FOR EACH ROW
 EXECUTE FUNCTION ledger_lab.assert_command_has_journal();

-- Least-privilege defaults; do not grant application DML to these tables.
-- Table owner and superuser bypass/control risk is not solved in this lab.
REVOKE ALL ON ALL TABLES IN SCHEMA ledger_lab FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA ledger_lab FROM PUBLIC;
COMMIT;
