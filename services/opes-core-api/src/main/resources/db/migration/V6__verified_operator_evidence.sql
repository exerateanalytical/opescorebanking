-- V6: institution-scoped content-addressed operator evidence.
-- Actual evidence bytes, independent verification, and immutable provenance.
CREATE TABLE opes_core.ops_evidence (
 bank_id uuid NOT NULL REFERENCES opes_core.institution(bank_id),
 domain text NOT NULL REFERENCES opes_core.ops_definition(domain),
 evidence_id uuid NOT NULL,
 sha256_hex text NOT NULL CHECK(sha256_hex ~ '^[0-9a-f]{64}$'),
 original_name text NOT NULL CHECK(original_name ~ '^[A-Za-z0-9._-]{3,140}$'),
 content_type text NOT NULL CHECK(content_type IN (
  'application/pdf','application/json','text/plain','image/png','image/jpeg'
 )),
 content bytea NOT NULL CHECK(octet_length(content) BETWEEN 1 AND 1048576),
 status text NOT NULL DEFAULT 'PENDING_REVIEW'
   CHECK(status IN ('PENDING_REVIEW','VERIFIED','REJECTED')),
 creator_issuer text NOT NULL, creator_subject text NOT NULL,
 reviewer_issuer text, reviewer_subject text,
 reviewed_at timestamptz,created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 PRIMARY KEY(bank_id,domain,evidence_id),
 CHECK(sha256_hex=encode(sha256(content),'hex')),
 CHECK((reviewer_issuer IS NULL)=(reviewer_subject IS NULL)),
 CHECK(status='PENDING_REVIEW' OR reviewer_subject IS NOT NULL),
 FOREIGN KEY(bank_id,creator_issuer,creator_subject)
  REFERENCES opes_core.actor_membership(bank_id,issuer,subject_id)
);
CREATE TABLE opes_core.ops_evidence_audit (
 bank_id uuid NOT NULL,domain text NOT NULL,evidence_id uuid NOT NULL,
 event_id uuid NOT NULL DEFAULT gen_random_uuid(),
 event_type text NOT NULL CHECK(event_type IN('EVIDENCE_UPLOADED','EVIDENCE_VERIFIED','EVIDENCE_REJECTED')),
 actor_issuer text NOT NULL,actor_subject text NOT NULL,
 occurred_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 PRIMARY KEY(bank_id,event_id),
 FOREIGN KEY(bank_id,domain,evidence_id)
 REFERENCES opes_core.ops_evidence(bank_id,domain,evidence_id)
);
CREATE TRIGGER immutable_evidence_audit BEFORE UPDATE OR DELETE
 ON opes_core.ops_evidence_audit FOR EACH ROW
 EXECUTE FUNCTION opes_core.reject_immutable_change();
CREATE FUNCTION opes_core.ops_evidence_immutable_payload() RETURNS trigger
 LANGUAGE plpgsql SET search_path=pg_catalog,pg_temp AS $$
BEGIN
 IF TG_OP='DELETE' THEN
  RAISE EXCEPTION 'IMMUTABLE_EVIDENCE_DELETE' USING ERRCODE='23514';
 END IF;
 IF ROW(NEW.bank_id,NEW.domain,NEW.evidence_id,NEW.sha256_hex,NEW.original_name,
  NEW.content_type,NEW.content,NEW.creator_issuer,NEW.creator_subject,NEW.created_at)
  IS DISTINCT FROM ROW(OLD.bank_id,OLD.domain,OLD.evidence_id,OLD.sha256_hex,OLD.original_name,
  OLD.content_type,OLD.content,OLD.creator_issuer,OLD.creator_subject,OLD.created_at) THEN
  RAISE EXCEPTION 'IMMUTABLE_EVIDENCE_CONTENT' USING ERRCODE='23514';
 END IF;
 IF OLD.status<>'PENDING_REVIEW' OR
    NEW.status NOT IN('VERIFIED','REJECTED') OR
    NEW.reviewer_subject IS NULL OR NEW.reviewer_issuer IS NULL OR NEW.reviewed_at IS NULL THEN
  RAISE EXCEPTION 'INVALID_EVIDENCE_REVIEW_TRANSITION' USING ERRCODE='23514';
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER immutable_evidence_content BEFORE UPDATE OR DELETE ON opes_core.ops_evidence
 FOR EACH ROW EXECUTE FUNCTION opes_core.ops_evidence_immutable_payload();
ALTER TABLE opes_core.ops_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE opes_core.ops_evidence FORCE ROW LEVEL SECURITY;
CREATE POLICY evidence_bank_scope ON opes_core.ops_evidence
 USING(bank_id=opes_core.current_bank_id()) WITH CHECK(bank_id=opes_core.current_bank_id());
