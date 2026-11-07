-- CI ONLY: bank key and signing helper are disposable and never shipped.
\set ON_ERROR_STOP on
INSERT INTO opes_core.ops_signing_key(bank_id,secret,active,version)
VALUES('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',decode(repeat('ab',32),'hex'),true,1);
INSERT INTO opes_core.ops_grant(bank_id,issuer,subject_id,domain,operation,active,expires_at)
 SELECT 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'https://auth.opes.example/realm/ci','ops-poster-001',domain,action,true,
  clock_timestamp()+interval '2 hours'
 FROM opes_core.ops_definition CROSS JOIN (VALUES ('CREATE'),('SUBMIT'),('READ')) rights(action);
INSERT INTO opes_core.ops_grant(bank_id,issuer,subject_id,domain,operation,active,expires_at)
 SELECT 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'https://auth.opes.example/realm/ci','ops-checker-002',domain,action,true,
  clock_timestamp()+interval '2 hours'
 FROM opes_core.ops_definition CROSS JOIN (VALUES ('DECIDE'),('RETIRE'),('READ')) rights(action);
-- Isolate maker/checker check from simple role denial:
INSERT INTO opes_core.ops_grant(bank_id,issuer,subject_id,domain,operation,active,expires_at)
VALUES('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','https://auth.opes.example/realm/ci',
 'ops-poster-001','GOV','DECIDE',true,clock_timestamp()+interval '2 hours');
GRANT EXECUTE ON FUNCTION opes_core.ops_execute(
 text,uuid,text,integer,text,text,uuid,text,text,text,uuid,bigint,text)
 TO opes_prodtest_a,opes_prodtest_b,opes_prodtest_unbound;
GRANT EXECUTE ON FUNCTION opes_core.ops_read(
 text,uuid,text,text,integer,integer,text,text,uuid,bigint,text)
 TO opes_prodtest_a,opes_prodtest_b,opes_prodtest_unbound;
CREATE SCHEMA opes_ci;
GRANT USAGE ON SCHEMA opes_ci TO opes_prodtest_a,opes_prodtest_b,opes_prodtest_unbound;
CREATE FUNCTION opes_ci.ci_signature(
 p_bank uuid,p_operation text,p_domain text,p_item uuid,p_version integer,
 p_idem text,p_payload text,p_evidence uuid,p_decision text,
 p_issuer text,p_subject text,p_nonce uuid,p_expiry bigint
) RETURNS text LANGUAGE plpgsql AS $$
DECLARE msg text='OPES-OPS-v1'||chr(10); v text;
BEGIN
 FOREACH v IN ARRAY ARRAY[
 p_bank::text,p_operation,p_domain,p_item::text,p_version::text,p_idem,
 p_payload,p_evidence::text,p_decision,p_issuer,p_subject,
 p_nonce::text,p_expiry::text] LOOP
 v=coalesce(v,'');
 msg=msg||octet_length(v)::text||':'||v||chr(10);
 END LOOP;
 RETURN encode(public.hmac(convert_to(msg,'UTF8'),decode(repeat('ab',32),'hex'),'sha256'),'hex');
END $$;
CREATE FUNCTION opes_ci.ci_command(
 p_domain text,p_item uuid,p_op text,p_expected integer,p_key text,
 p_payload text,p_evidence uuid,p_decision text,p_issuer text,p_subject text
) RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE b uuid=opes_core.current_bank_id();n uuid=gen_random_uuid();
 e bigint=extract(epoch from clock_timestamp())::bigint+30;signature text;
BEGIN
 signature=opes_ci.ci_signature(b,p_op,p_domain,p_item,p_expected,p_key,p_payload,
 p_evidence,p_decision,p_issuer,p_subject,n,e);
 RETURN opes_core.ops_execute(p_domain,p_item,p_op,p_expected,p_key,p_payload,
 p_evidence,p_decision,p_issuer,p_subject,n,e,signature);
END $$;
CREATE FUNCTION opes_ci.ci_read(
 p_domain text,p_item uuid,p_op text,p_state text,p_limit integer,p_offset integer,
 p_issuer text,p_subject text
) RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE b uuid=opes_core.current_bank_id();n uuid=gen_random_uuid();
 e bigint=extract(epoch from clock_timestamp())::bigint+30;payload text;signature text;
BEGIN
 payload=jsonb_build_object('state',p_state,'limit',p_limit,'offset',p_offset)::text;
 signature=opes_ci.ci_signature(b,p_op,p_domain,p_item,0,'',payload,NULL,NULL,
 p_issuer,p_subject,n,e);
 RETURN opes_core.ops_read(p_domain,p_item,p_op,p_state,p_limit,p_offset,
 p_issuer,p_subject,n,e,signature);
END $$;
GRANT EXECUTE ON FUNCTION opes_ci.ci_signature(
 uuid,text,text,uuid,integer,text,text,uuid,text,text,text,uuid,bigint)
 TO opes_prodtest_a,opes_prodtest_b,opes_prodtest_unbound;
GRANT EXECUTE ON FUNCTION opes_ci.ci_command(
 text,uuid,text,integer,text,text,uuid,text,text,text)
 TO opes_prodtest_a,opes_prodtest_b,opes_prodtest_unbound;
GRANT EXECUTE ON FUNCTION opes_ci.ci_read(
 text,uuid,text,text,integer,integer,text,text)
 TO opes_prodtest_a,opes_prodtest_b,opes_prodtest_unbound;

