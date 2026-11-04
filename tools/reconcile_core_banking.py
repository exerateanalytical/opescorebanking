#!/usr/bin/env python3
"""Exhaustive tracked-file reconciliation. Metadata and automated content checks are not approvals."""
# Canonical state v0.3 corrections trigger a fresh, reproducible audited source archive.
import csv, hashlib, io, json, os, pathlib, re, subprocess, zipfile
from collections import Counter, defaultdict
from datetime import datetime, timezone

ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/"programme/consolidated/ONE_BATCH_ENGINEERING_DELIVERY_2026-11-04/reconciliation_2026-11-04/verified_run"
OUT.mkdir(parents=True,exist_ok=True)
PREFIX="programme/consolidated/ONE_BATCH_ENGINEERING_DELIVERY_2026-11-04/"
DOMAINS=["GOV","ARC","CIF","PRD","ACT","LED","BRN","PAY","CRD","TRE","AML","REP","CHN","CARD","CRM","FEE","REC","SEC","DAT","API","INF","DR","ADM","TST","REL"]
def digest(b):return hashlib.sha256(b).hexdigest()
def tracked():
    raw=subprocess.check_output(["git","ls-files","-z"],cwd=ROOT)
    return sorted([x.decode("utf8") for x in raw.split(b"\0") if x])
def gitsha():return subprocess.check_output(["git","rev-parse","HEAD"],cwd=ROOT,text=True).strip()
def group(p):
    if p.startswith(PREFIX+"full_specification/education/"):return "education"
    for v in ("apis","data","workflows","ui","tests"):
        if p.startswith(PREFIX+"full_specification/"+v+"/"):return "draft_"+v
    if p.startswith(PREFIX+"full_specification/"):return "crosscutting_draft"
    if p.startswith(PREFIX+"corrections/"):return "corrective_draft"
    if p.startswith(PREFIX+"domains/"):return "domain_draft"
    if p.startswith(PREFIX):return "consolidated_governance"
    if p.startswith("programme/batches/2026-11-03/"):return "historical_engineering"
    if p.startswith("programme/batches/2026-11-04/"):return "historical_recovery"
    if p.startswith("regulatory/checkpoints/"):return "regulatory_checkpoint"
    if p.startswith("regulatory/recovery/archives/"):return "recovered_archive"
    if p.startswith("regulatory/recovery/"):return "recovered_source"
    if p.startswith("governance/"):return "governance"
    return "other"
def candidate(p,title=""):
    m=re.match(r"programme/batches/2026-11-03/([^/]+)/",p)
    if m:
        if re.search(r"product factory|product catalog",title,re.I):return "PRD (candidate; historical WP "+m[1]+")"
        return m[1]
    m=re.search(r"/(?:apis|data|workflows|ui|tests|domains|corrections)/([A-Z]+)(?:_|\.|/)",p)
    if m:return m.group(1)
    if "/education/" in p:return "EDU"
    if p.startswith("regulatory/checkpoints/"):return "WP-ACC-005 (candidate)"
    return "UNMAPPED"
def writecsv(path,header,rows):
    with open(path,"w",newline="",encoding="utf8") as f:
        w=csv.writer(f);w.writerow(header);w.writerows(rows)
def writejson(path,value):path.write_text(json.dumps(value,indent=2,ensure_ascii=False,sort_keys=True)+"\n",encoding="utf8")

