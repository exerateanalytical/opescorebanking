/**
 * Reproducible source-to-data migration for the exact historic draft specs.
 * Source modules run ONLY at build time. The frontend loads inert JSON records.
 * Never import synthetic fixture engines or activate financial endpoints.
 */
import assert from "node:assert/strict";
import {mkdir,writeFile} from "node:fs/promises";
import {SCREENS} from "../build/source/ui/catalog.mjs";
import {SCREEN_BLUEPRINTS} from "../build/source/ui/all-screen-blueprints.mjs";
import {FORMS} from "../build/source/forms/form-registry.mjs";
import {TEMPLATES} from "../build/source/documents/templates.mjs";
import {REPORTS} from "../build/source/reports/report-registry.mjs";
const directory = new URL("../src/generated/", import.meta.url);
assert.equal(SCREENS.length,726);
assert.equal(Object.keys(SCREEN_BLUEPRINTS).length,726);
assert.equal(FORMS.length,726);
assert.equal(TEMPLATES.length,407);
assert.equal(REPORTS.length,378);
assert.equal(new Set(SCREENS.map(s=>s.id)).size,726);
assert.equal(new Set(FORMS.map(f=>f.id)).size,726);
assert.equal(new Set(TEMPLATES.map(t=>t.id)).size,407);
assert.equal(new Set(REPORTS.map(r=>r.id)).size,378);
for(const f of FORMS){
 assert.ok(SCREENS.some(s=>s.id===f.screenId),"orphan form "+f.id);
 assert.equal(f.approvedForProduction,false,"form incorrectly claims acceptance");
 assert.equal(f.backend.releaseApproved,false,"unapproved form backend");
}
for(const t of TEMPLATES){
 assert.equal(t.approvedForProduction,false,"document incorrectly claims issuance");
 assert.equal(t.workflow.finalIssue,"BLOCKED");
}
for(const r of REPORTS){
 assert.equal(r.approvedForProduction,false,"report incorrectly claims authority");
 assert.equal(r.authorization.runRealReport,false);
}
const manifests={
 version:"OPES_PRODUCTION_SOURCE_MANIFEST_V1",
 acceptance:"INVENTORY_AND_CLIENT_SPECS_ONLY",
 operationalBankingEnabled:false,
 counts:{screens:726,forms:726,documents:407,reports:378},
 blueprints:SCREEN_BLUEPRINTS,
 forms:FORMS,
 templates:TEMPLATES,
 reports:REPORTS
};
await mkdir(directory,{recursive:true});
await writeFile(new URL("full-manifest.json",directory),JSON.stringify(manifests));
console.log("MIGRATED_SOURCE_SPECS",manifests.counts);
