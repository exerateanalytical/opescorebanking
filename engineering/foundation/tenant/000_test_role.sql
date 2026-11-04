-- Test bootstrap only. In production, provision this NOLOGIN role externally.
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='opes_foundation_runtime') THEN
    CREATE ROLE opes_foundation_runtime NOLOGIN NOBYPASSRLS;
  END IF;
END $$;
