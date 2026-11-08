"use client";
import {useMemo,useState} from "react";
import type {SimulationDefinition} from "../../core/simulation/types";
import {SimulationEngine} from "../../core/simulation/engine";
import {Panel} from "../ui/Panel";
export function SimulationTimeline({definition}:{definition:SimulationDefinition}){
 const engine=useMemo(()=>new SimulationEngine(definition),[definition]);
 const [index,setIndex]=useState(0);
 const event=definition.events[index-1];
 const snapshot=engine.step(index);
 return <Panel title={definition.title}><p>{definition.summary}</p><div className="eu-timeline-controls"><button onClick={()=>setIndex(0)} disabled={index===0}>Reset</button><button onClick={()=>setIndex(x=>Math.max(0,x-1))} disabled={index===0}>Previous</button><button onClick={()=>setIndex(x=>Math.min(definition.events.length,x+1))} disabled={index===definition.events.length}>Next step</button></div><p>Step {index} / {definition.events.length}</p><progress max={definition.events.length} value={index} style={{width:"100%"}}/><div aria-live="polite">{event?<><h3>{event.label}</h3><p>{event.description}</p><small>{event.from||"System"} → {event.to||"System"} · {snapshot.elapsedMs} ms (illustrative)</small></>:<p>Select Next step to begin.</p>}</div></Panel>
}
