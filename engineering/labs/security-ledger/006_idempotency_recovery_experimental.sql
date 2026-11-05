-- SEC-TENANT-ROUTING-001 / LAB-006: DISPOSABLE PostgreSQL 16 idempotency fixture.
-- NOT a migration, production posting function, or regulatory mapping.
-- Execute only in a newly created disposable database with pgcrypto available.
-- No OIDC proof, no real-money use, no cross-bank deployment claim.
BEGIN;
CREATE SCHEMA IF NOT EXISTS sec_idemp_006;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE sec_idemp_006.member (
  member_id uuid PRIMARY KEY, db_principal name NOT NULL,
  revision bigint NOT NULL CHECK(revision > 0),
  state text NOT NULL CHECK(state IN ('ACTIVE','REVOKED')),
  can_post boolean NOT NULL
);
CREATE TABLE sec_idemp_006.account (
  account_id uuid PRIMARY KEY,
  currency text NOT NULL CHECK(currency ~ '^[A-Z]{3}$'),
  state text NOT NULL CHECK(state IN ('ACTIVE','CLOSED'))
);
CREATE TABLE sec_idemp_006.operation (
  operation_id uuid PRIMARY KEY,
  operation_type text NOT NULL CHECK(operation_type='SYNTHETIC_JOURNAL'),
  idempotency_key text NOT NULL CHECK(length(idempotency_key) BETWEEN 8 AND 100),
  digest bytea NOT NULL CHECK(octet_length(digest)=32),
  journal_id uuid NOT NULL UNIQUE,
  member_id uuid NOT NULL REFERENCES sec_idemp_006.member(member_id),
  UNIQUE(operation_type,idempotency_key)
);
CREATE TABLE sec_idemp_006.line (
  journal_id uuid NOT NULL REFERENCES sec_idemp_006.operation(journal_id) DEFERRABLE INITIALLY DEFERRED,
  line_no integer NOT NULL CHECK(line_no > 0),
  account_id uuid NOT NULL REFERENCES sec_idemp_006.account(account_id),
  debit_minor bigint NOT NULL CHECK(debit_minor>=0),
  credit_minor bigint NOT NULL CHECK(credit_minor>=0),
  CHECK ((debit_minor>0 AND credit_minor=0) OR (credit_minor>0 AND debit_minor=0)),
  PRIMARY KEY(journal_id,line_no)
);
-- The FK above references a UNIQUE journal_id on operation, not a journal table;
-- operation+line+outbox are committed atomically by the calling transaction.
CREATE TABLE sec_idemp_006.outbox (
  event_id uuid PRIMARY KEY,
  journal_id uuid NOT NULL UNIQUE REFERENCES sec_idemp_006.operation(journal_id),
  event_type text NOT NULL CHECK(event_type='JournalPosted')
);
-- SECURITY INVOKER: laboratory owner only. Do not GRANT to application logins.
-- Canonical encoding: version + currency + ordered array of exact typed line tuples.
-- Business line order is intentionally material; transport UUIDs are excluded.
CREATE FUNCTION sec_idemp_006.post(
 p_member uuid,p_revision bigint,p_key text,p_command uuid,p_journal uuid,
 p_event uuid,p_currency text,p_lines jsonb
) RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE m sec_idemp_006.member%ROWTYPE;
 item jsonb; a sec_idemp_006.account%ROWTYPE;
 n integer:=0; deb numeric:=0; cred numeric:=0;
 canonical text; dig bytea; prior sec_idemp_006.operation%ROWTYPE;
 inserted uuid; j uuid;
