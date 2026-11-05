#!/usr/bin/env bash
# SEC-LED-LAB-005: synthetic concurrent PostgreSQL race/crash harness.
# No real bank data. Use ONLY disposable PG16, with 001-004 and fixture applied.
set -euo pipefail
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
pg() { psql -X -A -t -v ON_ERROR_STOP=1 -c "$1"; }
wait_sleeping() {
  local name="$1" n
  for n in $(seq 1 150); do
    local active
    active="$(pg "SELECT count(*) FROM pg_stat_activity WHERE application_name='$name' AND state='active' AND query LIKE '%pg_sleep%';")"
    if [[ "$active" == "1" ]]; then return 0; fi
    sleep 0.1
  done
  echo "ERROR: timed out waiting for $name" >&2
  return 1
}
lines='[{"account_id":"30000000-0000-4000-8000-000000000051","debit_minor":400,"credit_minor":0},{"account_id":"30000000-0000-4000-8000-000000000052","debit_minor":0,"credit_minor":400}]'

# A commits a protected command while retaining the membership/account row locks.
psql -X -v ON_ERROR_STOP=1 >"$tmp/lock_holder.log" 2>&1 <<SQL &
SET application_name = 'opes_revocation_lock_holder';
SET SESSION AUTHORIZATION opes_lock_holder_lab;
BEGIN;
SELECT ledger_lab.post_synthetic_bank_journal(
 '50000000-0000-4000-8000-000000000051',1,
 '60000000-0000-4000-8000-000000000051','concurrent-key-0051',
 '70000000-0000-4000-8000-000000000051',
 '80000000-0000-4000-8000-000000000051','XAF','$lines'::jsonb);
SELECT pg_sleep(8);
COMMIT;
SQL
holder=$!
if ! wait_sleeping 'opes_revocation_lock_holder'; then cat "$tmp/lock_holder.log"; exit 1; fi

# Revocation must not overtake a posting holding the membership row lock.
set +e
psql -X -v ON_ERROR_STOP=1 -c "SET statement_timeout='500ms'; UPDATE ledger_lab.member_authority SET state='REVOKED',revision=2,revoked_at=now() WHERE membership_id='50000000-0000-4000-8000-000000000051';" >"$tmp/revoke_timeout.log" 2>&1
rev_code=$?
set -e
if [[ "$rev_code" == "0" ]] || ! grep -q 'canceling statement due to statement timeout' "$tmp/revoke_timeout.log"; then
  echo "ERROR: revocation did not block on the membership fence" >&2
  cat "$tmp/revoke_timeout.log"
  exit 1
fi

# Account closure must not race ahead of an active posting using FOR SHARE.
set +e
psql -X -v ON_ERROR_STOP=1 -c "SET statement_timeout='500ms'; UPDATE ledger_lab.ledger_account SET state='CLOSED' WHERE account_id='30000000-0000-4000-8000-000000000051';" >"$tmp/account_timeout.log" 2>&1
acct_code=$?
set -e
if [[ "$acct_code" == "0" ]] || ! grep -q 'canceling statement due to statement timeout' "$tmp/account_timeout.log"; then
  echo "ERROR: account closure did not block during posting" >&2
  cat "$tmp/account_timeout.log"
  exit 1
fi
if ! wait "$holder"; then cat "$tmp/lock_holder.log"; exit 1; fi

# Once the holder commits, revocation can enforce the next membership revision.
pg "UPDATE ledger_lab.member_authority SET state='REVOKED',revision=2,revoked_at=now() WHERE membership_id='50000000-0000-4000-8000-000000000051';" >/dev/null
revoked="$(pg "SELECT state || ':' || revision FROM ledger_lab.member_authority WHERE membership_id='50000000-0000-4000-8000-000000000051';")"
if [[ "$revoked" != "REVOKED:2" ]]; then echo "ERROR: revocation state mismatch" >&2; exit 1; fi

# Backend terminated BEFORE COMMIT: no durable command, journal, line, or outbox.
psql -X -v ON_ERROR_STOP=1 >"$tmp/crash_holder.log" 2>&1 <<SQL &
SET application_name = 'opes_precommit_crash_holder';
SET SESSION AUTHORIZATION opes_crash_holder_lab;
BEGIN;
SELECT ledger_lab.post_synthetic_bank_journal(
 '50000000-0000-4000-8000-000000000052',1,
 '60000000-0000-4000-8000-000000000052','crash-key-0052',
 '70000000-0000-4000-8000-000000000052',
 '80000000-0000-4000-8000-000000000052','XAF','$lines'::jsonb);
SELECT pg_sleep(30);
COMMIT;
SQL
crash_client=$!
if ! wait_sleeping 'opes_precommit_crash_holder'; then cat "$tmp/crash_holder.log"; exit 1; fi
# Never invoke pg_terminate_backend(pid) inside a WHERE predicate: SQL
# evaluation order could terminate sessions other than the intended holder.
target_pid="$(pg "SELECT pid FROM pg_stat_activity WHERE application_name='opes_precommit_crash_holder' AND state='active' AND query LIKE '%pg_sleep%' AND pid<>pg_backend_pid();")"
if [[ ! "$target_pid" =~ ^[0-9]+$ ]]; then echo "ERROR: missing or ambiguous target backend PID" >&2; exit 1; fi
terminated="$(pg "SELECT pg_terminate_backend($target_pid);")"
if [[ "$terminated" != "t" ]]; then echo "ERROR: target backend termination rejected" >&2; exit 1; fi
set +e
wait "$crash_client"
crash_code=$?
set -e
if [[ "$crash_code" == "0" ]]; then echo "ERROR: terminated backend falsely completed" >&2; exit 1; fi
# Wait for terminated PostgreSQL backend to release all transaction locks.
for n in $(seq 1 50); do
  live="$(pg "SELECT count(*) FROM pg_stat_activity WHERE application_name='opes_precommit_crash_holder';")"
  if [[ "$live" == "0" ]]; then break; fi
  sleep 0.1
done
if [[ "$live" != "0" ]]; then echo "ERROR: backend not terminated" >&2; exit 1; fi
ghost="$(pg "SELECT count(*) FROM ledger_lab.posting_command WHERE command_id='60000000-0000-4000-8000-000000000052';")"
if [[ "$ghost" != "0" ]]; then echo "ERROR: precommit crash produced phantom command" >&2; exit 1; fi
counts="$(pg "SELECT (SELECT count(*) FROM ledger_lab.posting_command)||':'||
 (SELECT count(*) FROM ledger_lab.journal)||':'||
 (SELECT count(*) FROM ledger_lab.journal_line)||':'||
 (SELECT count(*) FROM ledger_lab.outbox);")"
if [[ "$counts" != "1:1:2:1" ]]; then
 echo "ERROR: unexpected post-crash persistence: $counts" >&2; exit 1
fi
echo "SEC-LED-LAB-005 PASS: revocation/account-lock ordering and crash-before-commit rollback"
