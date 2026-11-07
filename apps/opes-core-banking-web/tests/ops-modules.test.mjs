import test from "node:test";
import assert from "node:assert/strict";
import modules from "../src/ops/contracts.json" with {type:"json"};
test("six operational modules have concrete typed fields",()=>{
 assert.equal(modules.modules.length,6);
 assert.deepEqual(new Set(modules.modules.map(x=>x.id)),
  new Set(["GOV","ARC","TST","INF","DR","REL"]));
 for(const m of modules.modules){
  assert.ok(m.fields.length>=8,m.id);
  assert.ok(m.fields.some(f=>f.name===m.businessReferenceField),m.id);
  assert.ok(m.fields.some(f=>f.name===m.revisionField),m.id);
 }
 assert.equal(modules.realDeployment,false);
});
