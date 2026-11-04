#!/usr/bin/env python3
"""Registered batch-210 source reconciliation; never represents WP acceptance."""
import csv,hashlib,io,json,pathlib,re,subprocess,zipfile,zlib
from collections import Counter
R=pathlib.Path(__file__).resolve().parents[1]
SRC=R/"regulatory/checkpoints"
BATCH=R/"programme/batches/2026-11-04/GOV-REC-001"
OUT=BATCH/"B210_ALL"
def sha(x):return hashlib.sha256(x).hexdigest()
def blob(x):return hashlib.sha1(b"blob "+str(len(x)).encode()+b"\0"+x).hexdigest()
def enc(x):return (json.dumps(x,ensure_ascii=False,sort_keys=True,indent=2)+"\n").encode()
def text(p):return p.read_text(encoding="utf-8-sig")
def git(*args):
    x=subprocess.run(["git",*args],cwd=R,capture_output=True)
    return (x.returncode,x.stdout)
def add(z,p,data):
    i=zipfile.ZipInfo(p,date_time=(2026,11,4,0,0,0));i.compress_type=zipfile.ZIP_DEFLATED;i.external_attr=(0o100644<<16);z.writestr(i,data)
def digestrec(path,data):
    return {"path":path,"bytes":len(data),"sha256":sha(data),"crc32":format(zlib.crc32(data)&0xffffffff,"08x"),"git_blob_sha1":blob(data)}
if OUT.exists():raise RuntimeError("B210 already exists; preserve history and avoid duplicate deliveries")
cpdirs=sorted(p for p in SRC.iterdir() if p.is_dir())
sources=sorted(p for d in cpdirs for p in d.iterdir() if p.is_file())
if len(cpdirs)!=59 or len(sources)!=317:raise RuntimeError("Source census differs from canonical 59 dirs, 317 blobs")
srcmap={str(p.relative_to(R)):digestrec(str(p.relative_to(R)),p.read_bytes()) for p in sources}
runs=[]
for d in BATCH.glob("B*_*"):
    m=re.fullmatch(r"B(\d+)_([A-Z]+)",d.name)
    if m and 151<=int(m.group(1))<=209:runs.append((int(m.group(1)),m.group(2),d))
runs.sort()
if [n for n,_,_ in runs]!=list(range(151,210)):raise RuntimeError("Batches 151-209 missing/duplicated")
if sorted(cp for _,cp,_ in runs)!=sorted(p.name for p in cpdirs):raise RuntimeError("Checkpoint sets inconsistent")
rows=[];linked={}
for num,cp,d in runs:
    record={"batch":num,"checkpoint":cp,"errors":[]}
    zs=list(d.glob("*.zip"))
    if len(zs)!=1:record["errors"].append("ZIP_COUNT");rows.append(record);continue
    zpath=zs[0];raw=zpath.read_bytes()
    record.update(zip_path=str(zpath.relative_to(R)),zip_sha256=sha(raw),bytes=len(raw))
    try:
        man=json.loads(text(d/"MANIFEST.json"));cross=json.loads(text(d/"CROSSWALK.json"))
        with zipfile.ZipFile(io.BytesIO(raw)) as z:
            if z.testzip():record["errors"].append("ZIP_CRC_FAILURE")
            names=set(z.namelist())
            for item in ["AUDIT.md","CROSSWALK.json","MANIFEST.json"]:
                if item not in names or (d/item).read_bytes()!=z.read(item):
                    record["errors"].append("EXTRACTED_MISMATCH:"+item)
            for e in man["files"]:
                if e["path"] not in names:record["errors"].append("ENTRY_MISSING:"+e["path"]);continue
                data=z.read(e["path"])
                if sha(data)!=e["sha256"] or len(data)!=e["bytes"] or format(zlib.crc32(data)&0xffffffff,"08x")!=str(e["crc32"]):
                    record["errors"].append("MANIFEST_HASH_ERROR:"+e["path"])
            expected={p for p in srcmap if p.startswith("regulatory/checkpoints/"+cp+"/")}
            documents=cross.get("source_documents",cross.get("source_records",[]))
            observed={x.get("source_path",x.get("path")) for x in documents}
            if observed!=expected:record["errors"].append("SOURCE_SET_MISMATCH")
            for e in documents:
                p=e.get("source_path",e.get("path"))
                if p not in srcmap:record["errors"].append("INVALID_SOURCE_REF");continue
                actual=srcmap[p]
                if e.get("sha256")!=actual["sha256"] or e.get("git_blob_sha")!=actual["git_blob_sha1"]:
                    record["errors"].append("SOURCE_DIGEST_MISMATCH:"+p)
                entry="SOURCE/"+p
                if entry not in names or z.read(entry)!=(R/p).read_bytes():
                    record["errors"].append("SOURCE_BYTES_MISMATCH:"+p)
                if p in linked:record["errors"].append("DUPLICATE_SOURCE:"+p)
                linked[p]=num
            ref=cross.get("source_ref")
            if isinstance(ref,str) and re.fullmatch(r"[a-f0-9]{40}",ref):
                for p in expected:
                    rc,old=git("show",ref+":"+p)
                    if rc:record["errors"].append("SOURCE_COMMIT_UNAVAILABLE:"+p)
                    elif old!=(R/p).read_bytes():record["errors"].append("SOURCE_VERSION_CONFLICT:"+p)
            else:record["errors"].append("PINNED_SOURCE_REF_INVALID")
    except Exception as ex:record["errors"].append("EXCEPTION:"+str(ex)[:180])
    record["integrity"]="PASS" if not record["errors"] else "FAIL"
    rows.append(record)
