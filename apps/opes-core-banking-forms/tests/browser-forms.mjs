import assert from "node:assert/strict";
import {chromium} from "playwright";
import {mkdirSync} from "node:fs";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
import {FORMS} from "../src/forms.js";
const origin="http://127.0.0.1:8769/apps/opes-core-banking-forms/";
const out=fileURLToPath(new URL("../audit/",import.meta.url));
mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:"reduce"});
const errors=[];page.on("pageerror",e=>errors.push(e.message));
try{
 await page.goto(origin,{waitUntil:"load"});
 await page.getByRole("heading",{name:"Banking forms and controlled workflows"}).waitFor();
 assert.equal(await page.locator(".domain-button").count(),26);
 assert.equal(FORMS.length,589);
 assert.equal(await page.locator(".form-list-item").count(),100);
 for(const width of [320,375,768,1024,1440]){
  await page.setViewportSize({width,height:900});
  await page.goto(origin,{waitUntil:"load"});
  await page.locator(".form-panel").waitFor();
  const r=await page.evaluate(()=>({width:innerWidth,doc:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
  assert.ok(r.doc<=width+2,"document overflow "+width+" "+JSON.stringify(r));
  assert.ok(r.body<=width+2,"body overflow "+width+" "+JSON.stringify(r));
  const png=await page.screenshot({path:join(out,"forms-studio-"+width+".png"),fullPage:true});
  assert.ok(png.readUInt32BE(16)<=width+2,"screenshot wider than viewport at "+width);
 }
 const allIds=FORMS.map(x=>x.id);
 for(const width of [320,375,768,1024,1440]){
  await page.setViewportSize({width,height:900});
  const result=await page.evaluate(ids=>{
   const bad=[];
   for(const id of ids){
    location.hash="#/form/"+id;
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    const main=document.querySelector(".form-panel h2");
    const fields=document.querySelectorAll("#synthetic-form fieldset");
    const submit=[...document.querySelectorAll(".form-panel button")].find(b=>b.textContent?.includes("Submit — blocked"));
    const over=document.documentElement.scrollWidth-innerWidth;
    if(!main||!fields.length||!submit?.disabled||over>2)bad.push({id,over,title:main?.textContent,fields:fields.length,blocked:submit?.disabled});
   }
   return bad;
  },allIds);
  assert.deepEqual(result,[],"form failures at "+width+"px");
 }
 await page.setViewportSize({width:1440,height:900});
 await page.goto(origin,{waitUntil:"load"});
 await page.locator("#form-search").fill("loan application");
 assert.ok(await page.locator(".form-list-item").count()>=1);
 await page.locator("#form-search").fill("");
 await page.locator("#form-domain").selectOption("CRD");
 assert.equal(await page.locator(".form-list-item").count(),48);
 await page.locator("#form-domain").selectOption("ALL");
 const samples=[
  FORMS.find(f=>f.code==="CIF"&&f.fields.some(x=>x.id==="partyType")),
  FORMS.find(f=>f.repeaters.some(r=>r.id==="journalLines")),
  FORMS.find(f=>f.repeaters.some(r=>r.id==="denominationLines")),
  FORMS.find(f=>f.repeaters.some(r=>r.id==="beneficiaryLines")),
  FORMS.find(f=>f.code==="CRD"),
  FORMS.find(f=>f.code==="HR")
 ].filter(Boolean);
 for(const sample of samples){
  await page.goto(origin+"#/form/"+sample.id,{waitUntil:"load"});
  await page.locator("h2").getByText(sample.name).waitFor();
  const role=await page.locator("#preview-role").inputValue();
  if(role!==sample.previewRole)await page.locator("#preview-role").selectOption(sample.previewRole);
  await page.locator('[data-action="sample"]').first().click();
  await page.locator('[data-action="validate"]').first().click();
  await page.getByText(/Local structure validated — NOT submitted/i).waitFor();
  await page.screenshot({path:join(out,"sample-"+sample.code+"-"+sample.id+".png"),fullPage:true});
  await page.locator('[data-action="save"]').first().click();
  await page.getByText(/LOCAL_DRAFT_NOT_SUBMITTED/).first().waitFor();
 }
 const journal=FORMS.find(f=>f.repeaters.some(r=>r.id==="journalLines"));
 await page.goto(origin+"#/form/"+journal.id,{waitUntil:"load"});
 if(journal.previewRole!=="operator")await page.locator("#preview-role").selectOption(journal.previewRole);
 await page.locator('[data-action="sample"]').first().click();
 await page.locator('input#r-journalLines-1-amountMinor').fill("901");
 await page.locator('[data-action="validate"]').first().click();
 await page.getByText(/Debit and credit totals must balance independently/).first().waitFor();
 const reviewer=FORMS.find(f=>f.variantKind==="review");
 await page.goto(origin+"#/form/"+reviewer.id,{waitUntil:"load"});
 assert.equal(await page.locator('[data-action="save"]').first().isDisabled(),true);
 await page.locator("#preview-role").selectOption("reviewer");
 assert.equal(await page.locator('[data-action="save"]').first().isEnabled(),true);
 await page.locator("#preview-state").selectOption("access_denied");
 assert.equal(await page.locator('[data-action="save"]').first().isDisabled(),true);
 await page.locator("#preview-state").selectOption("offline_readonly");
 assert.equal(await page.locator('[data-action="sample"]').first().isDisabled(),true);
 const domains=[...new Set(FORMS.map(f=>f.code))];
 for(const code of domains){
  const target=FORMS.find(f=>f.code===code);
  for(const width of [375,1440]){
   await page.setViewportSize({width,height:900});
   await page.goto(origin+"#/form/"+target.id,{waitUntil:"load"});
   await page.locator(".form-panel").waitFor();
   const dims=await page.evaluate(()=>({width:innerWidth,page:document.documentElement.scrollWidth}));
   assert.ok(dims.page<=dims.width+2,code+" horizontal overflow "+JSON.stringify(dims));
   await page.screenshot({path:join(out,"domain-"+code+"-"+width+".png"),fullPage:true});
  }
 }
 assert.deepEqual(errors,[],"Unexpected page errors "+errors.join("; "));
 console.log("PASS: 589 forms, five viewport sweeps, 25 domains x two screenshots, repeaters, validation, local drafts and fail-closed roles");
}finally{await browser.close();}