BEGIN
 IF p_key IS NULL OR length(p_key) NOT BETWEEN 8 AND 100
 OR p_key !~ '^[A-Za-z0-9._:-]+$'
 OR p_command IS NULL OR p_journal IS NULL OR p_event IS NULL
 OR p_currency IS NULL OR p_currency !~ '^[A-Z]{3}$'
 OR p_lines IS NULL OR jsonb_typeof(p_lines)<>'array'
 OR jsonb_array_length(p_lines) NOT BETWEEN 2 AND 100 THEN
  RAISE EXCEPTION 'invalid request';
 END IF;
 -- Authorization and revocation fence precede any idempotency disclosure.
 SELECT * INTO m FROM sec_idemp_006.member WHERE member_id=p_member FOR UPDATE;
 IF NOT FOUND OR m.db_principal<>SESSION_USER OR m.revision<>p_revision
 OR m.state<>'ACTIVE' OR NOT m.can_post THEN
  RAISE EXCEPTION 'authorization denied';
 END IF;
 canonical:='OPES-LAB-006-V1|'||p_currency||'|';
 FOR item IN SELECT value FROM jsonb_array_elements(p_lines) LOOP
  IF jsonb_typeof(item)<>'object'
   OR NOT(item ? 'account_id' AND item ? 'debit_minor' AND item ? 'credit_minor')
   OR (item - 'account_id' - 'debit_minor' - 'credit_minor') <> '{}'::jsonb
   OR jsonb_typeof(item->'debit_minor')<>'number'
   OR jsonb_typeof(item->'credit_minor')<>'number'
   OR (item->>'debit_minor') !~ '^(0|[1-9][0-9]{0,18})$'
   OR (item->>'credit_minor') !~ '^(0|[1-9][0-9]{0,18})$' THEN
    RAISE EXCEPTION 'invalid exact line';
  END IF;
  SELECT * INTO a FROM sec_idemp_006.account
   WHERE account_id=(item->>'account_id')::uuid FOR SHARE;
  IF NOT FOUND OR a.state<>'ACTIVE' OR a.currency<>p_currency THEN
   RAISE EXCEPTION 'account unavailable';
  END IF;
  n:=n+1;
  deb:=deb+(item->>'debit_minor')::bigint;
  cred:=cred+(item->>'credit_minor')::bigint;
  IF NOT (((item->>'debit_minor')::bigint>0 AND (item->>'credit_minor')::bigint=0)
   OR ((item->>'credit_minor')::bigint>0 AND (item->>'debit_minor')::bigint=0)) THEN
    RAISE EXCEPTION 'invalid side';
  END IF;
  canonical:=canonical||n::text||':'||a.account_id::text||':'||
    (item->>'debit_minor')::bigint::text||':'||
    (item->>'credit_minor')::bigint::text||';';
 END LOOP;
 IF deb<=0 OR deb<>cred THEN RAISE EXCEPTION 'unbalanced'; END IF;
 dig:=digest(convert_to(canonical,'UTF8'),'sha256');
 INSERT INTO sec_idemp_006.operation
  (operation_id,operation_type,idempotency_key,digest,journal_id,member_id)
 VALUES(p_command,'SYNTHETIC_JOURNAL',p_key,dig,p_journal,p_member)
 ON CONFLICT (operation_type,idempotency_key) DO NOTHING
 RETURNING journal_id INTO inserted;
 IF inserted IS NULL THEN
  SELECT * INTO prior FROM sec_idemp_006.operation
   WHERE operation_type='SYNTHETIC_JOURNAL' AND idempotency_key=p_key;
  IF NOT FOUND THEN RAISE EXCEPTION 'unresolved concurrent operation'; END IF;
  IF prior.member_id<>p_member THEN RAISE EXCEPTION 'idempotency owner conflict'; END IF;
  IF prior.digest<>dig THEN RAISE EXCEPTION 'idempotency conflict'; END IF;
  RETURN prior.journal_id;
 END IF;
 FOR item IN SELECT value FROM jsonb_array_elements(p_lines) LOOP
  j:=inserted;
  INSERT INTO sec_idemp_006.line(journal_id,line_no,account_id,debit_minor,credit_minor)
  VALUES(j,(SELECT count(*)+1 FROM sec_idemp_006.line WHERE journal_id=j),
    (item->>'account_id')::uuid,(item->>'debit_minor')::bigint,(item->>'credit_minor')::bigint);
 END LOOP;
 INSERT INTO sec_idemp_006.outbox(event_id,journal_id,event_type)
 VALUES(p_event,inserted,'JournalPosted');
 RETURN inserted;
END $$;
COMMIT;
-- TEST PLAN (NOT EXECUTED): use a disposable DB role matching member.db_principal.
-- 1. Same key, same economics, different command/journal/event UUID -> same journal.
-- 2. Same key, changed amount/account -> exception; no extra operation/outbox.
-- 3. Twenty independent connections with identical key -> one operation.
-- 4. Revoke membership with FOR UPDATE -> subsequent replay denied.
-- 5. Kill worker AFTER COMMIT acknowledgement BEFORE HTTP reply -> recover journal.
-- 6. Fail DB lookup -> UNKNOWN, never FAILED_NOT_COMMITTED.
-- 7. Prove exact per-currency balance and durable outbox counts.
-- LIMITATIONS: this fixture is not hardened against direct table writes, lacks
-- immutable journal enforcement, trusted OIDC routing, bank-scoped multi-tenant
-- uniqueness, C4 harness, crash traces, and production-grade authorization.
