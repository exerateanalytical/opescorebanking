-- Security hardening migration for foundation test only:
-- RLS tenant identity is no longer a client-controlled PostgreSQL setting.
-- The connection's authenticated SESSION_USER maps to a single institution.
-- No LOGIN role may be a member of another bank's login role.
BEGIN;
CREATE TABLE opes_tenant.database_login_binding (
    login_name name PRIMARY KEY,
    institution_id uuid NOT NULL
        REFERENCES opes_tenant.institution(institution_id),
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (institution_id)
);
REVOKE ALL ON opes_tenant.database_login_binding FROM PUBLIC;
REVOKE ALL ON opes_tenant.database_login_binding FROM opes_foundation_runtime;

CREATE OR REPLACE FUNCTION opes_tenant.current_institution_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path=pg_catalog,opes_tenant
AS $$
    SELECT db.institution_id
      FROM opes_tenant.database_login_binding AS db
     WHERE db.login_name = session_user::name
$$;
REVOKE ALL ON FUNCTION opes_tenant.current_institution_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION opes_tenant.current_institution_id()
  TO opes_foundation_runtime;
COMMENT ON FUNCTION opes_tenant.current_institution_id() IS
  'Trusted connection principal identity only: SESSION_USER -> security-owned binding. Never use mutable app.institution_id for RLS.';

-- The original table RLS policies already reference this function and therefore
-- adopt the hardened authenticated-login binding without weakening RLS.
-- In a real deployment, login role provisioning, secrets and bindings must be
-- controlled by OPESWARE provisioning and separate per-bank vault policies.
COMMIT;
