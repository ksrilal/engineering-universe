"use client";
import {useEffect,useRef,useState} from "react";
import type {ConceptScenario} from "../../core/simulation/concept-scenarios";
export function ConceptSimulation({scenario}:{scenario:ConceptScenario}){
 const [inspected,setInspected]=useState<number|null>(null),[openPacket,setOpenPacket]=useState(true),[step,setStep]=useState(0),[progress,setProgress]=useState(0),[playing,setPlaying]=useState(false),[speed,setSpeed]=useState(1),[failure,setFailure]=useState(false);
 const last=useRef<number|null>(null),frame=useRef(0);
 useEffect(()=>{
  if(!playing)return;
  const tick=(time:number)=>{
   if(last.current===null)last.current=time;
   const delta=Math.min(80,time-last.current);last.current=time;
   setProgress(p=>Math.min(1,p+delta*speed/1700));
   frame.current=requestAnimationFrame(tick);
  };
  frame.current=requestAnimationFrame(tick);
  return()=>{cancelAnimationFrame(frame.current);last.current=null};
 },[playing,speed]);
 useEffect(()=>{if(progress<1||!playing)return;if(step===scenario.stages.length-1){setPlaying(false);return}setStep(i=>i+1);setProgress(0)},[progress,playing,step,scenario.stages.length]);
 const current=scenario.stages[step];
 const locations=[{x:90,y:115},{x:280,y:55},{x:470,y:115},{x:280,y:230}];
 const a=locations[current.from],b=locations[current.to];
 const x=a.x+(b.x-a.x)*progress,y=a.y+(b.y-a.y)*progress;
 const change=(i:number)=>{setStep(i);setProgress(0);setPlaying(false);setInspected(null)};
 const target=inspected??current.to;
 const checks=current.checks||[];
 return <div className="eu-concept-sim">
  <div className="eu-lab-toolbar"><button onClick={()=>{if(progress===1&&step===scenario.stages.length-1){setStep(0);setProgress(0)}setPlaying(v=>!v)}}>{playing?"⏸ Pause":"▶ Auto play"}</button><button onClick={()=>change(Math.max(0,step-1))} disabled={step===0}>← Back</button><button onClick={()=>change(Math.min(scenario.stages.length-1,step+1))} disabled={step===scenario.stages.length-1}>Next →</button><button onClick={()=>change(0)}>↺ Reset</button><label>Speed <select value={speed} onChange={e=>setSpeed(Number(e.target.value))}><option value={0.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option></select></label></div>
  <div className="eu-concept-stage"><svg viewBox="0 0 560 295" role="img" aria-label={`Interactive architecture diagram for ${scenario.title}, showing ${scenario.actors.join(", ")}`}>
   <defs><linearGradient id="simline"><stop stopColor="#38bdf8"/><stop offset="1" stopColor="#a78bfa"/></linearGradient></defs>
   {scenario.stages.map((s,i)=>{const u=locations[s.from],v=locations[s.to];return <line key={i} x1={u.x} y1={u.y} x2={v.x} y2={v.y} stroke={i===step?"#67e8f9":"#37516f"} strokeWidth={i===step?3:1.5} strokeDasharray={i===step?"":"5 5"} opacity={i===step?1:0.65}/>})}
   {locations.map((p,i)=><g key={i}><circle cx={p.x} cy={p.y} r="35" fill="#122b4a" stroke={current.from===i||current.to===i?"#67e8f9":"#527398"} strokeWidth="2"/><text x={p.x} y={p.y+10} textAnchor="middle" fontSize="27">{scenario.icons?.[i]||"●"}</text><circle cx={p.x+28} cy={p.y-27} r="8" fill={current.to===i?"#22d3ee":"#334155"}/><text x={p.x+28} y={p.y-24} fill="#fff" fontSize="9" textAnchor="middle">{i+1}</text><text x={p.x} y={p.y+47} fill="#e2e8f0" fontSize="12" textAnchor="middle">{scenario.actors[i]}</text></g>)}
   <g transform={`translate(${x},${y})`}><rect x="-15" y="-13" width="30" height="26" rx="5" fill={failure?"#fb7185":"#f8fafc"} stroke="#38bdf8" strokeWidth="2"/><path d="M-8 -5H8M-8 0H8M-8 5H3" stroke="#0e2948" strokeWidth="2"/></g>
   <text x="280" y="287" textAnchor="middle" fill="#94a3b8" fontSize="11">Illustrative system flow · not measured network activity</text>
  </svg><div className="eu-concept-signal"><strong>{current.signal}</strong><span>{failure?"Failure branch: operation did not complete":"Active stage: "+current.title}</span></div></div>
  <div className="eu-node-inspector"><div className="eu-inspector-heading"><h2>Inside the nodes</h2><p>Select a node to inspect what it receives, checks and produces.</p></div><div className="eu-inspector-nodes">{scenario.actors.map((actor,i)=><button key={i} type="button" className={target===i?"selected":""} onClick={()=>{setInspected(i);setOpenPacket(true)}}><span>{scenario.icons?.[i]||"●"}</span><strong>{actor}</strong><small>{i===current.to?"Receiving this step":"Inspect node"}</small></button>)}</div><div className="eu-inspector-content"><section className="eu-packet-envelope"><button className="eu-packet-toggle" onClick={()=>setOpenPacket(v=>!v)} aria-expanded={openPacket}><span>📄</span><strong>{current.signal}</strong><span>{openPacket?"Close message ▴":"Open message ▾"}</span></button>{openPacket&&<div className="eu-packet-fields"><div><span>FROM</span><strong>{scenario.actors[current.from]}</strong></div><div><span>TO</span><strong>{scenario.actors[current.to]}</strong></div>{(current.fields||[]).map(([key,value])=><div key={key}><span>{key.toUpperCase()}</span><strong>{value}</strong></div>)}<div><span>STATUS</span><strong>{failure?"Failed / blocked":"Illustrative transfer"}</strong></div></div>}</section><section className="eu-node-checks"><h3>{scenario.icons?.[target]} {scenario.actors[target]} — checks</h3>{target===current.to?<ol>{checks.map((check,i)=><li key={i}><span className={failure&&i===checks.length-1?"failed":"passed"}>{failure&&i===checks.length-1?"✕":"✓"}</span>{check}</li>)}</ol>:<p>This node is not the receiver in the selected step. Select a stage targeting this node to inspect its processing checks.</p>}<p className="eu-inspector-footnote">{failure?current.failureReason:"These are illustrative checks for this domain; the actual behavior depends on the specific protocol and configuration."}</p></section></div></div><div className="eu-concept-stage-list">{scenario.stages.map((s,i)=><button key={i} className={i===step?"active":""} onClick={()=>change(i)}><small>0{i+1}</small>{s.title}</button>)}</div>
  <div className="eu-lab-details"><section className="eu-panel"><small>STEP {step+1} / {scenario.stages.length}</small><h2>{current.title}</h2><p>{current.description}</p><label className="eu-failure-toggle"><input type="checkbox" checked={failure} onChange={e=>{setFailure(e.target.checked);setPlaying(false)}}/> Simulate failed operation</label>{failure&&<p role="status">The operation fails at this stage. Investigate error handling, retry policy, observability and recovery appropriate to this concept. The diagram does not assume automatic retry.</p>}</section><section className="eu-panel"><h2>Flow activity</h2><p>Relative illustrative activity per stage (arbitrary units, not measurements).</p><div className="eu-sim-bars">{scenario.stages.map((s,i)=><div key={i}><span>{s.title}</span><div><i style={{width:`${s.metric/8}%`,background:i===step?"#67e8f9":"#3c6389"}}/></div><strong>{s.metric}</strong></div>)}</div><p><strong>Model limitations:</strong> {scenario.limitations}</p></section></div>
 </div>
}
