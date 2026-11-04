\set ON_ERROR_STOP on
SET opes.institution_id='11111111-1111-4111-8111-111111111111';
DO $$ DECLARE n integer; identity uuid;
BEGIN
 IF session_user::text <> 'opes_bank_b_test' THEN RAISE EXCEPTION 'Wrong bank B login'; END IF;
 SELECT count(*) INTO n FROM opes_domains.cif_party;
 IF n<>1 THEN RAISE EXCEPTION 'Bank B must see only its own party: %',n; END IF;
 SELECT party_id INTO identity FROM opes_domains.cif_party;
 IF identity <> '30000000-0000-4000-8000-000000000002'::uuid
 THEN RAISE EXCEPTION 'Bank A party leaked into bank B'; END IF;
 SELECT count(*) INTO n FROM opes_domains.prd_product;
 IF n<>0 THEN RAISE EXCEPTION 'Bank A product leaked into bank B'; END IF;
 SELECT count(*) INTO n FROM opes_domains.act_account_request;
 IF n<>0 THEN RAISE EXCEPTION 'Bank A account request leaked into bank B'; END IF;
 SELECT count(*) INTO n FROM opes_domains.led_journal_proposal;
 IF n<>0 THEN RAISE EXCEPTION 'Bank A journal draft leaked into bank B'; END IF;
END $$;
SELECT 'CIF_PRD_ACT_LED_BANK_B_GATES_PASSED' AS result;
