-- SEC/LED-LAB-004: SYNTHETIC BANK-LOCAL POSTING EXPERIMENT, NOT PRODUCTION.
-- One dedicated bank database, PostgreSQL 16+, fresh lab only.
-- Requires ledger_lab migrations 001, 002 and 003.
-- Does NOT verify OIDC subject or maker-checker; no client access or real money.
BEGIN;
DO $precheck$
BEGIN
 IF EXISTS (SELECT 1 FROM ledger_lab.posting_command)
 OR EXISTS (SELECT 1 FROM ledger_lab.journal)
 OR EXISTS (SELECT 1 FROM ledger_lab.journal_line)
 OR EXISTS (SELECT 1 FROM ledger_lab.outbox) THEN
   RAISE EXCEPTION 'SEC/LED-LAB-004 requires empty disposable ledger_lab';
 END IF;
END $precheck$;

CREATE TABLE ledger_lab.member_authority (
 membership_id uuid PRIMARY KEY,
 subject_digest bytea NOT NULL CHECK(octet_length(subject_digest)=32),
 db_principal name NOT NULL,
 revision bigint NOT NULL CHECK(revision>0),
 state text NOT NULL CHECK(state IN ('ACTIVE','REVOKING','REVOKED')),
 can_post boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(),
 revoked_at timestamptz,
 CHECK ((state='REVOKED' AND revoked_at IS NOT NULL) OR
        (state<>'REVOKED' AND revoked_at IS NULL))
);
CREATE INDEX member_authority_principal_idx ON ledger_lab.member_authority(db_principal);

