import assert from "node:assert/strict";
import {chromium} from "playwright";
import {mkdirSync} from "node:fs";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
import {FORMS} from "../src/form-registry.js";
const origin="http://127.0.0.1:8769/apps/opes-core-banking-forms/";
const audit=fileURLToPath(new URL("../audit/",import.meta.url));mkdirSync(audit,{recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:"reduce"});
const errors=[];page.on("pageerror",e=>errors.push(e.message));
try{
 await page.goto(origin,{waitUntil:"load"});
 await page.getByRole("heading",{name:"Banking transaction forms"}).waitFor();
 assert.equal(await page.locator(".form-option").count(),726);
 assert.equal(await page.locator(".domain").count(),27);
 for(const width of [320,375,768,1024,1440]){
  await page.setViewportSize({width,height:900});
  await page.goto(origin,{waitUntil:"load"});
  await page.locator(".form-head").waitFor();
  const dims=await page.evaluate(()=>({width:innerWidth,html:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
  assert.ok(dims.html<=dims.width+2,"UI horizontal overflow "+width+" "+JSON.stringify(dims));
  assert.ok(dims.body<=dims.width+2,"UI body overflow "+width+" "+JSON.stringify(dims));
  await page.screenshot({path:join(audit,"forms-"+width+".png"),fullPage:true});
 }
 await page.setViewportSize({width:1440,height:900});
 await page.goto(origin,{waitUntil:"load"});
 await page.locator("#search").fill("LED-UI-002");
 assert.equal(await page.locator(".form-option").count(),1);
 await page.locator(".form-option").click();
 assert.match(page.url(),/FORM-LED-UI-002/);
 await page.getByRole("button",{name:"Populate synthetic example"}).click();
 await page.locator('input[name="debitGL"]').fill("DEBIT-100");
 await page.locator('input[name="creditGL"]').fill("CREDIT-200");
 await page.locator('input[name="amountMinor"]').fill("1000");
 await page.locator('input[name="creditAmountMinor"]').fill("500");
 await page.getByRole("button",{name:"Validate draft"}).click();
 await page.getByText(/Credit and debit leg amounts must match/).waitFor();
 await page.locator('input[name="creditAmountMinor"]').fill("1000");
 await page.getByRole("button",{name:"Save draft in memory"}).click();
 await page.getByText(/VALIDATED LOCALLY \/ NOT SUBMITTED/).waitFor();
 await page.getByRole("tab",{name:"Workflow gates"}).click();
 for(const label of ["Submit for approval · BLOCKED","Independent approval · BLOCKED","Execute / post · BLOCKED","Reconcile · BLOCKED"]){
  assert.equal(await page.getByRole("button",{name:label}).isDisabled(),true);
 }
 await page.goto(origin+"#/form/FORM-CIF-UI-001");
 assert.equal(await page.locator("#data-form").count(),0);
 await page.goto(origin+"#/form/FORM-CIF-UI-002");
 await page.getByRole("button",{name:"Populate synthetic example"}).click();
 await page.locator('select[name="partyType"]').selectOption("Legal entity");
 await page.locator('input[name="beneficialOwnerLink"]').waitFor();
 const domainIds=[...new Set(FORMS.map(f=>f.domain))];
 for(const d of domainIds){
  const form=FORMS.find(f=>f.domain===d);
  await page.goto(origin+"#/form/"+form.id,{waitUntil:"load"});
  await page.locator(".form-head").waitFor();
  for(const width of [375,1440]){
   await page.setViewportSize({width,height:900});
   await page.reload({waitUntil:"load"});
   const d=await page.evaluate(()=>({width:innerWidth,html:document.documentElement.scrollWidth}));
   assert.ok(d.html<=width+2,"Domain clipping "+form.id+" at "+width+" "+JSON.stringify(d));
   if(width===1440)await page.screenshot({path:join(audit,"domain-"+form.domain+".png"),fullPage:true});
  }
 }
 assert.deepEqual(errors,[]);
 console.log("PASS: 726 form routes, 26 domain snapshots, 5 viewport widths, local validation and hard-disabled banking actions");
}finally{await browser.close();}
