-- Synthetic authorization-fence experiment only. NOT banking posting DDL.
BEGIN;
CREATE SCHEMA IF NOT EXISTS opes_security_lab;
CREATE TABLE opes_security_lab.membership (
  membership_id uuid PRIMARY KEY,
  institution_id uuid NOT NULL,
  actor_id uuid NOT NULL,
  permission_code text NOT NULL CHECK (permission_code ~ '^[a-z_:.]+$'),
  state text NOT NULL DEFAULT 'ACTIVE' CHECK (state IN ('ACTIVE','REVOKED')),
  institution_state text NOT NULL DEFAULT 'ACTIVE'
    CHECK (institution_state IN ('ACTIVE','SUSPENDED')),
  revision bigint NOT NULL DEFAULT 1 CHECK (revision>0),
  revoked_at timestamptz,
  UNIQUE (membership_id,institution_id),
  CHECK ((state='ACTIVE' AND revoked_at IS NULL) OR state='REVOKED')
);
CREATE TABLE opes_security_lab.authority_lease (
  lease_id uuid PRIMARY KEY,
  membership_id uuid NOT NULL REFERENCES opes_security_lab.membership(membership_id),
  institution_id uuid NOT NULL,
  command_id uuid NOT NULL,
  command_digest char(64) NOT NULL CHECK(command_digest ~ '^[a-f0-9]{64}$'),
  issuer text NOT NULL,
  jti uuid NOT NULL,
  membership_revision bigint NOT NULL,
  idempotency_key text NOT NULL CHECK(length(idempotency_key) BETWEEN 16 AND 128),
  state text NOT NULL DEFAULT 'ISSUED'
    CHECK(state IN ('ISSUED','REDEEMED','EXECUTED','CANCELLED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (membership_id,idempotency_key),
  UNIQUE (issuer,jti),
  UNIQUE (membership_id,command_id),
  FOREIGN KEY (membership_id,institution_id)
    REFERENCES opes_security_lab.membership(membership_id,institution_id)
);
CREATE TABLE opes_security_lab.redemption (
  issuer text NOT NULL,
  jti uuid NOT NULL,
  lease_id uuid NOT NULL UNIQUE REFERENCES opes_security_lab.authority_lease(lease_id),
  redeemed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(issuer,jti)
);
CREATE TABLE opes_security_lab.synthetic_effect (
  membership_id uuid NOT NULL REFERENCES opes_security_lab.membership(membership_id),
  command_id uuid NOT NULL,
  command_digest char(64) NOT NULL,
  written_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (membership_id,command_id)
);
COMMIT;
