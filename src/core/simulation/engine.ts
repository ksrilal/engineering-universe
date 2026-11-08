import type {SimulationDefinition,SimulationSnapshot} from "./types";
export class SimulationEngine {
 readonly definition:SimulationDefinition;
 constructor(definition:SimulationDefinition){
  this.definition={...definition,events:[...definition.events].sort((a,b)=>a.atMs-b.atMs)};
  if(definition.durationMs<0)throw new Error("Invalid simulation duration");
  const actorIds=new Set(definition.actors.map(a=>a.id));
  if(actorIds.size!==definition.actors.length)throw new Error("Duplicate actor IDs");
  for(const e of definition.events){
   if(e.atMs<0||e.atMs>definition.durationMs)throw new Error("Event outside simulation timeline: "+e.id);
   if((e.from&&!actorIds.has(e.from))||(e.to&&!actorIds.has(e.to)))throw new Error("Unknown simulation actor: "+e.id);
  }
 }
 snapshot(elapsedMs:number):SimulationSnapshot{
  const elapsed=Math.max(0,Math.min(this.definition.durationMs,elapsedMs));
  const events=this.definition.events.filter(e=>e.atMs<=elapsed);
  const state:Record<string,string|number|boolean>={};
  for(const e of events)if(e.state)Object.assign(state,e.state);
  return {elapsedMs:elapsed,index:events.length,events,state,complete:elapsed>=this.definition.durationMs};
 }
 step(index:number):SimulationSnapshot{
  if(index<=0)return this.snapshot(0);
  const event=this.definition.events[Math.min(index-1,this.definition.events.length-1)];
  return this.snapshot(event?.atMs??0);
 }
}
