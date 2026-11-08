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
   const THREE=await import("three");
   // Stable, spread-out 3D constellation. Fixed coordinates prevent the
   // force solver from collapsing the graph into an unreadable cluster.
   const count=concepts.length;
   const nodes=concepts.map((c,i)=>{
    const angle=i*2.399963229728653;
    const radius=32+Math.sqrt((i+0.5)/count)*145;
    const x=Math.cos(angle)*radius;
    const y=Math.sin(angle)*radius*0.78;
    const z=30*Math.sin(i*1.73);
    return {...c,x,y,z,fx:x,fy:y,fz:z};
   });
   const labelTextures:InstanceType<typeof THREE.CanvasTexture>[]=[];
   function createNode(n:any){
    const group=new THREE.Group();
    const material=new THREE.MeshBasicMaterial({color:colors[n.domain as Domain]});
    const dot=new THREE.Mesh(new THREE.SphereGeometry(2.6,14,10),material);
    group.add(dot);
    const canvas=document.createElement("canvas");
    const ctx=canvas.getContext("2d");
    if(ctx){
     const name=String(n.name);
     const words=name.split(" ");
     const lines:string[]=[];let line="";
     for(const word of words){
      if((line+" "+word).trim().length>20&&line){lines.push(line);line=word}
      else line=(line+" "+word).trim();
     }
     if(line)lines.push(line);
     canvas.width=512;canvas.height=128;
     ctx.clearRect(0,0,512,128);
     ctx.textAlign="center";ctx.textBaseline="middle";
     ctx.font="500 24px Arial, sans-serif";
     ctx.fillStyle="#d7e5f7";
     lines.slice(0,3).forEach((text,i)=>ctx.fillText(text,256,24+i*30,490));
     const texture=new THREE.CanvasTexture(canvas);
     labelTextures.push(texture);
     const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false}));
     sprite.scale.set(48,12,1);
     sprite.position.set(0,-11,0);
     group.add(sprite);
    }
    return group;
   }
   instance
    .backgroundColor("#070d1b")
    .graphData({nodes,links:edges.map(e=>({...e}))})
    .nodeThreeObject(createNode)
    .nodeThreeObjectExtend(false)
    .nodeLabel((n:any)=>n.name)
    .linkColor(()=>"rgba(133,165,208,0.48)")
    .linkOpacity(0.55)
    .linkWidth(0.45)
    .cooldownTicks(0)
    .onNodeClick((n:any)=>focus(n as Concept,instance))
    .showNavInfo(false);
   instance.width(el.clientWidth).height(el.clientHeight);
   instance.cameraPosition({x:0,y:0,z:420},{x:0,y:0,z:0},0);
   graph.current.__labelTextures=labelTextures;
   setReady(true);
  })();
  const resize=()=>{if(mount.current&&graph.current){graph.current.width(mount.current.clientWidth);graph.current.height(mount.current.clientHeight)}};
  window.addEventListener("resize",resize);
  return ()=>{disposed=true;window.removeEventListener("resize",resize);if(instance){(graph.current?.__labelTextures||[]).forEach((t:any)=>t.dispose());instance._destructor?.();graph.current=null}};
 },[]);
 function focus(c:Concept,g=graph.current){
  setActive(c);setQuery("");
  if(!g)return;
  const node=g.graphData().nodes.find((n:any)=>n.id===c.id);
  if(!node)return;
  const x=node.x||0,y=node.y||0,z=node.z||0;
  g.cameraPosition({x:x,y:y,z:z+95},{x,y,z},900);
 }
 function reset(){setActive(null);graph.current?.cameraPosition({x:0,y:0,z:420},{x:0,y:0,z:0},1100)}
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
