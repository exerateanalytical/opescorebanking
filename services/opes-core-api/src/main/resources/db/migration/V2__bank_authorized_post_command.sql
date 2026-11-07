-- Controlled bank-identity and posted-journal command operations.
-- Functions are SECURITY DEFINER owned by the restricted, audited migration owner,
-- NEVER a database superuser in a live deployment.
CREATE FUNCTION opes_core.post_journal(
 p_command uuid,p_authorization uuid,p_reference text,p_period uuid,
 p_digest text,p_entries jsonb,p_issuer text,p_subject text
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE
 v_bank uuid;v_actor record;v_auth record;v_previous record;v_period record;
 v_journal uuid;v_receipt jsonb;v_entry jsonb;v_account record;
 v_account_id uuid;v_currency text;v_side text;v_amount numeric;
 v_account_ids uuid[];v_counter integer:=0;
BEGIN
 v_bank=opes_core.current_bank_id();
 IF v_bank IS NULL THEN
  RAISE EXCEPTION 'UNBOUND_BANK_PRINCIPAL' USING ERRCODE='42501';
 END IF;
 IF p_command IS NULL OR p_authorization IS NULL OR p_period IS NULL
  OR p_issuer IS NULL OR p_subject IS NULL
  OR p_digest IS NULL OR p_digest !~ '^[a-f0-9]{64}$'
  OR p_reference IS NULL OR p_reference !~ '^[A-Za-z0-9:._/-]{3,160}$'
  OR p_entries IS NULL OR jsonb_typeof(p_entries)<>'array'
  OR jsonb_array_length(p_entries) NOT BETWEEN 2 AND 500 THEN
  RAISE EXCEPTION 'INVALID_JOURNAL_COMMAND' USING ERRCODE='22023';
 END IF;
 SELECT * INTO v_actor FROM opes_core.actor_membership
 WHERE bank_id=v_bank AND issuer=p_issuer AND subject_id=p_subject
  AND active=true AND can_post=true AND expires_at>clock_timestamp()
 FOR UPDATE;
 IF NOT FOUND THEN
  RAISE EXCEPTION 'POST_PERMISSION_DENIED' USING ERRCODE='42501';
 END IF;
 -- Same membership row is locked throughout financial commit. Revocation must
 -- use this row and wait for in-flight postings before returning acknowledgement.
 PERFORM pg_advisory_xact_lock(hashtextextended(v_bank::text||':'||p_command::text,0));
 SELECT * INTO v_previous FROM opes_core.posting_command
 WHERE bank_id=v_bank AND command_id=p_command;
 IF FOUND THEN
  IF v_previous.request_digest=p_digest AND
     v_previous.posted_by_issuer=p_issuer AND
     v_previous.posted_by_subject=p_subject THEN
   RETURN v_previous.result_receipt;
  END IF;
  RAISE EXCEPTION 'IDEMPOTENCY_KEY_CONFLICT' USING ERRCODE='23505';
 END IF;
 SELECT * INTO v_period FROM opes_core.accounting_period
 WHERE bank_id=v_bank AND period_id=p_period AND state='OPEN'
 FOR SHARE;
 IF NOT FOUND THEN
  RAISE EXCEPTION 'ACCOUNTING_PERIOD_CLOSED_OR_UNKNOWN' USING ERRCODE='23514';
 END IF;
 SELECT * INTO v_auth FROM opes_core.posting_authorization
 WHERE bank_id=v_bank AND authorization_id=p_authorization FOR UPDATE;
 IF NOT FOUND OR v_auth.status<>'APPROVED' OR
   v_auth.expires_at<=clock_timestamp() OR
   v_auth.consumed_by_journal IS NOT NULL OR
   v_auth.command_digest<>p_digest THEN
  RAISE EXCEPTION 'INDEPENDENT_APPROVAL_REQUIRED' USING ERRCODE='42501';
 END IF;
 -- Lock all referenced account rows in a deterministic order.
 SELECT array_agg(DISTINCT (entry->>'accountId')::uuid ORDER BY (entry->>'accountId')::uuid)
 INTO v_account_ids FROM jsonb_array_elements(p_entries) entry;
 IF cardinality(v_account_ids)<2 THEN
  RAISE EXCEPTION 'TWO_DISTINCT_ACCOUNTS_REQUIRED' USING ERRCODE='23514';
 END IF;
 FOREACH v_account_id IN ARRAY v_account_ids LOOP
  PERFORM 1 FROM opes_core.account
  WHERE bank_id=v_bank AND account_id=v_account_id AND state='ACTIVE' FOR SHARE;
  IF NOT FOUND THEN
   RAISE EXCEPTION 'ACCOUNT_INACTIVE_OR_CROSS_BANK' USING ERRCODE='23514';
  END IF;
 END LOOP;
 v_journal=gen_random_uuid();
 INSERT INTO opes_core.journal(
  bank_id,journal_id,command_id,posting_authorization_id,
  accounting_period_id,source_reference
 ) VALUES(v_bank,v_journal,p_command,p_authorization,p_period,p_reference);
 FOR v_entry IN SELECT value FROM jsonb_array_elements(p_entries) LOOP
  v_counter=v_counter+1;
  IF jsonb_typeof(v_entry)<>'object' OR
   (SELECT count(*) FROM jsonb_object_keys(v_entry))<>4 OR
   NOT (v_entry ?& ARRAY['accountId','side','amountMinor','currency'])
  THEN RAISE EXCEPTION 'INVALID_LINE_FIELDS' USING ERRCODE='22023';END IF;
  v_account_id=(v_entry->>'accountId')::uuid;
  v_currency=v_entry->>'currency';
  v_side=v_entry->>'side';
  IF v_currency !~ '^[A-Z]{3}$' OR v_side NOT IN ('DEBIT','CREDIT')
    OR jsonb_typeof(v_entry->'amountMinor')<>'number'
    OR v_entry->>'amountMinor' !~ '^[1-9][0-9]{0,15}$' THEN
   RAISE EXCEPTION 'INVALID_EXACT_MINOR_AMOUNT' USING ERRCODE='22023';
  END IF;
  v_amount=(v_entry->>'amountMinor')::numeric;
  IF v_amount>9000000000000000 THEN
   RAISE EXCEPTION 'MINOR_AMOUNT_EXCEEDS_CEILING' USING ERRCODE='22003';
  END IF;
  INSERT INTO opes_core.journal_line(
   bank_id,journal_id,line_number,account_id,side,amount_minor,currency
  ) VALUES(v_bank,v_journal,v_counter,v_account_id,v_side,v_amount::bigint,v_currency);
 END LOOP;
 UPDATE opes_core.posting_authorization SET consumed_by_journal=v_journal
 WHERE bank_id=v_bank AND authorization_id=p_authorization;
 v_receipt=jsonb_build_object(
  'bankId',v_bank::text,'commandId',p_command::text,
  'journalId',v_journal::text,'state','POSTED',
  'externalSettlementVerified',false,'correlation','OPES_LEDGER_V1'
 );
 INSERT INTO opes_core.posting_command(
  bank_id,command_id,request_digest,journal_id,posted_by_issuer,
  posted_by_subject,result_receipt
 ) VALUES(v_bank,p_command,p_digest,v_journal,p_issuer,p_subject,v_receipt);
 INSERT INTO opes_core.audit_event(
  bank_id,event_id,journal_id,actor_issuer,actor_subject,action
 ) VALUES(v_bank,gen_random_uuid(),v_journal,p_issuer,p_subject,'LEDGER_POSTED');
 INSERT INTO opes_core.outbox(
  bank_id,event_id,journal_id,event_type,payload
 ) VALUES(v_bank,gen_random_uuid(),v_journal,'LEDGER_JOURNAL_POSTED_V1',
  jsonb_build_object('journalId',v_journal::text,
  'commandId',p_command::text,'bankId',v_bank::text,'schemaVersion',1));
 RETURN v_receipt;
END $fn$;

-- Read-only authoritative recovery. If an HTTP acknowledgement is lost, client
-- queries the SAME command ID. Never assume failure and retry with a new key.
CREATE FUNCTION opes_core.resolve_command(
 p_command uuid,p_issuer text,p_subject text
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER
SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE v_bank uuid;v_found jsonb;
BEGIN
 v_bank=opes_core.current_bank_id();
 IF v_bank IS NULL OR p_command IS NULL OR p_issuer IS NULL OR p_subject IS NULL THEN
  RAISE EXCEPTION 'RECOVERY_DENIED' USING ERRCODE='42501';
 END IF;
 PERFORM 1 FROM opes_core.actor_membership
 WHERE bank_id=v_bank AND issuer=p_issuer AND subject_id=p_subject
 AND active=true AND can_recover=true AND expires_at>clock_timestamp();
 IF NOT FOUND THEN
  RAISE EXCEPTION 'RECOVERY_DENIED' USING ERRCODE='42501';
 END IF;
 SELECT result_receipt INTO v_found FROM opes_core.posting_command
 WHERE bank_id=v_bank AND command_id=p_command;
 RETURN v_found;
END $fn$;

REVOKE ALL ON FUNCTION opes_core.post_journal(uuid,uuid,text,uuid,text,jsonb,text,text)
 FROM PUBLIC;
REVOKE ALL ON FUNCTION opes_core.resolve_command(uuid,text,text) FROM PUBLIC;
-- Bank runtime role GRANTs are provisioned explicitly by infrastructure after
-- validating its NOBYPASSRLS privileges and mapping via bank_principal.
-- No GRANT INSERT/UPDATE/DELETE/SELECT on any ledger table to app principals.
