/**
 * Deterministic frontend validation for synthetic banking form drafts.
 * Security: server-side rules, authorization, regulatory gates and calculations are
 * NOT supplied here. Strictly restrict form input to synthetic/test data.
 */
const isPresent=v=>v!==null&&v!==undefined&&String(v).trim()!=="";
const safeInteger=v=>/^(0|[1-9][0-9]*)$/.test(String(v))&&Number.isSafeInteger(Number(v));
export function isConditionalActive(rule,data){
 const value=String(data[rule.when.field]??"");
 if(rule.when.op==="eq")return value===String(rule.when.value);
 if(rule.when.op==="neq")return value!==String(rule.when.value);
 if(rule.when.op==="in")return rule.when.value.includes(value);
 return false;
}
export function conditionallyRequired(form,data){
 const ids=new Set(form.fields.filter(f=>f.required).map(f=>f.id));
 for(const rule of form.conditionalRules){
  if(isConditionalActive(rule,data))for(const id of rule.requires)ids.add(id);
 }
 return ids;
}
export function validateForm(form,values){
 if(!form)throw Error("Unknown form");
 const errors=[],warnings=[];
 const data=values&&typeof values==="object"&&!Array.isArray(values)?values:{};
 if(form.mode!=="DRAFT_CAPTURE")return {ok:false,errors:[{code:"READ_ONLY",message:"This form cannot modify records",fields:[]}],warnings:[]};
 const required=conditionallyRequired(form,data);
 for(const f of form.fields){
  const v=data[f.id];
  if(required.has(f.id)&&!isPresent(v)){errors.push({code:"REQUIRED",message:f.label+" is required",fields:[f.id]});continue;}
  if(!isPresent(v))continue;
  if(f.type==="select"&&!f.options.includes(String(v)))errors.push({code:"OPTION",message:f.label+" must use a permitted option",fields:[f.id]});
  if(f.type==="number"&&!safeInteger(v))errors.push({code:"INTEGER",message:f.label+" must be a safe nonnegative integer",fields:[f.id]});
  if(f.type==="date"&&(!/^\d{4}-\d{2}-\d{2}$/.test(String(v))||Number.isNaN(Date.parse(v))))errors.push({code:"DATE",message:f.label+" is not a valid ISO date",fields:[f.id]});
  if(f.type==="email"&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)))errors.push({code:"EMAIL",message:f.label+" is not a valid email address",fields:[f.id]});
  if(typeof v==="string"&&v.length>1500)errors.push({code:"LENGTH",message:f.label+" exceeds 1500 characters",fields:[f.id]});
 }
 for(const r of form.validationRules){
  const c=r.check;
  if(c.op==="date_lte"&&isPresent(data[c.from])&&isPresent(data[c.to])&&String(data[c.from])>String(data[c.to]))errors.push({code:r.id,message:r.message,fields:r.fields});
  if(c.op==="not_equal"&&isPresent(data[c.left])&&isPresent(data[c.right])&&String(data[c.left])===String(data[c.right]))errors.push({code:r.id,message:r.message,fields:r.fields});
  if(c.op==="equal_numbers"&&isPresent(data[c.left])&&isPresent(data[c.right])&&Number(data[c.left])!==Number(data[c.right]))errors.push({code:r.id,message:r.message,fields:r.fields});
  if(c.op==="integer_range"&&isPresent(data[c.field])&&(!safeInteger(data[c.field])||Number(data[c.field])<c.min||Number(data[c.field])>c.max))errors.push({code:r.id,message:r.message,fields:r.fields});
  if(c.op==="denomination_count_check"){
   if(Object.keys(c.denominations).every(key=>!isPresent(data[key]))||!isPresent(data[c.expectedField]))continue;
   let amount=0n;
   for(const [key,denom]of Object.entries(c.denominations)){
    if(isPresent(data[key])&&!safeInteger(data[key])){amount=-1n;break;}
    amount+=BigInt(String(data[key]||0))*BigInt(denom);
   }
   if(amount<0n)continue;
   if(amount>BigInt(Number.MAX_SAFE_INTEGER)){errors.push({code:"CASH_OVERFLOW",message:"Cash total exceeds safe integer bounds",fields:r.fields});continue;}
   if(isPresent(data[c.expectedField])&&safeInteger(data[c.expectedField])&&amount!==BigInt(String(data[c.expectedField])))warnings.push({code:r.id,message:r.message+" (count: "+amount.toString()+", expected: "+String(data[c.expectedField])+")",fields:r.fields});
  }
 }
 return {ok:errors.length===0,errors,warnings};
}
export function safeDemoData(form){
 const sample={};
 for(const f of form.fields){
  if(f.type==="select")sample[f.id]=f.options[0]||"";
  else if(f.type==="date")sample[f.id]="2026-11-06";
  else if(f.type==="number")sample[f.id]="0";
  else if(f.type==="email")sample[f.id]="synthetic@example.invalid";
  else if(f.type==="tel")sample[f.id]="000000000";
  else if(f.type==="textarea")sample[f.id]="SYNTHETIC TEST INFORMATION — no real customer records";
  else sample[f.id]="SYNTHETIC-"+f.id.toUpperCase();
 }
 // The simulator must not claim to have accepted credit, sanctions or regulator verification.
 return sample;
}
export function sanitizedLocalDraft(form,values){
 const allowed=new Set(form.fields.map(f=>f.id));
 return Object.fromEntries(Object.entries(values).filter(([k])=>allowed.has(k)).map(([k,v])=>[k,String(v).slice(0,1500)]));
}