CREATE TABLE ledger_lab.ledger_account (
 account_id uuid PRIMARY KEY,
 currency char(3) NOT NULL CHECK(currency ~ '^[A-Z]{3}$'),
 state text NOT NULL CHECK(state IN ('ACTIVE','CLOSED')),
 created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE ledger_lab.journal_line ADD CONSTRAINT journal_line_account_fk
 FOREIGN KEY(account_id) REFERENCES ledger_lab.ledger_account(account_id);
ALTER TABLE ledger_lab.posting_command
 ADD COLUMN idempotency_key text NOT NULL,
 ADD COLUMN membership_id uuid NOT NULL REFERENCES ledger_lab.member_authority(membership_id),
 ADD COLUMN membership_revision bigint NOT NULL CHECK(membership_revision>0),
 ADD CONSTRAINT posting_command_key_unique UNIQUE(idempotency_key);

-- No executable financial authority is implied by this synthetic principal.
-- A production issuer/gateway must cryptographically bind subject -> bank membership.
CREATE ROLE opes_lab_executor NOLOGIN;
GRANT USAGE, CREATE ON SCHEMA ledger_lab TO opes_lab_executor;
-- FOR KEY SHARE requires UPDATE privilege on the locked account relation.
-- This grant is to a NOLOGIN function owner only, never a bank service login.
GRANT SELECT, UPDATE ON ledger_lab.ledger_account TO opes_lab_executor;
GRANT SELECT, UPDATE ON ledger_lab.member_authority TO opes_lab_executor;
GRANT SELECT, INSERT ON ledger_lab.posting_command,ledger_lab.journal,
 ledger_lab.journal_line,ledger_lab.outbox TO opes_lab_executor;

CREATE FUNCTION ledger_lab.post_synthetic_bank_journal(
 p_membership_id uuid,
 p_expected_revision bigint,
 p_command_id uuid,
 p_idempotency_key text,
 p_journal_id uuid,
 p_event_id uuid,
 p_currency text,
 p_lines jsonb
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, ledger_lab, pg_temp
AS $fn$
DECLARE
 m ledger_lab.member_authority%ROWTYPE;
 item jsonb;
 v_account uuid;
 v_debit bigint;
 v_credit bigint;
 v_account_currency char(3);
 v_account_state text;
 v_debit_total numeric := 0;
 v_credit_total numeric := 0;
 v_line integer := 0;
 v_digest bytea;
 v_inserted uuid;
 v_existing ledger_lab.posting_command%ROWTYPE;
 v_existing_journal uuid;
BEGIN
 IF p_membership_id IS NULL OR p_command_id IS NULL OR p_journal_id IS NULL
 OR p_event_id IS NULL OR p_expected_revision IS NULL
 OR p_idempotency_key IS NULL OR p_currency IS NULL
 OR p_lines IS NULL THEN
   RAISE EXCEPTION 'missing required posting input';
 END IF;
 IF length(p_idempotency_key)<8 OR length(p_idempotency_key)>100
 OR p_idempotency_key !~ '^[A-Za-z0-9._:-]+$' THEN
   RAISE EXCEPTION 'invalid idempotency key';
 END IF;
 IF p_currency !~ '^[A-Z]{3}$' THEN
   RAISE EXCEPTION 'invalid currency code';
 END IF;
 IF jsonb_typeof(p_lines)<>'array' OR jsonb_array_length(p_lines)<2
 OR jsonb_array_length(p_lines)>100 THEN
   RAISE EXCEPTION 'posting requires 2-100 journal lines';
 END IF;

 -- This row lock must precede command uniqueness and monetary writes.
 -- Revocation must lock this same row and advance revision.
 SELECT * INTO m FROM ledger_lab.member_authority
 WHERE membership_id=p_membership_id FOR UPDATE;
 IF NOT FOUND OR m.db_principal<>SESSION_USER OR m.state<>'ACTIVE'
 OR m.revision<>p_expected_revision OR NOT m.can_post THEN
   RAISE EXCEPTION 'bank-local member authorization denied';
 END IF;

 FOR item IN SELECT value FROM jsonb_array_elements(p_lines) LOOP
  IF jsonb_typeof(item)<>'object' OR NOT(item ? 'account_id')
  OR NOT(item ? 'debit_minor') OR NOT(item ? 'credit_minor')
  OR (item - 'account_id' - 'debit_minor' - 'credit_minor') <> '{}'::jsonb
  OR jsonb_typeof(item->'debit_minor')<>'number'
  OR jsonb_typeof(item->'credit_minor')<>'number'
  OR (item->>'debit_minor') !~ '^(0|[1-9][0-9]{0,18})$'
  OR (item->>'credit_minor') !~ '^(0|[1-9][0-9]{0,18})$' THEN
    RAISE EXCEPTION 'invalid exact minor-unit journal line';
  END IF;
  v_account := (item->>'account_id')::uuid;
  v_debit := (item->>'debit_minor')::bigint;
  v_credit := (item->>'credit_minor')::bigint;
  IF NOT ((v_debit>0 AND v_credit=0) OR (v_credit>0 AND v_debit=0)) THEN
    RAISE EXCEPTION 'one positive debit or credit required per line';
  END IF;
  SELECT currency,state INTO v_account_currency,v_account_state
  FROM ledger_lab.ledger_account WHERE account_id=v_account FOR KEY SHARE;
  IF NOT FOUND OR v_account_state<>'ACTIVE' OR v_account_currency<>p_currency THEN
    RAISE EXCEPTION 'inactive, missing or wrong-currency ledger account';
  END IF;
  v_debit_total:=v_debit_total+v_debit;
  v_credit_total:=v_credit_total+v_credit;
 END LOOP;
 IF v_debit_total<=0 OR v_debit_total<>v_credit_total THEN
   RAISE EXCEPTION 'unbalanced or zero journal';
 END IF;
 v_digest:=sha256(convert_to(
   'OPES_LEDGER_LAB_POST_V1|'||p_membership_id::text||'|'||
   p_expected_revision::text||'|'||p_command_id::text||'|'||
   p_journal_id::text||'|'||p_idempotency_key||'|'||
   p_currency||'|'||p_lines::text,'UTF8'));

 INSERT INTO ledger_lab.posting_command
  (command_id,request_digest,state,idempotency_key,membership_id,membership_revision)
 VALUES(p_command_id,v_digest,'COMMITTED',p_idempotency_key,p_membership_id,p_expected_revision)
 ON CONFLICT(command_id) DO NOTHING
 RETURNING command_id INTO v_inserted;

 IF v_inserted IS NULL THEN
  SELECT * INTO v_existing FROM ledger_lab.posting_command WHERE command_id=p_command_id;
  IF NOT FOUND OR v_existing.request_digest IS DISTINCT FROM v_digest
   OR v_existing.idempotency_key<>p_idempotency_key
   OR v_existing.membership_id<>p_membership_id
   OR v_existing.membership_revision<>p_expected_revision THEN
    RAISE EXCEPTION 'financial command idempotency conflict';
  END IF;
  SELECT journal_id INTO v_existing_journal FROM ledger_lab.journal
  WHERE command_id=p_command_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'unknown committed command state'; END IF;
  RETURN v_existing_journal;
 END IF;

 INSERT INTO ledger_lab.journal(journal_id,command_id,currency)
 VALUES(p_journal_id,p_command_id,p_currency);
 FOR item IN SELECT value FROM jsonb_array_elements(p_lines) LOOP
   v_line:=v_line+1;
   INSERT INTO ledger_lab.journal_line
     (journal_id,line_no,account_id,debit_minor,credit_minor)
   VALUES(p_journal_id,v_line,(item->>'account_id')::uuid,
          (item->>'debit_minor')::bigint,(item->>'credit_minor')::bigint);
 END LOOP;
 INSERT INTO ledger_lab.outbox(event_id,journal_id,event_type,payload)
 VALUES(p_event_id,p_journal_id,'JournalPosted',
        jsonb_build_object('journal_id',p_journal_id,'command_id',p_command_id,
                           'membership_id',p_membership_id,'currency',p_currency,
                           'digest_hex',encode(v_digest,'hex')));
 RETURN p_journal_id;
END
$fn$;
ALTER FUNCTION ledger_lab.post_synthetic_bank_journal(uuid,bigint,uuid,text,uuid,uuid,text,jsonb)
 OWNER TO opes_lab_executor;
REVOKE CREATE ON SCHEMA ledger_lab FROM opes_lab_executor;
REVOKE ALL ON FUNCTION ledger_lab.post_synthetic_bank_journal(uuid,bigint,uuid,text,uuid,uuid,text,jsonb) FROM PUBLIC;
-- Database provisioning must explicitly GRANT EXECUTE to a bank-specific login.
-- None of these functions may be used against a real-money database.
COMMIT;