files=[p for p in tracked() if not p.startswith(str(OUT.relative_to(ROOT)).replace(os.sep,"/")+"/")];base_sha=gitsha();file_rows=[];text_rows=[];contracts=[];checkpoints=[];duplicate=defaultdict(list);errors=[];zip_results=[];content_counts=Counter();manifest_conflicts=[];spec_gap=[];test_ids=[]
for p in files:
    b=(ROOT/p).read_bytes();sha=digest(b);size=len(b);duplicate[sha].append(p);ext=pathlib.Path(p).suffix.lower()
    title="";document_status="SOURCE_METADATA_ONLY"
    if ext in (".json",".md",".csv",".yaml",".yml",".sql",".txt",".py",".js"):
        try:
            s=b.decode("utf-8-sig");document_status="UTF8_READ";content_counts[ext]+=1
            m=re.search(r"(?m)^\s*#\s+(.+)$",s);title=m.group(1).strip() if m else ""
            if not title and ext==".json":
                try:title=str(json.loads(s).get("title",""))
                except Exception:pass
            if ext==".json":
                try:json.loads(s)
                except Exception as e:errors.append({"path":p,"kind":"JSON_PARSE","message":str(e)})
            if ext==".csv":
                try:list(csv.reader(io.StringIO(s)))
                except Exception as e:errors.append({"path":p,"kind":"CSV_PARSE","message":str(e)})
            if "/tests/" in p and p.endswith("_ACCEPTANCE_MATRIX.csv"):
                try:
                    rs=list(csv.DictReader(io.StringIO(s)))
                    test_ids += [(p,r.get("case_id","")) for r in rs]
                except Exception as e:errors.append({"path":p,"kind":"TEST_MATRIX","message":str(e)})
        except Exception as e:errors.append({"path":p,"kind":"TEXT_DECODING","message":str(e)})
        text_rows.append([p,sha,len(b),title,"YES" if re.search(r"(?i)\bDRAFT\b",s) else "NO","YES" if "WP-ACC-005" in s else "NO","YES" if "GIMAC" in s else "NO"])
    if re.search(r"programme/batches/2026-11-03/[^/]+/[^/]+_CONTRACT\.json$",p):
        try:
            j=json.loads(b);contracts.append({"path":p,"id":j.get("id"),"batch":j.get("batch"),"title":j.get("title"),"status":j.get("status"),"candidate_domain":candidate(p,j.get("title","")),"planned_tests":len(j.get("planned_tests",[])),"executed_tests_claim":j.get("executed_tests"),"schema_attributes":len(j.get("schema",[]))})
        except Exception as e:errors.append({"path":p,"kind":"CONTRACT_PARSE","message":str(e)})
    if re.match(r"regulatory/checkpoints/[^/]+/README\.md$",p):
        checkpoints.append({"checkpoint":p.split("/")[2],"path":p,"sha256":sha,"pcec_conflict_claim":b"312/322" in b or b"WP-ACC-005" in b,"readme_checked":True})
    if p.endswith(".zip"):
        try:
            with zipfile.ZipFile(io.BytesIO(b)) as z:
                bad=z.testzip()
                total=sum(i.file_size for i in z.infolist())
                if total > 250_000_000:errors.append({"path":p,"kind":"ZIP_UNCOMPRESSED_SIZE_LIMIT","message":str(total)})
                zip_results.append({"path":p,"bytes":size,"sha256":sha,"entries":len(z.infolist()),"total_uncompressed_bytes":total,"crc_valid":bad is None,"bad_entry":bad})
        except Exception as e:zip_results.append({"path":p,"bytes":size,"sha256":sha,"crc_valid":False,"error":str(e)})
    file_rows.append([p,size,sha,ext,group(p),candidate(p,title),document_status,title])
spec=PREFIX+"full_specification/"
for folder in ("apis","data","workflows","ui","tests"):
    domain_files=[p for p in files if p.startswith(spec+folder+"/")]
    for d in DOMAINS:
        expected={"apis":d+".openapi.yaml","data":d+"_SCHEMA_PROPOSAL.sql","workflows":d+"_WORKFLOWS.md","ui":d+"_SCREEN_INVENTORY.md","tests":d+"_ACCEPTANCE_MATRIX.csv"}[folder]
        path=spec+folder+"/"+expected
        if path not in files:spec_gap.append({"domain":d,"type":folder,"missing":path})
for d in DOMAINS:
    p=spec+"data/"+d+"_SCHEMA_PROPOSAL.sql"
    if p in files:
        s=(ROOT/p).read_text(encoding="utf8")
        if "ENABLE ROW LEVEL SECURITY" not in s.upper():spec_gap.append({"domain":d,"type":"database_security","issue":"RLS enforcement absent from proposal"})
for p in files:
    if p.startswith(spec+"apis/") and p.endswith(".yaml"):
        s=(ROOT/p).read_text(encoding="utf8")
        if "openapi: 3.1.0" not in s:spec_gap.append({"path":p,"type":"api_version","issue":"OpenAPI 3.1 marker absent"})
        if "payload: {type: object}" in s:spec_gap.append({"path":p,"type":"api_depth","issue":"generic payload schema, not fully typed domain fields"})
