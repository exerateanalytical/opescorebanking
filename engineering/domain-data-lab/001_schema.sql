-- OPES Core Banking four-domain relational foundation.
-- PostgreSQL 16, synthetic-only. NOT a production migration.
-- The trusted authenticated SESSION_USER RLS binding is installed by
-- engineering/foundation/tenant/002_authenticated_principal_binding.sql.
BEGIN;
CREATE SCHEMA IF NOT EXISTS opes_domains;
REVOKE ALL ON SCHEMA opes_domains FROM PUBLIC;

CREATE TABLE opes_domains.cif_party (
  institution_id uuid NOT NULL,
  party_id uuid NOT NULL,
  party_type text NOT NULL CHECK (party_type IN ('INDIVIDUAL','LEGAL_ENTITY')),
  legal_name text NOT NULL CHECK (length(btrim(legal_name)) BETWEEN 2 AND 240),
  residence_country char(2) NOT NULL CHECK (residence_country ~ '^[A-Z]{2}$'),
  party_state text NOT NULL DEFAULT 'PROSPECT'
    CHECK (party_state IN ('PROSPECT','KYC_PENDING','VERIFIED','INACTIVE')),
  row_version bigint NOT NULL DEFAULT 1 CHECK (row_version>0),
  created_by_actor uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(institution_id,party_id),
  FOREIGN KEY(institution_id) REFERENCES opes_tenant.institution(institution_id),
  FOREIGN KEY(institution_id,created_by_actor)
    REFERENCES opes_tenant.actor_membership(institution_id,actor_id)
);

CREATE TABLE opes_domains.cif_kyc_case (
  institution_id uuid NOT NULL,
  kyc_case_id uuid NOT NULL,
  party_id uuid NOT NULL,
  screening_reference uuid NOT NULL,
  document_evidence_reference uuid NOT NULL,
  case_state text NOT NULL DEFAULT 'DRAFT'
    CHECK (case_state IN ('DRAFT','SUBMITTED','UNDER_REVIEW','APPROVED','REJECTED','EXPIRED')),
  revision bigint NOT NULL DEFAULT 1 CHECK (revision>0),
  requested_by_actor uuid NOT NULL,
  reviewed_by_actor uuid,
  opened_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(institution_id,kyc_case_id),
  UNIQUE(institution_id,party_id,kyc_case_id),
  FOREIGN KEY(institution_id,party_id)
    REFERENCES opes_domains.cif_party(institution_id,party_id),
  FOREIGN KEY(institution_id,requested_by_actor)
    REFERENCES opes_tenant.actor_membership(institution_id,actor_id),
  FOREIGN KEY(institution_id,reviewed_by_actor)
    REFERENCES opes_tenant.actor_membership(institution_id,actor_id),
  CHECK (reviewed_by_actor IS NULL OR reviewed_by_actor<>requested_by_actor),
  CHECK (case_state NOT IN ('APPROVED','REJECTED') OR reviewed_by_actor IS NOT NULL)
);

CREATE TABLE opes_domains.prd_product (
  institution_id uuid NOT NULL,
  product_id uuid NOT NULL,
  product_code text NOT NULL CHECK (product_code ~ '^[A-Z][A-Z0-9_]{2,31}$'),
  product_type text NOT NULL
    CHECK (product_type IN ('CURRENT','SAVINGS','TERM_DEPOSIT','CREDIT_LINE')),
  currency char(3) NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  title text NOT NULL CHECK (length(btrim(title)) BETWEEN 3 AND 120),
  state text NOT NULL DEFAULT 'DRAFT' CHECK(state IN ('DRAFT','RETIRED')),
  created_by_actor uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(institution_id,product_id),
  UNIQUE(institution_id,product_code),
  FOREIGN KEY(institution_id) REFERENCES opes_tenant.institution(institution_id),
  FOREIGN KEY(institution_id,created_by_actor)
    REFERENCES opes_tenant.actor_membership(institution_id,actor_id)
);

CREATE TABLE opes_domains.prd_product_revision (
  institution_id uuid NOT NULL,
  product_id uuid NOT NULL,
  revision_no integer NOT NULL CHECK(revision_no>=1),
  min_opening_minor bigint NOT NULL CHECK (min_opening_minor>=0),
  annual_rate_basis_points integer
    CHECK (annual_rate_basis_points BETWEEN 0 AND 100000),
  eligibility_policy_id uuid NOT NULL,
  effective_from date NOT NULL,
  revision_state text NOT NULL DEFAULT 'DRAFT'
    CHECK (revision_state IN ('DRAFT','UNDER_REVIEW','APPROVED','REJECTED')),
  maker_actor uuid NOT NULL,
  checker_actor uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(institution_id,product_id,revision_no),
  FOREIGN KEY(institution_id,product_id)
    REFERENCES opes_domains.prd_product(institution_id,product_id),
  FOREIGN KEY(institution_id,maker_actor)
    REFERENCES opes_tenant.actor_membership(institution_id,actor_id),
  FOREIGN KEY(institution_id,checker_actor)
    REFERENCES opes_tenant.actor_membership(institution_id,actor_id),
  CHECK (checker_actor IS NULL OR maker_actor<>checker_actor),
  CHECK (revision_state NOT IN ('APPROVED','REJECTED') OR checker_actor IS NOT NULL)
);

