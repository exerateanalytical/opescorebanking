import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const css=readFileSync(new URL("../styles.css",import.meta.url),"utf8");
const app=readFileSync(new URL("../src/app.js",import.meta.url),"utf8");
const html=readFileSync(new URL("../index.html",import.meta.url),"utf8");
test("responsive breakpoints, focus and reduced motion rules exist",()=>{
 for(const width of [440,680,920,1200])assert.ok(css.includes("max-width:"+width+"px"));
 assert.ok(css.includes(":focus-visible"));
 assert.ok(css.includes("prefers-reduced-motion"));
 assert.ok(css.includes("grid-template-columns:repeat(2"));
 assert.ok(css.includes("min-width:0"));
 assert.ok(css.includes("overflow-x:auto"));
});
test("no decorative glow/gradient or locally persisted customer data",()=>{
 assert.ok(!/box-shadow\s*:/i.test(css));
 assert.ok(!/linear-gradient|radial-gradient|filter:\s*blur/i.test(css));
 assert.ok(!/localStorage|sessionStorage/.test(app));
 assert.ok(app.includes("No data is transmitted or persisted"));
});
test("UI accessibility landmarks and guarded production actions",()=>{
 assert.match(html,/lang="en"/);
 assert.match(html,/class="skip-link"/);
 assert.ok(app.includes('role="tablist"'));
 assert.ok(app.includes('aria-live="polite"'));
 assert.ok(app.includes('disabled title="No trusted API connected"'));
 assert.ok(app.includes('dialog.showModal()'));
 assert.ok(app.includes('escape('));
});
