import {test} from "node:test";
import assert from "node:assert/strict";
import {SCREENS,SCREEN_BASELINE} from "../src/registries/screen-catalog.ts";
import {TEMPLATE_GROUPS} from "../src/registries/document-seeds.ts";
import {REPORT_GROUPS} from "../src/registries/report-seeds.ts";
test("screen catalog maintains 726 unique candidate routes",()=>{
 assert.equal(SCREENS.length,726);
 assert.equal(new Set(SCREENS.map(x=>x.id)).size,726);
 assert.equal(SCREEN_BASELINE.state,"UI_ROUTE_SCAFFOLD_NOT_PRODUCTION");
});
for(const [name,groups,total] of [["documents",TEMPLATE_GROUPS,407],["reports",REPORT_GROUPS,378]]){
 test(name+" preserves every source group",()=>{
  assert.equal(groups.reduce((n,g)=>n+g[1],0),total);
  for(const g of groups)assert.equal(g[4].split(";").map(x=>x.trim()).filter(Boolean).length,g[1]);
 });
}
