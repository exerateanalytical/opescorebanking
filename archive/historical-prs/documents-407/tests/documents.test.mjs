import test from "node:test";
import assert from "node:assert/strict";
import {TEMPLATES,TEMPLATE_BY_ID,TEMPLATE_GROUP_COUNTS,TEMPLATE_GROUPS,TEMPLATE_FAMILIES,CATALOGUE_STATE} from "../src/templates.js";
import {renderDocumentHtml,demoData} from "../src/render.js";
import {PRINT_CSS} from "../src/print-css.js";
test("407 unique document designs grouped under 25 quota-verified domains",()=>{
 assert.equal(TEMPLATES.length,407);assert.equal(TEMPLATE_BY_ID.size,407);
 assert.equal(TEMPLATE_GROUPS.length,25);
 assert.equal(TEMPLATE_GROUPS.reduce((a,g)=>a+g[1],0),407);
 const names=new Set();
 for(const [code,quota]of TEMPLATE_GROUPS)assert.equal(TEMPLATE_GROUP_COUNTS[code],quota,code);
 for(const t of TEMPLATES){
  assert.match(t.id,/^DOC-[A-Z]+-\d{3}$/);assert.ok(!names.has(t.name),t.id+" duplicate document name");names.add(t.name);
  assert.equal(t.status,"DRAFT_NOT_APPROVED");assert.equal(t.approvedForProduction,false);
  assert.equal(t.signatures.enabled,false);assert.equal(t.qrVerification.enabled,false);
  assert.equal(t.workflow.authorization,"BLOCKED");assert.equal(t.workflow.finalIssue,"BLOCKED");
  assert.equal(t.frenchTranslationStatus,"NOT_COMPLETE");assert.ok(t.fields.length>=9);
  assert.equal(new Set(t.fields.map(f=>f.id)).size,t.fields.length);
  assert.ok(t.fields.every(f=>f.id&&f.label&&f.section&&typeof f.required==="boolean"));
  assert.ok(["A4","A4-LANDSCAPE","A5"].includes(t.layout.paper));
  assert.ok(t.regulatoryReferences.length>0);
 }
 assert.equal(CATALOGUE_STATE.productionAccepted,0);
 assert.ok(TEMPLATE_FAMILIES.length>=14);
});
test("Every document produces standalone print HTML that cannot masquerade as issuance",()=>{
 for(const t of TEMPLATES){
  const html=renderDocumentHtml(t,demoData(t));
  assert.ok(html.startsWith("<!doctype html>"),t.id);
  assert.ok(html.includes("<style>"),t.id);
  assert.ok(html.includes("SPECIMEN · NOT VALID"),t.id);
  assert.ok(html.includes("UNAPPROVED DOCUMENT SPECIMEN"),t.id);
  assert.ok(html.includes(t.id),t.id);
  assert.ok(html.includes("No trusted QR/token"),t.id);
  assert.ok(html.includes("<h1 class=\"doc-title\">"),t.id);
  assert.ok(!/<script\b/i.test(html),t.id);
 }
});
test("Banking-specific specimen layouts include required control language",()=>{
 const cases=[
 ["Current Account Statement",["Statement movements","authoritative ledger required"]],
 ["Cash Deposit Slip",["TRANSACTION AMOUNT","Receipt particulars"]],
 ["Employee Payslip",["Earnings","Deductions","Authorized net pay","CNPS"]],
 ["Loan Agreement Draft",["UNAPPROVED LEGAL DRAFT","TEG","Parties and proposed terms"]],
 ["Loan Amortization Schedule",["Amortization schedule","Principal and terms"]],
 ["Regulatory Credit Classification",["Regulatory return identification","not an approved COBAC/BEAC filing layout"]]
 ];
 for(const [name,fragments]of cases){
  const t=TEMPLATES.find(x=>x.name===name);assert.ok(t,name+" not found");
  const html=renderDocumentHtml(t,demoData(t));
  for(const fragment of fragments)assert.ok(html.toLowerCase().includes(fragment.toLowerCase()),name+" missing "+fragment);
 }
});
test("All external strings are HTML escaped, unapproved French output fails closed",()=>{
 const t=TEMPLATES[0],html=renderDocumentHtml(t,{institutionName:'<script>alert("X")</script>',documentReference:'<img src=x onerror=alert(1)>'});
 assert.ok(html.includes("&lt;script&gt;"));
 assert.ok(!html.includes('<script>alert("X")'));
 assert.ok(html.includes("&lt;img src=x onerror=alert(1)&gt;"));
 assert.throws(()=>renderDocumentHtml(t,{}, {lang:"fr"}),/not yet approved/);
 assert.throws(()=>renderDocumentHtml("DOC-UNKNOWN-999"),/Unknown document/);
});
test("Print styles have A4/A5 rules without glows or gradients",()=>{
 assert.ok(PRINT_CSS.includes("@media print"));
 assert.ok(PRINT_CSS.includes("A4 landscape"));
 assert.ok(PRINT_CSS.includes("A5 portrait"));
 assert.ok(PRINT_CSS.includes("break-inside:avoid"));
 assert.ok(!/box-shadow\s*:|linear-gradient|radial-gradient|filter\s*:\s*blur/i.test(PRINT_CSS));
});
