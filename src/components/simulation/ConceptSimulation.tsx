"use client";
import {useEffect,useRef,useState} from "react";
import type {ConceptScenario} from "../../core/simulation/concept-scenarios";
export function ConceptSimulation({scenario}:{scenario:ConceptScenario}){
 const [step,setStep]=useState(0),[progress,setProgress]=useState(0),[playing,setPlaying]=useState(false),[speed,setSpeed]=useState(1),[failure,setFailure]=useState(false);
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
 const change=(i:number)=>{setStep(i);setProgress(0);setPlaying(false)};
 return <div className="eu-concept-sim">
  <div className="eu-lab-toolbar"><button onClick={()=>{if(progress===1&&step===scenario.stages.length-1){setStep(0);setProgress(0)}setPlaying(v=>!v)}}>{playing?"⏸ Pause":"▶ Auto play"}</button><button onClick={()=>change(Math.max(0,step-1))} disabled={step===0}>← Back</button><button onClick={()=>change(Math.min(scenario.stages.length-1,step+1))} disabled={step===scenario.stages.length-1}>Next →</button><button onClick={()=>change(0)}>↺ Reset</button><label>Speed <select value={speed} onChange={e=>setSpeed(Number(e.target.value))}><option value={0.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option></select></label></div>
  <div className="eu-concept-stage"><svg viewBox="0 0 560 295" role="img" aria-label={`Interactive architecture diagram for ${scenario.title}, showing ${scenario.actors.join(", ")}`}>
   <defs><linearGradient id="simline"><stop stopColor="#38bdf8"/><stop offset="1" stopColor="#a78bfa"/></linearGradient></defs>
   {scenario.stages.map((s,i)=>{const u=locations[s.from],v=locations[s.to];return <line key={i} x1={u.x} y1={u.y} x2={v.x} y2={v.y} stroke={i===step?"#67e8f9":"#37516f"} strokeWidth={i===step?3:1.5} strokeDasharray={i===step?"":"5 5"} opacity={i===step?1:0.65}/>})}
   {locations.map((p,i)=><g key={i}><circle cx={p.x} cy={p.y} r="30" fill="#122b4a" stroke={current.from===i||current.to===i?"#67e8f9":"#527398"} strokeWidth="2"/><circle cx={p.x} cy={p.y} r="9" fill={["#38bdf8","#a78bfa","#34d399","#fbbf24"][i]}/><text x={p.x} y={p.y+47} fill="#e2e8f0" fontSize="12" textAnchor="middle">{scenario.actors[i]}</text></g>)}
   <circle cx={x} cy={y} r="8" fill={failure?"#fb7185":"#ffffff"} stroke="#38bdf8" strokeWidth="3"/>
   <text x="280" y="287" textAnchor="middle" fill="#94a3b8" fontSize="11">Illustrative system flow · not measured network activity</text>
  </svg><div className="eu-concept-signal"><strong>{current.signal}</strong><span>{failure?"Failure branch: operation did not complete":"Active stage: "+current.title}</span></div></div>
  <div className="eu-concept-stage-list">{scenario.stages.map((s,i)=><button key={i} className={i===step?"active":""} onClick={()=>change(i)}><small>0{i+1}</small>{s.title}</button>)}</div>
  <div className="eu-lab-details"><section className="eu-panel"><small>STEP {step+1} / {scenario.stages.length}</small><h2>{current.title}</h2><p>{current.description}</p><label className="eu-failure-toggle"><input type="checkbox" checked={failure} onChange={e=>{setFailure(e.target.checked);setPlaying(false)}}/> Simulate failed operation</label>{failure&&<p role="status">The operation fails at this stage. Investigate error handling, retry policy, observability and recovery appropriate to this concept. The diagram does not assume automatic retry.</p>}</section><section className="eu-panel"><h2>Activity chart</h2><p>Illustrative workload per stage (arbitrary units, not measurements).</p><div className="eu-sim-bars">{scenario.stages.map((s,i)=><div key={i}><span>{s.title}</span><div><i style={{width:`${s.metric/8}%`,background:i===step?"#67e8f9":"#3c6389"}}/></div><strong>{s.metric}</strong></div>)}</div><p><strong>Model limitations:</strong> {scenario.limitations}</p></section></div>
 </div>
}
