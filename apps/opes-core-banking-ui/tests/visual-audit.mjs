import assert from "node:assert/strict";
import {chromium} from "playwright";
import {SCREENS} from "../src/catalog.js";
const origin="http://127.0.0.1:8765/apps/opes-core-banking-ui/";
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:"reduce"});
const errors=[];page.on("pageerror",e=>errors.push(e.message));
try{
 await page.goto(origin,{waitUntil:"load"});
 await page.getByRole("heading",{name:"Core Banking workspace"}).waitFor();
 assert.equal(await page.locator(".domain-card").count(),26);
 for(const width of [320,375,768,1024,1440]){
  await page.setViewportSize({width,height:900});
  await page.goto(origin+"#/screen/ACT-UI-001",{waitUntil:"load"});
  await page.locator("h1").waitFor();
  const d=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth,title:document.querySelector("h1")?.textContent}));
  assert.equal(d.title,"Accounts List");
  assert.ok(d.document<=d.viewport+2,"document overflow "+width+" "+JSON.stringify(d));
  assert.ok(d.body<=d.viewport+2,"body overflow "+width+" "+JSON.stringify(d));
  await page.screenshot({path:"audit/viewport-"+width+".png",fullPage:true});
 }
 await page.goto(origin);
 await page.locator('[data-action="go-first"][data-domain="CIF"]').first().click();
 assert.match(page.url(),/CIF-UI-001$/);
 await page.locator("#global-search").fill("LED-UI-002");
 await page.locator('[data-action="route"][data-id="LED-UI-002"]').click();
 await page.getByRole("heading",{name:"Journal Entry"}).waitFor();
 await page.getByRole("button",{name:/New local draft/i}).first().click();
 await page.locator("dialog[open]").waitFor();
 const form=page.locator("#local-draft-form");
 for(const field of await form.locator("input,textarea,select").all()){
  const tag=await field.evaluate(e=>e.tagName.toLowerCase());
  if(tag==="select"){await field.selectOption({index:1});continue;}
  const type=await field.getAttribute("type");
  if(type==="date")await field.fill("2026-11-05");
  else if(type==="number")await field.fill("10000");
  else if((await field.getAttribute("name"))==="debitGL")await field.fill("DR-100");
  else if((await field.getAttribute("name"))==="creditGL")await field.fill("CR-200");
  else await field.fill("SYNTHETIC-REFERENCE");
 }
 await form.getByRole("button",{name:/Save local draft/i}).click();
 await page.getByText("Not submitted").first().waitFor();
 await page.getByRole("button",{name:"Inspect"}).first().click();
 await page.locator("dialog[open]").waitFor();
 await page.getByRole("button",{name:"Close",exact:true}).click();
 page.once("dialog",async dialog=>await dialog.accept());
 await page.getByRole("button",{name:"Discard"}).first().click();
 await page.getByText("No matching local drafts").waitFor({timeout:4000});
 const failures=await page.evaluate(ids=>{
  const missing=[];
  for(const id of ids){
   location.hash="#/screen/"+id;
   window.dispatchEvent(new HashChangeEvent("hashchange"));
   if(!document.querySelector("h1")?.textContent?.trim())missing.push(id);
  }
  return missing;
 },SCREENS.map(s=>s.id));
 assert.deepEqual(failures,[]);
 assert.deepEqual(errors,[]);
 console.log("PASS: 726 routes and desktop/mobile viewport audit, synthetic draft lifecycle, no browser page errors");
}finally{await browser.close();}
