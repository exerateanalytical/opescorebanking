\set ON_ERROR_STOP on
DO $$ DECLARE n integer; blocked boolean;
BEGIN
 IF session_user::text <> 'opes_bank_a_test' THEN RAISE EXCEPTION 'Wrong bank A login'; END IF;
 SELECT count(*) INTO n FROM opes_domains.cif_party;
 IF n<>1 THEN RAISE EXCEPTION 'Bank A must see 1 party; saw %',n; END IF;
 SELECT count(*) INTO n FROM opes_domains.prd_product;
 IF n<>1 THEN RAISE EXCEPTION 'Bank A must see 1 product; saw %',n; END IF;
 SELECT count(*) INTO n FROM opes_domains.act_account_request;
 IF n<>1 THEN RAISE EXCEPTION 'Bank A must see 1 account REQUEST; saw %',n; END IF;
 SELECT count(*) INTO n FROM opes_domains.led_journal_proposal;
 IF n<>1 THEN RAISE EXCEPTION 'Bank A must see 1 journal draft; saw %',n; END IF;
END $$;
SET opes.institution_id='22222222-2222-4222-8222-222222222222';
DO $$ DECLARE n integer; blocked boolean;
BEGIN
 SELECT count(*) INTO n FROM opes_domains.cif_party;
 IF n<>1 THEN RAISE EXCEPTION 'GUC spoof changed bank data visibility'; END IF;
 blocked:=false;
 BEGIN
  INSERT INTO opes_domains.cif_party(
    institution_id,party_id,party_type,legal_name,residence_country,created_by_actor)
  VALUES('22222222-2222-4222-8222-222222222222',
         '30000000-0000-4000-8000-000000000099',
         'INDIVIDUAL','Malicious tenant','GA',
         'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb');
 EXCEPTION WHEN insufficient_privilege THEN blocked:=true;
 END;
 IF NOT blocked THEN RAISE EXCEPTION 'Cross-tenant party INSERT permitted'; END IF;

 blocked:=false;
 BEGIN
  INSERT INTO opes_domains.act_account_request(
    institution_id,account_request_id,party_id,product_id,product_revision_no,
    kyc_case_id,account_purpose,created_by_actor)
  VALUES('11111111-1111-4111-8111-111111111111',
         '60000000-0000-4000-8000-000000000099',
         '30000000-0000-4000-8000-000000000002',
         '50000000-0000-4000-8000-000000000001',1,
         '40000000-0000-4000-8000-000000000001',
         'PERSONAL','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
 EXCEPTION WHEN foreign_key_violation THEN blocked:=true;
 END;
 IF NOT blocked THEN RAISE EXCEPTION 'Cross-bank party attachment bypassed composite FK'; END IF;

 blocked:=false;
 BEGIN
  UPDATE opes_domains.act_account_request SET state='APPROVED'
   WHERE institution_id='11111111-1111-4111-8111-111111111111';
 EXCEPTION WHEN insufficient_privilege THEN blocked:=true;
 END;
 IF NOT blocked THEN RAISE EXCEPTION 'Bank runtime updated account state'; END IF;

 blocked:=false;
 BEGIN
  INSERT INTO opes_domains.led_journal_line_proposal(
   institution_id,journal_id,line_number,account_request_id,side,currency,amount_minor)
  VALUES('11111111-1111-4111-8111-111111111111',
         '70000000-0000-4000-8000-000000000001',1,
         '60000000-0000-4000-8000-000000000001',
         'DEBIT','XAF',-30);
 EXCEPTION WHEN check_violation THEN blocked:=true;
 END;
 IF NOT blocked THEN RAISE EXCEPTION 'Negative journal amount was accepted'; END IF;
END $$;
SELECT 'CIF_PRD_ACT_LED_BANK_A_GATES_PASSED' AS result;
