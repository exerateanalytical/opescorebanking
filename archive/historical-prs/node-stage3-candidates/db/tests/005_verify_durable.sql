-- Compare state with atomic audit/outbox, using privileged lab-only account.
\set ON_ERROR_STOP on
DO $test$
DECLARE n int;
BEGIN
 SELECT count(*) INTO n FROM opes_stage3.candidate_registry;
 IF n<>25 THEN RAISE EXCEPTION 'CANDIDATE_REGISTRY_COUNT %',n;END IF;
 SELECT count(*) INTO n FROM opes_stage3.command_registry;
 IF n<>75 THEN RAISE EXCEPTION 'COMMAND_REGISTRY_COUNT %',n;END IF;
 SELECT count(*) INTO n FROM opes_stage3.audit_event;
 IF n<>75 THEN RAISE EXCEPTION 'AUDIT_EVENT_COUNT %',n;END IF;
 SELECT count(*) INTO n FROM opes_stage3.outbox_candidate;
 IF n<>75 THEN RAISE EXCEPTION 'OUTBOX_EVENT_COUNT %',n;END IF;
 SELECT count(*) INTO n FROM opes_stage3.candidate_registry
 WHERE bank_id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
 AND state='REVIEWED_NOT_EFFECTIVE' AND version=3;
 IF n<>25 THEN RAISE EXCEPTION 'REVIEWED_NON_EFFECTIVE_COUNT %',n;END IF;
 SELECT count(*) INTO n FROM opes_stage3.outbox_candidate
 WHERE externally_published<>false;
 IF n<>0 THEN RAISE EXCEPTION 'EXTERNAL_OUTBOX_WAS_PUBLISHED';END IF;
 BEGIN
  DELETE FROM opes_stage3.audit_event;
  RAISE EXCEPTION 'AUDIT_MUTABLE';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM<>'APPEND_ONLY_AUDIT_OUTBOX' THEN RAISE;END IF;
 END;
END $test$;
SELECT 'STAGE3_25_DOMAIN_DURABLE_COMMAND_AUDIT_OUTBOX_PASS';
