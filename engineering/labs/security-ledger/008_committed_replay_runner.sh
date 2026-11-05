#!/usr/bin/env bash
# SEC-TENANT-ROUTING-001: disposable PostgreSQL 16 LAB-008.
# NO production use. Requires LAB-006 + LAB-007 setup, separate authenticated
# lab006_runner connection and a database that can be destroyed after testing.
set -euo pipefail
: "${LAB008_DSN:?Set LAB008_DSN to disposable PostgreSQL connection string for lab006_runner}"
command -v psql >/dev/null || { echo 'BLOCKED: psql unavailable' >&2; exit 77; }
version=$(psql "$LAB008_DSN" -X -Atq -v ON_ERROR_STOP=1 -c 'SHOW server_version_num')
[[ "$version" =~ ^[0-9]+$ ]] && ((version >= 160000 && version < 170000)) || { echo 'BLOCKED: PostgreSQL 16 required' >&2; exit 77; }
identity=$(psql "$LAB008_DSN" -X -Atq -v ON_ERROR_STOP=1 -c 'SELECT session_user')
[[ "$identity" == 'lab006_runner' ]] || { echo 'BLOCKED: wrong session_user' >&2; exit 77; }
key="LAB008-$(date -u +%Y%m%d%H%M%S)-$$"
[[ ${#key} -le 100 ]] || exit 77
lines='[{"account_id":"00000000-0000-4000-8000-000000000011","debit_minor":500,"credit_minor":0},{"account_id":"00000000-0000-4000-8000-000000000012","debit_minor":0,"credit_minor":500}]'
call_post() {
  local command_id="$1" journal_id="$2" event_id="$3"
  psql "$LAB008_DSN" -X -Atq -v ON_ERROR_STOP=1 \
    -v key="$key" -v lines="$lines" -v cmd="$command_id" -v journal="$journal_id" -v event="$event_id" <<'SQL'
BEGIN;
SELECT sec_idemp_006.post('00000000-0000-4000-8000-000000000001',1,:'key',:'cmd'::uuid,:'journal'::uuid,:'event'::uuid,'XAF',:'lines'::jsonb);
COMMIT;
SQL
}
command -v python3 >/dev/null || { echo 'BLOCKED: python3 unavailable' >&2; exit 77; }
new_uuid() { python3 -c 'import uuid; print(uuid.uuid4())'; }
first=$(call_post "$(new_uuid)" "$(new_uuid)" "$(new_uuid)" | grep -E '^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$')
[[ -n "$first" ]] || { echo 'FAIL: no committed journal UUID' >&2; exit 1; }
second=$(call_post "$(new_uuid)" "$(new_uuid)" "$(new_uuid)" | grep -E '^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$')
[[ "$first" == "$second" ]] || { echo 'FAIL: duplicate journal after committed retry' >&2; exit 1; }
counts=$(psql "$LAB008_DSN" -X -Atq -v ON_ERROR_STOP=1 -v key="$key" -v journal="$first" <<'SQL'
SELECT (SELECT count(*) FROM sec_idemp_006.operation WHERE idempotency_key=:'key')::text||'|'||
       (SELECT count(*) FROM sec_idemp_006.outbox WHERE journal_id=:'journal'::uuid)::text||'|'||
       (SELECT count(*) FROM sec_idemp_006.line WHERE journal_id=:'journal'::uuid)::text||'|'||
       (SELECT coalesce(sum(debit_minor-credit_minor),999999) FROM sec_idemp_006.line WHERE journal_id=:'journal'::uuid)::text;
SQL
)
[[ "$counts" == '1|1|2|0' ]] || { echo "FAIL: unexpected durable counts: $counts" >&2; exit 1; }
printf 'LAB008 committed retry PASS key=%s journal=%s counts=%s postgres=%s\n' "$key" "$first" "$counts" "$version"
printf 'LIMITATION: no concurrency, changed-command, OIDC, C4 crash, or external settlement proven.\n'