old_manifest=spec+"DELIVERY_MANIFEST.json"
if old_manifest in files:
    j=json.loads((ROOT/old_manifest).read_text(encoding="utf8"))
    actual=sum(p.startswith(spec) for p in files)
    if j.get("files_count")!=actual:manifest_conflicts.append({"path":old_manifest,"declared":j.get("files_count"),"actual":actual,"action":"supersede manifest count; preserve historical file"})
canonical="governance/CANONICAL_PROGRAMME_STATE.json"
if canonical in files:
    j=json.loads((ROOT/canonical).read_text(encoding="utf8"))
    last=max([int(m.group(1)) for p in files if (m:=re.search(r"programme/batches/2026-11-04/GOV-REC-001/B(\d+)_",p))] or [0])
    if last>j.get("latest_completed_archive_batch",0):manifest_conflicts.append({"path":canonical,"declared_latest_archive_batch":j.get("latest_completed_archive_batch"),"latest_recovery_path_number":last,"action":"stale pointer; observed batch path is not proof of acceptance"})
dup=[{"sha256":s,"paths":p} for s,p in duplicate.items() if len(p)>1]
source_wp=sorted({x["id"] for x in contracts if x.get("id")})
# Reconcile 150 historical WP directories against 120 original CONTRACT.json files.
# Normalize the 30 absent contract files from real sibling SPEC.md bytes without
# pretending the originals ever existed or inventing historic approvals.
historical_wps=sorted({m.group(1) for p in files if (m:=re.match(r"programme/batches/2026-11-03/([^/]+)/",p))})
missing_contracts=[]
for wp in historical_wps:
    contract="programme/batches/2026-11-03/"+wp+"/"+wp+"_CONTRACT.json"
    if contract in files:continue
    src="programme/batches/2026-11-03/"+wp+"/"+wp+"_SPEC.md"
    if src not in files:
        missing_contracts.append({"id":wp,"status":"MISSING_SOURCE_SPEC","expected_contract":contract})
        continue
    raw=(ROOT/src).read_bytes();body=raw.decode("utf8")
    headings=re.findall(r"(?m)^#{1,4}\s+(.+)$",body)
    missing_contracts.append({
      "id":wp,"status":"DERIVED_FROM_EXISTING_SPEC_NOT_ORIGINAL_CONTRACT",
      "expected_contract":contract,"source_spec":src,"source_spec_sha256":digest(raw),
      "source_title":headings[0] if headings else wp,
      "source_headings":headings,
      "source_text_preserved":body,
      "independent_acceptance":"NOT_VERIFIED"})
writejson(OUT/"NORMALIZED_MISSING_HISTORICAL_CONTRACTS.json",missing_contracts)

