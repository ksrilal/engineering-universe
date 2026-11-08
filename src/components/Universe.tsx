"use client";
import {useEffect,useMemo,useRef,useState} from "react";
import Link from "next/link";
import type {PerspectiveCamera,Scene,WebGLRenderer,Mesh,Group,Line,Sprite,CanvasTexture} from "three";
import {concepts,colors,edges,Concept,Domain} from "../data/concepts";

type GraphController={focus:(id:string)=>void;reset:()=>void;dispose:()=>void};
export default function Universe(){
 const mount=useRef<HTMLDivElement>(null);
 const controller=useRef<GraphController|null>(null);
 const [query,setQuery]=useState("");
 const [active,setActive]=useState<Concept|null>(null);
 const [ready,setReady]=useState(false);
 const matches=useMemo(()=>query.trim()?concepts.filter(c=>(c.name+" "+c.description+" "+c.domain).toLowerCase().includes(query.toLowerCase())).slice(0,8):[],[query]);
 useEffect(()=>{
  let disposed=false;let stop:undefined|(()=>void);
  (async()=>{
   const THREE=await import("three");
   const {OrbitControls}=await import("three/examples/jsm/controls/OrbitControls.js");
   if(disposed||!mount.current)return;
   const el=mount.current;
   const scene=new THREE.Scene();
   const camera=new THREE.PerspectiveCamera(50,1,0.1,2000);
   camera.position.set(0,0,460);
   const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
   renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
   renderer.setClearColor(0x070d1b,0);
   el.appendChild(renderer.domElement);
   const controls=new OrbitControls(camera,renderer.domElement);
   controls.enableDamping=true;controls.dampingFactor=0.075;
   controls.minDistance=90;controls.maxDistance=850;
   const geometry=new THREE.SphereGeometry(3.2,16,12);
   const nodes=new Map<string,InstanceType<typeof THREE.Group>>();
   const hitTargets:InstanceType<typeof THREE.Mesh>[]=[];
   const textures:InstanceType<typeof THREE.CanvasTexture>[]=[];
   const count=concepts.length;
   concepts.forEach((c,i)=>{
    // Fibonacci sphere: distributed over all three axes with guaranteed
    // unique coordinates; no force engine can overwrite these positions.
    const y=1-2*(i+0.5)/count;
    const r=Math.sqrt(1-y*y);
    const theta=i*Math.PI*(3-Math.sqrt(5));
    const x=150*r*Math.cos(theta),z=150*r*Math.sin(theta);
    const group=new THREE.Group();
    group.position.set(x,150*y,z);
    const mesh=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:colors[c.domain]}));
    mesh.userData.conceptId=c.id;
    group.add(mesh);hitTargets.push(mesh);
    const canvas=document.createElement("canvas");
    canvas.width=512;canvas.height=128;
    const ctx=canvas.getContext("2d");
    if(ctx){
     ctx.clearRect(0,0,512,128);
     ctx.fillStyle="#e2e8f0";
     ctx.font="500 26px Arial, sans-serif";
     ctx.textAlign="center";
     ctx.textBaseline="middle";
     const words=c.name.split(" ");const lines:string[]=[];let line="";
     for(const word of words){const next=(line+" "+word).trim();if(next.length>19&&line){lines.push(line);line=word}else line=next}
     if(line)lines.push(line);
     lines.slice(0,3).forEach((text,j)=>ctx.fillText(text,256,25+j*33,500));
     const texture=new THREE.CanvasTexture(canvas);textures.push(texture);
     const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false,depthTest:false}));
     sprite.scale.set(53,13,1);
     sprite.position.set(0,-12,0);
     group.add(sprite);
    }
    nodes.set(c.id,group);scene.add(group);
   });
   const lineMaterials:InstanceType<typeof THREE.LineBasicMaterial>[]=[];
   const lineGeometries:InstanceType<typeof THREE.BufferGeometry>[]=[];
   edges.forEach(edge=>{
    const a=nodes.get(edge.source),b=nodes.get(edge.target);
    if(!a||!b)return;
    const geo=new THREE.BufferGeometry().setFromPoints([a.position,b.position]);
    const mat=new THREE.LineBasicMaterial({color:0x7897c5,transparent:true,opacity:0.32,depthWrite:false});
    const line=new THREE.Line(geo,mat);
    scene.add(line);lineGeometries.push(geo);lineMaterials.push(mat);
   });
   const raycaster=new THREE.Raycaster();const pointer=new THREE.Vector2();
   let downX=0,downY=0;
   const onDown=(e:PointerEvent)=>{downX=e.clientX;downY=e.clientY};
   const onUp=(e:PointerEvent)=>{
    if(Math.hypot(e.clientX-downX,e.clientY-downY)>6)return;
    const rect=renderer.domElement.getBoundingClientRect();
    pointer.set(((e.clientX-rect.left)/rect.width)*2-1,-((e.clientY-rect.top)/rect.height)*2+1);
    raycaster.setFromCamera(pointer,camera);
    const hits=raycaster.intersectObjects(hitTargets,false);
    const id=hits[0]?.object.userData.conceptId as string|undefined;
    if(id){const concept=concepts.find(c=>c.id===id);if(concept){setActive(concept);setQuery("");focus(id)}}
   };
   renderer.domElement.addEventListener("pointerdown",onDown);
   renderer.domElement.addEventListener("pointerup",onUp);
   let targetCamera:InstanceType<typeof THREE.Vector3>|null=null;
   let targetLook:InstanceType<typeof THREE.Vector3>|null=null;
   function focus(id:string){
    const node=nodes.get(id);if(!node)return;
    const p=node.position;
    const outward=p.clone().normalize();
    targetCamera=p.clone().addScaledVector(outward,85);
    targetLook=p.clone();
   }
   function reset(){targetCamera=new THREE.Vector3(0,0,460);targetLook=new THREE.Vector3(0,0,0)}
   const resize=()=>{
    const w=Math.max(1,el.clientWidth),h=Math.max(1,el.clientHeight);
    camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);
   };
   const observer=new ResizeObserver(resize);observer.observe(el);resize();
   let frame=0;
   const render=()=>{
    if(targetCamera&&targetLook){
     camera.position.lerp(targetCamera,0.09);
     controls.target.lerp(targetLook,0.09);
     if(camera.position.distanceTo(targetCamera)<0.3&&controls.target.distanceTo(targetLook)<0.3){targetCamera=null;targetLook=null}
    }
    controls.update();renderer.render(scene,camera);frame=requestAnimationFrame(render);
   };
   render();
   stop=()=>{
    cancelAnimationFrame(frame);observer.disconnect();
    renderer.domElement.removeEventListener("pointerdown",onDown);
    renderer.domElement.removeEventListener("pointerup",onUp);
    controls.dispose();geometry.dispose();
    for(const obj of hitTargets)(obj.material as InstanceType<typeof THREE.MeshBasicMaterial>).dispose();
    for(const texture of textures)texture.dispose();
    scene.traverse(obj=>{if(obj instanceof THREE.Sprite)(obj.material as InstanceType<typeof THREE.SpriteMaterial>).dispose()});
    lineGeometries.forEach(g=>g.dispose());lineMaterials.forEach(m=>m.dispose());
    renderer.dispose();renderer.domElement.remove();
   };
   controller.current={focus,reset,dispose:stop};
   setReady(true);
  })().catch(error=>{console.error("Unable to initialize 3D universe",error)});
  return ()=>{disposed=true;stop?.();controller.current=null};
 },[]);
 function focusConcept(c:Concept){setActive(c);setQuery("");controller.current?.focus(c.id)}
 function reset(){setActive(null);controller.current?.reset()}
 const httpConceptIds=new Set(["http","https","http-1-1","http-2","http-3","tcp","tls","quic"]);
 const showHttpLab=!!active&&httpConceptIds.has(active.id);
 return <div className="shell">
  <div className="starfield" aria-hidden="true"/>
  <header className="topbar"><button className="brand" onClick={reset}><span className="brand-icon">✧</span> Engineering <strong>Universe</strong></button><nav className="eu-home-nav" aria-label="Explore platform"><a href="/explore">Concepts</a><a href="/simulations">Simulations</a><a href="/learn">Learning paths</a></nav><a className="github" href="https://github.com/ksrilal/engineering-universe" target="_blank" rel="noreferrer">GitHub ↗</a></header>
  <section className="hero"><div className="eyebrow">INTERACTIVE ENGINEERING KNOWLEDGE GRAPH</div><h1>Everything is <em>connected.</em></h1><p>Explore networking, security, software, cloud and DevOps in one living universe.</p>
   <div className="search-wrap"><span className="search-icon">⌕</span><input aria-label="Search engineering concepts" placeholder="Search TCP, OAuth, Kubernetes, streaming..." value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&matches[0])focusConcept(matches[0]);if(e.key==="Escape")setQuery("")}}/><kbd>↵</kbd>
   {matches.length>0&&<div className="suggestions">{matches.map(c=><button key={c.id} onClick={()=>focusConcept(c)}><span className="dot" style={{background:colors[c.domain]}}/>{c.name}<small>{c.domain}</small></button>)}</div>}</div>
  </section>
  <div className="graph-container" ref={mount} aria-label="Interactive three-dimensional network of connected engineering concepts"/>
  {!ready&&<div className="loading">Loading knowledge universe…</div>}
  <div className="legend">{Object.entries(colors).map(([name,color])=><span key={name}><i style={{background:color}}/>{name}</span>)}</div>
  <div className="hint">Drag to rotate · Scroll to zoom · Click a node to explore</div>
  {active&&<aside className="detail"><button className="close" aria-label="Close concept details" onClick={reset}>×</button><span className="tag" style={{color:colors[active.domain]}}>{active.domain}</span><h2>{active.name}</h2><p>{active.description}</p><h3>Connected concepts</h3><div className="related">{concepts.filter(c=>active.links.includes(c.id)||c.links.includes(active.id)).map(c=><button key={c.id} onClick={()=>focusConcept(c)}>{c.name} ↗</button>)}</div><div className="coming eu-detail-actions">{showHttpLab&&<Link className="eu-action-link eu-action-primary" href="/simulations/http-request"><span className="eu-action-icon">▶</span><span><strong>Explore HTTP request</strong><small>Interactive 3D simulation</small></span><span aria-hidden="true">↗</span></Link>}<Link className="eu-action-link eu-action-secondary" href={`/concepts/${active.id}`}><span className="eu-action-icon">▤</span><span><strong>Learn {active.name}</strong><small>Concept details &amp; connections</small></span><span aria-hidden="true">→</span></Link><Link className="eu-action-link eu-action-quiet" href="/simulations">Browse all simulations →</Link></div></aside>}
 </div>;
}
