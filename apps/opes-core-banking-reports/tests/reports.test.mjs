import test from "node:test";
import assert from "node:assert/strict";
import {REPORTS,REPORT_BY_ID,REPORT_GROUPS,REPORT_GROUP_COUNTS,REPORT_SUMMARY,METRIC_CATALOGUE} from "../src/report-registry.js";
import {syntheticRows} from "../src/fixtures.js";
import {executeReport,csvReport,jsonReport,printReportHtml} from "../src/report-engine.js";
const byTitle=name=>REPORTS.find(r=>r.title===name);
test("378 unique reports, 25 exact group quotas, 14 implemented metric types and no approved outputs",()=>{
 assert.equal(REPORTS.length,378);assert.equal(REPORT_BY_ID.size,378);
 assert.equal(REPORT_GROUPS.length,25);assert.equal(REPORT_SUMMARY.total,378);
 assert.equal(REPORT_GROUPS.reduce((a,g)=>a+g[1],0),378);
 assert.equal(Object.keys(REPORT_GROUP_COUNTS).length,25);
 assert.equal(Object.keys(METRIC_CATALOGUE).length,14);
 const titles=new Set();
 for(const [code,quota]of REPORT_GROUPS)assert.equal(REPORT_GROUP_COUNTS[code],quota);
 for(const r of REPORTS){
  assert.ok(!titles.has(r.title),r.id+" duplicate title");titles.add(r.title);
  assert.match(r.id,/^RPT-[A-Z]+-\d{3}$/);
  assert.equal(r.status,"DRAFT_NOT_ACCEPTED");
  assert.equal(r.approvedForProduction,false);
  assert.equal(r.sourceRequirements.dataContract,"NOT_WIRED");
  assert.equal(r.dataModel.source,"SYNTHETIC_ONLY");
  assert.equal(r.authorization.runRealReport,false);
  assert.equal(r.authorization.exportOfficial,false);
  assert.equal(r.authorization.submitRegulator,false);
  assert.ok(r.measures.length>=1);
  assert.ok(r.measures.every(m=>METRIC_CATALOGUE[m.id]&&m.sourceFields.length));
  assert.ok(r.dimensions.includes(r.grain),r.id+" invalid grain");
  assert.ok(r.allowedFilters.some(f=>f.id==="currency"));
  assert.ok(r.privacy.suppressSmallGroupThreshold>=5);
 }
 assert.equal(REPORT_SUMMARY.accepted,0);
});
test("Execute every report twice with deterministic bank-isolated synthetic data",()=>{
 for(const r of REPORTS){
  const rows=syntheticRows(r);
  assert.equal(rows.length,180);
  const a=executeReport(r,rows,{currency:"XAF"});
  const b=executeReport(r,rows,{currency:"XAF"});
  assert.deepEqual(a,b,r.id+" nondeterministic");
  assert.equal(a.reportId,r.id);assert.equal(a.source,"SYNTHETIC_ONLY");
  assert.equal(a.institution,"DEMO-BANK");assert.equal(a.accepted,false);
  assert.ok(a.rows.length);
 }
});
test("Reject cross-bank rows, real records, duplicates, unsafe money, unauthorized run and filters",()=>{
 const r=byTitle("Loan Portfolio Overview"),demo=syntheticRows(r,{count:12});
 assert.throws(()=>executeReport(r,demo.map(x=>({...x,bankId:"OTHER-BANK"})),{currency:"XAF"}),/cross-bank/);
 assert.throws(()=>executeReport(r,demo.map(x=>({...x,recordSource:"LEDGER"})),{currency:"XAF"}),/Non-synthetic/);
 assert.throws(()=>executeReport(r,[demo[0],demo[0]],{currency:"XAF"}),/Duplicate/);
 assert.throws(()=>executeReport(r,[{...demo[0],amountMinor:-1}],{currency:"XAF"}),/Unsafe monetary/);
 assert.throws(()=>executeReport(r,[{...demo[0],amountMinor:9007199254740992}],{currency:"XAF"}),/Unsafe monetary/);
 assert.throws(()=>executeReport(r,demo,{currency:"XAF"},{authoritative:true}),/No trusted/);
 assert.throws(()=>executeReport(r,demo,{currency:"XAF"},{sourceMode:"production"}),/No trusted/);
 assert.throws(()=>executeReport(r,demo,{isAdmin:true}),/Unapproved report filter/);
});
test("Minor-unit arithmetic, reconciliation sign, and trial balance difference",()=>{
 const r=byTitle("General Ledger Trial Balance");assert.ok(r.measures.some(m=>m.id==="DEBIT_CREDIT_DIFFERENCE_MINOR"));
 const rows=syntheticRows(r,{count:12}).map((x,i)=>({...x,currency:"XAF",period:"2026-11",branch:"DEMO-DOUALA",amountMinor:100,expectedMinor:100,actualMinor:i===0?150:100,debitMinor:100,creditMinor:i===0?130:100}));
 const out=executeReport(r,rows,{currency:"XAF"});
 assert.equal(out.totals.RECORD_COUNT,12);
 assert.equal(out.totals.TOTAL_AMOUNT_MINOR,"1200");
 assert.equal(out.totals.NET_DIFFERENCE_MINOR,"50");
 assert.equal(out.totals.DEBIT_CREDIT_DIFFERENCE_MINOR,"-30");
});
test("PAR30, PAR60 and PAR90 use exposure-weighted days-past-due ratios",()=>{
 for(const [name,metric,expected]of [["Portfolio at Risk 30 Days","PAR30",70],["Portfolio at Risk 60 Days","PAR60",30],["Portfolio at Risk 90 Days","PAR90",10]]){
  const r=byTitle(name);assert.ok(r);
  const rows=syntheticRows(r,{count:10}).map((x,i)=>({...x,period:"2026-11",currency:"XAF",amountMinor:100,daysPastDue:[0,0,0,35,35,35,35,65,65,95][i]}));
  assert.equal(executeReport(r,rows,{currency:"XAF"}).totals[metric],expected,name);
 }
});
test("Currency safety forbids combined XAF and EUR totals",()=>{
 const r=byTitle("Loan Portfolio Overview"),rows=syntheticRows(r,{count:30}).map((x,i)=>({...x,currency:i%2?"EUR":"XAF"}));
 assert.throws(()=>executeReport(r,rows,{currency:"ALL"}),/Mixed currencies/);
 assert.equal(executeReport(r,rows,{currency:"EUR"}).recordCount,15);
 const rc=byTitle("Account Currency Mix");assert.equal(rc.grain,"currency");
 const multi=executeReport(rc,syntheticRows(rc),{currency:"ALL"});
 assert.equal(multi.currency,"MULTI_CURRENCY");assert.equal(multi.totals,null);
});
test("Small-group suppression removes counts, group names, row details and totals",()=>{
 const r=byTitle("Customer Portfolio Overview"),rows=syntheticRows(r,{count:4}).map(x=>({...x,currency:"XAF"}));
 const out=executeReport(r,rows,{currency:"XAF"});
 assert.ok(out.rows.every(x=>x.suppressed&&x.count===null&&x.metrics===null&&x.dimensionValue==="SUPPRESSED GROUP"));
 assert.equal(out.totals,null);
 const csv=csvReport(r,out);assert.ok(csv.includes("SUPPRESSED"));assert.ok(!csv.includes(rows[0].period));
});
test("Zero denominator yields null instead of fabricated portfolio quality",()=>{
 const par=byTitle("Portfolio at Risk 30 Days");
 const rows=syntheticRows(par,{count:12}).map(x=>({...x,currency:"XAF",amountMinor:0}));
 const out=executeReport(par,rows,{currency:"XAF"});assert.equal(out.totals.PAR30,null);
 const empty=executeReport(par,[],{currency:"XAF"});assert.equal(empty.recordCount,0);assert.equal(empty.rows.length,0);
});
test("CSV spreadsheet formulas, HTML script injection and non-demo exports are blocked",()=>{
 const r=byTitle("Customer Portfolio Overview");
 const rows=syntheticRows(r,{count:8}).map(x=>({...x,period:'=HYPERLINK("https://example.invalid")',currency:"XAF"}));
 const out=executeReport(r,rows,{currency:"XAF"});
 assert.ok(csvReport(r,out).includes("'=HYPERLINK"));
 const html=printReportHtml({...r,title:"<script>bad()</script>"},out);
 assert.ok(html.includes("&lt;script&gt;bad()&lt;/script&gt;"));
 assert.ok(!html.includes("<script>bad()"));
 assert.ok(html.includes("SPECIMEN · NOT VALID"));
 assert.ok(jsonReport(r,out).includes('"accepted": false'));
 assert.throws(()=>csvReport(r,{...out,source:"LEDGER"}),/Only synthetic/);
});
