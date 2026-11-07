\set ON_ERROR_STOP on
SET opes.reporting_institution='BANK-A';
DO $test$ DECLARE v record;
BEGIN
 SELECT * INTO v FROM opes_rpt_review_lab.read_review('RPT-LED-001');
 IF v.institution_id<>'BANK-B' OR v.state<>'DRAFT' OR v.maker_id<>'B-MAKER'
 THEN RAISE EXCEPTION 'CROSS_BANK_READ_OR_TENANT_SPOOF';END IF;
 IF (SELECT count(*) FROM opes_rpt_review_lab.read_review('RPT-LED-002'))<>0
 THEN RAISE EXCEPTION 'CROSS_BANK_REPORT_ENUMERATION';END IF;
 IF opes_rpt_review_lab.advance_review('RPT-LED-001',1,'PENDING_REVIEW','sha256-SYNTHETIC-A-001')
 THEN RAISE EXCEPTION 'CROSS_BANK_TRANSITION';END IF;
 BEGIN
  PERFORM count(*) FROM opes_rpt_review_lab.review_audit;
  RAISE EXCEPTION 'DIRECT_AUDIT_READ_PRIVILEGE_BYPASS';
 EXCEPTION WHEN insufficient_privilege THEN NULL;
 END;
END $test$;
SELECT 'PG16_BANK_B_ISOLATION_PASS';
