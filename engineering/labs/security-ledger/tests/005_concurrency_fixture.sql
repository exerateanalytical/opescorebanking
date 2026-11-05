-- SEC-LED-LAB-005: synthetic memberships and accounts for two independent sessions.
-- Requires 001-004 applied into a FRESH disposable PostgreSQL 16 lab.
CREATE ROLE opes_lock_holder_lab LOGIN;
CREATE ROLE opes_crash_holder_lab LOGIN;
GRANT USAGE ON SCHEMA ledger_lab TO opes_lock_holder_lab,opes_crash_holder_lab;
GRANT EXECUTE ON FUNCTION ledger_lab.post_synthetic_bank_journal(uuid,bigint,uuid,text,uuid,uuid,text,jsonb)
 TO opes_lock_holder_lab,opes_crash_holder_lab;
INSERT INTO ledger_lab.member_authority(membership_id,subject_digest,db_principal,revision,state,can_post)
 VALUES('50000000-0000-4000-8000-000000000051',decode(repeat('51',32),'hex'),'opes_lock_holder_lab',1,'ACTIVE',true),
       ('50000000-0000-4000-8000-000000000052',decode(repeat('52',32),'hex'),'opes_crash_holder_lab',1,'ACTIVE',true);
INSERT INTO ledger_lab.ledger_account(account_id,currency,state)
 VALUES('30000000-0000-4000-8000-000000000051','XAF','ACTIVE'),
       ('30000000-0000-4000-8000-000000000052','XAF','ACTIVE');