missing=sorted(set(srcmap)-set(linked))
if missing:raise RuntimeError("Source-to-batch coverage incomplete "+repr(missing[:10])+" example batch errors: "+repr(rows[:2]))
base=git("rev-parse","HEAD")[1].decode().strip()
wpdirs=sorted(p for p in (R/"programme/batches/2026-11-03").iterdir() if p.is_dir())
wplist=[]
for d in wpdirs:
    spec=d/(d.name+"_SPEC.md");contract=d/(d.name+"_CONTRACT.json")
    if not spec.exists():raise RuntimeError("Source SPEC missing: "+d.name)
    title=re.search(r"(?m)^#\s+(.+)$",text(spec))
    wplist.append({"wp_id":d.name,"title":title.group(1) if title else d.name,
      "source_spec":str(spec.relative_to(R)),
      "original_contract":str(contract.relative_to(R)) if contract.exists() else None,
      "suggested_domain":"PRD" if d.name=="ACT-001" else d.name.split("-")[0],
      "status":"DRAFT_SOURCE_NOT_INDEPENDENTLY_ACCEPTED",
      "owner":"OPESWARE TECHNOLOGIES",
      "reviewer":"independent architecture/legal/CFO/CISO/QA/audit review required",
      "dor_1_to_15":"NOT_VERIFIED"})
if len(wplist)!=150:raise RuntimeError("Historical work package count changed")
full=R/"programme/consolidated/ONE_BATCH_ENGINEERING_DELIVERY_2026-11-04/full_specification"
domains=["GOV","ARC","CIF","PRD","ACT","LED","BRN","PAY","CRD","TRE","AML","REP","CHN","CARD","CRM","FEE","REC","SEC","DAT","API","INF","DR","ADM","TST","REL"]
proposal=[{"id":"SPEC-"+d,"draft_sources":[str(p.relative_to(R)) for p in full.glob("*/"+d+"*") if p.is_file()],
"status":"DRAFT_NOT_APPROVED_FOR_TARGET_WBS"} for d in domains]
proposal.append({"id":"SPEC-EDU","draft_sources":[str(p.relative_to(R)) for p in (full/"education").glob("*")],
"status":"SIMULATED_TRAINING_PRODUCT_NOT_BANKING_LICENCE"})
srcledger=[dict(x,checkpoint=p.split("/")[2],recovery_batch=linked[p],
 original_archive_custody="UNVERIFIED",independent_acceptance=False) for p,x in sorted(srcmap.items())]
