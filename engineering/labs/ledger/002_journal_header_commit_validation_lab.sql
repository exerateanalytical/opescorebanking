-- OPES Core Banking / LED — laboratory-only follow-up to 001_immutable_journal_lab.sql
-- Fixes missing deferred validation on header-only journals and missing outbox at commit.
-- This is NOT a complete posting boundary. Apply only in a disposable bank-local lab.
BEGIN;
CREATE FUNCTION ledger_lab.assert_journal_complete() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE n bigint; deb numeric; cred numeric; outbox_n bigint;
BEGIN
 SELECT count(*),COALESCE(sum(debit_minor),0),COALESCE(sum(credit_minor),0)
 INTO n,deb,cred FROM ledger_lab.journal_line WHERE journal_id=NEW.journal_id;
 SELECT count(*) INTO outbox_n FROM ledger_lab.outbox
 WHERE journal_id=NEW.journal_id AND event_type='JournalPosted';
 IF n < 2 OR deb = 0 OR deb <> cred THEN
   RAISE EXCEPTION 'journal % lacks positive balanced debit/credit lines', NEW.journal_id;
 END IF;
 IF outbox_n <> 1 THEN
   RAISE EXCEPTION 'journal % must have exactly one outbox event', NEW.journal_id;
 END IF;
 RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER enforce_header_completeness
 AFTER INSERT ON ledger_lab.journal
 DEFERRABLE INITIALLY DEFERRED FOR EACH ROW
 EXECUTE FUNCTION ledger_lab.assert_journal_complete();
-- Existing 001 deferred line trigger still checks any inserted line's journal at commit.
-- Known unresolved P0: later INSERT of extra balanced lines is not prevented by 001/002.
-- Production requires append-only posting via a privileged atomic function, revocation
-- fence, closed journal state, privilege separation, and cross-session tests.
COMMIT;
