-- Enforce the economic digest at the database boundary, independently of the
-- Java API. Prevent a compromised bank-scoped SQL client from substituting
-- journal lines while presenting an unrelated approval/request hash.
CREATE FUNCTION opes_core.verify_posted_command_digest()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path=pg_catalog,pg_temp AS $$
DECLARE journal_row record;line_row record;canonical text;v text;line_count integer;
BEGIN
 SELECT journal_id,posting_authorization_id,accounting_period_id,source_reference
 INTO journal_row FROM opes_core.journal
 WHERE bank_id=NEW.bank_id AND journal_id=NEW.journal_id;
 IF NOT FOUND THEN
  RAISE EXCEPTION 'JOURNAL_NOT_FOUND' USING ERRCODE='23514';
 END IF;
 canonical='OPES-LEDGER-REQUEST-v1'||chr(10);
 FOREACH v IN ARRAY ARRAY[
  NEW.bank_id::text,NEW.command_id::text,
  journal_row.posting_authorization_id::text,
  journal_row.source_reference,journal_row.accounting_period_id::text
 ] LOOP
  canonical=canonical||length(v)::text||':'||v||chr(10);
 END LOOP;
 SELECT count(*) INTO line_count FROM opes_core.journal_line
 WHERE bank_id=NEW.bank_id AND journal_id=NEW.journal_id;
 canonical=canonical||line_count::text||chr(10);
 FOR line_row IN SELECT account_id,side,amount_minor,currency
  FROM opes_core.journal_line
  WHERE bank_id=NEW.bank_id AND journal_id=NEW.journal_id
  ORDER BY line_number LOOP
   FOREACH v IN ARRAY ARRAY[
    line_row.account_id::text,line_row.side,
    line_row.amount_minor::text,trim(line_row.currency)::text
   ] LOOP
    canonical=canonical||length(v)::text||':'||v||chr(10);
   END LOOP;
 END LOOP;
 IF encode(sha256(convert_to(canonical,'UTF8')),'hex')<>NEW.request_digest THEN
  RAISE EXCEPTION 'ECONOMIC_COMMAND_DIGEST_NOT_MATCHED'
   USING ERRCODE='23514';
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER posting_command_digest_integrity
BEFORE INSERT ON opes_core.posting_command
FOR EACH ROW EXECUTE FUNCTION opes_core.verify_posted_command_digest();
