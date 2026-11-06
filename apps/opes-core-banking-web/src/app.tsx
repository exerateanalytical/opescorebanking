import {useState} from "react";
import {screens,documents,reports,labels,domainFields,byScreen,byDocument,byReport} from "./registry";
type Kind="screens"|"forms"|"documents"|"reports";
const groups:Kind[]=["screens","forms","documents","reports"];
const headings={screens:"Banking screens",forms:"Screen-aligned forms",documents:"Document templates",reports:"Banking reports"};
const entries={screens:screens.map(s=>({id:s.id,domain:s.domain,title:s.name})),
 forms:screens.map(s=>({id:s.id,domain:s.domain,title:s.name})),documents,reports};
function Badge(){return <span className="badge">Source integrated · banking actions blocked</span>}
function Nav(){return <header className="header"><a href="/" className="brand">OPES CORE BANKING
 <small>Enterprise workspace</small></a><nav>{groups.map(g=><a href={"/"+g} key={g}>{headings[g]}</a>)}</nav><Badge/></header>}
function Home(){return <main className="wrap"><p className="eyebrow">Java 25 backend · React TypeScript client</p>
 <h1>Enterprise banking operations</h1><p>Source definitions now use a React/TypeScript
 application. Real financial actions and reports remain disabled until verified bank
 identity, authoritative data and workflow integration are available.</p>
 <div className="tiles">{groups.map(g=><a key={g} href={"/"+g} className="tile">
 <strong>{entries[g].length}</strong><span>{headings[g]}</span><small>Browse inventory</small></a>)}</div>
 </main>}
function Index({kind}:{kind:Kind}){const [q,setQ]=useState("");const [n,setN]=useState(60);
 const source=entries[kind],list=source.filter(x=>(x.title+" "+x.id+" "+x.domain).toLowerCase().includes(q.toLowerCase().trim()));
 return <main className="wrap"><p><a href="/">Workspace</a> / {headings[kind]}</p>
 <div className="heading"><div><h1>{headings[kind]}</h1><p>{source.length} imported
 definitions. No simulated banking effects.</p></div><Badge/></div>
 <div className="filter"><label htmlFor="q">Find</label><input id="q" type="search" value={q}
 onChange={e=>{setQ(e.target.value);setN(60)}} placeholder="Filter name or ID"/>
 <small>{list.length} results</small></div><div className="catalog">
 {list.slice(0,n).map(x=><a href={"/"+kind+"/"+encodeURIComponent(x.id)} key={x.id}
 className="entry"><small>{x.id}</small><strong>{x.title}</strong><span>{labels[x.domain]??x.domain}</span></a>)}
 </div>{list.length>n&&<button className="more" onClick={()=>setN(v=>v+60)}>Show more</button>}</main>}
function Detail({kind,id}:{kind:Kind;id:string}){const screen=kind==="forms"||kind==="screens"?byScreen.get(id):undefined;
 const item=kind==="reports"?byReport.get(id):kind==="documents"?byDocument.get(id):undefined;
 if(!screen&&!item)return <main className="wrap"><h1>Definition not found</h1></main>;
 const domain=screen?.domain??item?.domain??"";
 const fields=(domainFields[domain]??[]) as unknown[][];
 return <main className="wrap"><p><a href="/">Workspace</a> / <a href={"/"+kind}>{headings[kind]}</a> / {id}</p>
 <div className="heading"><div><p className="eyebrow">{domain} · {id}</p><h1>{screen?.name??item?.title}</h1>
 <p>Original source metadata preserved. No bank transaction, document issuance or
 official reporting is authorized by this UI.</p></div><Badge/></div>
 <section className="panel"><h2>{screen?"Proposed input fields":"Authoritative data requirements"}</h2>
 {screen?<div className="fields">{fields.map((f,i)=>{
  const [key,label,type,required,options]=f as [string,string,string,boolean,string[]?];
  return <div className="field" key={i}><label htmlFor={"field-"+i}>{label}{required?" *":""}</label>
  {type==="select"?<select id={"field-"+i} disabled defaultValue=""><option value="">Not configured</option>
   {(options??[]).map(o=><option key={o}>{o}</option>)}</select>:
   <input id={"field-"+i} disabled type={type==="date"?"date":"text"} placeholder="No live data"/>}
  <small>{key} · {type}</small></div>})}</div>:
  <p>Legal issuance or regulatory reporting is blocked pending independently verified
   server workflows, authorized source values and release acceptance.</p>}</section>
 <section className="panel"><h2>Actions</h2><p>Workflow action is disabled until
 server authorization, audit and persistence are implemented.</p>
 <button disabled type="button">Execute authorized operation</button></section></main>}
export function App(){const [kind,id]=location.pathname.split("/").filter(Boolean);
 const k=groups.find(x=>x===kind);
 return <><Nav/>{!k?<Home/>:id?<Detail kind={k} id={decodeURIComponent(id)}/>:<Index kind={k}/>}
 <footer>OPES Core Banking · Controlled deployment · No synthetic real-money results</footer></>}
