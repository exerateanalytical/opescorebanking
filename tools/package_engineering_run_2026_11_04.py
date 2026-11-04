#!/usr/bin/env python3
"""Produce one immutable, independently checkable *non-production* run checkpoint.

No tests are executed by this archiver. CI outcomes in the report are copied
from separately observed GitHub runs and remain distinct from source integrity.
"""
from __future__ import annotations
import csv,hashlib,io,json,pathlib,subprocess,zipfile,zlib

ROOT=pathlib.Path(__file__).resolve().parents[1]
DEST=ROOT/"programme/checkpoints/2026-11-04/ENG-REMEDIATION-001"
TARGETS=("engineering/contracts/","engineering/security/tenant-routing/",
 "engineering/security/token-router/","engineering/ledger-lab/",
 "engineering/domain-data-lab/",
 ".github/workflows/security-authority-concurrency.yml",
 ".github/workflows/domain-contracts-ci.yml",
 ".github/workflows/ledger-lab-ci.yml",
 ".github/workflows/tenant-token-router-ci.yml",
 ".github/workflows/domain-data-ci.yml",
 "governance/decisions/ADR-OPES-003-BANK_LOCAL_AUTHORIZATION_FENCE.md",
 "governance/OWNER_APPROVED_DOMAIN_OWNERSHIP_REGISTER_2026-11-04.json",
 "governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.5_2026-11-04.md")
RUNS={
 "T43_T47_PG_CONCURRENCY":{"run":41909907072,"python_tests":7,"status":"SUCCESS"},
 "CIF_PRD_ACT_LED_CONTRACT":{"run":41910375468,"python_tests":10,"status":"SUCCESS"},
 "LEDGER_SYNTHETIC_INVARIANTS":{"run":41910690348,"python_tests":13,"status":"SUCCESS"},
 "SIGNED_JWKS_TOKEN_ROUTER":{"run":41911013397,"python_tests":20,"status":"SUCCESS"},
 "POSTGRESQL_FOUR_DOMAIN_CONSTRAINTS":{"run":41911537994,"python_tests":0,"sql_integration":"SUCCESS"}
}
PACKAGES=[
("SEC-TENANT-ROUTING-001","SEC","T43/T47 bank-local authority and revocation fence laboratory"),
("SEC-TOKEN-ROUTER-001","SEC","Pinned RSA JWKS and server-backed tenant routing test model"),
("CIF-CONTRACT-001","CIF","Strict typed party/KYC command contracts"),
("PRD-CONTRACT-001","PRD","Strict typed product/version command contracts"),
("ACT-CONTRACT-001","ACT","Strict typed bank account request contracts"),
("LED-CONTRACT-001","LED","Strict typed immutable journal command contracts"),
("LED-INVARIANTS-001","LED","Exact integer debit/credit and reversal tests in memory"),
("DAT-FOUR-DOMAIN-001","DAT","Seven hardened PostgreSQL CIF PRD ACT LED tables and tenant tests")
]
def sha(x:bytes)->str:return hashlib.sha256(x).hexdigest()
def git_blob(x:bytes)->str:return hashlib.sha1(b"blob "+str(len(x)).encode()+b"\0"+x).hexdigest()
def jsonb(x):return (json.dumps(x,ensure_ascii=False,sort_keys=True,indent=2)+"\n").encode()
def zip_write(z,path,content):
    info=zipfile.ZipInfo(path,date_time=(2026,11,4,0,0,0))
    info.compress_type=zipfile.ZIP_DEFLATED
    info.external_attr=0o100644<<16
    z.writestr(info,content)

if DEST.exists():
    pkg=DEST/"OPES_ENG_REMEDIATION_001_TESTED_LABS_2026-11-04.zip"
    saved=(DEST/"ZIP_SHA256SUMS.txt").read_text().split()[0]
    contents=pkg.read_bytes()
    if sha(contents)!=saved:raise RuntimeError("existing checkpoint archive hash changed")
    with zipfile.ZipFile(io.BytesIO(contents)) as z:
        if z.testzip():raise RuntimeError("existing archived ZIP has corrupt entry")
    print(json.dumps({"status":"ALREADY_EXISTS_AND_REVERIFIED","sha256":saved,"bytes":len(contents)}))
    raise SystemExit(0)

