/**
 * Deterministic synthetic fixtures; NEVER a source of bank balances, real customer
 * information, accepted regulatory filings or product calculations.
 * Every row retains explicit DEMO identity, provenance, and period marker.
 */
const BRANCHES=["DEMO-DOUALA","DEMO-YAOUNDE","DEMO-BAFOUSSAM"];
const PRODUCTS=["SAVINGS-DEMO","CURRENT-DEMO","CREDIT-DEMO"];
const STATUSES=["PENDING","COMPLETED","COMPLETED","COMPLETED","FAILED","BLOCKED"];
const CURRENCIES=["XAF","XAF","XAF","XAF","EUR","USD"];
const CHANNELS=["BRANCH","MOBILE","WEB","AGENT"];
const RAILS=["INTERNAL","SYSTAC","SYGMA","GIMACPAY"];
const RISK=["LOW","MEDIUM","HIGH","UNASSESSED"];
const SEGMENTS=["INDIVIDUAL","CORPORATE","SME"];
const PERIODS=["2026-06","2026-07","2026-08","2026-09","2026-10","2026-11"];
const days=[0,0,0,0,2,5,10,15,25,31,45,65,95];
const codeSeed=s=>[...s].reduce((a,c)=>((a*33)^c.charCodeAt(0))>>>0,5381);
export function syntheticRows(report,{count=180}={}){
 if(!report?.id)throw Error("Unknown reporting contract");
 if(!Number.isInteger(count)||count<0||count>1000)throw Error("Fixture count out of range");
 const seed=codeSeed(report.id);
 const rows=[];
 for(let i=0;i<count;i++){
  const factor=(seed+i*48271)>>>0;
  const amountMinor=10000+(factor%3700)*100;
  const balanceDelta=(i%17===0?500:0);
  const status=STATUSES[(i+Math.floor(seed/7))%STATUSES.length];
  rows.push({
   recordId:"DEMO-"+report.id+"-"+String(i+1).padStart(4,"0"),
   bankId:"DEMO-BANK",recordSource:"SYNTHETIC_ONLY",snapshot:"DEMO-SNAPSHOT-2026-11",
   period:PERIODS[i%PERIODS.length],branch:BRANCHES[i%BRANCHES.length],
   product:PRODUCTS[Math.floor(i/3)%PRODUCTS.length],
   currency:CURRENCIES[Math.floor(i/9)%CURRENCIES.length],
   status,channel:CHANNELS[Math.floor(i/2)%CHANNELS.length],
   rail:RAILS[Math.floor(i/3)%RAILS.length],riskBand:RISK[Math.floor(i/5)%RISK.length],
   segment:SEGMENTS[Math.floor(i/4)%SEGMENTS.length],
   amountMinor,expectedMinor:amountMinor,actualMinor:amountMinor+balanceDelta,
   debitMinor:amountMinor,creditMinor:amountMinor+(i%21===0?50:0),
   daysPastDue:days[(i+Math.floor(seed/39))%days.length],
   exceptionFlag:i%13===0||status==="FAILED",hasEvidence:i%7!==0
  });
 }
 return rows;
}
export const DEMO_BOUNDARY=Object.freeze({bankId:"DEMO-BANK",source:"SYNTHETIC_ONLY",disclaimer:"Fictitious training figures, never source banking data"});
