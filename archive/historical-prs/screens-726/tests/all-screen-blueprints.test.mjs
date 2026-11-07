import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {SCREENS, DOMAIN_LABELS} from "../src/catalog.js";
import {SCREEN_BLUEPRINTS, SCREEN_BLUEPRINTS_COUNT, screenBlueprint, SPEC_DELIVERY} from "../src/all-screen-blueprints.js";

test("All 726 screens have a distinct, complete client-side specification",()=>{
 assert.equal(SCREENS.length,726);
 assert.equal(SCREEN_BLUEPRINTS_COUNT,726);
 assert.equal(Object.keys(SCREEN_BLUEPRINTS).length,726);
 for(const s of SCREENS){
  const c=screenBlueprint(s);
  assert.ok(c,s.id+" missing blueprint");
  assert.equal(c.id,s.id);
  assert.equal(c.title,s.name);
  assert.equal(c.domain,s.domain);
  assert.equal(c.schemaVersion,"UI-2026-11-05-V1");
  assert.equal(c.status,"UI_SPEC_GENERATED_NOT_ACCEPTED");
  assert.ok(c.fields.length>=5,s.id+" missing task fields: "+c.fields.length);
  assert.equal(c.fields.length,new Set(c.fields.map(f=>f.id)).size,s.id+" duplicate field IDs");
  assert.ok(c.fields.every(f=>!!f.id&&!!f.label&&!!f.group&&typeof f.required==="boolean"),s.id+" bad field shape");
  assert.ok(c.fields.some(f=>f.id==="targetReference"),s.id+" missing task-specific reference");
  assert.ok(c.fields.some(f=>f.id==="policyVersion"),s.id+" missing policy version");
  assert.ok(c.fields.some(f=>f.id==="actionReason"),s.id+" missing action reason");
  assert.ok(c.groups.length>=1);
  assert.equal(c.phases.length,4);
  assert.ok(c.phases.every(p=>p.status==="DESIGN_ONLY"));
  assert.equal(c.tabs.length,4);
  assert.ok(c.tabs.includes("workflow")&&c.tabs.includes("controls"));
  assert.ok(c.roles.length>=1);
  assert.equal(c.stateList.length,14);
  assert.ok(c.stateList.includes("offline_readonly")&&c.stateList.includes("external_unknown"));
  assert.ok(c.stateList.includes("reconciliation_hold")&&c.stateList.includes("access_denied"));
  assert.ok(c.purpose.toLowerCase().includes(c.topic.toLowerCase()),s.id+" missing task purpose");
  assert.equal(c.security.dataHandling,"SYNTHETIC_MEMORY_ONLY");
 }
});
test("All 26 domain screen groups are present; no namespace has a missing screen",()=>{
 const domains=[...new Set(SCREENS.map(s=>s.domain))];
 assert.equal(domains.length,26);
 assert.deepEqual(domains.sort(),Object.keys(DOMAIN_LABELS).sort());
 for(const d of domains)assert.ok(SCREENS.some(s=>s.domain===d&&!!screenBlueprint(s)));
});
test("Every screen has complete tracked control dispositions and fail-closed banking actions",()=>{
 const needs=["open","search","inspect","capture","discard","submit","approve","execute","reconcile","export","print"];
 for(const c of Object.values(SCREEN_BLUEPRINTS)){
  assert.deepEqual(Object.keys(c.actions),needs,c.id);
  for(const key of needs){
   const a=c.actions[key];
   assert.ok(a.label&&a.state,c.id+" missing action "+key);
  }
  assert.equal(c.actions.submit.state,"BLOCKED_NO_TRUSTED_API");
  assert.equal(c.actions.approve.state,"BLOCKED_NO_BANK_AUTHORIZATION");
  assert.equal(c.actions.execute.state,"BLOCKED_NO_ACCEPTED_BACKEND");
  assert.equal(c.actions.reconcile.state,"BLOCKED_NO_EXTERNAL_EVIDENCE");
  assert.ok(c.actions.export.state.startsWith("DEFERRED"));
  assert.ok(c.actions.print.state.startsWith("DEFERRED"));
  if(c.kind==="review"||c.kind==="monitor"||c.kind==="history"||c.kind==="register")assert.equal(c.captureAllowed,false,c.id+" unexpected editing");
  assert.equal(c.actions.capture.state,c.captureAllowed?"LOCAL_ONLY":"DISABLED_READONLY");
 }
});
test("No backend, certification or regulated document completion is implied",()=>{
 assert.equal(SPEC_DELIVERY.routes,726);
 assert.equal(SPEC_DELIVERY.backend,"NOT_CONNECTED");
 assert.equal(SPEC_DELIVERY.acceptance,"UNVERIFIED");
 assert.equal(SPEC_DELIVERY.printables,"DEFERRED");
 assert.equal(SPEC_DELIVERY.reports,"DEFERRED");
 const app=readFileSync(new URL("../src/app.js",import.meta.url),"utf8");
 assert.ok(app.includes('screenBlueprint'));
 assert.ok(app.includes('specificScreenPanel'));
 assert.ok(app.includes('screenStatePanel'));
 assert.ok(!/\bfetch\(|\bXMLHttpRequest\b|\blocalStorage\./.test(app),"Unexpected network or local persistence path");
});
test("Priority hand-curated specifications are not overwritten with generic fields",()=>{
 for(const id of ["CIF-UI-002","ACT-UI-003","BRN-UI-004","LED-UI-002","CRD-UI-002"]){
  const c=SCREEN_BLUEPRINTS[id];
  assert.ok(c.fields.length>=11,id+" priority fields unexpectedly missing");
  assert.equal(c.fieldSource,"CURATED_SCREEN_SPEC");
 }
});
