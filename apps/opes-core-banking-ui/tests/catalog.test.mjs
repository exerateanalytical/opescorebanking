import test from "node:test";
import assert from "node:assert/strict";
import {SCREENS, SCREEN_BY_ID, SCREEN_BASELINE, SCREEN_COUNTS, DOMAIN_LABELS, DOMAIN_FIELDS} from "../src/catalog.js";

test("all 726 screen IDs are unique and routable",()=>{
 assert.equal(SCREENS.length,726);
 assert.equal(SCREEN_BY_ID.size,726);
 assert.equal(new Set(SCREENS.map(x=>x.id)).size,726);
 for(const s of SCREENS){assert.match(s.id,/^[A-Z]+-(UI|EXP)-\d{3}$/);assert.ok(s.name.length>5);assert.ok(DOMAIN_LABELS[s.domain]);assert.ok(["register","detail","workbench","review","monitor","history","exceptions","settings"].includes(s.kind));}
});
test("preserves the 114 original canonical draft screen IDs",()=>{
 const core=SCREENS.filter(x=>x.source==="CANONICAL_DRAFT");
 assert.equal(core.length,114);
 assert.equal(SCREEN_BASELINE.canonicalDraft,114);
 assert.equal(SCREEN_BASELINE.proposedExpansion,612);
 assert.ok(core.some(x=>x.id==="CIF-UI-001"));
 assert.ok(core.some(x=>x.id==="LED-UI-002"));
 assert.ok(core.some(x=>x.id==="EDU-UI-007"));
});
test("domain totals reconcile and every screen has illustrative labelled form fields",()=>{
 assert.equal(Object.values(SCREEN_COUNTS).reduce((a,b)=>a+b,0),726);
 assert.equal(Object.keys(SCREEN_COUNTS).length,26);
 for(const s of SCREENS){const fields=DOMAIN_FIELDS[s.domain];assert.ok(fields?.length>=4,s.id+" no fields");const ids=new Set();for(const [name,label,type,required] of fields){assert.ok(name&&label&&type);assert.equal(typeof required,"boolean");assert.ok(!ids.has(name));ids.add(name);}}
});
test("no production-ready status is claimed",()=>{
 assert.match(SCREEN_BASELINE.state,/NOT_PRODUCTION/);
 assert.ok(SCREENS.every(s=>s.source==="CANONICAL_DRAFT"||s.source==="EXPANSION_PROPOSED"));
});
