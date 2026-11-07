\set ON_ERROR_STOP on
DO $evidence$
DECLARE
 eid uuid='f1111111-1111-4111-8111-111111111111';
 pending_id uuid='f2222222-2222-4222-8222-222222222222';
 item_id uuid='f3333333-3333-4333-8333-333333333333';
 proof bytea=convert_to('OPES INDEPENDENT CONTROL EVIDENCE','UTF8');
 hash text=encode(sha256(convert_to('OPES INDEPENDENT CONTROL EVIDENCE','UTF8')),'hex');
 pending_bytes bytea=convert_to('OPES UNVERIFIED EVIDENCE','UTF8');
 rec jsonb;found record;count_events integer;
BEGIN
 rec=opes_ci.ci_upload('GOV',eid,'governance-proof.txt','text/plain',proof,hash,
   'https://auth.opes.example/realm/ci','ops-poster-001');
 IF rec->>'status'<>'PENDING_REVIEW' OR rec->>'sha256'<>hash THEN
  RAISE EXCEPTION 'EVIDENCE_UPLOAD_DID_NOT_COMMIT';END IF;
 BEGIN
  PERFORM opes_ci.ci_verify_evidence('GOV',eid,'APPROVE',
   'https://auth.opes.example/realm/ci','ops-poster-001');
  RAISE EXCEPTION 'MAKER_SELF_VERIFIED_EVIDENCE';
 EXCEPTION WHEN insufficient_privilege THEN NULL;
 END;
 rec=opes_ci.ci_verify_evidence('GOV',eid,'APPROVE',
 'https://auth.opes.example/realm/ci','ops-checker-002');
 IF rec->>'status'<>'VERIFIED' THEN RAISE EXCEPTION 'EVIDENCE_CHECKER_FAILED';END IF;
 rec=opes_ci.ci_verify_evidence('GOV',eid,'APPROVE',
 'https://auth.opes.example/realm/ci','ops-checker-002');
 IF rec->>'status'<>'VERIFIED' THEN RAISE EXCEPTION 'EVIDENCE_IDEMPOTENT_RECHECK_FAILED';END IF;
 SELECT * INTO found FROM opes_ci.ci_get_evidence('GOV',eid,
 'https://auth.opes.example/realm/ci','ops-checker-002');
 IF found.data IS DISTINCT FROM proof OR found.checksum<>hash OR
   found.file_name<>'governance-proof.txt' OR found.status<>'VERIFIED' THEN
  RAISE EXCEPTION 'EVIDENCE_CONTENT_NOT_AUTHORITATIVE';END IF;
 BEGIN
  PERFORM opes_ci.ci_upload('GOV',
  'f4444444-4444-4444-8444-444444444444'::uuid,
  'tampered-proof.txt','text/plain',proof,repeat('a',64),
  'https://auth.opes.example/realm/ci','ops-poster-001');
  RAISE EXCEPTION 'ALTERED_HASH_ACCEPTED';
 EXCEPTION WHEN invalid_parameter_value THEN NULL;
 END;
 rec=opes_ci.ci_upload('GOV',pending_id,'pending-proof.txt','text/plain',
   pending_bytes,encode(sha256(pending_bytes),'hex'),
  'https://auth.opes.example/realm/ci','ops-poster-001');
 IF rec->>'status'<>'PENDING_REVIEW' THEN RAISE EXCEPTION 'PENDING_EVIDENCE_STATUS';END IF;
 BEGIN
  PERFORM opes_ci.ci_command('GOV',item_id,'CREATE',0,
    'NEW-GOV-RECORD-NOT-PERSISTED',
    '{"policyCode":"OPES-POLICY-OPS","policyRevision":2,"title":"Additional policy procedure","category":"OPERATIONS","effectiveDate":"2026-11-07","reviewDate":"2027-11-07","evidenceSha":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","ownerRef":"bank-policy-owner"}',
    NULL,NULL,'https://auth.opes.example/realm/ci','ops-poster-001');
  PERFORM opes_ci.ci_command('GOV',item_id,'SUBMIT',1,
    'NEW-GOV-UNVERIFIED-EVIDENCE',
    NULL,pending_id,NULL,'https://auth.opes.example/realm/ci','ops-poster-001');
  RAISE EXCEPTION 'UNVERIFIED_EVIDENCE_WAS_ACCEPTED';
 EXCEPTION WHEN check_violation THEN NULL;
 END;
 BEGIN
  EXECUTE 'DELETE FROM opes_core.ops_evidence';
  RAISE EXCEPTION 'DIRECT_RUNTIME_EVIDENCE_DELETE_ALLOWED';
 EXCEPTION WHEN insufficient_privilege THEN NULL;
 END;
END $evidence$;
SELECT 'SIX_MODULE_IMMUTABLE_BINARY_EVIDENCE_INTEGRITY_PASS';
