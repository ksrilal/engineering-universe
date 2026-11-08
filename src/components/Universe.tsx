"use client";
import {useEffect,useMemo,useRef,useState} from "react";
import {concepts,colors,edges,Concept,Domain} from "../data/concepts";

export default function Universe(){
 const mount=useRef<HTMLDivElement>(null);
 const graph=useRef<any>(null);
 const [query,setQuery]=useState("");
 const [active,setActive]=useState<Concept|null>(null);
 const [ready,setReady]=useState(false);
 const matches=useMemo(()=>query.trim()?concepts.filter(c=>(c.name+" "+c.description+" "+c.domain).toLowerCase().includes(query.toLowerCase())).slice(0,8):[],[query]);
 useEffect(()=>{
  let disposed=false; let instance:any;
  (async()=>{
   const {default:ForceGraph3D}=await import("3d-force-graph");
   if(disposed||!mount.current)return;
   const el=mount.current;
   instance=new ForceGraph3D(el,{controlType:"orbit"});
   graph.current=instance;
   // Give every node a distinct starting position so the first rendered frame
   // does not appear as one giant overlapping sphere.
   const nodes=concepts.map((c,i)=>{
    const y=1-2*(i+0.5)/concepts.length;
    const radius=Math.sqrt(1-y*y);
    const angle=i*Math.PI*(3-Math.sqrt(5));
    return {...c,x:115*radius*Math.cos(angle),y:115*y,z:115*radius*Math.sin(angle)};
   });
   instance.graphData({nodes,links:edges.map(e=>({...e}))})
    .backgroundColor("#070d1b")
    .nodeRelSize(3)
    .nodeResolution(10)
    .nodeColor((n:any)=>colors[n.domain as Domain])
    .nodeVal((n:any)=>n.id==="https"?1.8:1)
    .nodeLabel((n:any)=>n.name)
    .linkColor(()=>"rgba(107,142,194,0.22)")
    .linkOpacity(0.42).linkWidth(0.6)
    .warmupTicks(80).cooldownTicks(250)
    .onEngineStop(()=>{if(!disposed&&!graph.current?.__fitted){graph.current.__fitted=true;instance.zoomToFit(850,85)}})
    .onNodeClick((n:any)=>focus(n as Concept,instance))
    .showNavInfo(false);
   instance.cameraPosition({x:0,y:0,z:480},{x:0,y:0,z:0},0);
   instance.width(el.clientWidth).height(el.clientHeight);
   setReady(true);
  })();
  const resize=()=>{if(mount.current&&graph.current){graph.current.width(mount.current.clientWidth);graph.current.height(mount.current.clientHeight)}};
  window.addEventListener("resize",resize);
  return ()=>{disposed=true;window.removeEventListener("resize",resize);if(instance){instance._destructor?.();graph.current=null}};
 },[]);
 function focus(c:Concept,g=graph.current){
  setActive(c);setQuery("");
  if(!g)return;
  const node=g.graphData().nodes.find((n:any)=>n.id===c.id);
  if(!node)return;
  const x=node.x||0,y=node.y||0,z=node.z||0;
  const distance=Math.hypot(x,y,z)||1;
  const ratio=1+130/distance;
  g.cameraPosition({x:x*ratio,y:y*ratio,z:z*ratio},{x,y,z},1100);
  g.nodeColor((n:any)=>n.id===c.id?"#ffffff":c.links.includes(n.id)||n.links?.includes(c.id)?colors[n.domain as Domain]:"#334155");
 }
 function reset(){setActive(null);graph.current?.nodeColor((n:any)=>colors[n.domain as Domain]);graph.current?.cameraPosition({x:0,y:0,z:480},{x:0,y:0,z:0},1100)}
 return <div className="shell">
  <div className="starfield" aria-hidden="true"/>
  <header className="topbar"><button className="brand" onClick={reset}><span className="brand-icon">✧</span> Engineering <strong>Universe</strong></button><nav className="eu-home-nav" aria-label="Explore platform"><a href="/explore">Concepts</a><a href="/simulations">Simulations</a><a href="/learn">Learning paths</a></nav><a className="github" href="https://github.com/ksrilal/engineering-universe" target="_blank" rel="noreferrer">GitHub ↗</a></header>
  <section className="hero"><div className="eyebrow">INTERACTIVE ENGINEERING KNOWLEDGE GRAPH</div><h1>Everything is <em>connected.</em></h1><p>Explore networking, security, software, cloud and DevOps in one living universe.</p>
   <div className="search-wrap"><span className="search-icon">⌕</span><input aria-label="Search engineering concepts" placeholder="Search TCP, OAuth, Kubernetes, streaming..." value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&matches[0])focus(matches[0]);if(e.key==="Escape")setQuery("")}}/><kbd>↵</kbd>
   {matches.length>0&&<div className="suggestions">{matches.map(c=><button key={c.id} onClick={()=>focus(c)}><span className="dot" style={{background:colors[c.domain]}}/>{c.name}<small>{c.domain}</small></button>)}</div>}</div>
  </section>
  <div className="graph-container" ref={mount} role="img" aria-label="Interactive three-dimensional network of connected engineering concepts"/>
  {!ready&&<div className="loading">Loading knowledge universe…</div>}
  <div className="legend">{Object.entries(colors).map(([name,color])=><span key={name}><i style={{background:color}}/>{name}</span>)}</div>
  <div className="hint">Drag to rotate · Scroll to zoom · Click a node to explore</div>
  {active&&<aside className="detail"><button className="close" aria-label="Close concept details" onClick={reset}>×</button><span className="tag" style={{color:colors[active.domain]}}>{active.domain}</span><h2>{active.name}</h2><p>{active.description}</p><h3>Connected concepts</h3><div className="related">{concepts.filter(c=>active.links.includes(c.id)||c.links.includes(active.id)).map(c=><button key={c.id} onClick={()=>focus(c)}>{c.name} ↗</button>)}</div><div className="coming">Interactive end-to-end simulation · Coming next</div></aside>}
 </div>
}