reg_dirs=sorted({p.split("/")[2] for p in files if p.startswith("regulatory/checkpoints/") and len(p.split("/"))>3})
test_duplicate=[k for k,c in Counter(k for _,k in test_ids).items() if k and c>1]
summary={
  "run_date":"2026-11-04","baseline_git_commit":base_sha,"scope":"All git-tracked files, text parse, all top-level ZIP CRC tests, draft coverage; not independent regulatory approval",
  "tracked_files":len(files),"repository_bytes":sum(row[1] for row in file_rows),
  "text_files_read":len(text_rows),"text_file_formats":dict(content_counts),
  "zip_archives_tested":len(zip_results),"zip_crc_failures":sum(not z.get("crc_valid",False) for z in zip_results),
  "engineering_contracts_parsed":len(contracts),"historical_wp_ids_observed":len(source_wp),
  "regulatory_checkpoint_directories":len(reg_dirs),"regulatory_readmes_read":len(checkpoints),
  "specification_domain_count":len(DOMAINS),"missing_domain_file_slots":len([x for x in spec_gap if "missing" in x]),
  "database_rls_design_gaps":len([x for x in spec_gap if x.get("type")=="database_security"]),
  "generic_api_schema_gaps":len([x for x in spec_gap if x.get("type")=="api_depth"]),
  "source_contract_executed_test_claim_sum":sum(int(x.get("executed_tests_claim") or 0) for x in contracts),
  "test_scenarios_in_csv":len(test_ids),"duplicate_test_ids":test_duplicate,
  "identical_sha256_groups":len(dup),"exact_duplicates":dup,"manifest_conflicts":manifest_conflicts,
  "known_blockers":["WP-ACC-005 PCEC 312/322 source and legal/CFO authority","bank-specific payment network entitlement","historical custody and independent acceptance","15 DoR gates"],
  "approved_programme_wp_denominator":"UNKNOWN","accepted_wp_total":"UNKNOWN",
  "banking_tests_executed_by_this_audit":0,"production_banking_code_generated":0,
  "regulatory_certification":"NOT_VERIFIED","historical_original_archive_custody":"NOT_VERIFIED"
}
summary["historical_wp_ids_observed"]=len(historical_wps)
summary["historical_wp_directories"]=len(historical_wps)
summary["original_contract_json_present"]=len(contracts)
summary["contracts_derived_from_existing_source_specs"]=sum(x.get("status")=="DERIVED_FROM_EXISTING_SPEC_NOT_ORIGINAL_CONTRACT" for x in missing_contracts)
summary["missing_original_contract_ids"]=[x["id"] for x in missing_contracts]
writecsv(OUT/"ALL_TRACKED_SHA256.csv",["path","bytes","sha256","extension","source_group","candidate_owner","inspection","title"],file_rows)
writecsv(OUT/"ALL_TEXT_CONTENT_CROSSWALK.csv",["path","sha256","bytes","heading","mentions_draft","mentions_acc_005","mentions_gimac"],text_rows)
writecsv(OUT/"HISTORICAL_CONTRACT_WORKPACKAGES.csv",["path","id","batch","title","status","candidate_domain","planned_tests","executed_tests_claim","schema_attributes"],[[x.get(k) for k in ("path","id","batch","title","status","candidate_domain","planned_tests","executed_tests_claim","schema_attributes")] for x in contracts])
writejson(OUT/"REGULATORY_CHECKPOINT_READMES.json",checkpoints)
writejson(OUT/"ZIP_INTEGRITY_ALL.json",zip_results)
writejson(OUT/"EXACT_SHA256_DUPLICATES.json",dup)
writejson(OUT/"OPEN_DESIGN_GAPS.json",spec_gap)
writejson(OUT/"RECONCILIATION_SUMMARY.json",summary)
writejson(OUT/"CONTENT_PARSE_ERRORS.json",errors)
md=f"""# OPES Core Banking — Exhaustive repository machine audit
Source commit: {base_sha}. Source snapshot is git-tracked content; no approved historical WBS denominator.
Tracked: {len(files)} files; text bodies read {len(text_rows)}; ZIPs CRC-tested {len(zip_results)} (failures: {summary['zip_crc_failures']}).
Parsed 2026-11-03 contracts: {len(contracts)}; regulatory checkpoint README bodies: {len(checkpoints)}.
Domain slots missing: {summary['missing_domain_file_slots']}; proposed SQL without RLS: {summary['database_rls_design_gaps']}; generic API payload gaps: {summary['generic_api_schema_gaps']}.
Exact duplicate SHA-256 groups: {len(dup)}; register/test-count conflicts: {len(manifest_conflicts)}.
Financial P0: WP-ACC-005 remains blocked; GIMAC and other bank-specific entitlements remain unverified.
Banking implementation, tests, 15 DoR gates and independent professional reviews are NOT claimed.
### Evidence limits
- All tracked text parsed/decoded, but automated keyword and schema inspection is not expert acceptance.
- ZIP CRC checks prove integrity against the archive's recorded CRC, not original custody or regulator source authenticity.
- Historical source documents and metadata may conflict; keep original files intact.
- Education software licences grant training use, never banking or payment authority.
- Full regulatory applicability requires primary source verification at article, version and effective-date level.
"""
(OUT/"AUDIT_REPORT.md").write_text(md,encoding="utf8")
# Preserve invalid historical ZIP bytes; reconstruct clearly labelled usable
# draft-evidence ZIPs ONLY from sibling source files, never impersonating originals.
repair_path=OUT/"RECONSTRUCTED_INVALID_HISTORICAL_ZIPS_2026-11-04.zip"
repair_records=[]
with zipfile.ZipFile(repair_path,"w",compression=zipfile.ZIP_DEFLATED,compresslevel=6) as repair_outer:
    for broken in [z for z in zip_results if not z.get("crc_valid")]:
        original=broken["path"]
        source_dir=str(pathlib.PurePosixPath(original).parent)+"/"
        evidence_paths=[p for p in files if p.startswith(source_dir) and
            "/" not in p[len(source_dir):] and not p.lower().endswith(".zip")]
        rec={"original_path":original,"original_sha256":broken["sha256"],
             "original_failure":broken.get("error") or broken.get("bad_entry"),
             "source_paths":evidence_paths,
             "status":"RECONSTRUCTED_FROM_EXTRACTED_SIBLING_SOURCES" if evidence_paths else "NO_SIBLING_SOURCES"}
        if evidence_paths:
            mem=io.BytesIO()
            with zipfile.ZipFile(mem,"w",compression=zipfile.ZIP_DEFLATED) as inner:
                inner.writestr("NOT_ORIGINAL_ARCHIVE.txt",
                    "This is a NEW RECONSTRUCTION from the tracked sibling text files. "
                    "It is not the original historical ZIP and does not establish original custody, "
                    "work-package acceptance, executable code or regulatory approval.\n"
                    "Original path: "+original+"\nOriginal SHA256: "+broken["sha256"]+"\n")
                for p in evidence_paths:inner.writestr(pathlib.PurePosixPath(p).name,(ROOT/p).read_bytes())
            b=mem.getvalue()
            with zipfile.ZipFile(io.BytesIO(b)) as inner:
                if inner.testzip() is not None:raise RuntimeError("Reconstructed archive invalid: "+original)
            name="RECONSTRUCTED/"+pathlib.PurePosixPath(source_dir).name+".zip"
            repair_outer.writestr(name,b)
            rec["reconstructed_zip_path"]=name
            rec["reconstructed_sha256"]=digest(b)
            rec["reconstructed_bytes"]=len(b)
        repair_records.append(rec)
    repair_outer.writestr("RECONSTRUCTION_REGISTER.json",json.dumps(repair_records,indent=2)+"\n")
