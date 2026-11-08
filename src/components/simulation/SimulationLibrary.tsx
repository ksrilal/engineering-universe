"use client";
import {useState} from "react";
import type {SimulationDefinition} from "../../core/simulation/types";
import {SimulationTimeline} from "./SimulationTimeline";
export function SimulationLibrary({definitions}:{definitions:SimulationDefinition[]}){const [selected,setSelected]=useState(definitions[0]?.id||"");const definition=definitions.find(d=>d.id===selected);return <><label htmlFor="sim-picker">Choose a scenario</label><select id="sim-picker" value={selected} onChange={e=>setSelected(e.target.value)} className="eu-picker">{definitions.map(d=><option key={d.id} value={d.id}>{d.title}</option>)}</select>{definition&&<SimulationTimeline key={definition.id} definition={definition}/>}</>}
