import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const css=readFileSync(new URL("../styles.css",import.meta.url),"utf8");
function section(prefix){const start=css.indexOf(prefix);assert.ok(start>=0);const match=css.slice(start).match(/^[^{]+\{([^}]+)\}/);assert.ok(match);const obj={};for(const item of match[1].split(";")){const m=item.match(/^\s*(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{6})\s*$/);if(m)obj[m[1]]=m[2];}return obj;}
function lightness(hex){const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4));return 0.2126*rgb[0]+0.7152*rgb[1]+0.0722*rgb[2];}
function contrast(a,b){const x=lightness(a),y=lightness(b);return(Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);}
const pairs=[["--ink","--paper"],["--muted","--paper"],["--subtle","--canvas"],["--primary","--paper"],["--sidebar-text","--sidebar"],["--sidebar-muted","--sidebar"],["--success","--success-soft"],["--warning","--warning-soft"],["--danger","--danger-soft"]];
for(const [theme,marker] of [["light",":root"],["dark",'[data-theme="dark"]']]){
 test(theme+" text color-pair contrast meets WCAG 2.2 AA",()=>{
  const colors=section(marker);
  for(const [fg,bg]of pairs){
   assert.ok(colors[fg]&&colors[bg],theme+" "+fg+" / "+bg);
   const ratio=contrast(colors[fg],colors[bg]);
   assert.ok(ratio>=4.5,theme+" "+fg+" on "+bg+" is "+ratio.toFixed(2)+":1");
  }
 });
}