ALTER TABLE opes_core.ops_evidence_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE opes_core.ops_evidence_audit FORCE ROW LEVEL SECURITY;
CREATE POLICY evidence_audit_scope ON opes_core.ops_evidence_audit
 USING(bank_id=opes_core.current_bank_id()) WITH CHECK(bank_id=opes_core.current_bank_id());

ALTER TABLE opes_core.ops_grant DROP CONSTRAINT ops_grant_operation_check;
ALTER TABLE opes_core.ops_grant ADD CONSTRAINT ops_grant_operation_check
 CHECK(operation IN('CREATE','SUBMIT','DECIDE','RETIRE','READ','UPLOAD','VERIFY'));

-- This BEFORE UPDATE trigger makes arbitrary evidence UUIDs unusable for any
-- of the 6 existing maker-checker transitions.
CREATE FUNCTION opes_core.ops_require_verified_evidence() RETURNS trigger
 LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $$
DECLARE identifier uuid;
BEGIN
 IF NEW.submission_evidence IS DISTINCT FROM OLD.submission_evidence THEN
  identifier=NEW.submission_evidence;
 ELSIF NEW.decision_evidence IS DISTINCT FROM OLD.decision_evidence THEN
  identifier=NEW.decision_evidence;
 ELSIF NEW.retirement_evidence IS DISTINCT FROM OLD.retirement_evidence THEN
  identifier=NEW.retirement_evidence;
 ELSE RETURN NEW;END IF;
 IF identifier IS NULL OR NOT EXISTS (
  SELECT 1 FROM opes_core.ops_evidence
  WHERE bank_id=NEW.bank_id AND domain=NEW.domain
   AND evidence_id=identifier AND status='VERIFIED'
 ) THEN
  RAISE EXCEPTION 'INDEPENDENTLY_VERIFIED_EVIDENCE_REQUIRED' USING ERRCODE='23514';
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER ops_transition_verified_evidence BEFORE UPDATE ON opes_core.ops_item
 FOR EACH ROW EXECUTE FUNCTION opes_core.ops_require_verified_evidence();

