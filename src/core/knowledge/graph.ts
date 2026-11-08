import type {Concept,ConceptId,KnowledgeGraph,Relationship,RelationshipType} from "./types";
export class KnowledgeGraphService {
 private nodes:Map<ConceptId,Concept>;
 private adjacency:Map<ConceptId,Relationship[]>;
 constructor(readonly graph:KnowledgeGraph){
  this.nodes=new Map(graph.concepts.map(c=>[c.id,c]));
  if(this.nodes.size!==graph.concepts.length)throw new Error("Duplicate concept IDs");
  this.adjacency=new Map(graph.concepts.map(c=>[c.id,[]]));
  for(const r of graph.relationships){
   if(!this.nodes.has(r.source)||!this.nodes.has(r.target))throw new Error("Dangling relationship: "+r.id);
   this.adjacency.get(r.source)!.push(r);
   if(r.source!==r.target)this.adjacency.get(r.target)!.push(r);
  }
 }
 get(id:ConceptId){return this.nodes.get(id)}
 search(query:string,limit=20):Concept[]{
  const q=query.trim().toLowerCase();if(!q)return [];
  return [...this.nodes.values()].map(c=>({c,score:c.name.toLowerCase()===q?0:c.name.toLowerCase().startsWith(q)?1:c.name.toLowerCase().includes(q)?2:c.tags.some(t=>t.toLowerCase().includes(q))?3:c.summary.toLowerCase().includes(q)?4:99})).filter(x=>x.score<99).sort((a,b)=>a.score-b.score||a.c.name.localeCompare(b.c.name)).slice(0,limit).map(x=>x.c);
 }
 neighbors(id:ConceptId,type?:RelationshipType):Concept[]{
  const ids=new Set((this.adjacency.get(id)||[]).filter(r=>!type||r.type===type).map(r=>r.source===id?r.target:r.source));
  return [...ids].map(x=>this.nodes.get(x)!).filter(Boolean);
 }
 relationships(id:ConceptId){return [...(this.adjacency.get(id)||[])]}
}
