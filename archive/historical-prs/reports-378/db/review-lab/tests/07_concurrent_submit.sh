#!/usr/bin/env bash
# Disposable PostgreSQL 16: two distinct authenticated DB sessions race the
# same version and digest; a single winner is required, not just eventual state.
set -euo pipefail
a=$(mktemp); b=$(mktemp)
trap 'rm -f "$a" "$b"' EXIT
run() {
 psql -h 127.0.0.1 -U opes_rpt_a_maker_lab -d opes_test -X -Atq \
   -v ON_ERROR_STOP=1 -c "SELECT opes_rpt_review_lab.advance_review('RPT-LED-003',0,'DRAFT','sha256-SYNTHETIC-A-003')"
}
run >"$a" & p1=$!
run >"$b" & p2=$!
wait "$p1"
wait "$p2"
v1=$(tr -d '[:space:]' <"$a")
v2=$(tr -d '[:space:]' <"$b")
if ! { [[ "$v1" == t && "$v2" == f ]] || [[ "$v1" == f && "$v2" == t ]]; };then
 echo "FAIL: concurrent review CAS returned unexpected outputs: [$v1], [$v2]" >&2
 exit 1
fi
echo "PG16_CONCURRENT_SAME_VERSION_EXACTLY_ONE_WINNER_PASS"