with zipfile.ZipFile(repair_path) as z:
    if z.testzip() is not None:raise RuntimeError("Aggregate reconstruction ZIP CRC failure")
writejson(OUT/"RECONSTRUCTED_ARCHIVE_MANIFEST.json",repair_records)
summary["invalid_historical_zip_reconstruction"]={
  "invalid_archive_count":len(repair_records),
  "archives_rebuilt_from_sibling_sources":sum(bool(x["source_paths"]) for x in repair_records),
  "unrecoverable_missing_sibling_sources":sum(not x["source_paths"] for x in repair_records),
  "repair_package":str(repair_path.relative_to(ROOT)),
  "repair_package_sha256":digest(repair_path.read_bytes()),
  "original_bytes_preserved":True,
  "original_archive_authenticity_verified":False}

# Create one cumulative archive; retain every original tracked source including historical ZIPs.
archive=OUT/"OPES_Core_Banking_Full_Reconciled_Source_2026-11-04.zip"
audit_paths=sorted([x for x in OUT.iterdir() if x.is_file() and x!=archive and x.name!="ARCHIVE_SHA256SUMS.txt"])
with zipfile.ZipFile(archive,"w",compression=zipfile.ZIP_DEFLATED,compresslevel=6,allowZip64=True) as z:
    for p in files:
        if p.startswith(str(OUT.relative_to(ROOT)).replace(os.sep,"/")+"/"):continue
        z.write(ROOT/p,arcname=p)
    for p in audit_paths:z.write(p,arcname=str(p.relative_to(ROOT)))
with zipfile.ZipFile(archive) as z:
    bad=z.testzip()
    if bad:raise RuntimeError("Generated source ZIP failed CRC verification: "+bad)
arch_sha=digest(archive.read_bytes())
(OUT/"ARCHIVE_SHA256SUMS.txt").write_text(arch_sha+"  "+archive.name+"\n",encoding="ascii")
summary["generated_archive"]={"path":str(archive.relative_to(ROOT)),"bytes":archive.stat().st_size,"sha256":arch_sha,"zip_crc_valid":True}
writejson(OUT/"RECONCILIATION_SUMMARY.json",summary)
print(json.dumps({"baseline":base_sha,"tracked":len(files),"texts":len(text_rows),"zips":len(zip_results),"zip_failures":summary["zip_crc_failures"],"archive_bytes":archive.stat().st_size,"archive_sha256":arch_sha,"contract_count":len(contracts)}))