all_paths=[x.decode() for x in subprocess.check_output(["git","ls-files","-z"],cwd=ROOT).split(b"\0") if x]
selected=sorted(p for p in all_paths if any(p.startswith(x) if x.endswith("/") else p==x for x in TARGETS))
if len(selected)<20:raise RuntimeError("Too few tracked engineering sources to package")
if len(selected)!=len(set(selected)):raise RuntimeError("Duplicate tracked path")
data={}
entries=[]
for p in selected:
    payload=(ROOT/p).read_bytes()
    data["SOURCE/"+p]=payload
    entries.append({"path":p,"bytes":len(payload),"sha256":sha(payload),
                   "git_blob_sha1":git_blob(payload),
                   "crc32":format(zlib.crc32(payload)&0xffffffff,"08x")})
head=subprocess.check_output(["git","rev-parse","HEAD"],cwd=ROOT,text=True).strip()
report={
 "schema":"opes.corebanking.engineering-run-execution-report.v1",
 "date":"2026-11-04","baseline_commit":head,
 "verification_scope":"CONTRACT_AND_SYNTHETIC_ENGINEERING_LABS_ONLY",
 "work_packages_attempted":len(PACKAGES),"work_packages_verified_complete_for_production":0,
 "work_packages_kept_open":len(PACKAGES),"newly_blocked_work_packages":0,
 "attempted_packages":[{"id":p,"parent_domain":d,"scope":title,
   "owner":"OPESWARE TECHNOLOGIES","status":"IN_PROGRESS_LAB_TESTS_PASSED",
   "independent_production_acceptance":"NOT_VERIFIED"} for p,d,title in PACKAGES],
 "CI_results":RUNS,"executed_python_test_count":sum(x["python_tests"] for x in RUNS.values()),
 "postgresql_domain_relations_tested":7,
 "typed_domain_contracts":["CIF","PRD","ACT","LED"],
 "typed_domain_contracts_not_yet_replaced":21,
 "historical_draft_domain_sql_schemas_incomplete":25,
 "financial_transactions_posted_to_real_bank":0,
 "production_deployment_authorized":False,
 "original_historical_archive_custody":"NOT_VERIFIED",
 "blocking_risks":[
  "P0-SEC-01: distributed and cross-bank-local revocation/commit ordering not proven",
  "P0-SEC-02: production key/mTLS/broker trust topology unverified",
  "WP-ACC-005: disputed 312/322 PCEC external mapping stays inactive",
  "Production durable posted ledger, DB atomicity/outbox/DR not implemented"],
 "quality_gap_narrative":"Source is tested in isolated CI but not independently accepted as production software. Domain-data lab has NO POSTED journal or active deposit account. Synthetic ledger is in-memory.",
 "next_exact_task_id":"SEC-TENANT-ROUTING-001",
 "next_exact_task":"Implement bank-local signed-token/subject membership -> dedicated DB principal command gateway; integrate the member authorization fence with the durable ledger/outbox transactional commit and test revocation, crash/UNKNOWN and replay across separate services before production readiness."
}
manifest={"schema":"opes.corebanking.archived-source-manifest.v1",
"baseline_commit":head,"source_files":len(selected),"entries":entries,
"provenance":"Git-tracked content bytes; verified test results are separate from this archive's integrity",
"not_banking_approval":True}
reportbytes=jsonb(report)
manifestbytes=jsonb(manifest)
data["EXECUTION_REPORT.json"]=reportbytes
data["MANIFEST.json"]=manifestbytes
archive_name="OPES_ENG_REMEDIATION_001_TESTED_LABS_2026-11-04.zip"
DEST.mkdir(parents=True)
(DEST/"EXECUTION_REPORT.json").write_bytes(reportbytes)
(DEST/"MANIFEST.json").write_bytes(manifestbytes)
zpath=DEST/archive_name
with zipfile.ZipFile(zpath,"w",compression=zipfile.ZIP_DEFLATED) as z:
    for p,raw in sorted(data.items()):zip_write(z,p,raw)
with zipfile.ZipFile(zpath) as z:
    assert z.testzip() is None
    for entry in entries:
        raw=z.read("SOURCE/"+entry["path"])
        assert len(raw)==entry["bytes"]
        assert sha(raw)==entry["sha256"]
        assert format(zlib.crc32(raw)&0xffffffff,"08x")==entry["crc32"]
archive_sha=sha(zpath.read_bytes())
(DEST/"ZIP_SHA256SUMS.txt").write_text(archive_sha+"  "+archive_name+"\n")
print(json.dumps({"status":"SOURCE_CHECKPOINT_LOCALLY_VALIDATED",
  "baseline":head,"source_files":len(selected),
  "zip_bytes":zpath.stat().st_size,"zip_sha256":archive_sha,
  "packages_attempted":len(PACKAGES),"packages_production_accepted":0,
  "python_tests_in_successful_ci":report["executed_python_test_count"],
  "path":str(zpath.relative_to(ROOT))}))
