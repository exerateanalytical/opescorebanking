import {useState} from "react";
import {screens,documents,reports,labels,byScreen,byDocument,byReport,
 formContracts,formById,screenBlueprints,templateById,reportContractById} from "./registry";
import type {SourceField} from "./registry";
type Kind="screens"|"forms"|"documents"|"reports";
const groups:Kind[]=["screens","forms","documents","reports"];
const headings={screens:"Banking screens",forms:"Screen-aligned forms",
 documents:"Document templates",reports:"Banking reports"};
const entries={
 screens:screens.map(s=>({id:s.id,domain:s.domain,title:s.name})),
 forms:formContracts.map(f=>({id:f.id,domain:f.domain,title:f.name})),
 documents,reports
};
function Badge(){return <span className="badge">Production source · live banking blocked</span>}
function Nav(){return <header className="header">
 <a href="/" className="brand">OPES CORE BANKING<small>Enterprise workspace</small></a>
 <nav aria-label="Product sections">{groups.map(g=>
  <a href={"/"+g} key={g}>{headings[g]}</a>)}</nav>
 <Badge/></header>}
function Home(){return <main className="wrap">
 <p className="eyebrow">Java 25 backend · React TypeScript client</p>
 <h1>Enterprise banking operations</h1>
 <p>The original screen blueprints, form validation specifications,
 document fields and report metric definitions are preserved in a typed
 React application. Real banking actions require authoritative server access and
 remain unavailable until acceptance.</p>
 <div className="tiles">{groups.map(g=><a key={g} href={"/"+g} className="tile">
 <strong>{entries[g].length}</strong><span>{headings[g]}</span>
 <small>Review source specifications</small></a>)}</div>
 </main>}
function Index({kind}:{kind:Kind}){
 const [query,setQuery]=useState("");const [n,setN]=useState(60);
 const source=entries[kind];
 const list=source.filter(x=>(x.title+" "+x.id+" "+x.domain).toLowerCase()
  .includes(query.toLowerCase().trim()));
 return <main className="wrap">
  <p><a href="/">Workspace</a> / {headings[kind]}</p>
  <div className="heading"><div><h1>{headings[kind]}</h1>
   <p>{source.length} preserved definitions. No speculative banking transactions.</p>
  </div><Badge/></div>
  <div className="filter"><label htmlFor="q">Search</label>
  <input id="q" type="search" value={query}
   onChange={e=>{setQuery(e.target.value);setN(60)}}
   placeholder="Filter by name, domain or ID"/>
  <small aria-live="polite">{list.length} results</small></div>
  <div className="catalog">{list.slice(0,n).map(x=><a
   href={"/"+kind+"/"+encodeURIComponent(x.id)} key={x.id} className="entry">
   <small>{x.id}</small><strong>{x.title}</strong>
   <span>{labels[x.domain]??x.domain}</span></a>)}</div>
  {list.length>n&&<button className="more" onClick={()=>setN(v=>v+60)}>
   Show more</button>}
 </main>;
}
function Fields({fields}:{fields:readonly SourceField[]}){
 if(fields.length===0)return <p>Authoritative field schema is not yet confirmed.</p>;
 return <div className="fields">{fields.map((field,i)=>
  <div className="field" key={field.id+"-"+i}>
   <label htmlFor={"field-"+i}>{field.label}{field.required?" *":""}</label>
   {field.type==="select"?<select id={"field-"+i} disabled defaultValue="">
     <option value="">Awaiting validated server data</option>
     {(field.options??[]).map(o=><option key={o}>{o}</option>)}</select>:
    <input id={"field-"+i} disabled type={field.type==="date"?"date":"text"}
      placeholder="Not enabled without bank authorization"/>}
   <small>{field.id} · {field.type} · Proposed</small>
  </div>)}</div>;
}
function Detail({kind,id}:{kind:Kind;id:string}){
 const screen=kind==="screens"?byScreen.get(id):undefined;
 const form=kind==="forms"?formById.get(id):undefined;
 const item=kind==="reports"?byReport.get(id):
   kind==="documents"?byDocument.get(id):undefined;
 if(!screen&&!form&&!item)return <main className="wrap"><h1>Definition not found</h1>
  <p>No source definition uses this identifier.</p>
  <a href={"/"+kind}>Return to inventory</a></main>;
 const doc=kind==="documents"?templateById.get(id):undefined;
 const report=kind==="reports"?reportContractById.get(id):undefined;
 const domain=screen?.domain??form?.domain??item?.domain??"";
 const fields:readonly SourceField[]=kind==="screens"?
   (screenBlueprints[id]?.fields??[]):
   kind==="forms"?(form?.fields??[]):
   kind==="documents"?(doc?.fields??[]):
   (report?.allowedFilters??[]);
 return <main className="wrap">
  <p><a href="/">Workspace</a> / <a href={"/"+kind}>{headings[kind]}</a> / {id}</p>
  <div className="heading"><div>
   <p className="eyebrow">{labels[domain]??domain} · {id}</p>
   <h1>{screen?.name??form?.name??item?.title}</h1>
   <p>Source specification available. A screen or form is not a production
     banking workflow until its backend and operating controls are proven.</p>
  </div><Badge/></div>
  <section className="panel">
   <h2>{kind==="reports"?"Proposed report filters":
     kind==="documents"?"Document layout field contract":
     "Original screen-specific field contract"}</h2>
   <Fields fields={fields}/>
   {form&&<p>{form.validationRules.length} client validation rules,
    {form.conditionalRules.length} conditional rules; mode: {form.mode}.
    Server validation remains mandatory. Capture disabled.</p>}
   {doc&&<p>Template family: {doc.family}.
    Verified issuance, signatures and QR validation are not enabled.</p>}
   {report&&<p>{report.measures.length} proposed metric definitions.
    Authoritative banking data and regulatory mapping are not connected.</p>}
  </section>
  <section className="panel"><h2>Actions</h2><p>The matching secured Java 25
    endpoint, bank permissions, source evidence and audit must pass acceptance
    before this operation can execute.</p>
   <button disabled type="button">{kind==="reports"?"Generate authorized report":
     kind==="documents"?"Issue legally verified document":
     kind==="forms"?"Submit bank form":"Execute authorized operation"}</button>
  </section>
 </main>;
}
export function App(){
 const [section,id]=location.pathname.split("/").filter(Boolean);
 const kind=groups.find(x=>x===section);
 return <><Nav/>{!kind?<Home/>:id?
   <Detail kind={kind} id={decodeURIComponent(id)}/>:<Index kind={kind}/>}
  <footer>OPES Core Banking · Controlled production integration ·
   No synthetic real-money results</footer></>;
}
