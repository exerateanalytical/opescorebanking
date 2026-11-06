import assert from "node:assert/strict";
import {chromium} from "playwright";
import {mkdirSync} from "node:fs";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
import {REPORTS,REPORT_GROUPS} from "../src/report-registry.js";
const origin="http://127.0.0.1:8770/apps/opes-core-banking-reports/";
const audit=fileURLToPath(new URL("../audit/",import.meta.url));
mkdirSync(audit,{recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},acceptDownloads:true,reducedMotion:"reduce"});
const pageErrors=[];page.on("pageerror",error=>pageErrors.push(error.message));
try{
 await page.goto(origin,{waitUntil:"load"});
 await page.getByRole("heading",{name:"Banking and management reports"}).waitFor();
 assert.equal(await page.locator(".report-link").count(),378);
 assert.equal(await page.locator(".domain").count(),26);
 for(const width of [320,375,768,1024,1440]){
  await page.setViewportSize({width,height:900});
  await page.goto(origin,{waitUntil:"load"});
  await page.locator(".report-head").waitFor();
  const dims=await page.evaluate(()=>({w:innerWidth,doc:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
  assert.ok(dims.doc<=width+2,"Viewport overflow at "+width+": "+JSON.stringify(dims));
  assert.ok(dims.body<=width+2,"Body overflow at "+width+": "+JSON.stringify(dims));
  await page.screenshot({path:join(audit,"report-studio-"+width+".png"),fullPage:true});
 }
 const ids=REPORTS.map(r=>r.id);
 for(const width of [320,768,1440]){
  await page.setViewportSize({width,height:900});
  await page.goto(origin,{waitUntil:"load"});
  const issues=await page.evaluate(ids=>{
   const out=[];
   for(const id of ids){
    history.replaceState(null,"","#/report/"+id);
    dispatchEvent(new HashChangeEvent("hashchange"));
    const title=document.querySelector(".report-head h2")?.textContent;
    const controls=document.querySelectorAll(".tabs .tab");
    const grid=document.querySelector(".table-scroll table");
    const o=document.documentElement.scrollWidth-innerWidth;
    if(!title||controls.length!==3||!grid||o>2)out.push({id,title,tabs:controls.length,grid:!!grid,overflow:o});
   }
   return out;
  },ids);
  assert.deepEqual(issues,[],"All-route UI audit at "+width);
 }
 await page.setViewportSize({width:1440,height:900});
 await page.goto(origin,{waitUntil:"load"});
 await page.locator("#report-search").fill("General Ledger Trial Balance");
 assert.equal(await page.locator(".report-link").count(),1);
 await page.locator(".report-link").first().click();
 await page.getByRole("heading",{name:"General Ledger Trial Balance"}).waitFor();
 assert.ok(await page.locator(".table-scroll table").count());
 const csvEvent=page.waitForEvent("download");
 await page.locator('[data-action="csv"]').first().click();
 const csv=await csvEvent;assert.match(csv.suggestedFilename(),/SYNTHETIC\.csv$/);
 const htmlEvent=page.waitForEvent("download");
 await page.locator('[data-action="html"]').first().click();
 const html=await htmlEvent;assert.match(html.suggestedFilename(),/PRINT-SPECIMEN\.html$/);
 await page.locator('select[data-filter="currency"]').selectOption("ALL");
 await page.getByText(/Mixed currencies cannot be summed/).waitFor();
 await page.locator('select[data-filter="currency"]').selectOption("XAF");
 await page.locator('[data-tab="specification"]').click();
 await page.getByRole("heading",{name:"Data contract, measures and business grain"}).waitFor();
 await page.locator('[data-tab="controls"]').click();
 await page.getByRole("button",{name:/Submit regulatory return/}).waitFor();
 assert.equal(await page.getByRole("button",{name:/Submit regulatory return/}).isDisabled(),true);
 await page.getByRole("button",{name:/Run real bank report/}).isDisabled().then(isDisabled=>assert.equal(isDisabled,true));
 for(const [code]of REPORT_GROUPS){
  const r=REPORTS.find(x=>x.code===code);
  for(const width of [375,1440]){
   await page.setViewportSize({width,height:900});
   await page.goto(origin+"#/report/"+r.id,{waitUntil:"load"});
   await page.locator(".report-head").waitFor();
   const d=await page.evaluate(()=>({width:innerWidth,doc:document.documentElement.scrollWidth}));
   assert.ok(d.doc<=width+2,"Domain "+code+" overflow at "+width+" "+JSON.stringify(d));
   await page.screenshot({path:join(audit,"domain-"+code+"-"+width+".png"),fullPage:true});
  }
 }
 const names=["Loan Portfolio Overview","General Ledger Trial Balance","Portfolio at Risk 30 Days","COBAC Capital Adequacy Source Inputs","Executive Banking KPI Summary"];
 const dist=fileURLToPath(new URL("../dist/print-specimens/",import.meta.url));
 for(const name of names){
  const r=REPORTS.find(x=>x.title===name);assert.ok(r,name);
  const url="file://"+join(dist,r.code,r.id+"-SYNTHETIC.html");
  await page.goto(url,{waitUntil:"load"});
  assert.equal(await page.locator(".watermark").innerText(),"SPECIMEN · NOT VALID");
  await page.pdf({path:join(audit,r.id+"-SYNTHETIC.pdf"),format:"A4",landscape:true,printBackground:true});
 }
 assert.deepEqual(pageErrors,[]);
 console.log("PASS 378 report routes at 3 viewports, 5 global viewport audits, 25 domains at 375/1440, CSV/HTML downloads, 5 PDF samples, blocked official actions");
}finally{await browser.close();}
