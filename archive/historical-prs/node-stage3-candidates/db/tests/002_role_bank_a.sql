\set ON_ERROR_STOP on
SET opes.stage3_bank='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
DO $test$ DECLARE n int; BEGIN
 SELECT count(*) INTO n FROM opes_stage3.gov_candidate; IF n<>1 THEN RAISE EXCEPTION 'STAGE3_BANK_A_GOV_RLS_FAILED %',n; END IF;
 SELECT count(*) INTO n FROM opes_stage3.arc_candidate; IF n<>1 THEN RAISE EXCEPTION 'STAGE3_BANK_A_ARC_RLS_FAILED %',n; END IF;
 SELECT count(*) INTO n FROM opes_stage3.cif_candidate; IF n<>1 THEN RAISE EXCEPTION 'STAGE3_BANK_A_CIF_RLS_FAILED %',n; END IF;
 SELECT count(*) INTO n FROM opes_stage3.prd_candidate; IF n<>1 THEN RAISE EXCEPTION 'STAGE3_BANK_A_PRD_RLS_FAILED %',n; END IF;
 SELECT count(*) INTO n FROM opes_stage3.act_candidate; IF n<>1 THEN RAISE EXCEPTION 'STAGE3_BANK_A_ACT_RLS_FAILED %',n; END IF;
 SELECT count(*) INTO n FROM opes_stage3.led_candidate; IF n<>1 THEN RAISE EXCEPTION 'STAGE3_BANK_A_LED_RLS_FAILED %',n; END IF;
 SELECT count(*) INTO n FROM opes_stage3.brn_candidate; IF n<>1 THEN RAISE EXCEPTION 'STAGE3_BANK_A_BRN_RLS_FAILED %',n; END IF;
 SELECT count(*) INTO n FROM opes_stage3.pay_candidate; IF n<>1 THEN RAISE EXCEPTION 'STAGE3_BANK_A_PAY_RLS_FAILED %',n; END IF;
 SELECT count(*) INTO n FROM opes_stage3.crd_candidate; IF n<>1 THEN RAISE EXCEPTION 'STAGE3_BANK_A_CRD_RLS_FAILED %',n; END IF;
 SELECT count(*) INTO n FROM opes_stage3.tre_candidate; IF n<>1 THEN RAISE EXCEPTION 'STAGE3_BANK_A_TRE_RLS_FAILED %',n; END IF;
 SELECT count(*) INTO n FROM opes_stage3.aml_candidate; IF n<>1 THEN RAISE EXCEPTION 'STAGE3_BANK_A_AML_RLS_FAILED %',n; END IF;
 SELECT count(*) INTO n FROM opes_stage3.rep_candidate; IF n<>1 THEN RAISE EXCEPTION 'STAGE3_BANK_A_REP_RLS_FAILED %',n; END IF;
 SELECT count(*) INTO n FROM opes_stage3.chn_candidate; IF n<>1 THEN RAISE EXCEPTION 'STAGE3_BANK_A_CHN_RLS_FAILED %',n; END IF;
 SELECT count(*) INTO n FROM opes_stage3.card_candidate; IF n<>1 THEN RAISE EXCEPTION 'STAGE3_BANK_A_CARD_RLS_FAILED %',n; END IF;
 SELECT count(*) INTO n FROM opes_stage3.crm_candidate; IF n<>1 THEN RAISE EXCEPTION 'STAGE3_BANK_A_CRM_RLS_FAILED %',n; END IF;
 SELECT count(*) INTO n FROM opes_stage3.fee_candidate; IF n<>1 THEN RAISE EXCEPTION 'STAGE3_BANK_A_FEE_RLS_FAILED %',n; END IF;
 SELECT count(*) INTO n FROM opes_stage3.rec_candidate; IF n<>1 THEN RAISE EXCEPTION 'STAGE3_BANK_A_REC_RLS_FAILED %',n; END IF;
 SELECT count(*) INTO n FROM opes_stage3.sec_candidate; IF n<>1 THEN RAISE EXCEPTION 'STAGE3_BANK_A_SEC_RLS_FAILED %',n; END IF;
 SELECT count(*) INTO n FROM opes_stage3.dat_candidate; IF n<>1 THEN RAISE EXCEPTION 'STAGE3_BANK_A_DAT_RLS_FAILED %',n; END IF;
 SELECT count(*) INTO n FROM opes_stage3.api_candidate; IF n<>1 THEN RAISE EXCEPTION 'STAGE3_BANK_A_API_RLS_FAILED %',n; END IF;
 SELECT count(*) INTO n FROM opes_stage3.inf_candidate; IF n<>1 THEN RAISE EXCEPTION 'STAGE3_BANK_A_INF_RLS_FAILED %',n; END IF;
 SELECT count(*) INTO n FROM opes_stage3.dr_candidate; IF n<>1 THEN RAISE EXCEPTION 'STAGE3_BANK_A_DR_RLS_FAILED %',n; END IF;
 SELECT count(*) INTO n FROM opes_stage3.adm_candidate; IF n<>1 THEN RAISE EXCEPTION 'STAGE3_BANK_A_ADM_RLS_FAILED %',n; END IF;
 SELECT count(*) INTO n FROM opes_stage3.tst_candidate; IF n<>1 THEN RAISE EXCEPTION 'STAGE3_BANK_A_TST_RLS_FAILED %',n; END IF;
 SELECT count(*) INTO n FROM opes_stage3.rel_candidate; IF n<>1 THEN RAISE EXCEPTION 'STAGE3_BANK_A_REL_RLS_FAILED %',n; END IF;
 BEGIN
  EXECUTE 'SET ROLE postgres';
  RAISE EXCEPTION 'ROLE_SPOOFED';
 EXCEPTION WHEN insufficient_privilege THEN NULL;
 END;
 BEGIN
  UPDATE opes_stage3.gov_candidate SET state='REVIEWED_NOT_EFFECTIVE';
  RAISE EXCEPTION 'DIRECT_DML_ALLOWED';
 EXCEPTION WHEN insufficient_privilege THEN NULL;
 END;
END $test$;
SELECT 'STAGE3_BANK_A_25_DOMAIN_RLS_PASS';
