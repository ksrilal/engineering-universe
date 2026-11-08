"use client";
import {useEffect,useRef,useState} from "react";
import {httpActors,httpSteps} from "../../data/http-request-scenario";
import {HttpNetworkScene} from "./HttpNetworkScene";
export function HttpRequestLab(){
 const [index,setIndex]=useState(-1),[progress,setProgress]=useState(0),[playing,setPlaying]=useState(false),[speed,setSpeed]=useState(1);
 const frame=useRef(0),last=useRef<number|null>(null);
 useEffect(()=>{
  if(!playing||index<0||index>=httpSteps.length)return;
  const tick=(now:number)=>{
   if(last.current===null)last.current=now;
   const delta=Math.min(100,now-last.current);last.current=now;
   setProgress(p=>Math.min(1,p+delta*speed/httpSteps[index].duration));
   frame.current=requestAnimationFrame(tick);
  };
  frame.current=requestAnimationFrame(tick);
  return()=>{cancelAnimationFrame(frame.current);last.current=null};
 },[playing,index,speed]);
 useEffect(()=>{
  if(progress<1||!playing)return;
  if(index===httpSteps.length-1){setPlaying(false);return}
  setIndex(i=>i+1);setProgress(0);
 },[progress,index,playing]);
 const next=()=>{setPlaying(false);setIndex(i=>Math.min(httpSteps.length-1,i+1));setProgress(0)};
 const prev=()=>{setPlaying(false);setIndex(i=>Math.max(0,i-1));setProgress(0)};
 const reset=()=>{setPlaying(false);setIndex(-1);setProgress(0)};
 const current=index>=0?httpSteps[index]:null;
 const completed=Math.max(0,index)+(progress>=1?1:0);
 return <div className="eu-lab">
  <div className="eu-lab-toolbar"><button onClick={()=>{if(index<0){setIndex(0);setProgress(0)}setPlaying(p=>!p)}}>{playing?"Pause":"▶ Auto play"}</button><button onClick={prev} disabled={index<=0}>← Back</button><button onClick={next} disabled={index>=httpSteps.length-1}>Next step →</button><button onClick={reset}>Reset</button><label>Speed <select value={speed} onChange={e=>setSpeed(Number(e.target.value))}><option value={0.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option></select></label></div>
  <div className="eu-lab-stage"><HttpNetworkScene stepIndex={index} progress={progress}/><div className="eu-lab-overlay"><strong>{current?.title||"Click Auto play or Next step"}</strong><p>{current?.packet||"Follow an HTTPS request from the button click to the rendered result."}</p><span>{current?.protocol||"HTTP request lifecycle"}</span></div></div>
  <div className="eu-lab-steps">{httpSteps.map((s,i)=><button key={s.id} onClick={()=>{setPlaying(false);setIndex(i);setProgress(0)}} aria-current={index===i?"step":undefined} className={index===i?"active":""} title={s.title}>{i+1}</button>)}</div>
  <progress value={completed+(index>=0?progress:0)} max={httpSteps.length} style={{width:"100%"}}/>
  <div className="eu-lab-details" aria-live="polite"><section className="eu-panel"><small>{current? `STEP ${index+1} / ${httpSteps.length}`:"READY"}</small><h2>{current?.title||"HTTP request: click to response"}</h2><p>{current?.detail||"Start the guided simulation to see how a user action becomes an encrypted HTTP request and response."}</p><p><strong>Protocol:</strong> {current?.protocol||"HTTP/2 over TLS 1.3 and TCP/IP"}</p><p><strong>Layer:</strong> {current?.layer||"Multiple layers"}</p><p><strong>Note:</strong> {current?.note||"This is an educational model, not a packet capture."}</p></section><section className="eu-panel"><h2>Packet and message inspector</h2><div className="eu-packet-card"><span>Source</span><strong>{httpActors.find(a=>a.id===current?.from)?.label||"—"}</strong><span>Destination</span><strong>{httpActors.find(a=>a.id===current?.to)?.label||"—"}</strong><span>Payload / control message</span><strong>{current?.packet||"—"}</strong><span>Illustrative bytes</span><strong>{current?.size||"Not applicable"}</strong></div><h3>Transfer sizes by stage</h3><div className="eu-packet-chart" aria-label="Illustrative message size chart">{httpSteps.filter(s=>s.size>0).map(s=><div key={s.id}><span>{s.id}</span><div style={{width:`${Math.max(4,s.size/2200*100)}%`}}/><small>{s.size} B</small></div>)}</div><small>Sizes are teaching examples, not observed packet sizes.</small></section></div>
 </div>
}