-- Synthetic fixture evidence for each control operation. This is CI-only and
-- cannot create proof records in any live bank deployment.
INSERT INTO opes_core.ops_evidence(
 bank_id,domain,evidence_id,sha256_hex,original_name,content_type,content,
 status,creator_issuer,creator_subject,reviewer_issuer,reviewer_subject,reviewed_at)
SELECT 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid,d.domain,e.evidence_id,
 encode(sha256(convert_to('CI-ONLY-'||d.domain||'-'||e.evidence_id::text,'UTF8')),'hex'),
 'ci-proof.txt','text/plain',convert_to('CI-ONLY-'||d.domain||'-'||e.evidence_id::text,'UTF8'),
 'VERIFIED','https://auth.opes.example/realm/ci','ops-poster-001',
 'https://auth.opes.example/realm/ci','ops-checker-002',clock_timestamp()
FROM opes_core.ops_definition d CROSS JOIN (
 VALUES
 ('22222222-2222-4222-8222-222222222222'::uuid),
 ('33333333-3333-4333-8333-333333333333'::uuid),
 ('44444444-4444-4444-8444-444444444444'::uuid)
) AS e(evidence_id);
INSERT INTO opes_core.ops_grant(
 bank_id,issuer,subject_id,domain,operation,active,expires_at)
 SELECT 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
 'https://auth.opes.example/realm/ci','ops-poster-001',domain,'UPLOAD',true,
 clock_timestamp()+interval '2 hours'
 FROM opes_core.ops_definition;
INSERT INTO opes_core.ops_grant(
 bank_id,issuer,subject_id,domain,operation,active,expires_at)
 SELECT 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
 'https://auth.opes.example/realm/ci','ops-checker-002',domain,'VERIFY',true,
 clock_timestamp()+interval '2 hours'
 FROM opes_core.ops_definition;
INSERT INTO opes_core.ops_grant(
 bank_id,issuer,subject_id,domain,operation,active,expires_at)
 VALUES('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
 'https://auth.opes.example/realm/ci','ops-poster-001','GOV','VERIFY',
 true,clock_timestamp()+interval '2 hours');
GRANT EXECUTE ON FUNCTION opes_core.ops_upload_evidence(
 text,uuid,text,text,bytea,text,text,text,uuid,bigint,text)
 TO opes_prodtest_a,opes_prodtest_b,opes_prodtest_unbound;
GRANT EXECUTE ON FUNCTION opes_core.ops_verify_evidence(
 text,uuid,text,text,text,uuid,bigint,text)
 TO opes_prodtest_a,opes_prodtest_b,opes_prodtest_unbound;
GRANT EXECUTE ON FUNCTION opes_core.ops_get_evidence(
 text,uuid,text,text,uuid,bigint,text)
 TO opes_prodtest_a,opes_prodtest_b,opes_prodtest_unbound;

CREATE FUNCTION opes_ci.ci_upload(
 p_domain text,p_id uuid,p_name text,p_mime text,p_bytes bytea,
 p_sha text,p_issuer text,p_subject text)
RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE b uuid=opes_core.current_bank_id();n uuid=gen_random_uuid();
 exp bigint=extract(epoch from clock_timestamp())::bigint+30;sig text;
BEGIN
 sig=opes_ci.ci_signature(b,'UPLOAD',p_domain,p_id,0,p_id::text,
   p_sha||':'||p_name||':'||p_mime,NULL,NULL,p_issuer,p_subject,n,exp);
 RETURN opes_core.ops_upload_evidence(p_domain,p_id,p_name,p_mime,p_bytes,
   p_sha,p_issuer,p_subject,n,exp,sig);
END $$;
CREATE FUNCTION opes_ci.ci_verify_evidence(
 p_domain text,p_id uuid,p_decision text,p_issuer text,p_subject text)
RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE b uuid=opes_core.current_bank_id();n uuid=gen_random_uuid();
 exp bigint=extract(epoch from clock_timestamp())::bigint+30;sig text;
BEGIN
 sig=opes_ci.ci_signature(b,'VERIFY',p_domain,p_id,0,p_id::text,
   NULL,NULL,p_decision,p_issuer,p_subject,n,exp);
 RETURN opes_core.ops_verify_evidence(p_domain,p_id,p_decision,p_issuer,p_subject,n,exp,sig);
END $$;
CREATE FUNCTION opes_ci.ci_get_evidence(
 p_domain text,p_id uuid,p_issuer text,p_subject text)
RETURNS TABLE(file_name text,media_type text,checksum text,data bytea,status text)
 LANGUAGE plpgsql AS $$
DECLARE b uuid=opes_core.current_bank_id();n uuid=gen_random_uuid();
 exp bigint=extract(epoch from clock_timestamp())::bigint+30;sig text;
BEGIN
 sig=opes_ci.ci_signature(b,'EVIDENCE_READ',p_domain,p_id,0,p_id::text,
   NULL,NULL,NULL,p_issuer,p_subject,n,exp);
 RETURN QUERY SELECT * FROM opes_core.ops_get_evidence(
  p_domain,p_id,p_issuer,p_subject,n,exp,sig);
END $$;
GRANT EXECUTE ON FUNCTION opes_ci.ci_upload(
 text,uuid,text,text,bytea,text,text,text) TO opes_prodtest_a,opes_prodtest_b,opes_prodtest_unbound;
GRANT EXECUTE ON FUNCTION opes_ci.ci_verify_evidence(
 text,uuid,text,text,text) TO opes_prodtest_a,opes_prodtest_b,opes_prodtest_unbound;
GRANT EXECUTE ON FUNCTION opes_ci.ci_get_evidence(
 text,uuid,text,text) TO opes_prodtest_a,opes_prodtest_b,opes_prodtest_unbound;