-- Accounts are creation REQUESTS only. OPEN/ACTIVE and customer balances
-- MUST NOT be fabricated from these rows. No balance column exists.
CREATE TABLE opes_domains.act_account_request (
  institution_id uuid NOT NULL,
  account_request_id uuid NOT NULL,
  party_id uuid NOT NULL,
  product_id uuid NOT NULL,
  product_revision_no integer NOT NULL CHECK (product_revision_no>=1),
  kyc_case_id uuid NOT NULL,
  account_purpose text NOT NULL
    CHECK (account_purpose IN ('PERSONAL','BUSINESS','TREASURY_INTERNAL')),
  state text NOT NULL DEFAULT 'REQUESTED'
    CHECK (state IN ('REQUESTED','PENDING_REVIEW','REJECTED')),
  created_by_actor uuid NOT NULL,
  requested_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(institution_id,account_request_id),
  FOREIGN KEY(institution_id,party_id)
    REFERENCES opes_domains.cif_party(institution_id,party_id),
  FOREIGN KEY(institution_id,party_id,kyc_case_id)
    REFERENCES opes_domains.cif_kyc_case(institution_id,party_id,kyc_case_id),
  FOREIGN KEY(institution_id,product_id,product_revision_no)
    REFERENCES opes_domains.prd_product_revision(institution_id,product_id,revision_no),
  FOREIGN KEY(institution_id,created_by_actor)
    REFERENCES opes_tenant.actor_membership(institution_id,actor_id)
);

-- Draft ledger journal metadata: deliberately no POSTED state. A validated
-- *proposal* is not an authoritative financial transaction.
CREATE TABLE opes_domains.led_journal_proposal (
  institution_id uuid NOT NULL,
  journal_id uuid NOT NULL,
  source_reference text NOT NULL CHECK (length(source_reference) BETWEEN 3 AND 160),
  posting_rule_revision_id uuid NOT NULL,
  journal_state text NOT NULL DEFAULT 'DRAFT'
    CHECK(journal_state IN ('DRAFT','VALIDATED','REJECTED')),
  proposed_by_actor uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(institution_id,journal_id),
  UNIQUE(institution_id,source_reference),
  FOREIGN KEY(institution_id) REFERENCES opes_tenant.institution(institution_id),
  FOREIGN KEY(institution_id,proposed_by_actor)
    REFERENCES opes_tenant.actor_membership(institution_id,actor_id)
);

CREATE TABLE opes_domains.led_journal_line_proposal (
  institution_id uuid NOT NULL,
  journal_id uuid NOT NULL,
  line_number integer NOT NULL CHECK(line_number BETWEEN 1 AND 500),
  account_request_id uuid NOT NULL,
  side text NOT NULL CHECK(side IN ('DEBIT','CREDIT')),
  currency char(3) NOT NULL CHECK(currency ~ '^[A-Z]{3}$'),
  amount_minor bigint NOT NULL CHECK(amount_minor BETWEEN 1 AND 9000000000000000),
  PRIMARY KEY(institution_id,journal_id,line_number),
  FOREIGN KEY(institution_id,journal_id)
    REFERENCES opes_domains.led_journal_proposal(institution_id,journal_id),
  FOREIGN KEY(institution_id,account_request_id)
    REFERENCES opes_domains.act_account_request(institution_id,account_request_id)
);
-- Journal proposals are not posted funds. Currency balancing is evaluated
-- by the journal validation service before any future posting boundary exists.

CREATE INDEX cif_party_state_by_bank ON opes_domains.cif_party(institution_id,party_state);
CREATE INDEX cif_case_party_by_bank ON opes_domains.cif_kyc_case(institution_id,party_id,case_state);
CREATE INDEX prd_revision_lookup_by_bank ON opes_domains.prd_product_revision(institution_id,product_id,revision_no DESC);
CREATE INDEX act_requests_by_party ON opes_domains.act_account_request(institution_id,party_id,state);
CREATE INDEX ledger_proposals_by_bank ON opes_domains.led_journal_proposal(institution_id,journal_state,created_at DESC);

-- A single authenticated bank principal is the RLS trust root.
-- Exactly six domain tables are covered, with no owner/service bypass.
DO $$
DECLARE tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
     'cif_party','cif_kyc_case','prd_product','prd_product_revision',
     'act_account_request','led_journal_proposal','led_journal_line_proposal'
  ] LOOP
    EXECUTE format('ALTER TABLE opes_domains.%I ENABLE ROW LEVEL SECURITY',tbl);
    EXECUTE format('ALTER TABLE opes_domains.%I FORCE ROW LEVEL SECURITY',tbl);
    EXECUTE format(
      'CREATE POLICY %I ON opes_domains.%I TO opes_foundation_runtime USING (institution_id=opes_tenant.current_institution_id()) WITH CHECK (institution_id=opes_tenant.current_institution_id())',
      'tenant_scope_'||tbl,tbl
    );
  END LOOP;
END $$;
GRANT USAGE ON SCHEMA opes_domains TO opes_foundation_runtime;
REVOKE ALL ON ALL TABLES IN SCHEMA opes_domains FROM PUBLIC;
GRANT SELECT,INSERT ON ALL TABLES IN SCHEMA opes_domains TO opes_foundation_runtime;
-- No UPDATE/DELETE to a bank runtime role: all later state changes require
-- explicit reviewed command handlers and controlled append-only provenance.
COMMIT;