tracked=sorted(p.decode() for p in git("ls-files","-z")[1].split(b"\0") if p)
crossrows=[["path","sha256","git_blob_sha1","bytes","candidate_wp","source_class","acceptance"]]
for p in tracked:
    if "/verified_run/" in p:continue
    data=(R/p).read_bytes();m=re.search(r"programme/batches/2026-11-03/([^/]+)/",p)
    owner=m.group(1) if m else "GOV-REC-001" if p.startswith("regulatory/checkpoints/") or "/GOV-REC-001/" in p else "UNMAPPED_OR_SHARED"
    if "/full_specification/" in p:
        q=re.search(r"/(?:apis|data|ui|tests|workflows)/([A-Z]+)",p)
        owner="SPEC-"+q.group(1) if q else "SPEC-EDU" if "/education/" in p else "CROSSCUTTING_DRAFT"
    crossrows.append([p,sha(data),blob(data),len(data),owner,"TRACKED_REPO_EVIDENCE","NOT_INDEPENDENTLY_ACCEPTED"])
s=io.StringIO();csv.writer(s,lineterminator="\n").writerows(crossrows)
passnum=sum(x.get("integrity")=="PASS" for x in rows)
audit=("# Registered evidence batch 210 — whole-history content reconciliation\n\n"
"Baseline "+base+"; 59 checkpoint folders; 317 exact source paths; 59 delivered audits (151-209).\n"
"Subbatch checks PASS "+str(passnum)+"; FAIL "+str(len(rows)-passnum)+". See ARCHIVE_151_209_AUDIT.json.\n"
"150 historical engineering WP directories: "+str(sum(bool(x["original_contract"]) for x in wplist))+
" original contract JSONs and "+str(sum(not x["original_contract"] for x in wplist))+" absent originals.\n"
"All 25 domain specs and Education Edition are proposal evidence, not approved WBS.\n"
"Official BEAC I-2015/01 Articles 7 and 8 scanned: page 7 Article 8(d) prints parent 312 and 322x children, conflicting with 8(b) and 7. WP-ACC-005 stays BLOCKED P0.\n"
"Original archive custody, external signoffs, GIMAC institutional rights, and all 15 DoR gates remain unverified.\n"
"No production code or banking tests executed. Full historical WP acceptance denominator UNKNOWN.\n")
hold=("# WP-ACC-005 official evidence hold\n\nOfficial BEAC PDF https://www.beac.int/wp-content/uploads/2016/10/instruction_cobac_i_2015_01_pcec.pdf\n"
"Article 7 printed page 5: 312 medium-term sensitive credit. Article 8(b) printed page 6: 322 short-term sensitive credit. "
"Article 8(d) printed page 7: 312 short-term sensitive credit parent, but children 3220–3227. Visually checked 2026-11-04. "
"This is a confirmed printed inconsistency, not an authenticated correction. No affected posting-account mapping may be activated. "
"Require signed issuer clarification/superseding instrument and legal/CFO approval.\n"
"Historic Bulletin COBAC 6: https://www.beac.int/wp-content/uploads/2016/10/Bulletin-COBAC-n%C2%B06.pdf ; interpretation of I-2003/01 still pending article-specific review.\n")
state={"batch":210,"status":"SOURCE_CONTENT_RECONCILED_NOT_WP_ACCEPTED",
"source_count":317,"checkpoint_count":59,"subbatches_inspected":59,"passed":passnum,"failed":len(rows)-passnum,
"original_archive_custody":"NOT_VERIFIED","approved_wp_denominator":None,"accepted_wp_count":None,
"P0":["WP-ACC-005"],"payment_rail_entitlement":"NOT_VERIFIED","banking_tests_executed":0,
"NEXT_EXACT_TASK":"GOV-WBS-RECON-001: independent approval of source/WP crosswalk, source custody, target WBS and PCEC authority."}
docs={"AUDIT.md":audit.encode(),"SOURCE_CROSSWALK.json":enc(srcledger),
"ARCHIVE_151_209_AUDIT.json":enc(rows),"HISTORICAL_WORK_PACKAGES.json":enc(wplist),
"PROPOSED_DOMAIN_GROUPS.json":enc(proposal),"FILE_TO_WP_CROSSWALK.csv":s.getvalue().encode(),
"WP_ACC_005_AUTHORITY_HOLD.md":hold.encode(),"CONTINUATION_STATE.json":enc(state)}
payloads=dict(docs)
payloads.update({"SOURCE/"+p:(R/p).read_bytes() for p in srcmap})
manifest={"batch":210,"classification":"SOURCE_AUDIT_NOT_INDEPENDENT_WP_ACCEPTANCE",
"baseline":base,"entries":[digestrec(p,x) for p,x in sorted(payloads.items())]}
docs["MANIFEST.json"]=enc(manifest);payloads["MANIFEST.json"]=docs["MANIFEST.json"]
OUT.mkdir(parents=True)
for p,v in docs.items():(OUT/p).write_bytes(v)
zipname="OPES_Core_Banking_Batch_210_GOV_REC_001_ALL_2026-11-04.zip"
zpath=OUT/zipname
with zipfile.ZipFile(zpath,"w",compression=zipfile.ZIP_DEFLATED) as z:
    for p,data in sorted(payloads.items()):add(z,p,data)
