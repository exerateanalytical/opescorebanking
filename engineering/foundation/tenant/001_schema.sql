-- OPES Core Banking / tenant-foundation laboratory v0.1
-- NOT a production migration. For controlled PostgreSQL 16 integration tests.
-- Precondition: opes_foundation_runtime is a tightly held DB role; its login
-- must not be exposed to end users or arbitrary SQL execution.
BEGIN;
CREATE SCHEMA IF NOT EXISTS opes_tenant;
REVOKE ALL ON SCHEMA opes_tenant FROM PUBLIC;

CREATE OR REPLACE FUNCTION opes_tenant.current_institution_id()
RETURNS uuid LANGUAGE sql STABLE
AS $$ SELECT NULLIF(current_setting('opes.institution_id', true), '')::uuid $$;

-- Root institution provisioning belongs to a separate trusted control plane.
CREATE TABLE opes_tenant.institution (
  institution_id uuid PRIMARY KEY,
  institution_code varchar(24) NOT NULL UNIQUE
    CHECK (institution_code ~ '^[A-Z0-9][A-Z0-9_-]{1,23}$'),
  legal_name text NOT NULL CHECK (length(btrim(legal_name)) BETWEEN 2 AND 240),
  country_code char(2) NOT NULL CHECK (country_code ~ '^[A-Z]{2}$'),
  environment_class text NOT NULL
    CHECK (environment_class IN ('BANK_PRODUCTION','BANK_NONPRODUCTION')),
  lifecycle_state text NOT NULL DEFAULT 'PROVISIONING'
    CHECK (lifecycle_state IN ('PROVISIONING','ACTIVE','SUSPENDED','RETIRED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by_principal text NOT NULL CHECK (length(created_by_principal) BETWEEN 1 AND 160)
);

-- Composite primary/foreign keys are mandatory to prevent cross-institution joins.
CREATE TABLE opes_tenant.actor_membership (
  institution_id uuid NOT NULL REFERENCES opes_tenant.institution(institution_id),
  actor_id uuid NOT NULL,
  principal_subject text NOT NULL CHECK (length(principal_subject) BETWEEN 1 AND 180),
  role_code text NOT NULL CHECK (role_code ~ '^[A-Z][A-Z0-9_]{1,63}$'),
  membership_state text NOT NULL DEFAULT 'ACTIVE'
    CHECK (membership_state IN ('ACTIVE','SUSPENDED','REVOKED')),
  granted_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(institution_id,actor_id),
  UNIQUE(institution_id,principal_subject,role_code)
);

CREATE TABLE opes_tenant.policy_revision (
  institution_id uuid NOT NULL,
  policy_id uuid NOT NULL,
  revision_no integer NOT NULL CHECK (revision_no > 0),
  policy_key text NOT NULL CHECK (policy_key ~ '^[a-z][a-z0-9_.-]{2,95}$'),
  policy_document jsonb NOT NULL CHECK (jsonb_typeof(policy_document) = 'object'),
  lifecycle_state text NOT NULL DEFAULT 'DRAFT'
    CHECK (lifecycle_state IN ('DRAFT','UNDER_REVIEW','ACTIVE','SUPERSEDED','REJECTED')),
  proposed_by_actor uuid NOT NULL,
  reviewed_by_actor uuid,
  effective_from timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(institution_id,policy_id,revision_no),
  FOREIGN KEY(institution_id) REFERENCES opes_tenant.institution(institution_id),
  FOREIGN KEY(institution_id,proposed_by_actor)
    REFERENCES opes_tenant.actor_membership(institution_id,actor_id),
  FOREIGN KEY(institution_id,reviewed_by_actor)
    REFERENCES opes_tenant.actor_membership(institution_id,actor_id),
  CHECK (reviewed_by_actor IS NULL OR reviewed_by_actor <> proposed_by_actor),
  CHECK (lifecycle_state <> 'ACTIVE' OR
    (reviewed_by_actor IS NOT NULL AND effective_from IS NOT NULL))
);
CREATE UNIQUE INDEX policy_one_active_edition_per_tenant
  ON opes_tenant.policy_revision(institution_id,policy_key)
  WHERE lifecycle_state='ACTIVE';

-- Semantic keys are stable internally; printed regulatory account codes are
-- external, versioned classification data and may be unresolved.
CREATE TABLE opes_tenant.regulatory_mapping (
  institution_id uuid NOT NULL REFERENCES opes_tenant.institution(institution_id),
  mapping_id uuid NOT NULL,
  semantic_key text NOT NULL
    CHECK (semantic_key ~ '^[A-Z][A-Z0-9_]{2,95}$'),
  regulator_code text NOT NULL DEFAULT 'COBAC'
    CHECK (regulator_code ~ '^[A-Z][A-Z0-9_-]{1,31}$'),
  external_account_code text
    CHECK (external_account_code IS NULL OR
           external_account_code ~ '^[0-9A-Za-z_.-]{1,32}$'),
  interpretation_status text NOT NULL DEFAULT 'UNRESOLVED'
    CHECK (interpretation_status IN
      ('UNRESOLVED','SOURCE_OBSERVED','DOCUMENTED_INTERPRETATION')),
  lifecycle_state text NOT NULL DEFAULT 'DRAFT'
    CHECK (lifecycle_state IN ('DRAFT','ACTIVE','RETIRED')),
  source_url text,
  source_sha256 char(64) CHECK
    (source_sha256 IS NULL OR source_sha256 ~ '^[0-9a-f]{64}$'),
  evidence_note text,
  proposed_by_actor uuid NOT NULL,
  reviewed_by_actor uuid,
  effective_from timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(institution_id,mapping_id),
  FOREIGN KEY(institution_id,proposed_by_actor)
    REFERENCES opes_tenant.actor_membership(institution_id,actor_id),
  FOREIGN KEY(institution_id,reviewed_by_actor)
    REFERENCES opes_tenant.actor_membership(institution_id,actor_id),
  CHECK (reviewed_by_actor IS NULL OR reviewed_by_actor <> proposed_by_actor),
  CHECK (lifecycle_state <> 'ACTIVE' OR
    (interpretation_status='DOCUMENTED_INTERPRETATION' AND
     reviewed_by_actor IS NOT NULL AND effective_from IS NOT NULL AND
     source_sha256 IS NOT NULL AND external_account_code IS NOT NULL)),
  -- The official 2015 text is contradictory for the 312/322 short-term parent.
  -- Do not encode 312 as an ACTIVE short-term semantic classification.
  CHECK (NOT (lifecycle_state='ACTIVE'
    AND semantic_key='CREDIT_SENSITIVE_SHORT_TERM'
    AND external_account_code='312'))
);
CREATE UNIQUE INDEX regulatory_one_active_semantic_mapping
  ON opes_tenant.regulatory_mapping(institution_id,semantic_key)
  WHERE lifecycle_state='ACTIVE';

-- A compact append-only structural audit stub; not yet a WORM audit service.
CREATE TABLE opes_tenant.audit_event (
  institution_id uuid NOT NULL REFERENCES opes_tenant.institution(institution_id),
  event_id uuid NOT NULL,
  event_type text NOT NULL CHECK(event_type ~ '^[A-Z][A-Z0-9_.]{2,95}$'),
  actor_id uuid,
  object_type text NOT NULL CHECK (length(object_type) BETWEEN 1 AND 90),
  object_id uuid NOT NULL,
  payload_sha256 char(64) NOT NULL CHECK (payload_sha256 ~ '^[0-9a-f]{64}$'),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (institution_id,event_id)
);
CREATE INDEX actor_membership_subject_idx
  ON opes_tenant.actor_membership(institution_id,principal_subject);
CREATE INDEX policy_revision_lookup_idx
  ON opes_tenant.policy_revision(institution_id,policy_key,revision_no DESC);
CREATE INDEX regulatory_mapping_lookup_idx
  ON opes_tenant.regulatory_mapping(institution_id,regulator_code,semantic_key);
CREATE INDEX audit_event_time_idx
  ON opes_tenant.audit_event(institution_id,occurred_at DESC);

-- Active policy/mapping rows may be retired only through an explicitly
-- versioned transition in a future reviewed service, never silently edited.
CREATE OR REPLACE FUNCTION opes_tenant.reject_active_row_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.lifecycle_state='ACTIVE' THEN
    RAISE EXCEPTION 'Active rows are immutable; use a reviewed version transition'
      USING ERRCODE='23514';
  END IF;
  RETURN CASE WHEN TG_OP='DELETE' THEN OLD ELSE NEW END;
END $$;
CREATE TRIGGER block_active_policy_mutation
  BEFORE UPDATE OR DELETE ON opes_tenant.policy_revision
  FOR EACH ROW EXECUTE FUNCTION opes_tenant.reject_active_row_mutation();
CREATE TRIGGER block_active_mapping_mutation
  BEFORE UPDATE OR DELETE ON opes_tenant.regulatory_mapping
  FOR EACH ROW EXECUTE FUNCTION opes_tenant.reject_active_row_mutation();

-- RLS is a SECOND boundary. A GUC alone is NOT proof of identity:
-- the trusted API/gateway MUST validate the institution claim and disallow SQL.
-- Use distinct bank databases/keys/roles when feasible in production.
ALTER TABLE opes_tenant.institution ENABLE ROW LEVEL SECURITY;
ALTER TABLE opes_tenant.institution FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_institution_read ON opes_tenant.institution
  FOR SELECT TO opes_foundation_runtime
  USING (institution_id=opes_tenant.current_institution_id());

ALTER TABLE opes_tenant.actor_membership ENABLE ROW LEVEL SECURITY;
ALTER TABLE opes_tenant.actor_membership FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_actor_select ON opes_tenant.actor_membership
  FOR SELECT TO opes_foundation_runtime
  USING (institution_id=opes_tenant.current_institution_id());
CREATE POLICY tenant_actor_insert ON opes_tenant.actor_membership
  FOR INSERT TO opes_foundation_runtime
  WITH CHECK (institution_id=opes_tenant.current_institution_id());

ALTER TABLE opes_tenant.policy_revision ENABLE ROW LEVEL SECURITY;
ALTER TABLE opes_tenant.policy_revision FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_policy_select ON opes_tenant.policy_revision
  FOR SELECT TO opes_foundation_runtime
  USING (institution_id=opes_tenant.current_institution_id());
CREATE POLICY tenant_policy_insert ON opes_tenant.policy_revision
  FOR INSERT TO opes_foundation_runtime
  WITH CHECK (institution_id=opes_tenant.current_institution_id());

ALTER TABLE opes_tenant.regulatory_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE opes_tenant.regulatory_mapping FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_mapping_select ON opes_tenant.regulatory_mapping
  FOR SELECT TO opes_foundation_runtime
  USING (institution_id=opes_tenant.current_institution_id());
CREATE POLICY tenant_mapping_insert ON opes_tenant.regulatory_mapping
  FOR INSERT TO opes_foundation_runtime
  WITH CHECK (institution_id=opes_tenant.current_institution_id());

ALTER TABLE opes_tenant.audit_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE opes_tenant.audit_event FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_audit_select ON opes_tenant.audit_event
  FOR SELECT TO opes_foundation_runtime
  USING (institution_id=opes_tenant.current_institution_id());
CREATE POLICY tenant_audit_insert ON opes_tenant.audit_event
  FOR INSERT TO opes_foundation_runtime
  WITH CHECK (institution_id=opes_tenant.current_institution_id());

REVOKE ALL ON ALL TABLES IN SCHEMA opes_tenant FROM PUBLIC;
GRANT USAGE ON SCHEMA opes_tenant TO opes_foundation_runtime;
GRANT EXECUTE ON FUNCTION opes_tenant.current_institution_id()
  TO opes_foundation_runtime;
GRANT SELECT ON opes_tenant.institution TO opes_foundation_runtime;
GRANT SELECT,INSERT ON opes_tenant.actor_membership,
  opes_tenant.policy_revision,opes_tenant.regulatory_mapping,
  opes_tenant.audit_event TO opes_foundation_runtime;
COMMIT;
