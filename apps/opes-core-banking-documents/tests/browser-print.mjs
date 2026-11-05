import assert from "node:assert/strict";
import {chromium} from "playwright";
import {mkdirSync} from "node:fs";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
import {TEMPLATES} from "../src/templates.js";
const origin="http://127.0.0.1:8768/apps/opes-core-banking-documents/";
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:"reduce"});
const errs=[];page.on("pageerror",e=>errs.push(e.message));
const audit=fileURLToPath(new URL("../audit/",import.meta.url));
mkdirSync(audit,{recursive:true});
try {
 await page.goto(origin,{waitUntil:"load"});
 await page.getByRole("heading",{name:"Banking document studio"}).waitFor();
 assert.equal(await page.locator(".template-item").count(),407);
 assert.equal(await page.locator(".domain-link").count(),26);
 for(const width of [320,375,768,1024,1440]){
  await page.setViewportSize({width,height:900});
  await page.goto(origin,{waitUntil:"load"});
  await page.locator(".preview-frame").waitFor();
  const dims=await page.evaluate(()=>({width:innerWidth,doc:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
  assert.ok(dims.doc<=width+2,"Document overflow "+width+" "+JSON.stringify(dims));
  assert.ok(dims.body<=width+2,"Body overflow "+width+" "+JSON.stringify(dims));
  await page.screenshot({path:join(audit,"studio-"+width+".png"),fullPage:true});
 }
 await page.setViewportSize({width:1440,height:900});
 await page.goto(origin);
 await page.locator("#doc-search").fill("Employee Payslip");
 assert.equal(await page.locator(".template-item").count(),1);
 await page.locator(".template-item").first().click();
 await page.getByRole("heading",{name:"Employee Payslip"}).waitFor();
 const frame=page.frameLocator("#document-frame");
 await frame.getByText("Earnings",{exact:true}).waitFor();
 await frame.getByText("Deductions",{exact:true}).waitFor();
 await page.locator("#doc-search").fill("");
 await page.locator("#doc-domain").selectOption("CRD");
 assert.equal(await page.locator(".template-item").count(),33);
 await page.locator("#doc-domain").selectOption("ALL");
 const families=[...new Set(TEMPLATES.map(t=>t.family))];
 for(const family of families){
  const example=TEMPLATES.find(t=>t.family===family);
  await page.goto(origin+"#/document/"+example.id,{waitUntil:"load"});
  await page.getByRole("heading",{name:example.name}).waitFor();
  const text=await page.frameLocator("#document-frame").locator("body").innerText();
  assert.ok(text.includes("SPECIMEN · NOT VALID"));
  await page.screenshot({path:join(audit,"family-"+family+".png"),fullPage:true});
 }
 for(const code of [...new Set(TEMPLATES.map(t=>t.code))]){
  const item=TEMPLATES.find(t=>t.code===code);
  await page.goto(origin+"#/document/"+item.id,{waitUntil:"load"});
  await page.frameLocator(".preview-frame").locator(".specimen").waitFor();
 }
 const root=fileURLToPath(new URL("../dist/printable/",import.meta.url));
 const names=["Current Account Statement","Employee Payslip","Cash Deposit Slip","Loan Agreement Draft","Regulatory Credit Classification"];
 for(const name of names){
  const t=TEMPLATES.find(x=>x.name===name);assert.ok(t);
  await page.goto("file://"+join(root,t.code,t.id+".html"),{waitUntil:"load"});
  assert.equal(await page.locator(".specimen").innerText(),"SPECIMEN · NOT VALID");
  await page.pdf({path:join(audit,t.id+"-SPECIMEN.pdf"),printBackground:true,format:t.layout.paper==="A5"?"A5":"A4",landscape:t.layout.orientation==="landscape"});
 }
 assert.deepEqual(errs,[]);
 console.log("PASS: 407 documents, 25 groups, "+families.length+" layouts, 5 viewport widths and 5 PDF specimens");
}finally{await browser.close();}