with zipfile.ZipFile(zpath) as z:
    if z.testzip():raise RuntimeError("B210 ZIP CRC failed")
    for v in manifest["entries"]:
        data=z.read(v["path"])
        if sha(data)!=v["sha256"] or len(data)!=v["bytes"] or format(zlib.crc32(data)&0xffffffff,"08x")!=v["crc32"]:
            raise RuntimeError("B210 entry hash mismatch "+v["path"])
zh=sha(zpath.read_bytes());(OUT/"ZIP_SHA256SUMS.txt").write_text(zh+"  "+zipname+"\n")
(OUT/"RUN_REPORT.json").write_bytes(enc({"attempted":["GOV-REC-001","GOV-WBS-RECON-001"],
"completed_independently_accepted":0,"open":2,"newly_blocked":0,
"registered_evidence_batch":210,"zip_sha256":zh,"zip_bytes":zpath.stat().st_size,
"source_audits_pass":passnum,"source_audits_fail":59-passnum,"NEXT_EXACT_TASK":state["NEXT_EXACT_TASK"]}))
statepath=R/"governance/CANONICAL_PROGRAMME_STATE.json"
canonical=json.loads(text(statepath));canonical.update(
last_observed_delivery_batch_id=210,
last_local_archive_integrity_validated_batch_id=210,
last_integrity_verified_batch_id=None,
approved_wbs_denominator=None,last_independently_accepted_wp_id=None,
next_exact_task_id="GOV-WBS-RECON-001",next_exact_task=state["NEXT_EXACT_TASK"],
reconciliation_status="CONTENT_CROSSWALK_COMPLETE_APPROVAL_OPEN",
batch210_local_sha256=zh,batch210_remote_verified=False,
source_reconciliation_baseline_commit=base)
statepath.write_bytes(enc(canonical))
plan=(R/"governance/MASTER_PLAN_AND_WBS_RECOVERY_REGISTER_v0.4_2026-11-04.md")
plan.write_text("# Canonical master recovery and WBS v0.4\n\n"
+"Baseline "+base+". Registered batch 210 evidence source inventory: 59/59 historical checkpoints; 317/317 tracked source files; 150 historical WP directories.\n"
+"120 original contract JSONs present, 30 absent (derived evidence kept separately); 25 domain groups and Education Edition are proposals, not approved WBS.\n"
+"151–209 integrity checks: "+str(passnum)+" PASS, "+str(59-passnum)+" FAIL. See B210/ARCHIVE_151_209_AUDIT.json.\n"
+"Original custody not independently authenticated; machine reconciliation is not legal, financial or external acceptance.\n"
+"WP-ACC-005 P0 remains BLOCKED; institution-specific GIMAC entitlement NOT VERIFIED; 15 DoR gates NOT VERIFIED; bank tests 0.\n"
+"Approved work package completion denominator UNKNOWN. Source ZIP hashes and original ZIPs preserved.\n"
+"NEXT EXACT TASK: "+state["NEXT_EXACT_TASK"]+"\n",encoding="utf8")
print(json.dumps({"source_files":len(srcledger),"subbatches":len(rows),"pass":passnum,"fail":59-passnum,
"historical_wps":len(wplist),"contract_present":sum(bool(x["original_contract"]) for x in wplist),
"zip_sha256":zh,"zip_bytes":zpath.stat().st_size,"checkpoint":"210"}))
