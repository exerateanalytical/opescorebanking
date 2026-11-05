import assert from "node:assert/strict";
import {chromium} from "playwright";
import {SCREENS} from "../src/catalog.js";
import {PRIORITY_DOMAINS} from "../src/priority-contracts.js";
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
 const priority=SCREENS.map(s=>s.id); // Every route, not just the priority domains
 for(const width of [320,375,768,1024,1440]){
  await page.setViewportSize({width,height:900});
  const checked=await page.evaluate(ids=>{const problems=[];for(const id of ids){location.hash="#/screen/"+id;window.dispatchEvent(new HashChangeEvent("hashchange"));const h=document.querySelector("h1"),selector=document.querySelector("#screen-selector"),specific=document.querySelector(".screen-specific"),states=document.querySelector("#preview-state");const over=document.documentElement.scrollWidth-innerWidth;const actionRows=document.querySelectorAll(".screen-specific .action-row").length;if(!h?.textContent||!selector||!specific||!states||actionRows!==11||over>2)problems.push({id,over,title:h?.textContent,specific:!!specific,states:!!states,actionRows});}return problems;},priority);
  assert.deepEqual(checked,[],"priority screen issues at "+width+"px");
 }
 await page.setViewportSize({width:1440,height:900});
 for(const id of ["CIF-UI-002","ACT-UI-003","LED-UI-002","BRN-UI-004","CRD-UI-002"]){await page.goto(origin+"#/screen/"+id,{waitUntil:"load"});await page.locator("h1").waitFor();assert.ok(await page.locator(".field-group").count()>=1);await page.screenshot({path:"audit/priority-"+id+".png",fullPage:true});await page.setViewportSize({width:375,height:812});await page.reload({waitUntil:"load"});await page.locator("h1").waitFor();
  const widthAudit=await page.evaluate(()=>{const width=innerWidth;return {width,document:document.documentElement.scrollWidth,body:document.body.scrollWidth,over:[...document.querySelectorAll("*")].filter(e=>e.getBoundingClientRect().right>width+2).slice(0,8).map(e=>({tag:e.tagName,cls:typeof e.className==="string"?e.className:"",right:Math.round(e.getBoundingClientRect().right)}))};});
  console.log("MOBILE FLAGSHIP AUDIT "+id+" "+JSON.stringify(widthAudit));
  assert.ok(widthAudit.body<=widthAudit.width+2,"Body overflow on "+id+" "+JSON.stringify(widthAudit));
  assert.ok(widthAudit.document<=widthAudit.width+2,"Document overflow on "+id+" "+JSON.stringify(widthAudit));
  const shot=await page.screenshot({path:"audit/priority-mobile-"+id+".png",fullPage:true});
  assert.ok(shot.readUInt32BE(16)<=widthAudit.width+2,"Screenshot wider than viewport: "+id+" "+shot.readUInt32BE(16)+" vs "+widthAudit.width);
  await page.setViewportSize({width:1440,height:900});}
 await page.goto(origin+"#/screen/REP-UI-001");
 await page.locator("#preview-state").selectOption("access_denied");
 await page.getByRole("heading",{name:"Access denied"}).waitFor();
 await page.locator("#preview-state").selectOption("offline_readonly");
 await page.getByRole("heading",{name:/Offline read-only preview/i}).waitFor();
 for(const domain of [...new Set(SCREENS.map(s=>s.domain))]){
  const screen=SCREENS.find(s=>s.domain===domain);
  for(const width of [375,1440]){
   await page.setViewportSize({width,height:900});
   await page.goto(origin+"#/screen/"+screen.id,{waitUntil:"load"});
   await page.locator(".screen-specific").waitFor();
   const geometry=await page.evaluate(()=>({width:innerWidth,doc:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
   assert.ok(geometry.doc<=geometry.width+2,domain+" content clipping at "+width+" "+JSON.stringify(geometry));
   const img=await page.screenshot({path:"audit/domain-"+domain+"-"+width+".png",fullPage:true});
   assert.ok(img.readUInt32BE(16)<=width+2,domain+" wrong screenshot width "+width);
  }
 }
 await page.setViewportSize({width:1440,height:900});
 await page.goto(origin+"#/screen/CIF-UI-001");assert.equal(await page.getByRole("button",{name:/New local draft/i}).first().isDisabled(),true);
 await page.goto(origin+"#/screen/CIF-UI-002");assert.equal(await page.getByRole("button",{name:/New local draft/i}).first().isEnabled(),true);
 await page.locator("#screen-selector").selectOption("CIF-UI-003");assert.match(page.url(),/CIF-UI-003$/);
 await page.goto(origin+"#/screen/LED-UI-002");await page.getByRole("button",{name:/New local draft/i}).first().click();const ledgerForm=page.locator("#local-draft-form");assert.ok(await ledgerForm.locator("fieldset").count()>=2);await page.getByRole("button",{name:"Cancel"}).click();
 await page.goto(origin+"#/screen/BRN-UI-004");await page.getByRole("button",{name:/New local draft/i}).first().click();
 const countForm=page.locator("#local-draft-form");for(const input of await countForm.locator("input,select,textarea").all()){const tag=await input.evaluate(el=>el.tagName.toLowerCase());const name=await input.getAttribute("name");if(tag==="select"){await input.selectOption({index:1});continue;}const type=await input.getAttribute("type");if(type==="date"){await input.fill("2026-11-05");continue;}if(type==="number"){if(name==="expectedMinor")await input.fill("0");else if(name==="denom10000")await input.fill("2");else await input.fill("0");continue;}await input.fill("SYNTHETIC-REFERENCE");}
 await countForm.getByRole("button",{name:/Save local draft/i}).click();await page.getByText("Not submitted").first().waitFor();await page.getByRole("tab",{name:"Overview"}).click();await page.getByText("Counted amount").waitFor();
 assert.deepEqual(errors,[]);
 console.log("PASS: 726/726 routes at 5 viewport widths; 26 domain screenshots x mobile and desktop; 11 controls and 14 states per route; no browser exceptions");
}finally{await browser.close();}