CREATE FUNCTION opes_core.ops_upload_evidence(
 p_domain text,p_id uuid,p_file text,p_type text,p_bytes bytea,p_sha text,
 p_issuer text,p_subject text,p_nonce uuid,p_expiry bigint,p_mac text
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $$
DECLARE b uuid=opes_core.current_bank_id();signed_payload text;result jsonb;
BEGIN
 IF b IS NULL THEN RAISE EXCEPTION 'UNBOUND_EVIDENCE_BANK' USING ERRCODE='42501';END IF;
 IF p_domain NOT IN('GOV','ARC','TST','INF','DR','REL') OR p_id IS NULL OR
  p_file IS NULL OR p_file !~ '^[A-Za-z0-9._-]{3,140}$' OR
  p_type NOT IN('application/pdf','application/json','text/plain','image/png','image/jpeg') OR
  p_bytes IS NULL OR octet_length(p_bytes) NOT BETWEEN 1 AND 1048576 OR
  p_sha IS NULL OR p_sha !~ '^[0-9a-f]{64}$' OR
  p_sha<>encode(sha256(p_bytes),'hex') THEN
  RAISE EXCEPTION 'INVALID_EVIDENCE_CONTENT_OR_HASH' USING ERRCODE='22023';END IF;
 signed_payload=p_sha||':'||p_file||':'||p_type;
 PERFORM opes_core.ops_verify_attestation(b,'UPLOAD',p_domain,p_id,0,
  p_id::text,signed_payload,NULL,NULL,p_issuer,p_subject,p_nonce,p_expiry,p_mac);
 PERFORM opes_core.ops_assert_permission(b,p_domain,'UPLOAD',p_issuer,p_subject);
 INSERT INTO opes_core.ops_evidence(
  bank_id,domain,evidence_id,sha256_hex,original_name,content_type,content,
  creator_issuer,creator_subject)
 VALUES(b,p_domain,p_id,p_sha,p_file,p_type,p_bytes,p_issuer,p_subject);
 INSERT INTO opes_core.ops_evidence_audit(bank_id,domain,evidence_id,event_type,
    actor_issuer,actor_subject)
 VALUES(b,p_domain,p_id,'EVIDENCE_UPLOADED',p_issuer,p_subject);
 result=jsonb_build_object('evidenceId',p_id::text,'domain',p_domain,'sha256',p_sha,
    'status','PENDING_REVIEW','bytes',octet_length(p_bytes));
 RETURN result;
END $$;
REVOKE ALL ON FUNCTION opes_core.ops_upload_evidence(
 text,uuid,text,text,bytea,text,text,text,uuid,bigint,text) FROM PUBLIC;

CREATE FUNCTION opes_core.ops_verify_evidence(
 p_domain text,p_id uuid,p_decision text,p_issuer text,p_subject text,
 p_nonce uuid,p_expiry bigint,p_mac text
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $$
DECLARE b uuid=opes_core.current_bank_id();previous record;next_status text;result jsonb;
BEGIN
 IF b IS NULL THEN RAISE EXCEPTION 'UNBOUND_EVIDENCE_BANK' USING ERRCODE='42501';END IF;
 IF p_domain NOT IN('GOV','ARC','TST','INF','DR','REL') OR p_id IS NULL
    OR p_decision IS NULL OR p_decision NOT IN('APPROVE','REJECT') THEN
  RAISE EXCEPTION 'INVALID_EVIDENCE_DECISION' USING ERRCODE='22023';END IF;
 PERFORM opes_core.ops_verify_attestation(b,'VERIFY',p_domain,p_id,0,
  p_id::text,NULL,NULL,p_decision,p_issuer,p_subject,p_nonce,p_expiry,p_mac);
 PERFORM opes_core.ops_assert_permission(b,p_domain,'VERIFY',p_issuer,p_subject);
 SELECT * INTO previous FROM opes_core.ops_evidence
 WHERE bank_id=b AND domain=p_domain AND evidence_id=p_id FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'EVIDENCE_RECORD_NOT_FOUND' USING ERRCODE='23514';END IF;
 IF previous.creator_issuer=p_issuer AND previous.creator_subject=p_subject THEN
  RAISE EXCEPTION 'INDEPENDENT_EVIDENCE_REVIEW_REQUIRED' USING ERRCODE='42501';END IF;
 next_status=CASE WHEN p_decision='APPROVE' THEN 'VERIFIED' ELSE 'REJECTED' END;
 IF previous.status=next_status AND previous.reviewer_issuer=p_issuer AND
    previous.reviewer_subject=p_subject THEN
  RETURN jsonb_build_object('evidenceId',p_id::text,'domain',p_domain,
    'status',next_status,'sha256',previous.sha256_hex);
 END IF;
 IF previous.status<>'PENDING_REVIEW' THEN
   RAISE EXCEPTION 'EVIDENCE_DECISION_ALREADY_FINAL' USING ERRCODE='23505';END IF;
 UPDATE opes_core.ops_evidence SET status=next_status,
  reviewer_issuer=p_issuer,reviewer_subject=p_subject,reviewed_at=clock_timestamp()
 WHERE bank_id=b AND domain=p_domain AND evidence_id=p_id;
 INSERT INTO opes_core.ops_evidence_audit(bank_id,domain,evidence_id,event_type,
   actor_issuer,actor_subject)
 VALUES(b,p_domain,p_id,'EVIDENCE_'||next_status,p_issuer,p_subject);
 result=jsonb_build_object('evidenceId',p_id::text,'domain',p_domain,
  'status',next_status,'sha256',previous.sha256_hex);
 RETURN result;
END $$;
REVOKE ALL ON FUNCTION opes_core.ops_verify_evidence(
 text,uuid,text,text,text,uuid,bigint,text) FROM PUBLIC;

-- Attested content access is restricted to actors with READ entitlement; never
-- exposed as a public signed URL or loaded inline by web UI.
CREATE FUNCTION opes_core.ops_get_evidence(
 p_domain text,p_id uuid,p_issuer text,p_subject text,
 p_nonce uuid,p_expiry bigint,p_mac text
) RETURNS TABLE(file_name text,media_type text,checksum text,data bytea,status text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $$
DECLARE b uuid=opes_core.current_bank_id();
BEGIN
 IF b IS NULL THEN RAISE EXCEPTION 'UNBOUND_EVIDENCE_BANK' USING ERRCODE='42501';END IF;
 IF p_id IS NULL OR p_domain NOT IN('GOV','ARC','TST','INF','DR','REL') THEN
  RAISE EXCEPTION 'INVALID_EVIDENCE_QUERY' USING ERRCODE='22023';END IF;
 PERFORM opes_core.ops_verify_attestation(b,'EVIDENCE_READ',p_domain,p_id,0,
  p_id::text,NULL,NULL,NULL,p_issuer,p_subject,p_nonce,p_expiry,p_mac);
 PERFORM opes_core.ops_assert_permission(b,p_domain,'READ',p_issuer,p_subject);
 RETURN QUERY
 SELECT original_name,content_type,sha256_hex,content,e.status
 FROM opes_core.ops_evidence e
 WHERE e.bank_id=b AND e.domain=p_domain AND e.evidence_id=p_id;
END $$;
REVOKE ALL ON FUNCTION opes_core.ops_get_evidence(
 text,uuid,text,text,uuid,bigint,text) FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA opes_core FROM PUBLIC;
